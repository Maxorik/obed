const TelegramApi = require('node-telegram-bot-api');
const token = '5586636515:AAFpLAV-BtLPkKCu3rRKNfSsdk12N8KL7dU';
const bot = new TelegramApi(token, {polling: true});
const axios = require('axios');

bot.on('message', msg => {
    const chatId = msg.chat.id;

    axios
        .get('https://velum-song-list-default-rtdb.firebaseio.com/obed.json')
        .then(res => {
            let list = res.data,
                key = Object.keys(list)[0];
            bot.sendMessage(chatId, `Ссылка на сегодняшний заказ, ${res.data[key].code}!`)
        })
        .catch(error => {
            console.error(error);
        });
});
