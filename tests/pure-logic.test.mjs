import { describe, expect, it } from 'vitest';
import logic from '../lib/pure-logic.js';

const {
  buildCatalogCardMarkup,
  buildContactMailDraft,
  buildThemeHref,
  getNextContactStep,
  getPrevContactStep,
  getVisibleHeaderActionIds,
  formatHeaderTitleForViewport,
  formatPlayerRange,
  getGameByRouteName,
  getRouteNameForGame,
  getSortedGames,
  matchesGameQuery,
  parseHashRoute,
  resolveHeaderActionRange,
} = logic;

const games = [
  {
    id: 'bunga',
    routeName: 'hunke',
    name: '분가',
    playerMin: 5,
    playerMax: 6,
    searchText: '분가 bunga hunke 5인 6인',
  },
  {
    id: 'crime-punishment-bibliotheca',
    routeName: 'crime-and-punishment-in-bibliotheca',
    name: '죄와 벌의 도서관',
    playerMin: 5,
    playerMax: 6,
    searchText: '도서관 5인 6인',
  },
];

const slidesMeta = [
  { title: '[파트 1] 라운드 1: 조사', partAnchor: '' },
  { title: '[파트 1] 라운드 2: 조사', partAnchor: '' },
  { title: '[파트 2] 시작', partAnchor: 'part2-start' },
  { title: '[파트 2] 라운드 1: 공유', partAnchor: '' },
  { title: '[파트 2] 라운드 2: 공유', partAnchor: '' },
];

describe('pure logic', () => {
  it('플레이어 인원 최소/최대 값을 범위 문자열로 변환한다', () => {
    expect(formatPlayerRange(5, 6)).toBe('5~6');
  });

  it('게임 검색어를 이름과 인원 메타데이터 기준으로 판별한다', () => {
    expect(matchesGameQuery(games[0], 'hunke')).toBe(true);
    expect(matchesGameQuery(games[0], '5인')).toBe(true);
    expect(matchesGameQuery(games[0], '없는검색어')).toBe(false);
  });

  it('게임 목록을 이름순 또는 인원순으로 정렬한다', () => {
    const sortedByName = getSortedGames(games, '', 'name');
    expect(sortedByName.map((game) => game.name)).toEqual(['분가', '죄와 벌의 도서관']);

    const withMorePlayers = [...games, { id: 'c', name: '가', playerMin: 7, playerMax: 8, searchText: '' }];
    const sortedByPlayers = getSortedGames(withMorePlayers, '', 'players');
    expect(sortedByPlayers.at(-1).id).toBe('c');
  });

  it('게임 routeName과 해시 경로를 상세/GM 라우트로 해석한다', () => {
    expect(getRouteNameForGame(games[0])).toBe('hunke');
    expect(getGameByRouteName(games, 'hunke')?.id).toBe('bunga');
    expect(parseHashRoute('#/games')).toEqual({ view: 'catalog' });
    expect(parseHashRoute('#/games/hunke')).toEqual({ view: 'detail', routeName: 'hunke' });
    expect(parseHashRoute('#/games/hunke/gm')).toEqual({ view: 'gm', routeName: 'hunke' });
  });

  it('작은 화면에서는 콜론 뒤 제목을 줄바꿈하고 큰 화면에서는 유지한다', () => {
    expect(formatHeaderTitleForViewport('[파트 3] 라운드 3: 추리 및 발표', 820)).toBe('[파트 3] 라운드 3:\n추리 및 발표');
    expect(formatHeaderTitleForViewport('[파트 3] 라운드 3: 추리 및 발표', 1280)).toBe('[파트 3] 라운드 3: 추리 및 발표');
  });

  it('문의 유형과 선택된 게임으로 메일 초안을 생성한다', () => {
    const feedbackDraft = buildContactMailDraft({ type: 'feedback', gameId: 'bunga' }, games);
    expect(feedbackDraft.subject).toBe('[피드백] 분가');
    expect(feedbackDraft.body).toContain('[대상 게임] 분가');

    const takedownDraft = buildContactMailDraft({ type: 'takedown', gameId: 'crime-punishment-bibliotheca' }, games);
    expect(takedownDraft.subject).toBe('[권리자 삭제 요청] 죄와 벌의 도서관');
    expect(takedownDraft.body).toContain('권리 보유 또는 대리 권한 설명');
  });

  it('기본 테마가 아닌 경우에만 게임 전용 테마 경로를 만든다', () => {
    expect(buildThemeHref('bunga')).toBe('styles/themes/bunga.css');
    expect(buildThemeHref('default')).toBe('');
    expect(buildThemeHref('')).toBe('');
  });

  it('헤더 액션의 슬라이드 범위를 anchor 또는 title prefix로 계산한다', () => {
    expect(resolveHeaderActionRange({
      type: 'slideRange',
      startTitlePrefix: '[파트 1] 라운드',
      endTitlePrefix: '[파트 1] 라운드',
    }, slidesMeta)).toEqual({ start: 0, end: 1 });

    expect(resolveHeaderActionRange({
      type: 'slideRange',
      startAnchor: 'part2-start',
      endTitlePrefix: '[파트 2] 라운드',
    }, slidesMeta)).toEqual({ start: 2, end: 4 });
  });

  it('현재 슬라이드 인덱스에 따라 노출할 헤더 액션 id를 고른다', () => {
    const actions = [
      {
        id: 'story-card-a',
        showOn: {
          type: 'slideRange',
          startTitlePrefix: '[파트 1] 라운드',
          endTitlePrefix: '[파트 1] 라운드',
        },
      },
      {
        id: 'story-card-b',
        showOn: {
          type: 'slideRange',
          startAnchor: 'part2-start',
          endTitlePrefix: '[파트 2] 라운드',
        },
      },
    ];

    expect(getVisibleHeaderActionIds(actions, 0, slidesMeta)).toEqual(['story-card-a']);
    expect(getVisibleHeaderActionIds(actions, 3, slidesMeta)).toEqual(['story-card-b']);
  });

  it('문의 모달 단계는 선택된 게임 유무에 따라 다음 단계로 이동한다', () => {
    expect(getPrevContactStep(1)).toBe(1);
    expect(getPrevContactStep(3)).toBe(2);
    expect(getNextContactStep(1, false)).toBe(2);
    expect(getNextContactStep(2, false)).toBe(2);
    expect(getNextContactStep(2, true)).toBe(3);
  });

  it('카탈로그 카드 마크업 생성 시 게임 이름을 이스케이프한다', () => {
    const markup = buildCatalogCardMarkup({
      id: 'x',
      name: '<script>alert(1)</script>',
      playerMin: 5,
      playerMax: 6,
      boxImage: '',
    });
    expect(markup).not.toContain('<script>alert(1)</script>');
    expect(markup).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
  });
});
