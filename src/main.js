import { DB } from './firebaseConfig.js';
import { 
  createRoom, 
  joinRoom, 
  startGame, 
  submitPhase1Decision, 
  checkPhase1Completion, 
  respondToSwap, 
  setPhase2Ready, 
  checkPhase2Completion, 
  advanceToPhase2,
  advanceToPhase3, 
  usePill, 
  nextRound,
  kickPlayer 
} from './gameLogic.js';
import { playDeathBell, playPillSound, playSipSound, playPoisonSound } from './audio.js';
import { ICONS } from './icons.js';
import { initAdminPanel, cleanupAdminPanel } from './admin.js';
import { addBot, runBotLifecycle } from './botLogic.js';

const appEl = document.getElementById('app');

// Language selection (TR or EN)
let currentLang = localStorage.getItem('cot_lang') || 'tr';

const t = {
  tr: {
    title: "CUP OF TEA",
    subtitle: "Zehirli Çay Partisi",
    yourName: "Adın / Lakabın",
    namePlaceholderHost: "Örn: Arthur",
    namePlaceholderJoin: "Örn: Victoria",
    createRoom: "Oda Oluştur",
    roomCodeLabel: "4 Haneli Oda Kodu",
    joinRoom: "Odaya Katıl",
    roomCodeTitle: "Oda Kodu",
    playersAtTable: (n) => `Masada ${n} kişi var`,
    playersList: "Masadakiler",
    you: "(Sen)",
    host: "Kurucu",
    ready: "Hazır",
    startGame: (n) => `Oyunu Başlat (${n}/2+ Oyuncu)`,
    waitingHost: "Kurucunun başlatması bekleniyor...",
    leave: "Ayrıl",
    round: "RAUND",
    readyCounter: (r, t) => `${r}/${t} Hazır`,
    poison: "Zehir",
    poisonVal: (p) => p > 0 ? "1 Doz" : "0",
    antidote: "Panzehir",
    antidoteVal: (p) => p > 0 ? "Hazır" : "Bitti",
    skipCounter: "Kalan Pas Hakkı",
    skipCounterVal: (s) => `${Math.max(0, 2 - s)}/2 Hak`,
    forcedDrinkAlert: "⚠️ 2 Kez Pas Geçtin. Bu El İçmek Zorundasın!",
    drinkChoiceTitle: "1. Çayından Yudum Alacak mısın?",
    drinkBtn: (p) => `İç ${p === 0 ? '(+1 Zehir)' : ''}`,
    skipBtn: "Pas Geç",
    drinkTipReload: "Temiz çayı içersen cebine yeni bir zehir mermisi gelir.",
    drinkTipSkip: "Pas geçersen fincanın içindeki çay aynen kalır.",
    actionTitle: "2. Gizli Hamlen",
    actPoison: (p) => `Zehir Kat ${p <= 0 ? '(Zehirin Yok)' : ''}`,
    actSwap: (d) => `Takas Teklif Et ${d ? '(Finalde Kapalı)' : ''}`,
    actPass: "Pas (Hamle Yapma)",
    targetLabel: "Kimi Hedefliyorsun?",
    targetPlaceholder: "-- Hedef Oyuncu Seç --",
    targetSelf: "Kendi Fincanım (Ters Köşe / Truva Atı)",
    confirmDecision: "Kararımı Onayla",
    waitingOthers: (r, t) => `Diğerleri Bekleniyor (${r}/${t})`,
    discussionTitle: "MASADA TARTIŞMA",
    discussionHeader: "Blöfler ve Suçlamalar",
    discussionDesc: "Şimdi konuşma ve masum rolü yapma zamanı. Fincanınızı içtiğinizi iddia edebilir veya birini suçlayabilirsiniz!",
    swapOfferTitle: "Fincan Takası Teklifi",
    swapOfferText: (name) => `${name} seninle fincanları değişmek istiyor!`,
    swapOfferSub: "Kabul edersen fincanlarınız sessizce yer değiştirecek.",
    accept: "Kabul Et",
    reject: "Reddet",
    readyBtn: "Kararlarımı Verdim / Hazırım",
    revealResultsHost: "➡️ Sonuçları Açıkla (Fazı Bitir)",
    resultsTitle: "RAUND SONUCU",
    poisonedAlertTitle: "ÇAYIN ZEHİRLİYDİ!",
    poisonedAlertDesc: "Zehir boğazını yakıyor ama cebinde hayat kurtaran Panzehir var!",
    usePillBtn: "Panzehir Kullan (Diril!)",
    eliminatedTitle: "ELENDİN!",
    fondipDrink: "İçkini FONDİP yap! 🍺",
    deadDesc: "Artık ölüsün, konuşamazsın. Kenara geçip hayatta kalanları izle.",
    survivedTitle: "HAYATTASIN!",
    survivedDescDrink: "Temiz çayını içtin ve hayatta kaldın.",
    survivedDescSkip: "Bu el çay içmeyerek tehlikeden kaçtın.",
    roundEvents: "Bu Raund Neler Yaşandı?",
    noDeathsRound: "🕊️ Bu raund kimse zehirlenmedi. Masa sessizliğini koruyor...",
    logDeath: (name) => `${name} zehirli çayı içti ve elendi!`,
    logPill: (name) => `${name} zehirlendi ve otomatik pill kullandı!`,
    autoPillTitle: "ZEHİRLENDİN AMA PANZEHİR KURTARDI!",
    autoPillDesc: "Fincanında zehir vardı! Panzehirin (Pill) otomatik olarak kullanıldı ve hayatta kaldın.",
    autoPillReloadTip: "☕ Çayını içtiğin için zehir depon da tazelendi (+1 Zehir)!",
    logWinner: (name) => `ŞAMPİYON: ${name}!`,
    waitingVictimPill: "⚠️ Oyuncunun panzehir kararı bekleniyor...",
    nextRoundBtn: "Sonraki Raundu Başlat",
    waitingNextRound: "Kurucunun sonraki raundu başlatması bekleniyor...",
    gameOverTitle: "ŞAMPİYON BELLİ OLDU!",
    gameOverMutual: "ÇİFTE CİNAYET!",
    gameOverMutualDesc: "İki finalist de aynı anda öldü! TÜM MASA FONDİP YAPIYOR!",
    gameOverWinnerDesc: "Tüm zehirleri ve entrikaları atlatıp hayatta kalan son kişi zafer kadehini kaldırır!",
    restartBtn: "Yeni Oyun Başlat",
    duplicateNameError: "Bu isimde bir oyuncu zaten odada var! Lütfen başka bir isim seçin.",
    kickedFromRoom: "Oda kurucusu tarafından oyundan çıkarıldınız!",
    kickBtn: "At",
    spectatorBadge: "İZLEYİCİ",
    spectatorTitle: "ÖLÜLER MASASI",
    spectatorSubtitle: "Artık masada konuşamazsın. Kenara geçip hayattakilerin tüm sırlarını canlı izle!",
    liveTableTitle: "Canlı Masa Durumu (Gizli İstihbarat)",
    fullLogTitle: "Tüm Detaylarıyla Oyun Günlüğü",
    cupCleanLabel: "Temiz Çay",
    cupPoisonLabel: "ZEHİRLİ!",
    detailPoison: (actor, target) => `🧪 <strong>${actor}</strong>, <strong>${target}</strong>'ın fincanına gizlice zehir kattı!`,
    detailSwapOffer: (actor, target) => `🔄 <strong>${actor}</strong>, <strong>${target}</strong>'a fincan takası teklif etti.`,
    detailSwapAccepted: (from, to) => `🤝 <strong>${to}</strong>, <strong>${from}</strong>'in takasını KABUL ETTİ (fincanlar değişti).`,
    detailSwapRejected: (from, to) => `❌ <strong>${to}</strong>, <strong>${from}</strong>'in takasını REDDETTİ.`,
    detailDrinkClean: (actor) => `☕ <strong>${actor}</strong> çayını İÇTİ (Temizdi, hayatta kaldı).`,
    detailDrinkPoison: (actor) => `☠️ <strong>${actor}</strong> çayını İÇTİ (ÇAY ZEHİRLİYDİ!).`,
    detailSkip: (actor) => `🛑 <strong>${actor}</strong> çayını PAS GEÇTİ (İçmedi).`,
    detailDeath: (actor) => `💀 <strong>${actor}</strong> zehirlendi ve elendi!`,
    detailPill: (actor) => `💊 <strong>${actor}</strong> zehirlendi ve otomatik pill kullandı!`,
    detailWinner: (winner) => `👑 ŞAMPİYON: <strong>${winner}</strong>!`,
    detailMutual: "🍻 Herkes aynı anda öldü! TÜM MASA FONDİP YAPIYOR!",
    waitingForAlive: "Masadakiler gizli kararlarını veriyor...",
    personalLogTitle: "SENİN HAMLE GEÇMİŞİN",
    onlyVisibleToYou: "Sadece Sen Görürsün",
    personalLogEmpty: "Henüz bir hamle yapmadın.",
    myLogPoison: (r, target) => `🧪 <strong>${r}</strong>${target}'ın fincanına gizlice zehir kattın.`,
    myLogSwapOffer: (r, target) => `🔄 <strong>${r}</strong>${target}'a fincan takası teklif ettin.`,
    myLogSwapAcceptedForMe: (r, to) => `🤝 <strong>${r}</strong>${to} takas teklifini KABUL ETTİ (fincanlarınız değişti)!`,
    myLogSwapAcceptedByMe: (r, from) => `🤝 <strong>${r}</strong>${from}'in takas teklifini KABUL ETTİN (fincanlarınız değişti)!`,
    myLogSwapRejectedForMe: (r, to) => `❌ <strong>${r}</strong>${to} takas teklifini REDDETTİ.`,
    myLogSwapRejectedByMe: (r, from) => `❌ <strong>${r}</strong>${from}'in takas teklifini REDDETTİN.`,
    myLogDrinkClean: (r) => `☕ <strong>${r}</strong>Çayını içtin (Temizdi, hayatta kaldın).`,
    myLogDrinkPoison: (r) => `☠️ <strong>${r}</strong>Çayını içtin (ÇAY ZEHİRLİYDİ!).`,
    myLogSkip: (r) => `🛑 <strong>${r}</strong>Çayını pas geçtin.`,
    myLogPill: (r) => `💊 <strong>${r}</strong>Zehirlendin ama panzehirin (Pill) otomatik seni kurtardı (+1 Zehir kazandın)!`,
    myLogDeath: (r) => `💀 <strong>${r}</strong>Zehirlendin ve elendin!`,
    swapOfferPending: (to) => `${to}'a takas teklif ettin. Yanıtı bekleniyor...`,
    swapAcceptedForYou: (to) => `${to} fincan takası teklifini KABUL ETTİ (Fincanlar değişti)!`,
    swapRejectedForYou: (to) => `${to} fincan takası teklifini REDDETTİ.`,
    swapAcceptedByYou: (from) => `${from} ile fincan takasını KABUL ETTİN (Fincanlar değişti).`,
    swapRejectedByYou: (from) => `${from}'in fincan takası teklifini REDDETTİN.`,
    swapCancelled: "Takas iptal edildi (bu el zaten başka bir takas yapıldı).",
    swapExpired: (to) => `${to} süre bitene kadar takas teklifine yanıt vermedi (iptal oldu).`,
    adminPanel: "🛠️ Yönetici Paneli (Oyun Logları)",
    addBot: "+ Bot Ekle (Yapay Zeka)"
  },
  en: {
    title: "CUP OF TEA",
    subtitle: "Poisonous Tea Party",
    yourName: "Your Name / Nickname",
    namePlaceholderHost: "e.g. Arthur",
    namePlaceholderJoin: "e.g. Victoria",
    createRoom: "Create Room",
    roomCodeLabel: "4-Letter Room Code",
    joinRoom: "Join Room",
    roomCodeTitle: "Room Code",
    playersAtTable: (n) => `${n} players at table`,
    playersList: "At The Table",
    you: "(You)",
    host: "Host",
    ready: "Ready",
    startGame: (n) => `Start Game (${n}/2+ Players)`,
    waitingHost: "Waiting for host to start...",
    leave: "Leave",
    round: "ROUND",
    readyCounter: (r, t) => `${r}/${t} Ready`,
    poison: "Poison",
    poisonVal: (p) => p > 0 ? "1 Dose" : "0",
    antidote: "Antidote",
    antidoteVal: (p) => p > 0 ? "Ready" : "Spent",
    skipCounter: "Skips Left",
    skipCounterVal: (s) => `${Math.max(0, 2 - s)}/2 Left`,
    forcedDrinkAlert: "⚠️ 2 Consecutive Skips. You MUST drink this turn!",
    drinkChoiceTitle: "1. Will you take a sip?",
    drinkBtn: (p) => `Drink ${p === 0 ? '(+1 Poison)' : ''}`,
    skipBtn: "Skip (Pass)",
    drinkTipReload: "Drinking clean tea reloads a fresh poison dose.",
    drinkTipSkip: "Skipping keeps your current suspicious cup.",
    actionTitle: "2. Your Secret Action",
    actPoison: (p) => `Poison Cup ${p <= 0 ? '(No Poison)' : ''}`,
    actSwap: (d) => `Offer Swap ${d ? '(Locked in Duel)' : ''}`,
    actPass: "Pass (Do Nothing)",
    targetLabel: "Who is your target?",
    targetPlaceholder: "-- Select Target --",
    targetSelf: "My Own Cup (Trojan Horse Gambit)",
    confirmDecision: "Confirm Decision",
    waitingOthers: (r, t) => `Waiting for Others (${r}/${t})`,
    discussionTitle: "PARLOR DISCUSSION",
    discussionHeader: "Bluffs & Accusations",
    discussionDesc: "Time to talk, accuse, and pretend to be innocent. Claim you drank your tea or blame someone else!",
    swapOfferTitle: "Cup Swap Offer",
    swapOfferText: (name) => `${name} wants to swap tea cups with you!`,
    swapOfferSub: "If accepted, your cups will silently exchange.",
    accept: "Accept",
    reject: "Decline",
    readyBtn: "I Am Ready",
    revealResultsHost: "➡️ Reveal Results (End Phase)",
    resultsTitle: "ROUND RESULTS",
    poisonedAlertTitle: "YOUR TEA WAS POISONED!",
    poisonedAlertDesc: "Your throat burns! But you carry a lifesaving Antidote!",
    usePillBtn: "Use Antidote (Revive!)",
    eliminatedTitle: "ELIMINATED!",
    fondipDrink: "CHUG your drink! 🍺",
    deadDesc: "You are dead and silenced. Sit back and watch the survivors.",
    survivedTitle: "YOU SURVIVED!",
    survivedDescDrink: "You drank clean tea and survived safely.",
    survivedDescSkip: "You skipped drinking and dodged danger this round.",
    roundEvents: "What Happened This Round?",
    noDeathsRound: "🕊️ Nobody was poisoned this round. The parlor remains silent...",
    logDeath: (name) => `${name} drank poisoned tea and was eliminated!`,
    logPill: (name) => `${name} was poisoned and automatically used a pill!`,
    autoPillTitle: "POISONED BUT SAVED BY ANTIDOTE!",
    autoPillDesc: "There was poison in your cup! Your antidote (pill) was automatically used and you survived.",
    autoPillReloadTip: "☕ Because you drank your tea, your poison token was reloaded (+1 Poison)!",
    logWinner: (name) => `CHAMPION: ${name}!`,
    waitingVictimPill: "⚠️ Waiting for player's antidote decision...",
    nextRoundBtn: "Start Next Round",
    waitingNextRound: "Waiting for host to start next round...",
    gameOverTitle: "A CHAMPION EMERGES!",
    gameOverMutual: "MUTUAL MURDER!",
    gameOverMutualDesc: "Both finalists died simultaneously! THE ENTIRE TABLE CHUGS!",
    gameOverWinnerDesc: "Surviving all poisons and conspiracies, the victor raises the final glass!",
    restartBtn: "Start New Game",
    duplicateNameError: "A player with this name already exists in the room! Please choose another name.",
    kickedFromRoom: "You were kicked from the room by the host!",
    kickBtn: "Kick",
    spectatorBadge: "SPECTATOR",
    spectatorTitle: "PARLOR OF THE DEAD",
    spectatorSubtitle: "You are silenced and eliminated. Sit back and watch all secret moves unfold live!",
    liveTableTitle: "Live Table Intel (Classified)",
    fullLogTitle: "Detailed Game Log",
    cupCleanLabel: "Clean Tea",
    cupPoisonLabel: "POISONED!",
    detailPoison: (actor, target) => `🧪 <strong>${actor}</strong> secretly poisoned <strong>${target}</strong>'s cup!`,
    detailSwapOffer: (actor, target) => `🔄 <strong>${actor}</strong> offered a cup swap to <strong>${target}</strong>.`,
    detailSwapAccepted: (from, to) => `🤝 <strong>${to}</strong> ACCEPTED <strong>${from}</strong>'s swap (cups exchanged).`,
    detailSwapRejected: (from, to) => `❌ <strong>${to}</strong> DECLINED <strong>${from}</strong>'s swap.`,
    detailDrinkClean: (actor) => `☕ <strong>${actor}</strong> DRANK their tea (Clean, survived).`,
    detailDrinkPoison: (actor) => `☠️ <strong>${actor}</strong> DRANK their tea (WAS POISONED!).`,
    detailSkip: (actor) => `🛑 <strong>${actor}</strong> SKIPPED drinking (Passed).`,
    detailDeath: (actor) => `💀 <strong>${actor}</strong> was poisoned and eliminated!`,
    detailPill: (actor) => `💊 <strong>${actor}</strong> was poisoned and automatically used a pill!`,
    detailWinner: (winner) => `👑 CHAMPION: <strong>${winner}</strong>!`,
    detailMutual: "🍻 Mutual murder! THE ENTIRE TABLE CHUGS!",
    waitingForAlive: "Players at the table are making secret decisions...",
    personalLogTitle: "YOUR MOVE HISTORY",
    onlyVisibleToYou: "Only Visible To You",
    personalLogEmpty: "You haven't made any moves yet.",
    myLogPoison: (r, target) => `🧪 <strong>${r}</strong>You secretly poisoned ${target}'s cup.`,
    myLogSwapOffer: (r, target) => `🔄 <strong>${r}</strong>You offered a cup swap to ${target}.`,
    myLogSwapAcceptedForMe: (r, to) => `🤝 <strong>${r}</strong>${to} ACCEPTED your swap offer (cups exchanged)!`,
    myLogSwapAcceptedByMe: (r, from) => `🤝 <strong>${r}</strong>You ACCEPTED ${from}'s swap offer (cups exchanged)!`,
    myLogSwapRejectedForMe: (r, to) => `❌ <strong>${r}</strong>${to} DECLINED your swap offer.`,
    myLogSwapRejectedByMe: (r, from) => `❌ <strong>${r}</strong>You DECLINED ${from}'s swap offer.`,
    myLogDrinkClean: (r) => `☕ <strong>${r}</strong>You drank your tea (Clean, survived).`,
    myLogDrinkPoison: (r) => `☠️ <strong>${r}</strong>You drank your tea (WAS POISONED!).`,
    myLogSkip: (r) => `🛑 <strong>${r}</strong>You skipped drinking (Passed).`,
    myLogPill: (r) => `💊 <strong>${r}</strong>You were poisoned but your antidote saved you (+1 Poison reloaded)!`,
    myLogDeath: (r) => `💀 <strong>${r}</strong>You were poisoned and eliminated!`,
    swapOfferPending: (to) => `You offered a swap to ${to}. Waiting for response...`,
    swapAcceptedForYou: (to) => `${to} ACCEPTED your swap offer (Cups exchanged)!`,
    swapRejectedForYou: (to) => `${to} DECLINED your swap offer.`,
    swapAcceptedByYou: (from) => `You ACCEPTED ${from}'s swap offer (Cups exchanged).`,
    swapRejectedByYou: (from) => `You DECLINED ${from}'s swap offer.`,
    swapCancelled: "Swap cancelled (another swap already took place this round).",
    swapExpired: (to) => `${to} did not respond in time (offer expired).`,
    adminPanel: "🛠️ Admin Panel (Game Logs)",
    addBot: "+ Add Bot (AI Player)"
  }
};

