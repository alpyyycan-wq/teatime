// Admin Panel & Game Log Explorer for Cup of Tea
import { DB } from './firebaseConfig.js';

let roomsData = {};
let selectedRoomCode = null;
let selectedRoundFilter = 'ALL';
let statusFilter = 'ALL'; // ALL | COMPLETED | ACTIVE
let searchQuery = '';
let activeTab = 'timeline'; // timeline | raw | players
let unsubscribeListener = null;

export function initAdminPanel(containerEl, onExit) {
  selectedRoomCode = null;
  selectedRoundFilter = 'ALL';
  statusFilter = 'ALL';
  searchQuery = '';
  activeTab = 'timeline';

  // Expand container for desktop
  containerEl.classList.add('admin-mode');

  renderLayout(containerEl, onExit);

  // Listen to all rooms in real-time
  DB.listen('rooms', (data) => {
    roomsData = data || {};
    // Auto-select latest room if none selected
    if (!selectedRoomCode || !roomsData[selectedRoomCode]) {
      const roomKeys = Object.keys(roomsData);
      if (roomKeys.length > 0) {
        // Sort to pick the one with highest rounds or most logs
        roomKeys.sort((a, b) => {
          const countA = (roomsData[a].detailedLogs || []).length;
          const countB = (roomsData[b].detailedLogs || []).length;
          return countB - countA;
        });
        selectedRoomCode = roomKeys[0];
      }
    }
    updateAdminUI(containerEl, onExit);
  });
}

export function cleanupAdminPanel(containerEl) {
  containerEl.classList.remove('admin-mode');
  roomsData = {};
  selectedRoomCode = null;
}

function renderLayout(containerEl, onExit) {
  containerEl.innerHTML = `
    <div class="admin-wrapper">
      <!-- Admin Top Navbar -->
      <header class="admin-header">
        <div class="admin-brand">
          <div class="admin-logo">🕵️</div>
          <div>
            <h1 class="admin-title">CUP OF TEA - ADMIN PANEL</h1>
            <p class="admin-subtitle">Oyun Geçmişi, Raund Logları ve Canlı Masa İzleyici</p>
          </div>
        </div>
        <div class="admin-actions">
          <span class="badge-live" title="Firebase RTDB Bağlantısı Aktif">🟢 Canlı Veri</span>
          <button class="btn btn-sm btn-admin-exit" id="btnAdminExit">← Oyuna Dön</button>
        </div>
      </header>

      <!-- Main Admin Grid: Sidebar + Inspector -->
      <div class="admin-grid">
        <!-- Left: Rooms List -->
        <aside class="admin-sidebar" id="adminSidebar">
          <div class="admin-sidebar-header">
            <div class="admin-search-box">
              <span style="font-size:0.9rem;">🔍</span>
              <input type="text" id="adminSearchInput" placeholder="Oda kodu veya oyuncu ara..." value="${searchQuery}" />
            </div>
            <div class="admin-filter-chips">
              <button class="chip ${statusFilter === 'ALL' ? 'active' : ''}" data-filter="ALL">Tümü</button>
              <button class="chip ${statusFilter === 'COMPLETED' ? 'active' : ''}" data-filter="COMPLETED">Bitmiş</button>
              <button class="chip ${statusFilter === 'ACTIVE' ? 'active' : ''}" data-filter="ACTIVE">Canlı</button>
            </div>
          </div>
          <div class="admin-rooms-list" id="adminRoomsList">
            <div style="padding:20px; text-align:center; color:var(--text-muted);">Yükleniyor...</div>
          </div>
        </aside>

        <!-- Right: Room Details & Logs -->
        <main class="admin-main" id="adminMainContent">
          <div style="padding:40px; text-align:center; color:var(--text-muted);">
            Lütfen incelemek istediğiniz bir odayı seçin.
          </div>
        </main>
      </div>
    </div>
  `;

  // Bind exit
  const exitBtn = document.getElementById('btnAdminExit');
  if (exitBtn) {
    exitBtn.onclick = () => {
      cleanupAdminPanel(containerEl);
      if (onExit) onExit();
    };
  }

  // Bind search input
  const searchInput = document.getElementById('adminSearchInput');
  if (searchInput) {
    searchInput.oninput = (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      updateAdminUI(containerEl, onExit);
    };
  }

  // Bind filter chips
  const chips = containerEl.querySelectorAll('.admin-filter-chips .chip');
  chips.forEach(chip => {
    chip.onclick = () => {
      statusFilter = chip.dataset.filter;
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      updateAdminUI(containerEl, onExit);
    };
  });
}

