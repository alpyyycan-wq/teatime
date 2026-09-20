import { DB } from '../src/firebaseConfig.js';
import { createRoom, startGame, advanceToPhase3, nextRound } from '../src/gameLogic.js';
import { addBot, runBotLifecycle } from '../src/botLogic.js';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testBotsLive() {
  console.log('🤖 Starting Live Bot Simulation Test...');

  // 1. Create Room
  const { roomCode, playerId: hostId } = await createRoom('TestHost');
  console.log(`Room created: ${roomCode}`);

  // 2. Add 6 bots
  for (let i = 0; i < 6; i++) {
    const { botName } = await addBot(roomCode);
    console.log(`Added: ${botName}`);
  }

  // 3. Start Game
  await startGame(roomCode);
  console.log('Game Started! Phase 1 active.');

  // Test 2 Full Rounds
  for (let round = 1; round <= 2; round++) {
    console.log(`\n================== 🔄 TESTING ROUND ${round} ==================`);
    
    // --- PHASE 1 ---
    let room = await DB.get(`rooms/${roomCode}`);
    console.log(`Round ${round} Status: ${room.status}`);
    
    // Trigger bot lifecycle
    runBotLifecycle(roomCode, room);

    // Host submits drop action (Sweet on Bot 1)
    const opponents = Object.values(room.players).filter(p => p.id !== hostId);
    await DB.update(`rooms/${roomCode}/players/${hostId}`, {
      dropAction: { type: 'SWEET', target: opponents[0].id },
      ready: true
    });

    // Wait for all bots to submit drop actions
    let p1Done = false;
    for (let wait = 0; wait < 15; wait++) {
      await sleep(500);
      room = await DB.get(`rooms/${roomCode}`);
      const alivePlayers = Object.values(room.players).filter(p => p.alive);
      const readyCount = alivePlayers.filter(p => p.ready && p.dropAction).length;
      console.log(`[Phase 1] Ready count: ${readyCount}/${alivePlayers.length}`);

      if (room.status === 'PHASE_2' || readyCount === alivePlayers.length) {
        p1Done = true;
        break;
      }
    }

    if (!p1Done) {
      throw new Error(`❌ Phase 1 TIMEOUT on Round ${round}! Bots failed to submit drop actions.`);
    }

    console.log(`✅ Phase 1 completed successfully on Round ${round}!`);

    // Ensure we are in Phase 2
    room = await DB.get(`rooms/${roomCode}`);
    if (room.status === 'PHASE_1') {
      const { advanceToPhase2 } = await import('../src/gameLogic.js');
      await advanceToPhase2(roomCode, room);
      room = await DB.get(`rooms/${roomCode}`);
    }

    console.log(`Now in Phase 2: ${room.status}`);
    // Trigger bot lifecycle for Phase 2
    runBotLifecycle(roomCode, room);

    // Host submits verdict (DUMP)
    await DB.update(`rooms/${roomCode}/players/${hostId}`, {
      verdict: 'DUMP',
      ready: true
    });

    // Wait for all bots to submit verdict
    let p2Done = false;
    for (let wait = 0; wait < 15; wait++) {
      await sleep(500);
      room = await DB.get(`rooms/${roomCode}`);
      const alivePlayers = Object.values(room.players).filter(p => p.alive);
      const readyCount = alivePlayers.filter(p => p.ready && p.verdict).length;
      console.log(`[Phase 2] Verdict count: ${readyCount}/${alivePlayers.length}`);

      if (readyCount === alivePlayers.length) {
        p2Done = true;
        break;
      }
    }

    if (!p2Done) {
      throw new Error(`❌ Phase 2 TIMEOUT on Round ${round}! Bots failed to submit verdicts (check for verdict declaration bugs!).`);
    }

    console.log(`✅ Phase 2 completed successfully on Round ${round}! All bots submitted verdicts.`);

    // Advance to Phase 3
    await advanceToPhase3(roomCode, room);
    room = await DB.get(`rooms/${roomCode}`);
    console.log(`Phase 3 reached! Casualties: ${room.lastPoisonEvents?.length || 0}`);

    // Advance to next round if testing further
    if (round < 2) {
      await nextRound(roomCode);
      await sleep(500);
    }
  }

  console.log('\n🎉 ALL BOT ROUNDS COMPLETED WITHOUT ANY HANGS OR ERRORS!');
  process.exit(0);
}

testBotsLive().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