function getL() {
  return t[currentLang] || t.tr;
}

function renderLangToggle() {
  return `
    <div style="display:inline-flex; border:2px solid var(--border-strong); border-radius:12px; overflow:hidden; box-shadow:0 2px 0 var(--border-strong); margin-left:auto;">
      <button id="setLangTr" style="background:${currentLang === 'tr' ? 'var(--btn-espresso)' : 'var(--bg-card)'}; color:${currentLang === 'tr' ? '#fff' : 'var(--text-main)'}; border:none; padding:4px 10px; font-weight:800; font-size:0.75rem; cursor:pointer;">TR</button>
      <button id="setLangEn" style="background:${currentLang === 'en' ? 'var(--btn-espresso)' : 'var(--bg-card)'}; color:${currentLang === 'en' ? '#fff' : 'var(--text-main)'}; border:none; padding:4px 10px; font-weight:800; font-size:0.75rem; cursor:pointer;">EN</button>
    </div>
  `;
}

function attachLangEvents() {
  const bTr = document.getElementById('setLangTr');
  const bEn = document.getElementById('setLangEn');
  if (bTr) {
    bTr.onclick = () => {
      currentLang = 'tr';
      localStorage.setItem('cot_lang', 'tr');
      renderCurrentScreen();
    };
  }
  if (bEn) {
    bEn.onclick = () => {
      currentLang = 'en';
      localStorage.setItem('cot_lang', 'en');
      renderCurrentScreen();
    };
  }
}

