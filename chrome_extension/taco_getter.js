const btn = document.getElementById('getterBtn');

if(btn) {
    btn.onclick = function (e) {
        let photo = document.querySelectorAll('.page_avatar_img');
        console.log(photo);
    }
} else {
    console.log('ddddddd')
}