(function initPureLogic(globalScope, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
    return;
  }

  globalScope.AppLogic = factory();
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  function escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function formatPlayerRange(playerMin, playerMax) {
    return `${playerMin}~${playerMax}`;
  }

  function buildGameSearchHaystack(game) {
    return [
      game?.name || '',
      game?.searchText || '',
      `${game?.playerMin || ''}인`,
      `${game?.playerMax || ''}인`,
      `${game?.playerMin || ''}-${game?.playerMax || ''}`,
    ].join(' ').toLowerCase();
  }

  function matchesGameQuery(game, query) {
    return buildGameSearchHaystack(game).includes((query || '').trim().toLowerCase());
  }

  function sortGames(games, sort) {
    const copied = [...games];
    if (sort === 'players') {
      return copied.sort((a, b) => (a.playerMin - b.playerMin) || a.name.localeCompare(b.name, 'ko'));
    }
    return copied.sort((a, b) => a.name.localeCompare(b.name, 'ko'));
  }

  function getSortedGames(games, query, sort) {
    return sortGames(games.filter((game) => matchesGameQuery(game, query)), sort);
  }

  function getRouteNameForGame(game) {
    if (!game) return '';
    return game.routeName || game.id || '';
  }

  function getGameByRouteName(games, routeName) {
    return games.find((game) => getRouteNameForGame(game) === routeName) || null;
  }

  function parseHashRoute(hash) {
    const raw = String(hash || '').replace(/^#\/?/, '');
    if (!raw) return { view: 'catalog' };

    const parts = raw.split('/').filter(Boolean);
    if (parts[0] !== 'games') return { view: 'catalog' };
    if (parts.length === 1) return { view: 'catalog' };
    if (parts.length === 2) return { view: 'detail', routeName: parts[1] };
    if (parts.length === 3 && parts[2] === 'gm') return { view: 'gm', routeName: parts[1] };
    return { view: 'catalog' };
  }

  function formatHeaderTitleForViewport(title, viewportWidth) {
    const safeTitle = String(title || '');
    if (viewportWidth > 900) return safeTitle;
    if (!safeTitle.includes(':')) return safeTitle;
    return safeTitle.replace(/:\s*/, ':\n');
  }

  function getContactGames(games) {
    return [...games].sort((a, b) => a.name.localeCompare(b.name, 'ko'));
  }

  function getContactSelectedGame(games, gameId) {
    return games.find((game) => game.id === gameId) || null;
  }

  function buildContactMailDraft(contactDraft, games) {
    const selectedGame = getContactSelectedGame(games, contactDraft?.gameId || '');
    if (!selectedGame || !contactDraft?.type) {
      return { subject: '', body: '' };
    }

    if (contactDraft.type === 'takedown') {
      return {
        subject: `[권리자 삭제 요청] ${selectedGame.name}`,
        body: [
          '안녕하세요. 아래 콘텐츠에 대한 삭제 또는 비공개 처리를 요청드립니다.',
          '',
          `[대상 게임] ${selectedGame.name}`,
          '[요청자 성명 / 법인명]',
          '[소속 또는 대리 관계]',
          '[연락 가능한 공식 이메일]',
          '[공식 웹사이트 또는 권리 확인 가능한 주소]',
          '',
          '[권리 보유 또는 대리 권한 설명]',
          '- 원작자 / 퍼블리셔 / 라이선스 보유자 / 정식 대리인 여부를 적어 주세요.',
          '- 가능하면 상품 페이지, 공식 사이트, 사업자 정보, 권리 고지 페이지 등을 함께 보내 주세요.',
          '',
          '[삭제를 요청하는 대상]',
          '- 어떤 게임명 / 화면 / 문구 / 자료인지 구체적으로 적어 주세요.',
          '',
          '[요청 사유]',
          '- 어떤 권리를 침해한다고 판단하는지 적어 주세요.',
          '',
          '[첨부 자료]',
          '- 권리 확인 자료 또는 공식 도메인에서 확인 가능한 링크',
          '- 필요 시 캡처 화면',
          '',
          '허위 또는 권한 없는 요청은 처리되지 않을 수 있습니다.',
        ].join('\n'),
      };
    }

    return {
      subject: `[피드백] ${selectedGame.name}`,
      body: [
        '안녕하세요. 아래 내용으로 피드백을 보냅니다.',
        '',
        `[대상 게임] ${selectedGame.name}`,
        '[문제 유형] 오탈자 / 사용성 / 레이아웃 / 기타',
        '',
        '[설명]',
        '- 어떤 화면에서 무엇이 문제였는지 적어 주세요.',
        '',
        '[재현 정보]',
        '- 사용 기기:',
        '- 브라우저:',
        '- 가로/세로 모드:',
        '',
        '[첨부 권장]',
        '- 문제 화면 캡처',
        '- 가능하면 발생 직전 단계 설명',
      ].join('\n'),
    };
  }

  function buildThemeHref(themeName) {
    if (!themeName || themeName === 'default') return '';
    return `styles/themes/${themeName}.css`;
  }

  function getSlideNextConfirmation(slideDataset) {
    const title = String(slideDataset?.nextConfirmTitle || '').trim();
    const detail = String(slideDataset?.nextConfirmDetail || '').trim();
    const note = String(slideDataset?.nextConfirmNote || '').trim();

    if (!title && !detail && !note) {
      return null;
    }

    const primaryLine = title || '다음 단계로 이동';
    const detailLines = [detail, note].filter(Boolean);
    const messageHtml = [
      `<strong class="confirm-primary-line">${escapeHtml(primaryLine)}</strong>`,
      ...detailLines.map((line) => `<span class="confirm-warning-line">${escapeHtml(line)}</span>`),
    ].join('<br>');

    return {
      title: primaryLine,
      detail,
      note,
      messageHtml,
    };
  }

  function findSlideIndexByAnchorData(slidesMeta, anchor) {
    return slidesMeta.findIndex((slide) => slide.partAnchor === anchor);
  }

  function findSlideIndexByTitlePrefixData(slidesMeta, prefix) {
    return slidesMeta.findIndex((slide) => (slide.title || '').startsWith(prefix));
  }

  function findLastSlideIndexByTitlePrefixData(slidesMeta, prefix) {
    for (let i = slidesMeta.length - 1; i >= 0; i -= 1) {
      if ((slidesMeta[i].title || '').startsWith(prefix)) return i;
    }
    return -1;
  }

  function resolveHeaderActionRange(rangeConfig, slidesMeta) {
    if (!rangeConfig || rangeConfig.type !== 'slideRange') return null;

    const start = rangeConfig.startAnchor
      ? findSlideIndexByAnchorData(slidesMeta, rangeConfig.startAnchor)
      : findSlideIndexByTitlePrefixData(slidesMeta, rangeConfig.startTitlePrefix || '');
    const end = rangeConfig.endAnchor
      ? findSlideIndexByAnchorData(slidesMeta, rangeConfig.endAnchor)
      : findLastSlideIndexByTitlePrefixData(slidesMeta, rangeConfig.endTitlePrefix || rangeConfig.startTitlePrefix || '');

    if (start < 0 || end < 0) return null;
    return { start, end };
  }

  function getVisibleHeaderActionIds(actions, activeIndex, slidesMeta) {
    return actions
      .filter((action) => {
        const range = resolveHeaderActionRange(action?.showOn, slidesMeta);
        return Boolean(action?.id && range && activeIndex >= range.start && activeIndex <= range.end);
      })
      .map((action) => action.id);
  }

  function getPrevContactStep(step) {
    return Math.max(1, Number(step || 1) - 1);
  }

  function getNextContactStep(step, hasSelectedGame) {
    const currentStep = Number(step || 1);
    if (currentStep === 2 && !hasSelectedGame) return currentStep;
    return Math.min(3, currentStep + 1);
  }

  function buildCatalogCardMarkup(game) {
    const gameName = escapeHtml(game?.name || '');
    const boxImageMarkup = game?.boxImage
      ? `<img class="game-card-image" src="${escapeHtml(game.boxImage)}" alt="${gameName} 박스 이미지" />`
      : '<div class="game-card-image-fallback">BOX ART</div>';

    return `
      <div class="game-card-image-wrap">
        ${boxImageMarkup}
      </div>
      <div class="game-card-body">
        <h3 class="game-card-title">${gameName}</h3>
        <div class="game-card-spacer" aria-hidden="true"></div>
        <p class="game-card-players" aria-label="플레이 인원 ${game.playerMin}명부터 ${game.playerMax}명">
          <span class="game-card-players-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3Z" />
              <path d="M8 11c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3Z" />
              <path d="M8 13c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13Z" />
              <path d="M16 13c-.29 0-.62.02-.97.05 1.16.84 1.97 1.96 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5Z" />
            </svg>
          </span>
          <span class="game-card-players-range">${formatPlayerRange(game.playerMin, game.playerMax)}</span>
        </p>
      </div>
    `;
  }

  return {
    buildCatalogCardMarkup,
    buildContactMailDraft,
    buildGameSearchHaystack,
    getSlideNextConfirmation,
    buildThemeHref,
    escapeHtml,
    findLastSlideIndexByTitlePrefixData,
    findSlideIndexByAnchorData,
    findSlideIndexByTitlePrefixData,
    formatHeaderTitleForViewport,
    formatPlayerRange,
    getContactGames,
    getNextContactStep,
    getPrevContactStep,
    getContactSelectedGame,
    getGameByRouteName,
    getRouteNameForGame,
    getSortedGames,
    getVisibleHeaderActionIds,
    matchesGameQuery,
    parseHashRoute,
    resolveHeaderActionRange,
    sortGames,
  };
}));
