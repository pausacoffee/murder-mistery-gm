# 규칙 팝업 매핑

## 1. 규칙 데이터 위치
- `분가`: 현재 일부 규칙 본문이 [app.js](/Users/m1pro/Documents/knh/project/08_bunga/murder-mistery-bunga/app.js) 내부 맵을 사용
- 신규 게임 권장 구조: `games/<id>/rules.json`

## 2. 탭형 규칙 팝업
책 아이콘으로 여는 탭형 팝업은 아래 순서로 구성됩니다.

1. `game.json > rules.tabs`
2. 각 탭의 `key`, `label`, `topic`
3. 필요 시 `rules.contentPath`의 외부 JSON 본문

예:

```json
"rules": {
  "tabs": [
    { "key": "P", "label": "개요", "topic": "게임 개요" },
    { "key": "S", "label": "페이즈", "topic": "페이즈 규칙" },
    { "key": "R", "label": "주의", "topic": "카드와 주의사항" }
  ],
  "contentPath": "games/example/rules.json"
}
```

## 3. `i` 버튼 매핑
현재 슬라이드의 `i` 버튼은 아래 우선순위로 규칙 토픽을 찾습니다.

1. `data-part-info-topic`
2. `data-part-info-title`
3. 제목에서 추출한 페이즈명

즉 슬라이드 작성 시:
- 현재 페이즈와 정확히 연결할 규칙이 있으면 `data-part-info-topic`을 우선 지정합니다.

## 4. 규칙 본문 수정 위치
- 분가의 기존 규칙 맵: [app.js](/Users/m1pro/Documents/knh/project/08_bunga/murder-mistery-bunga/app.js)
- 외부화된 규칙 데이터: `games/<id>/rules.json`

## 5. 작성 원칙
- 규칙 탭 라벨은 짧게 유지합니다.
- 실제 매핑 기준은 `label`이 아니라 `topic`입니다.
- 특정 게임의 규칙 구조를 위해 공통 HTML 탭 마크업을 늘리지 않습니다.
- 신규 게임은 가능하면 `rules.json` 외부화 구조를 우선 사용합니다.
