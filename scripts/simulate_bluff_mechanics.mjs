/**
 * Enhanced Monte Carlo Simulation: Adaptive Human Strategies & Economy
 * 50,000 games simulating realistic adaptive psychology:
 * - Smart Landmine: Traps only 35% of the time, scores points rest of the time
 * - Smart Thief: Evaluates if a cup smells like a trap vs real sugar
 * - Trojan Assassin: Attacks leader when leader gets close to winning (>= 5 pts)
 * - Apothecary Economy: Can spend 2 points to buy Antidote Pill or Swap Card
 * - Leader Comeback Bounty: Leader loses points when poisoned, killer gets bounty
 */

const NUM_SIMULATIONS = 50000;
const WINNING_SCORE = 8;
const PLAYERS_COUNT = 5;

function runAdaptiveGame(rules = { allowSelfCyanide: true, economy: true, leaderBounty: true }) {
  const players = [
    { id: 0, name: 'Greedy Leader', type: 'GREEDY', score: 0, pills: 1, swaps: 1, cyanides: 2, alive: true },
    { id: 1, name: 'Trojan Assassin', type: 'TROJAN', score: 0, pills: 1, swaps: 1, cyanides: 2, alive: true },
    { id: 2, name: 'Mindgame Trapper', type: 'SMART_TRAPPER', score: 0, pills: 1, swaps: 1, cyanides: 2, alive: true },
    { id: 3, name: 'Calculated Thief', type: 'SMART_THIEF', score: 0, pills: 1, swaps: 1, cyanides: 2, alive: true },
    { id: 4, name: 'Balanced Player', type: 'BALANCED', score: 0, pills: 1, swaps: 1, cyanides: 2, alive: true }
  ];

  let rounds = 0;
  let leaderOverthrownCount = 0;
  let landmineTriggers = 0;
  let trojanTriggers = 0;
  let maxRounds = 12;

  while (rounds < maxRounds) {
    rounds++;

    // Find current leader
    let sorted = [...players].sort((a, b) => b.score - a.score);
    let currentLeader = sorted[0];
    let prevLeaderId = currentLeader.id;

    // Optional: APOTHECARY ECONOMY PHASE
    // If player has >= 4 points and 0 pills, buy a pill for 2 points (life insurance)
    if (rules.economy) {
      players.forEach(p => {
        if (!p.alive) return;
        if (p.score >= 4 && p.pills === 0) {
          p.score -= 2;
          p.pills++;
        } else if (p.score >= 5 && p.swaps === 0 && Math.random() < 0.5) {
          p.score -= 2;
          p.swaps++;
        }
      });
    }

    // Cups state
    const cups = players.map(p => ({
      ownerId: p.id,
      sugars: 0,
      cyanide: false,
      cyanideDropper: null
    }));

    // PHASE 1: INGREDIENT DROPS
    players.forEach(p => {
      if (!p.alive) return;

      // Sugar drop
      let sugarTarget = p.id;
      if (p.type === 'GREEDY') {
        sugarTarget = p.id; // Self-feed
      } else if (p.type === 'SMART_TRAPPER') {
        // Feed own cup to make it irresistible bait
        sugarTarget = p.id;
      } else if (p.type === 'TROJAN') {
        // If leader is ahead, drop sugar on leader to make them feel safe, or on self
        sugarTarget = (currentLeader.id !== p.id && Math.random() < 0.4) ? currentLeader.id : p.id;
      } else {
        sugarTarget = p.id;
      }
      cups[sugarTarget].sugars++;

      // Cyanide drop
      if (p.cyanides > 0 && Math.random() < 0.60) {
        let cyanideTarget = null;

        if (rules.allowSelfCyanide) {
          if (p.type === 'SMART_TRAPPER' && Math.random() < 0.40) {
            // 40% chance to set a landmine in own cup!
            cyanideTarget = p.id;
          } else if (p.type === 'TROJAN' && currentLeader.id !== p.id && currentLeader.score >= 4 && p.swaps > 0) {
            // Trojan horse setup: poison own cup to hand it to the leader
            cyanideTarget = p.id;
          } else {
            // Target the leader directly
            cyanideTarget = currentLeader.id !== p.id ? currentLeader.id : (p.id + 1) % PLAYERS_COUNT;
          }
        } else {
          // Normal: cannot poison self
          cyanideTarget = currentLeader.id !== p.id ? currentLeader.id : (p.id + 1) % PLAYERS_COUNT;
        }

        if (cyanideTarget !== null) {
          cups[cyanideTarget].cyanide = true;
          cups[cyanideTarget].cyanideDropper = p.id;
          p.cyanides--;
        }
      }
    });

    // PHASE 2: VERDICTS & SWAPS
    let playerCups = players.map(p => ({ ...cups[p.id] }));

    const decisions = players.map(p => {
      if (!p.alive) return { action: 'DEAD', target: null };

      // 1. Trojan Assassin Logic
      if (p.type === 'TROJAN') {
        if (playerCups[p.id].cyanide && p.swaps > 0 && currentLeader.id !== p.id) {
          return { action: 'SWAP', target: currentLeader.id }; // Deliver the poison!
        }
        // If poisoned own cup but no swap, MUST DUMP!
        if (playerCups[p.id].cyanide) return { action: 'DUMP', target: null };
        return { action: 'DRINK', target: null };
      }

      // 2. Smart Trapper Logic
      if (p.type === 'SMART_TRAPPER') {
        if (playerCups[p.id].cyanide) {
          // Knows it's poisoned! DUMP it safely. If a thief steals it before, thief dies!
          return { action: 'DUMP', target: null };
        }
        return { action: 'DRINK', target: null };
      }

      // 3. Calculated Thief Logic
      if (p.type === 'SMART_THIEF' && p.swaps > 0) {
        // Find highest sugar cup
        let bestTarget = null;
        let maxSugar = 0;
        players.forEach(o => {
          if (o.id !== p.id && o.alive && playerCups[o.id].sugars > maxSugar) {
            // Psychological smell test: If cup has 3+ sugars, is it a landmine?
            // If thief has pill, thief takes the risk! If no pill, thief is cautious
            const riskTolerance = p.pills > 0 ? 0.85 : 0.45;
            if (Math.random() < riskTolerance) {
              maxSugar = playerCups[o.id].sugars;
              bestTarget = o.id;
            }
          }
        });
        if (bestTarget !== null) {
          return { action: 'SWAP', target: bestTarget };
        }
      }

      // 4. Greedy Leader Logic
      if (p.type === 'GREEDY') {
        // If leader and under fire, dump if 2+ sugars and no pill
        if (p.id === currentLeader.id && playerCups[p.id].sugars >= 2 && p.pills === 0 && Math.random() < 0.4) {
          return { action: 'DUMP', target: null };
        }
        return { action: 'DRINK', target: null };
      }

      // 5. Balanced Player
      if (playerCups[p.id].sugars >= 2 && p.pills === 0 && Math.random() < 0.5) {
        return { action: 'DUMP', target: null };
      }
      return { action: 'DRINK', target: null };
    });

    // Resolve Swaps
    decisions.forEach((dec, pId) => {
      if (dec.action === 'SWAP' && dec.target !== null) {
        players[pId].swaps--;
        const targetId = dec.target;
        const temp = playerCups[pId];
        playerCups[pId] = playerCups[targetId];
        playerCups[targetId] = temp;
      }
    });

    // PHASE 3: RESOLUTION & SCORING
    players.forEach(p => {
      if (!p.alive) return;
      const dec = decisions[p.id];
      const finalCup = playerCups[p.id];
      const isDrinking = (dec.action === 'DRINK' || dec.action === 'SWAP');

      if (isDrinking) {
        if (finalCup.cyanide) {
          const dropperId = finalCup.cyanideDropper;
          const wasLandmine = (dropperId !== p.id && finalCup.ownerId === dropperId);
          const wasTrojan = (dropperId !== p.id && dec.action !== 'SWAP' && dropperId !== null && decisions[dropperId]?.action === 'SWAP');

          if (wasLandmine) landmineTriggers++;
          if (wasTrojan) trojanTriggers++;

          if (p.pills > 0) {
            // Antidote saves life!
            p.pills--;
            p.score = Math.max(0, p.score - 1);
          } else {
            // Death / Demotion
            if (rules.leaderBounty && p.id === currentLeader.id) {
              // LEADER TEPE TAKLAK: Loses 50% of points!
              p.score = Math.floor(p.score / 2);
            } else {
              p.score = Math.max(0, p.score - 2);
            }
          }

          // Killer Reward
          if (dropperId !== null && dropperId !== p.id) {
            const assassin = players[dropperId];
            const bounty = (rules.leaderBounty && p.id === currentLeader.id) ? 3 : 2;
            assassin.score += bounty;
          }
        } else {
          // Sweet victory
          p.score += finalCup.sugars;
        }
      }
    });

    // Check leader overthrow
    let newLeader = players.reduce((max, p) => p.score > max.score ? p : max, players[0]);
    if (newLeader.id !== prevLeaderId && prevLeaderId === currentLeader.id && currentLeader.score < newLeader.score) {
      leaderOverthrownCount++;
    }

    if (players.some(p => p.score >= WINNING_SCORE)) break;
  }

  let winner = players.reduce((max, p) => p.score > max.score ? p : max, players[0]);
  return {
    winnerType: winner.type,
    winnerScore: winner.score,
    rounds,
    leaderOverthrownCount,
    landmineTriggers,
    trojanTriggers
  };
}

