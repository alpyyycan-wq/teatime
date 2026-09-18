// Core Game Engine for Cup of Tea (Timer-free, party-paced, zero Firebase path conflicts)
import { DB } from './firebaseConfig.js';

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
    players: {
      [hostId]: {
        id: hostId,
        name: hostName,
        isHost: true,
        alive: true,
        cupPoisoned: false,
        skips: 0,
        poison: 1,
        pill: 1,
        ready: false,
        lastDrink: null,
        decision: null
      }
    },
    swaps: {},
    roundLogs: []
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

  // Prevent duplicate usernames!
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
    alive: true,
    cupPoisoned: false,
    skips: 0,
    poison: 1,
    pill: 1,
    ready: false,
    lastDrink: null,
    decision: null
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
    players[pid].cupPoisoned = false;
    players[pid].skips = 0;
    players[pid].poison = 1;
    players[pid].pill = 1;
    players[pid].ready = false;
    players[pid].decision = null;
    players[pid].lastDrink = null;
    players[pid].autoPillUsed = false;
  }

  await DB.update(`rooms/${roomCode}`, {
    status: 'PHASE_1',
    round: 1,
    swaps: {},
    roundLogs: [],
    detailedLogs: [],
    isDuel: false,
    players: players
  });
}

export async function checkPhase1Completion(roomCode, room) {
  if (!room || room.status !== 'PHASE_1') return;
  const alivePlayers = Object.values(room.players || {}).filter(p => p.alive);
  const allReady = alivePlayers.length > 0 && alivePlayers.every(p => p.ready && p.decision);
  if (allReady) {
    await advanceToPhase2(roomCode, room);
  }
}

export async function submitPhase1Decision(roomCode, playerId, drinkChoice, actionChoice) {
  await DB.update(`rooms/${roomCode}/players/${playerId}`, {
    decision: {
      drink: drinkChoice,
      action: actionChoice
    },
    ready: true
  });

  const latestRoom = await DB.get(`rooms/${roomCode}`);
  if (latestRoom) {
    await checkPhase1Completion(roomCode, latestRoom);
  }
}

export async function advanceToPhase2(roomCode, room) {
  if (room.status !== 'PHASE_1') return;

  const players = JSON.parse(JSON.stringify(room.players || {}));
  const swaps = {};
  const isDuel = Object.values(players).filter(p => p.alive).length === 2;
  const newDetailed = [...(room.detailedLogs || [])];

  for (const p of Object.values(players)) {
    if (!p.alive || !p.decision) continue;
    
    const act = p.decision.action;
    if (act && act.type === 'POISON' && p.poison > 0 && act.target) {
      if (players[act.target]) {
        players[act.target].cupPoisoned = true;
        p.poison -= 1;
        newDetailed.push({
          type: 'POISON',
          round: room.round,
          actor: p.name,
          actorId: p.id,
          target: players[act.target]?.name || '?',
          targetId: act.target
        });
      }
    } else if (act && act.type === 'SWAP' && act.target && !isDuel) {
      const swapId = `sw_${p.id}_${act.target}`;
      swaps[swapId] = {
        id: swapId,
        from: p.id,
        fromName: p.name,
        to: act.target,
        toName: players[act.target]?.name || '',
        status: 'PENDING'
      };
      newDetailed.push({
        type: 'SWAP_OFFER',
        round: room.round,
        actor: p.name,
        actorId: p.id,
        target: players[act.target]?.name || '?',
        targetId: act.target
      });
    }
  }

  for (const pid of Object.keys(players)) {
    players[pid].ready = false;
  }

  await DB.update(`rooms/${roomCode}`, {
    status: 'PHASE_2',
    players: players,
    swaps: swaps,
    detailedLogs: newDetailed
  });
}

export async function respondToSwap(roomCode, swapId, accepted) {
  await DB.update(`rooms/${roomCode}/swaps/${swapId}`, {
    status: accepted ? 'ACCEPTED' : 'REJECTED'
  });
}

export async function checkPhase2Completion(roomCode, room) {
  if (!room || room.status !== 'PHASE_2') return;
  const alivePlayers = Object.values(room.players || {}).filter(p => p.alive);
  const allReady = alivePlayers.length > 0 && alivePlayers.every(p => p.ready);
  if (allReady) {
    await advanceToPhase3(roomCode, room);
  }
}

export async function setPhase2Ready(roomCode, playerId) {
  await DB.update(`rooms/${roomCode}/players/${playerId}`, { ready: true });

  const latestRoom = await DB.get(`rooms/${roomCode}`);
  if (latestRoom) {
    await checkPhase2Completion(roomCode, latestRoom);
  }
}

