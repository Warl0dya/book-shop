function fill_user_card() {
    function parse_user_acc_level(acc_level){
        let ulevel=''
        switch(acc_level){
            case 1:ulevel='Користувач';break;
            case 2:ulevel='Партнер';break;
            case 3:ulevel='Адміністратор';break;
            default: ulevel='Невизначено';break
        }
        return ulevel
    }
    const card = document.querySelector('.user-card')
    const fields = card.querySelectorAll('div')
    const udata = JSON.parse(sessionStorage.getItem('userData'))

    fields[0].innerText=`Ім'я та тег: ${udata.name}#${udata.id}`
    fields[1].innerText=`Логін: ${udata.login}`
    fields[2].innerText=`Баланс: ${udata.money} грн`
    fields[3].innerText=`Тип профілю: ${parse_user_acc_level(udata.access_level)}`
}