console.log('Running 50,000 Adaptive Monte Carlo Simulations...');

// Experiment 1: Standard Current Game (No Self-Cyanide, No Economy, Flat -2 Penalty)
const exp1 = { wins: {}, roundsTotal: 0, overthrows: 0, landmines: 0, trojans: 0 };
for (let i = 0; i < NUM_SIMULATIONS; i++) {
  const r = runAdaptiveGame({ allowSelfCyanide: false, economy: false, leaderBounty: false });
  exp1.wins[r.winnerType] = (exp1.wins[r.winnerType] || 0) + 1;
  exp1.roundsTotal += r.rounds;
  exp1.overthrows += r.leaderOverthrownCount;
}

// Experiment 2: Full System (Self-Cyanide + Economy Shop + Leader Bounty / Tepe Taklak)
const exp2 = { wins: {}, roundsTotal: 0, overthrows: 0, landmines: 0, trojans: 0 };
for (let i = 0; i < NUM_SIMULATIONS; i++) {
  const r = runAdaptiveGame({ allowSelfCyanide: true, economy: true, leaderBounty: true });
  exp2.wins[r.winnerType] = (exp2.wins[r.winnerType] || 0) + 1;
  exp2.roundsTotal += r.rounds;
  exp2.overthrows += r.leaderOverthrownCount;
  exp2.landmines += r.landmineTriggers;
  exp2.trojans += r.trojanTriggers;
}

