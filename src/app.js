(() => {
  const games = (window.GAMES || []).slice();
  const $ = (s) => document.querySelector(s);
  const grid = $('#grid');
  const chips = $('#chips');
  const sortSel = $('#sort');
  const dialog = $('#detail');
  const NEW_DAYS = 14;
  const state = { genre: '전체', sort: 'new' };

  try {
    const saved = JSON.parse(localStorage.getItem('arcade:view') || '{}');
    if (saved.sort) state.sort = saved.sort;
    if (saved.genre) state.genre = saved.genre;
  } catch (e) {}
  sortSel.value = state.sort;

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const daysSince = (d) => (Date.now() - new Date(d + 'T00:00:00').getTime()) / 864e5;
  const isNew = (g) => daysSince(g.added) <= NEW_DAYS;

  // header numbers
  $('#count').textContent = String(games.length).padStart(2, '0');
  const latest = games.map((g) => g.added).sort().pop();
  if (latest) $('#updated').textContent = latest.replaceAll('-', '.');

  // ---------- pixel cover fallback (for games without a cover image) ----------
  function hash(str) {
    let h = 2166136261;
    for (const c of str) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
    return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) ^ Math.imul(h ^ (h >>> 13), 3266489909)) >>> 0) / 4294967296;
  }
  function pixelCover(g) {
    const W = 64, H = 40, cv = document.createElement('canvas');
    cv.width = W; cv.height = H;
    const x = cv.getContext('2d'), r = hash(g.id);
    const sky = x.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, '#05061a'); sky.addColorStop(1, '#1d2366');
    x.fillStyle = sky; x.fillRect(0, 0, W, H);
    for (let i = 0; i < 40; i++) { x.fillStyle = r() > 0.8 ? g.accent : '#ffffff'; x.globalAlpha = 0.3 + r() * 0.7; x.fillRect((r() * W) | 0, (r() * H * 0.7) | 0, 1, 1); }
    x.globalAlpha = 1;
    for (let c = 0; c < W; c += 4) {
      const h = 4 + ((r() * 14) | 0);
      x.fillStyle = g.accent; x.globalAlpha = 0.35 + r() * 0.5;
      x.fillRect(c, H - h, 3, h);
    }
    x.globalAlpha = 1;
    return cv;
  }
  function coverEl(g) {
    if (!g.cover) return pixelCover(g);
    const img = new Image();
    img.src = g.cover; img.alt = ''; img.loading = 'lazy'; img.decoding = 'async';
    img.onerror = () => img.replaceWith(pixelCover(g));
    return img;
  }

  // ---------- genre chips ----------
  function renderChips() {
    const counts = games.reduce((m, g) => ((m[g.genre] = (m[g.genre] || 0) + 1), m), {});
    const list = [['전체', games.length], ...Object.entries(counts).sort((a, b) => a[0].localeCompare(b[0], 'ko'))];
    if (!list.some(([n]) => n === state.genre)) state.genre = '전체';
    chips.innerHTML = list.map(([n, c]) => `<button class="chip" data-g="${esc(n)}" aria-pressed="${n === state.genre}">${esc(n)}<b>${c}</b></button>`).join('');
  }
  chips.addEventListener('click', (e) => {
    const b = e.target.closest('.chip');
    if (!b) return;
    state.genre = b.dataset.g;
    save(); renderChips(); renderGrid();
  });
  sortSel.addEventListener('change', () => { state.sort = sortSel.value; save(); renderGrid(); });
  function save() { try { localStorage.setItem('arcade:view', JSON.stringify(state)); } catch (e) {} }

  // ---------- cards ----------
  function visible() {
    const list = games.filter((g) => state.genre === '전체' || g.genre === state.genre);
    if (state.sort === 'name') list.sort((a, b) => a.title.localeCompare(b.title, 'ko'));
    else list.sort((a, b) => b.added.localeCompare(a.added) || games.indexOf(a) - games.indexOf(b));
    return list;
  }
  function renderGrid() {
    const list = visible();
    grid.innerHTML = '';
    if (!list.length) grid.innerHTML = '<li class="empty">이 장르의 게임이 아직 없습니다.</li>';
    for (const g of list) {
      const li = document.createElement('li');
      li.className = 'card';
      li.tabIndex = 0;
      li.dataset.id = g.id;
      li.style.setProperty('--accent', g.accent);
      li.setAttribute('aria-label', `${g.title}, ${g.genre}`);
      li.innerHTML = `
        <a class="cover" href="${esc(g.url)}" tabindex="-1" aria-hidden="true"></a>
        <div class="info">
          <div class="tags"><span>${esc(g.genre)}</span><span>${esc(g.dim)}</span>${g.touch ? '<span>터치 지원</span>' : ''}</div>
          <h2>${esc(g.title)}</h2>
          <p>${esc(g.tagline)}</p>
          <div class="acts">
            <a class="btn play" href="${esc(g.url)}">▶ 플레이</a>
            <button class="btn ghost" data-more>자세히</button>
          </div>
        </div>`;
      const cover = li.querySelector('.cover');
      cover.append(coverEl(g));
      if (isNew(g)) cover.insertAdjacentHTML('beforeend', '<span class="new">NEW</span>');
      grid.append(li);
    }
    if (state.genre === '전체') {
      grid.insertAdjacentHTML('beforeend', `<li class="card soon" aria-hidden="true"><div><div class="q">?</div><b>다음 게임 준비 중<span class="cursor">_</span></b><small>PLAYER ${games.length + 1} READY</small></div></li>`);
    }
  }
  grid.addEventListener('click', (e) => {
    const more = e.target.closest('[data-more]');
    if (more) openDetail(more.closest('.card').dataset.id);
  });

  // ---------- detail ----------
  function openDetail(id) {
    const g = games.find((x) => x.id === id);
    if (!g) return;
    dialog.style.setProperty('--accent', g.accent);
    const c = $('#dCover'); c.innerHTML = ''; c.append(coverEl(g));
    $('#dMeta').textContent = `${g.genre} · ${g.dim} · ${g.added.replaceAll('-', '.')} 추가`;
    $('#dTitle').textContent = g.title;
    $('#dAbout').textContent = g.about || g.tagline;
    $('#dFeat').innerHTML = (g.features || []).map((f) => `<li>${esc(f)}</li>`).join('');
    $('#dKeys').innerHTML = (g.keys || []).map(([ks, a]) => `<tr><td>${ks.map((k) => `<kbd>${esc(k)}</kbd>`).join('')}</td><td>${esc(a)}</td></tr>`).join('');
    $('#dTouch').textContent = g.touch ? '터치 기기에서는 화면의 버튼으로 조작합니다.' : '키보드가 필요합니다.';
    $('#dPlay').href = g.url;
    $('#dRepo').href = g.repo;
    $('#dRepo').hidden = !g.repo;
    dialog.showModal();
    $('#dPlay').focus();
  }
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => {
    const card = grid.querySelector('.card.sel') || grid.querySelector(`.card[data-id]`);
    card && card.focus({ preventScroll: true });
  });

  // ---------- arcade keyboard navigation ----------
  const cards = () => [...grid.querySelectorAll('.card[data-id]')];
  const cols = () => getComputedStyle(grid).gridTemplateColumns.split(' ').length;
  function select(i) {
    const list = cards();
    if (!list.length) return;
    i = Math.max(0, Math.min(list.length - 1, i));
    list.forEach((c, k) => c.classList.toggle('sel', k === i));
    list[i].focus({ preventScroll: true });
    list[i].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
  grid.addEventListener('focusin', (e) => {
    const c = e.target.closest('.card[data-id]');
    if (c) cards().forEach((x) => x.classList.toggle('sel', x === c));
  });
  grid.addEventListener('focusout', (e) => {
    if (!grid.contains(e.relatedTarget)) cards().forEach((x) => x.classList.remove('sel'));
  });
  document.addEventListener('keydown', (e) => {
    if (dialog.open || e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.target.matches('select, input, textarea')) return;
    const list = cards();
    const cur = list.findIndex((c) => c.classList.contains('sel'));
    const step = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: cols(), ArrowUp: -cols() }[e.key];
    if (step) {
      e.preventDefault();
      select(cur < 0 ? 0 : cur + step);
      return;
    }
    if (cur < 0 || !list[cur].matches(':focus')) return;
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); location.href = games.find((g) => g.id === list[cur].dataset.id).url; }
    else if (e.key === 'i' || e.key === 'I') { e.preventDefault(); openDetail(list[cur].dataset.id); }
  });

  // ---------- starfield ----------
  const cv = $('#stars'), ctx = cv.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let stars = [], w = 0, h = 0;
  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    w = innerWidth; h = innerHeight;
    cv.width = w * dpr; cv.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round((w * h) / 5000);
    stars = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, z: Math.random(), t: Math.random() * 6 }));
  }
  const tints = ['#ffffff', '#ffffff', '#ffffff', '#3fe4ff', '#ffd23f', '#ff6fae'];
  function draw(t) {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#05061a'); g.addColorStop(1, '#0d1040');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      if (!reduce) { s.y += 0.08 + s.z * 0.5; if (s.y > h) { s.y = -2; s.x = Math.random() * w; } }
      const size = s.z > 0.92 ? 3 : s.z > 0.6 ? 2 : 1;
      ctx.globalAlpha = 0.35 + 0.65 * Math.abs(Math.sin(t / 900 + s.t)) * s.z + 0.15;
      ctx.fillStyle = tints[i % tints.length];
      ctx.fillRect(s.x | 0, s.y | 0, size, size);
    }
    ctx.globalAlpha = 1;
    if (!reduce) requestAnimationFrame(draw);
  }
  addEventListener('resize', resize);
  resize();
  requestAnimationFrame(draw);

  renderChips();
  renderGrid();
})();