function updateAdminUI(containerEl, onExit) {
  renderRoomsList(containerEl, onExit);
  renderSelectedRoomDetails(containerEl);
}

function renderRoomsList(containerEl, onExit) {
  const listEl = document.getElementById('adminRoomsList');
  if (!listEl) return;

  const roomCodes = Object.keys(roomsData);

  if (roomCodes.length === 0) {
    listEl.innerHTML = `
      <div style="padding:30px; text-align:center; color:var(--text-muted); font-size:0.9rem;">
        Veritabanında kayıtlı oda bulunamadı.
      </div>
    `;
    return;
  }

  // Filter and sort rooms (newest/most detailed first)
  const filtered = roomCodes.filter(code => {
    const r = roomsData[code];
    if (!r) return false;

    // Status filter
    if (statusFilter === 'COMPLETED' && r.status !== 'GAME_OVER') return false;
    if (statusFilter === 'ACTIVE' && r.status === 'GAME_OVER') return false;

    // Search filter
    if (searchQuery) {
      const codeMatch = code.toLowerCase().includes(searchQuery);
      const playerNames = Object.values(r.players || {}).map(p => (p.name || '').toLowerCase()).join(' ');
      const playerMatch = playerNames.includes(searchQuery);
      if (!codeMatch && !playerMatch) return false;
    }

    return true;
  });

  filtered.sort((a, b) => {
    const logsA = (roomsData[a].detailedLogs || []).length;
    const logsB = (roomsData[b].detailedLogs || []).length;
    return logsB - logsA;
  });

  if (filtered.length === 0) {
    listEl.innerHTML = `
      <div style="padding:30px; text-align:center; color:var(--text-muted); font-size:0.85rem;">
        Aramaya uygun oda bulunamadı.
      </div>
    `;
    return;
  }

  listEl.innerHTML = filtered.map(code => {
    const r = roomsData[code];
    const isSelected = code === selectedRoomCode;
    const players = Object.values(r.players || {});
    const isOver = r.status === 'GAME_OVER';
    const roundCount = r.round || 1;
    const logCount = (r.detailedLogs || []).length;

    let statusPill = '';
    if (isOver) {
      statusPill = `<span class="room-pill pill-over">🏆 ${r.winner || 'Bitti'}</span>`;
    } else if (r.status === 'LOBBY') {
      statusPill = `<span class="room-pill pill-lobby">Lobi</span>`;
    } else {
      statusPill = `<span class="room-pill pill-active">${r.status}</span>`;
    }

    return `
      <div class="admin-room-item ${isSelected ? 'selected' : ''}" data-code="${code}">
        <div class="room-item-top">
          <span class="room-code-badge">${code}</span>
          ${statusPill}
        </div>
        <div class="room-item-players">
          👥 ${players.map(p => `${p.isBot ? '🤖' : ''}${escapeHtml(p.name)}`).join(', ') || 'Oyuncu yok'}
        </div>
        <div class="room-item-meta">
          <span>Raund: <strong>${roundCount}</strong></span>
          <span>Log: <strong>${logCount}</strong> olay</span>
        </div>
      </div>
    `;
  }).join('');

  // Bind clicks
  listEl.querySelectorAll('.admin-room-item').forEach(item => {
    item.onclick = () => {
      selectedRoomCode = item.dataset.code;
      selectedRoundFilter = 'ALL';
      updateAdminUI(containerEl, onExit);
    };
  });
}

