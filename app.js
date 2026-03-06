const slides = Array.from(document.querySelectorAll('.slide'));
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageNow = document.getElementById('pageNow');
const pageTotal = document.getElementById('pageTotal');
const headerTitle = document.getElementById('headerTitle');
const slidesContainer = document.getElementById('slidesContainer');
const headerRulesBookBtn = document.getElementById('headerRulesBookBtn');
const headerPartInfoBtn = document.getElementById('headerPartInfoBtn');
const headerPartEndBtn = document.getElementById('headerPartEndBtn');
const headerPart2EndBtn = document.getElementById('headerPart2EndBtn');
const rulesModal = document.getElementById('rulesModal');
const rulesModalTitle = document.getElementById('rulesModalTitle');
const rulesModalBody = document.getElementById('rulesModalBody');
const rulesModalTabs = document.getElementById('rulesModalTabs');
const rulesInlineBody = document.getElementById('rulesInlineBody');
const inlineRuleTabs = Array.from(document.querySelectorAll('[data-role="inline-rule-tab"]'));
const modalRuleTabs = Array.from(document.querySelectorAll('[data-role="modal-rule-tab"]'));
const npcModal = document.getElementById('npcModal');
const confirmModal = document.getElementById('confirmModal');
const confirmModalMessage = document.getElementById('confirmModalMessage');

let pendingConfirmAction = null;
let activeRuleTabKey = 'P';

const PART1_START_INDEX = 8;
const PART1_END_INDEX = 19;
const PART2_START_INDEX = 24;
const PART2_END_INDEX = 35;
const RULE_TAB_TOPIC_MAP = {
  P: '능력과 파워',
  S: '승점',
  R: '전체',
};

