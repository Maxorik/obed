const TelegramApi = require('node-telegram-bot-api');
const token = '5586636515:AAFpLAV-BtLPkKCu3rRKNfSsdk12N8KL7dU';
const bot = new TelegramApi(token, {polling: true});

bot.on('message', msg => {
    const text = msg.text;
    const chatId = msg.chat.id;

    fetch('https://velum-song-list-default-rtdb.firebaseio.com/songs.json')
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            let rand = Math.floor(Math.random() * Math.floor(17)),
                key = Object.keys(data)[rand];
            try{
                bot.sendMessage(chatId, `ОГО это же, ${data[key].songName}!`)
            } catch (e) {
                bot.sendMessage(chatId, `что-то пошло не так ${e}`)
            }

        });

    bot.sendMessage(chatId, `Привет, ${msg.from.first_name}!`)
});

// import { initializeApp } from "firebase/app";
// const firebaseConfig = {
//     apiKey: "AIzaSyCrXVcJr7jCU9D7VUNgOCr20e0liUt1kTk",
//     authDomain: "velum-song-list.firebaseapp.com",
//     databaseURL: "https://velum-song-list-default-rtdb.firebaseio.com",
//     projectId: "velum-song-list",
//     storageBucket: "velum-song-list.appspot.com",
//     messagingSenderId: "250238502704",
//     appId: "1:250238502704:web:dc31f7158a2eb61841eaf5",
//     measurementId: "G-TX0861TSM9"
// };
// const app = initializeApp(firebaseConfig);


// Страничка
// const http = require('http');
// const { parse } = require('querystring');
//
// const server = http.createServer((req, res) => {
//     if (req.method === 'POST') {
//         collectRequestData(req, result => {
//             console.log(result);
//             res.end(`Parsed data belonging to ${result.fname}`);
//         });
//     }
//     else {
//         res.end(`
//             <!doctype html>
//             <html>
//             <body>
//                 <form action="/" method="post">
//                     <input type="text" name="fname" /><br />
//                     <input type="number" name="age" /><br />
//                     <input type="file" name="photo" /><br />
//                     <button>Save</button>
//                 </form>
//             </body>
//             </html>
//         `);
//     }
// });
// server.listen(8080);
//
// function collectRequestData(request, callback) {
//     const FORM_URLENCODED = 'application/x-www-form-urlencoded';
//     if(request.headers['content-type'] === FORM_URLENCODED) {
//         let body = '';
//         request.on('data', chunk => {
//             body += chunk.toString();
//         });
//         request.on('end', () => {
//             callback(parse(body));
//         });
//     }
//     else {
//         callback(null);
//     }
// }