export async function advanceToPhase3(roomCode, room) {
  if (room.status !== 'PHASE_2') return;

  const players = JSON.parse(JSON.stringify(room.players || {}));
  const swaps = room.swaps || {};
  const logs = [];
  const newDetailed = [...(room.detailedLogs || [])];
  
  // 1. Resolve swaps silently
  const swappedPair = new Set();
  for (const s of Object.values(swaps)) {
    if (s.status === 'ACCEPTED') {
      if (!swappedPair.has(s.from) && !swappedPair.has(s.to) && players[s.from] && players[s.to]) {
        const tempCup = players[s.from].cupPoisoned;
        players[s.from].cupPoisoned = players[s.to].cupPoisoned;
        players[s.to].cupPoisoned = tempCup;
        swappedPair.add(s.from);
        swappedPair.add(s.to);
        newDetailed.push({
          type: 'SWAP_ACCEPTED',
          round: room.round,
          from: s.fromName,
          fromId: s.from,
          to: s.toName,
          toId: s.to
        });
      } else {
        newDetailed.push({
          type: 'SWAP_CANCELLED',
          round: room.round,
          from: s.fromName,
          fromId: s.from,
          to: s.toName,
          toId: s.to
        });
      }
    } else if (s.status === 'REJECTED') {
      newDetailed.push({
        type: 'SWAP_REJECTED',
        round: room.round,
        from: s.fromName,
        fromId: s.from,
        to: s.toName,
        toId: s.to
      });
    } else if (s.status === 'PENDING') {
      newDetailed.push({
        type: 'SWAP_EXPIRED',
        round: room.round,
        from: s.fromName,
        fromId: s.from,
        to: s.toName,
        toId: s.to
      });
    }
  }

  // 2. Resolve drinking (Keep secret from public logs, log to detailedLogs for ghosts)
  const deaths = [];
  const poisonedVictims = [];

  for (const p of Object.values(players)) {
    if (!p.alive) continue;
    p.autoPillUsed = false;
    
    const drank = p.decision ? p.decision.drink : false;
    p.lastDrink = drank;

    if (drank) {
      if (p.cupPoisoned) {
        poisonedVictims.push(p.id);
        newDetailed.push({
          type: 'DRINK_POISONED',
          round: room.round,
          actor: p.name,
          actorId: p.id
        });
      } else {
        p.cupPoisoned = false;
        if (p.poison < 1) {
          p.poison += 1; // RELOAD!
        }
        newDetailed.push({
          type: 'DRINK_CLEAN',
          round: room.round,
          actor: p.name,
          actorId: p.id
        });
      }
    } else {
      p.skips += 1;
      newDetailed.push({
        type: 'SKIP',
        round: room.round,
        actor: p.name,
        actorId: p.id
      });
    }
  }

  for (const vid of poisonedVictims) {
    const p = players[vid];
    if (p.pill > 0) {
      // Auto-use pill!
      p.pill = 0;
      p.cupPoisoned = false;
      if ((p.poison || 0) < 1) {
        p.poison = 1; // Gaining poison token on revival since player drank tea
      }
      p.autoPillUsed = true;
      logs.push({ type: 'POISONED_PILL', name: p.name });
      newDetailed.push({
        type: 'POISONED_PILL',
        round: room.round,
        actor: p.name,
        actorId: p.id
      });
    } else {
      p.alive = false;
      p.autoPillUsed = false;
      deaths.push(p.name);
      logs.push({ type: 'DEATH', name: p.name });
      newDetailed.push({
        type: 'DEATH',
        round: room.round,
        actor: p.name,
        actorId: p.id
      });
    }
  }

  const aliveRemaining = Object.values(players).filter(p => p.alive);
  let nextStatus = 'PHASE_3';
  let winner = null;

  if (aliveRemaining.length === 1) {
    nextStatus = 'GAME_OVER';
    winner = aliveRemaining[0].name;
    logs.push({ type: 'WINNER', winner: winner });
    newDetailed.push({
      type: 'WINNER',
      round: room.round,
      winner: winner
    });
  } else if (aliveRemaining.length === 0) {
    nextStatus = 'GAME_OVER';
    winner = 'BERABERE (HERKES ÖLDÜ!)';
    logs.push({ type: 'MUTUAL_DEATH' });
    newDetailed.push({
      type: 'MUTUAL_DEATH',
      round: room.round
    });
  }

  for (const pid of Object.keys(players)) {
    players[pid].ready = false;
  }

  await DB.update(`rooms/${roomCode}`, {
    status: nextStatus,
    players: players,
    roundLogs: logs,
    detailedLogs: newDetailed,
    poisonedVictims: poisonedVictims,
    isDuel: (aliveRemaining.length === 2),
    winner: winner
  });
}

export async function usePill(roomCode, playerId) {
  const room = await DB.get(`rooms/${roomCode}`);
  if (!room) return;
  
  const player = room.players[playerId];
  if (player && player.pill > 0 && player.alive) {
    player.pill = 0;
    player.cupPoisoned = false;
    player.autoPillUsed = true;
    if ((player.poison || 0) < 1) {
      player.poison = 1;
    }
    
    const logs = [...(room.roundLogs || [])];
    logs.push({ type: 'POISONED_PILL', name: player.name });
    
    const detailed = [...(room.detailedLogs || [])];
    detailed.push({
      type: 'POISONED_PILL',
      round: room.round,
      actor: player.name
    });

    const victims = (room.poisonedVictims || []).filter(id => id !== playerId);

    await DB.update(`rooms/${roomCode}`, {
      [`players/${playerId}`]: player,
      poisonedVictims: victims,
      roundLogs: logs,
      detailedLogs: detailed
    });
  }
}

export async function nextRound(roomCode) {
  const room = await DB.get(`rooms/${roomCode}`);
  if (!room) return;
  
  const players = JSON.parse(JSON.stringify(room.players || {}));
  const detailed = [...(room.detailedLogs || [])];

  const aliveRemaining = Object.values(players).filter(p => p.alive);

  for (const pid of Object.keys(players)) {
    players[pid].ready = false;
    players[pid].decision = null;
    players[pid].lastDrink = null;
    players[pid].autoPillUsed = false;
  }

  await DB.update(`rooms/${roomCode}`, {
    status: 'PHASE_1',
    round: (room.round || 1) + 1,
    swaps: {},
    players: players,
    poisonedVictims: [],
    detailedLogs: detailed,
    isDuel: (aliveRemaining.length === 2)
  });
}
