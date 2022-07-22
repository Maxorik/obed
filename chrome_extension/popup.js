// listener на нажатие кнопки
window.addEventListener('DOMContentLoaded', function (evt) {
    const tacoSetter = document.getElementById('getterBtn');
    tacoSetter.onclick = function setState(event) {
        sendContent({"type": 'state', 'state': true});
        return false;
    };
});

function sendContent(data) {
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
        let activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {"data": data}, function (response) {
            console.log('response',response);
        });
    });
}