const chromium = require("chrome-aws-lambda");
const puppeteer = require("puppeteer-core");
const bot = require("./utils/telegram");
require("dotenv").config();

const USERNAME_TELEGRAM = process.env.USERNAME_TELEGRAM;
const USERNAME_TIKTOK = process.env.USERNAME_TIKTOK;

module.exports = async (req, res) => {
  console.log("Telegram username/chat ID:", USERNAME_TELEGRAM);
  console.log("TikTok username to monitor:", USERNAME_TIKTOK);

  let browser = null;

  try {
    console.log("Launching browser");
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();

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
      const screenshot = await page.screenshot({ encoding: "base64" });
      console.log(
        "User is live. Waiting for 3 seconds before taking screenshot..."
      );
      try {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        console.log("Taking screenshot...");

        await bot.sendPhoto(
          USERNAME_TELEGRAM,
          Buffer.from(screenshot, "base64"),
          {
            caption: `@${USERNAME_TIKTOK} is live!`,
          }
        );
        console.log("Screenshot sent to Telegram");
      } catch (e) {
        console.log(e.response.body);
        throw error;
      }
      res
        .status(200)
        .json({ message: "User is live, screenshot sent to Telegram" });
    } else {
      console.log("User is not live");
      res.status(200).json({ message: "User is not live" });
    }
  } catch (e) {
    console.error("Error:", e.message);
    if (e.response) {
      console.error("Response body:", e.response.body);
    }
    res.status(500).json({ error: error.message });
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
};
