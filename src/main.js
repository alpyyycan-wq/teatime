import { DB } from './firebaseConfig.js';
import { 
  createRoom, 
  joinRoom, 
  startGame, 
  submitDropAction, 
  checkPhase1Completion, 
  advanceToPhase2,
  submitVerdict,
  checkPhase2Completion, 
  advanceToPhase3, 
  nextRound,
  kickPlayer,
  rematch
} from './gameLogic.js';
import { playDeathBell, playPillSound, playSipSound, playPoisonSound, playSlideSound } from './audio.js';
import { ICONS, renderColoredTeacup, CUP_PALETTES } from './icons.js';
import { ASSET_IMAGES } from './assetData.js';
import { initAdminPanel, cleanupAdminPanel } from './admin.js';
import { addBot, runBotLifecycle } from './botLogic.js';
import { auditorAgent } from './telemetryAuditor.js';

const appEl = document.getElementById('app');

let isAuditorOpen = false;
let activeAuditorTab = 'timeline'; // 'timeline' | 'bots' | 'critique'

// Language selection (TR or EN)
let currentLang = localStorage.getItem('cot_lang') || 'tr';

const t = {
  tr: {
    title: "CUP OF TEA",
    subtitle: "Siyanür Küpü & Çay Partisi",
    yourName: "Adın / Lakabın",
    namePlaceholderHost: "Örn: Arthur",
    namePlaceholderJoin: "Örn: Victoria",
    createRoom: "Oda Oluştur",
    createCardTitle: "YENİ BİR MASA KUR",
    createCardSub: "Viktorya salonunda dostlarınla toplan.",
    createRoomBtn: "☕ MASA OLUŞTUR",
    roomCodeLabel: "4 Haneli Oda Kodu",
    joinRoom: "Odaya Katıl",
    joinCardTitle: "BİR MASAYA KATIL",
    joinCardSub: "4 haneli kod ile salona dahil ol.",
    joinRoomBtn: "🚪 MASAYA KATIL",
    roomCodeTitle: "Oda Kodu",
    playersAtTable: (n) => `Masada ${n} kişi var`,
    playersList: "Masadakiler",
    you: "(Sen)",
    host: "Kurucu",
    ready: "Hazır",
    startGame: (n) => `OYUNU BAŞLAT (${n} OYUNCU)`,
    waitingHost: "Kurucunun başlatması bekleniyor...",
    leave: "Ayrıl",
    round: "RAUND",
    readyCounter: (r, t) => `${r}/${t} Hazır`,
    scoreLabel: "Şeker Puanı",
    scoreVal: (p) => `${p}/8 🍬`,
    pillLabel: "Panzehir (Can)",
    pillVal: (p) => p > 0 ? "1 Can 💊" : "Tükendi",
    cyanideLabel: "Siyanür",
    cyanideVal: (c) => c > 0 ? `${c} Doz ☠️` : "Boş",
    swapLabel: "Takas Hakkı",
    swapVal: (s) => (s ?? 1) > 0 ? "1 Hak 🔄" : "Tükendi",
    swapBtn: (s) => `🔄 FİNCANI DEĞİŞTİR & İÇ ${(s ?? 1) <= 0 ? '(Tükendi)' : '(1 Hak)'}`,
    swapTargetTitle: "Kimin Fincanıyla Takas Edeceksin?",
    swapTargetSub: "Fincanını hedefin fincanıyla gizlice değiştir ve onun çayını iç!",
    swapBannerTitle: "FİNCANINI GİZLİCE DEĞİŞTİRDİN! 🔄",
    swapBannerSub: (target) => `${target}'ın fincanını aldın. Kendi fincanın ${target}'a gitti!`,
    logCupSwap: (actor, target) => `🔄 ${actor}, gizlice ${target}'ın fincanını çaldı ve içti!`,
    detailCupSwap: (actor, target) => `🔄 <strong>${actor}</strong>, gizlice <strong>${target}</strong>'ın fincanını çaldı ve içti!`,
    phase1Title: "1. ADIM: ŞEKERİ AT",
    phase1Desc: "Gizlice bir fincana tatlı şeker veya siyanür bırak.",
    dropSweetBtn: "🍬 Çayı Şekerle",
    dropCyanideBtn: (c) => `☠️ Çayı Zehirle ${c > 0 ? `(${c})` : '(0)'}`,
    targetLabel: "Kimin Fincanına Atacaksın?",
    targetOpponentSweetSub: "İkram (+1 Siyanür)",
    targetOpponentCyanideSub: "Zehirle (+2 Puan)",
    hintSweetOpponent: "🍬 Tatlı şeker ikramı: İçerse puan alır, sen +1 Siyanür kazanırsın.",
    hintCyanide: "☠️ Siyanür tuzağı: İçerse zehirlenir, sen +2 Puan kazanırsın.",
    killBountyBanner: (kills) => `🎯 +${kills * 2} SUİKASTÇI PUANI KAZANDIN!`,
    killBountySub: "Zehirlediğin kurban çayını içti ve elendi!",
    logDeathWithKiller: (victim, killer) => `🎯 ${killer}, ${victim}'ı zehirleyerek eledi (+2 Suikastçı Puanı)!`,
    logDeathMultiKillers: (victim, killers) => `🎯 ${killers.join(', ')} ortaklaşa ${victim}'ı zehirledi (+2'şer Puan)!`,
    confirmAction: "Kararımı Onayla / Hazırım",
    waitingOthers: (r, t) => `Diğerleri Bekleniyor (${r}/${t})`,
    phase2Title: "2. ADIM: ÇAYLAR MASADA & KARAR",
    phase2Header: "Masadaki Fincanlar & Blöf",
    phase2Desc: "Fincanlar masada. İç, dök veya takas et.",
    cupSugars: (n) => 'Şeker',
    cupSugarsMe: (n) => `Fincanında ${n} Şeker Var!`,
    phase2CandleHeader: "DECISION PHASE .",
    myCupStatusLabel: "SENİN FİNCANIN:",
    actionDrinkTitle: "DRINK",
    actionDumpTitle: "DUMP",
    actionSwapTitle: "SWAP CUP",
    drinkHint: (n) => `+${n} Puan (Temizse) | Siyanür Öldürür`,
    dumpHint: "0 Puan | Zehirden Kesin Kurtuluş",
    swapHint: (target) => `🔄 ${target ? target + ' ile' : 'Hedefle'} fincanını takas et!`,
    chooseActionFirst: "Önce Bir Karar Seç",
    safeBadgeText: "0 🍬 (Güvenli)",
    swapCountBadge: (has) => has ? "1 Hak" : "Tükendi",
    drinkBtn: "☕ ÇAYIMI İÇİYORUM",
    dumpBtn: "🫗 ÇAYI DÖKÜYORUM",
    drinkTipClean: (n) => `Temizse +${n} Puan! Zehir varsa elenirsin!`,
    dumpTip: "Güvendesin ama 0 puan alırsın.",
    confirmVerdict: "Kararımı Onayla / Hazırım",
    revealResultsHost: "➡️ Masayı Açıkla (Fazı Bitir)",
    verdictTitle: "Çayını Ne Yapacaksın?",
    resultsTitle: "RESULT PHASE",
    autoPillTitle: "ZEHİRLENDİN AMA PANZEHİR KURTARDI!",
    autoPillDesc: (lost) => `Panzehir hayatını kurtardı (-${lost || 2} Puan).`,
    poisonHitBanner: (hits) => `🎯 +${hits} ZEHİRLEME PUANI KAZANDIN!`,
    poisonHitSub: "Zehirlediğin kurban siyanürlü çayı içti!",
    eliminatedTitle: "ZEHİRLENDİN VE ELENDİN!",
    fondipDrink: "İçkini FONDİP yap! 🍺",
    deadDesc: "Kadehinde siyanür vardı. Masayı izle.",
    survivedTitleClean: (pts) => `+${pts} ŞEKER PUANI KAZANDIN! 🍬`,
    survivedCleanSub: "Temiz çayını içtin ve puanları aldın!",
    dumpReliefTitle: "KIL PAYI YIRTTIN! 😮‍💨",
    dumpReliefDesc: "(Çayında siyanür vardı!)",
    dumpRegretTitle: "BOŞA DÖKTÜN! 🤦‍♂️",
    dumpRegretDesc: (n) => `Fincanındaki ${n} şeker heba oldu (Temizdi).`,
    leaderboardTitle: "Skor Tablosu (Hedef: 8 Puan)",
    roundEvents: "Bu Raund Neler Yaşandı?",
    noEventsRound: "Bu raund özel bir olay yaşanmadı.",
    poisonTitle: "ÖLÜMCÜL ZEHİRLENME!",
    poisonSubtitle: "Viktorya Salonunda Cinayet İfşa Oldu",
    victimLabel: "KURBAN",
    killerLabel: "KATİL",
    bountyAwarded: (b) => `+${b} Suikast Puanı`,
    pillSavedBadge: (pts) => `💊 Panzehir Korudu (-${pts} Puan)`,
    eliminatedBadge: "☠️ Siyanürle Zehirlendi (Elendi)",
    poisonProceedBtn: "➜ SONUÇLARA DEVAM ET",
    roundChroniclesTitle: "BU RAUND NELER YAŞANDI?",
    roundChroniclesSub: "Masadaki Tüm Kararlar & Olaylar",
    liveLeaderboardTitle: "CANLI SKOR TABLOSU",
    leaderboardTarget: "Hedef: 8 Puan",
    aliveStatus: "HAYATTA",
    deadStatus: "ELENDİ",
    logDeath: (name) => `☠️ ${name} siyanürlü çayı içti ve elendi!`,
    logPill: (name, lost) => `💊 ${name} siyanür içti, panzehiri kurtardı (-${lost || 2} Puan)!`,
    logPillWithKiller: (victim, killer, lost) => `💊 ${victim}, ${killer}'ın siyanürünü içti! Panzehiri kurtardı (-${lost || 2} Puan, ${killer} +1 Ödül)!`,
    logDrinkClean: (name, pts) => `☕ ${name} temiz çayını içti (+${pts} Puan)!`,
    logDumpRelief: (name) => `🫗 ${name} çayını döktü (İçinde Siyanür vardı, kurtuldu! 😮‍💨)`,
    logDumpRegret: (name) => `🫗 ${name} şüphelendi ve döktü (Çay temizdi! 🤦‍♂️)`,
    logWinnerPoints: (winner, pts) => `👑 ŞAMPİYON: ${winner} (${pts} Şeker Puanı)!`,
    logWinnerSurvivor: (winner) => `👑 ŞAMPİYON: ${winner} (Son Hayatta Kalan)!`,
    nextRoundBtn: "Sonraki Raundu Başlat",
    waitingNextRound: "Kurucunun sonraki raundu başlatması bekleniyor...",
    gameOverTitle: "ŞAMPİYON BELLİ OLDU!",
    gameOverMutual: "ÇİFTE CİNAYET!",
    gameOverMutualDesc: "Tüm finalistler aynı anda zehirlendi! TÜM MASA FONDİP YAPIYOR!",
    gameOverWinnerDesc: "Tüm blöfleri ve zehirleri aşıp 8 puana ulaşan şampiyon oldu!",
    restartBtn: "Yeni Oyun Başlat",
    duplicateNameError: "Bu isimde bir oyuncu zaten odada var!",
    kickedFromRoom: "Oda kurucusu tarafından oyundan çıkarıldınız!",
    kickBtn: "At",
    spectatorBadge: "İZLEYİCİ",
    spectatorTitle: "ÖLÜLER MASASI",
    spectatorSubtitle: "Masadaki tüm gizli sırları canlı izle.",
    liveTableTitle: "Canlı Masa Durumu (Gizli İstihbarat)",
    fullLogTitle: "Oyun Günlüğü",
    cupCleanLabel: "Temiz Çay",
    cupPoisonLabel: "ZEHİRLİ!",
    detailDropSweet: (actor, target) => `🍬 <strong>${actor}</strong>, <strong>${target}</strong>'ın fincanına tatlı şeker attı.`,
    detailGiftCyanide: (actor, target) => `🎁 <strong>${actor}</strong>, <strong>${target}</strong>'a şeker verdi ve <strong>+1 SİYANÜR</strong> kazandı!`,
    detailDropCyanide: (actor, target) => `☠️ <strong>${actor}</strong>, <strong>${target}</strong>'ın fincanına SİYANÜR attı!`,
    detailDrinkClean: (actor, pts) => `☕ <strong>${actor}</strong> çayını içti (+${pts} Puan, temiz).`,
    detailDrinkPoison: (actor) => `☠️ <strong>${actor}</strong> zehirli çayı içti!`,
    detailDumpRelief: (actor) => `🫗 <strong>${actor}</strong> çayını döktü (Siyanürden kurtuldu! 😮‍💨)`,
    detailDumpRegret: (actor) => `🫗 <strong>${actor}</strong> çayını döktü (Temiz çaydı! 🤦‍♂️)`,
    detailDeath: (actor) => `💀 <strong>${actor}</strong> siyanür sebebiyle öldü!`,
    detailPill: (actor) => `💊 <strong>${actor}</strong> siyanür içti ama panzehiri kurtardı!`,
    detailWinnerPoints: (winner, pts) => `👑 ŞAMPİYON: <strong>${winner}</strong> (${pts} Puan)!`,
    detailWinnerSurvivor: (winner) => `👑 ŞAMPİYON: <strong>${winner}</strong> (Son Hayatta Kalan)!`,
    detailMutual: "🍻 Herkes aynı anda öldü! TÜM MASA FONDİP YAPIYOR!",
    waitingForAlive: "Masadakiler gizli kararlarını veriyor...",
    personalLogTitle: "SENİN HAMLE GEÇMİŞİN",
    onlyVisibleToYou: "Sadece Sen Görürsün",
    personalLogEmpty: "Henüz bir hamle yapmadın.",
    myLogDropSweet: (r, target) => `🍬 <strong>${r}</strong>${target}'ın fincanına tatlı şeker attın.`,
    myLogGiftCyanide: (r, target) => `🎁 <strong>${r}</strong>${target}'a tatlı şeker ikram ettin ve +1 SİYANÜR kazandın!`,
    myLogDropCyanide: (r, target) => `☠️ <strong>${r}</strong>${target}'ın fincanına gizlice SİYANÜR attın!`,
    myLogDrinkClean: (r, pts) => `☕ <strong>${r}</strong>Çayını içtin (+${pts} Puan, temizdi).`,
    myLogDrinkPoison: (r) => `☠️ <strong>${r}</strong>Çayını içtin (Siyanür vardı!).`,
    myLogDumpRelief: (r) => `🫗 <strong>${r}</strong>Çayını döktün (Siyanür vardı, kurtuldun! 😮‍💨)`,
    myLogDumpRegret: (r, sweet) => `🫗 <strong>${r}</strong>Çayını döktün (${sweet} şekerli temiz çaydı! 🤦‍♂️)`,
    myLogPill: (r) => `💊 <strong>${r}</strong>Siyanür içtin ama panzehirin kurtardı!`,
    myLogDeath: (r) => `💀 <strong>${r}</strong>Siyanür içtin ve elendin!`,
    adminPanel: "🛠️ Yönetici Paneli",
    addBot: "+ Bot Ekle"
  },
  en: {
    title: "CUP OF TEA",
    subtitle: "Sugar & Cyanide Tea Party",
    yourName: "Your Name / Nickname",
    namePlaceholderHost: "e.g. Arthur",
    namePlaceholderJoin: "e.g. Victoria",
    createRoom: "Create Room",
    createCardTitle: "HOST A NEW TABLE",
    createCardSub: "Gather your company in the Victorian parlor.",
    createRoomBtn: "☕ CREATE TABLE",
    roomCodeLabel: "4-Letter Room Code",
    joinRoom: "Join Room",
    joinCardTitle: "JOIN A TABLE",
    joinCardSub: "Enter 4-letter room code to join the parlor.",
    joinRoomBtn: "🚪 JOIN TABLE",
    roomCodeTitle: "Room Code",
    playersAtTable: (n) => `${n} players at table`,
    playersList: "At The Table",
    you: "(You)",
    host: "Host",
    ready: "Ready",
    startGame: (n) => `START GAME (${n} PLAYERS)`,
    waitingHost: "Waiting for host to start...",
    leave: "Leave",
    round: "ROUND",
    readyCounter: (r, t) => `${r}/${t} Ready`,
    scoreLabel: "Sugar Points",
    scoreVal: (p) => `${p}/8 🍬`,
    pillLabel: "Antidote (Life)",
    pillVal: (p) => p > 0 ? "1 Life 💊" : "Spent",
    cyanideLabel: "Cyanide",
    cyanideVal: (c) => c > 0 ? `${c} Dose${c > 1 ? 's' : ''} ☠️` : "Empty",
    swapLabel: "Cup Swap",
    swapVal: (s) => (s ?? 1) > 0 ? "1 Left 🔄" : "Spent",
    swapBtn: (s) => `🔄 SWAP CUP & DRINK ${(s ?? 1) <= 0 ? '(Spent)' : '(1 Left)'}`,
    swapTargetTitle: "Whose cup will you swap with?",
    swapTargetSub: "Secretly swap cups with your target and drink their tea!",
    swapBannerTitle: "YOU SECRETLY SWAPPED CUPS! 🔄",
    swapBannerSub: (target) => `You took ${target}'s cup. Your cup went to ${target}!`,
    logCupSwap: (actor, target) => `🔄 ${actor} secretly swapped cups with ${target} and drank it!`,
    detailCupSwap: (actor, target) => `🔄 <strong>${actor}</strong> secretly swapped cups with <strong>${target}</strong> and drank it!`,
    phase1Title: "STEP 1: DROP THE SUGAR",
    phase1Desc: "Secretly plant sugar or cyanide into an opponent's cup.",
    dropSweetBtn: "🍬 Sugar Tea",
    dropCyanideBtn: (c) => `☠️ Poison Tea ${c > 0 ? `(${c})` : '(0)'}`,
    targetLabel: "Whose cup are you targeting?",
    targetOpponentSweetSub: "Treat (+1 Cyanide)",
    targetOpponentCyanideSub: "Poison (+2 Bounty)",
    hintSweetOpponent: "🍬 Sweet sugar: If they drink, they score, and you reload +1 Cyanide!",
    hintCyanide: "☠️ Cyanide dose: If they drink, they are eliminated and you gain +2 Points!",
    killBountyBanner: (kills) => `🎯 +${kills * 2} ASSASSIN BOUNTY EARNED!`,
    killBountySub: "Your poisoned victim drank and was eliminated!",
    logDeathWithKiller: (victim, killer) => `🎯 ${killer} poisoned and eliminated ${victim} (+2 Bounty)!`,
    logDeathMultiKillers: (victim, killers) => `🎯 ${killers.join(', ')} jointly poisoned ${victim} (+2 each)!`,
    confirmAction: "Confirm Decision / Ready",
    waitingOthers: (r, t) => `Waiting for Others (${r}/${t})`,
    phase2Title: "STEP 2: TEACUPS REVEAL & VERDICT",
    phase2Header: "Teacups on Table & Bluff",
    phase2Desc: "Cups on the table. Drink, dump, or swap.",
    cupSugars: (n) => n === 1 ? 'Sugar' : 'Sugars',
    cupSugarsMe: (n) => `Your Cup Has ${n} Sugar(s)!`,
    phase2CandleHeader: "DECISION PHASE .",
    myCupStatusLabel: "YOUR CUP:",
    actionDrinkTitle: "DRINK",
    actionDumpTitle: "DUMP",
    actionSwapTitle: "SWAP CUP",
    drinkHint: (n) => `+${n} Pts (If Clean) | Cyanide Kills`,
    dumpHint: "0 Pts | Guaranteed Survival",
    swapHint: (target) => `🔄 Swap cups with ${target || 'target'}!`,
    chooseActionFirst: "Choose an Action First",
    safeBadgeText: "0 🍬 (Safe)",
    swapCountBadge: (has) => has ? "1 Left" : "None",
    drinkBtn: "☕ DRINK MY TEA",
    dumpBtn: "🫗 DUMP THE TEA",
    drinkTipClean: (n) => `If clean, +${n} Points! If poisoned, you drink cyanide!`,
    dumpTip: "Safe, but you get 0 points.",
    confirmVerdict: "Confirm My Decision",
    revealResultsHost: "➡️ Reveal Results (End Phase)",
    verdictTitle: "What will you do with your tea?",
    resultsTitle: "RESULT PHASE",
    autoPillTitle: "POISONED BUT SAVED BY ANTIDOTE!",
    autoPillDesc: (lost) => `Antidote saved your life (-${lost || 2} Points).`,
    poisonHitBanner: (hits) => `🎯 +${hits} POISON BOUNTY EARNED!`,
    poisonHitSub: "Your victim drank your poisoned cup!",
    eliminatedTitle: "POISONED AND ELIMINATED!",
    fondipDrink: "CHUG YOUR REAL DRINK! 🍺",
    deadDesc: "Cyanide was in your cup. Spectate the table.",
    survivedTitleClean: (pts) => `+${pts} SUGAR POINTS EARNED! 🍬`,
    survivedCleanSub: "You drank clean tea and banked points!",
    dumpReliefTitle: "NARROW ESCAPE! 😮‍💨",
    dumpReliefDesc: "(There was cyanide in your tea!)",
    dumpRegretTitle: "YOU DUMPED FOR NOTHING! 🤦‍♂️",
    dumpRegretDesc: (n) => `Wasted ${n} sugar(s) (It was clean).`,
    leaderboardTitle: "Leaderboard (Goal: 8 Points)",
    roundEvents: "What Happened This Round?",
    noEventsRound: "No special incidents this round.",
    poisonTitle: "FATAL POISONING!",
    poisonSubtitle: "Victorian Murder Revealed in the Parlor",
    victimLabel: "VICTIM",
    killerLabel: "KILLER",
    bountyAwarded: (b) => `+${b} Assassin Bounty`,
    pillSavedBadge: (pts) => `💊 Saved by Pill (-${pts} Pts)`,
    eliminatedBadge: "☠️ Poisoned & Eliminated",
    poisonProceedBtn: "➜ CONTINUE TO RESULTS",
    roundChroniclesTitle: "ROUND CHRONICLES",
    roundChroniclesSub: "Table Event Log & Decisions",
    liveLeaderboardTitle: "LIVE LEADERBOARD",
    leaderboardTarget: "Target: 8 Points",
    aliveStatus: "ALIVE",
    deadStatus: "DEAD",
    logDeath: (name) => `☠️ ${name} drank cyanide and was eliminated!`,
    logPill: (name, lost) => `💊 ${name} drank cyanide, saved by antidote (-${lost || 2} Points)!`,
    logPillWithKiller: (victim, killer, lost) => `💊 ${victim} drank ${killer}'s cyanide! Antidote saved them (-${lost || 2} Points, ${killer} +1 Bounty)!`,
    logDrinkClean: (name, pts) => `☕ ${name} drank clean tea (+${pts} Points)!`,
    logDumpRelief: (name) => `🫗 ${name} dumped tea (Had Cyanide, dodged death! 😮‍💨)`,
    logDumpRegret: (name) => `🫗 ${name} dumped tea (It was clean, missed points! 🤦‍♂️)`,
    logWinnerPoints: (winner, pts) => `👑 CHAMPION: ${winner} (${pts} Sugar Points)!`,
    logWinnerSurvivor: (winner) => `👑 CHAMPION: ${winner} (Last Survivor)!`,
    nextRoundBtn: "Start Next Round",
    waitingNextRound: "Waiting for host to start next round...",
    gameOverTitle: "A CHAMPION RISES!",
    gameOverMutual: "MUTUAL ASSASSINATION!",
    gameOverMutualDesc: "All finalists drank poison simultaneously! EVERYONE CHUGS!",
    gameOverWinnerDesc: "The cunning survivor who outwitted all traps and reached 8 points wins!",
    restartBtn: "Start New Game",
    duplicateNameError: "A player with this name already exists!",
    kickedFromRoom: "You were kicked from the room by the host!",
    kickBtn: "Kick",
    spectatorBadge: "SPECTATOR",
    spectatorTitle: "TABLE OF THE DEAD",
    spectatorSubtitle: "Watch all secret moves live from the beyond.",
    liveTableTitle: "Live Table Status",
    fullLogTitle: "Complete Game Log",
    cupCleanLabel: "Clean Tea",
    cupPoisonLabel: "POISONED!",
    detailDropSweet: (actor, target) => `🍬 <strong>${actor}</strong> dropped sweet sugar into <strong>${target}</strong>'s cup.`,
    detailGiftCyanide: (actor, target) => `🎁 <strong>${actor}</strong> treated <strong>${target}</strong> to sweet sugar and gained <strong>+1 CYANIDE</strong>!`,
    detailDropCyanide: (actor, target) => `☠️ <strong>${actor}</strong> secretly dropped CYANIDE into <strong>${target}</strong>'s cup!`,
    detailDrinkClean: (actor, pts) => `☕ <strong>${actor}</strong> drank tea (+${pts} Points, clean).`,
    detailDrinkPoison: (actor) => `☠️ <strong>${actor}</strong> drank poison!`,
    detailDumpRelief: (actor) => `🫗 <strong>${actor}</strong> dumped their tea (Saved from cyanide! 😮‍💨)`,
    detailDumpRegret: (actor) => `🫗 <strong>${actor}</strong> dumped their tea (It was clean! 🤦‍♂️)`,
    detailDeath: (actor) => `💀 <strong>${actor}</strong> died from cyanide!`,
    detailPill: (actor) => `💊 <strong>${actor}</strong> drank cyanide but was saved by antidote!`,
    detailWinnerPoints: (winner, pts) => `👑 CHAMPION: <strong>${winner}</strong> (${pts} Points)!`,
    detailWinnerSurvivor: (winner) => `👑 CHAMPION: <strong>${winner}</strong> (Sole Survivor)!`,
    detailMutual: "🍻 Everyone died simultaneously! WHOLE TABLE CHUGS!",
    waitingForAlive: "Survivors are making their secret decisions...",
    personalLogTitle: "YOUR MOVE HISTORY",
    onlyVisibleToYou: "Only Visible To You",
    personalLogEmpty: "No moves made yet.",
    myLogDropSweet: (r, target) => `🍬 <strong>${r}</strong>You dropped sweet sugar into ${target}'s cup.`,
    myLogGiftCyanide: (r, target) => `🎁 <strong>${r}</strong>You treated ${target} to sweet sugar and earned +1 CYANIDE!`,
    myLogDropCyanide: (r, target) => `☠️ <strong>${r}</strong>You secretly dropped CYANIDE into ${target}'s cup!`,
    myLogDrinkClean: (r, pts) => `☕ <strong>${r}</strong>You drank tea (+${pts} Points, clean).`,
    myLogDrinkPoison: (r) => `☠️ <strong>${r}</strong>You drank your tea (Had Cyanide!).`,
    myLogDumpRelief: (r) => `🫗 <strong>${r}</strong>You dumped your tea (Had Cyanide, saved your life! 😮‍💨)`,
    myLogDumpRegret: (r, sweet) => `🫗 <strong>${r}</strong>You dumped your tea (${sweet} sugars, clean tea! 🤦‍♂️)`,
    myLogPill: (r) => `💊 <strong>${r}</strong>You drank cyanide but your antidote saved you!`,
    myLogDeath: (r) => `💀 <strong>${r}</strong>You drank cyanide and were eliminated!`,
    adminPanel: "🛠️ Admin Panel",
    addBot: "+ Add Bot"
  }
};

