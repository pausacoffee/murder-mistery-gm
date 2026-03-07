
const RULE_TAB_TOPIC_MAP = {
  P: '능력과 파워',
  S: '승점',
  R: '전체',
};

const BUNGA_RULE_CONTENT_MAP = {
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
  '인물 관찰 및 정보 공유': `
    <div class="part-rule-preview">

      <div class="rule-block">
        <h4>기본 진행</h4>
        <p>사정은 각자 다르지만, 모든 캐릭터는 특정 인물에 주목해 관찰을 진행합니다.</p>
        <p>각자 <strong>캐릭터 정보 카드 1장</strong>을 선택해 손패에 추가합니다. 단, <strong>자신의 정보 카드</strong>는 획득할 수 없습니다. (자신의 정보는 설정서에 기재되어 있습니다.)</p>
      </div>

      <div class="rule-block">
        <h4>획득 충돌 시</h4>
        <p>카드 획득은 동시에 진행되지만, 남은 카드가 1장뿐인데 동일 카드를 원하는 인원이 겹치면, 해당 라운드의 <strong>리더</strong>가 최종 획득자를 결정합니다.</p>
      </div>

      <div class="rule-block">
        <h4>정보 교환과 해석 주의</h4>
        <p>카드 획득 후에는 자유롭게 정보를 교환합니다. 다만 인물 관찰로 얻는 것은 <strong>정보</strong>라는 점에 유의해 주세요.</p>
        <p>예를 들어 정보 카드에 「알 없는 안경」이라고 적혀 있어도, 그것은 해당 사실을 알게 되는 것이지 아이템을 실제로 획득한 것은 아닙니다.</p>
      </div>

      <div class="rule-block">
        <h4>밀담 운영</h4>
        <p>이 페이즈 동안 특정 인원과 별도 밀담을 원하면, 손을 들어 신호한 뒤 자리를 벗어나 대화해도 됩니다. 인원 제한은 없습니다.</p>
        <p>단, 밀담 그룹이 여러 개로 갈릴 때는 누군가 한 명만 고립되지 않도록 조정해 주세요.</p>
      </div>
    </div>
  `,
  '다음 라운드 리더 지명': `
    <div class="part-rule-preview">
      <p class="rule-lead"><strong>다음 라운드 리더 지명</strong></p>

      <div class="rule-block">
        <h4>기본 원칙</h4>
        <p>현재 리더는 다음 라운드의 리더가 될 캐릭터를 지명합니다.</p>
        <p>지명 순서는 <strong>아직 리더를 맡지 않은 플레이어</strong>를 우선합니다.</p>
      </div>

      <div class="rule-block">
        <h4>시간 내 미결정 시</h4>
        <p>시간 안에 합의하지 못했다면, 현재 리더 기준 시계 방향으로 돌아가며 아직 리더를 맡지 않은 플레이어가 다음 리더가 됩니다.</p>
      </div>

      <div class="rule-block rule-callout-box">
        <h4>파트 1 종료 안내</h4>
        <p>파트 1에서 위 흐름을 <strong>3라운드 반복</strong>하면 이야기 카드 A가 공개됩니다.</p>
        <p>다만 다른 조건으로 이야기 카드 A가 공개되는 경우도 있습니다.</p>
      </div>
    </div>
  `,
  '전체 회의 (10분)': `
    <div class="part-rule-preview">
      <p class="rule-lead"><strong>전체 회의 (10분)</strong></p>
      <div class="rule-block">
        <p>모든 플레이어가 자유롭게 의견을 교환합니다.</p>
        <p>카드 공개나 카드 양도는 <strong>이 타이밍까지</strong> 가능합니다. 이 이후에는 손에 든 카드를 다른 캐릭터에게 넘길 수 없습니다.</p>
      </div>
    </div>
  `,
  '추리 페이즈 (각 플레이어당 1분)': `
    <div class="part-rule-preview">
      <p class="rule-lead"><strong>추리 페이즈 (각 플레이어당 1분)</strong></p>
      <div class="rule-block">
        <p>현재 리더부터 시계 방향으로, 각자 1분씩 자신의 추리를 발표합니다.</p>
        <p>그렉의 죽음이 사고인지 살인인지, 살인이라면 누가 가장 의심스러운지, 사제로 누가 적합한지 등을 자유롭게 말해 주세요.</p>
      </div>
    </div>
  `,
  '투표': `
    <div class="part-rule-preview">
      <p class="rule-lead"><strong>투표</strong></p>

      <div class="rule-block">
        <p>모두가 「둘셋!」 구호에 맞춰 그렉의 죽음 원인을 가리킵니다.</p>
        <ul>
          <li>사고 또는 자살이라고 판단하면 <strong>위를 가리킵니다.</strong></li>
          <li>주디가 범인이라고 판단하면 <strong>게임 상자</strong>를 가리킵니다.</li>
          <li>5인 플레이에서 NPC가 범인이라고 판단하면 <strong>설정서</strong>를 가리킵니다.</li>
        </ul>
      </div>

      <div class="rule-block rule-callout-box">
        <h4>동수 처리</h4>
        <p>동수일 경우 최다 득표자끼리 결선 투표를 진행합니다.</p>
        <p>그래도 결정되지 않으면 <strong>아무도 구속되지 않은 것</strong>으로 처리합니다.</p>
      </div>
    </div>
  `,
  '사제 선발': `
    <div class="part-rule-preview">
      <p class="rule-lead"><strong>사제 선발</strong></p>

      <div class="rule-block">
        <p>의식을 치를 「사제」 1명을 선택합니다.</p>
        <p>「3: 투표」에서 구속된 인물이 있다면, 그 인물을 제외한 나머지 플레이어 가운데서 투표합니다. 구속된 캐릭터는 투표권도 없습니다.</p>
        <p>5인 플레이에서는 NPC를 사제로 선택할 수 없습니다.</p>
      </div>

      <div class="rule-block">
        <p>이때도 「둘셋!」 구호에 맞춰 사제에 적합한 캐릭터에게 투표합니다.</p>
      </div>

      <div class="rule-block rule-callout-box">
        <h4>동수 처리</h4>
        <p>동수일 경우 최다 득표자끼리 결선 투표를 진행합니다.</p>
        <p>그래도 결정되지 않으면 <strong>사제는 없는 것</strong>으로 처리합니다.</p>
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
      <div class="rule-block rule-callout-box">
        <h4>파트 2 종료 안내</h4>
        <p>파트 2에서 위 흐름을 <strong>4라운드 반복</strong>하면 이야기 카드 B가 공개됩니다.</p>
        <p>다만 다른 조건으로 이야기 카드 B가 공개되는 경우도 있습니다.</p>
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

    this.currentTrack = nextTrack;
    this.audio.src = nextTrack;
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
class RulesModal {
  constructor(modalEl, titleEl, bodyEl, tabsEl) {
    this.modalEl = modalEl;
    this.titleEl = titleEl;
    this.bodyEl = bodyEl;
    this.tabsEl = tabsEl;
    this.ruleTabs = [];
    this.activeRuleTabKey = 'P';
    this.contentMap = BUNGA_RULE_CONTENT_MAP;
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
    this.contentMap = game?.rules?.source === 'bunga' ? BUNGA_RULE_CONTENT_MAP : BUNGA_RULE_CONTENT_MAP;
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
    return RULE_TAB_TOPIC_MAP[ruleKey] || '';
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
    const tabKeyByTopic = Object.keys(RULE_TAB_TOPIC_MAP).find((key) => RULE_TAB_TOPIC_MAP[key] === topic) || '';
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
    this.headerPartEndBtn = options.headerPartEndBtn;
    this.headerPart2EndBtn = options.headerPart2EndBtn;
    this.headerRulesBookBtn = options.headerRulesBookBtn;
    this.rulesModal = options.rulesModal;
    this.bgmController = options.bgmController;
    this.openConfirmModal = options.openConfirmModal;

    this.timerManager = new TimerManager();
    this.timerWidgets = [];
    this.slides = [];
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
  }

  async loadGame(game) {
    this.currentIndex = 0;

    const slidesHtml = await fetch(game.slidesHtmlPath).then((res) => res.text());
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

  setupTimers() {
    this.timerWidgets = Array.from(this.slidesContainer.querySelectorAll('[data-timer-widget]'))
      .map((el) => new TimerWidget(el, this.timerManager, this.openConfirmModal));
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
      inlineBody.innerHTML = BUNGA_RULE_CONTENT_MAP[topic] || '<p>규칙 텍스트는 차후 삽입 예정</p>';
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
    document.removeEventListener('visibilitychange', this.boundVisibility);
    this.slidesContainer.removeEventListener('touchstart', this.boundTouchStart);
    this.slidesContainer.removeEventListener('touchend', this.boundTouchEnd);

    window.addEventListener('keydown', this.boundKeydown);
    document.addEventListener('visibilitychange', this.boundVisibility);
    this.slidesContainer.addEventListener('touchstart', this.boundTouchStart);
    this.slidesContainer.addEventListener('touchend', this.boundTouchEnd);
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
    const title = currentSlide.dataset.title || '';
    this.headerTitle.textContent = title;

    const partInfoTitle = currentSlide.dataset.partInfoTitle || '';
    const partInfoTopic = currentSlide.dataset.partInfoTopic || '';
    const showPartInfo = Boolean(partInfoTitle || partInfoTopic);
    this.headerPartInfoBtn.classList.toggle('hidden', !showPartInfo);
    this.headerPartInfoBtn.setAttribute('aria-hidden', showPartInfo ? 'false' : 'true');

    this.headerPartEndBtn.classList.toggle('hidden', !this.isPart1Slide(boundedIndex));
    this.headerPart2EndBtn.classList.toggle('hidden', !this.isPart2Slide(boundedIndex));
    this.headerRulesBookBtn.style.display = boundedIndex >= 6 ? 'inline-flex' : 'none';

    this.updateTimerActionLabel(currentSlide, partInfoTitle);
    this.timerManager.pauseIfSlideChanged(currentSlide);
    this.bgmController.updateBySlide(boundedIndex);
  }

  openPart2EnterConfirm() {
    const message = '<strong class="confirm-primary-line">이야기 카드 A</strong>가 공개되었습니까?<br><span class="confirm-warning-line">파트 2</span>로 진입합니다.';
    this.openConfirmModal(message, () => {
      if (this.part2StartIndex >= 0) this.renderSlide(this.part2StartIndex);
    });
  }

  openPart3EnterConfirm() {
    const target = this.findSlideIndexByAnchor('part3-start');
    const message = '<strong class="confirm-primary-line">이야기 카드 B</strong>가 공개되었습니까?<br><span class="confirm-warning-line">파트 3</span>로 진입합니다.';
    this.openConfirmModal(message, () => {
      if (target >= 0) this.renderSlide(target);
    });
  }

  goPrev() {
    this.renderSlide(this.currentIndex - 1);
  }

  goNext() {
    if (this.currentIndex === this.part1EndIndex) {
      this.openPart2EnterConfirm();
      return;
    }
    if (this.currentIndex === this.part2EndIndex) {
      this.openPart3EnterConfirm();
      return;
    }
    this.renderSlide(this.currentIndex + 1);
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
      selectedGameId: null,
      sort: 'name',
      query: '',
      pendingConfirmAction: null,
    };

    this.catalogView = document.getElementById('catalogView');
    this.detailView = document.getElementById('detailView');
    this.gmView = document.getElementById('gmView');
    this.gameListEl = document.getElementById('gameList');
    this.gameSearchInput = document.getElementById('gameSearchInput');
    this.gameSortSelect = document.getElementById('gameSortSelect');

    this.detailTitle = document.getElementById('detailTitle');
    this.detailPrequel = document.getElementById('detailPrequel');
    this.detailPlayers = document.getElementById('detailPlayers');
    this.detailBoxImage = document.getElementById('detailBoxImage');
    this.detailImageFallback = document.getElementById('detailImageFallback');
    this.detailCopyright = document.getElementById('detailCopyright');
    this.gmCopyright = document.getElementById('gmCopyright');

    this.confirmModal = document.getElementById('confirmModal');
    this.confirmModalMessage = document.getElementById('confirmModalMessage');
    this.npcModal = document.getElementById('npcModal');

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
      headerPartEndBtn: document.getElementById('headerPartEndBtn'),
      headerPart2EndBtn: document.getElementById('headerPart2EndBtn'),
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
    await this.applyRouteFromHash();
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
    const response = await fetch('data/games.json');
    const data = await response.json();
    this.state.games = Array.isArray(data.games) ? data.games : [];
  }

  get selectedGame() {
    return this.state.games.find((game) => game.id === this.state.selectedGameId) || null;
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

    document.getElementById('detailBackBtn').addEventListener('click', () => this.navigateToCatalog());
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

      if (event.target.closest('[data-role="part-end-open"]')) {
        this.slideRenderer.openPart2EnterConfirm();
        return;
      }
      if (event.target.closest('[data-role="part2-end-open"]')) {
        this.slideRenderer.openPart3EnterConfirm();
        return;
      }
      if (event.target.closest('[data-role="rules-book-open"]')) {
        const activeKey = this.rulesModal.activeRuleTabKey || 'P';
        const topic = RULE_TAB_TOPIC_MAP[activeKey] || '규칙';
        this.rulesModal.open(topic, { forceTabbed: true, ruleKey: activeKey });
        return;
      }

      const topicButton = event.target.closest('[data-rule-topic]');
      if (topicButton) {
        const topic = topicButton.dataset.ruleTopic || topicButton.textContent?.trim() || '규칙';
        this.rulesModal.open(topic);
      }
    });

    window.addEventListener('hashchange', () => {
      this.applyRouteFromHash().catch(() => {});
    });
  }

  getRouteNameForGame(game) {
    if (!game) {
      return '';
    }
    if (game.routeName) {
      return game.routeName;
    }
    if (game.id === 'bunga') {
      return 'hunke';
    }
    return game.id;
  }

  getGameByRouteName(routeName) {
    return this.state.games.find((game) => this.getRouteNameForGame(game) === routeName) || null;
  }

  navigateToHash(nextHash) {
    if (window.location.hash === nextHash) {
      this.applyRouteFromHash().catch(() => {});
      return;
    }
    window.location.hash = nextHash;
  }

  navigateToCatalog() {
    this.navigateToHash('#/games');
  }

  navigateToGameDetail(gameId) {
    const game = this.state.games.find((item) => item.id === gameId);
    if (!game) {
      this.navigateToCatalog();
      return;
    }
    this.navigateToHash(`#/games/${this.getRouteNameForGame(game)}`);
  }

  navigateToGameGm(gameId) {
    const game = this.state.games.find((item) => item.id === gameId);
    if (!game) {
      this.navigateToCatalog();
      return;
    }
    this.navigateToHash(`#/games/${this.getRouteNameForGame(game)}/gm`);
  }

  async applyRouteFromHash() {
    const raw = window.location.hash.replace(/^#\/?/, '');
    if (!raw) {
      this.navigateToCatalog();
      return;
    }

    const parts = raw.split('/').filter(Boolean);
    if (parts[0] !== 'games') {
      this.navigateToCatalog();
      return;
    }

    if (parts.length === 1) {
      this.setView('catalog');
      return;
    }

    const routeName = parts[1];
    const game = this.getGameByRouteName(routeName);
    if (!game) {
      this.navigateToCatalog();
      return;
    }

    if (parts.length === 2) {
      this.openGameDetail(game.id);
      return;
    }

    if (parts.length === 3 && parts[2] === 'gm') {
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

  setView(view) {
    const platformTitle = document.getElementById('platformTitle');
    const platformSubtitle = document.getElementById('platformSubtitle');

    this.catalogView.classList.toggle('hidden', view !== 'catalog');
    this.detailView.classList.toggle('hidden', view !== 'detail');
    this.gmView.classList.toggle('hidden', view !== 'gm');

    const isGmView = view === 'gm';
    platformTitle?.classList.toggle('hidden', isGmView);
    platformSubtitle?.classList.toggle('hidden', isGmView);
  }

  getSortedGames() {
    const query = this.state.query;
    const filtered = this.state.games.filter((game) => game.name.toLowerCase().includes(query));
    if (this.state.sort === 'players') {
      return filtered.sort((a, b) => (a.playerMin - b.playerMin) || a.name.localeCompare(b.name, 'ko'));
    }
    return filtered.sort((a, b) => a.name.localeCompare(b.name, 'ko'));
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
      card.innerHTML = `
        <h3>${game.name}</h3>
        <p>인원: ${game.playerMin}~${game.playerMax}인</p>
        <button type="button" data-role="game-open" data-game-id="${game.id}">게임 열기</button>
      `;
      this.gameListEl.appendChild(card);
    });
  }

  openGameDetail(gameId) {
    this.state.selectedGameId = gameId;
    const game = this.selectedGame;
    if (!game) return;

    this.detailTitle.textContent = game.name;
    this.detailPrequel.textContent = game.prequel || '';
    this.detailPlayers.textContent = `추천 인원: ${game.recommendedPlayers || `${game.playerMin}~${game.playerMax}인`}`;
    this.detailCopyright.textContent = game.copyrightNotice || '';

    if (game.boxImage) {
      this.detailBoxImage.src = game.boxImage;
      this.detailBoxImage.classList.remove('hidden');
      this.detailImageFallback.classList.add('hidden');
    } else {
      this.detailBoxImage.classList.add('hidden');
      this.detailImageFallback.classList.remove('hidden');
    }

    this.setView('detail');
  }

  async enterGame() {
    const game = this.selectedGame;
    if (!game) return;

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

