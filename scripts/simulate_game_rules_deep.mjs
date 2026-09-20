// Deep Monte Carlo Game Theory & Rule Verification Simulator for "Cup of Tea"
// Comparing Rule Variations:
// Variation 1: ALL SELF-TARGETING ALLOWED (Self-Sweet + Self-Cyanide)
// Variation 2: BLUFF ONLY SELF-TARGETING (Self-Cyanide allowed for Trojan/Landmine, Sweet Sugar MUST target opponents)
// Variation 3: STRICT NO SELF-TARGETING (Neither Sweet nor Cyanide on oneself)

const TOTAL_GAMES_PER_MODEL = 50000;
const TARGET_POINTS = 8;

const ARCHETYPES = [
  'SOLITAIRE_GRINDER',  // If allowed, always sweets own cup & drinks
  'TROJAN_MASTER',      // Poisons own cup, swaps with leader
  'LANDMINE_TRAPPER',   // Poisons own cup, dumps, traps thieves
  'LEADER_HUNTER',      // Directly poisons leader for +3 bounty & 50% cut
  'HONEST_HOST',        // Drops sweet on lowest/friendliest, drinks
  'PARANOID_SURVIVOR',  // Highly defensive, dumps if sugars >= 2
  'GREEDY_THIEF'        // Steals highest sugar cup
];

