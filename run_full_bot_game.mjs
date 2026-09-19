import puppeteer from 'puppeteer-core';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const LIVE_URL = 'https://teatime-7dc11.web.app';

async function simulateFullGame() {
  console.log('🎮 [Oyun Simülasyonu] Headless tarayıcı başlatılıyor: ' + LIVE_URL);
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
    console.log(`   [Tarayıcı ${msg.type()}]:`, msg.text());
  });
  page.on('pageerror', err => {
    console.error(`   [Tarayıcı Hata]:`, err.message);
  });

  // 1. Oda Kur
  await page.goto(LIVE_URL, { waitUntil: 'networkidle0' });
  await page.waitForSelector('#hostName', { timeout: 15000 });
  await page.type('#hostName', 'Dedektif_Poyraz');
  await page.click('#btnCreate');
  await page.waitForSelector('#btnAddBot', { timeout: 15000 });

  // 2. 5 Bot Ekle (Toplam 6 oyunculu tam masa)
  console.log('🤖 5 Bot masaya ekleniyor...');
  for (let i = 1; i <= 5; i++) {
    await page.click('#btnAddBot');
    await new Promise(r => setTimeout(r, 600));
  }

  // 3. Oyunu Başlat
  console.log('🚀 Oyun Başlatıldı!\n');
  await page.click('#btnStartGame');

  let isGameOver = false;
  let currentRound = 1;
  const gameHistory = [];

  while (!isGameOver && currentRound <= 12) {
    console.log(`\n=================== 🍵 RAUND ${currentRound} BAŞLADI ===================`);

    // --- FAZ 1: ŞEKER ATMA ---
    await new Promise(r => setTimeout(r, 1200));
    const btnModifier = await page.$('#btnAcceptModifier') || await page.$('#btnDeclineModifier');
    if (btnModifier) {
      console.log(`   🃏 Tarot Kartı Çıktı (Kör Tadım / Modifikatör)! Modal kapatılıyor...`);
      await btnModifier.click();
      await new Promise(r => setTimeout(r, 1000));
    }

    await page.waitForSelector('#btnSubmitPhase1', { timeout: 20000 });
    await new Promise(r => setTimeout(r, 800));

    // Dedektif_Poyraz hamlesini seçer (rastgele bir rakibe tatlı veya siyanür)
    const targetCards = await page.$$('.player-target-card-3col');
    if (targetCards.length > 0) {
      const randomIdx = Math.floor(Math.random() * targetCards.length);
      await targetCards[randomIdx].click();
      await new Promise(r => setTimeout(r, 300));
    }

    // %65 Tatlı şeker ikram et, %35 siyanür at (varsa)
    if (Math.random() < 0.35) {
      const btnCyanide = await page.$('#btnDropCyanide:not([disabled])');
      if (btnCyanide) {
        await btnCyanide.click();
        await new Promise(r => setTimeout(r, 300));
      }
    } else {
      const btnSweet = await page.$('#btnDropSweet');
      if (btnSweet) await btnSweet.click();
    }

    // Faz 1'i onayla
    await page.click('#btnSubmitPhase1');
    console.log(`[Faz 1] Oyuncular ve botlar şekerlerini gizlice dağıtıyor...`);

    // --- FAZ 2: KARAR ANI ---
    await page.waitForSelector('#btnVerdictDrink', { timeout: 25000 });
    await new Promise(r => setTimeout(r, 1200));

    // Masadaki şeker sayılarını oku
    const tableIntel = await page.evaluate(() => {
      const me = document.querySelector('.inventory-pixel-bar') ? document.querySelector('.inventory-pixel-bar').innerText : '';
      const cups = Array.from(document.querySelectorAll('.cup-slot-item')).map(el => {
        const name = el.querySelector('.cup-player-nametag')?.innerText.trim() || 'Bilinmeyen';
        const rawSugars = el.querySelector('.neon-sugar-num')?.innerText.trim() || '0';
        const sugars = (rawSugars === '?') ? '?? (Kör Tadım)' : parseInt(rawSugars, 10);
        return { name, sugars };
      });
      return { me, cups };
    });

    console.log(`[Faz 2] Fincanlar Masada:`);
    tableIntel.cups.forEach(c => console.log(`   ☕ ${c.name}: ${c.sugars}`));

    // Poyraz'ın kendi fincanındaki şeker miktarı
    const myCup = tableIntel.cups.find(c => c.name.includes('(Sen)') || c.name.includes('Dedektif') || c.name.includes('Poyraz')) || { sugars: 0 };
    const mySugarCount = typeof myCup.sugars === 'number' ? myCup.sugars : 1;
    console.log(`   👉 Poyraz'ın Fincanı: ${myCup.sugars}`);

    // Karar ver: Eğer fincanda 2+ şeker varsa %60 dök, 0-1 şeker varsa %75 iç
    if (mySugarCount >= 2) {
      console.log(`   🤔 Poyraz: "Fincanımda ${myCup.sugars} var, şüpheleniyorum! ÇAYI DÖKÜYORUM."`);
      await page.evaluate(() => document.getElementById('btnVerdictDump')?.click());
    } else {
      console.log(`   😋 Poyraz: "Fincanımda ${myCup.sugars} var, temiz görünüyor. ÇAYI İÇİYORUM."`);
      await page.evaluate(() => document.getElementById('btnVerdictDrink')?.click());
    }
    await new Promise(r => setTimeout(r, 600));
    const btnText = await page.evaluate(() => {
      const btn = document.getElementById('btnConfirmVerdict');
      if (btn) {
        const txt = btn.innerText.trim();
        btn.click();
        return txt;
      }
      return null;
    });
    if (btnText) {
      console.log(`   Onay butonu tıklandı: "${btnText}"`);
    }

    // --- FAZ 3: ÇÖZÜMLEME & SONUÇLAR ---
    console.log(`[Faz 3] Çözümleme bekleniyor...`);
    for (let sec = 1; sec <= 20; sec++) {
      await new Promise(r => setTimeout(r, 1000));
      const status = await page.evaluate(() => {
        const header = document.querySelector('.brand-title')?.innerText || '';
        const readyBadge = document.querySelector('.room-badge')?.innerText || '';
        const isPhase3 = !!(
          document.querySelector('.shattered-cup-scene') || 
          document.querySelector('.poisoned-cinematic-screen') || 
          document.querySelector('#btnNextRound') ||
          document.querySelector('#btnRestart') ||
          document.querySelector('.death-card') ||
          document.querySelector('.banner-relief') ||
          document.querySelector('.banner-regret')
        );
        return { header, readyBadge, isPhase3 };
      });

      if (status.isPhase3) {
        console.log(`   🎉 Faz 3 başarıyla açıldı (${sec}. saniyede)!`);
        break;
      }

      if (sec % 3 === 0) {
        console.log(`   [Bekleme ${sec}s] Durum: ${status.header} | ${status.readyBadge}`);
      }

      if (sec >= 7) {
        const btnForce = await page.$('#btnHostForcePhase3');
        if (btnForce) {
          console.log(`   ⚡ [Kurucu] Kalan botları beklemeden sonuçları açıyor (#btnHostForcePhase3)...`);
          await btnForce.click();
        }
      }
    }
    await new Promise(r => setTimeout(r, 1000));

    // Eğer Poyraz bizzat zehirlendiyse sinematik ekran çıkar, kapatıp devam et
    const poisonCinematic = await page.$('.poisoned-cinematic-screen');
    if (poisonCinematic) {
      console.log(`   ☠️ Poyraz bu raund zehirlendi ve dramatik zehir ekranını gördü!`);
      const poisonText = await page.evaluate(() => {
        return document.querySelector('.poisoned-cinematic-screen')?.innerText.replace(/\s+/g, ' ').trim() || '';
      });
      console.log(`      Sinematik: ${poisonText}`);
      const btnDismiss = await page.$('#btnPoisonContinue') || await page.$('#btnPoisonSummary');
      if (btnDismiss) {
        await btnDismiss.click();
        await new Promise(r => setTimeout(r, 1200));
      }
    }

    // Raund sonuçlarını topla
    const roundResult = await page.evaluate(() => {
      const isOver = !!document.querySelector('#btnRestart');
      const winner = document.querySelector('h2[style*="font-size:2rem"]')?.innerText.trim() || null;
      
      let personalBanner = '';
      if (document.querySelector('.banner-relief')) {
        personalBanner = document.querySelector('.banner-relief').innerText.replace(/\s+/g, ' ').trim();
      } else if (document.querySelector('.banner-regret')) {
        personalBanner = document.querySelector('.banner-regret').innerText.replace(/\s+/g, ' ').trim();
      } else if (document.querySelector('.death-card')) {
        personalBanner = '☠️ ZEHİRLENDİN VE ELENDİN!';
      } else {
        const h2 = document.querySelector('.card h2');
        if (h2) personalBanner = h2.innerText.trim();
      }

      // Leaderboard
      const leaderboard = Array.from(document.querySelectorAll('.card [style*="border-radius:8px"]')).map(el => {
        return el.innerText.replace(/\s+/g, ' ').trim();
      }).filter(t => t.includes('/ 5') || t.includes('🍬'));

      return { isOver, winner, personalBanner, leaderboard };
    });

    console.log(`\n📢 RAUND ${currentRound} SONUCU:`);
    console.log(`   🎯 Poyraz'ın Durumu: ${roundResult.personalBanner}`);
    console.log(`   📊 Skor Tablosu:`);
    roundResult.leaderboard.forEach(l => console.log(`      ${l}`));

    gameHistory.push({
      round: currentRound,
      tableIntel: tableIntel.cups,
      result: roundResult
    });

    if (roundResult.isOver) {
      console.log(`\n🏆 OYUN BİTTİ! ŞAMPİYON: ${roundResult.winner}`);
      isGameOver = true;
      break;
    }

    // Sonraki Raundu Başlat
    const clickedNext = await page.evaluate(() => {
      const btn = document.getElementById('btnNextRound') || document.getElementById('btnSpectatorNextRound');
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });
    if (clickedNext) {
      console.log(`\n➡️ Sonraki raunda geçiliyor...`);
      currentRound++;
      await new Promise(r => setTimeout(r, 1500));
    } else {
      console.log('Sonraki raund butonu bulunamadı, oyun tamamlandı sayılıyor.');
      break;
    }
  }

  console.log('\n=================== TÜM MAÇ BİTTİ ===================');
  await browser.close();
}

simulateFullGame().catch(err => {
  console.error('Simülasyon Hatası:', err);
  process.exit(1);
});
