 
const {
  buildCatalogCardMarkup,
  buildCatalogPath,
  buildContactMailDraft,
  buildDetailPath,
  buildGmPath,
  buildThemeHref,
  formatPlayTimeRange,
  getSlideNextConfirmation,
  getNextContactStep,
  formatHeaderTitleForViewport,
  getContactGames,
  getPrevContactStep,
  getContactSelectedGame,
  getGameByRouteName,
  getRouteNameForGame,
  getSortedGames,
  getVisibleHeaderActionIds,
  normalizeAppPath,
  parseAppRoute,
  resolveHeaderActionRange,
} = window.AppLogic;

const RULE_TAB_TOPIC_MAP = {
  P: '능력과 파워',
  S: '승점',
  R: '전체',
};

const CONTACT_EMAIL = 'skgus43@gmail.com';

const CONTACT_REQUEST_TYPES = {
  takedown: {
    label: '권리자 삭제 요청',
    lead: '권리 보유자 본인 또는 정식 대리인만 요청해 주세요.',
  },
  feedback: {
    label: '피드백',
    lead: '오탈자, 사용성, 레이아웃 문제를 알려주세요.',
  },
};

class AdSlotManager {
  constructor() {
    this.slots = Array.from(document.querySelectorAll('[data-slot]'));
  }

  render() {
    this.slots.forEach((slot) => {
      slot.textContent = '광고 영역';
    });
  }
}

class ViewportGuard {
  constructor(element) {
    this.element = element;
    this.onResize = this.onResize.bind(this);
  }

  init() {
    window.addEventListener('resize', this.onResize);
    window.addEventListener('orientationchange', this.onResize);
    this.onResize();
  }

  onResize() {
    const isMobileWidth = window.innerWidth <= 900;
    const isPortrait = window.matchMedia('(orientation: portrait)').matches;
    this.element.classList.toggle('hidden', !(isMobileWidth && isPortrait));
  }
}

class BGMController {
  constructor(panelEl, muteBtn, volumeRange) {
    this.panelEl = panelEl;
    this.muteBtn = muteBtn;
    this.volumeRange = volumeRange;
    this.audio = new Audio();
    this.audio.loop = true;
    this.audio.volume = Number.parseFloat(volumeRange.value || '0.5');
    this.currentTrack = '';
    this.gameConfig = null;

    this.muteBtn.addEventListener('click', () => {
      this.audio.muted = !this.audio.muted;
      this.muteBtn.textContent = this.audio.muted ? '음소거 해제' : '음소거';
    });

    this.volumeRange.addEventListener('input', () => {
      this.audio.volume = Number.parseFloat(this.volumeRange.value || '0.5');
    });
  }

  applyGame(game) {
    this.gameConfig = game;
    const enabled = Boolean(game?.bgmEnabled);
    this.panelEl.classList.toggle('hidden', !enabled);
    if (!enabled) {
      this.stop();
    }
  }

  updateBySlide(index) {
    if (!this.gameConfig || !this.gameConfig.bgmEnabled) {
      return;
    }

    const slideTrack = this.gameConfig.bgm?.slideTracks?.[String(index)] || '';
    const nextTrack = slideTrack || this.gameConfig.bgm?.defaultTrack || '';
    if (!nextTrack || nextTrack === this.currentTrack) {
      return;
    }

    this.currentTrack = normalizeAppPath(nextTrack, window.location.protocol);
    this.audio.src = this.currentTrack;
    this.audio.play().catch(() => {});
  }

  startOnUserGesture() {
    if (!this.gameConfig?.bgmEnabled) {
      return;
    }
    if (this.currentTrack) {
      this.audio.play().catch(() => {});
    }
  }

  stop() {
    this.audio.pause();
    this.audio.src = '';
    this.currentTrack = '';
  }
}

class TimerManager {
  constructor() {
    this.activeWidget = null;
    this.intervalId = null;
  }

  start(widget) {
    if (this.activeWidget && this.activeWidget !== widget) {
      this.activeWidget.pause();
    }
    this.activeWidget = widget;
    if (!this.intervalId) {
      this.intervalId = setInterval(() => this.tick(), 250);
    }
  }

  stop(widget) {
    if (this.activeWidget !== widget) {
      return;
    }
    this.activeWidget = null;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  tick() {
    if (this.activeWidget) {
      this.activeWidget.onTick();
    }
  }

  pauseIfSlideChanged(activeSlide) {
    if (this.activeWidget && this.activeWidget.slideEl !== activeSlide) {
      this.activeWidget.pause();
    }
  }

  pauseOnTabHidden() {
    if (document.hidden && this.activeWidget) {
      this.activeWidget.pause();
    }
  }
}

class TimerWidget {
  constructor(rootEl, manager, openConfirmModal) {
    this.rootEl = rootEl;
    this.manager = manager;
    this.openConfirmModal = openConfirmModal;
    this.slideEl = rootEl.closest('.slide');
    this.displayEl = rootEl.querySelector('[data-role="display"]');
    this.overlayEl = rootEl.querySelector('[data-role="overlay"]');
    this.minusBtn = rootEl.querySelector('[data-role="minus"]');
    this.plusBtn = rootEl.querySelector('[data-role="plus"]');
    this.toggleBtn = rootEl.querySelector('[data-role="toggle"]');
    this.remainingSeconds = Number.parseInt(rootEl.dataset.initialSeconds || '0', 10);
    this.endAtMs = null;

    this.bindEvents();
    this.render();
    this.setRunningState(false);
  }

  bindEvents() {
    this.toggleBtn?.addEventListener('click', () => {
      if (this.endAtMs) {
        this.pause();
      } else {
        this.play();
      }
    });

    this.plusBtn?.addEventListener('click', () => this.adjustRemainingSeconds(60));
    this.minusBtn?.addEventListener('click', () => {
      if (this.remainingSeconds <= 60) {
        const msg = '<strong class="confirm-primary-line">타이머를 종료</strong>하시겠습니까?<br><span class="confirm-warning-line">남은 시간이 즉시 00:00으로 변경됩니다.</span>';
        this.openConfirmModal(msg, () => this.finish());
        return;
      }
      this.adjustRemainingSeconds(-60);
    });
  }

  adjustRemainingSeconds(delta) {
    this.hideOverlay();
    this.remainingSeconds = Math.max(0, this.remainingSeconds + delta);

    if (this.endAtMs) {
      this.endAtMs += delta * 1000;
      if (this.endAtMs <= Date.now()) {
        this.finish();
        return;
      }
    }

    if (this.remainingSeconds === 0) {
      this.finish();
      return;
    }

    this.render();
  }

  formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  render() {
    if (this.displayEl) {
      this.displayEl.textContent = this.formatTime(Math.max(0, this.remainingSeconds));
    }
  }

  setRunningState(isRunning) {
    if (!this.toggleBtn) {
      return;
    }

    this.toggleBtn.setAttribute('aria-pressed', isRunning ? 'true' : 'false');
    this.toggleBtn.textContent = isRunning ? '일시정지' : '시작';
  }

  hideOverlay() {
    this.overlayEl?.classList.add('hidden');
  }

  showOverlay() {
    this.overlayEl?.classList.remove('hidden');
  }

  play() {
    if (this.remainingSeconds <= 0) {
      this.finish();
      return;
    }
    this.hideOverlay();
    this.endAtMs = Date.now() + this.remainingSeconds * 1000;
    this.manager.start(this);
    this.setRunningState(true);
  }