function getL() {
  return t[currentLang] || t.tr;
}

function renderLangToggle() {
  return `
    <div class="header-controls-group">
      <button id="btnHeaderAuditor" class="btn-header-auditor" title="Lord Inspector - In-Game Telemetry & Critique Agent">
        <span>🕵️</span>
        <span class="header-auditor-label">${currentLang === 'tr' ? 'DENETÇİ' : 'AUDITOR'}</span>
        <span class="header-auditor-count">${auditorAgent.logs.length}</span>
      </button>
      <div style="display:inline-flex; border:2px solid var(--border-strong); border-radius:12px; overflow:hidden; box-shadow:0 2px 0 var(--border-strong);">
        <button id="setLangTr" style="background:${currentLang === 'tr' ? 'var(--btn-espresso)' : 'var(--bg-card)'}; color:${currentLang === 'tr' ? '#fff' : 'var(--text-main)'}; border:none; padding:4px 10px; font-weight:800; font-size:0.75rem; cursor:pointer;">TR</button>
        <button id="setLangEn" style="background:${currentLang === 'en' ? 'var(--btn-espresso)' : 'var(--bg-card)'}; color:${currentLang === 'en' ? '#fff' : 'var(--text-main)'}; border:none; padding:4px 10px; font-weight:800; font-size:0.75rem; cursor:pointer;">EN</button>
      </div>
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
  const btnAuditor = document.getElementById('btnHeaderAuditor');
  if (btnAuditor) {
    btnAuditor.onclick = () => {
      isAuditorOpen = true;
      renderAuditorWidget();
    };
  }
}

function renderParlorEmotesBar() {
  return '';
}

function attachParlorEmoteEvents() {
  // Emotes disabled to prevent screen cluttering
}

function renderAuditorWidget() {
  const existingModal = document.getElementById('auditorDocketModal');
  if (existingModal) existingModal.remove();

  if (!isAuditorOpen) {
    return;
  }

  const health = auditorAgent.getHealthSummary();
  const analysis = auditorAgent.getDynamicCritiqueAnalysis();

  const modal = document.createElement('div');
  modal.id = 'auditorDocketModal';
  modal.className = 'auditor-docket-overlay';

  let tabContentHtml = '';

  if (activeAuditorTab === 'timeline') {
    if (auditorAgent.logs.length === 0) {
      tabContentHtml = `<div style="text-align:center; padding:30px; color:#baa4bd; font-family:var(--font-pixel-heading); font-size:0.75rem;">${currentLang === 'tr' ? 'Henüz telemetri kaydı yok. Oyun ilerledikçe buraya düşecektir.' : 'No telemetry entries yet. Will populate as play progresses.'}</div>`;
    } else {
      tabContentHtml = auditorAgent.logs.map(log => `
        <div class="auditor-log-card">
          <div class="auditor-log-header">
            <span class="auditor-log-actor">👤 ${log.actor}</span>
            <div style="display:flex; align-items:center; gap:6px;">
              <span style="color:#baa4bd; font-size:0.58rem;">R${log.round} [${log.phase}]</span>
              <span class="auditor-metric-badge ${log.uxMetric}">${log.uxMetric}</span>
            </div>
          </div>
          <div class="auditor-log-event">➜ ${log.event}</div>
          ${log.critiqueNote ? `<div class="auditor-log-note">💬 ${log.critiqueNote}</div>` : ''}
          ${log.recommendation ? `<div class="auditor-log-rec">💡 <strong>Tavsiye:</strong> ${log.recommendation}</div>` : ''}
        </div>
      `).join('');
    }
  } else if (activeAuditorTab === 'bots') {
    const botLogs = auditorAgent.logs.filter(l => l.actor.toLowerCase().includes('bot') || l.event.includes('Bot'));
    if (botLogs.length === 0) {
      tabContentHtml = `<div style="text-align:center; padding:30px; color:#baa4bd; font-family:var(--font-pixel-heading); font-size:0.75rem;">${currentLang === 'tr' ? 'Botlar henüz hamle yapmadı.' : 'Bots have not taken turns yet.'}</div>`;
    } else {
      tabContentHtml = botLogs.map(log => {
        const details = log.details || {};
        const uxCritique = details.uxCritique;
        const uxRec = details.uxRecommendation || log.recommendation;
        return `
          <div class="auditor-log-card">
            <div class="auditor-log-header">
              <span class="auditor-log-actor">🤖 ${log.actor} <span style="font-size:0.55rem; color:#ffd866; background:#2c1533; padding:1px 5px; border:1px solid #5a2e66; border-radius:3px;">[UX Agent]</span></span>
              <span style="color:#baa4bd; font-size:0.58rem;">R${log.round} (${log.timestamp})</span>
            </div>
            <div class="auditor-log-event">⚡ ${log.event}</div>
            <div class="auditor-log-note" style="margin-bottom:4px;">🧠 <strong>Strateji:</strong> ${details.motive || log.critiqueNote}</div>
            ${uxCritique ? `
              <div style="background:#1d0e21; border-left:3px solid #e67e22; padding:6px 8px; margin-top:4px; font-size:0.72rem; color:#f0d2e4;">
                <div style="font-family:var(--font-pixel-heading); font-size:0.65rem; color:#f39c12; margin-bottom:2px;">🔍 BOT UX GÖZLEMİ (Hamle Notu):</div>
                <div>${uxCritique}</div>
                ${uxRec ? `<div style="color:#ffd866; font-size:0.68rem; margin-top:3px;">💡 <strong>Düzeltme Tavsiyesi:</strong> ${uxRec}</div>` : ''}
              </div>
            ` : ''}
          </div>
        `;
      }).join('');
    }
  } else if (activeAuditorTab === 'critique') {
    tabContentHtml = `
      <div style="display:flex; flex-direction:column; gap:10px;">
        <div style="background:#200d23; border:2px solid #5a2c60; padding:12px; font-family:var(--font-pixel-ui); font-size:0.78rem; line-height:1.4; color:#f0e2f2;">
          <div style="font-family:var(--font-pixel-heading); color:#ffd866; font-size:0.8rem; margin-bottom:8px;">
            🔎 CANLI PLAYTEST ELEŞTİRİSİ (LORD INSPECTOR):
          </div>
          <div style="display:flex; flex-direction:column; gap:8px;">
            ${analysis.critiqueItems.map(item => `
              <div style="background:${item.type === 'WARN' ? '#331a10' : (item.type === 'PASS' ? '#14291c' : '#1c1b2c')}; border-left:4px solid ${item.type === 'WARN' ? '#e67e22' : (item.type === 'PASS' ? '#2ecc71' : '#3498db')}; padding:8px 10px;">
                <div style="font-family:var(--font-pixel-heading); font-size:0.72rem; color:${item.type === 'WARN' ? '#f39c12' : (item.type === 'PASS' ? '#2ecc71' : '#5dade2')}; margin-bottom:3px;">
                  ${item.type === 'WARN' ? '⚠️' : (item.type === 'PASS' ? '✓' : 'ℹ️')} ${item.title}
                </div>
                <div style="font-size:0.75rem; color:#e0d2e4;">${item.observation}</div>
                ${item.recommendation ? `<div style="font-size:0.72rem; color:#ffd866; margin-top:4px;">💡 <em>${item.recommendation}</em></div>` : ''}
              </div>
            `).join('')}
          </div>
        </div>

        <div style="background:#16091b; border:1.5px solid #4a2850; padding:10px; font-family:var(--font-pixel-ui); font-size:0.72rem; color:#baa4bd;">
          <strong style="color:#ffd866;">Denetçi Metodolojisi:</strong> Her hamle milisaniye bazında loglanır, oyuncu tereddütü (hesitation > 15s), kurucu erken faz atlamaları ve bot taktiksel kararları incelenir.
        </div>
      </div>
    `;
  }

  modal.innerHTML = `
    <div class="auditor-docket-modal">
      <div class="auditor-header">
        <div class="auditor-title-row">
          <span style="font-size:1.2rem;">🕵️</span>
          <div>
            <div class="auditor-title">${currentLang === 'tr' ? 'LORD INSPECTOR: DENETİM RAPORU' : 'LORD INSPECTOR: AUDIT DOCKET'}</div>
            <div style="font-size:0.58rem; color:#baa4bd; font-family:var(--font-pixel-heading);">Victorian Parlor Game Telemetry & Critique Agent</div>
          </div>
        </div>
        <button class="auditor-btn-close" id="btnCloseAuditor">✕</button>
      </div>

      <div class="auditor-score-bar">
        <div class="auditor-score-badge">
          ${currentLang === 'tr' ? 'GENEL SAĞLIK' : 'HEALTH'}: %${health.score} (${health.status})
        </div>
        <div class="auditor-score-counts">
          <span class="count-chip pass">✓ ${health.passCount} Kusursuz</span>
          <span class="count-chip warn">⚠️ ${health.warnCount} Uyarı</span>
          <span class="count-chip friction">⛔ ${health.frictionCount} Sürtünme</span>
        </div>
      </div>

      <div class="auditor-tabs">
        <button class="auditor-tab-btn ${activeAuditorTab === 'timeline' ? 'active' : ''}" data-tab="timeline">
          ${currentLang === 'tr' ? '📋 ADIM ADIM' : '📋 TIMELINE'}
        </button>
        <button class="auditor-tab-btn ${activeAuditorTab === 'bots' ? 'active' : ''}" data-tab="bots">
          ${currentLang === 'tr' ? '🤖 BOT AGENT NOTLARI' : '🤖 BOT AGENT CRITIQUES'}
        </button>
        <button class="auditor-tab-btn ${activeAuditorTab === 'critique' ? 'active' : ''}" data-tab="critique">
          ${currentLang === 'tr' ? '💡 UX ELEŞTİRİ' : '💡 CRITIQUE'}
        </button>
      </div>

      <div class="auditor-body" id="auditorBody">
        ${tabContentHtml}
      </div>

      <div class="auditor-footer">
        <button class="auditor-btn-copy" id="btnCopyAuditorReport">
          📋 ${currentLang === 'tr' ? 'RAPORU KOPYALA (MARKDOWN)' : 'COPY REPORT (MARKDOWN)'}
        </button>
        <button class="auditor-btn-dismiss" id="btnDismissAuditor">
          ✕ ${currentLang === 'tr' ? 'KAPAT' : 'CLOSE'}
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector('#btnCloseAuditor').onclick = () => {
    isAuditorOpen = false;
    renderAuditorWidget();
  };

  modal.querySelector('#btnDismissAuditor').onclick = () => {
    isAuditorOpen = false;
    renderAuditorWidget();
  };

  modal.querySelectorAll('.auditor-tab-btn').forEach(btn => {
    btn.onclick = () => {
      activeAuditorTab = btn.getAttribute('data-tab');
      renderAuditorWidget();
    };
  });

  modal.querySelector('#btnCopyAuditorReport').onclick = () => {
    const md = auditorAgent.exportReportMarkdown();
    navigator.clipboard.writeText(md).then(() => {
      const copyBtn = modal.querySelector('#btnCopyAuditorReport');
      if (copyBtn) copyBtn.textContent = '✓ KOPYALANDI!';
      setTimeout(() => { if (copyBtn) copyBtn.textContent = '📋 RAPORU KOPYALA (MARKDOWN)'; }, 2000);
    });
  };
}


