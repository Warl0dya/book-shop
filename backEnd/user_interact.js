const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./storage/data_base.db');


module.exports = function (args) {
    return new Promise(async resolve => {
        switch (args.type) {
            case 'register': {
                const arg = args.arguments
                let uid = await new Promise(resolve => {
                    db.get(`SELECT MAX(id) AS max_value FROM users`, (err, row) => {
                        if (err) {
                            resolve({
                                result: 'error',
                                message: 'Помилка запиту!'
                            })
                        } else {
                            resolve(row.max_value + 1)
                        }
                    })
                })
                if (!uid) {
                    uid = 0
                }
                if (uid.result == 'error') {
                    resolve(uid)
                    return
                }

                db.run(`INSERT INTO users('id','login','password','name','money','access_level','private_key','user_data')
                VALUES('${uid}','${arg.email}','${arg.password}','${arg.name}',${0},'${'user'}','${''}','${JSON.stringify({ basket: [], whishlist: [], favs: [] })}')`, (err) => {
                    if (err) {
                        resolve({
                            result: 'error',
                            message: 'Помилка реєстрації!'
                        })
                    } else {
                        resolve({
                            result: 'succes',
                            message: 'Успішно зареєстровано!'
                        })
                    }
                })
            }; break;
            case 'login': {
                const arg = args.arguments
                const get_user = await new Promise(resolve => {
                    db.get(`SELECT * FROM users WHERE "login" = "${arg.email}"`, (err, row) => {
                        if (err) {
                            resolve({
                                result: 'error',
                                message: 'Помилка запиту!'
                            })
                        } else {
                            resolve(row)
                        }
                    })
                })
                if (!get_user) {
                    resolve({
                        result: 'error',
                        message: 'Невірний пароль або пошта!'
                    })
                    return
                }

                if (get_user.result == 'error') {
                    resolve(get_user)
                    return
                }

                if (arg.password == get_user.password) {
                    db.run(`UPDATE users SET "private_key" = "${arg.user_key}"`)
                    resolve({
                        result: 'success',
                        message: `Вітаємо, ${get_user.name}!`,
                        user_data: {
                            id: get_user.id,
                            login: get_user.login,
                            name: get_user.name,
                            money: get_user.money,
                            access_level: get_user.access_level,
                            user_data: get_user.user_data
                        }
                    })
                } else {
                    resolve({
                        result: 'error',
                        message: 'Невірний пароль або пошта!'
                    })
                }
            }; break;
            case 'auto_login': {
                const get_user = await new Promise(resolve => {
                    db.get(`SELECT * FROM users WHERE "private_key" = "${args.arguments.user_key}"`, (err, row) => {
                        if (err) {
                            resolve({
                                result: 'error',
                                message: 'Помилка запиту!'
                            })
                        } else {
                            resolve(row)
                        }
                    })
                })

                if (!get_user) {
                    resolve({
                        result: 'error',
                        message: 'Автоматична авторизація невдала'
                    })
                    return
                }

                if (get_user.result == 'error') {
                    resolve(get_user)
                    return
                }

                resolve({
                    result: 'success',
                    message: `Автоаматична авторизація успішна під користувачем ${get_user.name}!`,
                    user_data: {
                        id: get_user.id,
                        login: get_user.login,
                        name: get_user.name,
                        money: get_user.money,
                        access_level: get_user.access_level,
                        user_data: get_user.user_data
                    }
                })
            }; break;
        }
    })
}