let myRoomCode = localStorage.getItem('cot_room_code') || '';
let myPlayerId = localStorage.getItem('cot_player_id') || '';
let currentRoom = null;

let selectedDrink = null;
let selectedActionType = 'PASS';
let selectedTarget = null;
let hasPlayedPhase3Sound = false;
let lastSeenRound = 0;

function isAdminRoute() {
  return window.location.hash === '#admin' || 
         window.location.pathname === '/admin' || 
         new URLSearchParams(window.location.search).has('admin');
}

function checkAdminRoute() {
  if (isAdminRoute()) {
    initAdminPanel(appEl, () => {
      window.location.hash = '';
      if (myRoomCode && myPlayerId) {
        listenToRoom(myRoomCode);
      } else {
        renderHome();
      }
    });
    return true;
  }
  return false;
}

window.addEventListener('hashchange', () => {
  if (!checkAdminRoute()) {
    cleanupAdminPanel(appEl);
    if (myRoomCode && myPlayerId && currentRoom) {
      renderCurrentScreen();
    } else {
      renderHome();
    }
  }
});

if (!checkAdminRoute()) {
  if (myRoomCode && myPlayerId) {
    listenToRoom(myRoomCode);
  } else {
    renderHome();
  }
}

function listenToRoom(roomCode) {
  DB.listen(`rooms/${roomCode}`, (room) => {
    if (!room) {
      localStorage.removeItem('cot_room_code');
      localStorage.removeItem('cot_player_id');
      myRoomCode = '';
      myPlayerId = '';
      renderHome();
      return;
    }

    currentRoom = room;
    const me = room.players ? room.players[myPlayerId] : null;

    if (!me) {
      if (myPlayerId && room && room.players) {
        alert(getL().kickedFromRoom);
      }
      localStorage.removeItem('cot_room_code');
      localStorage.removeItem('cot_player_id');
      myRoomCode = '';
      myPlayerId = '';
      currentRoom = null;
      renderHome();
      return;
    }

    if (me.isHost) {
      runBotLifecycle(roomCode, room);
      if (room.status === 'PHASE_1') {
        checkPhase1Completion(roomCode, room);
      } else if (room.status === 'PHASE_2') {
        checkPhase2Completion(roomCode, room);
      }
    }

    renderCurrentScreen();
  });
}

