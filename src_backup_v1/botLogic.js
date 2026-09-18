// Bot AI Logic for Cup of Tea (Victorian Parlor AI Players)
import { DB } from './firebaseConfig.js';
import { submitPhase1Decision, respondToSwap, setPhase2Ready } from './gameLogic.js';

const BOT_NAMES = [
  'Bot Watson',
  'Bot Moriarty',
  'Bot Irene',
  'Bot Lestrade',
  'Bot Hudson',
  'Bot Mycroft',
  'Bot Mary',
  'Bot Wiggins',
  'Bot Hopkins',
  'Bot Gregson'
];

// Set to keep track of scheduled bot operations to prevent duplicate executions
const scheduledOperations = new Set();

export async function addBot(roomCode) {
  const cleanCode = roomCode.trim().toUpperCase();
  const room = await DB.get(`rooms/${cleanCode}`);
  if (!room) {
    throw new Error("Oda bulunamadı!");
  }
  if (room.status !== 'LOBBY') {
    throw new Error("Oyun başladıktan sonra bot eklenemez!");
  }

  const existingPlayers = Object.values(room.players || {});
  if (existingPlayers.length >= 8) {
    throw new Error("Maksimum oyuncu limitine (8) ulaşıldı!");
  }

  const existingNames = new Set(existingPlayers.map(p => (p.name || '').trim().toLowerCase()));

  // Find an available bot name
  let candidateName = BOT_NAMES.find(name => !existingNames.has(name.toLowerCase()));
  if (!candidateName) {
    candidateName = `Bot ${Math.floor(100 + Math.random() * 900)}`;
  }

  const botId = 'bot_' + Math.random().toString(36).substr(2, 9);
  const botPlayer = {
    id: botId,
    name: candidateName,
    isHost: false,
    isBot: true,
    alive: true,
    cupPoisoned: false,
    skips: 0,
    poison: 1,
    pill: 1,
    ready: false,
    lastDrink: null,
    decision: null
  };

  await DB.set(`rooms/${cleanCode}/players/${botId}`, botPlayer);
  return { botId, botName: candidateName };
}

/**
 * Main coordinator run by room host client whenever room state updates.
 */
export function runBotLifecycle(roomCode, room) {
  if (!room || !room.players) return;

  const bots = Object.values(room.players).filter(p => p.alive && p.isBot);
  if (bots.length === 0) return;

  if (room.status === 'PHASE_1') {
    for (const bot of bots) {
      if (!bot.ready || !bot.decision) {
        scheduleBotPhase1(roomCode, bot, room.round);
      }
    }
  } else if (room.status === 'PHASE_2') {
    for (const bot of bots) {
      // 1. Check if bot has pending swap offers to respond to
      const swaps = room.swaps || {};
      for (const swap of Object.values(swaps)) {
        if (swap.to === bot.id && swap.status === 'PENDING') {
          scheduleBotSwapResponse(roomCode, bot, swap.id);
        }
      }

      // 2. Schedule Phase 2 ready
      if (!bot.ready) {
        scheduleBotPhase2Ready(roomCode, bot, room.round);
      }
    }
  }
}