function printExp(title, exp) {
  console.log(`\n==================================================`);
  console.log(`📊 ${title}`);
  console.log(`==================================================`);
  console.log(`Average Rounds Per Match : ${(exp.roundsTotal / NUM_SIMULATIONS).toFixed(2)} rounds`);
  console.log(`Leader Overthrows/Match  : ${(exp.overthrows / NUM_SIMULATIONS).toFixed(2)} (Lead changes hands)`);
  if (exp.landmines > 0 || exp.trojans > 0) {
    console.log(`Landmine Traps Sprung    : ${(exp.landmines / NUM_SIMULATIONS).toFixed(2)}/game (${exp.landmines.toLocaleString()} total)`);
    console.log(`Trojan Horse Deliveries  : ${(exp.trojans / NUM_SIMULATIONS).toFixed(2)}/game (${exp.trojans.toLocaleString()} total)`);
  }
  console.log(`\nWin Distribution Across Playstyles:`);
  Object.entries(exp.wins)
    .sort((a, b) => b[1] - a[1])
    .forEach(([type, count]) => {
      const pct = ((count / NUM_SIMULATIONS) * 100).toFixed(1);
      const bar = '█'.repeat(Math.round(pct / 2.5));
      console.log(`  ${type.padEnd(16)} : ${pct.padStart(5)}% | ${bar}`);
    });
}

printExp('EXPERIMENT 1: MEVCUT DÜZEN (Siyanür Kendine Yasak, Ekonomi Yok)', exp1);
printExp('EXPERIMENT 2: YENİ DÜZEN (Kendi Çayına Siyanür + Eczane Dükkanı + Lider Avı)', exp2);