  pause() {
    if (this.endAtMs) {
      const diffMs = this.endAtMs - Date.now();
      this.remainingSeconds = Math.max(0, Math.ceil(diffMs / 1000));
    }
    this.endAtMs = null;
    this.manager.stop(this);
    this.setRunningState(false);
    this.render();
  }

  finish() {
    this.remainingSeconds = 0;
    this.endAtMs = null;
    this.manager.stop(this);
    this.setRunningState(false);
    this.render();
    this.showOverlay();
  }

  onTick() {
    if (!this.endAtMs) {
      this.pause();
      return;
    }

    const diffMs = this.endAtMs - Date.now();
    this.remainingSeconds = Math.max(0, Math.ceil(diffMs / 1000));
    this.render();

    if (this.remainingSeconds <= 0) {
      this.finish();
    }
  }
}

class PerPlayerTimerWidget {
  constructor(rootEl, manager, openConfirmModal) {
    this.rootEl = rootEl;
    this.manager = manager;
    this.openConfirmModal = openConfirmModal;
    this.slideEl = rootEl.closest('.slide');
    this.displayEl = rootEl.querySelector('[data-role="display"]');
    this.overlayEl = rootEl.querySelector('[data-role="overlay"]');
    this.minusBtn = rootEl.querySelector('[data-role="minus"]');
    this.plusBtn = rootEl.querySelector('[data-role="plus"]');
    this.toggleBtn = rootEl.querySelector('[data-role="toggle"]');
    this.initialSeconds = Number.parseInt(rootEl.dataset.initialSeconds || '0', 10);
    this.playerCount = Math.max(1, Number.parseInt(rootEl.dataset.playerCount || '1', 10));
    this.playerStates = Array.from({ length: this.playerCount }, (_, idx) => ({
      label: String(idx + 1),
      remainingSeconds: this.initialSeconds,
      ended: false,
    }));
    this.activePlayerIndex = 0;
    this.tabButtons = [];
    this.endAtMs = null;

    this.buildTabs();
    this.bindEvents();
    this.render();
    this.setRunningState(false);
  }

  buildTabs() {
    const tabsEl = document.createElement('div');
    tabsEl.className = 'timer-player-tabs';
    tabsEl.setAttribute('role', 'tablist');
    tabsEl.setAttribute('aria-label', '플레이어별 타이머');

    this.tabButtons = this.playerStates.map((player, idx) => {
      const btn = document.createElement('button');
      btn.className = `timer-player-tab${idx === this.activePlayerIndex ? ' active' : ''}`;
      btn.type = 'button';
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', idx === this.activePlayerIndex ? 'true' : 'false');
      btn.textContent = player.label;
      btn.addEventListener('click', () => this.setActivePlayer(idx));
      tabsEl.appendChild(btn);
      return btn;
    });

    this.rootEl.insertBefore(tabsEl, this.rootEl.firstChild);
  }

  bindEvents() {
    this.toggleBtn?.addEventListener('click', () => {
      if (this.endAtMs) {
        this.pause();
      } else {
        this.play();
      }
    });

    this.plusBtn?.addEventListener('click', () => this.adjustRemainingSeconds(60));
    this.minusBtn?.addEventListener('click', () => {
      const activePlayer = this.getActivePlayer();
      if (!activePlayer) return;

      if (activePlayer.remainingSeconds <= 60) {
        const msg = '<strong class="confirm-primary-line">현재 플레이어 타이머를 종료</strong>하시겠습니까?<br><span class="confirm-warning-line">남은 시간이 즉시 00:00으로 변경됩니다.</span>';
        this.openConfirmModal(msg, () => this.finishActivePlayer());
        return;
      }

      this.adjustRemainingSeconds(-60);
    });
  }

  getActivePlayer() {
    return this.playerStates[this.activePlayerIndex] || null;
  }

  getNextAvailablePlayerIndex() {
    return this.playerStates.findIndex((player) => !player.ended);
  }

  setActivePlayer(index) {
    const nextPlayer = this.playerStates[index];
    if (!nextPlayer || nextPlayer.ended || index === this.activePlayerIndex) {
      return;
    }

    if (this.endAtMs) {
      this.pause();
    }

    this.hideOverlay();
    this.activePlayerIndex = index;
    this.render();
  }

  adjustRemainingSeconds(delta) {
    const activePlayer = this.getActivePlayer();
    if (!activePlayer || activePlayer.ended) {
      return;
    }

    this.hideOverlay();
    activePlayer.remainingSeconds = Math.max(0, activePlayer.remainingSeconds + delta);

    if (this.endAtMs) {
      this.endAtMs += delta * 1000;
      if (this.endAtMs <= Date.now()) {
        this.finishActivePlayer();
        return;
      }
    }

    if (activePlayer.remainingSeconds === 0) {
      this.finishActivePlayer();
      return;
    }

    this.render();
  }

  formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  renderTabs() {
    this.tabButtons.forEach((button, idx) => {
      const player = this.playerStates[idx];
      const isActive = idx === this.activePlayerIndex && !player.ended;
      button.classList.toggle('active', isActive);
      button.classList.toggle('finished', player.ended);
      button.disabled = player.ended;
      button.setAttribute('aria-selected', isActive ? 'true' : 'false');
      button.setAttribute('aria-disabled', player.ended ? 'true' : 'false');
    });
  }

  render() {
    const activePlayer = this.getActivePlayer();
    const hasAvailablePlayer = this.getNextAvailablePlayerIndex() >= 0;

    if (this.displayEl) {
      this.displayEl.textContent = this.formatTime(Math.max(0, activePlayer?.remainingSeconds || 0));
    }

    if (this.plusBtn) this.plusBtn.disabled = !hasAvailablePlayer;
    if (this.minusBtn) this.minusBtn.disabled = !hasAvailablePlayer;
    if (this.toggleBtn) this.toggleBtn.disabled = !hasAvailablePlayer;

    this.renderTabs();
  }

  setRunningState(isRunning) {
    if (!this.toggleBtn) {
      return;
    }

    const hasAvailablePlayer = this.getNextAvailablePlayerIndex() >= 0;
    this.toggleBtn.setAttribute('aria-pressed', isRunning ? 'true' : 'false');
    this.toggleBtn.textContent = hasAvailablePlayer ? (isRunning ? '일시정지' : '시작') : '종료';
  }

  hideOverlay() {
    this.overlayEl?.classList.add('hidden');
  }

  showOverlay() {
    this.overlayEl?.classList.remove('hidden');
  }

  play() {
    const activePlayer = this.getActivePlayer();
    if (!activePlayer || activePlayer.ended) {
      return;
    }

    if (activePlayer.remainingSeconds <= 0) {
      this.finishActivePlayer();
      return;
    }

    this.hideOverlay();
    this.endAtMs = Date.now() + activePlayer.remainingSeconds * 1000;
    this.manager.start(this);
    this.setRunningState(true);
  }

  pause() {
    const activePlayer = this.getActivePlayer();
    if (this.endAtMs && activePlayer) {
      const diffMs = this.endAtMs - Date.now();
      activePlayer.remainingSeconds = Math.max(0, Math.ceil(diffMs / 1000));
    }

    this.endAtMs = null;
    this.manager.stop(this);
    this.setRunningState(false);
    this.render();
  }

