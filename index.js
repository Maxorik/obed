const TelegramApi = require('node-telegram-bot-api');
const token = '5586636515:AAFpLAV-BtLPkKCu3rRKNfSsdk12N8KL7dU';
const bot = new TelegramApi(token, {polling: true});
const axios = require('axios');
const cron = require('node-cron');

bot.on('message', msg => {
    const chatId = msg.chat.id;
    let linkMessage = '';

    axios
        .get('https://somedata-e3056-default-rtdb.firebaseio.com/obed.json')
        .then(res => {
            let list = res.data,
                key = Object.keys(list)[0];
            linkMessage = res.data[key].code;
            bot.sendMessage(chatId, `${msg.from.first_name}, привет! \nСсылка на сегодняшний заказ: ${linkMessage}`)
        })
        .catch(error => {
            console.error(error);
        });

    let sendMessageTask = cron.schedule('9 11 * * *', () => {
        bot.sendMessage(chatId, `${msg.from.first_name}, ЗДАРОВА! \nСсылка на сегодняшний заказ: ${linkMessage}`);
    });
    sendMessageTask.start();

    let sendMessageTask2 = cron.schedule('1 * * * *', () => {
        bot.sendMessage(chatId, `${msg.from.first_name}, ЗДАРОВА КАРТА! \nСсылка на сегодняшний заказ: ${linkMessage}`);
    });
    sendMessageTask2.start();
});