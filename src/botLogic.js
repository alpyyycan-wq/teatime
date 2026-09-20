// Bot AI Logic for Cup of Tea: "Siyanür Küpü" (Sugar & Cyanide)
import { DB } from './firebaseConfig.js';
import { submitDropAction, submitVerdict } from './gameLogic.js';
import { auditorAgent } from './telemetryAuditor.js';

const BOT_NAMES = [
  'Bot Moriarty',
  'Bot Watson',
  'Bot Irene',
  'Bot Lestrade',
  'Bot Mycroft',
  'Bot Adler',
  'Bot Hudson',
  'Bot Mary',
  'Bot Wiggins',
  'Bot Hopkins'
];

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
    points: 0,
    pill: 1,
    cyanide: 1,
    ready: false,
    dropAction: null,
    verdict: null,
    roundSugars: { sweet: 0, cyanide: 0, total: 0 },
    autoPillUsed: false,
    lastDrank: null,
    pointsEarnedThisRound: 0
  };

  await DB.set(`rooms/${cleanCode}/players/${botId}`, botPlayer);
  return { botId, botName: candidateName };
}

export function runBotLifecycle(roomCode, room) {
  if (!room || !room.players) return;

  const bots = Object.values(room.players).filter(p => p.alive && p.isBot);
  if (bots.length === 0) return;

  if (room.status === 'PHASE_1') {
    for (const bot of bots) {
      if (!bot.ready || !bot.dropAction) {
        scheduleBotPhase1(roomCode, bot, room.round);
      }
    }
  } else if (room.status === 'PHASE_2') {
    for (const bot of bots) {
      if (!bot.ready || !bot.verdict) {
        scheduleBotPhase2(roomCode, bot, room.round);
      }
    }
  }
}

function getBotPhase1UxCritique(botName, targetName, actionChoice) {
  const critiques = [
    {
      critique: `Faz 1 hedef fincan seçiminde rakip isimleri ve puanları net. Ancak mobilde fincan kartları daha geniş basma alanı (padding) alabilir.`,
      recommendation: `Hedef fincan kartlarının dokunmatik alanını ve basılma (active) görsel efektini güçlendirin.`
    },
    {
      critique: `Şeker atma vs Siyanür atma butonlarının seçilme durumu net. Kalan siyanür adedi (1) daha belirgin parlak bir sayaç kutusuyla ayrışabilir.`,
      recommendation: `Siyanür butonundaki kalan stok adedini koyu kırmızı 3D sayaç rozeti ile vurgulayın.`
    },
    {
      critique: `${targetName}'ın fincanına ${actionChoice.type === 'CYANIDE' ? 'siyanür' : 'şeker'} bırakıldı. Üst bardaki 'X/Y Hazır' sayacı diğer oyuncuların durumunu anlık gösteriyor.`,
      recommendation: `Kararını 10 saniyeden uzun süre vermeyen oyuncu fincanı hafif nabız gibi parlayarak masayı uyarabilir.`
    },
    {
      critique: `Fincan hedefleme ızgarasında fincanların Victorian piksel tasarımı kusursuz. Sayısal emblem yerine mücevher parlaklığı tercih edilmesi retro uyumu artırmış.`,
      recommendation: `Seçili fincan etrafında altın yaldızlı parıltı efekti eklenebilir.`
    }
  ];
  return critiques[Math.floor(Math.random() * critiques.length)];
}

function getBotPhase2UxCritique(botName, verdict, totalSugars) {
  const critiques = [
    {
      critique: `DRINK / DUMP / SWAP CUP 3-kart aksiyon destesi retro piksel estetiğine tam oturmuş. Seçilen eylemin altındaki özet bilgi kutusu oyuncu kafa karışıklığını önlüyor.`,
      recommendation: `DUMP seçildiğinde '0 Puan alırsın' uyarısını sarı yerine hafif kırmızımsı bir çerçeveyle hissettirin.`
    },
    {
      critique: `Kurucu oyuncunun 'KARAR VER' butonu ile 'MASAYI AÇIKLA' host kontrolü arasındaki ayrım çok kritik. Kurucunun önce kendi fincanına karar vermesi gerektiği net anlaşılmalı.`,
      recommendation: `Kurucu kendi fincanına karar vermeden 'MASAYI AÇIKLA' butonuna bastığında onay modalı çıkartın.`
    },
    {
      critique: `Karar kilitlendikten sonra beliren yeşil 'KARARIN KİLİTLENDİ' banner'ı güven veriyor. Butonun kilitli hali ile açık hali arasındaki geçiş çok net.`,
      recommendation: `Kilitli banner içerisine 16-bit retro asma kilit piktogramı yerleştirilebilir.`
    },
    {
      critique: `Fincan takası (SWAP) sekmesinde hedef rakipler hap butonları (pill buttons) olarak listeleniyor. Seçilen rakibin fincan rengi anında küçük bir simgeyle önizlenmeli.`,
      recommendation: `SWAP hedef listesinde her rakibin fincan rengini isim yanına rozet olarak ekleyin.`
    }
  ];
  return critiques[Math.floor(Math.random() * critiques.length)];
}

