const TelegramApi = require("node-telegram-bot-api");
const fetch = require("node-fetch");

const token = "6079511053:AAEZKGM0HMUCDky2NAPg6s2eGcoTzNUA-7U";

const bot = new TelegramApi(token, { polling: true });

const getCurrency = async (currencyName) => {
  const url = `https://api.currencyapi.com/v3/latest?apikey=vELci4z5Che0Q8KaBk5BUAjQTBHzYZC4NiPw6EDp&currencies=RUB&base_currency=${currencyName}`;

  const response = await fetch(url);
  const data = await response.json();
  return data;
};

const options = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [{ text: "Доллар США", callback_data: "USD" }],
      [{ text: "Евро", callback_data: "EUR" }],
      [{ text: "Дирхам ОАЭ", callback_data: "AED" }],
      [{ text: "Британский фунт", callback_data: "GBP" }],
    ],
  }),
};

bot.on("message", async (msg) => {
  const text = msg.text;
  const chatId = msg.chat.id;

  if (text === "/start") {
    bot.sendMessage(
      chatId,
      "Напишите название валюты и бот вернет её курс к рублю. Например USD.",
      options
    );
  } else {
    try {
      const data = await getCurrency(text);
      const value = data.data.RUB.value;
      bot.sendMessage(
        chatId,
        `1 ${text} равен ${value.toFixed(2)} Российский рубль`
      );
    } catch {
      bot.sendMessage(chatId, "Нет такой валюты");
    }
  }
});

bot.on("callback_query", async (msg) => {
  const answer = msg.data;

  try {
    const data = await getCurrency(answer);
    const value = data.data.RUB.value;
    bot.sendMessage(
      msg.from.id,
      `1 ${answer} равен ${value.toFixed(2)} Российский рубль`
    );
  } catch {
    bot.sendMessage(msg.from.id, "Нет такой валюты");
  }
});
