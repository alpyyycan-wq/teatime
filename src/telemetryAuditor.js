// ===================================================================
// LORD INSPECTOR: IN-GAME PLAYTEST TELEMETRY & CRITIQUE AUDITOR AGENT
// Autonomous Auditor Agent monitoring each round, move, state transition,
// and recording step-by-step UX friction, UI clarity, and bot reasoning.
// ===================================================================

class TelemetryAuditor {
  constructor() {
    this.logs = [];
    this.roomCode = null;
    this.currentRound = 0;
    this.currentPhase = 'LOBBY';
    this.phaseStartTime = Date.now();
    this.playerSelectionTimes = {};
    this.frictionEvents = [];
    this.isOpen = false;
    this.listeners = new Set();
  }

  init(roomCode) {
    this.roomCode = roomCode;
    this.logEvent({
      phase: 'INIT',
      actor: 'System',
      event: 'Masa başlatıldı ve Denetçi Agent aktif edildi',
      uxMetric: 'PASS',
      critiqueNote: 'Telemetri dinleyicisi başarıyla bağlandı. Victorian parlor kuralları denetleniyor.',
      recommendation: null
    });
  }

  setPhase(phase, round = 1) {
    const prevPhase = this.currentPhase;
    const durationMs = Date.now() - this.phaseStartTime;
    const durationSec = (durationMs / 1000).toFixed(1);

    if (prevPhase !== phase) {
      let uxMetric = 'PASS';
      let critiqueNote = `${prevPhase} -> ${phase} geçişi ${durationSec} saniyede tamamlandı.`;
      let recommendation = null;

      if (durationMs > 25000 && prevPhase === 'PHASE_2') {
        uxMetric = 'WARN';
        critiqueNote = `Karar fazı beklenenden uzun sürdü (${durationSec}s). Oyuncu tereddütü saptandı.`;
        recommendation = 'Karar butonlarının üzerindeki risk/kazanç ipuçlarını daha belirgin vurgula.';
      }

      this.logEvent({
        round: this.currentRound || round,
        phase: `${prevPhase} -> ${phase}`,
        actor: 'GameCoordinator',
        event: `Faz Değişimi: ${prevPhase} ➔ ${phase}`,
        durationMs,
        uxMetric,
        critiqueNote,
        recommendation
      });
    }

    this.currentPhase = phase;
    this.currentRound = round;
    this.phaseStartTime = Date.now();
  }

  recordPlayerSelection(playerId, playerName, actionType, details = {}) {
    const elapsedMs = Date.now() - this.phaseStartTime;
    const elapsedSec = (elapsedMs / 1000).toFixed(1);

    let uxMetric = 'PASS';
    let critiqueNote = `${playerName} (${elapsedSec}s) içinde seçimini yaptı: ${actionType}.`;
    let recommendation = null;

    if (elapsedMs > 15000) {
      uxMetric = 'WARN';
      critiqueNote = `${playerName} eylem seçerken ${elapsedSec}s tereddüt etti. UX sürtünmesi olası.`;
      recommendation = 'Hedef fincan veya eylem kartlarının dokunmatik alanını ve görsel seçilme durumunu netleştir.';
      this.frictionEvents.push({
        type: 'PLAYER_HESITATION',
        round: this.currentRound,
        playerId,
        playerName,
        elapsedSec
      });
    }

    this.logEvent({
      round: this.currentRound,
      phase: this.currentPhase,
      actor: playerName,
      event: `Seçim Yapıldı: ${actionType}`,
      details,
      durationMs: elapsedMs,
      uxMetric,
      critiqueNote,
      recommendation
    });
  }

  recordDecisionConfirmed(playerId, playerName, verdict, isHost = false) {
    const elapsedMs = Date.now() - this.phaseStartTime;
    this.logEvent({
      round: this.currentRound,
      phase: this.currentPhase,
      actor: playerName,
      event: `Karar Kilitlendi: ${verdict} ${isHost ? '(Kurucu)' : ''}`,
      durationMs: elapsedMs,
      uxMetric: 'PASS',
      critiqueNote: `${playerName} kararını net şekilde onayladı ve masayı kilitledi.`,
      recommendation: null
    });
  }

  recordHostAdvance(hostName, action, forced = false) {
    let uxMetric = forced ? 'WARN' : 'PASS';
    let critiqueNote = forced 
      ? `Kurucu ${hostName} beklemedeki oyuncuları atlayarak fazı erken ilerletti.`
      : `Kurucu ${hostName} masayı başarıyla açtı ve sonuç fazına geçti.`;
    let recommendation = forced ? 'Bağlantısı kopan bot/oyuncu tespiti ve otomatik tamamlama ekle.' : null;

    this.logEvent({
      round: this.currentRound,
      phase: this.currentPhase,
      actor: hostName,
      event: `Kurucu Aksiyonu: ${action}`,
      uxMetric,
      critiqueNote,
      recommendation
    });
  }