function scheduleBotPhase1(roomCode, bot, round) {
  const opKey = `p1_${roomCode}_${bot.id}_r${round}`;
  if (scheduledOperations.has(opKey)) return;
  scheduledOperations.add(opKey);

  const delayMs = 800 + Math.floor(Math.random() * 1200);

  setTimeout(async () => {
    try {
      const room = await DB.get(`rooms/${roomCode}`);
      if (!room || room.status !== 'PHASE_1' || room.round !== round) return;

      const currentBot = room.players ? room.players[bot.id] : null;
      if (!currentBot || !currentBot.alive || currentBot.ready) return;

      const aliveOpponents = Object.values(room.players).filter(p => p.alive && p.id !== bot.id);
      if (aliveOpponents.length === 0) return;

      const randomTarget = aliveOpponents[Math.floor(Math.random() * aliveOpponents.length)];
      const leader = aliveOpponents.find(o => (o.points || 0) >= 3);
      let actionChoice = { type: 'SWEET', target: randomTarget.id };
      let motive = '';

      if ((currentBot.cyanide || 0) > 0) {
        const canTrojan = (currentBot.swapsLeft ?? 1) > 0 && leader && Math.random() < 0.28;
        const canLandmineTrap = Math.random() < 0.15;

        if (canTrojan) {
          // Trojan Horse Setup: Poison own cup to swap it with leader later!
          actionChoice = { type: 'CYANIDE', target: bot.id };
          motive = `Truva Atı Hazırlığı: Kendi fincanına siyanür bıraktı, 2. Fazda lider ${leader.name} ile takas edecek.`;
        } else if (canLandmineTrap) {
          // Landmine Trap: Poison own cup and dump, hoping a greedy thief steals it!
          actionChoice = { type: 'CYANIDE', target: bot.id };
          motive = `Mayın Tuzağı: Kendi fincanına siyanür bıraktı, fincanı dökerek fincanını çalacak hırsızları tuzağa düşürecek.`;
        } else if (leader && Math.random() < 0.65) {
          actionChoice = { type: 'CYANIDE', target: leader.id };
          motive = `Lider ${leader.name} (${leader.points} Puan) doğrudan hedeflendi, suikast ödülü aranıyor.`;
        } else if (Math.random() < 0.40) {
          actionChoice = { type: 'CYANIDE', target: randomTarget.id };
          motive = `Şüpheli rakip ${randomTarget.name}'ın fincanına siyanür bırakıldı.`;
        } else {
          actionChoice = { type: 'SWEET', target: randomTarget.id };
          motive = `${randomTarget.name}'a ikram yapıldı, amaç +1 siyanür stoğu doldurmak.`;
        }
      } else {
        actionChoice = { type: 'SWEET', target: randomTarget.id };
        motive = `Siyanür stoğu boş (0), ${randomTarget.name}'a tatlı ikram ederek +1 siyanür kazanılacak.`;
      }

      const targetPlayer = room.players[actionChoice.target];
      const targetName = targetPlayer ? targetPlayer.name : 'Bilinmeyen';
      const uxFeedback = getBotPhase1UxCritique(bot.name, targetName, actionChoice);
      auditorAgent.recordBotReasoning(
        bot.name,
        'PHASE_1',
        `${actionChoice.type === 'CYANIDE' ? '☠️ Siyanür' : '🍬 Şeker'} ➔ ${targetName}`,
        motive,
        'HIGH',
        uxFeedback.critique,
        uxFeedback.recommendation
      );

      await submitDropAction(roomCode, bot.id, actionChoice);
    } catch (err) {
      console.warn(`[Bot AI] Phase 1 error for ${bot.name}:`, err);
    } finally {
      scheduledOperations.delete(opKey);
    }
  }, delayMs);
}

