const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();
const token = process.env.TOKEN;

const bot = new TelegramBot(token, { polling: false });

module.exports = bot;
