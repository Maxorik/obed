const TelegramApi = require('node-telegram-bot-api');
const token = '5586636515:AAFpLAV-BtLPkKCu3rRKNfSsdk12N8KL7dU';
const bot = new TelegramApi(token, {polling: true});
const axios = require('axios');
const cron = require('node-cron');

const imageSearch = require('image-search-google');
const download = require('image-downloader');

// базовые команды
bot.setMyCommands([
    {command: '/start', description: 'Запуск бота'},
    {command: '/info', description: 'Как все работает?'},
    {command: '/cats', description: 'Секретная опция :3'},

])

bot.on('message', msg => {
    const chatId = msg.chat.id;
    const text = msg.text;
    let linkMessage = '';

    //тест картинок
    if(text === '/cats') {
        const client = new imageSearch('ffeb8f3554ef89179', 'AIzaSyC36DzU-UZZGyp1cro1rr13Y2em_ZFgDuA');
        const options = {page:1};
        let imgPath = '';
        client.search('boobs', options)
            .then(images => {
                const options1 = {
                    url: images[0].url,
                    dest: './public/img',               // will be saved to /path/to/dest/image.jpg
                };

                download.image(options1)
                    .then(({ filename }) => {
                        imgPath = filename;
                        console.log('Saved to', filename); // saved to /path/to/dest/image.jpg
                    })
                    .catch((err) => console.error(err));
            })
            .catch(error => console.log(error));

        bot.send_photo(chatId, open(imgPath, 'rb'));
    }

    if(text === '/info') {
        bot.sendMessage(chatId, 'Каждый день в 9 утра сюда будет приходить ссылка для заказа в Тако.\n' +
                                    'Перейдя по ней, можно выбрать себе обед.\n' +
                                    'Ссылка актуальна 2 часа, в 11:00 заказ отправляется!\n' +
                                    'Если бот надоел, нажми по нему правой кнопкой мыши и выбери "Остановить и блокировать"\n' +
                                    'Вновь начать пользоваться ботом можно будет в любой момент.')
    }

    if(text === '/start' || text === '/start s') {
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
            const parsedDate = `${today.getDate()}/${today.getMonth()}/${today.getFullYear()}, ${weekDay}`;
            bot.sendMessage(chatId, `${parsedDate}\n${msg.from.first_name}, привет! \nСсылка на сегодняшний заказ: ${linkMessage}`);
        });
        sendMessageTask.start();
    }
});