  finishActivePlayer() {
    const activePlayer = this.getActivePlayer();
    if (!activePlayer) {
      return;
    }

    activePlayer.remainingSeconds = 0;
    activePlayer.ended = true;
    this.endAtMs = null;
    this.manager.stop(this);
    this.setRunningState(false);

    const nextIndex = this.getNextAvailablePlayerIndex();
    if (nextIndex >= 0) {
      this.activePlayerIndex = nextIndex;
      this.hideOverlay();
    } else {
      this.showOverlay();
    }

    this.render();
  }

  onTick() {
    const activePlayer = this.getActivePlayer();
    if (!this.endAtMs || !activePlayer) {
      this.pause();
      return;
    }

    const diffMs = this.endAtMs - Date.now();
    activePlayer.remainingSeconds = Math.max(0, Math.ceil(diffMs / 1000));
    this.render();

    if (activePlayer.remainingSeconds <= 0) {
      this.finishActivePlayer();
    }
  }
}

class RulesModal {
  constructor(modalEl, titleEl, bodyEl, tabsEl) {
    this.modalEl = modalEl;
    this.titleEl = titleEl;
    this.bodyEl = bodyEl;
    this.tabsEl = tabsEl;
    this.ruleTabs = [];
    this.activeRuleTabKey = 'P';
    this.contentMap = {};
    this.tabConfig = [
      { key: 'P', label: '능력과 파워' },
      { key: 'S', label: '승점' },
      { key: 'R', label: '전체' },
    ];
  }

  configure(game) {
    this.tabConfig = Array.isArray(game?.rules?.tabs) && game.rules.tabs.length > 0
      ? game.rules.tabs
      : this.tabConfig;
    this.contentMap = game?.rules?.contentMap || {};
    this.renderTabs();
    this.activeRuleTabKey = this.tabConfig[0]?.key || 'P';
  }

  renderTabs() {
    this.tabsEl.innerHTML = '';
    this.ruleTabs = this.tabConfig.map((tab, idx) => {
      const btn = document.createElement('button');
      btn.className = `rules-modal-tab${idx === 0 ? ' active' : ''}`;
      btn.type = 'button';
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', idx === 0 ? 'true' : 'false');
      btn.dataset.role = 'modal-rule-tab';
      btn.dataset.ruleKey = tab.key;
      btn.textContent = tab.label;
      this.tabsEl.appendChild(btn);
      return btn;
    });
  }