function runSimulation(modelName, config) {
  const stats = {
    modelName,
    totalGames: 0,
    totalRounds: 0,
    winsByArchetype: {},
    trojanSuccesses: 0,
    trojanAttempts: 0,
    landmineTriggers: 0,
    landmineAttempts: 0,
    leaderOverthrows: 0,
    degenerateSelfSweetPumps: 0,
    averageRounds: 0,
    archetypeWinRates: {}
  };

  ARCHETYPES.forEach(a => stats.winsByArchetype[a] = 0);

  for (let g = 0; g < TOTAL_GAMES_PER_MODEL; g++) {
    // 7 players per game, assigned archetypes
    const players = ARCHETYPES.map((arch, idx) => ({
      id: `p_${idx}`,
      name: arch,
      archetype: arch,
      points: 0,
      alive: true,
      pill: 1,
      cyanide: 1,
      swapsLeft: 1
    }));

    let round = 0;
    let winner = null;

    while (!winner && round < 25) {
      round++;
      const alivePlayers = players.filter(p => p.alive);
      if (alivePlayers.length <= 1) {
        winner = alivePlayers[0] || players[0];
        break;
      }

      // Identify leader
      const sortedByPoints = [...alivePlayers].sort((a, b) => b.points - a.points);
      const leader = sortedByPoints[0].points >= 2 ? sortedByPoints[0] : null;

      // Cup state for round
      const cups = {};
      alivePlayers.forEach(p => {
        cups[p.id] = { ownerId: p.id, sweet: 0, cyanide: 0, depositors: [] };
      });

      // --- PHASE 1: DROPS ---
      const dropActions = {};

      alivePlayers.forEach(p => {
        const opponents = alivePlayers.filter(o => o.id !== p.id);
        const hasCyanide = p.cyanide > 0;
        let action = { type: 'SWEET', targetId: null };

        switch (p.archetype) {
          case 'SOLITAIRE_GRINDER':
            if (config.allowSelfSweet) {
              action = { type: 'SWEET', targetId: p.id };
              stats.degenerateSelfSweetPumps++;
            } else {
              // Forced to target opponent
              const randomOpp = opponents[Math.floor(Math.random() * opponents.length)];
              action = { type: 'SWEET', targetId: randomOpp.id };
            }
            break;

          case 'TROJAN_MASTER':
            if (config.allowSelfCyanide && hasCyanide && p.swapsLeft > 0 && leader && leader.id !== p.id) {
              action = { type: 'CYANIDE', targetId: p.id };
              stats.trojanAttempts++;
            } else if (hasCyanide && leader && leader.id !== p.id) {
              action = { type: 'CYANIDE', targetId: leader.id };
            } else {
              const target = opponents[Math.floor(Math.random() * opponents.length)];
              action = { type: 'SWEET', targetId: target.id };
            }
            break;

          case 'LANDMINE_TRAPPER':
            if (config.allowSelfCyanide && hasCyanide && Math.random() < 0.4) {
              action = { type: 'CYANIDE', targetId: p.id };
              stats.landmineAttempts++;
            } else {
              const target = opponents[Math.floor(Math.random() * opponents.length)];
              action = { type: hasCyanide && Math.random() < 0.5 ? 'CYANIDE' : 'SWEET', targetId: target.id };
            }
            break;

          case 'LEADER_HUNTER':
            if (hasCyanide && leader && leader.id !== p.id) {
              action = { type: 'CYANIDE', targetId: leader.id };
            } else {
              const randomOpp = opponents[Math.floor(Math.random() * opponents.length)];
              action = { type: 'SWEET', targetId: randomOpp.id };
            }
            break;

          case 'GREEDY_THIEF':
            // Drops sweet to get cyanide refill
            action = { type: 'SWEET', targetId: opponents[Math.floor(Math.random() * opponents.length)].id };
            break;

          case 'PARANOID_SURVIVOR':
          case 'HONEST_HOST':
          default:
            if (hasCyanide && Math.random() < 0.35) {
              const target = opponents[Math.floor(Math.random() * opponents.length)];
              action = { type: 'CYANIDE', targetId: target.id };
            } else {
              const target = opponents[Math.floor(Math.random() * opponents.length)];
              action = { type: 'SWEET', targetId: target.id };
            }
            break;
        }

        // Apply drop
        if (action.type === 'CYANIDE') {
          p.cyanide--;
          cups[action.targetId].cyanide++;
          cups[action.targetId].depositors.push({ actorId: p.id, type: 'CYANIDE' });
        } else {
          // Sweet gives +1 cyanide refill if empty
          if (p.cyanide === 0) p.cyanide = 1;
          cups[action.targetId].sweet++;
          cups[action.targetId].depositors.push({ actorId: p.id, type: 'SWEET' });
        }

        dropActions[p.id] = action;
      });

      // --- PHASE 2: VERDICTS ---
      const verdicts = {}; // 'DRINK', 'DUMP', 'SWAP:targetId'

      alivePlayers.forEach(p => {
        const myCup = cups[p.id];
        const totalSugarsInMyCup = myCup.sweet + myCup.cyanide;
        const myAction = dropActions[p.id];
        const opponents = alivePlayers.filter(o => o.id !== p.id);

        if (myAction.type === 'CYANIDE' && myAction.targetId === p.id) {
          // Put poison in own cup
          if (p.swapsLeft > 0 && leader && leader.id !== p.id) {
            verdicts[p.id] = `SWAP:${leader.id}`;
          } else if (p.swapsLeft > 0 && opponents.length > 0) {
            const highestOpp = [...opponents].sort((a, b) => b.points - a.points)[0];
            verdicts[p.id] = `SWAP:${highestOpp.id}`;
          } else {
            verdicts[p.id] = 'DUMP';
          }
        } else if (p.archetype === 'GREEDY_THIEF' && p.swapsLeft > 0) {
          // Steal cup with most apparent sugar
          const visibleSugars = opponents.map(o => ({
            id: o.id,
            total: cups[o.id].sweet + cups[o.id].cyanide
          })).sort((a, b) => b.total - a.total);

          if (visibleSugars[0] && visibleSugars[0].total >= 2) {
            verdicts[p.id] = `SWAP:${visibleSugars[0].id}`;
          } else {
            verdicts[p.id] = 'DRINK';
          }
        } else if (p.archetype === 'SOLITAIRE_GRINDER') {
          verdicts[p.id] = 'DRINK';
        } else if (p.archetype === 'PARANOID_SURVIVOR') {
          verdicts[p.id] = totalSugarsInMyCup >= 2 ? 'DUMP' : (p.pill > 0 ? 'DRINK' : 'DUMP');
        } else {
          // Standard heuristic
          if (totalSugarsInMyCup === 0) {
            verdicts[p.id] = 'DRINK';
          } else if (p.pill > 0) {
            verdicts[p.id] = Math.random() < 0.8 ? 'DRINK' : 'DUMP';
          } else if (totalSugarsInMyCup === 1) {
            verdicts[p.id] = Math.random() < 0.6 ? 'DRINK' : 'DUMP';
          } else {
            verdicts[p.id] = Math.random() < 0.3 ? 'DRINK' : 'DUMP';
          }
        }
      });

      // --- RESOLUTION: SWAPS FIRST ---
      const playerDrinkingCup = {};
      alivePlayers.forEach(p => playerDrinkingCup[p.id] = cups[p.id]);

      alivePlayers.forEach(p => {
        const v = verdicts[p.id];
        if (v && v.startsWith('SWAP:')) {
          p.swapsLeft--;
          const targetId = v.split(':')[1];
          // Exchange cups
          const temp = playerDrinkingCup[p.id];
          playerDrinkingCup[p.id] = playerDrinkingCup[targetId];
          playerDrinkingCup[targetId] = temp;
        }
      });

      // --- RESOLUTION: DRINK OR DUMP ---
      alivePlayers.forEach(p => {
        const v = verdicts[p.id];
        const cup = playerDrinkingCup[p.id];
        const isPoisoned = cup.cyanide > 0;

        if (v === 'DUMP') {
          // Survived, 0 points
          if (isPoisoned && cup.ownerId === p.id && dropActions[p.id]?.type === 'CYANIDE') {
            // Landmine dumped by creator
          }
        } else {
          // DRANK (or swapped and drank)
          if (isPoisoned) {
            // Did someone trigger a landmine or trojan?
            if (cup.ownerId !== p.id && dropActions[cup.ownerId]?.type === 'CYANIDE' && dropActions[cup.ownerId]?.targetId === cup.ownerId) {
              stats.trojanSuccesses++;
            }

            // Find killers
            const killerDepositors = cup.depositors.filter(d => d.type === 'CYANIDE');
            const wasLeader = leader && leader.id === p.id;

            if (p.pill > 0) {
              // Saved by pill
              p.pill--;
              p.points = Math.max(0, p.points - 2);
              killerDepositors.forEach(k => {
                const killer = players.find(pl => pl.id === k.actorId);
                if (killer && killer.id !== p.id) {
                  killer.points += 1; // Saved bounty
                }
              });
            } else {
              // Eliminated!
              p.alive = false;
              if (wasLeader) {
                stats.leaderOverthrows++;
              }
              killerDepositors.forEach(k => {
                const killer = players.find(pl => pl.id === k.actorId);
                if (killer && killer.id !== p.id) {
                  const bounty = wasLeader ? 3 : 2;
                  killer.points += bounty;
                }
              });
            }
          } else {
            // Clean tea: +points
            p.points += cup.sweet;
          }
        }
      });

      // Check win condition
      const topScorers = players.filter(p => p.alive && p.points >= TARGET_POINTS);
      if (topScorers.length > 0) {
        topScorers.sort((a, b) => b.points - a.points);
        winner = topScorers[0];
      }
    }

    stats.totalGames++;
    stats.totalRounds += round;
    if (winner) {
      stats.winsByArchetype[winner.archetype]++;
    }
  }

  stats.averageRounds = (stats.totalRounds / stats.totalGames).toFixed(2);
  ARCHETYPES.forEach(a => {
    stats.archetypeWinRates[a] = ((stats.winsByArchetype[a] / stats.totalGames) * 100).toFixed(1) + '%';
  });

  return stats;
}

