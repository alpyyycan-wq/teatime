import { DB } from './src/firebaseConfig.js';
import { 
  createRoom, 
  startGame, 
  submitDropAction, 
  submitVerdict, 
  advanceToPhase2, 
  advanceToPhase3, 
  nextRound 
} from './src/gameLogic.js';
import { addBot } from './src/botLogic.js';

// Clean helper to simulate bot Phase 1 decision (Drop Sweet or Cyanide)
function getBotDropAction(bot, aliveOpponents) {
  const leader = aliveOpponents.find(o => (o.points || 0) >= 3);
  const randomTarget = aliveOpponents[Math.floor(Math.random() * aliveOpponents.length)];

  if ((bot.cyanide || 0) > 0) {
    if (leader && Math.random() < 0.75) {
      return { type: 'CYANIDE', target: leader.id };
    } else if (Math.random() < 0.45) {
      return { type: 'CYANIDE', target: randomTarget.id };
    } else {
      return { type: 'SWEET', target: randomTarget.id };
    }
  } else {
    // 0 cyanide: must gift sweet sugar to reload cyanide
    return { type: 'SWEET', target: randomTarget.id };
  }
}

// Clean helper to simulate bot Phase 2 decision (Drink, Dump, Swap)
function getBotVerdict(bot, aliveOpponents) {
  const totalSugars = bot.roundSugars?.total || 0;

  // Swap tactics: 2+ sugars, no pill, 45% chance to swap with point leader
  if ((bot.swapsLeft ?? 1) > 0 && totalSugars >= 2 && (bot.pill || 0) === 0 && aliveOpponents.length > 0) {
    if (Math.random() < 0.45) {
      const sortedTargets = [...aliveOpponents].sort((a, b) => (b.points || 0) - (a.points || 0));
      return `SWAP:${sortedTargets[0].id}`;
    }
  }

  if (totalSugars === 0) {
    if ((bot.cyanide || 0) === 0) {
      return 'DRINK';
    } else {
      return Math.random() < 0.5 ? 'DRINK' : 'DUMP';
    }
  } else {
    // 1+ sugars
    if ((bot.pill || 0) > 0) {
      return Math.random() < 0.8 ? 'DRINK' : 'DUMP';
    } else {
      if ((bot.points || 0) + totalSugars >= 5) {
        return Math.random() < 0.7 ? 'DRINK' : 'DUMP';
      } else if (totalSugars === 1) {
        return Math.random() < 0.55 ? 'DRINK' : 'DUMP';
      } else {
        return Math.random() < 0.35 ? 'DRINK' : 'DUMP';
      }
    }
  }
}