  setRuleTabState(activeKey) {
    this.ruleTabs.forEach((button) => {
      const isActive = button.dataset.ruleKey === activeKey;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  }

  getRuleTopicByKey(ruleKey) {
    const matched = this.tabConfig.find((tab) => tab.key === ruleKey);
    return matched?.topic || RULE_TAB_TOPIC_MAP[ruleKey] || matched?.label || '';
  }

  renderRuleTab(ruleKey) {
    const topic = this.getRuleTopicByKey(ruleKey);
    if (!topic) {
      return;
    }
    this.activeRuleTabKey = ruleKey;
    this.titleEl.textContent = '규칙';
    this.bodyEl.innerHTML = this.contentMap[topic] || '<p>규칙 텍스트는 차후 삽입 예정</p>';
    this.setRuleTabState(ruleKey);
  }

  open(topic, options = {}) {
    const tabKeyByTopic = this.tabConfig.find((tab) => (tab.topic || RULE_TAB_TOPIC_MAP[tab.key] || tab.label) === topic)?.key || '';
    const forceTabbed = options.forceTabbed === true;
    const useTabbedMode = forceTabbed || Boolean(tabKeyByTopic);

    this.tabsEl.classList.toggle('hidden', !useTabbedMode);
    if (useTabbedMode) {
      const resolved = options.ruleKey || tabKeyByTopic || this.activeRuleTabKey || 'P';
      this.renderRuleTab(resolved);
    } else {
      this.titleEl.textContent = topic;
      this.bodyEl.innerHTML = this.contentMap[topic] || '<p>규칙 텍스트는 차후 삽입 예정</p>';
    }

    this.modalEl.classList.remove('hidden');
    this.modalEl.setAttribute('aria-hidden', 'false');
  }

  close() {
    this.modalEl.classList.add('hidden');
    this.modalEl.setAttribute('aria-hidden', 'true');
  }

  isOpen() {
    return !this.modalEl.classList.contains('hidden');
  }
}

class SlideRenderer {
  constructor(options) {
    this.slidesContainer = options.slidesContainer;
    this.headerTitle = options.headerTitle;
    this.pageNow = options.pageNow;
    this.pageTotal = options.pageTotal;
    this.headerPartInfoBtn = options.headerPartInfoBtn;
    this.headerActionList = options.headerActionList;
    this.headerRulesBookBtn = options.headerRulesBookBtn;
    this.rulesModal = options.rulesModal;
    this.bgmController = options.bgmController;
    this.openConfirmModal = options.openConfirmModal;

    this.timerManager = new TimerManager();
    this.timerWidgets = [];
    this.slides = [];
    this.gameConfig = null;
    this.headerActions = [];
    this.currentIndex = 0;
    this.part1StartIndex = 8;
    this.part1EndIndex = 19;
    this.part2StartIndex = 24;
    this.part2EndIndex = 35;
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchFromScrollable = false;

    this.boundKeydown = (event) => this.handleKeydown(event);
    this.boundTouchStart = (event) => this.handleTouchStart(event);
    this.boundTouchEnd = (event) => this.handleTouchEnd(event);
    this.boundVisibility = () => this.timerManager.pauseOnTabHidden();
    this.boundResizeTitle = () => this.updateHeaderTitle();
  }

  async loadGame(game) {
    this.currentIndex = 0;
    this.gameConfig = game;

    const slidesHtml = await fetch(normalizeAppPath(game.slidesHtmlPath, window.location.protocol)).then((res) => res.text());
    const temp = document.createElement('div');
    temp.innerHTML = slidesHtml;

    const sectionEls = Array.from(temp.querySelectorAll('section.slide'));
    this.slidesContainer.innerHTML = '';
    this.slides = sectionEls.map((section, idx) => {
      const node = section.cloneNode(true);
      node.dataset.index = String(idx);
      node.classList.remove('active');
      this.slidesContainer.appendChild(node);
      return node;
    });

    this.pageTotal.textContent = String(this.slides.length);
    this.refreshPartRanges();
    this.setupHeaderActions();
    this.setupInlineRules();
    this.setupTimers();
    this.decorateStoryText();
    this.renderSlide(0);
    this.bindEvents();
  }

  refreshPartRanges() {
    this.part1StartIndex = this.findSlideIndexByTitlePrefix('[파트 1] 라운드');
    this.part1EndIndex = this.findLastSlideIndexByTitlePrefix('[파트 1] 라운드');
    this.part2StartIndex = this.findSlideIndexByAnchor('part2-start');
    this.part2EndIndex = this.findLastSlideIndexByTitlePrefix('[파트 2] 라운드');
    if (this.part2StartIndex < 0) this.part2StartIndex = 20;
    if (this.part2EndIndex < 0) this.part2EndIndex = 35;
    if (this.part1StartIndex < 0) this.part1StartIndex = 8;
    if (this.part1EndIndex < 0) this.part1EndIndex = 19;
  }

  findSlideIndexByAnchor(anchor) {
    return this.slides.findIndex((slide) => slide.dataset.partAnchor === anchor);
  }

  findSlideIndexByTitlePrefix(prefix) {
    return this.slides.findIndex((slide) => (slide.dataset.title || '').startsWith(prefix));
  }

  findLastSlideIndexByTitlePrefix(prefix) {
    for (let i = this.slides.length - 1; i >= 0; i -= 1) {
      if ((this.slides[i].dataset.title || '').startsWith(prefix)) return i;
    }
    return -1;
  }

  getSlidesMeta() {
    return this.slides.map((slide) => ({
      title: slide.dataset.title || '',
      partAnchor: slide.dataset.partAnchor || '',
    }));
  }

  resolveHeaderActionRange(rangeConfig) {
    return resolveHeaderActionRange(rangeConfig, this.getSlidesMeta());
  }

  setupHeaderActions() {
    this.headerActions = Array.isArray(this.gameConfig?.headerActions) ? this.gameConfig.headerActions : [];
    if (!this.headerActionList) return;

    this.headerActionList.innerHTML = '';
    this.headerActions.forEach((action) => {
      const btn = document.createElement('button');
      btn.className = 'header-part-end-btn hidden';
      btn.type = 'button';
      btn.dataset.role = 'header-action';
      btn.dataset.actionId = action.id || '';
      btn.textContent = action.label || '추가 액션';
      this.headerActionList.appendChild(btn);
    });
  }

  updateHeaderActions(activeIndex) {
    if (!this.headerActionList) return;

    const buttons = Array.from(this.headerActionList.querySelectorAll('[data-role="header-action"]'));
    const visibleIds = new Set(getVisibleHeaderActionIds(this.headerActions, activeIndex, this.getSlidesMeta()));
    buttons.forEach((button) => {
      const isVisible = visibleIds.has(button.dataset.actionId);
      button.classList.toggle('hidden', !isVisible);
    });

    this.headerActionList.classList.toggle('hidden', !buttons.some((button) => !button.classList.contains('hidden')));
  }

  handleHeaderAction(actionId) {
    const action = this.headerActions.find((item) => item.id === actionId);
    if (!action?.action) return;

    if (action.action.type === 'confirmJump') {
      const target = action.action.targetAnchor ? this.findSlideIndexByAnchor(action.action.targetAnchor) : -1;
      const message = `<strong class="confirm-primary-line">${action.action.confirmTitle || action.label || '확인'}</strong>가 공개되었습니까?<br><span class="confirm-warning-line">${action.action.confirmSubtitle || ''}</span>로 진입합니다.`;
      this.openConfirmModal(message, () => {
        if (target >= 0) this.renderSlide(target);
      });
    }
  }

  setupTimers() {
    this.timerWidgets = Array.from(this.slidesContainer.querySelectorAll('[data-timer-widget]'))
      .map((el) => {
        if (el.dataset.timerType === 'per-player') {
          return new PerPlayerTimerWidget(el, this.timerManager, this.openConfirmModal);
        }
        return new TimerWidget(el, this.timerManager, this.openConfirmModal);
      });
  }

  setupInlineRules() {
    const inlineBody = this.slidesContainer.querySelector('#rulesInlineBody');
    if (!inlineBody) return;

    const renderInline = (key) => {
      const topic = RULE_TAB_TOPIC_MAP[key] || '';
      if (!topic) return;
      const tabs = Array.from(this.slidesContainer.querySelectorAll('[data-role="inline-rule-tab"]'));
      tabs.forEach((btn) => {
        const isActive = btn.dataset.ruleKey === key;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
      inlineBody.innerHTML = this.rulesModal.contentMap[topic] || '<p>규칙 텍스트는 차후 삽입 예정</p>';
      this.rulesModal.activeRuleTabKey = key;
    };

    renderInline('P');
    this.slidesContainer.addEventListener('click', (event) => {
      const target = event.target.closest('[data-role="inline-rule-tab"]');
      if (!target) return;
      const key = target.dataset.ruleKey;
      if (key) renderInline(key);
    });
  }

  decorateStoryText() {
    const storyTextEl = this.slidesContainer.querySelector('.story-slide .scrollable-text');
    if (!storyTextEl) return;

    const nameClassMap = {
      '[수집가]': 'story-name-collector',
      '[영매 소녀]': 'story-name-medium',
      '[정신과의]': 'story-name-psychiatrist',
      '[저택 주인 아들]': 'story-name-son',
      '[건축가]': 'story-name-architect',
      '[신문 기자]': 'story-name-reporter',
    };

    let html = storyTextEl.innerHTML.replace(/신문 기사/g, '신문 기자');
    Object.entries(nameClassMap).forEach(([name, className]) => {
      const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      html = html.replace(new RegExp(escaped, 'g'), `<span class="story-name ${className}">${name}</span>`);
    });
    storyTextEl.innerHTML = html;

    const paragraphs = Array.from(storyTextEl.querySelectorAll('p'));
    paragraphs.forEach((p) => {
      const text = (p.textContent || '').trim();
      if (text.startsWith('「') && text.endsWith('」')) {
        p.classList.add('story-dialogue');
      }

      if (text === '길고도 공포스러운 밤이, 이제 막 시작되려 하고 있었다.') {
        p.classList.add('story-final-line');
      }
    });
  }

  bindEvents() {
    window.removeEventListener('keydown', this.boundKeydown);
    window.removeEventListener('resize', this.boundResizeTitle);
    document.removeEventListener('visibilitychange', this.boundVisibility);
    this.slidesContainer.removeEventListener('touchstart', this.boundTouchStart);
    this.slidesContainer.removeEventListener('touchend', this.boundTouchEnd);

    window.addEventListener('keydown', this.boundKeydown);
    window.addEventListener('resize', this.boundResizeTitle);
    document.addEventListener('visibilitychange', this.boundVisibility);
    this.slidesContainer.addEventListener('touchstart', this.boundTouchStart);
    this.slidesContainer.addEventListener('touchend', this.boundTouchEnd);
  }

  formatHeaderTitle(title) {
    return formatHeaderTitleForViewport(title, window.innerWidth);
  }

  updateHeaderTitle() {
    const currentSlide = this.slides[this.currentIndex];
    if (!currentSlide) return;
    this.headerTitle.textContent = this.formatHeaderTitle(currentSlide.dataset.title || '');
  }

  isPart1Slide(index) {
    return index >= this.part1StartIndex && index <= this.part1EndIndex;
  }

  isPart2Slide(index) {
    return index >= this.part2StartIndex && index <= this.part2EndIndex;
  }

  extractPartActionTitle(title) {
    return (title || '').replace(/^\[(?:Part|파트)\s*\d+\]\s*(?:\d+\s*(?:Round|Rount|라운드)|(?:Round|Rount|라운드)\s*\d+):\s*/i, '').trim();
  }

  extractPartRoundText(title) {
    const text = title || '';
    const matchNumberFirst = text.match(/^\[(?:Part|파트)\s*\d+\]\s*(\d+)\s*(?:Round|Rount|라운드):/i);
    if (matchNumberFirst) return `라운드 ${matchNumberFirst[1]}`;
    const matchWordFirst = text.match(/^\[(?:Part|파트)\s*\d+\]\s*(?:Round|Rount|라운드)\s*(\d+):/i);
    return matchWordFirst ? `라운드 ${matchWordFirst[1]}` : '';
  }

  updateTimerActionLabel(slideEl, partInfoTitle) {
    if (!slideEl) return;
    const timerWidget = slideEl.querySelector('.timer-widget');
    if (!timerWidget) return;

    let roundEl = slideEl.querySelector('.timer-round-label');
    let actionEl = slideEl.querySelector('.timer-action-label');
    const roundText = this.extractPartRoundText(partInfoTitle);
    const actionTitle = this.extractPartActionTitle(partInfoTitle);

    if (!actionTitle) {
      roundEl?.remove();
      actionEl?.remove();
      return;
    }

    if (!roundEl) {
      roundEl = document.createElement('h3');
      roundEl.className = 'timer-round-label';
      slideEl.insertBefore(roundEl, timerWidget);
    }

    if (!actionEl) {
      actionEl = document.createElement('h1');
      actionEl.className = 'timer-action-label';
      slideEl.insertBefore(actionEl, timerWidget);
    }

    roundEl.textContent = roundText;
    actionEl.textContent = actionTitle;
  }

  renderSlide(index) {
    const boundedIndex = Math.max(0, Math.min(index, this.slides.length - 1));
    this.slides.forEach((slide, i) => slide.classList.toggle('active', i === boundedIndex));
    this.currentIndex = boundedIndex;
    this.pageNow.textContent = String(boundedIndex + 1);

    const currentSlide = this.slides[boundedIndex];
    this.headerTitle.textContent = this.formatHeaderTitle(currentSlide.dataset.title || '');

    const partInfoTitle = currentSlide.dataset.partInfoTitle || '';
    const partInfoTopic = currentSlide.dataset.partInfoTopic || '';
    const showPartInfo = Boolean(partInfoTitle || partInfoTopic);
    this.headerPartInfoBtn.classList.toggle('hidden', !showPartInfo);
    this.headerPartInfoBtn.setAttribute('aria-hidden', showPartInfo ? 'false' : 'true');

    this.updateHeaderActions(boundedIndex);
    this.headerRulesBookBtn.style.display = boundedIndex >= 6 ? 'inline-flex' : 'none';

    this.updateTimerActionLabel(currentSlide, partInfoTitle);
    this.timerManager.pauseIfSlideChanged(currentSlide);
    this.bgmController.updateBySlide(boundedIndex);
  }

  goPrev() {
    this.renderSlide(this.currentIndex - 1);
  }

  goNext() {
    const currentSlide = this.slides[this.currentIndex];
    const nextConfirm = getSlideNextConfirmation(currentSlide?.dataset);
    const nextIndex = this.currentIndex + 1;

    if (!nextConfirm) {
      this.renderSlide(nextIndex);
      return;
    }

    this.openConfirmModal(nextConfirm.messageHtml, () => this.renderSlide(nextIndex));
  }

  handleKeydown(event) {
    if (event.key === 'ArrowLeft') this.goPrev();
    if (event.key === 'ArrowRight') this.goNext();
  }

  handleTouchStart(event) {
    const touch = event.changedTouches[0];
    this.touchStartX = touch.screenX;
    this.touchStartY = touch.screenY;
    this.touchFromScrollable = Boolean(event.target.closest('.scrollable-text'));
  }

  handleTouchEnd(event) {
    if (this.touchFromScrollable) {
      this.touchFromScrollable = false;
      return;
    }
    const touch = event.changedTouches[0];
    const diffX = this.touchStartX - touch.screenX;
    const diffY = this.touchStartY - touch.screenY;
    if (Math.abs(diffX) < 50 || Math.abs(diffX) <= Math.abs(diffY)) return;
    if (diffX > 0) this.goNext();
    else this.goPrev();
  }
}

class MultiGameApp {
  constructor() {
    this.state = {
      games: [],
      gamePackages: {},
      selectedGameId: null,
      sort: 'name',
      query: '',
      pendingConfirmAction: null,
      contactDraft: {
        step: 1,
        type: '',
        gameId: '',
      },
    };

    this.catalogView = document.getElementById('catalogView');
    this.detailView = document.getElementById('detailView');
    this.gmView = document.getElementById('gmView');
    this.gameListEl = document.getElementById('gameList');
    this.gameSearchInput = document.getElementById('gameSearchInput');
    this.gameSortSelect = document.getElementById('gameSortSelect');
    this.gameThemeStylesheet = document.getElementById('gameThemeStylesheet');

    this.detailTitle = document.getElementById('detailTitle');
    this.detailPrequel = document.getElementById('detailPrequel');
    this.detailMeta = document.getElementById('detailMeta');
    this.detailBoxImage = document.getElementById('detailBoxImage');
    this.detailImageFallback = document.getElementById('detailImageFallback');
    this.detailCopyright = document.getElementById('detailCopyright');
    this.gmCopyright = document.getElementById('gmCopyright');

    this.confirmModal = document.getElementById('confirmModal');
    this.confirmModalMessage = document.getElementById('confirmModalMessage');
    this.npcModal = document.getElementById('npcModal');
    this.contactModal = document.getElementById('contactModal');
    this.contactStepBadge = document.getElementById('contactStepBadge');
    this.contactStepLead = document.getElementById('contactStepLead');
    this.contactModalBody = document.getElementById('contactModalBody');
    this.contactModalActions = document.getElementById('contactModalActions');
    this.gmMobileMenu = document.getElementById('gmMobileMenu');
    this.gmMobileMenuBtn = document.getElementById('gmMobileMenuBtn');

    this.rulesModal = new RulesModal(
      document.getElementById('rulesModal'),
      document.getElementById('rulesModalTitle'),
      document.getElementById('rulesModalBody'),
      document.getElementById('rulesModalTabs'),
    );

    this.bgmController = new BGMController(
      document.getElementById('bgmPanel'),
      document.getElementById('bgmMuteBtn'),
      document.getElementById('bgmVolumeRange'),
    );

    this.slideRenderer = new SlideRenderer({
      slidesContainer: document.getElementById('slidesContainer'),
      headerTitle: document.getElementById('headerTitle'),
      pageNow: document.getElementById('pageNow'),
      pageTotal: document.getElementById('pageTotal'),
      headerPartInfoBtn: document.getElementById('headerPartInfoBtn'),
      headerActionList: document.getElementById('headerActionList'),
      headerRulesBookBtn: document.getElementById('headerRulesBookBtn'),
      rulesModal: this.rulesModal,
      bgmController: this.bgmController,
      openConfirmModal: (message, onConfirm) => this.openConfirmModal(message, onConfirm),
    });

    this.viewportGuard = new ViewportGuard(document.getElementById('orientationGuard'));
    this.adSlotManager = new AdSlotManager();
    this.boundDeviceContextUpdate = () => {
      this.applyDeviceContextClass();
      this.updateMobileSlideFrameSize();
    };
    this.boundVisualViewportUpdate = () => this.updateMobileSlideFrameSize();
  }

  async init() {
    this.applyDeviceContextClass();
    this.updateMobileSlideFrameSize();
    window.addEventListener('resize', this.boundDeviceContextUpdate);
    window.addEventListener('orientationchange', this.boundDeviceContextUpdate);
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', this.boundVisualViewportUpdate);
      window.visualViewport.addEventListener('scroll', this.boundVisualViewportUpdate);
    }
    this.viewportGuard.init();
    this.adSlotManager.render();
    this.bindGlobalEvents();
    await this.loadGames();
    this.renderCatalog();
    await this.applyRouteFromLocation();
  }

  applyDeviceContextClass() {
    const ua = navigator.userAgent || '';
    const isLikelyMobileUA = /Android|iPhone|iPad|iPod|Mobile|Windows Phone/i.test(ua);
    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
    const isSmallScreen = window.matchMedia('(max-width: 900px)').matches;
    const isMobileContext = (isCoarsePointer && isSmallScreen) || isLikelyMobileUA;

    document.body.classList.toggle('is-mobile', isMobileContext);
    document.body.classList.toggle('is-desktop', !isMobileContext);
  }

  updateMobileSlideFrameSize() {
    const root = document.documentElement;
    const vv = window.visualViewport;
    const vw = vv ? vv.width : window.innerWidth;
    const vh = vv ? vv.height : window.innerHeight;
    const isMobile = document.body.classList.contains('is-mobile');
    const isLandscape = vw > vh;

    if (!isMobile || !isLandscape) {
      root.style.removeProperty('--mobile-slide-w');
      root.style.removeProperty('--mobile-slide-h');
      return;
    }

    const horizontalPadding = 12;
    const verticalPadding = 8;
    const targetByHeight = Math.max(320, (vh - verticalPadding) * (16 / 9));
    const width = Math.max(320, Math.min(vw - horizontalPadding, targetByHeight));
    const height = Math.max(180, width * (9 / 16));

    root.style.setProperty('--mobile-slide-w', `${Math.round(width)}px`);
    root.style.setProperty('--mobile-slide-h', `${Math.round(height)}px`);
  }

  async loadGames() {
    const response = await fetch(normalizeAppPath('data/catalog.json', window.location.protocol));
    const data = await response.json();
    this.state.games = Array.isArray(data.games) ? data.games : [];
  }

  get selectedGame() {
    return this.state.games.find((game) => game.id === this.state.selectedGameId) || null;
  }

  get selectedGamePackage() {
    return this.state.gamePackages[this.state.selectedGameId] || null;
  }

  async loadGamePackage(gameId) {
    const catalogGame = this.state.games.find((game) => game.id === gameId);
    if (!catalogGame?.gamePath) {
      return null;
    }

    if (this.state.gamePackages[gameId]) {
      return this.state.gamePackages[gameId];
    }

    const response = await fetch(normalizeAppPath(catalogGame.gamePath, window.location.protocol));
    const gamePackage = await response.json();
    const merged = {
      ...catalogGame,
      ...gamePackage,
      rules: {
        ...(catalogGame.rules || {}),
        ...(gamePackage.rules || {}),
      },
    };

    if (merged.rules?.contentPath) {
      const rulesResponse = await fetch(normalizeAppPath(merged.rules.contentPath, window.location.protocol));
      merged.rules.contentMap = await rulesResponse.json();
    }

    this.state.gamePackages[gameId] = merged;
    return merged;
  }

  bindGlobalEvents() {
    this.gameSearchInput.addEventListener('input', () => {
      this.state.query = this.gameSearchInput.value.trim().toLowerCase();
      this.renderCatalog();
    });

    this.gameSortSelect.addEventListener('change', () => {
      this.state.sort = this.gameSortSelect.value;
      this.renderCatalog();
    });

    document.getElementById('detailBackBtn')?.addEventListener('click', () => this.navigateToCatalog());
    document.getElementById('enterGameBtn').addEventListener('click', () => {
      if (this.selectedGame) {
        this.navigateToGameGm(this.selectedGame.id);
      }
    });
    document.getElementById('prevBtn').addEventListener('click', () => this.slideRenderer.goPrev());
    document.getElementById('nextBtn').addEventListener('click', () => this.slideRenderer.goNext());

    document.addEventListener('click', (event) => {
      const gameCard = event.target.closest('[data-role="game-open"]');
      if (gameCard) {
        const gameId = gameCard.dataset.gameId;
        if (gameId) this.navigateToGameDetail(gameId);
        return;
      }

      const modalRuleTabTarget = event.target.closest('[data-role="modal-rule-tab"]');
      if (modalRuleTabTarget) {
        this.rulesModal.renderRuleTab(modalRuleTabTarget.dataset.ruleKey);
        return;
      }

      if (event.target.closest('[data-role="rules-modal-close"]')) {
        this.rulesModal.close();
        return;
      }
      if (event.target.closest('[data-role="contact-open"]')) {
        this.openContactModal();
        return;
      }
      if (event.target.closest('[data-role="gm-mobile-menu-toggle"]')) {
        this.toggleGmMobileMenu();
        return;
      }
      if (event.target.closest('[data-role="gm-home-open"]')) {
        this.closeGmMobileMenu();
        this.navigateToCatalog();
        return;
      }
      if (event.target.closest('[data-role="gm-detail-open"]')) {
        this.closeGmMobileMenu();
        if (this.state.selectedGameId) {
          this.navigateToGameDetail(this.state.selectedGameId);
        }
        return;
      }
      if (event.target.closest('[data-role="contact-close"]')) {
        this.closeContactModal();
        return;
      }
      const contactTypeTarget = event.target.closest('[data-role="contact-type-select"]');
      if (contactTypeTarget) {
        this.selectContactType(contactTypeTarget.dataset.contactType || '');
        return;
      }
      const contactGameTarget = event.target.closest('[data-role="contact-game-select"]');
      if (contactGameTarget) {
        this.selectContactGame(contactGameTarget.dataset.gameId || '');
        return;
      }
      if (event.target.closest('[data-role="contact-back"]')) {
        this.goBackContactStep();
        return;
      }
      if (event.target.closest('[data-role="contact-next"]')) {
        this.goNextContactStep();
        return;
      }
      if (event.target.closest('[data-role="contact-mail-open"]')) {
        this.openContactMailDraft();
        return;
      }
      if (event.target.closest('[data-role="npc-modal-close"]')) {
        this.closeNpcModal();
        return;
      }
      if (event.target.closest('[data-role="confirm-cancel"]')) {
        this.closeConfirmModal();
        return;
      }
      if (event.target.closest('[data-role="confirm-ok"]')) {
        this.submitConfirmModal();
        return;
      }

      if (event.target.closest('[data-role="npc-open"]')) {
        this.openConfirmModal('NPC 캐릭터가 공개됩니다.', () => this.openNpcModal());
        return;
      }

      if (event.target.closest('[data-role="part-info-open"]')) {
        const activeSlide = this.slideRenderer.slides[this.slideRenderer.currentIndex];
        const topic = activeSlide?.dataset.partInfoTopic || this.slideRenderer.extractPartActionTitle(activeSlide?.dataset.partInfoTitle || '');
        if (topic) this.rulesModal.open(topic);
        return;
      }

      const headerActionTarget = event.target.closest('[data-role="header-action"]');
      if (headerActionTarget) {
        this.slideRenderer.handleHeaderAction(headerActionTarget.dataset.actionId || '');
        return;
      }
      if (event.target.closest('[data-role="rules-book-open"]')) {
        const activeKey = this.rulesModal.activeRuleTabKey || 'P';
        const topic = this.rulesModal.getRuleTopicByKey(activeKey) || '규칙';
        this.rulesModal.open(topic, { forceTabbed: true, ruleKey: activeKey });
        return;
      }

      const topicButton = event.target.closest('[data-rule-topic]');
      if (topicButton) {
        const topic = topicButton.dataset.ruleTopic || topicButton.textContent?.trim() || '규칙';
        this.rulesModal.open(topic);
        return;
      }

      if (!event.target.closest('#gmMobileMenu') && !event.target.closest('[data-role="gm-mobile-menu-toggle"]')) {
        this.closeGmMobileMenu();
      }
    });

    window.addEventListener('popstate', () => {
      this.applyRouteFromLocation().catch(() => {});
    });
  }

  getRouteNameForGame(game) {
    return getRouteNameForGame(game);
  }

  getGameByRouteName(routeName) {
    return getGameByRouteName(this.state.games, routeName);
  }

  navigateToPath(nextPath) {
    if (window.location.pathname === nextPath && !window.location.hash) {
      this.applyRouteFromLocation().catch(() => {});
      return;
    }
    window.history.pushState({}, '', nextPath);
    this.applyRouteFromLocation().catch(() => {});
  }

  navigateToCatalog() {
    this.navigateToPath(buildCatalogPath());
  }

  navigateToGameDetail(gameId) {
    const game = this.state.games.find((item) => item.id === gameId);
    if (!game) {
      this.navigateToCatalog();
      return;
    }
    this.navigateToPath(buildDetailPath(this.getRouteNameForGame(game)));
  }

  navigateToGameGm(gameId) {
    const game = this.state.games.find((item) => item.id === gameId);
    if (!game) {
      this.navigateToCatalog();
      return;
    }
    this.navigateToPath(buildGmPath(this.getRouteNameForGame(game)));
  }

  async applyRouteFromLocation() {
    const route = parseAppRoute(window.location.pathname, window.location.hash);
    if (route.view === 'catalog') {
      if (window.location.hash) {
        window.history.replaceState({}, '', buildCatalogPath());
      }
      this.state.selectedGameId = null;
      this.setView('catalog');
      return;
    }

    const game = this.getGameByRouteName(route.routeName);
    if (!game) {
      this.navigateToCatalog();
      return;
    }

    if (route.view === 'detail') {
      if (window.location.hash) {
        window.history.replaceState({}, '', buildDetailPath(this.getRouteNameForGame(game)));
      }
      this.openGameDetail(game.id);
      return;
    }

    if (route.view === 'gm') {
      if (window.location.hash) {
        window.history.replaceState({}, '', buildGmPath(this.getRouteNameForGame(game)));
      }
      this.state.selectedGameId = game.id;
      await this.enterGame();
      return;
    }

    this.navigateToCatalog();
  }

  openConfirmModal(message, onConfirm) {
    this.confirmModalMessage.innerHTML = message;
    this.state.pendingConfirmAction = typeof onConfirm === 'function' ? onConfirm : null;
    this.confirmModal.classList.remove('hidden');
    this.confirmModal.setAttribute('aria-hidden', 'false');
  }

  closeConfirmModal() {
    this.confirmModal.classList.add('hidden');
    this.confirmModal.setAttribute('aria-hidden', 'true');
    this.state.pendingConfirmAction = null;
  }

  submitConfirmModal() {
    const action = this.state.pendingConfirmAction;
    this.closeConfirmModal();
    if (typeof action === 'function') action();
  }

  openNpcModal() {
    this.npcModal.classList.remove('hidden');
    this.npcModal.setAttribute('aria-hidden', 'false');
  }

  closeNpcModal() {
    this.npcModal.classList.add('hidden');
    this.npcModal.setAttribute('aria-hidden', 'true');
  }

  applyGameTheme(game) {
    if (!this.gameThemeStylesheet) return;
    const href = buildThemeHref(game?.theme);
    if (!href) {
      this.gameThemeStylesheet.removeAttribute('href');
      return;
    }
    this.gameThemeStylesheet.setAttribute('href', href);
  }

  openContactModal() {
    this.state.contactDraft = {
      step: 1,
      type: '',
      gameId: this.state.selectedGameId || '',
    };
    this.renderContactModal();
    this.contactModal.classList.remove('hidden');
    this.contactModal.setAttribute('aria-hidden', 'false');
  }

  closeContactModal() {
    this.contactModal.classList.add('hidden');
    this.contactModal.setAttribute('aria-hidden', 'true');
  }

  selectContactType(type) {
    if (!CONTACT_REQUEST_TYPES[type]) return;
    this.state.contactDraft.type = type;
    this.state.contactDraft.step = 2;
    this.renderContactModal();
  }

  selectContactGame(gameId) {
    if (!this.state.games.some((game) => game.id === gameId)) return;
    this.state.contactDraft.gameId = gameId;
    this.renderContactModal();
  }

  goBackContactStep() {
    this.state.contactDraft.step = getPrevContactStep(this.state.contactDraft.step);
    this.renderContactModal();
  }

  goNextContactStep() {
    this.state.contactDraft.step = getNextContactStep(this.state.contactDraft.step, Boolean(this.state.contactDraft.gameId));
    this.renderContactModal();
  }

  getContactGames() {
    return getContactGames(this.state.games);
  }

  getContactSelectedGame() {
    return getContactSelectedGame(this.state.games, this.state.contactDraft.gameId);
  }

  getContactMailDraft() {
    return buildContactMailDraft(this.state.contactDraft, this.state.games);
  }

  renderContactModal() {
    const { step, type, gameId } = this.state.contactDraft;
    const selectedType = CONTACT_REQUEST_TYPES[type] || null;
    const selectedGame = this.getContactSelectedGame();
    const mailDraft = this.getContactMailDraft();

    this.contactStepBadge.textContent = `${step} / 3`;

    if (step === 1) {
      this.contactStepLead.textContent = '문의 유형을 선택해 주세요.';
      this.contactModalBody.innerHTML = `
        <div class="contact-option-grid">
          ${Object.entries(CONTACT_REQUEST_TYPES).map(([typeKey, config]) => `
            <button class="contact-option-card${type === typeKey ? ' active' : ''}" type="button" data-role="contact-type-select" data-contact-type="${typeKey}">
              <h3 class="contact-option-card-title">${config.label}</h3>
              <p>${config.lead}</p>
            </button>
          `).join('')}
        </div>
      `;
      this.contactModalActions.innerHTML = '';
      return;
    }

    if (step === 2) {
      this.contactStepLead.textContent = '대상 게임을 선택해 주세요.';
      this.contactModalBody.innerHTML = `
        <div class="contact-game-list">
          ${this.getContactGames().map((game) => `
            <button class="contact-game-option${gameId === game.id ? ' active' : ''}" type="button" data-role="contact-game-select" data-game-id="${game.id}">
              <h3 class="contact-game-option-title">${game.name}</h3>
            </button>
          `).join('')}
        </div>
      `;
      this.contactModalActions.innerHTML = `
        <div class="contact-modal-actions-left">
          <button class="contact-secondary-btn" type="button" data-role="contact-back">이전</button>
        </div>
        <div class="contact-modal-actions-right">
          <button class="contact-primary-btn" type="button" data-role="contact-next"${gameId ? '' : ' disabled'}>다음</button>
        </div>
      `;
      return;
    }

    this.contactStepLead.textContent = `${selectedType?.label || '문의'} 메일 작성 안내입니다.`;
    this.contactModalBody.innerHTML = `
      <div class="contact-help-box">
        <h3>${selectedType?.label || '문의'}: ${selectedGame?.name || '-'}</h3>
        ${type === 'takedown' ? `
          <p>권리자 본인 또는 정식 대리인만 요청해 주세요. 아래 정보가 있을수록 확인이 빠릅니다.</p>
          <ul>
            <li>권리자 성명 또는 법인명</li>
            <li>공식 이메일 또는 공식 도메인에서 확인 가능한 연락처</li>
            <li>권리 보유 또는 대리 권한 설명</li>
            <li>삭제를 원하는 정확한 게임명, 화면, 문구, 캡처</li>
            <li>가능한 경우 공식 사이트, 상품 페이지, 권리 고지 링크</li>
          </ul>
        ` : `
          <p>오탈자나 사용성 문제는 캡처와 함께 보내 주시면 확인이 빠릅니다.</p>
          <ul>
            <li>문제가 보이는 화면 캡처</li>
            <li>어떤 점이 불편했는지 또는 어떤 문구가 잘못되었는지</li>
            <li>사용 기기와 브라우저 정보</li>
            <li>가능하면 재현 순서</li>
          </ul>
        `}
        <div class="contact-mail-preview">
          <p class="contact-mail-preview-label">To</p>
          <p class="contact-mail-preview-value">${CONTACT_EMAIL}</p>
        </div>
        <div class="contact-mail-preview">
          <p class="contact-mail-preview-label">Subject</p>
          <p class="contact-mail-preview-value">${mailDraft.subject}</p>
        </div>
        <div class="contact-mail-preview">
          <p class="contact-mail-preview-label">Body</p>
          <p class="contact-mail-preview-value">${mailDraft.body}</p>
        </div>
        <p class="contact-disclaimer">메일 앱이 열리면 필요한 증빙 자료나 캡처 이미지를 첨부해 주세요.</p>
        <p class="contact-disclaimer">기본 메일 앱 또는 메일 핸들러가 설정되지 않은 환경에서는 열리지 않을 수 있습니다.</p>
      </div>
    `;
    this.contactModalActions.innerHTML = `
      <div class="contact-modal-actions-left">
        <button class="contact-secondary-btn" type="button" data-role="contact-back">이전</button>
      </div>
      <div class="contact-modal-actions-right">
        <button class="contact-primary-btn" type="button" data-role="contact-mail-open">메일 앱 열기</button>
      </div>
    `;
  }

  openContactMailDraft() {
    const { subject, body } = this.getContactMailDraft();
    if (!subject) return;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  toggleGmMobileMenu() {
    const willOpen = this.gmMobileMenu?.classList.contains('hidden');
    this.gmMobileMenu?.classList.toggle('hidden', !willOpen);
    this.gmMobileMenu?.setAttribute('aria-hidden', willOpen ? 'false' : 'true');
    this.gmMobileMenuBtn?.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
  }

  closeGmMobileMenu() {
    this.gmMobileMenu?.classList.add('hidden');
    this.gmMobileMenu?.setAttribute('aria-hidden', 'true');
    this.gmMobileMenuBtn?.setAttribute('aria-expanded', 'false');
  }

  setView(view) {
    const platformTitle = document.getElementById('platformTitle');
    const platformSubtitle = document.getElementById('platformSubtitle');
    const catalogTermText = document.getElementById('catalogTermText');
    const detailTermText = document.getElementById('detailTermText');
    const catalogTermActions = document.getElementById('catalogTermActions');
    const detailTermActions = document.getElementById('detailTermActions');

    this.catalogView.classList.toggle('hidden', view !== 'catalog');
    this.detailView.classList.toggle('hidden', view !== 'detail');
    this.gmView.classList.toggle('hidden', view !== 'gm');
    catalogTermText?.classList.toggle('hidden', view !== 'catalog');
    detailTermText?.classList.toggle('hidden', view !== 'detail');
    catalogTermActions?.classList.toggle('hidden', view !== 'catalog');
    detailTermActions?.classList.toggle('hidden', view !== 'detail');

    const isGmView = view === 'gm';
    platformTitle?.classList.toggle('hidden', isGmView);
    platformSubtitle?.classList.toggle('hidden', isGmView);

    if (view === 'catalog') {
      this.applyGameTheme(null);
    }

    if (view !== 'gm') {
      this.closeGmMobileMenu();
    }
  }

  getSortedGames() {
    return getSortedGames(this.state.games, this.state.query, this.state.sort);
  }

  renderCatalog() {
    const games = this.getSortedGames();
    this.gameListEl.innerHTML = '';

    if (games.length === 0) {
      this.gameListEl.innerHTML = '<p class="empty-message">검색 결과가 없습니다.</p>';
      return;
    }

    games.forEach((game) => {
      const card = document.createElement('article');
      card.className = 'game-card';
      card.dataset.role = 'game-open';
      card.dataset.gameId = game.id;
      card.innerHTML = buildCatalogCardMarkup({
        ...game,
        boxImage: normalizeAppPath(game.boxImage, window.location.protocol),
      });
      this.gameListEl.appendChild(card);
    });
  }

  openGameDetail(gameId) {
    this.state.selectedGameId = gameId;
    const game = this.selectedGame;
    if (!game) return;

    this.applyGameTheme(game);

    this.detailTitle.textContent = game.name;
    this.detailPrequel.textContent = game.synopsis || game.prequel || '';
    const groupIconSrc = normalizeAppPath('assets/icons/group.svg', window.location.protocol);
    const timelapseIconSrc = normalizeAppPath('assets/icons/timelapse.svg', window.location.protocol);
    const shoppingCartIconSrc = normalizeAppPath('assets/icons/shopping-cart.svg', window.location.protocol);
    const playerRange = `${game.playerMin}~${game.playerMax}인`;
    const playTimeRange = formatPlayTimeRange(game.durationMin, game.durationMax);
    const purchaseLinkMarkup = game.purchaseLink
      ? `
        <a class="detail-meta-link" href="${game.purchaseLink}" target="_blank" rel="noreferrer noopener">
          <img class="detail-meta-icon" src="${shoppingCartIconSrc}" alt="" aria-hidden="true" />
          <span class="detail-meta-text">구매 사이트</span>
        </a>
      `
      : '';
    this.detailMeta.innerHTML = `
      <p class="detail-meta-item">
        <img class="detail-meta-icon" src="${groupIconSrc}" alt="" aria-hidden="true" />
        <span class="detail-meta-text">${playerRange}</span>
      </p>
      ${playTimeRange ? `
      <p class="detail-meta-item">
        <img class="detail-meta-icon" src="${timelapseIconSrc}" alt="" aria-hidden="true" />
        <span class="detail-meta-text">${playTimeRange}</span>
      </p>` : ''}
      ${purchaseLinkMarkup}
    `;
    this.detailCopyright.textContent = game.copyrightNotice || '';

    if (game.boxImage) {
      this.detailBoxImage.src = normalizeAppPath(game.boxImage, window.location.protocol);
      this.detailBoxImage.classList.remove('hidden');
      this.detailImageFallback.classList.add('hidden');
    } else {
      this.detailBoxImage.classList.add('hidden');
      this.detailImageFallback.classList.remove('hidden');
    }

    this.setView('detail');
  }

  async enterGame() {
    const game = await this.loadGamePackage(this.state.selectedGameId);
    if (!game) return;

    this.applyGameTheme(game);
    this.rulesModal.configure(game);
    await this.slideRenderer.loadGame(game);
    this.bgmController.applyGame(game);
    this.bgmController.updateBySlide(0);
    this.bgmController.startOnUserGesture();
    this.gmCopyright.textContent = game.copyrightNotice || '';
    this.setView('gm');
  }
}

const app = new MultiGameApp();
app.init();