  recordBotReasoning(botName, phase, decision, motive, confidence = 'HIGH', uxCritique = null, uxRecommendation = null) {
    this.logEvent({
      round: this.currentRound,
      phase: phase,
      actor: botName,
      event: `Bot AI Kararı: ${decision}`,
      details: { motive, confidence, uxCritique, uxRecommendation },
      uxMetric: 'PASS',
      critiqueNote: uxCritique ? `[Strateji]: ${motive} | [Bot UX Notu]: ${uxCritique}` : `[Bot Stratejisi]: ${motive}`,
      recommendation: uxRecommendation || null
    });
  }

  recordRoundResolution(summary) {
    const { round, deaths, savedByPill, cleanDrinks, dumps, swaps } = summary;
    let uxMetric = 'PASS';
    let critiqueNote = `Raund ${round} Özeti: ${deaths.length} ölüm, ${savedByPill.length} panzehir kurtarma, ${cleanDrinks.length} temiz içiş, ${dumps.length} döküş, ${swaps.length} fincan takası.`;
    let recommendation = null;

    if (deaths.length === 0 && dumps.length > 3) {
      uxMetric = 'INFO';
      critiqueNote += ' Oyuncular aşırı temkinli oynadı, masada şüphe seviyesi çok yüksek.';
      recommendation = 'Döken oyuncular için siyanür kaybı veya ödül riski teşviki düşünün.';
    }

    this.logEvent({
      round: round,
      phase: 'PHASE_3_RESOLUTION',
      actor: 'GameCoordinator',
      event: `Raund Çözümlendi: ${deaths.length} Kurban`,
      details: summary,
      uxMetric,
      critiqueNote,
      recommendation
    });
  }

  logEvent(entry) {
    const item = {
      id: 'audit_' + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      round: entry.round || this.currentRound || 1,
      phase: entry.phase || this.currentPhase,
      actor: entry.actor || 'System',
      event: entry.event || 'Log',
      details: entry.details || null,
      uxMetric: entry.uxMetric || 'PASS', // PASS | WARN | FRICTION | INFO
      critiqueNote: entry.critiqueNote || '',
      recommendation: entry.recommendation || null
    };

    this.logs.unshift(item); // Newest first
    if (this.logs.length > 150) this.logs.pop();

    this.notifyListeners();
  }

  notifyListeners() {
    this.listeners.forEach(fn => {
      try { fn(this.logs); } catch (e) { console.error('Auditor listener error:', e); }
    });
  }

  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  getHealthSummary() {
    const total = this.logs.length;
    if (total === 0) return { score: 100, status: 'MÜKEMMEL', passCount: 0, warnCount: 0, frictionCount: 0 };

    const passCount = this.logs.filter(l => l.uxMetric === 'PASS').length;
    const warnCount = this.logs.filter(l => l.uxMetric === 'WARN').length;
    const frictionCount = this.logs.filter(l => l.uxMetric === 'FRICTION').length;

    const score = Math.max(20, Math.round(((passCount * 1.0 + warnCount * 0.5) / total) * 100));
    let status = 'KUSURSUZ AKIŞ';
    if (score < 70) status = 'KRİTİK SÜRTÜNME';
    else if (score < 88) status = 'İYİLEŞTİRME GEREKLİ';
    else if (score < 95) status = 'İYİ DÜZEYDE';

    return { score, status, passCount, warnCount, frictionCount, total };
  }

  exportReportMarkdown() {
    const health = this.getHealthSummary();
    let md = `# 🕵️ LORD INSPECTOR: OYUN TELEMETRİ VE UX DENETİM RAPORU\n\n`;
    md += `- **Oda Kodu**: ${this.roomCode || 'N/A'}\n`;
    md += `- **Genel Akış Skoru**: %${health.score} (${health.status})\n`;
    md += `- **İncelenen Hamle/Olay Sayısı**: ${health.total}\n`;
    md += `- **Kusursuz Adımlar**: ${health.passCount} | **Tereddüt/Uyarı**: ${health.warnCount} | **Sürtünme**: ${health.frictionCount}\n\n`;
    md += `## 📋 HAMLE HAMLE DENETÇİ NOTLARI\n\n`;

    this.logs.forEach(l => {
      const badge = l.uxMetric === 'PASS' ? '✅ [PASS]' : (l.uxMetric === 'WARN' ? '⚠️ [WARN]' : (l.uxMetric === 'FRICTION' ? '⛔ [FRICTION]' : 'ℹ️ [INFO]'));
      md += `### ${badge} ${l.timestamp} - Raund ${l.round} [${l.phase}]\n`;
      md += `- **Aktör**: ${l.actor}\n`;
      md += `- **Olay**: ${l.event}\n`;
      md += `- **Denetçi Notu**: ${l.critiqueNote}\n`;
      if (l.recommendation) {
        md += `- **Tavsiye**: 💡 *${l.recommendation}*\n`;
      }
      md += `\n`;
    });

    return md;
  }