let myRoomCode = localStorage.getItem('cot_room_code') || '';
let myPlayerId = localStorage.getItem('cot_player_id') || '';
let currentRoom = null;

let selectedDropType = 'SWEET'; // 'SWEET' or 'CYANIDE'
let selectedDropTarget = null;  // target playerId
let selectedVerdict = null;     // 'DRINK', 'DUMP', or 'SWAP'
let selectedSwapTarget = null;  // target playerId for swap
let hasPlayedPhase3Sound = false;
let lastSeenRound = 0;
let hasDismissedPoisonCinematic = false;
let hasDismissedModifierModal = false;

const PALETTE_KEYS = ['blue', 'crimson', 'green', 'gold', 'orange', 'silver', 'copper'];
function getPlayerCupPalette(player, index) {
  if (!player) return 'blue';
  const name = (player.name || '').toLowerCase();
  if (name.includes('moriarty')) return 'blue';
  if (name.includes('watson')) return 'crimson';
  if (name.includes('irene')) return 'green';
  if (name.includes('lestrade')) return 'orange';
  if (name.includes('mycroft')) return 'silver';
  if (name.includes('adler') || name.includes('hudson')) return 'copper';
  if (player.id === myPlayerId) return 'gold';
  return PALETTE_KEYS[index % PALETTE_KEYS.length];
}

function getPlayerEmblemNumber(player, index) {
  if (!player) return (index + 1).toString();
  const name = (player.name || '').toLowerCase();
  if (name.includes('moriarty')) return '1';
  if (name.includes('watson')) return '2';
  if (name.includes('irene')) return '0';
  if (player.id === myPlayerId || name.includes('player') || name.includes('yon') || name.includes('sen') || name.includes('arthur')) return '1';
  if (name.includes('lestrade')) return '3';
  if (name.includes('mycroft')) return '2';
  if (name.includes('adler')) return '1';
  return (index % 5).toString();
}

function arrangePlayersFor232Table(players) {
  const me = players.find(p => p.id === myPlayerId);
  const others = players.filter(p => p.id !== myPlayerId);

  const moriarty = others.find(p => (p.name || '').toLowerCase().includes('moriarty'));
  const watson = others.find(p => (p.name || '').toLowerCase().includes('watson'));
  const irene = others.find(p => (p.name || '').toLowerCase().includes('irene'));
  const lestrade = others.find(p => (p.name || '').toLowerCase().includes('lestrade'));
  const mycroft = others.find(p => (p.name || '').toLowerCase().includes('mycroft'));
  const adler = others.find(p => (p.name || '').toLowerCase().includes('adler'));

  if (moriarty && watson) {
    const arranged = [];
    const used = new Set();
    const add = (p) => { if (p && !used.has(p.id)) { arranged.push(p); used.add(p.id); } };

    // Row 1 (top 2 cups)
    add(moriarty);
    add(watson);

    // Row 2 (middle 3 cups: Irene, Player, Lestrade)
    add(irene);
    add(me);
    add(lestrade);

    // Row 3 (bottom 2 cups: Mycroft, Adler)
    add(mycroft);
    add(adler);

    for (const p of players) {
      add(p);
    }
    return arranged;
  }

  const list = [...players];
  if (me && list.length >= 3) {
    const meIdx = list.findIndex(p => p.id === myPlayerId);
    if (meIdx !== -1) {
      list.splice(meIdx, 1);
      const targetPos = Math.min(3, list.length);
      list.splice(targetPos, 0, me);
    }
  }
  return list;
}

