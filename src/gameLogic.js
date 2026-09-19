// Core Game Engine for Cup of Tea: "Siyanür Küpü" (Sugar & Cyanide)
import { DB } from './firebaseConfig.js';
import { auditorAgent } from './telemetryAuditor.js';

export function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function createRoom(hostName) {
  const roomCode = generateRoomCode();
  const hostId = 'p_' + Math.random().toString(36).substr(2, 9);
  
  const initialRoom = {
    code: roomCode,
    hostId: hostId,
    status: 'LOBBY',
    round: 1,
    targetPoints: 8,
    players: {
      [hostId]: {
        id: hostId,
        name: hostName,
        isHost: true,
        isBot: false,
        alive: true,
        points: 0,
        pill: 1,
        cyanide: 1,
        swapsLeft: 1,
        ready: false,
        dropAction: null,
        verdict: null,
        roundSugars: { sweet: 0, cyanide: 0, total: 0 },
        autoPillUsed: false,
        lastDrank: null,
        pointsEarnedThisRound: 0
      }
    },
    roundLogs: [],
    detailedLogs: [],
    winner: null
  };

  await DB.set(`rooms/${roomCode}`, initialRoom);
  return { roomCode, playerId: hostId };
}

export async function joinRoom(roomCode, playerName) {
  const cleanCode = roomCode.trim().toUpperCase();
  const room = await DB.get(`rooms/${cleanCode}`);
  
  if (!room) {
    throw new Error("Oda bulunamadı! Kodu kontrol edin.");
  }
  if (room.status !== 'LOBBY') {
    throw new Error("Oyun çoktan başlamış!");
  }

  const cleanName = playerName.trim();
  const existingNames = Object.values(room.players || {}).map(p => (p.name || '').trim().toLowerCase());
  if (existingNames.includes(cleanName.toLowerCase())) {
    throw new Error("DUPLICATE_NAME");
  }
  
  const playerId = 'p_' + Math.random().toString(36).substr(2, 9);
  const playerObj = {
    id: playerId,
    name: cleanName,
    isHost: false,
    isBot: false,
    alive: true,
    points: 0,
    pill: 1,
    cyanide: 1,
    swapsLeft: 1,
    ready: false,
    dropAction: null,
    verdict: null,
    roundSugars: { sweet: 0, cyanide: 0, total: 0 },
    autoPillUsed: false,
    lastDrank: null,
    pointsEarnedThisRound: 0
  };

  await DB.set(`rooms/${cleanCode}/players/${playerId}`, playerObj);
  return { roomCode: cleanCode, playerId };
}

export async function kickPlayer(roomCode, targetPlayerId) {
  await DB.remove(`rooms/${roomCode}/players/${targetPlayerId}`);
}

export async function startGame(roomCode) {
  const room = await DB.get(`rooms/${roomCode}`);
  if (!room) return;
  
  const playerIds = Object.keys(room.players || {});
  if (playerIds.length < 2) {
    throw new Error("En az 2 oyuncu gereklidir!");
  }

  const players = JSON.parse(JSON.stringify(room.players));
  for (const pid of playerIds) {
    players[pid].alive = true;
    players[pid].points = 0;
    players[pid].pill = 1;
    players[pid].cyanide = 1;
    players[pid].swapsLeft = 1;
    players[pid].ready = false;
    players[pid].dropAction = null;
    players[pid].verdict = null;
    players[pid].roundSugars = { sweet: 0, cyanide: 0, total: 0 };
    players[pid].autoPillUsed = false;
    players[pid].lastDrank = null;
    players[pid].pointsEarnedThisRound = 0;
    players[pid].killsThisRound = 0;
  }

  await DB.update(`rooms/${roomCode}`, {
    status: 'PHASE_1',
    round: 1,
    roundLogs: [],
    detailedLogs: [],
    winner: null,
    players: players,
    currentModifier: null,
    lastPoisonEvent: null
  });

  auditorAgent.init(roomCode);
  auditorAgent.setPhase('PHASE_1', 1);
}

// -------------------------------------------------------------------
// 1. ADIM: ŞEKER ATMA (GİZLİ ENTRİKA)
// -------------------------------------------------------------------

