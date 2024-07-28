const puppeteer = require("puppeteer");
const bot = require("./utils/telegram");
require("dotenv").config();

const USERNAME_TELEGRAM = process.env.USERNAME_TELEGRAM;
const USERNAME_TIKTOK = process.env.USERNAME_TIKTOK;

console.log("Telegram username/chat ID:", USERNAME_TELEGRAM);
console.log("TikTok username to monitor:", USERNAME_TIKTOK);

async function checkTiktokLive() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  try {
    if (!bot) {
      throw new Error("Telegram bot is not initialized properly");
    }

    console.log("Checking TikTok live status...");
    await page.goto(`https://www.tiktok.com/${USERNAME_TIKTOK}/live`, {
      waitUntil: "networkidle2",
    });

    const isLive = await page.evaluate(() => {
      return document.body.innerText.includes("LIVE has ended");
    });
    console.log(`Is ${USERNAME_TIKTOK} live:`, isLive);

    if (isLive) {
      console.log(
        "User is live. Waiting for 3 seconds before taking screenshot..."
      );
      await new Promise((resolve) => setTimeout(resolve, 3000));
      console.log("Taking screenshot...");
      await page.screenshot({ path: "screenshot.png" });
      console.log("Screenshot taken. Sending to Telegram...");
      await bot.sendPhoto(USERNAME_TELEGRAM, "screenshot.png", {
        caption: `${USERNAME_TIKTOK} is live!`,
      });
      console.log("Screenshot sent to Telegram");
    } else {
      console.log("User is not live");
    }
  } catch (e) {
    console.error("Error:", e.message);
    if (e.response) {
      console.error("Response body:", e.response.body);
    }
  } finally {
    await browser.close();
  }
}

checkTiktokLive();