function renderSelectedRoomDetails(containerEl) {
  const mainEl = document.getElementById('adminMainContent');
  if (!mainEl) return;

  if (!selectedRoomCode || !roomsData[selectedRoomCode]) {
    mainEl.innerHTML = `
      <div class="admin-empty-state">
        <div style="font-size:3rem; margin-bottom:12px;">☕</div>
        <p style="font-size:1.1rem; font-weight:700;">Bir oda seçin</p>
        <p style="font-size:0.85rem; color:var(--text-muted);">Sol listeden geçmiş veya canlı bir oyun seçerek tüm logları inceleyebilirsiniz.</p>
      </div>
    `;
    return;
  }

  const room = roomsData[selectedRoomCode];
  const players = Object.values(room.players || {});
  const detailedLogs = room.detailedLogs || [];
  const maxRound = room.round || 1;

  // Extract available rounds from logs + current round
  const roundSet = new Set();
  detailedLogs.forEach(l => { if (l.round) roundSet.add(l.round); });
  for (let r = 1; r <= maxRound; r++) roundSet.add(r);
  const availableRounds = Array.from(roundSet).sort((a, b) => a - b);

  // Filter logs by selected round if not ALL
  const displayedLogs = selectedRoundFilter === 'ALL'
    ? detailedLogs
    : detailedLogs.filter(l => l.round === Number(selectedRoundFilter));

  mainEl.innerHTML = `
    <div class="admin-detail-view">
      <!-- Room Hero Card -->
      <div class="admin-room-hero">
        <div class="hero-left">
          <div style="display:flex; align-items:center; gap:12px; margin-bottom:6px;">
            <span class="hero-code">${room.code}</span>
            <span class="hero-status ${room.status}">${formatStatusLabel(room.status)}</span>
            ${room.isDuel ? '<span class="hero-duel">⚡ DÜELLO</span>' : ''}
          </div>
          <div class="hero-meta">
            <span>Kurucu: <strong>${escapeHtml(getHeroHostName(room))}</strong></span>
            <span>•</span>
            <span>Mevcut Raund: <strong>${room.round || 1}</strong></span>
            <span>•</span>
            <span>Toplam Oyuncu: <strong>${players.length}</strong></span>
            <span>•</span>
            <span>Toplam Log: <strong>${detailedLogs.length}</strong></span>
          </div>
        </div>
        <div class="hero-right">
          ${room.status === 'GAME_OVER' ? `
            <div class="hero-winner-box">
              <span style="font-size:1.4rem;">👑</span>
              <div>
                <div style="font-size:0.7rem; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:var(--text-muted);">ŞAMPİYON</div>
                <div style="font-size:1.15rem; font-weight:900; color:var(--btn-espresso);">${escapeHtml(room.winner || 'Belirsiz')}</div>
              </div>
            </div>
          ` : `
            <div class="hero-active-box">
              <span style="font-size:1.2rem;">⏱️</span>
              <div>
                <div style="font-size:0.7rem; font-weight:700; color:var(--text-muted);">CANLI DURUM</div>
                <div style="font-size:0.95rem; font-weight:800;">${room.status}</div>
              </div>
            </div>
          `}
          <button class="btn btn-sm btn-delete-room" id="btnDeleteRoom" title="Bu odayı veritabanından kalıcı sil">
            🗑️ Odayı Sil
          </button>
        </div>
      </div>

      <!-- Players Status Overview Cards -->
      <div class="admin-section-card">
        <div class="section-title">
          <span>👥 Masadaki Oyuncular ve Canlı Durumları</span>
          <span style="font-size:0.75rem; font-weight:600; color:var(--text-muted);">${players.length} Oyuncu</span>
        </div>
        <div class="admin-players-grid">
          ${players.map(p => renderPlayerCard(p)).join('')}
        </div>
      </div>

      <!-- Log Navigation & View Mode Tabs -->
      <div class="admin-log-controls">
        <div class="admin-round-tabs">
          <button class="round-tab ${selectedRoundFilter === 'ALL' ? 'active' : ''}" data-round="ALL">
            Tüm Raundlar (${detailedLogs.length})
          </button>
          ${availableRounds.map(r => `
            <button class="round-tab ${selectedRoundFilter === String(r) ? 'active' : ''}" data-round="${r}">
              Raund ${r} (${detailedLogs.filter(l => l.round === r).length})
            </button>
          `).join('')}
        </div>

        <div class="admin-view-toggle">
          <button class="toggle-tab ${activeTab === 'timeline' ? 'active' : ''}" data-tab="timeline">
            📖 Hikaye Akışı
          </button>
          <button class="toggle-tab ${activeTab === 'raw' ? 'active' : ''}" data-tab="raw">
            💻 Ham JSON (${displayedLogs.length})
          </button>
          <button class="btn btn-sm btn-copy-log" id="btnCopyJson" title="JSON'u Panoya Kopyala">
            📋 Kopyala
          </button>
        </div>
      </div>

      <!-- Main Display: Timeline vs Raw JSON -->
      <div class="admin-log-container">
        ${activeTab === 'timeline' 
          ? renderTimelineView(displayedLogs, selectedRoundFilter, room)
          : renderRawJsonView(displayedLogs)
        }
      </div>
    </div>
  `;

  // Bind round tabs
  mainEl.querySelectorAll('.admin-round-tabs .round-tab').forEach(tab => {
    tab.onclick = () => {
      selectedRoundFilter = tab.dataset.round;
      renderSelectedRoomDetails(containerEl);
    };
  });

  // Bind view toggle tabs
  mainEl.querySelectorAll('.admin-view-toggle .toggle-tab').forEach(tab => {
    tab.onclick = () => {
      activeTab = tab.dataset.tab;
      renderSelectedRoomDetails(containerEl);
    };
  });

  // Bind Copy JSON button
  const copyBtn = document.getElementById('btnCopyJson');
  if (copyBtn) {
    copyBtn.onclick = () => {
      const jsonStr = JSON.stringify(displayedLogs, null, 2);
      navigator.clipboard.writeText(jsonStr).then(() => {
        copyBtn.textContent = '✅ Kopyalandı!';
        setTimeout(() => { copyBtn.textContent = '📋 Kopyala'; }, 2000);
      }).catch(() => {
        alert('Kopyalanamadı!');
      });
    };
  }

  // Bind Delete Room button
  const delBtn = document.getElementById('btnDeleteRoom');
  if (delBtn) {
    delBtn.onclick = async () => {
      if (confirm(`'${selectedRoomCode}' kodlu odayı veritabanından kalıcı olarak silmek istediğinizden emin misiniz?`)) {
        await DB.remove(`rooms/${selectedRoomCode}`);
        selectedRoomCode = null;
        updateAdminUI(containerEl);
      }
    };
  }
}