export async function submitDropAction(roomCode, playerId, actionChoice) {
  if (actionChoice.target === playerId) {
    throw new Error("Kendi fincanına şeker atamazsın! Başka bir oyuncunun fincanını seçmelisin.");
  }

  await DB.update(`rooms/${roomCode}/players/${playerId}`, {
    dropAction: actionChoice,
    ready: true
  });

  const latestRoom = await DB.get(`rooms/${roomCode}`);
  if (latestRoom) {
    await checkPhase1Completion(roomCode, latestRoom);
  }
}

export async function checkPhase1Completion(roomCode, room) {
  if (!room || room.status !== 'PHASE_1') return;
  const alivePlayers = Object.values(room.players || {}).filter(p => p.alive);
  const allReady = alivePlayers.length > 0 && alivePlayers.every(p => p.ready && p.dropAction);
  if (allReady) {
    await advanceToPhase2(roomCode, room);
  }
}

export async function advanceToPhase2(roomCode, room) {
  if (!room) {
    room = await DB.get(`rooms/${roomCode}`);
  }
  if (!room || room.status !== 'PHASE_1') return;

  auditorAgent.setPhase('PHASE_2', room.round);

  const players = JSON.parse(JSON.stringify(room.players || {}));
  const newDetailed = [...(room.detailedLogs || [])];

  // Initialize sugar counters for all alive players
  for (const p of Object.values(players)) {
    p.roundSugars = { sweet: 0, cyanide: 0, total: 0 };
    p.ready = false;
    p.verdict = null;
  }

  // Distribute sugars
  for (const p of Object.values(players)) {
    if (!p.alive || !p.dropAction) continue;
    const act = p.dropAction;
    const target = players[act.target];

    if (!target || !target.alive) continue;

    if (act.type === 'CYANIDE') {
      if ((p.cyanide || 0) > 0) {
        target.roundSugars.cyanide += 1;
        target.roundSugars.total += 1;
        target.roundSugars.cyanideSources = target.roundSugars.cyanideSources || [];
        target.roundSugars.cyanideSources.push({ id: p.id, name: p.name });
        p.cyanide -= 1;
        newDetailed.push({
          type: 'DROP_CYANIDE',
          round: room.round,
          actor: p.name,
          actorId: p.id,
          target: target.name,
          targetId: target.id
        });
      } else {
        target.roundSugars.sweet += 1;
        target.roundSugars.total += 1;
        newDetailed.push({
          type: 'DROP_SWEET',
          round: room.round,
          actor: p.name,
          actorId: p.id,
          target: target.name,
          targetId: target.id
        });
      }
    } else {
      // SWEET SUGAR
      target.roundSugars.sweet += 1;
      target.roundSugars.total += 1;

      let giftCyanideReloaded = false;
      // Gifting sweet sugar to an opponent adds +1 Cyanide to your stock!
      if (target.id !== p.id) {
        p.cyanide = (p.cyanide || 0) + 1;
        p.cyanideReloadedByGift = true;
        giftCyanideReloaded = true;
      }

      newDetailed.push({
        type: 'DROP_SWEET',
        round: room.round,
        actor: p.name,
        actorId: p.id,
        target: target.name,
        targetId: target.id,
        giftCyanideReloaded
      });
    }
  }

  await DB.update(`rooms/${roomCode}`, {
    status: 'PHASE_2',
    players: players,
    detailedLogs: newDetailed
  });
}

// -------------------------------------------------------------------
// 2. ADIM: ÇAYLAR MASADA & KARAR (İÇ / DÖK)
// -------------------------------------------------------------------

export async function submitVerdict(roomCode, playerId, verdict) {
  const room = await DB.get(`rooms/${roomCode}`);
  if (!room || room.status !== 'PHASE_2') return;

  await DB.update(`rooms/${roomCode}/players/${playerId}`, {
    verdict: verdict,
    ready: true
  });

  const latestRoom = await DB.get(`rooms/${roomCode}`);
  if (latestRoom) {
    await checkPhase2Completion(roomCode, latestRoom);
  }
}

export async function checkPhase2Completion(roomCode, room) {
  if (!room || room.status !== 'PHASE_2') return;
  const alivePlayers = Object.values(room.players || {}).filter(p => p.alive);
  const allReady = alivePlayers.length > 0 && alivePlayers.every(p => p.ready && p.verdict);
  if (allReady) {
    await advanceToPhase3(roomCode, room);
  }
}

// -------------------------------------------------------------------
// 3. ADIM: ÇÖZÜMLEME, PUANLAR, ZEHİR VE ŞAMPİYONLUK
// -------------------------------------------------------------------