function renderCurrentScreen() {
  if (!currentRoom) {
    renderHome();
    return;
  }

  const me = currentRoom.players[myPlayerId];
  if (!me) {
    renderHome();
    return;
  }

  if (currentRoom.status === 'LOBBY') {
    lastSeenRound = 0;
    renderLobby();
    return;
  }

  if (currentRoom.status === 'GAME_OVER') {
    renderGameOver();
    return;
  }

  // Dead players only see the detailed game log spectator screen
  if (!me.alive) {
    renderSpectatorScreen();
    return;
  }

  switch (currentRoom.status) {
    case 'PHASE_1':
      if (currentRoom.round !== lastSeenRound) {
        lastSeenRound = currentRoom.round;
        selectedDrink = null;
        selectedActionType = 'PASS';
        selectedTarget = null;
      }
      hasPlayedPhase3Sound = false;
      renderPhase1();
      break;
    case 'PHASE_2':
      renderPhase2();
      break;
    case 'PHASE_3':
      renderPhase3();
      break;
    default:
      renderHome();
  }
}

// -------------------------------------------------------------------
// 1. HOME SCREEN
// -------------------------------------------------------------------
function renderHome() {
  const L = getL();
  appEl.innerHTML = `
    <div style="display:flex; justify-content:flex-end; width:100%; margin-bottom:4px;">
      ${renderLangToggle()}
    </div>

    <div class="hero-art">
      ${ICONS.teacup}
      <h1 class="brand-title" style="font-size:1.8rem; margin-top:14px;">${L.title}</h1>
      <p style="color:var(--text-muted); font-size:0.85rem; font-weight:700; text-transform:uppercase; letter-spacing:1px; margin-top:4px;">
        ${L.subtitle}
      </p>
    </div>

    <div class="card" style="margin-top:10px;">
      <div class="input-group">
        <label class="input-label">${L.yourName}</label>
        <input type="text" id="hostName" class="input-field" placeholder="${L.namePlaceholderHost}" maxlength="14">
      </div>
      <button class="btn btn-primary" id="btnCreate">
        ${L.createRoom}
      </button>
    </div>

    <div class="card">
      <div class="input-group">
        <label class="input-label">${L.roomCodeLabel}</label>
        <input type="text" id="joinCode" class="input-field" placeholder="KOD" maxlength="4" style="text-transform:uppercase; letter-spacing:4px; font-weight:900;">
      </div>
      <div class="input-group">
        <label class="input-label">${L.yourName}</label>
        <input type="text" id="joinName" class="input-field" placeholder="${L.namePlaceholderJoin}" maxlength="14">
      </div>
      <button class="btn btn-neutral" id="btnJoin">
        ${L.joinRoom}
      </button>
    </div>

    <!-- Admin Panel Quick Access Link -->
    <div style="margin-top:16px; text-align:center;">
      <a href="#admin" id="btnAdminLink" style="font-size:0.78rem; font-weight:800; color:var(--text-muted); text-decoration:none; display:inline-flex; align-items:center; gap:6px; padding:6px 14px; background:var(--bg-card); border:1.5px solid var(--border-subtle); border-radius:20px; box-shadow:0 1.5px 0 var(--border-subtle); cursor:pointer;">
        ${L.adminPanel}
      </a>
    </div>
  `;

  attachLangEvents();

  document.getElementById('btnCreate').onclick = async () => {
    const name = document.getElementById('hostName').value.trim();
    if (!name) return alert(currentLang === 'tr' ? "Lütfen bir isim yaz!" : "Please enter a name!");
    try {
      const { roomCode, playerId } = await createRoom(name);
      myRoomCode = roomCode;
      myPlayerId = playerId;
      localStorage.setItem('cot_room_code', roomCode);
      localStorage.setItem('cot_player_id', playerId);
      listenToRoom(roomCode);
    } catch (e) {
      alert(e.message);
    }
  };

  document.getElementById('btnJoin').onclick = async () => {
    const code = document.getElementById('joinCode').value.trim();
    const name = document.getElementById('joinName').value.trim();
    const L = getL();
    if (!code || !name) return alert(currentLang === 'tr' ? "Lütfen kod ve isim girin!" : "Please enter code and name!");
    try {
      const { roomCode, playerId } = await joinRoom(code, name);
      myRoomCode = roomCode;
      myPlayerId = playerId;
      localStorage.setItem('cot_room_code', roomCode);
      localStorage.setItem('cot_player_id', playerId);
      listenToRoom(roomCode);
    } catch (e) {
      if (e.message === 'DUPLICATE_NAME') {
        alert(L.duplicateNameError);
      } else {
        alert(e.message);
      }
    }
  };
}

// -------------------------------------------------------------------
// 2. LOBBY SCREEN
// -------------------------------------------------------------------
function renderLobby() {
  const L = getL();
  const me = currentRoom.players[myPlayerId];
  const players = Object.values(currentRoom.players || {});
  const canStart = players.length >= 2;

  const playerRows = players.map(p => `
    <div class="player-row" style="display:flex; justify-content:space-between; align-items:center;">
      <span style="display:flex; align-items:center; gap:6px;">
        ${p.name}
        ${p.isBot ? `<span class="tag-badge" style="background:#e8f0fe; color:#1a73e8; border-color:#1a73e8; font-size:0.65rem;">🤖 BOT</span>` : ''}
        ${p.id === myPlayerId ? `<span style="color:var(--text-muted); font-size:0.8rem;">${L.you}</span>` : ''}
      </span>
      <div style="display:flex; align-items:center; gap:8px;">
        ${p.isHost ? `<span class="tag-badge">${L.host}</span>` : `<span class="tag-badge" style="background:#e8f4ed; color:#1e5e39;">${L.ready}</span>`}
        ${me.isHost && p.id !== myPlayerId ? `
          <button class="btn-kick" data-kick="${p.id}" style="background:#fdf2f2; border:1.5px solid #d9534f; color:#d9534f; border-radius:6px; font-weight:800; font-size:0.75rem; padding:4px 8px; cursor:pointer;">
            ${L.kickBtn}
          </button>
        ` : ''}
      </div>
    </div>
  `).join('');

  appEl.innerHTML = `
    <div class="app-header">
      <div class="brand-title">${L.title}</div>
      ${renderLangToggle()}
    </div>

    <div class="card" style="text-align:center; padding:22px 14px;">
      <span class="input-label" style="margin-bottom:2px;">${L.roomCodeTitle}</span>
      <h2 style="font-size:3rem; font-weight:900; letter-spacing:6px; color:var(--text-main); font-family:monospace; margin:4px 0;">
        ${currentRoom.code}
      </h2>
      <p style="font-size:0.85rem; font-weight:700; color:var(--text-muted);">
        ${L.playersAtTable(players.length)}
      </p>
    </div>

    <div class="card">
      <span class="input-label">${L.playersList}</span>
      <div style="margin-top:8px;">
        ${playerRows}
      </div>
      ${me.isHost ? `
        <button class="btn btn-neutral" id="btnAddBot" style="margin-top:10px; width:100%; border:2px dashed var(--btn-brass); color:var(--btn-espresso); font-weight:800; display:flex; align-items:center; justify-content:center; gap:8px;">
          ${L.addBot}
        </button>
      ` : ''}
    </div>

    <div style="margin-top:auto; padding-top:12px;">
      ${me.isHost ? `
        <button class="btn btn-primary ${!canStart ? 'btn-disabled' : ''}" id="btnStartGame" ${!canStart ? 'disabled' : ''}>
          ${L.startGame(players.length)}
        </button>
      ` : `
        <div style="text-align:center; color:var(--text-muted); font-weight:700; padding:16px;">
          ${L.waitingHost}
        </div>
      `}
      <button class="btn btn-neutral" id="btnLeave" style="margin-top:10px; border-color:transparent; color:#888;">
        ${L.leave}
      </button>
    </div>
  `;

  attachLangEvents();

  if (me.isHost) {
    const btnAddBot = document.getElementById('btnAddBot');
    if (btnAddBot) {
      btnAddBot.onclick = async () => {
        try {
          await addBot(currentRoom.code);
        } catch (err) {
          alert(err.message);
        }
      };
    }

    document.getElementById('btnStartGame').onclick = async () => {
      try {
        await startGame(currentRoom.code);
      } catch (e) {
        alert(e.message);
      }
    };

    document.querySelectorAll('.btn-kick').forEach(btn => {
      btn.onclick = async (e) => {
        const targetId = e.currentTarget.getAttribute('data-kick');
        if (targetId) {
          try {
            await kickPlayer(currentRoom.code, targetId);
          } catch (err) {
            alert(err.message);
          }
        }
      };
    });
  }

  document.getElementById('btnLeave').onclick = () => {
    localStorage.removeItem('cot_room_code');
    localStorage.removeItem('cot_player_id');
    myRoomCode = '';
    myPlayerId = '';
    currentRoom = null;
    renderHome();
  };
}

