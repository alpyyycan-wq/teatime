import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE_URL = 'http://localhost:3000';
const SCREENSHOT_DIR = path.resolve('./playtest_screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function run5RoundsHumanPlaytest() {
  console.log('🎭 [5 El İnsan/Bot Simülasyonu] Başlatılıyor...');
  console.log(`📸 Ekran görüntüleri dizini: ${SCREENSHOT_DIR}`);

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });

  await page.evaluateOnNewDocument(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('Error') || text.includes('error')) {
      console.log(`   [Browser Console Warn]: ${text}`);
    }
  });

  // 1. Giriş Ekranı
  console.log('1. Home ekranına bağlanılıyor...');
  await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
  await delay(800);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01_home_screen.png'), fullPage: false });

  // 2. Oda Kur
  console.log('2. Lord_Poyraz adıyla masa kuruluyor...');
  await page.type('#hostName', 'Lord_Poyraz', { delay: 50 });
  await page.click('#btnCreate');
  await page.waitForSelector('#btnAddBot', { timeout: 15000 });
  await delay(600);

  // 3. Masaya 5 Bot Ekle (Toplam 6 oyuncu)
  console.log('3. Masaya 5 bot ekleniyor (toplam 6 kişilik Viktorya masası)...');
  for (let b = 1; b <= 5; b++) {
    await page.click('#btnAddBot');
    await delay(450);
  }
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02_lobby_screen.png'), fullPage: false });

  // 4. Oyunu Başlat
  console.log('4. Oyun başlatılıyor...');
  await page.click('#btnStartGame');
  await delay(1200);

  // 5. 5 Raundluk Kesintisiz Oynayış
  for (let r = 1; r <= 5; r++) {
    console.log(`\n======================================================`);
    console.log(`☕ RAUND ${r} BAŞLADI (İnsan Gözüyle Hamle & Denetim)`);
    console.log(`======================================================`);

    // Modifikatör modalı kontrolü (Tarot kartı çıkarsa kabul et)
    for (let retry = 0; retry < 5; retry++) {
      const btnModAccept = await page.$('#btnAcceptModifier');
      const btnModDecline = await page.$('#btnDeclineModifier');
      if (btnModAccept || btnModDecline) {
        console.log(`   🃏 Tarot Mücadelesi çıktı (Kör Tadım)! Kabul ediliyor (#btnAcceptModifier)...`);
        if (btnModAccept) await btnModAccept.click();
        else if (btnModDecline) await btnModDecline.click();
        await delay(800);
        break;
      }
      await delay(400);
    }

    // Oyuncunun hayatta olup olmadığını kontrol et
    const isAlive = await page.evaluate(() => {
      const meDeadNotice = document.querySelector('.spectatorBadge') || document.querySelector('.room-badge');
      const isDead = meDeadNotice && meDeadNotice.innerText.includes('İZLEYİCİ');
      return !isDead;
    });

    if (isAlive) {
      // --- FAZ 1: ŞEKER ATMA ---
      console.log(`   [Faz 1] Şeker Atma Ekranı bekleniyor...`);
      // Tekrar Tarot modal kontrolü
      const btnModAgain = await page.$('#btnAcceptModifier');
      if (btnModAgain) {
        await btnModAgain.click();
        await delay(600);
      }

      await page.waitForSelector('#btnSubmitPhase1', { timeout: 25000 });
      await delay(800);

      // İnsan gibi hedef seç
      const targetCards = await page.$$('.player-target-card-3col');
      if (targetCards.length > 0) {
        const targetIdx = (r % targetCards.length);
        await targetCards[targetIdx].click();
        await delay(400);
        console.log(`   🎯 Hedef fincan seçildi (İndeks: ${targetIdx})`);
      }

      // Siyanür veya tatlı şeker seç
      if (r === 1 || r === 3 || r === 4) {
        const btnCyanide = await page.$('#btnDropCyanide:not([disabled])');
        if (btnCyanide) {
          await btnCyanide.click();
          await delay(300);
          console.log(`   ☠️ Lord_Poyraz hedefin fincanına SİYANÜR bıraktı!`);
        }
      } else {
        const btnSweet = await page.$('#btnDropSweet');
        if (btnSweet) {
          await btnSweet.click();
          await delay(300);
          console.log(`   🍬 Lord_Poyraz hedefin fincanına TATLI ŞEKER ikram etti!`);
        }
      }

      const shotP1 = path.join(SCREENSHOT_DIR, `round_${r}_phase1_drop_sugar.png`);
      await page.screenshot({ path: shotP1, fullPage: false });
      console.log(`   📸 Kaydedildi: ${shotP1}`);

      // Faz 1 Kararını Onayla
      await page.click('#btnSubmitPhase1');
      console.log(`   [Faz 1] Karar onaylandı (#btnSubmitPhase1 tıklandı).`);
      await delay(1000);

      // Eğer kurucu hızlı ilerletme butonu varsa tıkla
      const btnHostP2 = await page.$('#btnHostAdvancePhase2');
      if (btnHostP2) {
        await btnHostP2.click();
        await delay(600);
      }

      // --- FAZ 2: KARAR & BLÖF ---
      console.log(`   [Faz 2] Karar & Blöf Ekranı bekleniyor...`);
      // Tarot modal kontrolü
      const btnModP2 = await page.$('#btnAcceptModifier');
      if (btnModP2) {
        await btnModP2.click();
        await delay(600);
      }

      await page.waitForSelector('.cups-table-232', { timeout: 25000 });
      await page.waitForSelector('#btnConfirmVerdict', { timeout: 25000 });
      await delay(1200);

      // Fincanları ve şeker durumlarını oku
      const p2TableState = await page.evaluate(() => {
        const cups = Array.from(document.querySelectorAll('.cup-slot-item')).map(c => {
          const name = c.querySelector('.cup-player-nametag')?.innerText.trim() || '';
          const sugars = c.querySelector('.neon-sugar-num')?.innerText.trim() || '0';
          return `${name}: ${sugars}`;
        });
        return cups;
      });
      console.log(`   ☕ Masadaki Fincanlar: ${p2TableState.join(' | ')}`);

      // İnsan gibi karar ver (Raund 2'de SWAP, diğerlerinde DRINK veya DUMP dene)
      if (r === 2) {
        const btnSwap = await page.$('#btnVerdictSwap');
        if (btnSwap) {
          await btnSwap.click();
          await delay(400);
          // İlk rakip fincanını seç
          const otherCup = await page.$('.cup-slot-item:not(.is-me)');
          if (otherCup) {
            await otherCup.click();
            await delay(400);
            console.log(`   🔄 Lord_Poyraz TAKAS seçti ve rakibin fincanını hedefledi!`);
          }
        }
      } else if (r === 3 || r === 5) {
        const btnDump = await page.$('#btnVerdictDump');
        if (btnDump) {
          await btnDump.click();
          await delay(400);
          console.log(`   🫗 Lord_Poyraz şüphelendi ve ÇAYI DÖKMEYİ seçti!`);
        }
      } else {
        const btnDrink = await page.$('#btnVerdictDrink');
        if (btnDrink) {
          await btnDrink.click();
          await delay(400);
          console.log(`   😋 Lord_Poyraz fincanına güvendi ve ÇAYI İÇMEYİ seçti!`);
        }
      }

      const shotP2 = path.join(SCREENSHOT_DIR, `round_${r}_phase2_decision.png`);
      await page.screenshot({ path: shotP2, fullPage: false });
      console.log(`   📸 Kaydedildi: ${shotP2}`);

      // Kararı onayla
      await page.click('#btnConfirmVerdict');
      console.log(`   [Faz 2] Karar onaylandı (#btnConfirmVerdict tıklandı).`);
      await delay(1200);

      // Eğer kurucu masayı açıkla butonu varsa tıkla
      const btnHostP3 = await page.$('#btnHostRevealPhase3');
      if (btnHostP3) {
        await btnHostP3.click();
        await delay(800);
      }
    } else {
      console.log(`   👻 Lord_Poyraz elendi, izleyici modunda masayı takip ediyor...`);
      await delay(3000);
      const btnSpectatorForce = await page.$('#btnSpectatorForcePhase3');
      if (btnSpectatorForce) {
        await btnSpectatorForce.click();
        await delay(1000);
      }
    }

    // --- FAZ 3 & ZEHİR İFŞASI (PANEL 4 VE PANEL 3) ---
    console.log(`   [Faz 3] Sonuçlar / Zehir İfşası bekleniyor...`);
    let reachedResults = false;
    for (let waitSec = 1; waitSec <= 20; waitSec++) {
      await delay(1000);
      const state = await page.evaluate(() => {
        const hasPoisonScreen = !!document.querySelector('.poisoned-cinematic-screen');
        const hasResultsPanel = !!document.querySelector('.round-chronicles-panel');
        const hasLeaderboard = !!document.querySelector('.leaderboard-panel');
        const isGameOver = !!document.querySelector('#btnRematch') || !!document.querySelector('#btnRestart');
        return { hasPoisonScreen, hasResultsPanel, hasLeaderboard, isGameOver };
      });

      if (state.hasPoisonScreen) {
        console.log(`\n   💀💀💀 [PANEL 4 ZEHİRLENME EKRANI TETİKLENDİ!] 💀💀💀`);
        await delay(1000);

        // Zehirlenme ekranının detaylarını oku
        const poisonDetails = await page.evaluate(() => {
          const header = document.querySelector('.poison-header-pill')?.innerText.trim() || '';
          const alertTitle = document.querySelector('.poison-alert-title')?.innerText.trim() || '';
          const alertSub = document.querySelector('.poison-alert-sub')?.innerText.trim() || '';
          const victimName = document.querySelector('.poison-badge-card.victim .badge-player-name')?.innerText.trim() || '';
          const victimStatus = document.querySelector('.poison-badge-card.victim .badge-outcome-tag')?.innerText.trim() || '';
          const killerName = document.querySelector('.poison-badge-card.killer .badge-player-name')?.innerText.trim() || '';
          const killerBounty = document.querySelector('.poison-badge-card.killer .badge-outcome-tag')?.innerText.trim() || '';
          const story = document.querySelector('.poison-story-content')?.innerText.trim() || '';
          return { header, alertTitle, alertSub, victimName, victimStatus, killerName, killerBounty, story };
        });

        console.log(`   ┌─────────────────────────────────────────────────────────────`);
        console.log(`   │ Başlık: ${poisonDetails.header}`);
        console.log(`   │ Uyarı: ${poisonDetails.alertTitle} -> ${poisonDetails.alertSub}`);
        console.log(`   │ Kurban: ${poisonDetails.victimName} (${poisonDetails.victimStatus})`);
        console.log(`   │ Katil: ${poisonDetails.killerName} (${poisonDetails.killerBounty})`);
        console.log(`   │ Hikaye: ${poisonDetails.story}`);
        console.log(`   └─────────────────────────────────────────────────────────────`);

        const shotPoison = path.join(SCREENSHOT_DIR, `round_${r}_panel4_poison_reveal.png`);
        await page.screenshot({ path: shotPoison, fullPage: false });
        console.log(`   📸 Kaydedildi (Panel 4 Poison): ${shotPoison}`);

        // [ ➜ SONUÇLARA DEVAM ET ] butonuna tıkla
        console.log(`   👉 [ ➜ SONUÇLARA DEVAM ET ] butonuna tıklanıyor...`);
        const btnContinue = await page.$('#btnPoisonContinue');
        if (btnContinue) {
          await btnContinue.click();
          await delay(1500);
        }
      }

      if (state.hasResultsPanel || state.hasLeaderboard || state.isGameOver) {
        reachedResults = true;
        break;
      }

      if (waitSec >= 10) {
        const btnForce = await page.$('#btnHostRevealPhase3') || await page.$('#btnSpectatorForcePhase3');
        if (btnForce) {
          await btnForce.click();
        }
      }
    }

    // --- PANEL 3 RESULT PHASE DENETİMİ ---
    console.log(`   [Panel 3] Sonuç Ekranı Açıldı. İçerik denetleniyor...`);
    await delay(1200);

    const resultIntel = await page.evaluate(() => {
      const chronicles = Array.from(document.querySelectorAll('.chronicle-item')).map(el => el.innerText.replace(/\s+/g, ' ').trim());
      const leaderboard = Array.from(document.querySelectorAll('.lb-row')).map(el => {
        const rank = el.querySelector('.lb-rank')?.innerText.trim() || '';
        const name = el.querySelector('.lb-name')?.innerText.trim() || '';
        const status = el.querySelector('.lb-status')?.innerText.trim() || '';
        const score = el.querySelector('.lb-score-val')?.innerText.trim() || '';
        const delta = el.querySelector('.lb-delta')?.innerText.trim() || '';
        return `${rank} ${name} [${status}] -> ${score} (${delta})`;
      });
      const cupsOutcome = Array.from(document.querySelectorAll('.cup-slot-item')).map(el => {
        const name = el.querySelector('.cup-player-nametag')?.innerText.trim() || '';
        const badge = el.querySelector('.phase3-cup-badge')?.innerText.trim() || '';
        return `${name}: ${badge}`;
      });
      const isGameOver = !!document.querySelector('#btnRematch') || !!document.querySelector('#btnRestart');
      const winner = document.querySelector('h2[style*="font-size:2rem"]')?.innerText.trim() || null;
      return { chronicles, leaderboard, cupsOutcome, isGameOver, winner };
    });

    console.log(`\n   📜 [BU RAUND NELER YAŞANDI? - OLAY GÜNLÜĞÜ]:`);
    resultIntel.chronicles.forEach(c => console.log(`      ${c}`));

    console.log(`\n   🏆 [CANLI SKOR TABLOSU - LEADERBOARD]:`);
    resultIntel.leaderboard.forEach(l => console.log(`      ${l}`));

    console.log(`\n   ☕ [FİNCAN ROZETLERİ (2-3-2 TABLO)]:`);
    resultIntel.cupsOutcome.forEach(c => console.log(`      ${c}`));

    const shotP3 = path.join(SCREENSHOT_DIR, `round_${r}_panel3_results.png`);
    await page.screenshot({ path: shotP3, fullPage: false });
    console.log(`   📸 Kaydedildi (Panel 3 Results): ${shotP3}`);

    if (resultIntel.isGameOver) {
      console.log(`\n👑👑👑 OYUN BİTTİ! KAZANAN: ${resultIntel.winner} 👑👑👑`);
      const shotGameOver = path.join(SCREENSHOT_DIR, `game_over_winner.png`);
      await page.screenshot({ path: shotGameOver, fullPage: false });
      break;
    }

    // Sonraki Raundu Başlat
    if (r < 5) {
      console.log(`\n   👉 [ ➜ SONRAKİ RAUNDU BAŞLAT ] butonuna tıklanıyor...`);
      const btnNext = await page.$('#btnNextRound') || await page.$('#btnSpectatorNextRound');
      if (btnNext) {
        await btnNext.click();
        await delay(2000);
      } else {
        console.log(`   Sonraki raunt butonu bulunamadı.`);
      }
    }
  }

  console.log('\n======================================================');
  console.log('✅ 5 EL İNSAN OYNAYIŞ TESTİ VE GÖRSEL DENETİM TAMAMLANDI!');
  console.log('======================================================');

  await browser.close();
}

run5RoundsHumanPlaytest().catch(err => {
  console.error('❌ Playtest hatası:', err);
  process.exit(1);
});