function renderPlayerCard(p) {
  const isAlive = p.alive;
  const isCupPoisoned = p.cupPoisoned;
  const skipsUsed = p.skips || 0;
  const remainingSkips = Math.max(0, 2 - skipsUsed);

  return `
    <div class="admin-player-card ${isAlive ? 'alive' : 'dead'}">
      <div class="p-card-header">
        <span class="p-card-name">
          ${p.isBot ? '🤖' : (isAlive ? '❤️' : '💀')} ${escapeHtml(p.name)}
          ${p.isHost ? '<span class="host-pill">Kurucu</span>' : ''}
          ${p.isBot ? '<span class="host-pill" style="background:#1a73e8;">BOT</span>' : ''}
        </span>
        <span class="p-card-status-pill ${isAlive ? 'pill-alive' : 'pill-dead'}">
          ${isAlive ? 'Hayatta' : 'Elendi'}
        </span>
      </div>

      <div class="p-card-body">
        <div class="p-stat-row">
          <span class="p-stat-label">🍵 Fincan Durumu:</span>
          <span class="p-stat-val ${isCupPoisoned ? 'poisoned' : 'clean'}">
            ${isCupPoisoned ? '☠️ ZEHİRLİ' : '💧 Temiz'}
          </span>
        </div>
        <div class="p-stat-row">
          <span class="p-stat-label">🛑 Pas Hakkı:</span>
          <span class="p-stat-val ${remainingSkips === 0 ? 'exhausted' : ''}">
            ${skipsUsed}/2 Kullanıldı (${remainingSkips} Hak Kaldı)
          </span>
        </div>
        <div class="p-stat-row">
          <span class="p-stat-label">🧪 Zehir Deposu:</span>
          <span class="p-stat-val">${p.poison > 0 ? '1 Doz Hazır' : '0 (Boş)'}</span>
        </div>
        <div class="p-stat-row">
          <span class="p-stat-label">💊 Panzehir (Pill):</span>
          <span class="p-stat-val ${p.pill > 0 ? 'has-pill' : 'no-pill'}">
            ${p.pill > 0 ? '1 Doz Mevcut' : '0 (Tükendi)'}
          </span>
        </div>
        ${p.decision ? `
          <div class="p-decision-box">
            <span style="font-size:0.7rem; font-weight:700; color:var(--text-muted); text-transform:uppercase;">Son Karar:</span>
            <span style="font-size:0.78rem; font-weight:700; color:var(--btn-espresso);">
              ${p.decision.drink ? '🍵 İçti' : '🛑 Pas Geçti'} | Hamle: ${p.decision.action ? p.decision.action.type : 'Yok'}
            </span>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

function renderTimelineView(logs, roundFilter, room) {
  if (logs.length === 0) {
    return `
      <div style="padding:40px; text-align:center; color:var(--text-muted); font-size:0.95rem;">
        Bu filtreye ait herhangi bir olay kaydı bulunamadı.
      </div>
    `;
  }

  // Group logs by round
  const roundsMap = {};
  logs.forEach(log => {
    const r = log.round || 1;
    if (!roundsMap[r]) roundsMap[r] = [];
    roundsMap[r].push(log);
  });

  const sortedRounds = Object.keys(roundsMap).map(Number).sort((a, b) => a - b);

  return `
    <div class="timeline-container">
      ${sortedRounds.map(roundNum => {
        const roundLogs = roundsMap[roundNum];
        return renderRoundTimeline(roundNum, roundLogs, room);
      }).join('')}
    </div>
  `;
}

function renderRoundTimeline(roundNum, logs, room) {
  // Break down events into Phase 1, Phase 2, Phase 3, and End
  const phase1Events = logs.filter(l => l.type === 'POISON' || l.type === 'SWAP_OFFER');
  const phase2Events = logs.filter(l => l.type.startsWith('SWAP_') && l.type !== 'SWAP_OFFER');
  const phase3Events = logs.filter(l => l.type === 'DRINK_CLEAN' || l.type === 'DRINK_POISONED' || l.type === 'SKIP' || l.type === 'POISONED_PILL');
  const endEvents = logs.filter(l => l.type === 'DEATH' || l.type === 'WINNER' || l.type === 'MUTUAL_DEATH');

  return `
    <div class="round-timeline-card">
      <div class="round-card-header">
        <span class="round-badge">RAUND ${roundNum}</span>
        <span style="font-size:0.8rem; font-weight:700; color:var(--text-muted);">${logs.length} Olay Kaydedildi</span>
      </div>

      <div class="round-card-body">
        <!-- Faz 1: Gizli Kararlar & Zehirleme -->
        <div class="phase-block">
          <div class="phase-heading">
            <span class="phase-icon">🧪</span>
            <span class="phase-title">1. Faz: Gizli Kararlar & Zehirleme / Hamle</span>
          </div>
          <div class="phase-events">
            ${phase1Events.length > 0 ? phase1Events.map(e => formatEventHtml(e)).join('') : `
              <div class="empty-event-text">Bu fazda doğrudan zehir veya takas teklifi kaydı yok (oyuncular pas geçmiş olabilir).</div>
            `}
          </div>
        </div>

        <!-- Faz 2: Tartışma & Fincan Takasları -->
        <div class="phase-block">
          <div class="phase-heading">
            <span class="phase-icon">🤝</span>
            <span class="phase-title">2. Faz: Tartışma & Fincan Takası Sonuçları</span>
          </div>
          <div class="phase-events">
            ${phase2Events.length > 0 ? phase2Events.map(e => formatEventHtml(e)).join('') : `
              <div class="empty-event-text">Bu raund fincan takası gerçekleşmedi.</div>
            `}
          </div>
        </div>

        <!-- Faz 3: İçme & Hayatta Kalma -->
        <div class="phase-block">
          <div class="phase-heading">
            <span class="phase-icon">🍵</span>
            <span class="phase-title">3. Faz: İçme, Pas & Çözümleme</span>
          </div>
          <div class="phase-events">
            ${phase3Events.length > 0 ? phase3Events.map(e => formatEventHtml(e)).join('') : `
              <div class="empty-event-text">İçme olayı kaydedilmedi.</div>
            `}
          </div>
        </div>

        <!-- Raund Sonu & Elenmeler / Şampiyonluk -->
        ${endEvents.length > 0 ? `
          <div class="phase-block end-phase-block">
            <div class="phase-heading">
              <span class="phase-icon">⚖️</span>
              <span class="phase-title">Raund Sonu & Elenme / Şampiyonluk</span>
            </div>
            <div class="phase-events">
              ${endEvents.map(e => formatEventHtml(e)).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

function formatEventHtml(ev) {
  let icon = '🔹';
  let desc = '';
  let badgeClass = 'badge-default';

  switch (ev.type) {
    case 'POISON':
      icon = '🧪';
      badgeClass = 'badge-poison';
      desc = `<strong>${escapeHtml(ev.actor)}</strong>, <strong>${escapeHtml(ev.target)}</strong>'ın fincanına gizlice ZEHİR kattı!`;
      break;
    case 'SWAP_OFFER':
      icon = '🔄';
      badgeClass = 'badge-swap';
      desc = `<strong>${escapeHtml(ev.actor)}</strong>, <strong>${escapeHtml(ev.target)}</strong>'a fincan takası teklif etti.`;
      break;
    case 'SWAP_ACCEPTED':
      icon = '🤝';
      badgeClass = 'badge-swap-accepted';
      desc = `<strong>${escapeHtml(ev.to)}</strong>, <strong>${escapeHtml(ev.from)}</strong>'in takas teklifini <strong>KABUL ETTİ</strong> (fincanlar yer değiştirdi).`;
      break;
    case 'SWAP_REJECTED':
      icon = '❌';
      badgeClass = 'badge-swap-rejected';
      desc = `<strong>${escapeHtml(ev.to)}</strong>, <strong>${escapeHtml(ev.from)}</strong>'in takas teklifini <strong>REDDETTİ</strong>.`;
      break;
    case 'SWAP_CANCELLED':
      icon = '⚠️';
      badgeClass = 'badge-swap-cancelled';
      desc = `<strong>${escapeHtml(ev.from)}</strong> ile <strong>${escapeHtml(ev.to)}</strong> arasındaki takas <strong>İPTAL EDİLDİ</strong> (çifte takas çakışması).`;
      break;
    case 'SWAP_EXPIRED':
      icon = '⌛';
      badgeClass = 'badge-swap-expired';
      desc = `<strong>${escapeHtml(ev.from)}</strong>'in <strong>${escapeHtml(ev.to)}</strong>'a teklifi yanıtsız kalarak zaman aşımına uğradı.`;
      break;
    case 'DRINK_CLEAN':
      icon = '☕';
      badgeClass = 'badge-clean';
      desc = `<strong>${escapeHtml(ev.actor)}</strong> çayını İÇTİ (Temiz çaydı, hayatta kaldı ve +1 zehir kazandı).`;
      break;
    case 'DRINK_POISONED':
      icon = '☠️';
      badgeClass = 'badge-poisoned-drink';
      desc = `<strong>${escapeHtml(ev.actor)}</strong> çayını İÇTİ (<strong>ÇAY ZEHİRLİYDİ!</strong>)`;
      break;
    case 'SKIP':
      icon = '🛑';
      badgeClass = 'badge-skip';
      desc = `<strong>${escapeHtml(ev.actor)}</strong> çayını PAS GEÇTİ (İçmedi, fincandaki durum korundu).`;
      break;
    case 'POISONED_PILL':
      icon = '💊';
      badgeClass = 'badge-pill';
      desc = `<strong>${escapeHtml(ev.actor)}</strong> zehirlendi ama panzehiri (Pill) otomatik devreye girerek HAYATINI KURTARDI (+1 Zehir kazandı)!`;
      break;
    case 'DEATH':
      icon = '💀';
      badgeClass = 'badge-death';
      desc = `<strong>${escapeHtml(ev.actor)}</strong> zehirli çay sebebiyle <strong>ELENDİ VE ÖLDÜ!</strong>`;
      break;
    case 'WINNER':
      icon = '👑';
      badgeClass = 'badge-winner';
      desc = `ŞAMPİYON: <strong>${escapeHtml(ev.winner)}</strong> (Tüm rakiplerini alt etti)!`;
      break;
    case 'MUTUAL_DEATH':
      icon = '🍻';
      badgeClass = 'badge-death';
      desc = `ÇİFTE CİNAYET! Masadaki herkes aynı anda zehirlendi!`;
      break;
    default:
      desc = JSON.stringify(ev);
  }

  return `
    <div class="event-item ${badgeClass}">
      <span class="event-icon">${icon}</span>
      <div class="event-desc">${desc}</div>
      <span class="event-type-badge">${ev.type}</span>
    </div>
  `;
}

function renderRawJsonView(logs) {
  const jsonStr = JSON.stringify(logs, null, 2);
  return `
    <div class="raw-json-card">
      <pre class="raw-json-code"><code>${escapeHtml(jsonStr)}</code></pre>
    </div>
  `;
}

function getHeroHostName(room) {
  if (room.players && room.hostId && room.players[room.hostId]) {
    return room.players[room.hostId].name;
  }
  return 'Bilinmiyor';
}

function formatStatusLabel(status) {
  switch (status) {
    case 'GAME_OVER': return 'BİTTİ (GAME OVER)';
    case 'LOBBY': return 'LOBİDE';
    case 'PHASE_1': return '1. FAZ (Gizli Kararlar)';
    case 'PHASE_2': return '2. FAZ (Tartışma & Takas)';
    case 'PHASE_3': return '3. FAZ (Sonuçlar)';
    default: return status || 'Bilinmiyor';
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
