# 머더 미스터리 GM 플랫폼

여러 머더 미스터리 게임을 정적 웹앱으로 운영하기 위한 GM 플랫폼입니다. 카탈로그에서 게임을 찾고, 상세 프리뷰를 확인한 뒤, 단일 슬라이드형 GM 화면으로 진입하는 구조를 사용합니다.

## 실행 방법
1. 정적 파일 서버로 프로젝트 루트를 실행합니다.
2. 브라우저에서 `/titles`에 접속합니다.
3. 게임 리스트에서 게임을 선택합니다.
4. 상세 화면에서 `입장`을 눌러 GM 화면으로 진입합니다.

`path` 기반 라우팅을 사용하므로, `index.html`을 파일로 직접 여는 방식보다는 로컬 서버나 Vercel 배포 주소로 확인하는 편이 맞습니다.

## 현재 구조
- 카탈로그 검색: `data/catalog.json`
- 게임 패키지: `games/<id>/game.json`
- 슬라이드 본문: `games/<id>/slides.html`
- 외부 규칙 데이터: `games/<id>/rules.json`
- 샘플 게임:
  - `분가`
  - `죄와 벌의 도서관`

## 핵심 기능
- 카탈로그 리스트 -> 상세 -> GM 진입 라우팅
  - `/titles`
  - `/titles/<routeName>`
  - `/titles/<routeName>/gm`
- 슬라이드 네비게이션
  - 버튼
  - 키보드 좌우키
  - 터치 스와이프
- 타이머
  - 기본 타이머
  - 플레이어별 탭 타이머
- 규칙 팝업
  - 책 아이콘 탭형 팝업
  - 페이지별 `i` 버튼 단일 규칙 팝업
- 게임별 동적 헤더 액션
  - `game.json > headerActions[]`
- 슬라이드 진행 확인 다이얼로그
  - `data-next-confirm-title`
  - `data-next-confirm-detail`
  - `data-next-confirm-note`
- 문의 모달
  - `권리자 삭제 요청`
  - `피드백`
  - `mailto:` 기반 메일 앱 열기

## 타이머 사용 방법
기본 타이머:

```html
<div class="timer-widget" data-timer-widget data-initial-seconds="180">
```

- `data-initial-seconds`: 기본 시간(초)

플레이어별 타이머:

```html
<div
  class="timer-widget"
  data-timer-widget
  data-timer-type="per-player"
  data-player-count="6"
  data-initial-seconds="60"
>
```

- `data-timer-type="per-player"`: 플레이어별 탭 타이머 활성화
- `data-player-count`: 생성할 플레이어 수
- `data-initial-seconds`: 각 플레이어에게 적용할 시간(초)
- 활성 탭은 검은 글자, 종료 탭은 회색 글자
- 한 플레이어 시간이 끝나면 해당 탭은 종료 상태가 되고, 다음 탭으로 자동 이동

## 스타일 구조
- `styles/base.css`: 리셋, 공통 타이포그래피, 기본 유틸리티
- `styles/layout.css`: 카탈로그/상세/GM 프레임 레이아웃
- `styles/components.css`: 카드, 타이머, 규칙 패널, 모달
- `styles/responsive.css`: 반응형 미디어 쿼리
- `styles/themes/default.css`: 기본 테마
- `styles/themes/<theme>.css`: 선택적인 게임 전용 테마 오버라이드

게임 전용 테마 파일이 없어도 앱은 `default.css`만으로 동작해야 합니다.

## 테마 적용 규칙
- `game.json`의 `theme` 값이 있으면 `styles/themes/<theme>.css`를 추가 로드합니다.
- `theme`가 없거나 `default`면 기본 테마만 적용합니다.
- 게임별 색상/분위기 차이는 가능하면 CSS 변수 override로 처리합니다.

## 슬라이드 진행 확인 규칙
- 특정 슬라이드에서 바로 다음 단계로 넘어가면 안 되는 경우, 슬라이드 요소에 확인용 `data-*` 속성을 선언합니다.
- 지원 속성:

```html
<section
  class="slide"
  data-next-confirm-title="모든 플레이어가 설정서를 읽었습니까?"
  data-next-confirm-detail="다음 단계로 넘어가면 자기소개를 시작합니다."
  data-next-confirm-note="준비가 끝났을 때만 확인을 눌러 주세요."
>
```

- 이 패턴은 게임별 JS 분기를 추가하지 않고도 `"다음으로 넘어가기 전 확인"`을 공통 처리하기 위한 규칙입니다.

## DOM/이벤트 작성 규칙
- 필수 DOM은 직접 참조합니다.
- 선택 DOM은 optional chaining 또는 존재 검사 후 사용합니다.

예:

```js
document.getElementById('detailBackBtn')?.addEventListener('click', () => this.navigateToCatalog());
```

- `detailBackBtn`처럼 화면에 없을 수도 있는 요소는 `?.`를 사용합니다.
- `gameList`, `slidesContainer`처럼 앱 핵심 요소는 조용히 무시하지 말고 필수 요소로 취급합니다.

## 테스트 / 순수 함수화
- 테스트 가능한 계산 로직은 `lib/pure-logic.js` 같은 순수 함수 모듈로 먼저 분리합니다.
- DOM 조작, `innerHTML`, `classList`, `document.getElementById(...)` 같은 브라우저 의존 코드는 가능한 한 마지막 렌더 단계에서만 사용합니다.
- 판단 로직은 순수 함수에서 계산하고, `app.js`는 그 결과를 화면에 반영하는 역할을 우선합니다.
- 현재 테스트 러너는 `Vitest`입니다.
- `npm test`는 verbose 리포터를 사용하므로, 테스트 이름과 통과/실패 여부를 터미널에서 바로 읽을 수 있습니다.
- 테스트 실행:

```bash
npm test
```

- 첫 테스트 세트는 `tests/pure-logic.test.mjs`에 있습니다.
- 테스트 이름은 개발자가 읽는 문장 기준으로 한국어로 작성합니다.
- 새 기능을 넣을 때는 “이 계산을 브라우저 없이 테스트할 수 있는가?”를 먼저 확인합니다.

## 문서
- [GM 운영 가이드](docs/GM-PLAYBOOK.md)
- [규칙 팝업 매핑](docs/RULES-MAPPING.md)
- [테스트 가이드](docs/TESTING-GUIDE.md)
- [문구/표기 가이드](docs/UI-WRITING-GUIDE.md)

## 보안 메모
- 현재는 정적 사이트 기준으로 `vercel.json`에 최소 보안 헤더를 적용합니다.
- 외부 스크립트, 외부 폰트, 외부 API를 추가할 때는 `Content-Security-Policy`를 함께 검토해야 합니다.
- 비밀값(API 키, 토큰, 비공개 메일 인증값 등)은 코드나 JSON 파일에 직접 넣지 않습니다.
- Vercel 배포에서 비밀값이 필요해지면 코드가 아니라 Environment Variables로 관리합니다.

## 검증
- `node --check app.js`
- 카탈로그 -> 상세 -> GM 진입 확인
- 게임별 규칙 팝업 및 헤더 액션 확인
