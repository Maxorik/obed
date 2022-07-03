const TelegramApi = require('node-telegram-bot-api');
const token = '5586636515:AAFpLAV-BtLPkKCu3rRKNfSsdk12N8KL7dU';
const bot = new TelegramApi(token, {polling: true});
const axios = require('axios');
const cron = require('node-cron');

bot.on('message', msg => {
    const chatId = msg.chat.id;

    axios
        .get('https://somedata-e3056-default-rtdb.firebaseio.com/obed.json')
        .then(res => {
            let list = res.data,
                key = Object.keys(list)[0];
            bot.sendMessage(chatId, `${msg.from.first_name}, привет! \nСсылка на сегодняшний заказ: ${res.data[key].code}`)
        })
        .catch(error => {
            console.error(error);
        });

    cron.schedule('50 17 * * *', () => {
        bot.sendMessage(chatId, `${msg.from.first_name}, ЗДАРОВА! \nСсылка на сегодняшний заказ: ${res.data[key].code}`);
    });
});