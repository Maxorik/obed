// Когда приходит сообщение из popup.js
chrome.runtime.onMessage.addListener(
    function (data, sender, sendResponse) {
        if(data.data.state) {
            alert('Рассылка включена');

            const getCodeHour = 7; // время получения кода заказа - 7 утра
            let today = new Date();

            // дата получения новой ссылки
            let dayX = today.getHours() < getCodeHour ? new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 7, 0, 0, 0) :
                new Date(today.getFullYear(), today.getMonth(), today.getDate(), 7, 0, 0, 0);

            // задержка для таймера
            let delay = dayX - today;

            // запускаем ежедневное обновление кода ссылки для заказа
            let linkTimer = setTimeout(function getLink() {
                const btn = document.querySelector('.b-basket__bulk-order-button-invite.js-group-add-opener');
                if(btn) {
                    btn.click();
                    setTimeout(() => {
                        let btn2 = document.querySelector('#invite-button');
                        btn2.click();
                        setTimeout(() => {
                            let codeInput = document.querySelector('#hash-url');
                            const data = { code:  codeInput.value };

                            fetch('https://somedata-e3056-default-rtdb.firebaseio.com/obed.json', {
                                method: 'DELETE',
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            }).then(() => {
                                fetch('https://somedata-e3056-default-rtdb.firebaseio.com/obed.json', {
                                    method: 'POST',
                                    body: JSON.stringify(data),
                                    headers: {
                                        'Content-Type': 'application/json'
                                    }
                                });
                            })

                        }, 1000);
                    }, 1000);
                } else console.log('а где кнопка, не понел');

                delay = 86400000; // задержка - сутки
                linkTimer = setTimeout(getLink, delay);
            }, delay);
        }
    }
);