const RULE_CONTENT_MAP = {
  '행선지 상의 및 결정': `
    <div class="part-rule-preview">
      <p class="rule-lead">
        <strong>저택 1F 지도를 보며</strong>, 모두 함께 이번 라운드에 갈 장소를 상의합니다.
      </p>

      <div class="rule-block">
        <h4>기본 정보</h4>
        <p>저택 1F에는 <code>a~j</code> 알파벳이 붙은 방들이 있습니다. 대략적인 위치는 문 배치나 외관으로 짐작할 수 있지만, 각 방이 어떤 공간인지는 아직 밝혀지지 않았습니다.</p>
        <p>처음부터 확정된 장소는 <strong>a(응접실)</strong>과 <strong>홀</strong>뿐입니다.</p>
      </div>

      <div class="rule-block">
        <h4>탐색 규칙</h4>
        <ul>
          <li>한 라운드에 각 플레이어는 <strong>1곳</strong>만 탐색할 수 있습니다.</li>
          <li>같은 장소에 여러 명이 모이면 <strong>협력 탐색</strong>이 가능합니다.</li>
          <li>인원이 부족하면 조사하기 어려운 장소나, 특정 능력이 필요한 장소도 있습니다.</li>
        </ul>
      </div>

      <div class="rule-block leader-block">
        <h4>리더 결정</h4>
        <p>저택 내 최종 탐색 배정은 <strong>리더</strong>가 결정합니다. 첫 리더는 <span class="name-collector">[수집가]</span>입니다.</p>
        <p class="rule-note">"최연장자를 존중하자"는 강한 주장에 모두가 동의했다는 설정입니다.</p>
        <p><strong>최종 결정권은 리더에게 있습니다.</strong></p>
      </div>
    </div>
  `,
  '탐색 및 정보 공유': `
    <div class="part-rule-preview">

      <div class="rule-block">
        <h4>탐색 기본 절차</h4>
        <p>행선지 배정이 끝나면, 각자 탐색할 방의 카드 더미에서 맨 위 카드를 확인합니다. (처음에는 보통 알파벳만 적힌 카드입니다.) 카드에는 해당 방의 정보와 획득 가능한 단서가 적혀 있으며, 이후 처리는 카드 지시에 따릅니다.</p>
        <p>카드 조건을 충족하면 한 번의 탐색으로 연속해 여러 장의 카드를 획득할 수도 있습니다.</p>
        <p>다만 카드 획득 지시가 있어도, 해당 카드가 이미 누군가에게 획득되어 테이블 위에 없다면 그 카드는 얻을 수 없습니다.</p>
      </div>

      <div class="rule-block">
        <h4>카드 지시 종류</h4>
        <ul>
          <li><strong>「마당에 남긴다」</strong>: 조사 후 앞면(내용 공개 상태)으로 테이블에 되돌립니다.</li>
          <li><strong>「손패로 추가한다」</strong>: 해당 방을 탐색한 캐릭터가 손패로 추가합니다. 여러 명이 함께 탐색했다면 상의해 1명이 획득합니다. 합의가 어려우면 홀로 돌아간 뒤, 그 시점 리더가 결정합니다.</li>
          <li><strong>「버린 패」</strong>: 카드에 적힌 처리를 마친 뒤 게임 상자로 되돌립니다.</li>
        </ul>
      </div>

      <div class="rule-block">
        <h4>여러 명이 함께 탐색할 때</h4>
        <p>같은 방에 있는 인원은 카드 내용을 공유합니다. 단, 캐릭터 고유 능력이 필요한 카드라면 먼저 해당 능력을 가진 캐릭터가 카드를 확인합니다.</p>
        <p>이후 공개 여부, 카드 전달 여부는 그 카드 획득과 연계된 능력 캐릭터를 담당하는 플레이어의 판단에 따릅니다.</p>
      </div>

      <div class="rule-block">
        <h4>밀담과 정보 교환</h4>
        <p>탐색 시간에는 같은 방을 조사 중인 캐릭터끼리 자유롭게 밀담할 수 있습니다. 다만 이미 3명이 함께 탐색 중인 상황에서 1명을 배제하거나 소외시키는 방식은 허용되지 않습니다.</p>
        <p>탐색과 밀담이 끝나면 자리로 돌아옵니다. 이는 <strong>홀로 돌아온 상태</strong>를 의미합니다. 돌아온 인원끼리 제한 시간 안에 가능한 많은 정보를 교환하는 것이 중요합니다.</p>
      </div>

      <div class="rule-block rule-example-box">
        <h4>예시</h4>
        <p>[신문 기자]와 [저택 주인 아들]이 x방을 함께 탐색한다고 가정합니다. (실제 본편에는 x방이 없습니다.)</p>
        <p>x방 카드에는 <code>고문실 / 합계 파워 5 이상이면 [x_정보1] 획득 / 마당에 남긴다</code>라고 적혀 있습니다. 두 캐릭터의 파워가 각각 3이라면 합계 6이므로 [x_정보1]을 확인합니다.</p>
        <p>[x_정보1]에 <code>아이템 「양초」 / 파워 +1 / 소지 캐릭터에게 「손재주」가 있으면 [x_정보2] 획득 / 손패로 추가</code>라고 적혀 있고, 두 사람 모두 「손재주」가 없다면 [x_정보2]는 획득하지 못합니다.</p>
        <p>상의 끝에 「양초」를 [저택 주인 아들]이 가져가 손패로 추가합니다. 이후 두 사람은 홀로 돌아와, 다른 인원의 정보와 합쳐 다음 단서를 추적합니다.</p>
      </div>
    </div>
  `,
  '행선지 상의 및 결정(3분)': `
    <div class="part-rule-preview">
      <p class="rule-lead">맵을 보며 이번 라운드의 행선지를 상의합니다. 기본 흐름은 파트 1과 같습니다.</p>

      <div class="rule-block">
        <h4>선택 가능한 행선지</h4>
        <p>다만, 파트 2에서는 처음부터 모든 방을 선택할 수 없습니다. 예를 들어 <strong>파트 2의 1라운드</strong>에서는 <code>A</code> 또는 <code>B</code>가 적힌 문 너머만 조사할 수 있습니다.</p>
        <p>이후 라운드에서도 <strong>이미 탐색해 공개된 방</strong> 또는 <strong>현재 조사 중인 방과 이어진 문 너머</strong>만 행선지로 선택할 수 있습니다.</p>
        <p class="rule-note">즉, 라운드가 진행될수록 조사 가능한 장소 선택지가 점차 늘어납니다.</p>
      </div>

      <div class="rule-block">
        <h4>리더 결정과 맵 배치</h4>
        <p>파트 1과 마찬가지로, 각 캐릭터의 최종 행선지는 <strong>리더</strong>가 결정합니다.</p>
        <p>행선지가 정해졌는데 해당 방 카드가 아직 맵 위에 없다면, 먼저 대응하는 <strong>지도 카드(알파벳 A~K)</strong>를 뒤집어 맵에 배치해 주세요.</p>
        <p>백지도 위에 카드 도안이 맞물리도록 정렬해서 놓으면, 해당 공간이 어떤 방인지 확인할 수 있습니다.</p>
      </div>
    </div>
  `,
  '탐색과 정보 공유(15분)': `
    <div class="part-rule-preview">
      <p class="rule-lead">기본 절차는 파트 1과 같습니다.</p>

      <div class="rule-block">
        <h4>탐색 진행</h4>
        <p>맵을 참고해 해당 방 이름의 방 카드를 가져오고, 카드 내용에 따라 탐색을 진행합니다.</p>
      </div>

      <div class="rule-block">
        <h4>탐색 종료 후</h4>
        <p>탐색이 끝났다면 착석해 주세요. 해당 캐릭터는 <strong>「계단」으로 돌아온 상태</strong>로 취급합니다.</p>
      </div>
    </div>
  `,
  '다음 라운드 리더 지명(1분)': `
    <div class="part-rule-preview">
      <p class="rule-lead">기본 절차는 파트 1과 같습니다.</p>

      <div class="rule-block">
        <h4>지명 원칙</h4>
        <p>아직 리더를 맡지 않은 캐릭터를 우선 지명합니다.</p>
      </div>

      <div class="rule-block">
        <h4>한 바퀴 이후</h4>
        <p>모든 캐릭터가 한 번씩 리더를 맡았다면, 이후에는 이전에 리더를 맡았던 캐릭터도 다시 선택할 수 있습니다.</p>
      </div>
    </div>
  `,
  '능력과 파워': `
    <h3>능력과 파워</h3>
    <p>캐릭터마다 고유한 <strong>능력</strong>이 있습니다. 저택을 탐색하는 과정에서, 해당 능력이 있으면 추가 정보를 얻을 수 있는 경우가 있습니다. 게임 중 카드 등으로 능력 사용이 지정되면, 그 지시에 따라 처리해 주세요.</p>
    <p>또한 각 캐릭터에게는 <strong>파워</strong>라는 능력치가 설정되어 있습니다. 모든 캐릭터의 초기 파워 기본 수치는 <strong>3</strong>입니다.</p>
    <h3>파워에 대하여</h3>
    <p>⊚ 파워는 기력, 생명력, 악마에 대한 저항력, 건강 상태, 정신력 등을 종합한 능력치이며, 저택 탐색 중 여러 상황에서 사용됩니다.</p>
    <p>⊚ 파워 기본 수치의 초기값은 <strong>3</strong>이지만, 전개에 따라 증감합니다. 기본 수치는 공개 정보이므로, 탐색 중 감소하거나 회복했다면 반드시 다른 플레이어에게 알려 주세요.</p>
    <p>⊚ 아이템에 따라 파워에 <strong>플러스 수정</strong>이 적용될 수 있습니다. 수정을 적용하려면, 같은 장소에 있는 캐릭터들에게 해당 아이템 카드를 공개해 주세요. 아이템 소지를 알리고 싶지 않다면, 아이템 수정을 적용하지 않은 수치를 선언해도 됩니다.</p>
    <p>⊚ 저택 탐색 중 파워 기본 수치가 감소할 때, 손패의 <code>파워 +O</code> 효과 아이템을 공개하고 버리면(게임에서 제외, 상자로 되돌림), 기본 수치 감소를 경감할 수 있습니다. 예: <code>파워 -2</code> 효과를 받을 때 <code>파워 +1</code> 아이템을 버리면, 최종적으로 파워는 1만 감소합니다.</p>
    <p>⊚ 파워 기본 수치가 <strong>0</strong>이 되면, 캐릭터는 정신 기능 저하 또는 육체적 손상 등의 이유로 쓰러집니다. 즉시 자신의 캐릭터에 해당하는 <strong>파워 0 카드</strong>를 가져와 지시에 따르세요.</p>
    <p>⊚ 이후 획득하는 아이템 카드의 <code>파워 +@</code> 수정은, 파워 기본 수치를 <strong>0에서 초기 상태로 회복시키는 효과가 아닙니다.</strong> (파워 감소를 경감하기 위해 아이템을 버리는 것은 가능하지만, 0에서 초기 상태로 회복되지는 않습니다.) <code>파워 0 카드</code>를 가져온 뒤, 아이템 카드 수정을 적용합니다.</p>
  `,
  '승점': `
    <h3>승점에 대하여</h3>
    <p>캐릭터 설정서에는 각 캐릭터의 <strong>승점 조건</strong>이 기재되어 있습니다. 승점은 <strong>게임 종료 시</strong>, 해당 조건을 만족했을 때 획득하는 점수입니다.</p>
    <p>다만 이 작품의 가장 큰 목적은 <strong>참가자들이 함께 이야기를 만들어 가는 것</strong>입니다. 승패에만 집중하기보다, 이야기 속 인물이 되어 <strong>서사를 즐기며 플레이</strong>하는 것을 권장합니다.</p>
  `,
  '전체': `
    <h3>전체 규칙</h3>

    <h3>1. 거짓말에 대하여</h3>
    <p>거짓말을 해도 괜찮습니다. 다만, <strong>카드 획득 조건과 관련된 자신의 파워 수치</strong>, <strong>캐릭터 능력 적용 여부</strong>는 반드시 사실대로 선언해 주세요.</p>

    <h3>2. 손패 취급</h3>
    <p>손패의 <strong>뒷면</strong>(알파벳/카드명이 적힌 면)은 <strong>공개 정보</strong>입니다. 다른 플레이어가 손패 뒷면 공개를 요청하면 보여줘야 합니다.</p>
    <p>손패의 <strong>양도 및 공개</strong>는 라운드 중 언제든 가능하지만, <strong>같은 장소에 있는 경우에만</strong> 가능합니다. 단, 양도/공개가 불가능한 카드는 카드 텍스트의 지시를 우선합니다. 또한 손패 <strong>상한은 없습니다</strong>.</p>

    <h3>3. 타임</h3>
    <p>규칙상 의문이 생기면 누구나 <strong>타임</strong>을 선언할 수 있습니다. 타임이 선언되면 해당 페이즈의 시간 진행을 멈추고, 규칙서를 다시 확인해 의문점을 해결해 주세요.</p>
    <p>규칙서만으로 해결되지 않는 경우에는 <strong>모든 플레이어가 협의하여</strong> 처리합니다.</p>

    <h3>4. 설정서 취급</h3>
    <p>캐릭터 설정서는 <strong>해당 플레이어만 열람</strong>할 수 있습니다. 설정서 내용을 다른 플레이어에게 직접 보여주면 안 됩니다.</p>
    <p>또한 설정서 문장을 그대로 읽기보다, <strong>자신의 말로 풀어서 전달</strong>해 주세요. 예: <code>기억을 더듬어 볼게요.</code></p>
  `,
};

