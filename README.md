# 별빛 오락실

브라우저에서 바로 하는 레트로풍 웹 게임 모음입니다. 각 게임은 자기 저장소에서 GitHub Pages로 배포되고, 이 페이지는 그 게임들을 한곳에서 보고 고르는 랜딩 페이지입니다.

**▶ [오락실 입장](https://jhleebre.github.io/games/)**

| 게임 | 장르 | 저장소 |
| --- | --- | --- |
| [별조각 쌓기](https://jhleebre.github.io/tetris/) | 퍼즐 · 2D | [tetris](https://github.com/jhleebre/tetris) |
| [스타쉽 질주](https://jhleebre.github.io/starship/) | 레이싱 · 3D | [starship](https://github.com/jhleebre/starship) |
| [하늘끝 탑 3D](https://jhleebre.github.io/sky-tower/) | 플랫포머 · 3D | [sky-tower](https://github.com/jhleebre/sky-tower) |

## 기능

- 장르 필터(장르는 게임 목록에서 자동으로 모임)와 정렬(새로 나온 순 · 이름순). 고른 값은 브라우저에 기억됩니다.
- 추가한 지 14일이 안 된 게임에는 `NEW` 표시가 붙습니다.
- 카드의 **자세히**에서 설명 · 특징 · 조작법을 볼 수 있습니다.
- 오락실처럼 키보드로 고를 수 있습니다: `←` `→` `↑` `↓` 고르기, `Enter` 시작, `I` 자세히.

## 게임 추가하기

1. 새 게임 저장소를 GitHub Pages로 배포합니다. (`https://jhleebre.github.io/<저장소>/`)
2. [`games.js`](games.js)의 `GAMES` 배열에 항목을 하나 추가합니다. 각 필드의 뜻은 파일 맨 위 주석에 있습니다.
3. 표지 이미지를 `assets/covers/<id>.jpg`로 넣습니다. 16:10 비율, 가로 800px 정도면 충분합니다. 표지가 없거나 `cover`를 비워 두면 `accent` 색으로 픽셀 표지를 자동으로 그립니다.
4. 커밋하고 푸시하면 끝입니다. 상단의 게임 수와 업데이트 날짜, 장르 칩은 목록에서 자동으로 계산됩니다.

### 표지 이미지 만들기

메뉴 화면 대신 게임 장면이 보이도록 찍는 것이 좋습니다. Chrome 헤드리스로 찍을 수 있습니다(3D 게임은 SwiftShader로 렌더링).

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new \
  --use-angle=swiftshader --enable-unsafe-swiftshader --hide-scrollbars \
  --window-size=1280,800 --virtual-time-budget=8000 \
  --screenshot=cover.png "http://localhost:8000/?autoplay"
```

```bash
sips -s format jpeg -s formatOptions 80 -Z 800 cover.png --out assets/covers/<id>.jpg
```

메뉴 오버레이가 화면을 가리면 게임 폴더를 복사한 뒤 `index.html`의 `</head>` 앞에 `<style>.overlay,.hud{display:none!important}</style>`처럼 HUD를 숨기는 스타일을 넣고 찍습니다.

## 로컬 실행

```bash
python3 -m http.server 8100
```

그다음 `http://localhost:8100` 을 엽니다. 빌드 과정은 없습니다. 글꼴(Galmuri, Gowun Dodum)만 CDN에서 불러옵니다.

## 폴더 구조

```
index.html          화면 마크업
games.js            게임 목록 (새 게임은 여기에 추가)
css/style.css       스타일 (오락실 팔레트, 카드, 자세히 창)
src/app.js          목록 그리기, 필터·정렬, 자세히 창, 키보드 이동, 별 배경
assets/covers/      게임 표지 이미지
```