function renderCupsTable232(playersList, isPhase3 = false) {
  const L = getL();
  const arranged = arrangePlayersFor232Table(playersList);
  
  let row1 = [];
  let row2 = [];
  let row3 = [];

  if (arranged.length >= 7) {
    row1 = arranged.slice(0, 2);
    row2 = arranged.slice(2, 5);
    row3 = arranged.slice(5, 7);
  } else if (arranged.length === 6) {
    row1 = arranged.slice(0, 2);
    row2 = arranged.slice(2, 4);
    row3 = arranged.slice(4, 6);
  } else if (arranged.length === 5) {
    row1 = arranged.slice(0, 2);
    row2 = arranged.slice(2, 5);
  } else if (arranged.length === 4) {
    row1 = arranged.slice(0, 2);
    row2 = arranged.slice(2, 4);
  } else {
    row1 = arranged.slice(0, 2);
    row2 = arranged.slice(2);
  }

  const renderCup = (p, idx) => {
    const isMe = (p.id === myPlayerId);
    const sugarsCount = p.roundSugars ? (p.roundSugars.total || 0) : 0;
    const isTargetSelected = (!isPhase3 && selectedVerdict === 'SWAP' && selectedSwapTarget === p.id);
    const palette = getPlayerCupPalette(p, idx);
    const emblem = getPlayerEmblemNumber(p, idx);
    const isBlindModifier = (!isPhase3 && currentRoom.currentModifier === 'BLIND_TASTING' && !isMe);

    const displayName = isMe 
      ? `${p.name || 'Sen'} ★` 
      : `${p.isBot ? 'Bot ' : ''}${p.isBot ? p.name.replace(/^Bot\s*/i, '') : p.name}`;

    let phase3BadgeHtml = '';
    if (isPhase3) {
      const isDead = !p.alive;
      const isPill = !!p.autoPillUsed;
      const drankClean = p.lastDrank && !isDead && !isPill;
      const isDump = (p.verdict === 'DUMP');

      if (p.swappedThisRound) {
        phase3BadgeHtml += `
          <div class="phase3-cup-badge swap">🔄 ${currentLang === 'tr' ? 'Takas Yaptı' : 'Swapped'}</div>
        `;
      }

      if (isDead) {
        phase3BadgeHtml += `
          <div class="phase3-cup-badge dead">☠️ ${currentLang === 'tr' ? 'ELENDİ' : 'DEAD'}</div>
        `;
      } else if (isPill) {
        phase3BadgeHtml += `
          <div class="phase3-cup-badge pill">💊 -${p.pointsLostThisRound ?? 0} ${currentLang === 'tr' ? 'Panzehir' : 'Pill'}</div>
        `;
      } else if (drankClean) {
        phase3BadgeHtml += `
          <div class="phase3-cup-badge clean">☕ +${p.pointsEarnedThisRound || 0} ${currentLang === 'tr' ? 'Puan' : 'Pts'}</div>
        `;
      } else if (isDump) {
        if (p.dumpedWasPoisoned) {
          phase3BadgeHtml += `
            <div class="phase3-cup-badge relief">🫗 ${currentLang === 'tr' ? 'KURTULDU!' : 'SAVED!'}</div>
          `;
        } else {
          phase3BadgeHtml += `
            <div class="phase3-cup-badge regret">🫗 ${currentLang === 'tr' ? 'DÖKTÜ (+0)' : 'DUMP (+0)'}</div>
          `;
        }
      } else {
        phase3BadgeHtml += `
          <div class="phase3-cup-badge clean">☕ +${p.pointsEarnedThisRound || 0}</div>
        `;
      }
    }

    return `
      <div class="cup-slot-item ${isMe ? 'is-me' : ''} ${isTargetSelected ? 'is-selected-target' : ''} ${isPhase3 && !p.alive ? 'cup-is-dead' : ''}" data-swap-target-id="${p.id}">
        <div class="cup-player-nametag ${isMe ? 'is-you' : ''}">
          ${displayName}
        </div>
        <div class="pixel-teacup">
          ${renderColoredTeacup(palette, emblem)}
        </div>
        ${isPhase3 ? phase3BadgeHtml : `
          <div class="neon-sugar-badge ${isMe ? 'my-sugar-badge' : ''}">
            <span class="neon-sugar-num">${isBlindModifier ? '?' : sugarsCount}</span>
          </div>
        `}
      </div>
    `;
  };

  return `
    <div class="cups-table-232">
      ${row1.length > 0 ? `<div class="cups-row cups-row-2">${row1.map((p, i) => renderCup(p, i)).join('')}</div>` : ''}
      ${row2.length > 0 ? `<div class="cups-row cups-row-3">${row2.map((p, i) => renderCup(p, i + row1.length)).join('')}</div>` : ''}
      ${row3.length > 0 ? `<div class="cups-row cups-row-2">${row3.map((p, i) => renderCup(p, i + row1.length + row2.length)).join('')}</div>` : ''}
    </div>
  `;
}

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
    renderAuditorWidget();
    return;
  }

  const me = currentRoom.players[myPlayerId];
  if (!me) {
    renderHome();
    renderAuditorWidget();
    return;
  }

  if (currentRoom.status === 'LOBBY') {
    lastSeenRound = 0;
    hasDismissedPoisonCinematic = false;
    hasDismissedModifierModal = false;
    renderLobby();
    renderAuditorWidget();
    return;
  }

  if (currentRoom.status === 'GAME_OVER') {
    if (currentRoom.lastPoisonEvent && !hasDismissedPoisonCinematic) {
      renderPoisonRevealScreen();
      renderAuditorWidget();
      return;
    }
    renderGameOver();
    renderAuditorWidget();
    return;
  }

  // Dead players see the spectator screen during active phases (PHASE_1, PHASE_2)
  if (!me.alive && currentRoom.status !== 'PHASE_3') {
    renderSpectatorScreen();
    renderAuditorWidget();
    return;
  }

  switch (currentRoom.status) {
    case 'PHASE_1':
      if (currentRoom.round !== lastSeenRound) {
        lastSeenRound = currentRoom.round;
        selectedDropType = 'SWEET';
        selectedDropTarget = null;
        selectedVerdict = null;
        selectedSwapTarget = null;
        hasDismissedPoisonCinematic = false;
        hasDismissedModifierModal = false;
      }
      hasPlayedPhase3Sound = false;
      if (currentRoom.currentModifier && !hasDismissedModifierModal) {
        renderRoundModifierScreen();
      } else {
        renderPhase1();
      }
      break;
    case 'PHASE_2':
      if (currentRoom.currentModifier && !hasDismissedModifierModal) {
        renderRoundModifierScreen();
      } else {
        renderPhase2();
      }
      break;
    case 'PHASE_3':
      renderPhase3();
      break;
    default:
      renderHome();
  }
  renderAuditorWidget();
}