function renderPersonalLog(me, currentRoom, L) {
  const detailedLogs = currentRoom.detailedLogs || [];
  
  // Filter for events where this player was the actor, or directly involved in a swap
  const myEvents = detailedLogs.filter(ev => {
    if (ev.actorId === me.id || ev.actor === me.name) {
      return true;
    }
    if ((ev.type === 'SWAP_ACCEPTED' || ev.type === 'SWAP_REJECTED' || ev.type === 'SWAP_CANCELLED' || ev.type === 'SWAP_EXPIRED') && 
        (ev.fromId === me.id || ev.from === me.name || ev.toId === me.id || ev.to === me.name)) {
      return true;
    }
    return false;
  });

  if (myEvents.length === 0) {
    return `
      <div class="card" style="margin-top:14px; background:var(--bg-parchment); border:1.5px solid var(--border-subtle); padding:10px 12px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
          <span class="input-label" style="font-size:0.75rem; margin:0; color:var(--btn-espresso);">📜 ${L.personalLogTitle}</span>
          <span style="font-size:0.7rem; font-weight:700; color:var(--text-muted);">${L.onlyVisibleToYou}</span>
        </div>
        <p style="font-size:0.78rem; color:var(--text-muted); text-align:center; margin:6px 0 2px;">
          ${L.personalLogEmpty}
        </p>
      </div>
    `;
  }

  // Reverse chronological (newest first)
  const itemsHtml = [...myEvents].reverse().map(ev => {
    let text = '';
    const r = ev.round ? `[${L.round} ${ev.round}] ` : '';
    switch (ev.type) {
      case 'POISON':
        text = L.myLogPoison(r, ev.target);
        break;
      case 'SWAP_OFFER':
        text = L.myLogSwapOffer(r, ev.target);
        break;
      case 'SWAP_ACCEPTED':
        if (ev.fromId === me.id || ev.from === me.name) {
          text = L.myLogSwapAcceptedForMe(r, ev.to);
        } else {
          text = L.myLogSwapAcceptedByMe(r, ev.from);
        }
        break;
      case 'SWAP_REJECTED':
        if (ev.fromId === me.id || ev.from === me.name) {
          text = L.myLogSwapRejectedForMe(r, ev.to);
        } else {
          text = L.myLogSwapRejectedByMe(r, ev.from);
        }
        break;
      case 'SWAP_CANCELLED':
        text = `⚠️ <strong>${r}</strong>${L.swapCancelled}`;
        break;
      case 'SWAP_EXPIRED':
        if (ev.fromId === me.id || ev.from === me.name) {
          text = `⌛ <strong>${r}</strong>${L.swapExpired(ev.to)}`;
        }
        break;
      case 'DRINK_CLEAN':
        text = L.myLogDrinkClean(r);
        break;
      case 'DRINK_POISONED':
        text = L.myLogDrinkPoison(r);
        break;
      case 'SKIP':
        text = L.myLogSkip(r);
        break;
      case 'POISONED_PILL':
        text = L.myLogPill(r);
        break;
      case 'DEATH':
        text = L.myLogDeath(r);
        break;
      default:
        return '';
    }
    return `
      <div style="padding:4px 0; border-bottom:1px dashed var(--border-subtle); font-size:0.8rem; line-height:1.35;">
        ${text}
      </div>
    `;
  }).filter(Boolean).join('');

  return `
    <div class="card" style="margin-top:14px; background:var(--bg-parchment); border:1.5px solid var(--border-subtle); padding:10px 12px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
        <span class="input-label" style="font-size:0.75rem; margin:0; color:var(--btn-espresso);">📜 ${L.personalLogTitle}</span>
        <span style="font-size:0.7rem; font-weight:700; color:var(--text-muted);">${L.onlyVisibleToYou}</span>
      </div>
      <div style="max-height:130px; overflow-y:auto;">
        ${itemsHtml}
      </div>
    </div>
  `;
}

// -------------------------------------------------------------------
// 3. PHASE 1: GİZLİ KARARLAR
// -------------------------------------------------------------------
function renderPhase1() {
  const L = getL();
  const me = currentRoom.players[myPlayerId];
  const alivePlayers = Object.values(currentRoom.players).filter(p => p.alive);
  const otherAlive = alivePlayers.filter(p => p.id !== myPlayerId);
  const readyCount = alivePlayers.filter(p => p.ready).length;
  const isDuel = alivePlayers.length === 2;

  const isForcedDrink = (me.skips >= 2);
  if (isForcedDrink) {
    selectedDrink = true;
  }

  let targetSelectHtml = '';
  if (selectedActionType === 'POISON' || selectedActionType === 'SWAP') {
    const options = otherAlive.map(p => `
      <option value="${p.id}" ${selectedTarget === p.id ? 'selected' : ''}>${p.isBot ? '🤖 ' : ''}${p.name}</option>
    `).join('');
    
    const selfOption = selectedActionType === 'POISON' 
      ? `<option value="${myPlayerId}" ${selectedTarget === myPlayerId ? 'selected' : ''}>${L.targetSelf}</option>` 
      : '';

    targetSelectHtml = `
      <div style="margin-top:12px;">
        <label class="input-label">${L.targetLabel}</label>
        <select id="actionTarget" class="input-field" style="font-size:1rem; padding:12px;">
          <option value="">${L.targetPlaceholder}</option>
          ${options}
          ${selfOption}
        </select>
      </div>
    `;
  }

  appEl.innerHTML = `
    <div class="app-header">
      <div class="brand-title">${L.round} ${currentRoom.round}</div>
      <div style="display:flex; align-items:center; gap:8px;">
        <div class="room-badge">${L.readyCounter(readyCount, alivePlayers.length)}</div>
        ${renderLangToggle()}
      </div>
    </div>

    <!-- Tactile Inventory Grid -->
    <div class="inventory-grid">
      <div class="inv-box">
        <div class="inv-box-label">${L.poison}</div>
        <div class="inv-box-val" style="color:${me.poison > 0 ? 'var(--btn-poison)' : '#aaa'};">
          ${L.poisonVal(me.poison)}
        </div>
      </div>
      <div class="inv-box">
        <div class="inv-box-label">${L.antidote}</div>
        <div class="inv-box-val" style="color:${me.pill > 0 ? 'var(--btn-brass)' : '#aaa'};">
          ${L.antidoteVal(me.pill)}
        </div>
      </div>
      <div class="inv-box">
        <div class="inv-box-label">${L.skipCounter}</div>
        <div class="inv-box-val" style="color:${me.skips >= 2 ? 'var(--btn-crimson)' : 'inherit'};">
          ${L.skipCounterVal(me.skips)}
        </div>
      </div>
    </div>

    ${isForcedDrink ? `
      <div class="card-subtle" style="background:#fff2f2; border-color:#d9534f; text-align:center;">
        <strong style="color:#d9534f; font-size:0.85rem; text-transform:uppercase; letter-spacing:1px;">
          ${L.forcedDrinkAlert}
        </strong>
      </div>
    ` : ''}

    <!-- 1. Drink Choice -->
    <div class="card">
      <span class="input-label">${L.drinkChoiceTitle}</span>
      <div class="grid-2" style="margin-top:8px;">
        <button class="btn btn-neutral ${selectedDrink === true ? 'selected' : ''}" id="btnDrink">
          ${L.drinkBtn(me.poison)}
        </button>
        <button class="btn btn-neutral ${selectedDrink === false ? 'selected' : ''} ${isForcedDrink ? 'btn-disabled' : ''}" id="btnSkip" ${isForcedDrink ? 'disabled' : ''}>
          ${L.skipBtn}
        </button>
      </div>
      <p style="font-size:0.75rem; color:var(--text-muted); text-align:center; font-weight:600;">
        ${me.poison === 0 ? L.drinkTipReload : L.drinkTipSkip}
      </p>
    </div>

    <!-- 2. Manipulation Choice -->
    <div class="card">
      <span class="input-label">${L.actionTitle}</span>
      <div style="display:flex; flex-direction:column; gap:8px; margin-top:8px;">
        <button class="btn btn-neutral ${selectedActionType === 'POISON' ? 'selected' : ''} ${me.poison <= 0 ? 'btn-disabled' : ''}" id="actPoison" ${me.poison <= 0 ? 'disabled' : ''}>
          ${L.actPoison(me.poison)}
        </button>
        <button class="btn btn-neutral ${selectedActionType === 'SWAP' ? 'selected' : ''} ${isDuel ? 'btn-disabled' : ''}" id="actSwap" ${isDuel ? 'disabled' : ''}>
          ${L.actSwap(isDuel)}
        </button>
        <button class="btn btn-neutral ${selectedActionType === 'PASS' ? 'selected' : ''}" id="actPass">
          ${L.actPass}
        </button>
      </div>
      ${targetSelectHtml}
    </div>

    ${renderPersonalLog(me, currentRoom, L)}

    <div style="margin-top:auto; padding-top:8px;">
      <button class="btn btn-primary ${me.ready ? 'btn-disabled' : ''}" id="btnSubmitPhase1" ${me.ready ? 'disabled' : ''}>
        ${me.ready ? `⏳ ${L.waitingOthers(readyCount, alivePlayers.length)}` : L.confirmDecision}
      </button>
    </div>
  `;

  attachLangEvents();

  document.getElementById('btnDrink').onclick = () => {
    selectedDrink = true;
    renderPhase1();
  };

  if (!isForcedDrink) {
    document.getElementById('btnSkip').onclick = () => {
      selectedDrink = false;
      renderPhase1();
    };
  }

  document.getElementById('actPoison').onclick = () => {
    if (me.poison > 0) {
      selectedActionType = 'POISON';
      renderPhase1();
    }
  };

  if (!isDuel) {
    document.getElementById('actSwap').onclick = () => {
      selectedActionType = 'SWAP';
      renderPhase1();
    };
  }

  document.getElementById('actPass').onclick = () => {
    selectedActionType = 'PASS';
    selectedTarget = null;
    renderPhase1();
  };

  const targetEl = document.getElementById('actionTarget');
  if (targetEl) {
    targetEl.onchange = (e) => {
      selectedTarget = e.target.value;
    };
  }

  document.getElementById('btnSubmitPhase1').onclick = async () => {
    if (selectedDrink === null) return alert(currentLang === 'tr' ? "Lütfen içip içmeyeceğine karar ver!" : "Please decide whether to drink or skip!");
    if ((selectedActionType === 'POISON' || selectedActionType === 'SWAP') && !selectedTarget) {
      return alert(currentLang === 'tr' ? "Lütfen hedef bir oyuncu seç!" : "Please select a target player!");
    }

    try {
      await submitPhase1Decision(currentRoom.code, myPlayerId, selectedDrink, {
        type: selectedActionType,
        target: selectedTarget
      });
    } catch (e) {
      alert(e.message);
    }
  };
}