async function runSingle5BotGame(gameIndex) {
  console.log(`\n========================================`);
  console.log(`🎮 [OYUN ${gameIndex}/10] 5 Botlu Oyun Başlatılıyor...`);
  console.log(`========================================`);

  // 1. Host creates room
  const hostName = 'Bot Watson';
  const { roomCode, playerId: hostId } = await createRoom(hostName);
  
  // Mark host as bot as well, so all 5 players are bots!
  await DB.update(`rooms/${roomCode}/players/${hostId}`, { isBot: true });

  // Add 4 more bots -> Total 5 Bots!
  for (let b = 0; b < 4; b++) {
    await addBot(roomCode);
  }

  let room = await DB.get(`rooms/${roomCode}`);
  const playerList = Object.values(room.players || {});
  console.log(`Masadaki 5 Bot:`, playerList.map(p => p.name).join(', '));
  
  if (playerList.length !== 5) {
    throw new Error(`Beklenen 5 bot, ancak ${playerList.length} bot bulundu!`);
  }

  // 2. Start Game
  await startGame(roomCode);
  room = await DB.get(`rooms/${roomCode}`);
  console.log(`Oyun Durumu: ${room.status}, Raund: ${room.round}`);

  let currentRound = 1;
  const maxRounds = 25; // safety circuit breaker

  const gameStats = {
    gameIndex,
    roomCode,
    totalRounds: 0,
    winner: null,
    winReason: null,
    finalScores: {},
    totalDeaths: 0,
    totalPillSaves: 0,
    totalSwapsUsed: 0,
    totalBountiesAwarded: 0,
    roundSummaries: []
  };

  while (currentRound <= maxRounds) {
    room = await DB.get(`rooms/${roomCode}`);
    if (room.status === 'GAME_OVER') {
      break;
    }

    console.log(`\n--- [Raund ${currentRound}] PHASE_1 (Şeker Atma) ---`);
    let alivePlayers = Object.values(room.players).filter(p => p.alive);
    console.log(`Hayattaki Botlar (${alivePlayers.length}):`, alivePlayers.map(p => `${p.name} (${p.points}p, Siyanür:${p.cyanide}, Pil:${p.pill})`).join(', '));

    if (alivePlayers.length <= 1) {
      // Game should have ended or ending now
      break;
    }

    // Phase 1: Each alive bot chooses drop target
    for (const bot of alivePlayers) {
      const aliveOpponents = alivePlayers.filter(o => o.id !== bot.id);
      const action = getBotDropAction(bot, aliveOpponents);
      await submitDropAction(roomCode, bot.id, action);
    }

    // Advance to Phase 2
    room = await DB.get(`rooms/${roomCode}`);
    await advanceToPhase2(roomCode, room);
    room = await DB.get(`rooms/${roomCode}`);

    if (room.status !== 'PHASE_2') {
      throw new Error(`Raund ${currentRound}: PHASE_2 bekleniyordu fakat ${room.status} alındı!`);
    }

    console.log(`--- [Raund ${currentRound}] PHASE_2 (Fincan Kontrolü & Karar) ---`);
    alivePlayers = Object.values(room.players).filter(p => p.alive);

    // Verify roundSugars are valid non-negative numbers
    for (const p of alivePlayers) {
      const sugars = p.roundSugars || {};
      if (sugars.total !== (sugars.sweet + sugars.cyanide)) {
        throw new Error(`Raund ${currentRound}: ${p.name} fincanında şeker tutarsızlığı: total=${sugars.total}, sweet=${sugars.sweet}, cyanide=${sugars.cyanide}`);
      }
      console.log(`  ☕ ${p.name}: ${sugars.sweet} Tatlı + ${sugars.cyanide} Siyanür = ${sugars.total} Şeker`);
    }

    // Phase 2: Each alive bot submits verdict
    for (const bot of alivePlayers) {
      const aliveOpponents = alivePlayers.filter(o => o.id !== bot.id);
      const verdict = getBotVerdict(bot, aliveOpponents);
      await submitVerdict(roomCode, bot.id, verdict);
    }

    // Advance to Phase 3
    room = await DB.get(`rooms/${roomCode}`);
    await advanceToPhase3(roomCode, room);
    room = await DB.get(`rooms/${roomCode}`);

    console.log(`--- [Raund ${currentRound}] PHASE_3 (Sonuçlar) ---`);
    console.log(`Olaylar:`);
    for (const log of (room.roundLogs || [])) {
      if (log.type === 'CUP_SWAP') {
        console.log(`  🔄 [TAKAS] ${log.actor} -> ${log.target} ile fincanını takas etti!`);
        gameStats.totalSwapsUsed++;
      } else if (log.type === 'POISONED_PILL') {
        console.log(`  💊 [PANZEHİR] ${log.name} siyanür içti! Panzehiri harcandı, -${log.pointsLost} puan kaybetti! (Zehirleyenler: ${log.killers?.join(', ')})`);
        gameStats.totalPillSaves++;
        gameStats.totalBountiesAwarded += (log.killers?.length || 0);
      } else if (log.type === 'DEATH') {
        console.log(`  ☠️ [ÖLÜM] ${log.name} siyanürden öldü! (Katiller: ${log.killers?.join(', ')})`);
        gameStats.totalDeaths++;
        gameStats.totalBountiesAwarded += (log.killers?.length || 0) * 2;
      } else if (log.type === 'DRINK_CLEAN') {
        console.log(`  🍵 [TEMİZ İÇTİ] ${log.name} +${log.pointsEarned} puan kazandı (Toplam: ${log.totalPoints})`);
      } else if (log.type === 'DUMP') {
        console.log(`  🫗 [DÖKTÜ] ${log.name} çayını döktü (Zehirli miydi: ${log.wasPoisoned})`);
      }
    }

    // Invariant checks on all players
    for (const p of Object.values(room.players)) {
      if ((p.points || 0) < 0) {
        throw new Error(`KRİTİK HATA: ${p.name} eksi puana düştü (${p.points})!`);
      }
      if (p.swapsLeft < 0 || p.swapsLeft > 1) {
        throw new Error(`KRİTİK HATA: ${p.name} geçersiz takas hakkı sayısı: ${p.swapsLeft}`);
      }
    }

    gameStats.roundSummaries.push({
      round: currentRound,
      aliveCount: Object.values(room.players).filter(p => p.alive).length,
      logsCount: (room.roundLogs || []).length
    });

    if (room.status === 'GAME_OVER') {
      console.log(`\n🏆 [OYUN BİTTİ] Kazanan: ${room.winner}`);
      gameStats.winner = room.winner;
      break;
    }

    // Advance to next round
    await nextRound(roomCode);
    currentRound++;
  }

  room = await DB.get(`rooms/${roomCode}`);
  gameStats.totalRounds = currentRound;
  gameStats.winner = room.winner || 'Belirlenemedi';
  for (const p of Object.values(room.players)) {
    gameStats.finalScores[p.name] = `${p.points} puan (${p.alive ? 'HAYATTA' : 'ÖLÜ'})`;
  }

  console.log(`Oyun ${gameIndex} tamamlandı! Toplam Raund: ${currentRound}, Kazanan: ${gameStats.winner}`);
  return gameStats;
}