function scheduleBotPhase2(roomCode, bot, round) {
  const opKey = `p2_${roomCode}_${bot.id}_r${round}`;
  if (scheduledOperations.has(opKey)) return;
  scheduledOperations.add(opKey);

  const delayMs = 1000 + Math.floor(Math.random() * 1400);

  setTimeout(async () => {
    try {
      const room = await DB.get(`rooms/${roomCode}`);
      if (!room || room.status !== 'PHASE_2' || room.round !== round) return;

      const currentBot = room.players ? room.players[bot.id] : null;
      if (!currentBot || !currentBot.alive || currentBot.ready) return;

      const totalSugars = currentBot.roundSugars?.total || 0;
      const aliveOpponents = Object.values(room.players).filter(p => p.alive && p.id !== bot.id);
      // Check if bot poisoned its own cup in Phase 1 (Trojan / Landmine)
      const poisonedOwnCup = currentBot.dropAction && currentBot.dropAction.target === bot.id && currentBot.dropAction.type === 'CYANIDE';
      if (poisonedOwnCup) {
        if ((currentBot.swapsLeft ?? 1) > 0 && aliveOpponents.length > 0) {
          // Trojan Horse: Deliver the poison to highest scoring opponent!
          const sortedTargets = [...aliveOpponents].sort((a, b) => (b.points || 0) - (a.points || 0));
          const swapTarget = sortedTargets[0];
          verdict = `SWAP:${swapTarget.id}`;
          motive = `Truva Atı Hamlesi: Kendi fincanındaki siyanürü lider ${swapTarget.name}'a teslim etti!`;
          const uxFeedback = getBotPhase2UxCritique(bot.name, verdict, totalSugars);
          auditorAgent.recordBotReasoning(
            bot.name,
            'PHASE_2',
            `🔄 TRUVA TAKASI ➔ ${swapTarget.name}`,
            motive,
            'HIGH',
            uxFeedback.critique,
            uxFeedback.recommendation
          );
          await submitVerdict(roomCode, bot.id, verdict);
          return;
        } else {
          // Mayın / Korunma: Kendi fincanında zehir olduğunu biliyor, DÖKMELİ!
          verdict = 'DUMP';
          motive = `Mayın Tuzağı: Fincanında kendi siyanürü var, çayı dökerek güvende kalıyor (veya çalan hırsızı tuzağa çekiyor).`;
          const uxFeedback = getBotPhase2UxCritique(bot.name, verdict, totalSugars);
          auditorAgent.recordBotReasoning(
            bot.name,
            'PHASE_2',
            `🫗 MAYIN DÖKÜŞÜ`,
            motive,
            'HIGH',
            uxFeedback.critique,
            uxFeedback.recommendation
          );
          await submitVerdict(roomCode, bot.id, verdict);
          return;
        }
      }

      if ((currentBot.swapsLeft ?? 1) > 0 && totalSugars >= 2 && (currentBot.pill || 0) === 0 && aliveOpponents.length > 0) {
        if (Math.random() < 0.45) {
          const sortedTargets = [...aliveOpponents].sort((a, b) => (b.points || 0) - (a.points || 0));
          const swapTarget = sortedTargets[0];
          verdict = `SWAP:${swapTarget.id}`;
          motive = `Fincanda ${totalSugars} şeker var ve panzehir yok! Riskli fincan lider ${swapTarget.name} ile takas edildi.`;
          const uxFeedback = getBotPhase2UxCritique(bot.name, verdict, totalSugars);
          auditorAgent.recordBotReasoning(
            bot.name,
            'PHASE_2',
            `🔄 TAKAS ➔ ${swapTarget.name}`,
            motive,
            'HIGH',
            uxFeedback.critique,
            uxFeedback.recommendation
          );
          await submitVerdict(roomCode, bot.id, verdict);
          return;
        }
      }

      if (totalSugars === 0) {
        if ((currentBot.cyanide || 0) === 0) {
          verdict = 'DRINK';
          motive = 'Fincan boş ve güvenli (0 şeker), içildi.';
        } else {
          verdict = Math.random() < 0.5 ? 'DRINK' : 'DUMP';
          motive = `Fincan boş (0 şeker), blöf ve şüphe gereği ${verdict} seçildi.`;
        }
      } else if ((currentBot.pill || 0) > 0) {
        verdict = Math.random() < 0.8 ? 'DRINK' : 'DUMP';
        motive = `Panzehir (1 Can) mevcut, agresif puan kazanma amacıyla %80 ihtimalle ${verdict} seçildi.`;
      } else if ((currentBot.points || 0) + totalSugars >= (room.targetPoints || 8)) {
        verdict = Math.random() < 0.7 ? 'DRINK' : 'DUMP';
        motive = `Şampiyonluk eşiği (%70 kazanma atağı), ${verdict} seçildi.`;
      } else if (totalSugars === 1) {
        verdict = Math.random() < 0.55 ? 'DRINK' : 'DUMP';
        motive = `Tek şekerli fincan, dengeli risk tercihi ile ${verdict} seçildi.`;
      } else {
        verdict = Math.random() < 0.35 ? 'DRINK' : 'DUMP';
        motive = `${totalSugars} şekerli yüksek siyanür riski! Panzehir olmadığı için temkinli davranıldı (${verdict}).`;
      }

      const uxFeedback = getBotPhase2UxCritique(bot.name, verdict, totalSugars);
      auditorAgent.recordBotReasoning(
        bot.name,
        'PHASE_2',
        verdict,
        motive,
        'HIGH',
        uxFeedback.critique,
        uxFeedback.recommendation
      );
      await submitVerdict(roomCode, bot.id, verdict);
    } catch (err) {
      console.warn(`[Bot AI] Phase 2 error for ${bot.name}:`, err);
    } finally {
      scheduledOperations.delete(opKey);
    }
  }, delayMs);
}