function isConfirmModalOpen() {
  return Boolean(confirmModal) && !confirmModal.classList.contains('hidden');
}

function openConfirmModal(message, onConfirm) {
  if (!confirmModal || !confirmModalMessage) {
    if (typeof onConfirm === 'function') {
      onConfirm();
    }
    return;
  }

  confirmModalMessage.innerHTML = message;
  pendingConfirmAction = typeof onConfirm === 'function' ? onConfirm : null;
  confirmModal.classList.remove('hidden');
  confirmModal.setAttribute('aria-hidden', 'false');
}

function closeConfirmModal() {
  if (!confirmModal) {
    return;
  }

  confirmModal.classList.add('hidden');
  confirmModal.setAttribute('aria-hidden', 'true');
  pendingConfirmAction = null;
}

function submitConfirmModal() {
  const action = pendingConfirmAction;
  closeConfirmModal();
  if (typeof action === 'function') {
    action();
  }
}

function isPart1Slide(index) {
  return index >= PART1_START_INDEX && index <= PART1_END_INDEX;
}

function isPart2Slide(index) {
  return index >= PART2_START_INDEX && index <= PART2_END_INDEX;
}

function getPart2StartIndex() {
  const index = slides.findIndex((slide) => slide.dataset.partAnchor === 'part2-start');
  return index;
}

