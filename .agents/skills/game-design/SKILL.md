---
name: game-design
description: Comprehensive game design and game architecture framework for multiplayer, social deduction, turn-based, and indie games. Use whenever designing, balancing, refining, or debugging game mechanics, player psychology, risk-reward loops, bluffing systems, bot AI heuristics, and feedback/UI isolation.
---

# Game Design & Mechanics Architecture Guide

This skill provides a battle-tested game design framework for designing, balancing, and executing engaging games—especially multiplayer party, turn-based strategy, social deduction, and bluffing games.

---

## 🏛️ 1. The Core Game Loop & The MDA Framework

Every successful game is engineered around the **MDA Framework**:
1. **Mechanics (Rules & Systems):** The atomic actions players can take (e.g., Drop Sugar, Drop Poison, Drink, Dump, Swap).
2. **Dynamics (Emergent Gameplay):** How mechanics interact over time with human psychology (bluffing, paranoia, greed, vengeance, alliances).
3. **Aesthetics (Emotional Experience):** The player's emotional state (tension during decisions, euphoria of surviving, comedy of regret, dread of betrayal).

### The Heartbeat Cycle
```
┌─────────────────────────────────────────────────────────┐
│ 1. TENSION (Information Gathering & Secret Actions)    │
│    └─ Players seed the board (drop sugars/traps)        │
├─────────────────────────────────────────────────────────┤
│ 2. CLIMAX / DECISION (Risk vs. Reward Commitment)       │
│    └─ High-stakes choice: Greed vs. Self-Preservation   │
├─────────────────────────────────────────────────────────┤
│ 3. CATHARSIS (The Reveal & Dramatic Resolution)        │
│    └─ Immediate personal outcome -> Global leaderboard  │
└─────────────────────────────────────────────────────────┘
```

---

## 🎭 2. Social Deduction & Bluffing Psychology

### A. Asymmetric Information & The Paranoia Engine
- Games thrive when players know **some** information, but not **all**.
- *Example (Cup of Tea):* You know how many total sugar cubes are in your cup, but you **never know** if one is cyanide.
- **Rule of Suspicion:** The more attractive a reward (e.g., 3 sugar cubes in your cup = 3 points), the higher the player's paranoia that it is bait.

### B. The Dichotomy of Choice: Relief vs. Regret
Every safe exit mechanic (like "Dumping the Tea" or "Folding in Poker") must produce a distinct emotional payoff:
1. **Relief (Heroic Escape):** Player chose safety, and was indeed targeted! `"😮‍💨 KIL PAYI YIRTTIN! (Çayında siyanür vardı!)"`
2. **Regret (Humorous Paranoia):** Player panicked, but the reward was clean! `"🤦‍♂️ BOŞA DÖKTÜN! (Çay tertemizdi!)"`
*Game Design Rule:* Never leave a fold/dump action neutral or boring. Always reveal the secret truth after the decision to generate narrative drama.

### C. Comeback & Anti-Runaway Mechanics
If a leader runs away with the game, other players disengage. Always include:
- **Leader Bounty:** Extra points awarded for eliminating or targeting the first-place player.
- **Limited Trump Cards:** A 1-time emergency mechanic (e.g., 1-time Cup Swap) that lets trailing players steal the lead or reverse a trap.
- **Second Chance / Life Insurance:** Soften sudden-death elimination with a consumable shield (e.g., Antidote Pill absorbing death at the cost of a point penalty).

---

## 🖥️ 3. UI & Information Architecture for Games

### ⚠️ The Cardinal Rule of Event Isolation
> **Never hijack a player's screen with a catastrophic global event unless they are the direct victim!**

- **Personal Outcome First:** When a round resolves, the player must immediately see **their own status** (Alive, Dead, Points Gained, Escaped).
- **Global Events Second:** Deaths of opponents, table news, or eliminations belong in a secondary news ticker, graveyard log, or compact toast.
- *Anti-Pattern:* If Player B died of poison, showing a full-screen screaming "POISONED!" skull to Player A (who dumped safely) causes instant cognitive dissonance.

### Mobile Ergonomics & Confirmation Flow
- **Intent -> Confirmation:** When a choice carries game-ending consequences (Drink vs. Dump):
  - Step 1: Selecting an option highlights it with high contrast and tactile 3D feedback.
  - Step 2: The confirmation button dynamically changes its text to explicitly name the action:
    - `🫗 ÇAYI DÖK (Güvende Kal)` vs. `☕ ÇAYI İÇ (+2 Şeker)`
- **Above-The-Fold Rule:** On 390px mobile screens, the core action cards and confirmation button must fit within the initial viewport without requiring blind scrolling.

---

## 🤖 4. Believable Bot AI (Turing-Grade Game Bots)

Bots should feel like idiosyncratic human players, not deterministic calculators:

### A. Human Latency Simulation (Jitter)
Never let bots respond instantly. Humans deliberate:
- Easy choices: `800ms - 1400ms`
- High-stakes choices: `1500ms - 2600ms`
- Add random jitter so bots don't all act simultaneously in robotic synchronization.

### B. Dynamic Risk Appetite Matrix
Bots must evaluate choices using situational context, not static dice rolls:
```javascript
// Example Bot Decision Matrix:
if (bot.hasPill) {
  // High risk tolerance: Has life insurance
  verdict = Math.random() < 0.80 ? 'DRINK' : 'DUMP';
} else if (bot.points + totalSugars >= WINNING_POINTS) {
  // Glory run: Drinking wins the game immediately!
  verdict = Math.random() < 0.70 ? 'DRINK' : 'DUMP';
} else if (totalSugars >= 2) {
  // Suspicious: 2+ sugars without pill smells like cyanide bait
  verdict = Math.random() < 0.35 ? 'DRINK' : 'DUMP';
}
```

### C. Persona Archetypes
Give bots distinct names and playstyles:
- **The Aggressor (e.g., Moriarty):** Frequently targets leaders with poison.
- **The Pragmatist (e.g., Watson):** Focuses on accumulating clean points and dumping high-sugar suspicious cups.
- **The Trickster (e.g., Irene):** Hoards the 1-time swap to steal the leader's cup in the endgame.

---

## 📊 5. Game Balance Checklist

Before launching or changing any game mechanic, audit against these questions:
- [ ] **Agency:** Does the player have enough information to make an informed guess, rather than pure blind luck?
- [ ] **Comeback Factor:** Can the last-place player still win if they play brilliantly?
- [ ] **Downtime / Spectator Engagement:** When a player is eliminated, do they have a fun role (e.g., classified intel screen, spectator voting, or watching the drama unfold)?
- [ ] **Pacing:** Does a full match conclude in a snappy timeframe (e.g., 3-7 minutes for party games)?
- [ ] **Emotional Clarity:** Does the end of every round trigger a laugh, a sigh of relief, or a gasp of shock?