// -------------------------------------------------------------------
// 4. PHASE 2: MASADA TARTIŞMA & TAKAS ONAYLARI
// -------------------------------------------------------------------
function renderPhase2() {
  const L = getL();
  const me = currentRoom.players[myPlayerId];
  const alivePlayers = Object.values(currentRoom.players).filter(p => p.alive);
  const readyCount = alivePlayers.filter(p => p.ready).length;
  const swaps = currentRoom.swaps || {};
  const incomingSwaps = Object.values(swaps).filter(s => s.to === myPlayerId);
  const outgoingSwaps = Object.values(swaps).filter(s => s.from === myPlayerId);

  let swapAlertHtml = '';

  for (const s of incomingSwaps) {
    if (s.status === 'PENDING') {
      swapAlertHtml += `
        <div class="swap-modal-card">
          <span class="input-label" style="color:var(--btn-brass-edge);">${L.swapOfferTitle}</span>
          <h3 style="margin:6px 0 10px; font-weight:800; font-size:1.15rem;">
            ${L.swapOfferText(s.fromName)}
          </h3>
          <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:14px; font-weight:600;">
            ${L.swapOfferSub}
          </p>
          <div class="grid-2">
            <button class="btn btn-poison" id="btnAcceptSwap_${s.id}" style="padding:14px;">${L.accept}</button>
            <button class="btn btn-crimson" id="btnRejectSwap_${s.id}" style="padding:14px;">${L.reject}</button>
          </div>
        </div>
      `;
    } else if (s.status === 'ACCEPTED') {
      swapAlertHtml += `
        <div class="card-subtle" style="background:#e8f4ed; border:1.5px solid #2e7d32; text-align:center; padding:12px; margin-bottom:8px;">
          <strong style="color:#2e7d32; font-size:0.9rem;">
            🤝 ${L.swapAcceptedByYou(s.fromName)}
          </strong>
        </div>
      `;
    } else if (s.status === 'REJECTED') {
      swapAlertHtml += `
        <div class="card-subtle" style="background:#fdf2f2; border:1.5px solid #d9534f; text-align:center; padding:12px; margin-bottom:8px;">
          <strong style="color:#d9534f; font-size:0.9rem;">
            ❌ ${L.swapRejectedByYou(s.fromName)}
          </strong>
        </div>
      `;
    }
  }

  for (const s of outgoingSwaps) {
    if (s.status === 'PENDING') {
      swapAlertHtml += `
        <div class="card-subtle" style="background:rgba(212,175,55,0.1); border:1.5px solid var(--btn-brass); text-align:center; padding:12px; margin-bottom:8px;">
          <strong style="color:var(--btn-brass); font-size:0.9rem;">
            ⏳ ${L.swapOfferPending(s.toName)}
          </strong>
        </div>
      `;
    } else if (s.status === 'ACCEPTED') {
      swapAlertHtml += `
        <div class="card-subtle" style="background:#e8f4ed; border:1.5px solid #2e7d32; text-align:center; padding:12px; margin-bottom:8px;">
          <strong style="color:#2e7d32; font-size:0.9rem;">
            🤝 ${L.swapAcceptedForYou(s.toName)}
          </strong>
        </div>
      `;
    } else if (s.status === 'REJECTED') {
      swapAlertHtml += `
        <div class="card-subtle" style="background:#fdf2f2; border:1.5px solid #d9534f; text-align:center; padding:12px; margin-bottom:8px;">
          <strong style="color:#d9534f; font-size:0.9rem;">
            ❌ ${L.swapRejectedForYou(s.toName)}
          </strong>
        </div>
      `;
    }
  }

  appEl.innerHTML = `
    <div class="app-header">
      <div class="brand-title">${L.discussionTitle}</div>
      <div style="display:flex; align-items:center; gap:8px;">
        <div class="room-badge">${L.readyCounter(readyCount, alivePlayers.length)}</div>
        ${renderLangToggle()}
      </div>
    </div>

    <div class="card" style="text-align:center; padding:28px 16px;">
      <div style="font-size:2.5rem; margin-bottom:8px;">☕</div>
      <h3 style="font-weight:900; letter-spacing:1px; text-transform:uppercase; margin-bottom:8px;">
        ${L.discussionHeader}
      </h3>
      <p style="color:var(--text-muted); font-size:0.9rem; font-weight:600; line-height:1.4;">
        ${L.discussionDesc}
      </p>
    </div>

    ${swapAlertHtml}

    ${renderPersonalLog(me, currentRoom, L)}

    <div style="margin-top:auto; padding-top:12px; display:flex; flex-direction:column; gap:8px;">
      <button class="btn btn-primary ${me.ready ? 'btn-disabled' : ''}" id="btnPhase2Ready" ${me.ready ? 'disabled' : ''}>
        ${me.ready ? `⏳ ${L.waitingOthers(readyCount, alivePlayers.length)}` : L.readyBtn}
      </button>

      ${me.isHost ? `
        <button class="btn btn-neutral" id="btnHostForcePhase3" style="border-color:var(--border-strong);">
          ${L.revealResultsHost}
        </button>
      ` : ''}
    </div>
  `;

  attachLangEvents();

  for (const s of incomingSwaps) {
    if (s.status === 'PENDING') {
      const btnAccept = document.getElementById(`btnAcceptSwap_${s.id}`);
      if (btnAccept) {
        btnAccept.onclick = async () => {
          await respondToSwap(currentRoom.code, s.id, true);
        };
      }
      const btnReject = document.getElementById(`btnRejectSwap_${s.id}`);
      if (btnReject) {
        btnReject.onclick = async () => {
          await respondToSwap(currentRoom.code, s.id, false);
        };
      }
    }
  }

  document.getElementById('btnPhase2Ready').onclick = async () => {
    await setPhase2Ready(currentRoom.code, myPlayerId);
  };

  if (me.isHost) {
    document.getElementById('btnHostForcePhase3').onclick = async () => {
      await advanceToPhase3(currentRoom.code, currentRoom);
    };
  }
}