function getPart3StartIndex() {
  const index = slides.findIndex((slide) => slide.dataset.partAnchor === 'part3-start');
  return index;
}

function openPart2EnterConfirm() {
  const message = '<strong class="confirm-primary-line">이야기 카드 A</strong>가 공개되었습니까?<br><span class="confirm-warning-line">파트 2</span>로 진입합니다.';
  openConfirmModal(message, () => {
    const part2Index = getPart2StartIndex();
    if (part2Index >= 0) {
      renderSlide(part2Index);
    }
  });
}

function openPart3EnterConfirm() {
  const message = '<strong class="confirm-primary-line">이야기 카드 B</strong>가 공개되었습니까?<br><span class="confirm-warning-line">파트 3</span>로 진입합니다.';
  openConfirmModal(message, () => {
    const part3Index = getPart3StartIndex();
    if (part3Index >= 0) {
      renderSlide(part3Index);
    }
  });
}

function extractPartActionTitle(title) {
  return (title || '').replace(/^\[(?:Part|파트)\s*\d+\]\s*(?:\d+\s*(?:Round|Rount|라운드)|(?:Round|Rount|라운드)\s*\d+):\s*/i, '').trim();
}

function extractPartRoundText(title) {
  const text = title || '';
  const matchNumberFirst = text.match(/^\[(?:Part|파트)\s*\d+\]\s*(\d+)\s*(?:Round|Rount|라운드):/i);
  if (matchNumberFirst) {
    return `라운드 ${matchNumberFirst[1]}`;
  }

  const matchWordFirst = text.match(/^\[(?:Part|파트)\s*\d+\]\s*(?:Round|Rount|라운드)\s*(\d+):/i);
  return matchWordFirst ? `라운드 ${matchWordFirst[1]}` : '';
}

