
function auto_user_control() {
    function create_user_key() {
        localStorage.setItem('userKey', KEYGEN())
    }
    function check_user_key() {
        const key = localStorage.getItem('userKey')
        return key ? true : false
    }
    function try_user_auto_login() {

    }

    check_user_key() ? try_user_auto_login() : create_user_key()
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

