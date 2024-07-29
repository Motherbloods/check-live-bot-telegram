const puppeteer = require("puppeteer");
const { exec } = require("child_process");
const path = require("path");

// Fungsi untuk memeriksa status live
async function checkUserLiveStatus(username) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    await page.goto(`https://www.tiktok.com/@airahdc_/live`, {
      waitUntil: "domcontentloaded", // Lebih cepat daripada "networkidle2"
      timeout: 60000,
    });

    try {
      // Tunggu elemen spesifik yang menunjukkan status live
      await page.waitForSelector("div[data-xgplayerid]", { timeout: 10000 });
    } catch (error) {
      console.error(
        "Elemen status live tidak ditemukan dalam waktu yang ditentukan"
      );
    }

    const isLive = await page.evaluate(() => {
      // Periksa keberadaan elemen yang menunjukkan live
      const liveElement = document.querySelector("div[data-xgplayerid]");
      return !!liveElement;
    });
    console.log(` live:`, isLive);

    await browser.close();
    return !liveEndedText; // Jika teks ditemukan, berarti live telah berakhir
  } catch (error) {
    console.error(error);
    await browser.close();
    return false;
  }
}

checkUserLiveStatus();