function updateTimerActionLabel(slideEl, partInfoTitle) {
  if (!slideEl) {
    return;
  }

  const timerWidget = slideEl.querySelector('.timer-widget');
  if (!timerWidget) {
    return;
  }

  let roundEl = slideEl.querySelector('.timer-round-label');
  let actionEl = slideEl.querySelector('.timer-action-label');
  const roundText = extractPartRoundText(partInfoTitle);
  const actionTitle = extractPartActionTitle(partInfoTitle);

  if (!actionTitle) {
    if (roundEl) {
      roundEl.remove();
    }
    if (actionEl) {
      actionEl.remove();
    }
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
function isRulesModalOpen() {
  return Boolean(rulesModal) && !rulesModal.classList.contains('hidden');
}

function isNpcModalOpen() {
  return Boolean(npcModal) && !npcModal.classList.contains('hidden');
}

function isAnyModalOpen() {
  return isRulesModalOpen() || isNpcModalOpen() || isConfirmModalOpen();
}

function openNpcModal() {
  if (!npcModal) {
    return;
  }

  npcModal.classList.remove('hidden');
  npcModal.setAttribute('aria-hidden', 'false');
}

function closeNpcModal() {
  if (!npcModal) {
    return;
  }

  npcModal.classList.add('hidden');
  npcModal.setAttribute('aria-hidden', 'true');
}

function getRuleTopicByKey(ruleKey) {
  return RULE_TAB_TOPIC_MAP[ruleKey] || '';
}

function getRuleKeyByTopic(topic) {
  return Object.keys(RULE_TAB_TOPIC_MAP).find((key) => RULE_TAB_TOPIC_MAP[key] === topic) || '';
}

function setRuleTabState(buttons, activeKey) {
  buttons.forEach((button) => {
    const isActive = button.dataset.ruleKey === activeKey;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });
}

function renderInlineRules(ruleKey) {
  const topic = getRuleTopicByKey(ruleKey);
  if (!topic || !rulesInlineBody) {
    return;
  }

  activeRuleTabKey = ruleKey;
  setRuleTabState(inlineRuleTabs, ruleKey);
  rulesInlineBody.innerHTML = RULE_CONTENT_MAP[topic] || '<p>규칙 텍스트는 차후 삽입 예정</p>';
}

function renderRulesModalRuleTab(ruleKey) {
  const topic = getRuleTopicByKey(ruleKey);
  if (!topic || !rulesModalBody || !rulesModalTitle) {
    return;
  }

  activeRuleTabKey = ruleKey;
  rulesModalTitle.textContent = '규칙';
  rulesModalBody.innerHTML = RULE_CONTENT_MAP[topic] || '<p>규칙 텍스트는 차후 삽입 예정</p>';
  setRuleTabState(modalRuleTabs, ruleKey);
}

function openRulesModal(topic, options = {}) {
  if (!rulesModal || !rulesModalTitle || !rulesModalBody || !rulesModalTabs) {
    return;
  }

  const tabKeyByTopic = getRuleKeyByTopic(topic);
  const forceTabbed = options.forceTabbed === true;
  const useTabbedMode = forceTabbed || Boolean(tabKeyByTopic);

  rulesModalTabs.classList.toggle('hidden', !useTabbedMode);
  if (useTabbedMode) {
    const resolvedKey = options.ruleKey || tabKeyByTopic || activeRuleTabKey || 'P';
    renderRulesModalRuleTab(resolvedKey);
  } else {
    rulesModalTitle.textContent = topic;
    rulesModalBody.innerHTML = RULE_CONTENT_MAP[topic] || '<p>규칙 텍스트는 차후 삽입 예정</p>';
  }

  rulesModal.classList.remove('hidden');
  rulesModal.setAttribute('aria-hidden', 'false');
}

function closeRulesModal() {
  if (!rulesModal) {
    return;
  }

  rulesModal.classList.add('hidden');
  rulesModal.setAttribute('aria-hidden', 'true');
}

function setupRulesModal() {
  document.addEventListener('click', (event) => {
    const inlineRuleTabTarget = event.target.closest('[data-role="inline-rule-tab"]');
    if (inlineRuleTabTarget) {
      const ruleKey = inlineRuleTabTarget.dataset.ruleKey;
      if (ruleKey) {
        renderInlineRules(ruleKey);
      }
      return;
    }

    const modalRuleTabTarget = event.target.closest('[data-role="modal-rule-tab"]');
    if (modalRuleTabTarget) {
      const ruleKey = modalRuleTabTarget.dataset.ruleKey;
      if (ruleKey) {
        renderRulesModalRuleTab(ruleKey);
      }
      return;
    }

    const rulesCloseTarget = event.target.closest('[data-role="rules-modal-close"]');
    if (rulesCloseTarget) {
      closeRulesModal();
      return;
    }

    const npcCloseTarget = event.target.closest('[data-role="npc-modal-close"]');
    if (npcCloseTarget) {
      closeNpcModal();
      return;
    }

    const confirmCancelTarget = event.target.closest('[data-role="confirm-cancel"]');
    if (confirmCancelTarget) {
      closeConfirmModal();
      return;
    }

    const confirmOkTarget = event.target.closest('[data-role="confirm-ok"]');
    if (confirmOkTarget) {
      submitConfirmModal();
      return;
    }

    const npcOpenTarget = event.target.closest('[data-role="npc-open"]');
    if (npcOpenTarget) {
      openConfirmModal('NPC 캐릭터가 공개됩니다.', () => openNpcModal());
      return;
    }

    const partInfoOpenTarget = event.target.closest('[data-role="part-info-open"]');
    if (partInfoOpenTarget) {
      const activeSlide = slides[currentIndex];
      const partInfoTopic = activeSlide?.dataset.partInfoTopic;
      const partInfoTitle = activeSlide?.dataset.partInfoTitle;
      const actionTitle = partInfoTopic || extractPartActionTitle(partInfoTitle);
      if (actionTitle) {
        openRulesModal(actionTitle);
      }
      return;
    }

    const partEndOpenTarget = event.target.closest('[data-role="part-end-open"]');
    if (partEndOpenTarget) {
      openPart2EnterConfirm();
      return;
    }

    const part2EndOpenTarget = event.target.closest('[data-role="part2-end-open"]');
    if (part2EndOpenTarget) {
      openPart3EnterConfirm();
      return;
    }

    const rulesBookOpenTarget = event.target.closest('[data-role="rules-book-open"]');
    if (rulesBookOpenTarget) {
      openRulesModal(getRuleTopicByKey(activeRuleTabKey), { forceTabbed: true, ruleKey: activeRuleTabKey });
      return;
    }

    const topicButton = event.target.closest('[data-rule-topic]');
    if (topicButton) {
      const topic = topicButton.dataset.ruleTopic || topicButton.textContent?.trim() || '占쏙옙칙';
      openRulesModal(topic);
    }
  });
}

pageTotal.textContent = String(slides.length);

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
    if (!this.activeWidget) {
      return;
    }

    this.activeWidget.onTick();
  }

  pauseIfSlideChanged(activeSlide) {
    if (!this.activeWidget) {
      return;
    }

    if (this.activeWidget.slideEl !== activeSlide) {
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
  constructor(rootEl, manager) {
    this.rootEl = rootEl;
    this.manager = manager;
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
    this.toggleBtn.addEventListener('click', () => {
      if (this.endAtMs) {
        this.pause();
      } else {
        this.play();
      }
    });

    this.plusBtn.addEventListener('click', () => {
      this.adjustRemainingSeconds(60);
    });

    this.minusBtn.addEventListener('click', () => {
      if (this.remainingSeconds <= 60) {
        const message = '<strong class="confirm-primary-line">타이머를 종료</strong>하시겠습니까?<br><span class="confirm-warning-line">남은 시간이 즉시 00:00으로 변경됩니다.</span>';
        openConfirmModal(message, () => {
          this.finish();
        });
        return;
      }

      this.adjustRemainingSeconds(-60);
    });
  }

  adjustRemainingSeconds(deltaSeconds) {
    this.hideOverlay();
    this.remainingSeconds = Math.max(0, this.remainingSeconds + deltaSeconds);

    if (this.endAtMs) {
      this.endAtMs += deltaSeconds * 1000;
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
    this.displayEl.textContent = this.formatTime(Math.max(0, this.remainingSeconds));
  }

  setRunningState(isRunning) {
    if (!this.toggleBtn) {
      return;
    }

    this.toggleBtn.setAttribute('aria-pressed', isRunning ? 'true' : 'false');
    this.toggleBtn.textContent = isRunning ? '일시정지' : '시작';
  }

  hideOverlay() {
    this.overlayEl.classList.add('hidden');
  }

  showOverlay() {
    this.overlayEl.classList.remove('hidden');
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
const timerManager = new TimerManager();
const timerWidgets = Array.from(document.querySelectorAll('[data-timer-widget]'))
  .map((el) => new TimerWidget(el, timerManager));

let currentIndex = 0;
function decorateStoryText() {
  const storyTextEl = document.querySelector('.story-slide .scrollable-text');
  if (!storyTextEl) {
    return;
  }

  const nameClassMap = {
    '[수집가]': 'story-name-collector',
    '[영매 소녀]': 'story-name-medium',
    '[정신과의]': 'story-name-psychiatrist',
    '[저택 주인 아들]': 'story-name-son',
    '[건축가]': 'story-name-architect',
    '[신문 기자]': 'story-name-reporter',
  };

  let html = storyTextEl.innerHTML;
  html = html.replace(/신문 기사/g, '신문 기자');

  Object.entries(nameClassMap).forEach(([name, className]) => {
    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapedName, 'g');
    html = html.replace(regex, `<span class="story-name ${className}">${name}</span>`);
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

function captureRuleRectMap(elements) {
  const map = new Map();
  elements.forEach((el) => {
    const key = el.dataset.ruleKey;
    if (!key) {
      return;
    }

    map.set(key, {
      label: (el.textContent || '').trim(),
      rect: el.getBoundingClientRect(),
    });
  });

  return map;
}

function buildHeroPairsToSingleTarget(sourceMap, targetElement) {
  if (!targetElement) {
    return [];
  }

  const toRect = targetElement.getBoundingClientRect();
  const pairs = [];

  sourceMap.forEach((source, key) => {
    pairs.push({
      key,
      label: source.label,
      fromRect: source.rect,
      toRect,
      targetBtn: targetElement,
    });
  });

  return pairs;
}

function buildHeroPairsFromRectToTargets(sourceRect, sourceLabel, targetElements) {
  if (!sourceRect) {
    return [];
  }

  return targetElements.map((targetElement, index) => ({
    key: `${index}`,
    label: sourceLabel,
    fromRect: sourceRect,
    toRect: targetElement.getBoundingClientRect(),
    targetBtn: targetElement,
  }));
}

function playRuleHero(pairs) {
  if (!pairs || pairs.length === 0) {
    return;
  }

  const layer = document.createElement('div');
  layer.className = 'rule-hero-layer';
  document.body.appendChild(layer);

  const targetPendingCount = new Map();
  pairs.forEach((pair) => {
    targetPendingCount.set(pair.targetBtn, (targetPendingCount.get(pair.targetBtn) || 0) + 1);
  });
  targetPendingCount.forEach((_, targetElement) => {
    targetElement.classList.add('rule-hero-hidden');
  });

  let doneCount = 0;
  pairs.forEach((pair) => {
    const chip = document.createElement('div');
    chip.className = 'rule-hero-chip';
    chip.textContent = pair.label;

    chip.style.left = `${pair.fromRect.left}px`;
    chip.style.top = `${pair.fromRect.top}px`;
    chip.style.width = `${pair.fromRect.width}px`;
    chip.style.height = `${pair.fromRect.height}px`;

    layer.appendChild(chip);

    requestAnimationFrame(() => {
      const dx = pair.toRect.left - pair.fromRect.left;
      const dy = pair.toRect.top - pair.fromRect.top;
      const sx = pair.toRect.width / Math.max(pair.fromRect.width, 1);
      const sy = pair.toRect.height / Math.max(pair.fromRect.height, 1);

      chip.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
      chip.style.opacity = '0.9';
    });

    chip.addEventListener('transitionend', () => {
      chip.remove();
      const currentPending = targetPendingCount.get(pair.targetBtn) || 0;
      const nextPending = Math.max(0, currentPending - 1);
      targetPendingCount.set(pair.targetBtn, nextPending);
      if (nextPending === 0) {
        pair.targetBtn.classList.remove('rule-hero-hidden');
      }
      doneCount += 1;
      if (doneCount === pairs.length) {
        layer.remove();
      }
    }, { once: true });
  });
}

function renderSlide(index) {
  const previousIndex = currentIndex;

  const isHeroUp = previousIndex === 5 && index === 6;
  const isHeroDown = previousIndex === 6 && index === 5;
  let sourceMap = null;
  let bookHeroSourceRect = null;
  let bookHeroSourceLabel = '규칙';

  if (isHeroUp) {
    const sourceButtons = Array.from(slides[5].querySelectorAll('[data-role="inline-rule-tab"]'));
    sourceMap = captureRuleRectMap(sourceButtons);
  }

  if (isHeroDown && headerRulesBookBtn) {
    bookHeroSourceRect = headerRulesBookBtn.getBoundingClientRect();
    bookHeroSourceLabel = (headerRulesBookBtn.getAttribute('aria-label') || '규칙').trim();
  }

  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
  });

  currentIndex = index;
  pageNow.textContent = String(index + 1);

    const titleText = slides[index].dataset.title || slides[index].querySelector('h1')?.textContent;
  const partInfoTitle = slides[index].dataset.partInfoTitle || '';
  updateTimerActionLabel(slides[index], partInfoTitle);

  if (headerPartInfoBtn) {
    const showPartInfo = Boolean(slides[index]?.dataset.partInfoTitle || slides[index]?.dataset.partInfoTopic);
    headerPartInfoBtn.classList.toggle('hidden', !showPartInfo);
    headerPartInfoBtn.setAttribute('aria-hidden', showPartInfo ? 'false' : 'true');
  }
  

  if (headerPartEndBtn) {
    const showPartEndButton = isPart1Slide(index);
    headerPartEndBtn.classList.toggle('hidden', !showPartEndButton);
  }

  if (headerPart2EndBtn) {
    const showPart2EndButton = isPart2Slide(index);
    headerPart2EndBtn.classList.toggle('hidden', !showPart2EndButton);
  }

  if (headerRulesBookBtn) {
    headerRulesBookBtn.style.display = index >= 6 ? 'inline-flex' : 'none';
  }
  if (titleText && headerTitle) {
    headerTitle.textContent = titleText;
  }

  timerManager.pauseIfSlideChanged(slides[index]);

  if ((sourceMap && isHeroUp) || (bookHeroSourceRect && isHeroDown)) {
    requestAnimationFrame(() => {
      let pairs = [];
      if (isHeroUp && sourceMap && headerRulesBookBtn) {
        pairs = buildHeroPairsToSingleTarget(sourceMap, headerRulesBookBtn);
      }
      if (isHeroDown && bookHeroSourceRect) {
        const targetTabs = Array.from(slides[5].querySelectorAll('[data-role="inline-rule-tab"]'));
        pairs = buildHeroPairsFromRectToTargets(bookHeroSourceRect, bookHeroSourceLabel, targetTabs);
      }
      playRuleHero(pairs);
    });
  }
}
function goPrev() {
  if (currentIndex > 0) {
    renderSlide(currentIndex - 1);
  }
}

function goNext() {
  if (currentIndex === PART1_END_INDEX) {
    openPart2EnterConfirm();
    return;
  }

  if (currentIndex === PART2_END_INDEX) {
    openPart3EnterConfirm();
    return;
  }

  if (currentIndex < slides.length - 1) {
    renderSlide(currentIndex + 1);
  }
}

prevBtn.addEventListener('click', goPrev);
nextBtn.addEventListener('click', goNext);

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && isAnyModalOpen()) {
    closeRulesModal();
    closeNpcModal();
    closeConfirmModal();
    return;
  }

  if (isAnyModalOpen()) {
    return;
  }
  if (event.key === 'ArrowLeft') {
    goPrev();
  }

  if (event.key === 'ArrowRight') {
    goNext();
  }
});

let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;
let touchFromScrollable = false;

slidesContainer.addEventListener('touchstart', (event) => {
  if (isAnyModalOpen()) {
    return;
  }
  const touch = event.changedTouches[0];
  touchStartX = touch.screenX;
  touchStartY = touch.screenY;
  touchFromScrollable = Boolean(event.target.closest('.scrollable-text'));
});

slidesContainer.addEventListener('touchend', (event) => {
  if (isAnyModalOpen()) {
    return;
  }
  if (touchFromScrollable) {
    touchFromScrollable = false;
    return;
  }

  const touch = event.changedTouches[0];
  touchEndX = touch.screenX;
  touchEndY = touch.screenY;
  const diffX = touchStartX - touchEndX;
  const diffY = touchStartY - touchEndY;

  if (Math.abs(diffX) < 50 || Math.abs(diffX) <= Math.abs(diffY)) {
    return;
  }

  if (diffX > 0) {
    goNext();
  } else {
    goPrev();
  }
});

document.addEventListener('visibilitychange', () => {
  timerManager.pauseOnTabHidden();
});

decorateStoryText();
setupRulesModal();
renderInlineRules(activeRuleTabKey);
closeRulesModal();
closeNpcModal();
closeConfirmModal();
document.body.classList.remove('modal-open');
renderSlide(0);