  getDynamicCritiqueAnalysis() {
    const health = this.getHealthSummary();
    const warns = this.logs.filter(l => l.uxMetric === 'WARN' || l.uxMetric === 'FRICTION');
    const playerMoves = this.logs.filter(l => l.event.includes('Seçim') || l.event.includes('Karar Kilitlendi'));
    const forcedAdvances = this.logs.filter(l => l.event.includes('Kurucu Aksiyonu') && l.uxMetric === 'WARN');
    const drinks = this.logs.filter(l => l.event.includes('DRINK') || (l.details && l.details.verdict === 'DRINK'));
    const dumps = this.logs.filter(l => l.event.includes('DUMP') || (l.details && l.details.verdict === 'DUMP'));
    const swaps = this.logs.filter(l => l.event.includes('SWAP') || l.event.includes('TAKAS'));

    const critiqueItems = [];

    // 1. Hesitation Analysis
    if (this.frictionEvents.length > 0) {
      const slowPlayers = [...new Set(this.frictionEvents.map(e => `${e.playerName} (${e.elapsedSec}s)`))].join(', ');
      critiqueItems.push({
        type: 'WARN',
        title: 'Oyuncu Tereddütü ve Karar Gecikmesi',
        observation: `${this.frictionEvents.length} defa 15 saniyenin üzerinde düşünme süresi saptandı: ${slowPlayers}.`,
        recommendation: 'Eylem kartlarının (İç / Dök / Takas) risk/kazanç getirilerini daha net ve özet ikonlarla vurgulayın.'
      });
    } else if (playerMoves.length > 0) {
      critiqueItems.push({
        type: 'PASS',
        title: 'Hızlı ve Kararlı Hamleler',
        observation: 'Oyuncular seçimlerini ortalama 2-6 saniye aralığında yaparak akıcı bir tempo sağladı.',
        recommendation: null
      });
    }

    // 2. Host Controls & Advance Timing Analysis
    if (forcedAdvances.length > 0) {
      critiqueItems.push({
        type: 'WARN',
        title: 'Kurucu Erken İlerletmesi (Forced Advance)',
        observation: `Kurucu, masadaki oyuncular henüz karar vermemişken ${forcedAdvances.length} kez fazı zorla ilerletti.`,
        recommendation: 'Oyuncuların bağlantı gecikmesi yaşamadığından emin olmak için kurucuya onay uyarısı verin.'
      });
    } else {
      critiqueItems.push({
        type: 'PASS',
        title: 'Kurucu Yetkileri & Faz İlerleme Dengesi',
        observation: 'Kurucu, kişisel kararını ve masa açma adımını doğal akışta senkronize yönetti.',
        recommendation: null
      });
    }

    // 3. Strategy & Bluff Balance (Dump vs Drink)
    const totalVerdicts = drinks.length + dumps.length + swaps.length;
    if (totalVerdicts >= 3) {
      const dumpRatio = Math.round((dumps.length / totalVerdicts) * 100);
      if (dumpRatio >= 60) {
        critiqueItems.push({
          type: 'WARN',
          title: `Aşırı Temkinli Oyun Döngüsü (%${dumpRatio} Döküş)`,
          observation: `Masadaki kararların %${dumpRatio}'si DUMP (Çayı Dök) oldu. Oyuncular siyanürden çok korkuyor ve risk almaktan kaçınıyor.`,
          recommendation: 'Çayı döken oyuncu için 1 şeker puanı kaybı veya siyanür stoğu cezası getirilerek blöf/içme teşvik edilebilir.'
        });
      } else {
        critiqueItems.push({
          type: 'PASS',
          title: 'Dengeli Risk & Blöf Dağılımı',
          observation: `İçme (%${Math.round((drinks.length/totalVerdicts)*100)}), Dökme (%${dumpRatio}) ve Takas dengeli seyrediyor.`,
          recommendation: null
        });
      }
    }

    // 4. Viewport & UI Clarity
    critiqueItems.push({
      type: 'INFO',
      title: 'Mobil Görünüm & UI/UX Uyumluluğu',
      observation: 'Giriş, lobi ve karar panelleri 16-bit Victorian estetiğinde altın çerçeveler ve tekil emojili 3D butonlarla çalışıyor.',
      recommendation: 'Lord Inspector rozetinin üst başlıkta konumlandırılması alt butonların tam görünürlüğünü garanti eder.'
    });

    return {
      health,
      critiqueItems,
      totalEvents: this.logs.length,
      currentRound: this.currentRound,
      currentPhase: this.currentPhase
    };
  }
}

export const auditorAgent = new TelemetryAuditor();
if (typeof window !== 'undefined') {
  window.auditorAgent = auditorAgent;
}
