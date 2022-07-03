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
            bot.sendMessage(chatId, `${msg.from.first_name}, привет! \nСсылка на сегодняшний заказ: ${linkMessage}\nСледующая ссылка придет завтра, в 9:00`)

        })
        .catch(error => {
            console.error(error);
        });

    // рассылка линка, каждый день в 09:00
    let sendMessageTask = cron.schedule('0 2 * * *', () => {
        const today = new Date();
        const weekDay = new Date().toLocaleString('ru', { weekday: 'long' });
        const parsedDate = `${today.getDate()}.${today.getDay()}.${today.getFullYear()}, ${weekDay}`;
        bot.sendMessage(chatId, `${parsedDate}\n${msg.from.first_name}, привет! \nСсылка на сегодняшний заказ: ${linkMessage}`);
    });
    sendMessageTask.start();
});