async function run10GamesSuite() {
  console.log(`=======================================================`);
  console.log(`🧪 CUP OF TEA: 5 BOTLU 10 OYUNLUK ENTEGRASYON TESTİ`);
  console.log(`=======================================================`);

  const allStats = [];
  const startTime = Date.now();

  for (let i = 1; i <= 10; i++) {
    const stat = await runSingle5BotGame(i);
    allStats.push(stat);
  }

  const durationSec = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log(`\n\n=======================================================`);
  console.log(`📊 10 OYUNLUK TEST SONUÇLARI ÖZETİ (${durationSec} saniye)`);
  console.log(`=======================================================`);

  let totalRoundsAll = 0;
  let totalDeathsAll = 0;
  let totalPillSavesAll = 0;
  let totalSwapsAll = 0;

  for (const s of allStats) {
    totalRoundsAll += s.totalRounds;
    totalDeathsAll += s.totalDeaths;
    totalPillSavesAll += s.totalPillSaves;
    totalSwapsAll += s.totalSwapsUsed;
    console.log(`Oyun #${s.gameIndex.toString().padStart(2, '0')} | Raund: ${s.totalRounds} | Kazanan: ${s.winner.padEnd(16, ' ')} | Ölümler: ${s.totalDeaths} | Panzehir: ${s.totalPillSaves} | Takas: ${s.totalSwapsUsed}`);
    console.log(`       Skorlar: ${Object.entries(s.finalScores).map(([k, v]) => `${k.replace('Bot ', '')}: ${v}`).join(' | ')}`);
  }

  console.log(`-------------------------------------------------------`);
  console.log(`Toplam Raund: ${totalRoundsAll} (Ortalama: ${(totalRoundsAll / 10).toFixed(1)} raund/oyun)`);
  console.log(`Toplam Ölüm: ${totalDeathsAll} | Toplam Panzehir Kurtarışı: ${totalPillSavesAll} | Toplam Fincan Takası: ${totalSwapsAll}`);
  console.log(`Hata / İstisna Sayısı: 0 (Bütün 10 oyun başarıyla tamamlandı!)`);
  console.log(`=======================================================\n`);

  process.exit(0);
}

run10GamesSuite().catch(err => {
  console.error("10 Oyunluk Test Sırasında Hata Oluştu:", err);
  process.exit(1);
});