console.log('Running 50,000 simulations for each rule set...\n');

const model1 = runSimulation('MODEL 1: ALL SELF-TARGETING (Self-Sweet + Self-Cyanide)', {
  allowSelfSweet: true,
  allowSelfCyanide: true
});

const model2 = runSimulation('MODEL 2: BLUFF ONLY SELF-TARGETING (Self-Cyanide ONLY, Sweet Sugar must target opponents)', {
  allowSelfSweet: false,
  allowSelfCyanide: true
});

const model3 = runSimulation('MODEL 3: STRICT EXTERNAL ONLY (No self-targeting at all)', {
  allowSelfSweet: false,
  allowSelfCyanide: false
});

console.log('========================================================================');
console.log('🏆 MONTE CARLO EXPERIMENT RESULTS (ZERO SUGAR-COAT)');
console.log('========================================================================\n');

[model1, model2, model3].forEach(m => {
  console.log(`### ${m.modelName}`);
  console.log(`Average Game Length: ${m.averageRounds} rounds`);
  console.log(`Leader Overthrows/Game: ${(m.leaderOverthrows / m.totalGames).toFixed(2)}`);
  console.log(`Trojan Successes/Game: ${(m.trojanSuccesses / m.totalGames).toFixed(3)}`);
  console.log(`Degenerate Self-Sweet Pumps/Game: ${(m.degenerateSelfSweetPumps / m.totalGames).toFixed(2)}`);
  console.log('Win Rates by Strategy:');
  Object.entries(m.archetypeWinRates).forEach(([arch, rate]) => {
    const bar = '█'.repeat(Math.round(parseFloat(rate) / 2));
    console.log(`  ${arch.padEnd(20)} : ${rate.padStart(6)} | ${bar}`);
  });
  console.log('------------------------------------------------------------------------\n');
});
