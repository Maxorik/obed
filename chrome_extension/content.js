// Когда приходит сообщение из popup.js
chrome.runtime.onMessage.addListener(
    function (data, sender, sendResponse) {
        if(data.data.state) {
            alert('Рассылка включена');

            let today = new Date();
            let todayWasSend = false; // флаг - была ли ссылка отправлена сегодня
            let thisDay = today.getDate();

            // раз в минуту проверяем время
            // если 8 утра - получаем ссылку на заказ
            // откладываем отправку на 11 утра
            let checkHour = setTimeout(function getTime(){
                let today = new Date();
                console.log('tick!');
                if((!todayWasSend && today.getHours() === 8)) {
                    todayWasSend = true;
                    getLink();
                    setTimeout(getOrder, 3600000*3); // пытаемся отправить заказ через 3 часа
                }
                if(today.getDate() > thisDay) { // наступил следующий день, сбрасываем параметры
                    console.log('new day is coming!');
                    todayWasSend = false;
                    thisDay = today.getDate();
                }
                checkHour = setTimeout(getTime, 60000);
            },60000)

            // обновить ссылку на бэкенде
            function getLink() {
                console.log('getting new link...', new Date());
                const btn = document.querySelector('.b-basket__bulk-order-button-invite.js-group-add-opener');
                if(btn) {
                    btn.click();
                    setTimeout(() => {
                        const btn2 = document.querySelector('#invite-button');
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

                        }, 2000);
                    }, 2000);
                } else console.log('а где кнопка, не понел');
            }

            // отправить заказ
            function getOrder() {
                console.log('try to post order ', new Date());
                try {
                    const orderBtn = document.querySelector('.b-basket__ordering');
                    orderBtn.click();
                } catch (e) {
                    console.log('error in posting! ', e);
                    // POST - заказ не отправлен
                }
            }
        }
    }
);
