# 별빛 오락실 (games landing page)

Landing page for jhleebre's retro-style browser games. Live at https://jhleebre.github.io/games/, deployed by GitHub Pages from the root of `main` in `jhleebre/games`. No build step: plain HTML/CSS/JS. All user-facing text is Korean.

- `games.js` — the game list (`window.GAMES`). The only file to edit when adding a game. Field meanings are in its header comment.
- `assets/covers/<id>.jpg` — card covers, 16:10, about 800px wide, JPEG.
- `src/app.js`, `css/style.css`, `index.html` — the page itself. The header count, update date, genre chips and NEW badges all come from `games.js`, so they don't need edits.

Each game lives in its own sibling folder (`../<repo>`) and its own GitHub repo, deployed at `https://jhleebre.github.io/<repo>/`.

## Adding a game

When asked to add a game (e.g. "`../foo` 게임을 오락실에 추가해줘"):

1. **Read the game.** Read `../<repo>/README.md` and `index.html` for the Korean title, rules, controls, modes/levels and whether touch is supported. Confirm the repo remote with `git -C ../<repo> remote -v`, and check that `https://jhleebre.github.io/<repo>/` returns 200. If it isn't deployed yet, stop and tell the user.
2. **Add the entry.** Add an object to the top of `GAMES` in `games.js`:
   - `id` = repo name; `url` / `repo` from the repo name.
   - `added` = today's date (YYYY-MM-DD).
   - `genre`: reuse an existing genre name (퍼즐, 레이싱, 플랫포머…) when it fits, so the chips stay tidy.
   - `accent`: a bright color from the game's own palette that differs from the other cards.
   - `tagline` is one short line. `about` is 1–2 sentences. `features` is 2–4 items. `keys` has about 4–6 rows. Use the same tone as the existing entries.
3. **Make the cover.** Take a screenshot of gameplay, not the menu:
   - Copy the game to the scratchpad without `.git`.
   - Inject `<style>` before `</head>` that hides the menu/HUD overlays (look up their class names in the game's CSS).
   - Serve the copy with `python3 -m http.server 8765`. Use the game's `?autoplay` mode if it has one.
   - Capture with headless Chrome: `--headless=new --use-angle=swiftshader --enable-unsafe-swiftshader --hide-scrollbars --window-size=1280,800 --virtual-time-budget=<ms> --screenshot=...`.
   - macOS has no `timeout`, so wrap the Chrome call with `perl -e 'alarm shift; exec @ARGV' 50 ...`.
   - Convert with `sips -s format jpeg -s formatOptions 80 -Z 800 in.png --out assets/covers/<id>.jpg`.
   - Look at the image. Re-shoot if a menu, debug label or toast shows.
4. **Check it.** Serve this folder (`python3 -m http.server 8100`, or the `arcade` config in `.claude/launch.json`). Confirm the new card, cover, NEW badge, genre chip and 자세히 dialog render, the console has no errors, and the layout works at phone width.
5. **Ship it.** Update the game table in `README.md`. Commit (`Add <title> to the arcade`) and push to `main`. Then poll `gh api repos/jhleebre/games/pages --jq .status` until it is `built`, and confirm the live page shows the new game.