// -------------------------------------------------------------------
// 1. HOME SCREEN (16-BIT VICTORIAN PARLOR RETRO PIXEL ART)
// -------------------------------------------------------------------
function renderHome() {
  const L = getL();
  appEl.innerHTML = `
    <div class="home-container">
      <div class="home-top-bar">
        <div class="home-top-decor">
          <span class="pixel-star">✦</span>
          <span>VICTORIAN PARLOR</span>
          <span class="pixel-star">✦</span>
        </div>
        ${renderLangToggle()}
      </div>

      <div class="home-hero">
        <div class="home-hero-frame">
          <div class="home-corner tl">${ICONS.filigreeCorner}</div>
          <div class="home-corner tr">${ICONS.filigreeCorner}</div>
          <div class="home-corner bl">${ICONS.filigreeCorner}</div>
          <div class="home-corner br">${ICONS.filigreeCorner}</div>

          <div class="home-hero-teacup">
            ${renderColoredTeacup('gold')}
          </div>
          <h1 class="home-title">${L.title}</h1>
          <div class="home-title-divider">
            <span class="divider-gem">◆</span>
            <span class="divider-line"></span>
            <span class="divider-gem">◆</span>
          </div>
          <p class="home-subtitle">${L.subtitle}</p>
        </div>
      </div>

      <!-- Quick Rules Banner -->
      <div class="home-pixel-card rules-card" style="border-color:#5a3861; padding:10px 12px; background:#1b0c1e; margin-bottom:4px;">
        <div style="display:flex; align-items:center; gap:6px; font-family:var(--font-pixel-heading); font-size:0.7rem; color:#ffd866;">
          <span>📜</span>
          <span>${currentLang === 'tr' ? 'VİKTORYA SALONU PROTOKOLÜ' : 'VICTORIAN PARLOR PROTOCOL'}</span>
        </div>
        <p style="font-family:var(--font-pixel-ui); font-size:0.74rem; color:#baa4bd; line-height:1.35; margin-top:4px;">
          ${currentLang === 'tr'
            ? 'Gizlice fincanlara şeker veya siyanür at. Çayını İÇ, DÖK ya da TAKAS ET! Temiz çay içen puan toplar, zehri içen panzehir yoksa elenir.'
            : 'Secretly drop sweet sugar or cyanide into teacups. DRINK, DUMP, or SWAP! Clean tea earns sugar points; poison eliminates without an antidote.'}
        </p>
      </div>

      <!-- Card 1: Create Table -->
      <div class="home-pixel-card host-card">
        <div class="home-card-banner">
          <span class="card-badge-icon">☕</span>
          <span class="card-badge-title">${L.createCardTitle}</span>
        </div>
        <p class="home-card-desc">
          ${L.createCardSub}
        </p>
        <div class="home-field-group">
          <label class="home-input-label">
            <span>👤</span> ${L.yourName}
          </label>
          <input type="text" id="hostName" class="home-input" placeholder="${L.namePlaceholderHost}" maxlength="18" autocomplete="off">
        </div>
        <button class="home-btn-primary" id="btnCreate">
          ${L.createRoomBtn}
        </button>
      </div>

      <!-- Card 2: Join Table -->
      <div class="home-pixel-card join-card">
        <div class="home-card-banner">
          <span class="card-badge-icon">🚪</span>
          <span class="card-badge-title">${L.joinCardTitle}</span>
        </div>
        <p class="home-card-desc">
          ${L.joinCardSub}
        </p>
        <div class="home-field-group">
          <label class="home-input-label">
            <span>🗝️</span> ${L.roomCodeLabel}
          </label>
          <input type="text" id="joinCode" class="home-input code-input" placeholder="ABCD" maxlength="4" autocomplete="off">
        </div>
        <div class="home-field-group">
          <label class="home-input-label">
            <span>👤</span> ${L.yourName}
          </label>
          <input type="text" id="joinName" class="home-input" placeholder="${L.namePlaceholderJoin}" maxlength="18" autocomplete="off">
        </div>
        <button class="home-btn-neutral" id="btnJoin">
          ${L.joinRoomBtn}
        </button>
      </div>

      <!-- Footer Links: Admin & Auditor -->
      <div class="home-footer-nav">
        <a href="#admin" id="btnAdminLink" class="home-admin-badge">
          <span>🛠️</span> ${L.adminPanel}
        </a>
        <button id="btnHomeAuditorLink" class="home-auditor-link">
          <span>🕵️</span> ${currentLang === 'tr' ? 'Denetçi Agent' : 'Auditor Agent'}
        </button>
      </div>
    </div>
  `;

  attachLangEvents();

  // Enter key support for inputs
  const hostInput = document.getElementById('hostName');
  if (hostInput) {
    hostInput.onkeydown = (e) => {
      if (e.key === 'Enter') document.getElementById('btnCreate').click();
    };
  }

  const joinCodeInput = document.getElementById('joinCode');
  const joinNameInput = document.getElementById('joinName');
  if (joinCodeInput) {
    joinCodeInput.onkeydown = (e) => {
      if (e.key === 'Enter' && joinNameInput) joinNameInput.focus();
    };
  }
  if (joinNameInput) {
    joinNameInput.onkeydown = (e) => {
      if (e.key === 'Enter') document.getElementById('btnJoin').click();
    };
  }

  const auditorLink = document.getElementById('btnHomeAuditorLink');
  if (auditorLink) {
    auditorLink.onclick = () => {
      isAuditorOpen = true;
      renderAuditorWidget();
    };
  }

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
// 2. LOBBY SCREEN (VICTORIAN PARLOR REGISTRY & SEAT ROSTER)
// -------------------------------------------------------------------
function renderLobby() {
  const L = getL();
  const me = currentRoom.players[myPlayerId];
  const players = Object.values(currentRoom.players || {});
  const canStart = players.length >= 2;

  const playerRows = players.map((p, idx) => {
    const palette = getPlayerCupPalette(p, idx);
    const emblem = getPlayerEmblemNumber(p, idx);
    const isMe = (p.id === myPlayerId);

    return `
      <div class="lobby-seat-row ${isMe ? 'is-me' : ''}">
        <div class="seat-cup-preview">
          ${renderColoredTeacup(palette, emblem)}
        </div>
        <div class="seat-info">
          <div class="seat-player-name" title="${p.name}">
            ${p.name}
            ${isMe ? `<span class="seat-you-tag">${L.you}</span>` : ''}
          </div>
          <div class="seat-badges">
            ${p.isHost ? `<span class="badge-seat-host">👑 ${L.host}</span>` : (p.isBot ? `<span class="badge-seat-bot">🤖 BOT</span>` : `<span class="badge-seat-player">👤 KONUK</span>`)}
          </div>
        </div>
        <div class="seat-status-right">
          <span class="badge-seat-ready">✓ ${L.ready}</span>
          ${me.isHost && !isMe ? `
            <button class="btn-seat-kick btn-kick" data-kick="${p.id}" title="${L.kickBtn}">
              ✕ ${L.kickBtn}
            </button>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');

  appEl.innerHTML = `
    <div class="app-header">
      <div class="brand-title">
        <span class="brand-crest">☕</span>
        <span>${L.title}</span>
      </div>
      ${renderLangToggle()}
    </div>

    <!-- Victorian Room Code Plaque -->
    <div class="lobby-code-plaque">
      <div class="plaque-corner tl">${ICONS.filigreeCorner}</div>
      <div class="plaque-corner tr">${ICONS.filigreeCorner}</div>
      <div class="plaque-corner bl">${ICONS.filigreeCorner}</div>
      <div class="plaque-corner br">${ICONS.filigreeCorner}</div>

      <span class="plaque-sub">${currentLang === 'tr' ? 'SALON ODA PROTOKOLÜ' : 'PARLOR ROOM PROTOCOL'}</span>
      <div class="plaque-code-display">
        ${currentRoom.code}
      </div>
      <button class="btn-copy-code" id="btnCopyRoomCode" title="${currentLang === 'tr' ? 'Oda Kodunu Kopyala' : 'Copy Room Code'}">
        📋 ${currentLang === 'tr' ? 'ODA KODUNU KOPYALA' : 'COPY CODE'}
      </button>
      <div class="plaque-count-badge">
        <span class="count-dot">●</span>
        <span>${L.playersAtTable(players.length)} (Maks: 8)</span>
      </div>
    </div>

    <!-- Victorian Seat Registry -->
    <div class="lobby-roster-card">
      <div class="lobby-roster-header">
        <span class="roster-header-title">📜 ${L.playersList}</span>
        <span class="roster-header-count">${players.length}/8</span>
      </div>

      <div class="lobby-seat-list">
        ${playerRows}
      </div>

      ${me.isHost ? `
        <div class="lobby-bot-actions-row">
          <button class="btn-lobby-bot-add" id="btnAddBot">
            <span>🤖</span>
            <span>${L.addBot}</span>
          </button>
          <button class="btn-lobby-fill7" id="btnAddQuick7">
            <span>⚔️</span>
            <span>${currentLang === 'tr' ? '7 KİŞİLİK MASA DOLDUR (6 BOT)' : 'FILL 7-SEAT TABLE (6 BOTS)'}</span>
          </button>
        </div>
      ` : ''}
    </div>

    <!-- Lobby Footer & Host Controls -->
    <div class="lobby-footer-actions">
      ${me.isHost ? `
        <button class="btn-start-game-prominent ${!canStart ? 'btn-disabled' : ''}" id="btnStartGame" ${!canStart ? 'disabled' : ''}>
          <span>⚔️</span>
          <span>${L.startGame(players.length)}</span>
        </button>
      ` : `
        <div class="lobby-guest-waiting">
          <div class="waiting-steam-teacup">${renderColoredTeacup(getPlayerCupPalette(me, 0), '☕')}</div>
          <div class="waiting-text">${L.waitingHost}</div>
        </div>
      `}
      <button class="btn-lobby-leave" id="btnLeave">
        🚪 ${L.leave}
      </button>
    </div>
  `;

  attachLangEvents();

  const btnCopy = document.getElementById('btnCopyRoomCode');
  if (btnCopy) {
    btnCopy.onclick = async () => {
      try {
        await navigator.clipboard.writeText(currentRoom.code);
        const prevText = btnCopy.innerHTML;
        btnCopy.innerHTML = `✓ ${currentLang === 'tr' ? 'KOPYALANDI!' : 'COPIED!'}`;
        btnCopy.style.borderColor = '#2ecc71';
        btnCopy.style.color = '#2ecc71';
        setTimeout(() => {
          if (btnCopy) {
            btnCopy.innerHTML = prevText;
            btnCopy.style.borderColor = '';
            btnCopy.style.color = '';
          }
        }, 2000);
      } catch (e) {
        prompt(currentLang === 'tr' ? 'Oda Kodu:' : 'Room Code:', currentRoom.code);
      }
    };
  }

  if (me.isHost) {
    const btnAddBot = document.getElementById('btnAddBot');
    if (btnAddBot) {
      btnAddBot.onclick = async () => {
        try {
          const res = await addBot(currentRoom.code);
          auditorAgent.logEvent({
            round: 0,
            phase: 'LOBBY',
            actor: res.botName,
            event: 'Bot Masaya Katıldı',
            uxMetric: 'PASS',
            critiqueNote: `${res.botName} başarıyla salona dahil oldu.`
          });
        } catch (err) {
          alert(err.message);
        }
      };
    }

    const btnAddQuick7 = document.getElementById('btnAddQuick7');
    if (btnAddQuick7) {
      btnAddQuick7.onclick = async () => {
        try {
          const room = await DB.get(`rooms/${currentRoom.code}`);
          const currentCount = Object.keys(room.players || {}).length;
          for (let i = currentCount; i < 7; i++) {
            await addBot(currentRoom.code);
            await new Promise(r => setTimeout(r, 200));
          }
          auditorAgent.logEvent({
            round: 0,
            phase: 'LOBBY',
            actor: 'Host',
            event: '7 Kişilik Masa Dolduruldu',
            uxMetric: 'PASS',
            critiqueNote: 'Masa 7 oyuncuyla tamamlandı. 2-3-2 düzeni için hazır.'
          });
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

// -------------------------------------------------------------------
// HELPER: RENDER PIXEL TOP INVENTORY & STATUS BAR (Matching Ref)
// -------------------------------------------------------------------
function renderInventoryBar(me, L, isCompact = false) {
  const swapsLeft = me.swapsLeft ?? 1;
  const score = me.points || 0;
  const pillCount = me.pill || 0;
  const cyanideCount = me.cyanide || 0;

  // Render 5 score stars
  let starsHtml = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= score) {
      starsHtml += `<span class="star-filled">★</span>`;
    } else {
      starsHtml += `<span class="star-empty">★</span>`;
    }
  }

  return `
    <div class="inventory-pixel-bar ${isCompact ? 'is-compact' : ''}">
      <div class="inv-item-group">
        <!-- Pill Slot -->
        <div class="inv-slot">
          <div class="inv-icon-wrapper">
            ${ICONS.pillPixel}
            <span class="inv-count-badge">${pillCount}</span>
          </div>
          <span class="inv-slot-label">${currentLang === 'tr' ? 'Panzehir' : 'Pill'}</span>
        </div>

        <!-- Cyanide Slot -->
        <div class="inv-slot">
          <div class="inv-icon-wrapper">
            ${ICONS.poisonPixel}
            <span class="inv-count-badge">${cyanideCount}</span>
          </div>
          <span class="inv-slot-label">${currentLang === 'tr' ? 'Siyanür' : 'Cyanide'}</span>
        </div>

        <!-- Swap Slot -->
        <div class="inv-slot">
          <div class="inv-icon-wrapper">
            ${ICONS.swapPixel}
            <span class="inv-count-badge">${swapsLeft}</span>
          </div>
          <span class="inv-slot-label">${currentLang === 'tr' ? 'Takas' : 'Swap'}</span>
        </div>
      </div>

      <!-- Score Stars Section -->
      <div class="score-stars-group">
        <div class="stars-row">
          ${starsHtml}
        </div>
        <div class="score-text-label">
          Score: ${score}/8
        </div>
      </div>
    </div>
  `;
}

// -------------------------------------------------------------------
// HELPER: PERSONAL MOVE LOG
// -------------------------------------------------------------------
function renderPersonalLog(me, currentRoom, L) {
  const detailedLogs = currentRoom.detailedLogs || [];
  
  // Only show moves where this player was the actor
  const myEvents = detailedLogs.filter(ev => ev.actorId === me.id || ev.actor === me.name);

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

  const itemsHtml = [...myEvents].reverse().map(ev => {
    let text = '';
    const r = ev.round ? `[${L.round} ${ev.round}] ` : '';
    switch (ev.type) {
      case 'DROP_SWEET':
        if (ev.giftCyanideReloaded) {
          text = L.myLogGiftCyanide(r, ev.target);
        } else {
          text = L.myLogDropSweet(r, ev.target);
        }
        break;
      case 'DROP_CYANIDE':
        text = L.myLogDropCyanide(r, ev.target);
        break;
      case 'DRINK_CLEAN':
        text = L.myLogDrinkClean(r, ev.pointsEarned || 0);
        break;
      case 'DRINK_POISONED':
        text = L.myLogDrinkPoison(r);
        break;
      case 'DUMP':
        if (ev.wasPoisoned) {
          text = L.myLogDumpRelief(r);
        } else {
          text = L.myLogDumpRegret(r, ev.sweetCount || 0);
        }
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
// 3. PHASE 1: ŞEKER AT (DROP SUGAR WITH PLAYER CARDS)
// -------------------------------------------------------------------
function renderPhase1() {
  const L = getL();
  const me = currentRoom.players[myPlayerId];
  const alivePlayers = Object.values(currentRoom.players).filter(p => p.alive);
  const otherAlive = alivePlayers.filter(p => p.id !== myPlayerId);
  const readyCount = alivePlayers.filter(p => p.ready).length;
  const hasCyanide = (me.cyanide || 0) > 0;

  // Ensure selectedDropTarget is a valid opponent
  if (!selectedDropTarget || selectedDropTarget === myPlayerId || !otherAlive.some(p => p.id === selectedDropTarget)) {
    selectedDropTarget = otherAlive.length > 0 ? otherAlive[0].id : null;
  }

  const targetPlayer = otherAlive.find(p => p.id === selectedDropTarget);
  const targetPlayerName = targetPlayer ? targetPlayer.name : '';

  // Build Opponent Target Selection Cards (3-Column Grid)
  const targetCardsHtml = otherAlive.map((p, idx) => {
    const isSelected = (selectedDropTarget === p.id);
    const palette = getPlayerCupPalette(p, idx);
    return `
      <div class="player-target-card-3col ${isSelected ? 'selected' : ''}" data-target-id="${p.id}">
        ${isSelected ? '<span class="target-check-badge">✓</span>' : ''}
        <div class="target-cup-container">
          ${renderColoredTeacup(palette, (idx + 1).toString())}
        </div>
        <div class="target-card-player-name" title="${p.name}">
          ${p.isBot ? '🤖 ' : ''}${p.name}
        </div>
        <div class="target-card-score-box">
          <span class="score-val">${p.points || 0}</span><span class="score-max">/8</span> <span class="score-icon">🍬</span>
        </div>
      </div>
    `;
  }).join('');

  appEl.innerHTML = `
    <div class="app-header">
      <div class="brand-title">${L.round} ${currentRoom.round}</div>
      <div style="display:flex; align-items:center; gap:8px;">
        <div class="room-badge">${L.readyCounter(readyCount, alivePlayers.length)}</div>
        ${renderLangToggle()}
      </div>
    </div>

    ${renderInventoryBar(me, L)}

    ${renderParlorEmotesBar()}

    <div class="card" style="margin-top:6px; padding:12px 10px;">
      <!-- Sugar / Poison Selector -->
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:12px;">
        <button class="btn ${selectedDropType === 'SWEET' ? 'btn-primary' : 'btn-neutral'}" id="btnDropSweet" style="padding:10px 6px; font-size:0.85rem; font-weight:800;">
          ${L.dropSweetBtn}
        </button>
        <button class="btn ${selectedDropType === 'CYANIDE' ? 'btn-danger' : 'btn-neutral'} ${!hasCyanide ? 'btn-disabled' : ''}" id="btnDropCyanide" ${!hasCyanide ? 'disabled' : ''} style="padding:10px 6px; font-size:0.85rem; font-weight:800;">
          ${L.dropCyanideBtn(me.cyanide || 0)}
        </button>
      </div>

      <!-- Target Opponent Selection (3-col Grid) -->
      <div>
        <label class="input-label" style="text-align:center; display:block; margin-bottom:6px; font-size:0.8rem;">
          ${L.targetLabel}
        </label>
        <div class="player-target-grid-3col">
          ${targetCardsHtml}
        </div>
      </div>
    </div>

    <div style="margin-top:auto; padding-top:10px; display:flex; flex-direction:column; gap:8px;">
      ${!me.ready ? `
        <button class="btn btn-primary btn-confirm-action" id="btnSubmitPhase1" style="padding:14px 10px; font-size:0.82rem; font-weight:900;">
          ${targetPlayerName ? (
            selectedDropType === 'SWEET' ? (currentLang === 'tr' ? `🍬 KARARIMI ONAYLA: ${targetPlayerName}'A ŞEKER AT` : `🍬 CONFIRM: SWEETEN ${targetPlayerName}'S TEA`) :
            (currentLang === 'tr' ? `☠️ KARARIMI ONAYLA: ${targetPlayerName}'A ZEHİR AT` : `☠️ CONFIRM: POISON ${targetPlayerName}'S TEA`)
          ) : (currentLang === 'tr' ? '⚔️ KARARIMI ONAYLA / HAZIRIM' : '⚔️ CONFIRM DECISION / READY')}
        </button>
      ` : `
        <div class="phase-decision-locked-banner">
          <span class="locked-icon">✓</span>
          <div class="locked-details">
            <div class="locked-title">${currentLang === 'tr' ? `KARARIN KİLİTLENDİ: ${targetPlayerName}'A ${selectedDropType === 'CYANIDE' ? 'ZEHİR' : 'ŞEKER'} ATTIN` : `DECISION LOCKED: ${selectedDropType} ➔ ${targetPlayerName}`}</div>
            <div class="locked-sub">${L.waitingOthers(readyCount, alivePlayers.length)}</div>
          </div>
        </div>
      `}

      <!-- Dedicated Host Phase 1 Advance Control -->
      ${me.isHost ? `
        <div class="host-phase-advance-panel">
          <div class="host-panel-header">👑 ${currentLang === 'tr' ? 'SALON KURUCUSU KONTROLÜ' : 'HOST PARLOR CONTROLS'}</div>
          <button class="btn-host-advance" id="btnHostAdvancePhase1">
            ${currentLang === 'tr' ? '➡️ 2. ADIMA GEÇ (Tüm Masayı İlerlet)' : '➡️ PROCEED TO STEP 2 (Advance Table)'}
          </button>
          <div class="host-panel-hint">
            ${readyCount === alivePlayers.length 
              ? (currentLang === 'tr' ? '✓ Masadaki herkes hazır! 2. adıma geçebilirsiniz.' : '✓ All players ready! You may advance.')
              : (currentLang === 'tr' ? '⏳ Bazı oyuncular düşünüyor. Kurucu olarak masayı erken ilerletebilirsiniz.' : '⏳ Some players still deciding. You may advance early.')}
          </div>
        </div>
      ` : ''}
    </div>
  `;

  attachLangEvents();
  attachParlorEmoteEvents();

  document.getElementById('btnDropSweet').onclick = () => {
    selectedDropType = 'SWEET';
    if (!selectedDropTarget || selectedDropTarget === myPlayerId) {
      selectedDropTarget = otherAlive.length > 0 ? otherAlive[0].id : null;
    }
    renderPhase1();
  };

  const btnDropCyanide = document.getElementById('btnDropCyanide');
  if (btnDropCyanide && hasCyanide) {
    btnDropCyanide.onclick = () => {
      selectedDropType = 'CYANIDE';
      if (!selectedDropTarget || selectedDropTarget === myPlayerId) {
        selectedDropTarget = otherAlive.length > 0 ? otherAlive[0].id : null;
      }
      renderPhase1();
    };
  }

  // Attach card selection clicks (3-col cards)
  document.querySelectorAll('.player-target-card-3col').forEach(card => {
    card.onclick = () => {
      selectedDropTarget = card.getAttribute('data-target-id');
      renderPhase1();
    };
  });

  const btnSubmit = document.getElementById('btnSubmitPhase1');
  if (btnSubmit) {
    btnSubmit.onclick = async () => {
      const target = selectedDropTarget;
      if (!target) {
        return alert(currentLang === 'tr' ? "Lütfen şekeri atmak istediğin fincanı seç!" : "Please choose whose cup to drop the sugar into!");
      }

      if (target === myPlayerId) {
        return alert(currentLang === 'tr' ? "Kendi fincanına şeker atamazsın! Bir rakip seçmelisin." : "You cannot drop sugar into your own cup! Choose an opponent.");
      }

      try {
        if (selectedDropType === 'CYANIDE') {
          playPoisonSound();
        } else {
          playSlideSound();
        }
        await submitDropAction(currentRoom.code, myPlayerId, {
          type: selectedDropType,
          target: target
        });
        auditorAgent.recordDecisionConfirmed(myPlayerId, me.name, `${selectedDropType} ➔ ${targetPlayerName}`, me.isHost);
      } catch (e) {
        alert(e.message);
      }
    };
  }

  if (me.isHost) {
    const btnHostAdv = document.getElementById('btnHostAdvancePhase1');
    if (btnHostAdv) {
      btnHostAdv.onclick = async () => {
        try {
          if (!me.ready && selectedDropTarget) {
            await submitDropAction(currentRoom.code, myPlayerId, {
              type: selectedDropType,
              target: selectedDropTarget
            });
            auditorAgent.recordDecisionConfirmed(myPlayerId, me.name, `${selectedDropType} ➔ ${targetPlayerName}`, true);
          }
          auditorAgent.recordHostAdvance(me.name, '2. Adıma Geç (Faz 1 Tamamlandı)', readyCount < alivePlayers.length);
          await advanceToPhase2(currentRoom.code);
        } catch (err) {
          alert(err.message);
        }
      };
    }
  }
}

// -------------------------------------------------------------------
// 4. ROUND MODIFIER: TAROT CARD VIEW (BLIND TASTING - PANEL 2)
// -------------------------------------------------------------------
function renderRoundModifierScreen() {
  const L = getL();
  const me = currentRoom.players[myPlayerId];

  appEl.innerHTML = `
    <div class="app-header">
      <div style="display:flex; align-items:center; gap:8px;">
        <span style="font-family:var(--font-pixel-heading); font-size:0.75rem; color:#ffd700; font-weight:800;">RAUND MODIFIER</span>
        <span style="font-family:var(--font-pixel-heading); font-size:0.75rem; color:#f7ca3e; font-weight:800;">BLIND TASTING</span>
      </div>
      ${renderLangToggle()}
    </div>

    ${renderInventoryBar(me, L)}

    <div class="filigree-frame" style="padding: 14px 12px 10px; margin-bottom:10px;">
      <div class="filigree-corner top-left">${ICONS.filigreeCorner}</div>
      <div class="filigree-corner top-right">${ICONS.filigreeCorner}</div>
      <div class="filigree-corner bottom-left">${ICONS.filigreeCorner}</div>
      <div class="filigree-corner bottom-right">${ICONS.filigreeCorner}</div>
      <div class="filigree-inner-border"></div>

      <div class="tarot-view-container">
        <div style="margin-bottom:8px; width:100%; display:flex; justify-content:center;">
          ${ICONS.blindTastingCardArt}
        </div>

        <div class="tarot-rule-text" style="font-size:0.75rem; margin-bottom:10px;">
          ${currentLang === 'tr'
            ? 'Raundun gizli kaderini belirlemek için bir fincan seç.'
            : 'Choose a cup to define the hidden fate of the round.'}
        </div>

        <button class="btn-accept-challenge" id="btnAcceptModifier" style="padding:11px; margin-bottom:7px; font-size:0.75rem;">
          ⚡ ${currentLang === 'tr' ? 'MEYDAN OKUMAYI KABUL ET' : 'ACCEPT CHALLENGE'}
        </button>

        <button class="btn-decline-challenge" id="btnDeclineModifier" style="padding:9px; font-size:0.72rem;">
          ✓ ${currentLang === 'tr' ? 'REDDET' : 'DECLINE'}
        </button>

        <div class="tarot-footer-quote" style="margin-top:8px; font-size:0.65rem;">
          ${currentLang === 'tr' ? 'Gizli dozlar. İkinci bir şans yok.' : 'Hidden doses. No second chances.'}
        </div>
      </div>
    </div>
  `;

  attachLangEvents();

  const handleAccept = async () => {
    hasDismissedModifierModal = true;
    if (me.isHost) {
      await DB.update(`rooms/${currentRoom.code}`, { currentModifier: 'BLIND_TASTING' });
    }
    renderCurrentScreen();
  };

  const handleDecline = async () => {
    hasDismissedModifierModal = true;
    if (me.isHost) {
      await DB.update(`rooms/${currentRoom.code}`, { currentModifier: null });
    }
    renderCurrentScreen();
  };

  const btnAccept = document.getElementById('btnAcceptModifier');
  if (btnAccept) btnAccept.onclick = handleAccept;

  const btnDecline = document.getElementById('btnDeclineModifier');
  if (btnDecline) btnDecline.onclick = handleDecline;
}

// -------------------------------------------------------------------
// 5. PHASE 2: ÇAYLAR MASADA & KARAR (DECISION PHASE - PANEL 1)
// -------------------------------------------------------------------
function renderPhase2() {
  const L = getL();
  const me = currentRoom.players[myPlayerId];
  const alivePlayers = Object.values(currentRoom.players).filter(p => p.alive);
  const readyCount = alivePlayers.filter(p => p.ready).length;
  const hasSwap = (me.swapsLeft ?? 1) > 0;
  const swapOpponents = alivePlayers.filter(p => p.id !== myPlayerId);

  // Default to DRINK to match reference Panel 1
  if (!selectedVerdict) {
    selectedVerdict = 'DRINK';
  }

  if (!selectedSwapTarget && swapOpponents.length > 0) {
    selectedSwapTarget = swapOpponents[0].id;
  }

  const meSugars = me.roundSugars ? (me.roundSugars.total || 0) : 0;
  const targetOpponent = swapOpponents.find(o => o.id === selectedSwapTarget);
  const selectedSwapTargetName = targetOpponent ? targetOpponent.name : '';
  const allReady = (readyCount === alivePlayers.length);

  appEl.innerHTML = `
    <div class="app-header">
      <div class="brand-title">${L.round} ${currentRoom.round}</div>
      <div style="display:flex; align-items:center; gap:8px;">
        <div class="room-badge">${readyCount}/${alivePlayers.length} ${currentLang === 'tr' ? 'Hazır' : 'Ready'}</div>
        ${renderLangToggle()}
      </div>
    </div>

    ${renderInventoryBar(me, L)}

    ${renderParlorEmotesBar()}

    <!-- Flanked Candlesticks Header (Matching Panel 1) -->
    <div class="candles-header">
      <div class="candle-cluster">
        <div class="candle-item short">${ICONS.pixelCandleShort}</div>
        <div class="candle-item tall">${ICONS.pixelCandleTall}</div>
      </div>
      <div class="phase-main-title">DECISION PHASE .</div>
      <div class="candle-cluster">
        <div class="candle-item tall">${ICONS.pixelCandleTall}</div>
      </div>
    </div>

    <!-- Symmetrical 2-3-2 Teacups Table (Matching Panel 1) -->
    ${renderCupsTable232(alivePlayers, false)}

    <!-- 3-Card Action Deck & Unambiguous Decision Button (Matching Panel 1) -->
    <div class="action-deck-section">
      <div class="action-deck-title">SELECT AN ACTION</div>

      <div class="pixel-actions-row">
        <!-- DRINK Card -->
        <div class="pixel-action-card ${selectedVerdict === 'DRINK' ? 'active-gold' : ''}" id="btnVerdictDrink">
          <div class="pixel-action-icon">${ICONS.actionDrink}</div>
          <div class="pixel-action-title">DRINK</div>
        </div>

        <!-- DUMP Card -->
        <div class="pixel-action-card ${selectedVerdict === 'DUMP' ? 'active-gold' : ''}" id="btnVerdictDump">
          <div class="pixel-action-icon">${ICONS.actionDump}</div>
          <div class="pixel-action-title">DUMP</div>
        </div>

        <!-- SWAP CUP Card -->
        <div class="pixel-action-card ${selectedVerdict === 'SWAP' ? 'active-gold' : ''} ${!hasSwap ? 'disabled' : ''}" id="btnVerdictSwap">
          <div class="pixel-action-icon">${ICONS.actionSwap}</div>
          <div class="pixel-action-title">SWAP<br>CUP</div>
        </div>
      </div>

      ${selectedVerdict === 'SWAP' && swapOpponents.length > 0 ? `
        <div class="swap-target-row-compact">
          <div class="swap-target-title">${L.swapTargetTitle}</div>
          <div class="swap-target-row">
            ${swapOpponents.map(opp => {
              const isChosen = (selectedSwapTarget === opp.id);
              return `
                <button class="btn-swap-pill ${isChosen ? 'selected' : ''}" data-swap-target-id="${opp.id}">
                  ${opp.name}
                </button>
              `;
            }).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Selected Action Summary Box -->
      <div class="verdict-summary-card">
        ${selectedVerdict === 'DRINK' ? `
          <div class="summary-badge gold">☕ DRINK SEÇİLDİ</div>
          <div class="summary-text">${currentLang === 'tr' ? `Fincanındaki ${meSugars} şekeri içeceksin. Çay temizse +${meSugars} Puan! Siyanür varsa panzehir yoksa elenirsin!` : `Drink tea in your cup. If clean: +${meSugars} Sugar Points! If cyanide and no antidote: eliminated.`}</div>
        ` : selectedVerdict === 'DUMP' ? `
          <div class="summary-badge slate">🫗 DUMP SEÇİLDİ</div>
          <div class="summary-text">${currentLang === 'tr' ? 'Fincanındaki çayı yere dökeceksin. 0 puan alırsın ama zehirden kesin olarak kurtulursun.' : 'Dump tea onto the floor. 0 points, but guaranteed survival from cyanide.'}</div>
        ` : `
          <div class="summary-badge amber">🔄 SWAP CUP SEÇİLDİ</div>
          <div class="summary-text">${currentLang === 'tr' ? `Fincanını gizlice ${selectedSwapTargetName || 'seçilen rakip'} ile takas edeceksin! Kendi fincanın ona gidecek, onun çayını içeceksin.` : `Secretly swap cups with ${selectedSwapTargetName || 'target'}! Your cup goes to them, you drink their tea.`}</div>
        `}
      </div>

      <!-- 1. UNAMBIGUOUS PERSONAL DECISION CONFIRMATION BUTTON -->
      ${!me.ready ? `
        <button class="btn-verdict-decision-prominent" id="btnConfirmVerdict">
          <span class="btn-decision-label">${currentLang === 'tr' ? (selectedVerdict === 'DRINK' ? '☕ KARAR VER: ÇAYIMI İÇİYORUM' : (selectedVerdict === 'DUMP' ? '🫗 KARAR VER: ÇAYI DÖKÜYORUM' : `🔄 KARAR VER: ${selectedSwapTargetName} İLE TAKAS ET`)) : (selectedVerdict === 'DRINK' ? '☕ CONFIRM: DRINK MY TEA' : (selectedVerdict === 'DUMP' ? '🫗 CONFIRM: DUMP THE TEA' : `🔄 CONFIRM: SWAP WITH ${selectedSwapTargetName}`))}</span>
        </button>
      ` : `
        <div class="verdict-locked-banner">
          <span class="locked-check">✓</span>
          <div class="locked-info">
            <div class="locked-title">${currentLang === 'tr' ? `SENİN KARARIN KİLİTLENDİ: [${selectedVerdict === 'DRINK' ? 'ÇAYIMI İÇİYORUM' : (selectedVerdict === 'DUMP' ? 'ÇAYI DÖKÜYORUM' : 'FİNCANI TAKAS EDİYORUM')}]` : `YOUR DECISION IS LOCKED: [${selectedVerdict}]`}</div>
            <div class="locked-subtitle">${currentLang === 'tr' ? `Masadakiler bekleniyor... (${readyCount}/${alivePlayers.length} Hazır)` : `Waiting for others... (${readyCount}/${alivePlayers.length} Ready)`}</div>
          </div>
        </div>
      `}

      <!-- 2. DISTINCT HOST REVEAL & PHASE ADVANCE CONTROL -->
      ${me.isHost ? `
        <div class="host-control-card">
          <div class="host-control-header">👑 ${currentLang === 'tr' ? 'SALON KURUCUSU KONTROLÜ' : 'HOST PARLOR CONTROLS'}</div>
          <button class="btn-host-reveal-phase3 ${allReady ? 'glow-gold' : ''}" id="btnHostRevealPhase3">
            <span class="btn-reveal-icon">➜</span>
            <span class="btn-reveal-text">${currentLang === 'tr' ? 'MASAYI AÇIKLA (SONUÇLARA GEÇ)' : 'REVEAL TABLE (PROCEED TO RESULTS)'}</span>
          </button>
          <div class="host-control-hint">
            ${allReady 
              ? (currentLang === 'tr' ? '✓ Masadaki herkes kararını verdi! Masayı açabilirsiniz.' : '✓ Everyone is ready! Reveal the results.')
              : (currentLang === 'tr' ? '⚠️ Bazı oyuncular henüz karar vermedi. Kurucu olarak masayı erken açabilirsiniz.' : '⚠️ Some players have not decided. You may force reveal early.')}
          </div>
        </div>
      ` : ''}
    </div>
  `;

  attachLangEvents();
  attachParlorEmoteEvents();

  document.getElementById('btnVerdictDrink').onclick = () => {
    selectedVerdict = 'DRINK';
    renderPhase2();
  };

  document.getElementById('btnVerdictDump').onclick = () => {
    selectedVerdict = 'DUMP';
    renderPhase2();
  };

  const btnSwap = document.getElementById('btnVerdictSwap');
  if (btnSwap && hasSwap) {
    btnSwap.onclick = () => {
      selectedVerdict = 'SWAP';
      if (!selectedSwapTarget && swapOpponents.length > 0) {
        selectedSwapTarget = swapOpponents[0].id;
      }
      renderPhase2();
    };
  }

  document.querySelectorAll('[data-swap-target-id]').forEach(el => {
    el.onclick = () => {
      const tid = el.getAttribute('data-swap-target-id');
      if (tid !== myPlayerId) {
        selectedSwapTarget = tid;
        if (selectedVerdict === 'SWAP') {
          renderPhase2();
        }
      }
    };
  });

  const btnConfirm = document.getElementById('btnConfirmVerdict');
  if (btnConfirm) {
    btnConfirm.onclick = async () => {
      if (!selectedVerdict) {
        selectedVerdict = 'DRINK';
      }
      if (selectedVerdict === 'SWAP' && !selectedSwapTarget) {
        return alert(currentLang === 'tr' ? "Lütfen fincanını değiştireceğin bir rakip seç!" : "Please select an opponent to swap cups with!");
      }
      try {
        if (selectedVerdict === 'DRINK' || selectedVerdict === 'SWAP') {
          playSipSound();
        } else {
          playSlideSound();
        }

        const finalVerdictPayload = selectedVerdict === 'SWAP' ? `SWAP:${selectedSwapTarget}` : selectedVerdict;
        await submitVerdict(currentRoom.code, myPlayerId, finalVerdictPayload);
        auditorAgent.recordDecisionConfirmed(myPlayerId, me.name, finalVerdictPayload, me.isHost);
      } catch (e) {
        alert(e.message);
      }
    };
  }

  if (me.isHost) {
    const btnHostReveal = document.getElementById('btnHostRevealPhase3');
    if (btnHostReveal) {
      btnHostReveal.onclick = async () => {
        try {
          if (!me.ready) {
            const finalVerdictPayload = selectedVerdict === 'SWAP' ? `SWAP:${selectedSwapTarget}` : (selectedVerdict || 'DRINK');
            await submitVerdict(currentRoom.code, myPlayerId, finalVerdictPayload);
            auditorAgent.recordDecisionConfirmed(myPlayerId, me.name, finalVerdictPayload, true);
          }
          auditorAgent.recordHostAdvance(me.name, 'Masayı Açıkla (Faz 2 Bitti)', !allReady);
          await advanceToPhase3(currentRoom.code);
        } catch (e) {
          alert(e.message);
        }
      };
    }
  }
}

// -------------------------------------------------------------------
// 6. DRAMATIC POISON REVEAL SCREEN (POISONED! - PANEL 4)
// -------------------------------------------------------------------
function renderPoisonRevealScreen() {
  const L = getL();
  const me = currentRoom.players ? currentRoom.players[myPlayerId] : null;
  const ev = currentRoom.lastPoisonEvent || {};
  const allVictims = ev.allVictims || [ev];
  // If the current player is one of the victims, show their own perspective!
  const myVictimEv = allVictims.find(v => v.victimId === myPlayerId || v.victimName === me?.name);
  const activeEv = myVictimEv || ev;
  const victimName = activeEv.victimName || (currentLang === 'tr' ? 'Kurban' : 'Victim');
  const killerName = activeEv.killerName || (currentLang === 'tr' ? 'Bilinmeyen Katil' : 'Unknown Killer');
  const ptsLost = activeEv.pointsLost ?? (activeEv.isPillSaved ? 2 : 0);
  const bounty = activeEv.bountyAwarded || (activeEv.isPillSaved ? 1 : 2);
  const isPillSaved = !!activeEv.isPillSaved;
  const isMeVictim = (me && activeEv.victimId === myPlayerId) || (me && victimName === me.name);

  // Play audio
  playPoisonSound();

  // Multi-victim notice if more than 1 player drank cyanide
  let multiVictimNotice = '';
  const otherVictims = allVictims.filter(v => v.victimId !== activeEv.victimId);
  if (otherVictims.length > 0) {
    const names = otherVictims.map(v => v.victimName).join(', ');
    multiVictimNotice = `
      <div class="poison-multi-victim-sub">
        ⚠️ ${currentLang === 'tr' 
          ? `Masadaki Diğer Olay: <strong>${names}</strong> de bu raund siyanür içti!` 
          : `Also at the table: <strong>${names}</strong> also drank cyanide this round!`}
      </div>
    `;
  }

  // Story description
  let storyText = '';
  if (isMeVictim) {
    if (isPillSaved) {
      storyText = currentLang === 'tr'
        ? `${killerName}, senin fincanına gizlice siyanür bıraktı ve sen çayını içtin! Gizli panzehir hapın hayatını kurtardı (-${ptsLost} Puan kaybettin, ${killerName} +${bounty} puan kazandı).`
        : `${killerName}, senin fincanına gizlice siyanür bıraktı ve sen şüphelenmeden çayını içtin! Zehirlenerek elendin (${killerName} +${bounty} Suikast Puanı kazandı).`;
    } else {
      storyText = currentLang === 'tr'
        ? `${killerName}, senin fincanına gizlice siyanür bıraktı ve sen şüphelenmeden çayını içtin! Zehirlenerek elendin (${killerName} +${bounty} Suikast Puanı kazandı).`
        : `${killerName} secretly slipped cyanide into your cup and you drank it unsuspectingly! You were fatally poisoned and eliminated (${killerName} +${bounty} Assassin Bounty).`;
    }
  } else {
    if (isPillSaved) {
      storyText = currentLang === 'tr'
        ? `${killerName}, ${victimName}'ın fincanına gizlice siyanür bıraktı! ${victimName} çayını içti fakat gizli panzehir hapı hayatını kurtardı (-${ptsLost} Puan kaybetti, ${killerName} +${bounty} puan kazandı).`
        : `${killerName} secretly slipped cyanide into ${victimName}'s cup! ${victimName} drank it but an antidote pill saved their life (-${ptsLost} Pts, ${killerName} +${bounty} pts).`;
    } else {
      storyText = currentLang === 'tr'
        ? `${killerName}, ${victimName}'ın fincanına gizlice siyanür bıraktı ve ${victimName} şüphelenmeden çayını içti! ${victimName} zehirlenerek elendi (${killerName} +${bounty} Suikast Puanı kazandı).`
        : `${killerName} secretly slipped cyanide into ${victimName}'s cup and ${victimName} drank it unsuspectingly! ${victimName} was eliminated (${killerName} +${bounty} Assassin Bounty).`;
    }
  }

  appEl.innerHTML = `
    <div style="display:flex; justify-content:flex-end; width:100%;">
      ${renderLangToggle()}
    </div>

    <div class="poisoned-cinematic-screen">
      <!-- 1. Atmospheric Victorian Header -->
      <div class="poison-cinematic-header">
        <div class="poison-header-pill">☠️ ${currentLang === 'tr' ? 'VİKTORYA CİNAYETİ' : 'VICTORIAN MURDER'} ☠️</div>
        <div class="poison-header-sub">${currentLang === 'tr' ? 'ÖLÜMCÜL SİYANÜR İFŞA OLDU' : 'FATAL CYANIDE REVEALED'}</div>
      </div>

      <!-- 2. Authentic 16-Bit Flaming Skull & 3D Purple Ribbon Banner (POISONED!) -->
      <div class="poison-cinematic-hero-container">
        <img src="${ASSET_IMAGES.poison_cinematic_full}" alt="POISONED!" class="poison-cinematic-hero-img" draggable="false" />
      </div>

      <!-- 3. Unified Victorian Murder Dossier Card -->
      <div class="poison-unified-card ${isMeVictim ? 'is-me' : 'is-other'}">
        <div class="poison-alert-title">
          ${isMeVictim 
            ? `💀 ${currentLang === 'tr' ? 'DİKKAT: ÇAYINDA SİYANÜR VARDI!' : 'BEWARE: YOUR CUP HAD CYANIDE!'}`
            : `💀 ${currentLang === 'tr' ? 'MASADA BİR CİNAYET İŞLENDİ!' : 'A MURDER OCCURRED AT THE TABLE!'}`}
        </div>
        <div class="poison-alert-sub">
          ${isMeVictim
            ? (isPillSaved 
                ? (currentLang === 'tr' ? 'Panzehir hapın sayesinde ölümden döndün!' : 'Your antidote pill saved you from death!')
                : (currentLang === 'tr' ? 'Siyanürlü çayı içtin ve masadan elendin!' : 'You drank cyanide and were eliminated!'))
            : (isPillSaved
                ? (currentLang === 'tr' ? `${victimName} siyanür içti fakat panzehir ile kurtuldu!` : `${victimName} drank cyanide but was saved by antidote!`)
                : (currentLang === 'tr' ? `${victimName} siyanür içerek masadan elendi!` : `${victimName} drank cyanide and was eliminated!`))}
        </div>

        <!-- Dynamic Side-by-Side Badges: Kurban vs Katil -->
        <div class="poison-reveal-badges">
          <!-- Kurban Kartı -->
          <div class="poison-badge-card victim">
            <div class="badge-header">
              <img src="${ASSET_IMAGES.badge_victim}" alt="Victim" class="badge-icon-img" draggable="false" />
              <span class="badge-role-label">${currentLang === 'tr' ? 'KURBAN' : 'VICTIM'}</span>
            </div>
            <div class="badge-player-name">${victimName}</div>
            <div class="badge-outcome-tag ${isPillSaved ? 'pill-saved' : 'eliminated'}">
              ${isPillSaved 
                ? `💊 ${currentLang === 'tr' ? `Panzehir Korudu (-${ptsLost} Puan)` : `Pill Saved (-${ptsLost} Pts)`}` 
                : `☠️ ${currentLang === 'tr' ? 'Elendi (Öldü)' : 'Eliminated'}`}
            </div>
          </div>

          <!-- Katil Kartı -->
          <div class="poison-badge-card killer">
            <div class="badge-header">
              <img src="${ASSET_IMAGES.badge_killer}" alt="Killer" class="badge-icon-img" draggable="false" />
              <span class="badge-role-label">${currentLang === 'tr' ? 'KATİL' : 'KILLER'}</span>
            </div>
            <div class="badge-player-name">${killerName}</div>
            <div class="badge-outcome-tag killer-bounty">
              🎯 +${bounty} ${currentLang === 'tr' ? 'Suikast Puanı' : 'Assassin Bounty'}
            </div>
          </div>
        </div>

        <!-- Olay Açıklaması (Narrative Story Box) -->
        <div class="poison-story-box">
          <div class="poison-story-title">📜 ${currentLang === 'tr' ? 'CİNAYETİN AYRINTILARI' : 'CRIME DETAILS'}</div>
          <div class="poison-story-content">${storyText}</div>
          ${multiVictimNotice}
        </div>
      </div>

      <!-- Action Button -->
      <button class="btn btn-primary btn-poison-proceed" id="btnPoisonContinue">
        [ ➜ ${currentLang === 'tr' ? 'SONUÇLARA DEVAM ET' : 'CONTINUE TO RESULTS'} ]
      </button>
    </div>
  `;

  attachLangEvents();

  const handleDismiss = () => {
    hasDismissedPoisonCinematic = true;
    if (currentRoom.status === 'GAME_OVER') {
      renderGameOver();
    } else {
      renderPhase3();
    }
  };

  const btnContinue = document.getElementById('btnPoisonContinue');
  if (btnContinue) btnContinue.onclick = handleDismiss;
}

// -------------------------------------------------------------------
// 7. PHASE 3: SONUÇ, PUANLAR VE ELEMELER (RESULT PHASE - PANEL 3)
// -------------------------------------------------------------------
function renderPhase3() {
  const L = getL();
  const me = currentRoom.players[myPlayerId];
  const allPlayers = Object.values(currentRoom.players || {});
  const targetGoal = currentRoom.targetPoints || 8;

  // Dramatic Poison Reveal (Panel 4) if ANY player was poisoned this round!
  const poisonEv = currentRoom.lastPoisonEvent;
  if (poisonEv && !hasDismissedPoisonCinematic) {
    renderPoisonRevealScreen();
    return;
  }

  // Play audio once
  if (!hasPlayedPhase3Sound) {
    hasPlayedPhase3Sound = true;
    if (!me.alive) {
      playDeathBell();
    } else if (me.autoPillUsed) {
      playPillSound();
    } else if (me.lastDrank) {
      playSipSound();
    } else {
      playSlideSound();
    }
  }

  // Personal Outcome Catharsis Banner
  let outcomeBannerHtml = '';
  if (me.dumpedWasPoisoned) {
    outcomeBannerHtml = `
      <div class="personal-outcome-banner relief">
        😮‍💨 ${L.dumpReliefTitle} ${L.dumpReliefDesc}
      </div>
    `;
  } else if (me.verdict === 'DUMP' && !me.dumpedWasPoisoned) {
    outcomeBannerHtml = `
      <div class="personal-outcome-banner regret">
        🤦‍♂️ ${L.dumpRegretTitle} ${L.dumpRegretDesc(me.dumpedSweetCount || 0)}
      </div>
    `;
  } else if (me.autoPillUsed) {
    outcomeBannerHtml = `
      <div class="personal-outcome-banner pill">
        💊 ${L.autoPillTitle}
      </div>
    `;
  } else if (me.lastDrank && me.pointsEarnedThisRound > 0) {
    outcomeBannerHtml = `
      <div class="personal-outcome-banner clean">
        🍬 ${L.survivedTitleClean(me.pointsEarnedThisRound)}
      </div>
    `;
  }

  // 1. Build Round Chronicles (Bu Raund Neler Yaşandı?)
  const roundEvents = [];
  if (currentRoom.roundLogs && currentRoom.roundLogs.length > 0) {
    for (const ev of currentRoom.roundLogs) {
      if (ev.type === 'CUP_SWAP') {
        roundEvents.push({
          icon: '🔄',
          text: currentLang === 'tr' 
            ? `<strong>${ev.actor}</strong>, <strong>${ev.target}</strong>'ın fincanını çaldı!`
            : `<strong>${ev.actor}</strong> secretly stole <strong>${ev.target}</strong>'s cup!`
        });
      } else if (ev.type === 'DRINK_CLEAN') {
        roundEvents.push({
          icon: '☕',
          text: currentLang === 'tr'
            ? `<strong>${ev.name}</strong> temiz çayını içti: <span class="chronicle-gain">+${ev.pointsEarned} Puan</span>`
            : `<strong>${ev.name}</strong> drank clean tea: <span class="chronicle-gain">+${ev.pointsEarned} Points</span>`
        });
      } else if (ev.type === 'DUMP') {
        if (ev.wasPoisoned) {
          roundEvents.push({
            icon: '🫗',
            text: currentLang === 'tr'
              ? `<strong>${ev.name}</strong> şüphelendi ve döktü: <span class="chronicle-relief">Zehirden kurtuldu! 😮‍💨</span>`
              : `<strong>${ev.name}</strong> suspected poison and dumped: <span class="chronicle-relief">Saved from cyanide! 😮‍💨</span>`
          });
        } else {
          roundEvents.push({
            icon: '🫗',
            text: currentLang === 'tr'
              ? `<strong>${ev.name}</strong> çayını döktü: ${ev.sweetCount || 0} tatlı şeker heba oldu (Temizdi) 🤦‍♂️`
              : `<strong>${ev.name}</strong> dumped tea: ${ev.sweetCount || 0} sweet sugar wasted (Clean tea) 🤦‍♂️`
          });
        }
      } else if (ev.type === 'POISONED_PILL') {
        const killerStr = ev.killers && ev.killers.length > 0 ? `(Katil: ${ev.killers.join(', ')})` : '';
        roundEvents.push({
          icon: '💊',
          text: currentLang === 'tr'
            ? `<strong>${ev.name}</strong> siyanür içti! Panzehir hapı kurtardı: <span class="chronicle-loss">-${ev.pointsLost ?? 0} Puan</span> ${killerStr}`
            : `<strong>${ev.name}</strong> drank cyanide! Antidote pill saved them: <span class="chronicle-loss">-${ev.pointsLost ?? 0} Points</span> ${killerStr}`
        });
      } else if (ev.type === 'DEATH') {
        const killerStr = ev.killers && ev.killers.length > 0 ? `(Katil: <strong>${ev.killers.join(', ')}</strong> +2 Puan)` : '';
        roundEvents.push({
          icon: '☠️',
          text: currentLang === 'tr'
            ? `<strong>${ev.name}</strong> siyanür içti ve <span class="chronicle-eliminated">ELENDİ!</span> ${killerStr}`
            : `<strong>${ev.name}</strong> drank cyanide and was <span class="chronicle-eliminated">ELIMINATED!</span> ${killerStr}`
        });
      }
    }
  }

  // Fallback if roundLogs is empty: construct from players state
  if (roundEvents.length === 0) {
    for (const p of allPlayers) {
      if (p.swappedThisRound) {
        roundEvents.push({
          icon: '🔄',
          text: currentLang === 'tr'
            ? `<strong>${p.name}</strong>, <strong>${p.swappedThisRound.targetName}</strong>'ın fincanını çaldı!`
            : `<strong>${p.name}</strong> stole <strong>${p.swappedThisRound.targetName}</strong>'s cup!`
        });
      }
      if (p.lastDrank) {
        if (p.autoPillUsed) {
          roundEvents.push({
            icon: '💊',
            text: currentLang === 'tr'
              ? `<strong>${p.name}</strong> siyanür içti! Panzehir hayatını kurtardı (-${p.pointsLostThisRound ?? 0} Puan).`
              : `<strong>${p.name}</strong> drank cyanide! Antidote pill saved their life (-${p.pointsLostThisRound ?? 0} Pts).`
          });
        } else if (!p.alive) {
          roundEvents.push({
            icon: '☠️',
            text: currentLang === 'tr'
              ? `<strong>${p.name}</strong> siyanür içti ve elendi!`
              : `<strong>${p.name}</strong> drank cyanide and was eliminated!`
          });
        } else {
          roundEvents.push({
            icon: '☕',
            text: currentLang === 'tr'
              ? `<strong>${p.name}</strong> temiz çayını içti: +${p.pointsEarnedThisRound || 0} Puan`
              : `<strong>${p.name}</strong> drank clean tea: +${p.pointsEarnedThisRound || 0} Points`
          });
        }
      } else if (p.verdict === 'DUMP') {
        if (p.dumpedWasPoisoned) {
          roundEvents.push({
            icon: '🫗',
            text: currentLang === 'tr'
              ? `<strong>${p.name}</strong> şüphelendi ve döktü: Zehirden kurtuldu! 😮‍💨`
              : `<strong>${p.name}</strong> suspected poison and dumped: Saved from cyanide! 😮‍💨`
          });
        } else {
          roundEvents.push({
            icon: '🫗',
            text: currentLang === 'tr'
              ? `<strong>${p.name}</strong> çayını döktü: ${p.dumpedSweetCount || 0} şeker heba oldu (Temizdi) 🤦‍♂️`
              : `<strong>${p.name}</strong> dumped clean tea (${p.dumpedSweetCount || 0} sweets wasted) 🤦‍♂️`
          });
        }
      }
    }
  }

  // 2. Build Live Leaderboard (Canlı Skor Tablosu - Hedef: 8 Puan)
  const sortedLeaderboard = [...allPlayers].sort((a, b) => {
    if (a.alive !== b.alive) return a.alive ? -1 : 1;
    if ((b.points || 0) !== (a.points || 0)) return (b.points || 0) - (a.points || 0);
    return (b.killsThisRound || 0) - (a.killsThisRound || 0);
  });

  const rankMedals = ['🥇', '🥈', '🥉'];

  appEl.innerHTML = `
    <div class="app-header">
      <div style="display:flex; align-items:center; gap:8px;">
        <span class="app-header-round">${L.round} ${currentRoom.round || 1}</span>
      </div>
      ${renderLangToggle()}
    </div>

    ${renderInventoryBar(me, L, true)}

    ${outcomeBannerHtml}

    <!-- Panel 3: Victorian Ornate Gold Frame with 2-3-2 Table Grid & Live Results -->
    <div class="filigree-frame result-phase-frame">
      <div class="filigree-corner top-left">${ICONS.filigreeCorner}</div>
      <div class="filigree-corner top-right">${ICONS.filigreeCorner}</div>
      <div class="filigree-corner bottom-left">${ICONS.filigreeCorner}</div>
      <div class="filigree-corner bottom-right">${ICONS.filigreeCorner}</div>
      <div class="filigree-inner-border"></div>
      
      <div class="filigree-header-title">RESULT PHASE</div>
      
      <!-- Upper Half: 2-3-2 Table Grid with Dynamic Outcome Badges -->
      ${renderCupsTable232(allPlayers, true)}

      <!-- Lower Half: Circular Draped Table with Shattered Porcelain Cup -->
      <div class="shattered-cup-scene">
        ${ICONS.shatteredCupPixel}
      </div>
    </div>

    <!-- 1. Bu Raund Neler Yaşandı? (Round Chronicles / Olay Günlüğü) -->
    <div class="round-chronicles-panel">
      <div class="chronicles-header">
        <span class="chronicles-title">${L.roundChroniclesTitle}</span>
        <span class="chronicles-subtitle">${L.roundChroniclesSub}</span>
      </div>
      <div class="chronicles-list">
        ${roundEvents.length === 0 ? `
          <div style="text-align:center; color:#baa4bd; font-family:var(--font-pixel-ui); font-size:0.7rem; padding:8px;">
            ${L.noEventsRound}
          </div>
        ` : roundEvents.map(ev => `
          <div class="chronicle-item">
            <span class="c-icon">${ev.icon}</span>
            <span class="c-text">${ev.text}</span>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- 2. Canlı Skor Tablosu (Leaderboard - Hedef: 8 Puan) -->
    <div class="leaderboard-panel">
      <div class="leaderboard-header">
        <span class="lb-title">🏆 ${L.liveLeaderboardTitle}</span>
        <span class="lb-target">${L.leaderboardTarget}</span>
      </div>
      <div class="leaderboard-list">
        ${sortedLeaderboard.map((p, idx) => {
          const isPlayerMe = (p.id === myPlayerId);
          const medal = idx < 3 ? rankMedals[idx] : `#${idx + 1}`;
          const earned = p.pointsEarnedThisRound || 0;
          const lost = p.pointsLostThisRound ?? 0;
          let deltaHtml = `<span class="lb-delta zero">+0</span>`;
          if (earned > 0) {
            deltaHtml = `<span class="lb-delta pos">+${earned}</span>`;
          } else if (lost > 0) {
            deltaHtml = `<span class="lb-delta neg">-${lost}</span>`;
          }

          const progressPct = Math.min(100, Math.round(((p.points || 0) / targetGoal) * 100));

          return `
            <div class="lb-row ${isPlayerMe ? 'is-me' : ''} ${!p.alive ? 'is-dead' : ''}">
              <div class="lb-rank">${medal}</div>
              <div class="lb-info">
                <div class="lb-name-line">
                  <span class="lb-name">${p.name}${isPlayerMe ? ' ★' : ''}</span>
                  <span class="lb-status ${p.alive ? 'alive' : 'dead'}">
                    ${p.alive ? L.aliveStatus : L.deadStatus}
                  </span>
                </div>
                <div class="lb-progress-track">
                  <div class="lb-progress-fill" style="width:${progressPct}%;"></div>
                </div>
              </div>
              <div class="lb-score-box">
                <div class="lb-score-val">${p.points || 0}/${targetGoal} 🍬</div>
                ${deltaHtml}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <div style="margin-top:auto; padding-top:6px; width:100%;">
      ${me.isHost ? `
        <button class="btn btn-primary btn-advance-round" id="btnNextRound">
          [ ➜ ${currentLang === 'tr' ? 'SONRAKİ RAUNDU BAŞLAT ▸' : 'START NEXT ROUND ▸'} ]
        </button>
      ` : `
        <div style="text-align:center; color:var(--text-muted); font-weight:700; font-family:var(--font-pixel-ui); font-size:0.8rem; padding:12px;">
          ${currentLang === 'tr' ? 'Kurucunun sonraki raundu başlatması bekleniyor...' : 'Waiting for host to start next round...'}
        </div>
      `}
    </div>
  `;

  attachLangEvents();

  if (me.isHost) {
    document.getElementById('btnNextRound').onclick = async () => {
      selectedDropType = 'SWEET';
      selectedDropTarget = null;
      selectedVerdict = null;
      selectedSwapTarget = null;
      hasDismissedPoisonCinematic = false;
      hasDismissedModifierModal = false;
      await nextRound(currentRoom.code);
    };
  }
}

// -------------------------------------------------------------------
// 6. GAME OVER SCREEN
// -------------------------------------------------------------------
function renderGameOver() {
  const L = getL();
  const isMutual = currentRoom.winner && currentRoom.winner.includes('BERABERE');

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

    <div style="margin-top:auto; padding-top:24px; display:flex; flex-direction:column; gap:10px; width:100%;">
      <button class="btn btn-primary" id="btnRematch" style="font-size:0.8rem; padding:14px;">
        ⚔️ ${currentLang === 'tr' ? 'RÖVANŞ OYNA (AYNI MASA)' : 'PLAY REMATCH (SAME TABLE)'}
      </button>
      <button class="btn btn-neutral" id="btnRestart" style="font-size:0.75rem; padding:10px;">
        ${L.restartBtn}
      </button>
    </div>
  `;

  attachLangEvents();

  const btnRematch = document.getElementById('btnRematch');
  if (btnRematch) {
    btnRematch.onclick = async () => {
      await rematch(currentRoom.code);
    };
  }

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
// 7. SPECTATOR SCREEN FOR ELIMINATED PLAYERS
// -------------------------------------------------------------------
function formatDetailedEvent(ev, L) {
  switch (ev.type) {
    case 'DROP_SWEET':
      if (ev.giftCyanideReloaded) {
        return L.detailGiftCyanide(ev.actor, ev.target);
      }
      return L.detailDropSweet(ev.actor, ev.target);
    case 'DROP_CYANIDE':
      return L.detailDropCyanide(ev.actor, ev.target);
    case 'DRINK_CLEAN':
      return L.detailDrinkClean(ev.actor, ev.pointsEarned || 0);
    case 'DRINK_POISONED':
      return L.detailDrinkPoison(ev.actor);
    case 'DUMP':
      if (ev.wasPoisoned) {
        return L.detailDumpRelief(ev.actor);
      }
      return L.detailDumpRegret(ev.actor);
    case 'DEATH':
      return L.detailDeath(ev.actor);
    case 'CUP_SWAP':
      return L.detailCupSwap(ev.actor, ev.target);
    case 'POISONED_PILL':
      return L.detailPill(ev.actor, ev.pointsLost || 0);
    case 'WINNER_POINTS':
      return L.detailWinnerPoints(ev.winner, ev.points);
    case 'WINNER_LAST_SURVIVOR':
      return L.detailWinnerSurvivor(ev.winner);
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
  const alivePlayersRows = alivePlayers.map(p => {
    const sugars = p.roundSugars ? (p.roundSugars.total || 0) : 0;
    const hasPoison = p.roundSugars && p.roundSugars.cyanide > 0;
    return `
      <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 10px; background:var(--bg-parchment); border:1px solid var(--border-subtle); border-radius:8px;">
        <span style="font-weight:800; font-size:0.9rem;">${p.isBot ? '🤖 ' : ''}${p.name}</span>
        <div style="display:flex; align-items:center; gap:6px;">
          <span style="font-size:0.75rem; font-weight:800; padding:2px 8px; border-radius:6px; background:${hasPoison ? '#fdf2f2' : '#e8f4ed'}; color:${hasPoison ? '#d9534f' : '#1e5e39'}; border:1px solid ${hasPoison ? '#d9534f' : '#1e5e39'};">
            ${hasPoison ? (currentLang === 'tr' ? `☠️ ${sugars} Şeker (Siyanürlü!)` : `☠️ ${sugars} Sugar (Poisoned!)`) : (currentLang === 'tr' ? `🍬 ${sugars} Şeker (Temiz)` : `🍬 ${sugars} Sugar (Clean)`)}
          </span>
          <span style="font-size:0.75rem; font-weight:900; color:var(--btn-brass);">
            ${p.points || 0}/5 ${currentLang === 'tr' ? 'Puan' : 'Pts'}
          </span>
        </div>
      </div>
    `;
  }).join('');

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
        selectedDropType = 'SWEET';
        selectedDropTarget = null;
        selectedVerdict = null;
        selectedSwapTarget = null;
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

// Expose internal rendering and room helpers for test verification
window.__cot = {
  DB,
  renderHome,
  renderLobby,
  renderPhase1,
  renderPhase2,
  renderPhase3,
  renderRoundModifierScreen,
  renderPoisonRevealScreen,
  renderCurrentScreen,
  getRoom: () => currentRoom,
  setRoom: (r) => { currentRoom = r; },
  getMyPlayerId: () => myPlayerId,
  setMyPlayerId: (id) => { myPlayerId = id; },
  setVerdict: (v) => { selectedVerdict = v; }
};