// -------------------------------------------------------------------
// 5. PHASE 3: SONUÇ VE ZEHRİN VURMASI
// -------------------------------------------------------------------
function renderPhase3() {
  const L = getL();
  const me = currentRoom.players[myPlayerId];
  const logs = currentRoom.roundLogs || [];

  if (!hasPlayedPhase3Sound) {
    hasPlayedPhase3Sound = true;
    if (!me.alive) {
      playDeathBell();
    } else if (me.autoPillUsed) {
      playPillSound();
    } else if (me.lastDrink) {
      playSipSound();
    }
  }

  let statusCardHtml = '';

  if (me.autoPillUsed) {
    statusCardHtml = `
      <div class="card" style="text-align:center; border-color:var(--btn-brass); background:rgba(212,175,55,0.08); padding:16px;">
        <div style="font-size:2.2rem; margin-bottom:4px;">💊</div>
        <h2 style="font-size:1.35rem; font-weight:900; color:var(--btn-brass); margin-bottom:6px;">
          ${L.autoPillTitle}
        </h2>
        <p style="font-size:0.85rem; font-weight:700; color:var(--text-main); margin-bottom:6px; line-height:1.4;">
          ${L.autoPillDesc}
        </p>
        <p style="font-size:0.8rem; font-weight:700; color:var(--btn-poison);">
          ${L.autoPillReloadTip}
        </p>
      </div>
    `;
  } else if (!me.alive) {
    statusCardHtml = `
      <div class="death-card">
        <div style="margin-bottom:8px;">${ICONS.skull}</div>
        <h2 style="font-size:1.8rem; font-weight:900; color:var(--btn-crimson); margin-bottom:6px;">
          ${L.eliminatedTitle}
        </h2>
        <p style="font-size:1.05rem; font-weight:800; color:var(--text-main); margin-bottom:8px;">
          ${L.fondipDrink}
        </p>
        <p style="font-size:0.8rem; font-weight:600; color:var(--text-muted);">
          ${L.deadDesc}
        </p>
      </div>
    `;
  } else {
    statusCardHtml = `
      <div class="card" style="text-align:center; border-color:var(--btn-poison);">
        <h2 style="font-size:1.6rem; font-weight:900; color:var(--btn-poison); margin-bottom:4px;">
          ${L.survivedTitle}
        </h2>
        <p style="color:var(--text-muted); font-size:0.85rem; font-weight:600;">
          ${me.lastDrink ? L.survivedDescDrink : L.survivedDescSkip}
        </p>
      </div>
    `;
  }

  let formattedLogs = [];
  if (!logs || logs.length === 0) {
    formattedLogs.push(L.noDeathsRound);
  } else {
    for (const l of logs) {
      if (typeof l === 'string') {
        formattedLogs.push(l);
      } else if (l && l.type) {
        if (l.type === 'DEATH') {
          formattedLogs.push(`☠️ ${L.logDeath(l.name)}`);
        } else if (l.type === 'PILL' || l.type === 'POISONED_PILL') {
          formattedLogs.push(`💊 ${L.logPill(l.name)}`);
        } else if (l.type === 'WINNER') {
          formattedLogs.push(`👑 ${L.logWinner(l.winner)}`);
        } else if (l.type === 'MUTUAL_DEATH') {
          formattedLogs.push(`🍻 ${L.gameOverMutualDesc}`);
        }
      }
    }
  }

  const logItems = formattedLogs.map(text => `
    <li style="margin-bottom:6px; font-weight:600; padding-bottom:4px; border-bottom:1px dashed var(--border-subtle);">
      ${text}
    </li>
  `).join('');

  const detailedLogs = currentRoom.detailedLogs || [];
  const currentRoundSwaps = detailedLogs.filter(ev => 
    ev.round === currentRoom.round && 
    (ev.type === 'SWAP_ACCEPTED' || ev.type === 'SWAP_REJECTED') &&
    (ev.fromId === me.id || ev.from === me.name || ev.toId === me.id || ev.to === me.name)
  );

  let swapResultHtml = '';
  if (currentRoundSwaps.length > 0) {
    swapResultHtml = currentRoundSwaps.map(ev => {
      const isSender = (ev.fromId === me.id || ev.from === me.name);
      if (ev.type === 'SWAP_ACCEPTED') {
        return `
          <div class="card-subtle" style="background:#e8f4ed; border:1.5px solid #2e7d32; text-align:center; padding:10px 12px; margin-bottom:8px;">
            <strong style="color:#2e7d32; font-size:0.88rem;">
              🤝 ${isSender ? L.swapAcceptedForYou(ev.to) : L.swapAcceptedByYou(ev.from)}
            </strong>
          </div>
        `;
      } else {
        return `
          <div class="card-subtle" style="background:#fdf2f2; border:1.5px solid #d9534f; text-align:center; padding:10px 12px; margin-bottom:8px;">
            <strong style="color:#d9534f; font-size:0.88rem;">
              ❌ ${isSender ? L.swapRejectedForYou(ev.to) : L.swapRejectedByYou(ev.from)}
            </strong>
          </div>
        `;
      }
    }).join('');
  }

  appEl.innerHTML = `
    <div class="app-header">
      <div class="brand-title">${L.round} ${currentRoom.round} ${L.resultsTitle}</div>
      ${renderLangToggle()}
    </div>

    ${statusCardHtml}

    ${swapResultHtml}

    <div class="card">
      <span class="input-label">${L.roundEvents}</span>
      <ul style="list-style-type:none; font-size:0.85rem; color:var(--text-main); margin-top:8px;">
        ${logItems}
      </ul>
    </div>

    ${renderPersonalLog(me, currentRoom, L)}

    <div style="margin-top:auto; padding-top:12px;">
      ${me.isHost ? `
        <button class="btn btn-primary" id="btnNextRound">
          ${L.nextRoundBtn}
        </button>
      ` : `
        <div style="text-align:center; color:var(--text-muted); font-weight:700; padding:14px;">
          ${L.waitingNextRound}
        </div>
      `}
    </div>
  `;

  attachLangEvents();

  if (me.isHost) {
    document.getElementById('btnNextRound').onclick = async () => {
      selectedDrink = null;
      selectedActionType = 'PASS';
      selectedTarget = null;
      await nextRound(currentRoom.code);
    };
  }
}

// -------------------------------------------------------------------
// 6. GAME OVER SCREEN
// -------------------------------------------------------------------
function renderGameOver() {
  const L = getL();
  const isMutual = currentRoom.winner.includes('BERABERE');

  appEl.innerHTML = `
    <div style="display:flex; justify-content:flex-end; width:100%;">
      ${renderLangToggle()}
    </div>

    <div class="hero-art" style="padding-top:20px;">
      ${isMutual ? ICONS.skull : ICONS.crown}
      <h1 class="brand-title" style="font-size:1.6rem; margin-top:16px; text-align:center;">
        ${isMutual ? L.gameOverMutual : L.gameOverTitle}
      </h1>
      <h2 style="font-size:2rem; font-weight:900; color:${isMutual ? 'var(--btn-crimson)' : 'var(--btn-poison)'}; margin:10px 0; text-align:center;">
        ${currentRoom.winner}
      </h2>
      <p style="color:var(--text-muted); font-weight:600; font-size:0.9rem; text-align:center; max-width:320px; line-height:1.4;">
        ${isMutual ? L.gameOverMutualDesc : L.gameOverWinnerDesc}
      </p>
    </div>

    <div style="margin-top:auto; padding-top:24px;">
      <button class="btn btn-primary" id="btnRestart">
        ${L.restartBtn}
      </button>
    </div>
  `;

  attachLangEvents();

  document.getElementById('btnRestart').onclick = () => {
    localStorage.removeItem('cot_room_code');
    localStorage.removeItem('cot_player_id');
    myRoomCode = '';
    myPlayerId = '';
    currentRoom = null;
    renderHome();
  };
}

