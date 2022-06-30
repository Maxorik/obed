const TelegramApi = require('node-telegram-bot-api');
const token = '5586636515:AAFpLAV-BtLPkKCu3rRKNfSsdk12N8KL7dU';
const bot = new TelegramApi(token, {polling: true});

bot.on('message', msg => {
    const text = msg.text;
    const chatId = msg.chat.id;

    console.log(msg);


    bot.sendMessage(chatId, `Привет, ${msg.from.first_name}!`)
});

const http = require('http');
const { parse } = require('querystring');

const server = http.createServer((req, res) => {
    if (req.method === 'POST') {
        collectRequestData(req, result => {
            console.log(result);
            res.end(`Parsed data belonging to ${result.fname}`);
        });
    }
    else {
        res.end(`
            <!doctype html>
            <html>
            <body>
                <form action="/" method="post">
                    <input type="text" name="fname" /><br />
                    <input type="number" name="age" /><br />
                    <input type="file" name="photo" /><br />
                    <button>Save</button>
                </form>
            </body>
            </html>
        `);
    }
});
server.listen(8080);

function collectRequestData(request, callback) {
    const FORM_URLENCODED = 'application/x-www-form-urlencoded';
    if(request.headers['content-type'] === FORM_URLENCODED) {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            callback(parse(body));
        });
    }
    else {
        callback(null);
    }
}