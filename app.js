const chromium = require("@sparticuz/chromium");
const puppeteer = require("puppeteer-core");
const bot = require("./utils/telegram");
require("dotenv").config();

const USERNAME_TELEGRAM = process.env.USERNAME_TELEGRAM;
const USERNAME_TIKTOK = process.env.USERNAME_TIKTOK;

module.exports = async (req, res) => {
  if (req.method === "GET" && req.url === "/live") {
    // console.log("Telegram username/chat ID:", USERNAME_TELEGRAM);
    // console.log("TikTok username to monitor:", USERNAME_TIKTOK);

    let browser = null;

    try {
      console.log("Launching browser");
      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
        timeout: 60000, // Set timeout to 30 seconds
      });

      const page = await browser.newPage();

      if (!bot) {
        throw new Error("Telegram bot is not initialized properly");
      }

      console.log("Checking TikTok live status...");
      await page.goto(`https://www.tiktok.com/${USERNAME_TIKTOK}/live`, {
        waitUntil: "domcontentloaded", // Lebih cepat daripada "networkidle2"
        timeout: 60000,
      });

      // const isLive = await page.evaluate(() => {
      //   // Periksa keberadaan elemen yang menunjukkan live
      //   const liveElement = document.querySelector("div[data-xgplayerid]");
      //   return !!liveElement;
      // });
      // console.log(`Is ${USERNAME_TIKTOK} live:`, isLive);

      // console.log(
      //   `User is ${
      //     isLive ? "live" : "not live"
      //   } Waiting for 10 seconds before taking screenshot...`
      // );
      try {
        for (let i = 1; i <= 30; i++) {
          await new Promise((resolve) =>
            setTimeout(() => {
              console.log(`Waited ${i} second${i > 1 ? "s" : ""}`);
              resolve();
            }, 1000)
          );
        }
        console.log("Taking screenshot...");
        const screenshot = await page.screenshot({ encoding: "base64" });
        console.log("is screenshot");
        await bot.sendPhoto(
          USERNAME_TELEGRAM,
          Buffer.from(screenshot, "base64"),
          {
            caption: `${USERNAME_TIKTOK}`,
          }
        );
        console.log("Screenshot sent to Telegram");
      } catch (e) {
        console.log(e.response.body);
        throw e;
      }
      res.status(200).json({
        message: `User`,
      });
    } catch (e) {
      console.error("Error:", e.message);
      if (e.response) {
        console.error("Response body:", e);
      }
      res.status(500).json({ error: e.message });
    } finally {
      if (browser !== null) {
        await browser.close();
      }
    }
  } else {
    res.status(404).json({ error: "Not found" });
  }
};