// -------------------------------------------------------------------
// 7. SPECTATOR SCREEN FOR DEAD PLAYERS
// -------------------------------------------------------------------
function formatDetailedEvent(ev, L) {
  switch (ev.type) {
    case 'POISON':
      return L.detailPoison(ev.actor, ev.target);
    case 'SWAP_OFFER':
      return L.detailSwapOffer(ev.actor, ev.target);
    case 'SWAP_ACCEPTED':
      return L.detailSwapAccepted(ev.from, ev.to);
    case 'SWAP_REJECTED':
      return L.detailSwapRejected(ev.from, ev.to);
    case 'SWAP_CANCELLED':
      return `⚠️ <strong>${ev.from}</strong> ile <strong>${ev.to}</strong> arasındaki takas iptal edildi (çifte takas).`;
    case 'SWAP_EXPIRED':
      return `⌛ <strong>${ev.from}</strong>'in <strong>${ev.to}</strong>'a teklifi yanıtsız kalarak zaman aşımına uğradı.`;
    case 'DRINK_CLEAN':
      return L.detailDrinkClean(ev.actor);
    case 'DRINK_POISONED':
      return L.detailDrinkPoison(ev.actor);
    case 'SKIP':
      return L.detailSkip(ev.actor);
    case 'DEATH':
      return L.detailDeath(ev.actor);
    case 'PILL':
    case 'POISONED_PILL':
      return L.detailPill(ev.actor);
    case 'WINNER':
      return L.detailWinner(ev.winner);
    case 'MUTUAL_DEATH':
      return L.detailMutual;
    default:
      return '';
  }
}

function renderSpectatorScreen() {
  const L = getL();
  const me = currentRoom.players[myPlayerId];
  const alivePlayers = Object.values(currentRoom.players || {}).filter(p => p.alive);
  const detailedLogs = currentRoom.detailedLogs || [];

  // Group detailed logs by round (newest round at top)
  const roundsMap = {};
  for (const ev of detailedLogs) {
    const r = ev.round || 1;
    if (!roundsMap[r]) roundsMap[r] = [];
    roundsMap[r].push(ev);
  }

  const roundKeys = Object.keys(roundsMap).map(Number).sort((a, b) => b - a);

  let detailedLogHtml = '';
  if (roundKeys.length === 0) {
    detailedLogHtml = `<div style="text-align:center; color:var(--text-muted); font-size:0.85rem; padding:16px;">${L.waitingForAlive}</div>`;
  } else {
    detailedLogHtml = roundKeys.map(r => {
      const items = roundsMap[r].map(ev => {
        const text = formatDetailedEvent(ev, L);
        if (!text) return '';
        return `
          <div style="padding:6px 0; border-bottom:1px dashed var(--border-subtle); font-size:0.85rem; line-height:1.4;">
            ${text}
          </div>
        `;
      }).filter(Boolean).join('');

      return `
        <div style="margin-bottom:12px; background:var(--bg-parchment); border:1.5px solid var(--border-subtle); border-radius:8px; padding:10px;">
          <div style="font-weight:900; font-size:0.75rem; text-transform:uppercase; color:var(--btn-espresso); letter-spacing:1px; margin-bottom:6px;">
            ${L.round} ${r}
          </div>
          ${items || `<div style="color:var(--text-muted); font-size:0.8rem;">${L.waitingForAlive}</div>`}
        </div>
      `;
    }).join('');
  }

  // Live Classified Intel on living players
  const alivePlayersRows = alivePlayers.map(p => `
    <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 10px; background:var(--bg-parchment); border:1px solid var(--border-subtle); border-radius:8px;">
      <span style="font-weight:800; font-size:0.9rem;">${p.isBot ? '🤖 ' : ''}${p.name}</span>
      <div style="display:flex; align-items:center; gap:6px;">
        <span style="font-size:0.75rem; font-weight:800; padding:2px 8px; border-radius:6px; background:${p.cupPoisoned ? '#fdf2f2' : '#e8f4ed'}; color:${p.cupPoisoned ? '#d9534f' : '#1e5e39'}; border:1px solid ${p.cupPoisoned ? '#d9534f' : '#1e5e39'};">
          ${p.cupPoisoned ? `🧪 ${L.cupPoisonLabel}` : `☕ ${L.cupCleanLabel}`}
        </span>
        <span style="font-size:0.7rem; font-weight:700; color:var(--text-muted);">
          (${L.skipCounterVal(p.skips)})
        </span>
      </div>
    </div>
  `).join('');

  appEl.innerHTML = `
    <div class="app-header">
      <div class="brand-title">${L.title}</div>
      <div style="display:flex; align-items:center; gap:8px;">
        <div class="room-badge" style="background:#fdf2f2; color:#d9534f; border-color:#d9534f;">
          ☠️ ${L.spectatorBadge}
        </div>
        ${renderLangToggle()}
      </div>
    </div>

    <!-- Notice Card -->
    <div class="card" style="text-align:center; padding:16px 12px; border-color:var(--border-strong);">
      <div style="font-size:2rem; margin-bottom:4px;">👻</div>
      <h2 style="font-size:1.15rem; font-weight:900; color:var(--text-main); margin-bottom:4px;">
        ${L.spectatorTitle}
      </h2>
      <p style="font-size:0.8rem; font-weight:600; color:var(--text-muted); line-height:1.4;">
        ${L.spectatorSubtitle}
      </p>
      <div style="margin-top:8px; font-size:0.85rem; font-weight:800; color:var(--btn-crimson);">
        ${L.fondipDrink}
      </div>
    </div>

    <!-- Secret Live Table Status -->
    <div class="card">
      <span class="input-label">${L.liveTableTitle}</span>
      <div style="margin-top:8px; display:flex; flex-direction:column; gap:6px;">
        ${alivePlayersRows || `<div style="text-align:center; color:var(--text-muted);">${L.waitingForAlive}</div>`}
      </div>
    </div>

    <!-- Full Detailed Game Log -->
    <div class="card">
      <span class="input-label">${L.fullLogTitle}</span>
      <div style="margin-top:8px; max-height:280px; overflow-y:auto;">
        ${detailedLogHtml}
      </div>
    </div>

    <div style="margin-top:auto; padding-top:12px; display:flex; flex-direction:column; gap:8px;">
      ${me.isHost && currentRoom.status === 'PHASE_3' ? `
        <button class="btn btn-primary" id="btnSpectatorNextRound">
          ${L.nextRoundBtn}
        </button>
      ` : ''}
      ${me.isHost && currentRoom.status === 'PHASE_2' ? `
        <button class="btn btn-neutral" id="btnSpectatorForcePhase3" style="border-color:var(--border-strong);">
          ${L.revealResultsHost}
        </button>
      ` : ''}
      <button class="btn btn-neutral" id="btnLeaveSpectator" style="border-color:transparent; color:#888;">
        ${L.leave}
      </button>
    </div>
  `;

  attachLangEvents();

  if (me.isHost) {
    const btnNext = document.getElementById('btnSpectatorNextRound');
    if (btnNext) {
      btnNext.onclick = async () => {
        selectedDrink = null;
        selectedActionType = 'PASS';
        selectedTarget = null;
        await nextRound(currentRoom.code);
      };
    }

    const btnForce = document.getElementById('btnSpectatorForcePhase3');
    if (btnForce) {
      btnForce.onclick = async () => {
        await advanceToPhase3(currentRoom.code, currentRoom);
      };
    }
  }

  document.getElementById('btnLeaveSpectator').onclick = () => {
    localStorage.removeItem('cot_room_code');
    localStorage.removeItem('cot_player_id');
    myRoomCode = '';
    myPlayerId = '';
    currentRoom = null;
    renderHome();
  };
}
