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
  kickPlayer 
} from './gameLogic.js';
import { playDeathBell, playPillSound, playSipSound, playPoisonSound, playSlideSound } from './audio.js';
import { ICONS } from './icons.js';
import { initAdminPanel, cleanupAdminPanel } from './admin.js';
import { addBot, runBotLifecycle } from './botLogic.js';

const appEl = document.getElementById('app');

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
    scoreLabel: "Şeker Puanı",
    scoreVal: (p) => `${p}/5 🍬`,
    pillLabel: "Panzehir (Can)",
    pillVal: (p) => p > 0 ? "1 Can 💊" : "Tükendi",
    cyanideLabel: "Siyanür",
    cyanideVal: (c) => c > 0 ? `${c} Doz ☠️` : "Boş",
    swapLabel: "Takas Hakkı",
    swapVal: (s) => (s ?? 1) > 0 ? "1 Hak 🔄" : "Tükendi",
    swapBtn: (s) => `🔄 FİNCANI DEĞİŞTİR & İÇ ${(s ?? 1) <= 0 ? '(Tükendi)' : '(1 Hak)'}`,
    swapTargetTitle: "Kimin Fincanıyla Takas Edeceksin?",
    swapTargetSub: "Fincanını hedefin fincanıyla gizlice takas eder ve onun çayını içersin! Kendi fincanın hedefe gider.",
    swapBannerTitle: "FİNCANINI GİZLİCE DEĞİŞTİRDİN! 🔄",
    swapBannerSub: (target) => `${target}'ın fincanını çaldın ve içtin. Kendi fincanın ise ${target}'a gitti!`,
    logCupSwap: (actor, target) => `🔄 ${actor}, gizlice ${target}'ın fincanını çaldı ve içti!`,
    detailCupSwap: (actor, target) => `🔄 <strong>${actor}</strong>, gizlice <strong>${target}</strong>'ın fincanını çaldı ve içti!`,
    phase1Title: "1. ADIM: ŞEKERİ AT",
    phase1Desc: "Gizlice bir rakibin fincanına şeker bırak. Tatlı şeker ikram edersen +1 Siyanür kazanırsın! Fincanına siyanür attığın rakip içerse +2 Suikastçı Puanı kazanırsın!",
    dropSweetBtn: "🍬 Tatlı Şeker (İkram / +1 Siyanür)",
    dropCyanideBtn: (c) => `☠️ Siyanür Küpü (${c} Doz) ${c <= 0 ? '(Yok)' : ''}`,
    targetLabel: "Kimin Fincanına Atacaksın?",
    targetOpponentSweetSub: "İkram Et / +1 Siyanür Al",
    targetOpponentCyanideSub: "Siyanür Hedefi (+2 Puan)",
    hintSweetOpponent: "🎁 Başkasına tatlı şeker ikram ettin! Ona potansiyel puan gider ama CEBİNE +1 SİYANÜR mermisi yüklenir!",
    hintCyanide: "☠️ Rakibinin fincanına gizlice ölümcül siyanür attın! Eğer çayını içerse elenir ve sen +2 Suikastçı Puanı kazanırsın!",
    killBountyBanner: (kills) => `🎯 +${kills * 2} SUİKASTÇI PUANI KAZANDIN!`,
    killBountySub: "Zehirlediğin kurban çayını içti ve elendi! Cinayet ödülü hanene yazıldı.",
    logDeathWithKiller: (victim, killer) => `🎯 ${killer}, ${victim}'ı zehirleyerek eledi (+2 Suikastçı Puanı)!`,
    logDeathMultiKillers: (victim, killers) => `🎯 ${killers.join(', ')} ortaklaşa ${victim}'ı zehirledi (+2'şer Puan)!`,
    confirmAction: "Şekeri Gizlice At ve Bekle",
    waitingOthers: (r, t) => `Diğerleri Bekleniyor (${r}/${t})`,
    phase2Title: "2. ADIM: ÇAYLAR MASADA & KARAR",
    phase2Header: "Masadaki Fincanlar & Blöf",
    phase2Desc: "Herkes şekerini attı, fincanlar masada! Fincanındaki şekerleri gör, masadakileri süz ve kararını ver.",
    cupSugars: (n) => 'Şeker',
    cupSugarsMe: (n) => `Fincanında ${n} Şeker Var!`,
    drinkBtn: "☕ ÇAYIMI İÇİYORUM",
    dumpBtn: "🫗 ÇAYI DÖKÜYORUM",
    drinkTipClean: (n) => `Temizse fincandaki şeker sayısı kadar (+${n} Puan) kazanırsın! İçinde siyanür varsa zehirlenirsin!`,
    dumpTip: "Güvendesin ama 0 puan alırsın.",
    confirmVerdict: "Kararımı Onayla / Hazırım",
    revealResultsHost: "➡️ Masayı Açıkla (Fazı Bitir)",
    verdictTitle: "Çayını Ne Yapacaksın?",
    resultsTitle: "RAUND SONUCU",
    autoPillTitle: "ZEHİRLENDİN AMA PANZEHİR KURTARDI!",
    autoPillDesc: (lost) => (lost && lost > 0)
      ? `Fincanında siyanür vardı! 1 defalık panzehirin (Pill) devreye girdi ve hayatta kaldın ama zehrin etkisiyle <strong>-${lost} Puan</strong> kaybettin!`
      : "Fincanında siyanür vardı! 1 defalık panzehirin (Pill) otomatik devreye girdi ve hayatta kaldın.",
    poisonHitBanner: (hits) => `🎯 +${hits} ZEHİRLEME PUANI KAZANDIN!`,
    poisonHitSub: "Zehirlediğin kurban siyanürlü çayını içti! Panzehiri hayatını kurtardı ama ceza puanı yedi ve sen zehirleme ödülü aldın.",
    eliminatedTitle: "ZEHİRLENDİN VE ELENDİN!",
    fondipDrink: "İçkini FONDİP yap! 🍺",
    deadDesc: "Siyanür boğazını yaktı. Artık ölüsün, kenara geçip hayattakileri izle.",
    survivedTitleClean: (pts) => `+${pts} ŞEKER PUANI KAZANDIN! 🍬`,
    survivedCleanSub: "Temiz çayını içtin ve şeker puanlarını cebine koydun!",
    dumpReliefTitle: "HAYATINI KURTARDIN! 😮‍💨",
    dumpReliefDesc: "Fincanında gizlice atılmış SİYANÜR vardı! Çayını dökerek mutlak bir ölümden kıl payı kurtuldun!",
    dumpRegretTitle: "BOŞU BOŞUNA DÖKTÜN! 🤦‍♂️",
    dumpRegretDesc: (n) => `Fincanında ${n} Tatlı Şeker vardı ve çayın tertemizdi! Boş yere şüphelenip döktün, puanları kaçırdın.`,
    leaderboardTitle: "Skor Tablosu (Hedef: 5 Puan)",
    roundEvents: "Bu Raund Neler Yaşandı?",
    noEventsRound: "Bu raund özel bir olay yaşanmadı.",
    logDeath: (name) => `☠️ ${name} siyanürlü çayı içti ve elendi!`,
    logPill: (name, lost) => (lost && lost > 0)
      ? `💊 ${name} siyanürlü çayı içti! Panzehiri kurtardı ama -${lost} Puan kaybetti!`
      : `💊 ${name} siyanürlü çayı içti ama panzehiri kurtardı!`,
    logPillWithKiller: (victim, killer, lost) => (lost && lost > 0)
      ? `💊 ${victim}, ${killer}'ın siyanürünü içti! Panzehiri kurtardı ama -${lost} Puan kaybetti (${killer} +1 Ödül)!`
      : `💊 ${victim}, ${killer}'ın siyanürünü içti ama panzehiri kurtardı!`,
    logDrinkClean: (name, pts) => `☕ ${name} temiz çayını içti (+${pts} Puan)!`,
    logDumpRelief: (name) => `🫗 ${name} çayını döktü (İçinde Siyanür vardı, hayatını kurtardı! 😮‍💨)`,
    logDumpRegret: (name) => `🫗 ${name} şüphelendi ve çayını döktü (Çay tertemizdi! 🤦‍♂️)`,
    logWinnerPoints: (winner, pts) => `👑 ŞAMPİYON: ${winner} (${pts} Şeker Puanı)!`,
    logWinnerSurvivor: (winner) => `👑 ŞAMPİYON: ${winner} (Hayatta Kalan Son Kişi)!`,
    nextRoundBtn: "Sonraki Raundu Başlat",
    waitingNextRound: "Kurucunun sonraki raundu başlatması bekleniyor...",
    gameOverTitle: "ŞAMPİYON BELLİ OLDU!",
    gameOverMutual: "ÇİFTE CİNAYET!",
    gameOverMutualDesc: "Tüm finalistler aynı anda zehirlendi! TÜM MASA FONDİP YAPIYOR!",
    gameOverWinnerDesc: "Tüm blöfleri ve zehirleri aşıp 5 puana ulaşan veya son hayatta kalan şampiyon olur!",
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
    detailDropSweet: (actor, target) => `🍬 <strong>${actor}</strong>, <strong>${target}</strong>'ın fincanına tatlı şeker attı.`,
    detailGiftCyanide: (actor, target) => `🎁 <strong>${actor}</strong>, <strong>${target}</strong>'a tatlı şeker ikram etti ve cebine <strong>+1 SİYANÜR</strong> kazandı!`,
    detailDropCyanide: (actor, target) => `☠️ <strong>${actor}</strong>, <strong>${target}</strong>'ın fincanına gizlice SİYANÜR attı!`,
    detailDrinkClean: (actor, pts) => `☕ <strong>${actor}</strong> çayını içti (+${pts} Puan, temiz çay).`,
    detailDrinkPoison: (actor) => `☠️ <strong>${actor}</strong> zehirli çayı içti!`,
    detailDumpRelief: (actor) => `🫗 <strong>${actor}</strong> çayını döktü (İçinde Siyanür vardı, kurtuldu! 😮‍💨)`,
    detailDumpRegret: (actor) => `🫗 <strong>${actor}</strong> çayını döktü (Temiz çaydı, boşuna döktü! 🤦‍♂️)`,
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
    myLogGiftCyanide: (r, target) => `🎁 <strong>${r}</strong>${target}'a tatlı şeker ikram ettin ve cebine +1 SİYANÜR kazandın!`,
    myLogDropCyanide: (r, target) => `☠️ <strong>${r}</strong>${target}'ın fincanına gizlice SİYANÜR attın!`,
    myLogDrinkClean: (r, pts) => `☕ <strong>${r}</strong>Çayını içtin (+${pts} Puan kazandın, temizdi).`,
    myLogDrinkPoison: (r) => `☠️ <strong>${r}</strong>Çayını içtin (İçinde Siyanür vardı!).`,
    myLogDumpRelief: (r) => `🫗 <strong>${r}</strong>Çayını döktün (İçinde Siyanür vardı, hayatını kurtardın! 😮‍💨)`,
    myLogDumpRegret: (r, sweet) => `🫗 <strong>${r}</strong>Çayını döktün (${sweet} şekerli temiz çaydı, boşuna döktün! 🤦‍♂️)`,
    myLogPill: (r) => `💊 <strong>${r}</strong>Siyanür içtin ama panzehirin (Pill) hayatını kurtardı!`,
    myLogDeath: (r) => `💀 <strong>${r}</strong>Siyanür içtin ve elendin!`,
    adminPanel: "🛠️ Yönetici Paneli (Oyun Logları)",
    addBot: "+ Bot Ekle (Yapay Zeka)"
  },
  en: {
    title: "CUP OF TEA",
    subtitle: "Sugar & Cyanide Tea Party",
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
    scoreLabel: "Sugar Points",
    scoreVal: (p) => `${p}/5 🍬`,
    pillLabel: "Antidote (Life)",
    pillVal: (p) => p > 0 ? "1 Life 💊" : "Spent",
    cyanideLabel: "Cyanide",
    cyanideVal: (c) => c > 0 ? `${c} Dose${c > 1 ? 's' : ''} ☠️` : "Empty",
    swapLabel: "Cup Swap",
    swapVal: (s) => (s ?? 1) > 0 ? "1 Left 🔄" : "Spent",
    swapBtn: (s) => `🔄 SWAP CUP & DRINK ${(s ?? 1) <= 0 ? '(Spent)' : '(1 Left)'}`,
    swapTargetTitle: "Whose cup will you swap with?",
    swapTargetSub: "Secretly swap cups with your target and drink their tea! Your cup goes to them.",
    swapBannerTitle: "YOU SECRETLY SWAPPED CUPS! 🔄",
    swapBannerSub: (target) => `You stole and drank ${target}'s cup. Your cup went to ${target}!`,
    logCupSwap: (actor, target) => `🔄 ${actor} secretly swapped cups with ${target} and drank it!`,
    detailCupSwap: (actor, target) => `🔄 <strong>${actor}</strong> secretly swapped cups with <strong>${target}</strong> and drank it!`,
    phase1Title: "STEP 1: DROP THE SUGAR",
    phase1Desc: "Secretly drop sugar into an opponent's teacup. Gifting sweet sugar reloads +1 Cyanide! Eliminating an opponent with cyanide earns +2 Assassin Bounty!",
    dropSweetBtn: "🍬 Sweet Sugar (Treat / +1 Cyanide)",
    dropCyanideBtn: (c) => `☠️ Cyanide Cube (${c} Dose${c > 1 ? 's' : ''}) ${c <= 0 ? '(Empty)' : ''}`,
    targetLabel: "Whose cup are you dropping it into?",
    targetOpponentSweetSub: "Treat / +1 Cyanide",
    targetOpponentCyanideSub: "Cyanide Target (+2 Bounty)",
    hintSweetOpponent: "🎁 Treating an opponent gives them potential points, but reloads +1 CYANIDE in your pocket!",
    hintCyanide: "☠️ You dropped lethal cyanide into your opponent's cup! If they drink, they are eliminated and you earn +2 Assassin Points!",
    killBountyBanner: (kills) => `🎯 +${kills * 2} ASSASSIN BOUNTY EARNED!`,
    killBountySub: "Your poisoned victim drank their tea and was eliminated! Bounty awarded to your score.",
    logDeathWithKiller: (victim, killer) => `🎯 ${killer} poisoned and eliminated ${victim} (+2 Assassin Bounty)!`,
    logDeathMultiKillers: (victim, killers) => `🎯 ${killers.join(', ')} jointly poisoned ${victim} (+2 Bounty each)!`,
    confirmAction: "Drop Sugar Secretly & Wait",
    waitingOthers: (r, t) => `Waiting for Others (${r}/${t})`,
    phase2Title: "STEP 2: TEACUPS REVEAL & VERDICT",
    phase2Header: "Teacups on Table & Bluff",
    phase2Desc: "Sugars have been dropped! Check the sugar count in your cup, read the parlor, and choose your fate.",
    cupSugars: (n) => n === 1 ? 'Sugar' : 'Sugars',
    cupSugarsMe: (n) => `Your Cup Has ${n} Sugar(s)!`,
    drinkBtn: "☕ DRINK MY TEA",
    dumpBtn: "🫗 DUMP THE TEA",
    drinkTipClean: (n) => `If clean, you gain (+${n} Points) equal to sugar count! If poisoned, you drink cyanide!`,
    dumpTip: "Safe, but you get 0 points.",
    confirmVerdict: "Confirm My Decision",
    revealResultsHost: "➡️ Reveal Results (End Phase)",
    verdictTitle: "What will you do with your tea?",
    resultsTitle: "ROUND RESULTS",
    autoPillTitle: "POISONED BUT SAVED BY ANTIDOTE!",
    autoPillDesc: (lost) => (lost && lost > 0)
      ? `Your cup had cyanide! Your single-use antidote pill activated and saved your life, but the poison burned off <strong>-${lost} Points</strong>!`
      : "Your cup had cyanide! Your single-use antidote pill activated and saved your life.",
    poisonHitBanner: (hits) => `🎯 +${hits} POISON BOUNTY EARNED!`,
    poisonHitSub: "Your victim drank your poisoned cup! Their antidote saved them, but they lost points and you banked bounty.",
    eliminatedTitle: "POISONED AND ELIMINATED!",
    fondipDrink: "CHUG YOUR REAL DRINK! 🍺",
    deadDesc: "Cyanide burned your throat. You are eliminated. Step aside and observe the survivors.",
    survivedTitleClean: (pts) => `+${pts} SUGAR POINTS EARNED! 🍬`,
    survivedCleanSub: "You drank clean tea and banked points!",
    dumpReliefTitle: "YOU SAVED YOUR LIFE! 😮‍💨",
    dumpReliefDesc: "Your cup had CYANIDE! By dumping your tea, you narrowly escaped certain death!",
    dumpRegretTitle: "YOU DUMPED FOR NOTHING! 🤦‍♂️",
    dumpRegretDesc: (n) => `Your cup had ${n} Sweet Sugar(s) and was clean! You got paranoid and dumped it, missing points!`,
    leaderboardTitle: "Leaderboard (Goal: 5 Points)",
    roundEvents: "What Happened This Round?",
    noEventsRound: "No special incidents this round.",
    logDeath: (name) => `☠️ ${name} drank cyanide and was eliminated!`,
    logPill: (name, lost) => (lost && lost > 0)
      ? `💊 ${name} drank cyanide! Antidote saved them, but lost -${lost} Points!`
      : `💊 ${name} drank cyanide but was saved by antidote!`,
    logPillWithKiller: (victim, killer, lost) => (lost && lost > 0)
      ? `💊 ${victim} drank ${killer}'s cyanide! Antidote saved them, but lost -${lost} Points (${killer} +1 Bounty)!`
      : `💊 ${victim} drank ${killer}'s cyanide but was saved by antidote!`,
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
    gameOverWinnerDesc: "The cunning survivor who outwitted all traps and reached 5 points wins!",
    restartBtn: "Start New Game",
    duplicateNameError: "A player with this name already exists in the room! Please choose another name.",
    kickedFromRoom: "You were kicked from the room by the host!",
    kickBtn: "Kick",
    spectatorBadge: "SPECTATOR",
    spectatorTitle: "TABLE OF THE DEAD",
    spectatorSubtitle: "You can no longer speak at the table. Watch all secrets and moves live!",
    liveTableTitle: "Live Table Status (Classified Intel)",
    fullLogTitle: "Complete Game Log & Moves",
    cupCleanLabel: "Clean Tea",
    cupPoisonLabel: "POISONED!",
    detailDropSweet: (actor, target) => `🍬 <strong>${actor}</strong> dropped a sweet sugar into <strong>${target}</strong>'s cup.`,
    detailGiftCyanide: (actor, target) => `🎁 <strong>${actor}</strong> treated <strong>${target}</strong> to sweet sugar and gained <strong>+1 CYANIDE</strong>!`,
    detailDropCyanide: (actor, target) => `☠️ <strong>${actor}</strong> secretly dropped CYANIDE into <strong>${target}</strong>'s cup!`,
    detailDrinkClean: (actor, pts) => `☕ <strong>${actor}</strong> drank tea (+${pts} Points, clean tea).`,
    detailDrinkPoison: (actor) => `☠️ <strong>${actor}</strong> drank poison!`,
    detailDumpRelief: (actor) => `🫗 <strong>${actor}</strong> dumped their tea (Had Cyanide, dodged death! 😮‍💨)`,
    detailDumpRegret: (actor) => `🫗 <strong>${actor}</strong> dumped their tea (It was clean, missed points! 🤦‍♂️)`,
    detailDeath: (actor) => `💀 <strong>${actor}</strong> died from cyanide!`,
    detailPill: (actor) => `💊 <strong>${actor}</strong> swallowed cyanide but was saved by antidote!`,
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
    myLogDrinkClean: (r, pts) => `☕ <strong>${r}</strong>You drank tea (+${pts} Points, clean tea).`,
    myLogDrinkPoison: (r) => `☠️ <strong>${r}</strong>You drank your tea (Had Cyanide!).`,
    myLogDumpRelief: (r) => `🫗 <strong>${r}</strong>You dumped your tea (Had Cyanide, saved your life! 😮‍💨)`,
    myLogDumpRegret: (r, sweet) => `🫗 <strong>${r}</strong>You dumped your tea (${sweet} sugars, clean tea, missed points! 🤦‍♂️)`,
    myLogPill: (r) => `💊 <strong>${r}</strong>You drank cyanide but your antidote (Pill) saved you!`,
    myLogDeath: (r) => `💀 <strong>${r}</strong>You drank cyanide and were eliminated!`,
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

let selectedDropType = 'SWEET'; // 'SWEET' or 'CYANIDE'
let selectedDropTarget = null;  // target playerId
let selectedVerdict = null;     // 'DRINK', 'DUMP', or 'SWAP'
let selectedSwapTarget = null;  // target playerId for swap
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

  // Dead players see the spectator screen during active phases (PHASE_1, PHASE_2)
  if (!me.alive && currentRoom.status !== 'PHASE_3') {
    renderSpectatorScreen();
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

// -------------------------------------------------------------------
// HELPER: RENDER 4-COLUMN INVENTORY BAR (Score, Pill, Cyanide, Swap)
// -------------------------------------------------------------------
function renderInventoryBar(me, L) {
  const swapsLeft = me.swapsLeft ?? 1;
  return `
    <div class="inventory-grid">
      <div class="inv-box">
        <div class="inv-box-label">${L.scoreLabel}</div>
        <div class="inv-box-val" style="color:var(--btn-brass);">
          ${L.scoreVal(me.points || 0)}
        </div>
      </div>
      <div class="inv-box">
        <div class="inv-box-label">${L.pillLabel}</div>
        <div class="inv-box-val" style="color:${(me.pill || 0) > 0 ? 'var(--btn-poison)' : '#aaa'};">
          ${L.pillVal(me.pill || 0)}
        </div>
      </div>
      <div class="inv-box">
        <div class="inv-box-label">${L.cyanideLabel}</div>
        <div class="inv-box-val" style="color:${(me.cyanide || 0) > 0 ? 'var(--btn-crimson)' : '#aaa'};">
          ${L.cyanideVal(me.cyanide || 0)}
        </div>
      </div>
      <div class="inv-box">
        <div class="inv-box-label">${L.swapLabel}</div>
        <div class="inv-box-val" style="color:${swapsLeft > 0 ? 'var(--btn-espresso)' : '#aaa'};">
          ${L.swapVal(swapsLeft)}
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

  // Ensure selectedDropTarget is valid
  if (selectedDropType === 'SWEET') {
    if (!selectedDropTarget || selectedDropTarget === myPlayerId || !otherAlive.some(p => p.id === selectedDropTarget)) {
      selectedDropTarget = otherAlive.length > 0 ? otherAlive[0].id : null;
    }
  } else {
    if (!selectedDropTarget || !alivePlayers.some(p => p.id === selectedDropTarget)) {
      selectedDropTarget = otherAlive.length > 0 ? otherAlive[0].id : myPlayerId;
    }
  }

  // Build Opponent Target Selection Cards
  let targetCardsHtml = '';
  if (selectedDropType === 'SWEET') {
    // Gifting sweet sugar reloads cyanide (cannot target self)!
    targetCardsHtml = otherAlive.map(p => {
      const isSelected = (selectedDropTarget === p.id);
      return `
        <div class="player-target-card ${isSelected ? 'selected' : ''}" data-target-id="${p.id}">
          ${isSelected ? '<span class="target-check">✓</span>' : ''}
          <div style="font-size:1.6rem; margin-bottom:2px;">🎁</div>
          <div style="font-weight:900; font-size:0.85rem; color:var(--text-main);">${p.isBot ? '🤖 ' : ''}${p.name}</div>
          <div style="font-size:0.7rem; font-weight:800; color:var(--btn-poison); margin-top:3px;">
            ${L.targetOpponentSweetSub}
          </div>
          <div style="font-size:0.65rem; color:var(--text-muted); font-weight:700; margin-top:2px;">
            ${p.points || 0}/5 🍬
          </div>
        </div>
      `;
    }).join('');
  } else {
    // CYANIDE: Can target opponents for assassination (+2 Kill Bounty) OR self cup for Trojan bluff!
    const targets = [me, ...otherAlive];
    targetCardsHtml = targets.map(p => {
      const isSelf = (p.id === myPlayerId);
      const isSelected = (selectedDropTarget === p.id);
      return `
        <div class="player-target-card ${isSelected ? 'selected' : ''} ${isSelf ? 'is-self' : ''}" data-target-id="${p.id}">
          ${isSelected ? '<span class="target-check">✓</span>' : ''}
          <div style="font-size:1.6rem; margin-bottom:2px;">${isSelf ? '⭐' : '☠️'}</div>
          <div style="font-weight:900; font-size:0.85rem; color:var(--text-main);">${isSelf ? (currentLang === 'tr' ? 'Kendi Fincanın' : 'Your Cup') : (p.isBot ? '🤖 ' : '') + p.name}</div>
          <div style="font-size:0.7rem; font-weight:800; color:${isSelf ? 'var(--btn-brass)' : 'var(--btn-crimson)'}; margin-top:3px;">
            ${isSelf ? (currentLang === 'tr' ? 'Truva Blöfü 🐴' : 'Trojan Bluff 🐴') : L.targetOpponentCyanideSub}
          </div>
          <div style="font-size:0.65rem; color:var(--text-muted); font-weight:700; margin-top:2px;">
            ${p.points || 0}/5 🍬
          </div>
        </div>
      `;
    }).join('');
  }

  appEl.innerHTML = `
    <div class="app-header">
      <div class="brand-title">${L.round} ${currentRoom.round}</div>
      <div style="display:flex; align-items:center; gap:8px;">
        <div class="room-badge">${L.readyCounter(readyCount, alivePlayers.length)}</div>
        ${renderLangToggle()}
      </div>
    </div>

    ${renderInventoryBar(me, L)}

    <!-- Phase 1 Action Card -->
    <div class="card">
      <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
        <span style="font-size:1.2rem;">🍬</span>
        <span class="input-label" style="margin:0; color:var(--btn-espresso);">${L.phase1Title}</span>
      </div>
      <p style="font-size:0.82rem; color:var(--text-muted); font-weight:600; margin-bottom:14px; line-height:1.4;">
        ${L.phase1Desc}
      </p>

      <!-- Sugar Type Select Buttons -->
      <div class="grid-2">
        <button class="btn btn-neutral ${selectedDropType === 'SWEET' ? 'selected' : ''}" id="btnDropSweet">
          ${L.dropSweetBtn}
        </button>
        <button class="btn btn-neutral ${selectedDropType === 'CYANIDE' ? 'selected' : ''} ${!hasCyanide ? 'btn-disabled' : ''}" id="btnDropCyanide" ${!hasCyanide ? 'disabled' : ''}>
          ${L.dropCyanideBtn(me.cyanide || 0)}
        </button>
      </div>

      <!-- Target Player Cards Grid -->
      <div style="margin-top:10px;">
        <label class="input-label">${L.targetLabel}</label>
        <div class="player-select-grid">
          ${targetCardsHtml}
        </div>
        <div style="margin-top:10px; font-size:0.75rem; color:var(--text-muted); text-align:center; font-weight:700; line-height:1.35;">
          ${selectedDropType === 'SWEET' ? L.hintSweetOpponent : L.hintCyanide}
        </div>
      </div>
    </div>

    <div style="margin-top:auto; padding-top:10px;">
      <button class="btn btn-primary ${me.ready ? 'btn-disabled' : ''}" id="btnSubmitPhase1" ${me.ready ? 'disabled' : ''}>
        ${me.ready ? `⏳ ${L.waitingOthers(readyCount, alivePlayers.length)}` : L.confirmAction}
      </button>
    </div>
  `;

  attachLangEvents();

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
      renderPhase1();
    };
  }

  // Attach card selection clicks
  document.querySelectorAll('.player-target-card').forEach(card => {
    card.onclick = () => {
      selectedDropTarget = card.getAttribute('data-target-id');
      renderPhase1();
    };
  });

  document.getElementById('btnSubmitPhase1').onclick = async () => {
    const target = selectedDropTarget;
    if (!target) {
      return alert(currentLang === 'tr' ? "Lütfen şekeri atmak istediğin fincanı seç!" : "Please choose whose cup to drop the sugar into!");
    }

    if (selectedDropType === 'SWEET' && target === myPlayerId) {
      return alert(currentLang === 'tr' ? "Kendi fincanına şeker atamazsın! Bir rakip seçmelisin." : "You cannot drop sweet sugar into your own cup! Choose an opponent.");
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
    } catch (e) {
      alert(e.message);
    }
  };
}

// -------------------------------------------------------------------
// 4. PHASE 2: ÇAYLAR MASADA & KARAR (DRINK OR DUMP)
// -------------------------------------------------------------------
function renderPhase2() {
  const L = getL();
  const me = currentRoom.players[myPlayerId];
  const alivePlayers = Object.values(currentRoom.players).filter(p => p.alive);
  const readyCount = alivePlayers.filter(p => p.ready).length;
  const hasSwap = (me.swapsLeft ?? 1) > 0;
  const swapOpponents = alivePlayers.filter(p => p.id !== myPlayerId);

  if (!selectedSwapTarget && swapOpponents.length === 1) {
    selectedSwapTarget = swapOpponents[0].id;
  }

  const mySugars = me.roundSugars ? (me.roundSugars.total || 0) : 0;

  // Render Table Cups Grid (Fix duplicate sugar count bug)
  const cupsHtml = alivePlayers.map(p => {
    const isMe = (p.id === myPlayerId);
    const sugarsCount = p.roundSugars ? (p.roundSugars.total || 0) : 0;
    return `
      <div class="cup-card ${isMe ? 'is-me' : ''}">
        <div class="cup-card-user">
          <span style="font-size:1.4rem;">☕</span>
          <div>
            <div style="display:flex; align-items:center; gap:6px;">
              <span>${p.isBot ? '🤖 ' : ''}${p.name}</span>
              ${isMe ? `<span style="color:var(--btn-brass); font-weight:900; font-size:0.75rem;">${L.you}</span>` : ''}
            </div>
            <div style="font-size:0.72rem; color:var(--text-muted); font-weight:700;">
              ${L.scoreLabel}: ${p.points || 0}/5
            </div>
          </div>
        </div>
        <div class="sugar-pill-badge">
          🍬 ${sugarsCount} ${L.cupSugars(sugarsCount)}
        </div>
      </div>
    `;
  }).join('');

  const tipText = selectedVerdict === 'DRINK' 
    ? L.drinkTipClean(mySugars) 
    : (selectedVerdict === 'DUMP' 
      ? L.dumpTip 
      : (selectedVerdict === 'SWAP' 
        ? (currentLang === 'tr' ? 'Seçtiğin rakibin fincanını gizlice alır ve içersin! Kendi fincanın ona gider. Oyun boyunca 1 kez kullanılabilir.' : 'You secretly steal and drink their cup! Your cup goes to them. Usable once per game.')
        : (currentLang === 'tr' ? 'Çayını iç, dök veya şüpheleniyorsan fincanını başka biriyle değiştir!' : 'Drink, dump, or secretly swap cups if you suspect poison!')));

  appEl.innerHTML = `
    <div class="app-header">
      <div class="brand-title">${L.round} ${currentRoom.round}</div>
      <div style="display:flex; align-items:center; gap:8px;">
        <div class="room-badge">${L.readyCounter(readyCount, alivePlayers.length)}</div>
        ${renderLangToggle()}
      </div>
    </div>

    ${renderInventoryBar(me, L)}

    <!-- Table Cups Reveal Card -->
    <div class="card" style="padding:14px;">
      <div style="display:flex; align-items:center; gap:6px; margin-bottom:2px;">
        <span style="font-size:1.2rem;">☕</span>
        <span class="input-label" style="margin:0; color:var(--btn-espresso);">${L.phase2Title}</span>
      </div>
      <p style="font-size:0.8rem; color:var(--text-muted); font-weight:600; margin-bottom:10px; line-height:1.35;">
        ${L.phase2Desc}
      </p>

      <div class="table-cups-grid">
        ${cupsHtml}
      </div>
    </div>

    <!-- Your Verdict Card -->
    <div class="card" style="text-align:center; padding:16px 14px;">
      <h3 style="font-weight:900; font-size:1.15rem; color:var(--btn-espresso); margin-bottom:4px;">
        ${L.cupSugarsMe(mySugars)}
      </h3>
      <p style="font-size:0.8rem; color:var(--text-muted); font-weight:700; margin-bottom:14px;">
        ${L.verdictTitle}
      </p>

      <div class="grid-2">
        <button class="btn btn-neutral ${selectedVerdict === 'DRINK' ? 'selected' : ''}" id="btnVerdictDrink" style="padding:14px 8px;">
          ${L.drinkBtn}
        </button>
        <button class="btn btn-neutral ${selectedVerdict === 'DUMP' ? 'selected' : ''}" id="btnVerdictDump" style="padding:14px 8px;">
          ${L.dumpBtn}
        </button>
      </div>

      <button class="btn btn-neutral ${selectedVerdict === 'SWAP' ? 'selected' : ''} ${!hasSwap ? 'btn-disabled' : ''}" id="btnVerdictSwap" style="width:100%; margin-top:8px; padding:12px 8px; font-weight:800;" ${!hasSwap ? 'disabled' : ''}>
        ${L.swapBtn(me.swapsLeft ?? 1)}
      </button>

      ${selectedVerdict === 'SWAP' ? `
        <div style="margin-top:12px; text-align:left; background:var(--bg-parchment); border:1.5px solid var(--border-strong); border-radius:10px; padding:10px;">
          <div style="font-weight:900; font-size:0.85rem; color:var(--btn-espresso); margin-bottom:2px;">
            ${L.swapTargetTitle}
          </div>
          <p style="font-size:0.75rem; color:var(--text-muted); font-weight:600; margin-bottom:8px; line-height:1.3;">
            ${L.swapTargetSub}
          </p>
          <div style="display:flex; flex-direction:column; gap:6px;">
            ${swapOpponents.map(opp => {
              const oppSugars = opp.roundSugars ? (opp.roundSugars.total || 0) : 0;
              const isSelected = selectedSwapTarget === opp.id;
              return `
                <div class="target-card ${isSelected ? 'selected' : ''}" data-swap-target-id="${opp.id}" style="display:flex; justify-content:space-between; align-items:center; padding:8px 12px; cursor:pointer;">
                  <div style="display:flex; align-items:center; gap:8px;">
                    <span style="font-size:1.2rem;">☕</span>
                    <div>
                      <div style="font-weight:800; font-size:0.85rem; color:var(--text-main);">
                        ${opp.isBot ? '🤖 ' : ''}${opp.name}
                      </div>
                      <div style="font-size:0.7rem; color:var(--text-muted); font-weight:600;">
                        ${L.scoreLabel}: ${opp.points || 0}/5
                      </div>
                    </div>
                  </div>
                  <div class="sugar-pill-badge" style="margin:0; font-size:0.75rem;">
                    🍬 ${oppSugars} ${L.cupSugars(oppSugars)}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      ` : ''}

      <p style="font-size:0.75rem; color:var(--text-muted); line-height:1.35; font-weight:600; margin-top:8px;">
        ${tipText}
      </p>
    </div>

    <div style="margin-top:auto; padding-top:10px; display:flex; flex-direction:column; gap:8px;">
      <button class="btn btn-primary ${me.ready ? 'btn-disabled' : ''}" id="btnConfirmVerdict" ${me.ready ? 'disabled' : ''}>
        ${me.ready ? `⏳ ${L.waitingOthers(readyCount, alivePlayers.length)}` : L.confirmVerdict}
      </button>

      ${me.isHost ? `
        <button class="btn btn-neutral" id="btnHostForcePhase3" style="border-color:var(--border-strong); font-size:0.85rem;">
          ${L.revealResultsHost}
        </button>
      ` : ''}
    </div>
  `;

  attachLangEvents();

  document.getElementById('btnVerdictDrink').onclick = () => {
    selectedVerdict = 'DRINK';
    renderPhase2();
  };

  document.getElementById('btnVerdictDump').onclick = () => {
    selectedVerdict = 'DUMP';
    renderPhase2();
  };

  const btnSwap = document.getElementById('btnVerdictSwap');
  if (btnSwap) {
    btnSwap.onclick = () => {
      if (!hasSwap) return;
      selectedVerdict = 'SWAP';
      if (!selectedSwapTarget && swapOpponents.length > 0) {
        selectedSwapTarget = swapOpponents[0].id;
      }
      renderPhase2();
    };
  }

  document.querySelectorAll('[data-swap-target-id]').forEach(el => {
    el.onclick = () => {
      selectedSwapTarget = el.getAttribute('data-swap-target-id');
      renderPhase2();
    };
  });

  document.getElementById('btnConfirmVerdict').onclick = async () => {
    if (!selectedVerdict) {
      return alert(currentLang === 'tr' ? "Lütfen bir karar ver (İç, Dök veya Değiştir)!" : "Please choose an action (Drink, Dump, or Swap)!");
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
      const finalVerdict = (selectedVerdict === 'SWAP') ? `SWAP:${selectedSwapTarget}` : selectedVerdict;
      await submitVerdict(currentRoom.code, myPlayerId, finalVerdict);
    } catch (err) {
      alert(err.message);
    }
  };

  if (me.isHost) {
    document.getElementById('btnHostForcePhase3').onclick = async () => {
      await advanceToPhase3(currentRoom.code, currentRoom);
    };
  }
}

// -------------------------------------------------------------------
// 5. PHASE 3: SONUÇ, PUANLAR VE ELEMELER (RELIEF & REGRET)
// -------------------------------------------------------------------
function renderPhase3() {
  const L = getL();
  const me = currentRoom.players[myPlayerId];
  const logs = currentRoom.roundLogs || [];
  const allPlayers = Object.values(currentRoom.players || {});

  // Play audio once
  if (!hasPlayedPhase3Sound) {
    hasPlayedPhase3Sound = true;
    if (!me.alive) {
      playDeathBell();
    } else if (me.autoPillUsed) {
      playPillSound();
    } else if (me.lastDrank) {
      playSipSound();
    }
  }

  // Personal Result Banner Card
  let resultBannerHtml = '';
  if (!me.alive) {
    resultBannerHtml = `
      <div class="death-card">
        <div style="margin-bottom:8px;">${ICONS.skull}</div>
        <h2 style="font-size:1.8rem; font-weight:900; color:var(--btn-crimson); margin-bottom:6px;">
          ${L.eliminatedTitle}
        </h2>
        <p style="font-size:1.1rem; font-weight:800; color:var(--text-main); margin-bottom:8px;">
          ${L.fondipDrink}
        </p>
        <p style="font-size:0.8rem; font-weight:600; color:var(--text-muted);">
          ${L.deadDesc}
        </p>
      </div>
    `;
  } else if (me.autoPillUsed) {
    resultBannerHtml = `
      <div class="card" style="text-align:center; border-color:var(--btn-brass); background:rgba(212,175,55,0.08); padding:16px;">
        <div style="font-size:2.2rem; margin-bottom:4px;">💊</div>
        <h2 style="font-size:1.35rem; font-weight:900; color:var(--btn-brass); margin-bottom:6px;">
          ${L.autoPillTitle}
        </h2>
        <p style="font-size:0.85rem; font-weight:700; color:var(--text-main); line-height:1.4;">
          ${L.autoPillDesc(me.pointsLostThisRound || 0)}
        </p>
      </div>
    `;
  } else if (me.lastDrank) {
    const earned = me.pointsEarnedThisRound || 0;
    resultBannerHtml = `
      <div class="card" style="text-align:center; border-color:var(--btn-poison); background:rgba(30,94,57,0.05); padding:16px;">
        <div style="font-size:2rem; margin-bottom:4px;">🍬</div>
        <h2 style="font-size:1.4rem; font-weight:900; color:var(--btn-poison); margin-bottom:6px;">
          ${L.survivedTitleClean(earned)}
        </h2>
        <p style="font-size:0.82rem; font-weight:700; color:var(--text-muted); line-height:1.4;">
          ${earned > 0 ? L.survivedCleanSub : (currentLang === 'tr' ? 'Boş çayı içtin, güvendesin.' : 'You drank an empty cup, you are safe.')}
        </p>
      </div>
    `;
  } else {
    // DUMPED TEA: Relief or Regret feedback!
    if (me.dumpedWasPoisoned) {
      resultBannerHtml = `
        <div class="banner-relief">
          <div style="font-size:2.2rem; margin-bottom:4px;">😮‍💨 🛡️</div>
          <h2 style="font-size:1.4rem; font-weight:900; color:#1e5e39; margin-bottom:6px;">
            ${L.dumpReliefTitle}
          </h2>
          <p style="font-size:0.85rem; font-weight:700; color:var(--text-main); line-height:1.4;">
            ${L.dumpReliefDesc}
          </p>
        </div>
      `;
    } else {
      resultBannerHtml = `
        <div class="banner-regret">
          <div style="font-size:2.2rem; margin-bottom:4px;">🤦‍♂️ 🫗</div>
          <h2 style="font-size:1.4rem; font-weight:900; color:#b35a0f; margin-bottom:6px;">
            ${L.dumpRegretTitle}
          </h2>
          <p style="font-size:0.85rem; font-weight:700; color:var(--text-main); line-height:1.4;">
            ${L.dumpRegretDesc(me.dumpedSweetCount || 0)}
          </p>
        </div>
      `;
    }
  }

  // Cup Swap Banner (Awarded/shown if you swapped cups this round)
  let swapBannerHtml = '';
  if (me.swappedThisRound) {
    swapBannerHtml = `
      <div class="card" style="text-align:center; border-color:var(--btn-brass); background:rgba(212,175,55,0.08); padding:16px; margin-bottom:12px;">
        <div style="font-size:2.2rem; margin-bottom:4px;">🔄 ☕</div>
        <h2 style="font-size:1.35rem; font-weight:900; color:var(--btn-brass); margin-bottom:4px;">
          ${L.swapBannerTitle}
        </h2>
        <p style="font-size:0.85rem; font-weight:700; color:var(--text-main); line-height:1.4;">
          ${L.swapBannerSub(me.swappedThisRound.targetName)}
        </p>
      </div>
    `;
  }

  // Kill Bounty Banner (Awarded if you eliminated someone with cyanide this round)
  let killBountyHtml = '';
  if (me.killsThisRound > 0) {
    killBountyHtml = `
      <div class="card" style="text-align:center; border-color:var(--btn-crimson); background:rgba(184,51,42,0.08); padding:16px; margin-bottom:12px;">
        <div style="font-size:2.2rem; margin-bottom:4px;">🎯 ☠️</div>
        <h2 style="font-size:1.35rem; font-weight:900; color:var(--btn-crimson); margin-bottom:4px;">
          ${L.killBountyBanner(me.killsThisRound)}
        </h2>
        <p style="font-size:0.85rem; font-weight:700; color:var(--text-main); line-height:1.4;">
          ${L.killBountySub}
        </p>
      </div>
    `;
  }

  // Poison Hit Banner (Awarded if your cyanide was drunk by an opponent and their pill activated)
  let poisonHitHtml = '';
  if (me.poisonHitsThisRound > 0 && me.killsThisRound === 0) {
    poisonHitHtml = `
      <div class="card" style="text-align:center; border-color:var(--btn-poison); background:rgba(30,94,57,0.08); padding:16px; margin-bottom:12px;">
        <div style="font-size:2.2rem; margin-bottom:4px;">🎯 💊</div>
        <h2 style="font-size:1.35rem; font-weight:900; color:var(--btn-poison); margin-bottom:4px;">
          ${L.poisonHitBanner(me.poisonHitsThisRound)}
        </h2>
        <p style="font-size:0.85rem; font-weight:700; color:var(--text-main); line-height:1.4;">
          ${L.poisonHitSub}
        </p>
      </div>
    `;
  }

  // Leaderboard Sorted by Points
  const sortedPlayers = [...allPlayers].sort((a, b) => (b.points || 0) - (a.points || 0));
  const leaderboardHtml = sortedPlayers.map((p, idx) => {
    const pct = Math.min(100, Math.round(((p.points || 0) / 5) * 100));
    return `
      <div style="margin-bottom:8px; padding:6px 10px; background:var(--bg-parchment); border:1px solid var(--border-subtle); border-radius:8px;">
        <div style="display:flex; justify-content:space-between; align-items:center; font-weight:800; font-size:0.85rem;">
          <span style="display:flex; align-items:center; gap:6px;">
            <span style="color:var(--text-muted); font-size:0.75rem;">#${idx + 1}</span>
            <span>${p.isBot ? '🤖 ' : ''}${p.name} ${p.id === myPlayerId ? `<span style="color:var(--btn-brass); font-weight:800;">${L.you}</span>` : ''}</span>
            ${!p.alive ? '<span style="color:var(--btn-crimson); font-size:0.75rem;">☠️ ÖLÜ</span>' : ''}
          </span>
          <span style="color:var(--btn-espresso); font-weight:900;">
            ${p.points || 0} / 5 🍬
          </span>
        </div>
        <div style="width:100%; height:6px; background:#e0d7c7; border-radius:3px; margin-top:4px; overflow:hidden;">
          <div style="width:${pct}%; height:100%; background:var(--btn-brass); border-radius:3px;"></div>
        </div>
      </div>
    `;
  }).join('');

  // Round Events List
  let formattedLogs = [];
  if (!logs || logs.length === 0) {
    formattedLogs.push(L.noEventsRound);
  } else {
    for (const l of logs) {
      if (typeof l === 'string') {
        formattedLogs.push(l);
      } else if (l && l.type) {
        if (l.type === 'CUP_SWAP') {
          formattedLogs.push(L.logCupSwap(l.actor, l.target));
        } else if (l.type === 'DEATH') {
          if (l.killers && l.killers.length === 1) {
            formattedLogs.push(L.logDeathWithKiller(l.name, l.killers[0]));
          } else if (l.killers && l.killers.length > 1) {
            formattedLogs.push(L.logDeathMultiKillers(l.name, l.killers));
          } else {
            formattedLogs.push(L.logDeath(l.name));
          }
        } else if (l.type === 'POISONED_PILL') {
          if (l.killers && l.killers.length > 0) {
            formattedLogs.push(L.logPillWithKiller(l.name, l.killers.join(', '), l.pointsLost || 0));
          } else {
            formattedLogs.push(L.logPill(l.name, l.pointsLost || 0));
          }
        } else if (l.type === 'DRINK_CLEAN') {
          formattedLogs.push(L.logDrinkClean(l.name, l.pointsEarned || 0));
        } else if (l.type === 'DUMP') {
          if (l.wasPoisoned) {
            formattedLogs.push(L.logDumpRelief(l.name));
          } else {
            formattedLogs.push(L.logDumpRegret(l.name));
          }
        } else if (l.type === 'WINNER_POINTS') {
          formattedLogs.push(L.logWinnerPoints(l.winner, l.points));
        } else if (l.type === 'WINNER_LAST_SURVIVOR') {
          formattedLogs.push(L.logWinnerSurvivor(l.winner));
        } else if (l.type === 'MUTUAL_DEATH') {
          formattedLogs.push(`🍻 ${L.gameOverMutualDesc}`);
        }
      }
    }
  }

  const logItems = formattedLogs.map(text => `
    <li style="margin-bottom:6px; font-weight:600; padding-bottom:4px; border-bottom:1px dashed var(--border-subtle); font-size:0.82rem;">
      ${text}
    </li>
  `).join('');

  appEl.innerHTML = `
    <div class="app-header">
      <div class="brand-title">${L.round} ${currentRoom.round} ${L.resultsTitle}</div>
      ${renderLangToggle()}
    </div>

    ${renderInventoryBar(me, L)}

    ${swapBannerHtml}
    ${resultBannerHtml}
    ${killBountyHtml}
    ${poisonHitHtml}

    <!-- Leaderboard -->
    <div class="card">
      <span class="input-label">${L.leaderboardTitle}</span>
      <div style="margin-top:8px;">
        ${leaderboardHtml}
      </div>
    </div>

    <!-- Round Events -->
    <div class="card">
      <span class="input-label">${L.roundEvents}</span>
      <ul style="list-style-type:none; font-size:0.85rem; color:var(--text-main); margin-top:8px; padding:0;">
        ${logItems}
      </ul>
    </div>

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
      selectedDropType = 'SWEET';
      selectedDropTarget = null;
      selectedVerdict = null;
      selectedSwapTarget = null;
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
            ${hasPoison ? `☠️ ${sugars} Şeker (Siyanürlü!)` : `🍬 ${sugars} Şeker (Temiz)`}
          </span>
          <span style="font-size:0.75rem; font-weight:900; color:var(--btn-brass);">
            ${p.points || 0}/5 Puan
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