export async function advanceToPhase3(roomCode, room) {
  if (!room) {
    room = await DB.get(`rooms/${roomCode}`);
  }
  if (!room || room.status !== 'PHASE_2') return;

  const players = JSON.parse(JSON.stringify(room.players || {}));
  const roundLogs = [];
  const newDetailed = [...(room.detailedLogs || [])];
  const targetGoal = room.targetPoints || 8;

  // Pre-initialize per-round flags so subsequent kill awards aren't wiped out
  for (const p of Object.values(players)) {
    p.autoPillUsed = false;
    p.pointsEarnedThisRound = 0;
    p.pointsLostThisRound = 0;
    p.killsThisRound = 0;
    p.poisonHitsThisRound = 0;
    p.swappedThisRound = null;
    p.dumpedWasPoisoned = false;
    p.dumpedSweetCount = 0;
  }

  // 1. Process Cup Swaps (Fincan Takasları)
  for (const p of Object.values(players)) {
    if (!p.alive || !p.verdict) continue;

    let isSwap = false;
    let targetId = null;

    if (typeof p.verdict === 'object' && p.verdict.type === 'SWAP') {
      isSwap = true;
      targetId = p.verdict.target;
    } else if (typeof p.verdict === 'string' && p.verdict.startsWith('SWAP:')) {
      isSwap = true;
      targetId = p.verdict.split(':')[1];
    }

    if (isSwap && targetId && players[targetId] && players[targetId].alive && targetId !== p.id) {
      if ((p.swapsLeft ?? 1) > 0) {
        const target = players[targetId];

        // Consume 1-time swap
        p.swapsLeft = 0;
        p.swappedThisRound = { targetId: target.id, targetName: target.name };

        // Swap roundSugars between p and target
        const tempSugars = JSON.parse(JSON.stringify(p.roundSugars || { sweet: 0, cyanide: 0, total: 0 }));
        p.roundSugars = JSON.parse(JSON.stringify(target.roundSugars || { sweet: 0, cyanide: 0, total: 0 }));
        target.roundSugars = tempSugars;

        roundLogs.push({
          type: 'CUP_SWAP',
          actor: p.name,
          target: target.name
        });

        newDetailed.push({
          type: 'CUP_SWAP',
          round: room.round,
          actor: p.name,
          actorId: p.id,
          target: target.name,
          targetId: target.id
        });
      }
    }
  }

  for (const p of Object.values(players)) {
    if (!p.alive) continue;

    let drank = false;
    if (p.verdict === 'DRINK') {
      drank = true;
    } else if (typeof p.verdict === 'object' && p.verdict.type === 'SWAP') {
      drank = true;
    } else if (typeof p.verdict === 'string' && p.verdict.startsWith('SWAP:')) {
      drank = true;
    }
    p.lastDrank = drank;

    const sugars = p.roundSugars || { sweet: 0, cyanide: 0, total: 0 };

    if (drank) {
      if (sugars.cyanide > 0) {
        // POISONED!
        if ((p.pill || 0) > 0) {
          p.pill = 0;
          p.autoPillUsed = true;

          // -2 Points Penalty for drinking cyanide!
          const prevPoints = p.points || 0;
          const pointsLost = Math.min(prevPoints, 2);
          p.points = Math.max(0, prevPoints - 2);
          p.pointsLostThisRound = pointsLost;

          // Award +1 Poison Hit Bounty to each poisoner who successfully tricked this player!
          const killers = sugars.cyanideSources || [];
          if (killers.length > 0) {
            p.nemesis = killers[0].name;
          }
          for (const k of killers) {
            if (players[k.id] && k.id !== p.id) {
              players[k.id].points = (players[k.id].points || 0) + 1;
              players[k.id].pointsEarnedThisRound = (players[k.id].pointsEarnedThisRound || 0) + 1;
              players[k.id].poisonHitsThisRound = (players[k.id].poisonHitsThisRound || 0) + 1;
            }
          }

          roundLogs.push({ 
            type: 'POISONED_PILL', 
            name: p.name,
            pointsLost: pointsLost,
            killers: killers.map(k => k.name)
          });
          newDetailed.push({
            type: 'POISONED_PILL',
            round: room.round,
            actor: p.name,
            actorId: p.id,
            pointsLost: pointsLost,
            killers: killers
          });
        } else {
          p.alive = false;
          // Award +2 Kill Bounty to each killer (excluding self-suicide via swap)!
          const killers = sugars.cyanideSources || [];
          if (killers.length > 0) {
            p.nemesis = killers[0].name;
          }
          for (const k of killers) {
            if (players[k.id] && k.id !== p.id) {
              players[k.id].points = (players[k.id].points || 0) + 2;
              players[k.id].pointsEarnedThisRound = (players[k.id].pointsEarnedThisRound || 0) + 2;
              players[k.id].killsThisRound = (players[k.id].killsThisRound || 0) + 1;
            }
          }

          roundLogs.push({ 
            type: 'DEATH', 
            name: p.name,
            killers: killers.map(k => k.name)
          });
          newDetailed.push({
            type: 'DEATH',
            round: room.round,
            actor: p.name,
            actorId: p.id,
            killers: killers
          });
        }
      } else {
        // CLEAN TEA!
        const earned = sugars.total || 0;
        p.points = (p.points || 0) + earned;
        p.pointsEarnedThisRound = earned;

        roundLogs.push({
          type: 'DRINK_CLEAN',
          name: p.name,
          pointsEarned: earned,
          totalPoints: p.points
        });

        newDetailed.push({
          type: 'DRINK_CLEAN',
          round: room.round,
          actor: p.name,
          actorId: p.id,
          pointsEarned: earned,
          totalPoints: p.points
        });
      }
    } else {
      // DUMPED TEA (PAS)
      const wasPoisoned = (sugars.cyanide || 0) > 0;
      const sweetCount = sugars.sweet || 0;
      p.dumpedWasPoisoned = wasPoisoned;
      p.dumpedSweetCount = sweetCount;
      p.autoPillUsed = false;
      p.pointsEarnedThisRound = 0;
      p.pointsLostThisRound = 0;
      p.alive = true;

      roundLogs.push({ 
        type: 'DUMP', 
        name: p.name, 
        wasPoisoned: wasPoisoned, 
        sweetCount: sweetCount 
      });
      newDetailed.push({
        type: 'DUMP',
        round: room.round,
        actor: p.name,
        actorId: p.id,
        wasPoisoned: wasPoisoned,
        sweetCount: sweetCount
      });
    }
  }

  // Check Game Over Conditions
  const aliveRemaining = Object.values(players).filter(p => p.alive);
  let nextStatus = 'PHASE_3';
  let winner = null;

  // 1. Check points victory (5+ Points)
  const pointLeaders = aliveRemaining.filter(p => p.points >= targetGoal);
  if (pointLeaders.length > 0) {
    pointLeaders.sort((a, b) => b.points - a.points);
    winner = pointLeaders[0].name;
    nextStatus = 'GAME_OVER';
    roundLogs.push({ type: 'WINNER_POINTS', winner: winner, points: pointLeaders[0].points });
    newDetailed.push({
      type: 'WINNER',
      round: room.round,
      winner: winner,
      reason: 'POINTS',
      points: pointLeaders[0].points
    });
  } else if (aliveRemaining.length === 1) {
    // 2. Sole survivor victory
    winner = aliveRemaining[0].name;
    nextStatus = 'GAME_OVER';
    roundLogs.push({ type: 'WINNER_SURVIVOR', winner: winner });
    newDetailed.push({
      type: 'WINNER',
      round: room.round,
      winner: winner,
      reason: 'SURVIVOR'
    });
  } else if (aliveRemaining.length === 0) {
    // 3. Mutual death
    winner = 'BERABERE (HERKES ÖLDÜ!)';
    nextStatus = 'GAME_OVER';
    roundLogs.push({ type: 'MUTUAL_DEATH' });
    newDetailed.push({
      type: 'MUTUAL_DEATH',
      round: room.round
    });
  }

  for (const pid of Object.keys(players)) {
    players[pid].ready = false;
  }

  let lastPoisonEvent = null;
  const allPoisonVictims = [];
  for (const p of Object.values(players)) {
    if (p.lastDrank && (p.roundSugars?.cyanide || 0) > 0) {
      const killers = p.roundSugars?.cyanideSources || [];
      const killerName = killers.length > 0 ? killers.map(k => k.name).join(', ') : 'Gizemli Katil';
      allPoisonVictims.push({
        victimName: p.name,
        victimId: p.id,
        killerName: killerName,
        allKillers: killers.map(k => k.name),
        isPillSaved: !!p.autoPillUsed,
        pointsLost: p.pointsLostThisRound ?? (p.autoPillUsed ? 2 : 0),
        bountyAwarded: p.autoPillUsed ? 1 : 2
      });
    }
  }
  if (allPoisonVictims.length > 0) {
    lastPoisonEvent = {
      ...allPoisonVictims[0],
      allVictims: allPoisonVictims
    };
  }

  await DB.update(`rooms/${roomCode}`, {
    status: nextStatus,
    players: players,
    roundLogs: roundLogs,
    detailedLogs: newDetailed,
    winner: winner,
    lastPoisonEvent: lastPoisonEvent
  });

  const deaths = Object.values(players).filter(p => !p.alive && p.lastDrank && (p.roundSugars?.cyanide || 0) > 0 && !p.autoPillUsed);
  const savedByPill = Object.values(players).filter(p => p.autoPillUsed);
  const cleanDrinks = Object.values(players).filter(p => p.lastDrank && (p.roundSugars?.cyanide || 0) === 0);
  const dumps = Object.values(players).filter(p => !p.lastDrank && p.verdict === 'DUMP');
  const swaps = Object.values(players).filter(p => p.swappedThisRound);

  auditorAgent.recordRoundResolution({
    round: room.round,
    deaths: deaths.map(p => p.name),
    savedByPill: savedByPill.map(p => p.name),
    cleanDrinks: cleanDrinks.map(p => p.name),
    dumps: dumps.map(p => p.name),
    swaps: swaps.map(p => `${p.name} ➔ ${p.swappedThisRound.targetName}`)
  });

  auditorAgent.setPhase(nextStatus === 'GAME_OVER' ? 'GAME_OVER' : 'PHASE_3', room.round);
}

