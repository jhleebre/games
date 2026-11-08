// 게임 목록. 새 게임을 만들면 이 배열에 항목 하나를 추가하세요. (README의 "게임 추가하기" 참고)
//
// id        영문 소문자 식별자 (GitHub 저장소 이름과 같게)
// title     화면에 보일 이름
// tagline   카드에 보일 한 줄 소개
// about     자세히 보기 창의 설명
// genre     장르 (필터 칩으로 자동 생성됨)
// dim       '2D' 또는 '3D'
// added     추가한 날짜 (YYYY-MM-DD, 정렬과 NEW 표시에 사용)
// url       플레이 주소
// repo      소스 저장소 주소
// cover     표지 이미지 (assets/covers/<id>.jpg, 없으면 자동으로 픽셀 표지를 그림)
// accent    카드 강조색
// touch     터치 기기 지원 여부
// features  자세히 보기 창의 특징 목록
// keys      조작법 [키 목록, 동작]
window.GAMES = [
  {
    id: 'tetris',
    title: '별조각 쌓기',
    tagline: '떨어지는 별조각을 맞춰 가로줄을 지우는 낙하 블록 퍼즐',
    about: '우주에서 떨어지는 일곱 가지 별조각 블록을 맞춰 가로줄을 채우고 지웁니다. 한 번에 여러 줄을 지우거나 콤보를 이어 갈수록 점수가 커지고, 판을 완전히 비우면 큰 보너스가 있습니다.',
    genre: '퍼즐',
    dim: '2D',
    added: '2026-11-08',
    url: 'https://jhleebre.github.io/tetris/',
    repo: 'https://github.com/jhleebre/tetris',
    cover: 'assets/covers/tetris.jpg',
    accent: '#3fe4ff',
    touch: true,
    features: ['모드 4가지: 마라톤 · 40줄 · 2분 · 청소', '보관, 다음 블록 5개 미리보기, 착지 그림자', '합성 배경음악 (레벨이 오르면 빨라짐)', '모드별 최고 기록 저장'],
    keys: [
      [['←', '→'], '좌우로 움직이기'],
      [['↓'], '10칸 내리기'],
      [['↑', 'Z'], '회전'],
      [['스페이스'], '바로 내리기'],
      [['C'], '보관'],
      [['Esc'], '일시정지 · 메뉴'],
    ],
  },
  {
    id: 'starship',
    title: '스타쉽 질주',
    tagline: '우주에 떠 있는 길을 따라 끝까지 날아가는 3D 레이싱',
    about: '우주에 떠 있는 길 위로 우주선을 몰아 결승선까지 날아갑니다. 틈은 점프로 뛰어넘고 벽은 옆으로 피하며, 연료가 바닥나기 전에 초록 연료 칸을 챙겨야 합니다.',
    genre: '레이싱',
    dim: '3D',
    added: '2026-11-08',
    url: 'https://jhleebre.github.io/starship/',
    repo: 'https://github.com/jhleebre/starship',
    cover: 'assets/covers/starship.jpg',
    accent: '#ffd23f',
    touch: true,
    features: ['9개 단계, 단계마다 중력 · 속도 · 연료가 다름', '가속 · 감속 · 연료 · 불바닥 · 도약대 바닥', '단계별 최고 기록 저장'],
    keys: [
      [['←', '→'], '좌우로 움직이기'],
      [['↑', '↓'], '가속 / 감속'],
      [['스페이스'], '점프'],
      [['R'], '다시 시작'],
      [['Esc'], '일시정지 · 메뉴'],
      [['M'], '소리 켜기/끄기'],
    ],
  },
  {
    id: 'sky-tower',
    title: '하늘끝 탑 3D',
    tagline: '10층 블록 탑을 꼭대기까지 오르는 3D 점프 액션',
    about: '층마다 새로운 블록이나 함정이 하나씩 나오는 10층 탑을 꼭대기까지 올라갑니다. 깃발 바닥에 도착하면 아래 구멍이 메워져, 그 층에서 떨어져도 깃발 바닥에서 다시 시작합니다.',
    genre: '플랫포머',
    dim: '3D',
    added: '2026-11-05',
    url: 'https://jhleebre.github.io/sky-tower/',
    repo: 'https://github.com/jhleebre/sky-tower',
    cover: 'assets/covers/sky-tower.jpg',
    accent: '#3ee0a1',
    touch: true,
    features: ['10개 층: 움직이는 다리, 얼음, 젤리, 용암, 가시, 불덩이', '난이도 3단계', '시점 3가지 (1인칭 · 어깨 · 멀리)'],
    keys: [
      [['←', '→'], '몸 방향 돌리기'],
      [['↑', '↓'], '앞으로 / 뒤로'],
      [['스페이스'], '점프'],
      [['V'], '시점 바꾸기'],
      [['Esc'], '메뉴'],
    ],
  },
];