function scheduleBotPhase1(roomCode, bot, round) {
  const opKey = `p1_${roomCode}_${bot.id}_r${round}`;
  if (scheduledOperations.has(opKey)) return;
  scheduledOperations.add(opKey);

  // Human-like natural delay: 1000ms - 2500ms
  const delayMs = 1000 + Math.floor(Math.random() * 1500);

  setTimeout(async () => {
    try {
      const room = await DB.get(`rooms/${roomCode}`);
      if (!room || room.status !== 'PHASE_1' || room.round !== round) return;

      const currentBot = room.players ? room.players[bot.id] : null;
      if (!currentBot || !currentBot.alive || currentBot.ready) return;

      // 1. DRINK CHOICE
      let drinkChoice = true;
      const skipsUsed = currentBot.skips || 0;

      if (skipsUsed >= 2) {
        // Must drink! No skips remaining
        drinkChoice = true;
      } else if (skipsUsed === 1) {
        // 1 skip left: 75% drink, 25% skip
        drinkChoice = Math.random() < 0.75;
      } else {
        // 0 skips used: 65% drink, 35% skip
        drinkChoice = Math.random() < 0.65;
      }

      // 2. ACTION CHOICE (POISON, SWAP, PASS)
      const aliveOpponents = Object.values(room.players).filter(p => p.alive && p.id !== bot.id);
      let actionChoice = { type: 'PASS' };

      if (currentBot.poison > 0 && aliveOpponents.length > 0) {
        const roll = Math.random();
        if (roll < 0.75) {
          // Poison a random alive opponent
          const target = aliveOpponents[Math.floor(Math.random() * aliveOpponents.length)];
          actionChoice = { type: 'POISON', target: target.id };
        } else if (roll < 0.85) {
          // Bluff! Poison own cup as Trojan horse
          actionChoice = { type: 'POISON', target: bot.id };
        } else {
          // Save poison
          actionChoice = { type: 'PASS' };
        }
      } else if (!room.isDuel && aliveOpponents.length > 0) {
        // No poison available, or save poison: consider swap
        if (Math.random() < 0.50) {
          const target = aliveOpponents[Math.floor(Math.random() * aliveOpponents.length)];
          actionChoice = { type: 'SWAP', target: target.id };
        } else {
          actionChoice = { type: 'PASS' };
        }
      }

      await submitPhase1Decision(roomCode, bot.id, drinkChoice, actionChoice);
    } catch (err) {
      console.warn(`[Bot AI] Phase 1 error for ${bot.name}:`, err);
    } finally {
      scheduledOperations.delete(opKey);
    }
  }, delayMs);
}

function scheduleBotSwapResponse(roomCode, bot, swapId) {
  const opKey = `swap_${roomCode}_${bot.id}_${swapId}`;
  if (scheduledOperations.has(opKey)) return;
  scheduledOperations.add(opKey);

  const delayMs = 800 + Math.floor(Math.random() * 1200);

  setTimeout(async () => {
    try {
      const room = await DB.get(`rooms/${roomCode}`);
      if (!room || room.status !== 'PHASE_2') return;

      const swap = room.swaps ? room.swaps[swapId] : null;
      if (!swap || swap.status !== 'PENDING') return;

      // Bot evaluates swap: 60% chance accept, 40% reject
      const accept = Math.random() < 0.60;
      await respondToSwap(roomCode, swapId, accept);
    } catch (err) {
      console.warn(`[Bot AI] Swap response error for ${bot.name}:`, err);
    } finally {
      scheduledOperations.delete(opKey);
    }
  }, delayMs);
}

function scheduleBotPhase2Ready(roomCode, bot, round) {
  const opKey = `p2_ready_${roomCode}_${bot.id}_r${round}`;
  if (scheduledOperations.has(opKey)) return;
  scheduledOperations.add(opKey);

  const delayMs = 1500 + Math.floor(Math.random() * 1500);

  setTimeout(async () => {
    try {
      const room = await DB.get(`rooms/${roomCode}`);
      if (!room || room.status !== 'PHASE_2' || room.round !== round) return;

      const currentBot = room.players ? room.players[bot.id] : null;
      if (!currentBot || !currentBot.alive || currentBot.ready) return;

      // Make sure all pending swap offers targeting this bot have been decided
      const swaps = room.swaps || {};
      for (const swap of Object.values(swaps)) {
        if (swap.to === bot.id && swap.status === 'PENDING') {
          await respondToSwap(roomCode, swap.id, Math.random() < 0.60);
        }
      }

      await setPhase2Ready(roomCode, bot.id);
    } catch (err) {
      console.warn(`[Bot AI] Phase 2 ready error for ${bot.name}:`, err);
    } finally {
      scheduledOperations.delete(opKey);
    }
  }, delayMs);
}