export async function nextRound(roomCode) {
  const room = await DB.get(`rooms/${roomCode}`);
  if (!room) return;
  
  const players = JSON.parse(JSON.stringify(room.players || {}));
  const detailed = [...(room.detailedLogs || [])];

  for (const pid of Object.keys(players)) {
    players[pid].ready = false;
    players[pid].dropAction = null;
    players[pid].verdict = null;
    players[pid].roundSugars = { sweet: 0, cyanide: 0, total: 0 };
    players[pid].autoPillUsed = false;
    players[pid].lastDrank = null;
    players[pid].pointsEarnedThisRound = 0;
    players[pid].dumpedWasPoisoned = false;
    players[pid].dumpedSweetCount = 0;
    players[pid].cyanideReloadedByGift = false;
    players[pid].killsThisRound = 0;
    players[pid].poisonHitsThisRound = 0;
    players[pid].pointsLostThisRound = 0;
    players[pid].swappedThisRound = null;
  }

  const nextRoundNum = (room.round || 1) + 1;
  // 25% chance to draw Blind Tasting starting from round 2 (balanced for deduction)
  const modifier = (nextRoundNum >= 2 && Math.random() < 0.25) ? 'BLIND_TASTING' : null;

  await DB.update(`rooms/${roomCode}`, {
    status: 'PHASE_1',
    round: nextRoundNum,
    players: players,
    detailedLogs: detailed,
    currentModifier: modifier,
    lastPoisonEvent: null
  });

  auditorAgent.setPhase('PHASE_1', nextRoundNum);
}

export async function rematch(roomCode) {
  const room = await DB.get(`rooms/${roomCode}`);
  if (!room) return;
  const players = JSON.parse(JSON.stringify(room.players || {}));
  for (const pid of Object.keys(players)) {
    players[pid].alive = true;
    players[pid].points = 0;
    players[pid].pill = 1;
    players[pid].cyanide = 1;
    players[pid].swapsLeft = 1;
    players[pid].ready = false;
    players[pid].dropAction = null;
    players[pid].verdict = null;
    players[pid].roundSugars = { sweet: 0, cyanide: 0, total: 0 };
    players[pid].autoPillUsed = false;
    players[pid].lastDrank = null;
    players[pid].pointsEarnedThisRound = 0;
  }
  await DB.update(`rooms/${roomCode}`, {
    status: 'PHASE_1',
    round: 1,
    roundLogs: [],
    detailedLogs: [],
    winner: null,
    players: players,
    currentModifier: null,
    lastPoisonEvent: null
  });
}

