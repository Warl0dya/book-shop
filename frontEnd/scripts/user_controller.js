function check_user_status_bar() {
    const ubar = document.querySelector('.user-bar')

    const uacc = ubar.querySelector('#user-account')
    const reg = ubar.querySelector('#register')
    const log = ubar.querySelector('#login')

    if (sessionStorage.getItem('userData')) {
        uacc.style.display = 'unset'
        reg.style.display = 'none'
        log.style.display = 'none'
    } else {
        uacc.style.display = 'none'
        reg.style.display = 'unset'
        log.style.display = 'unset'
    }
}

function append_login_data(data) {
    const perm_data = JSON.parse(data.user_data)
    for (const dline in perm_data) {
        localStorage.setItem(dline, perm_data[dline])
    }

    sessionStorage.setItem('userData', JSON.stringify({
        name: data.name,
        login: data.login,
        money: data.money,
        id: data.id,
        access_level: data.access_level,
    }))

    check_user_status_bar()
}

function auto_user_control() {
    function create_user_key() {
        localStorage.setItem('userKey', KEYGEN())
    }
    function check_user_key() {
        const key = localStorage.getItem('userKey')
        if (!key) return false
        if (key.length != 32) return false
        return true
    }
    async function try_user_auto_login() {
        const resp = await request('/api/user_interact', 'auto_login', { user_key: localStorage.getItem('userKey') })
        console.log(resp.message)
        if (resp.result == 'success') {
            append_login_data(resp.user_data)
        } else {
            localStorage.clear()
            sessionStorage.clear()
            create_user_key()
        }
    }

    check_user_key() ? try_user_auto_login() : create_user_key()

    check_user_status_bar()
}

auto_user_control()

async function register(event) {
    event.preventDefault()
    let register_data = {}
    for (const elm of event.srcElement) {
        if (elm.id != '')
            register_data[elm.id] = elm.value
    }
    if (register_data.password != register_data.confirmPassword) {
        alert("Паролі не співпадають!")
        return
    }
    const resp = await request('/api/user_interact', 'register', register_data)
    alert(resp.message)
}

async function login(event) {
    event.preventDefault()
    let login_data = {}
    for (const elm of event.srcElement) {
        if (elm.id != '')
            login_data[elm.id] = elm.value
    }
    login_data.user_key = localStorage.getItem('userKey')

    const resp = await request('/api/user_interact', 'login', login_data)
    alert(resp.message)
    if (resp.result == 'success') append_login_data(resp.user_data)
}

async function unlogin() {
    const resp = await request('/api/user_interact', 'unlogin')
    alert(resp.message)
    if (resp.result == 'success') {
        localStorage.clear()
        sessionStorage.clear()
        check_user_status_bar()
        navigate('catalogue')
    }
}