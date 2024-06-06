const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./storage/data_base.db');


module.exports = function (args) {
    return new Promise(async resolve => {
        switch (args.type) {
            case 'login': {
                const get_user_result = await new Promise(resolve => {
                    db.get(`SELECT * FROM users WHERE login = '${args.login}'`, (err, row) => {
                        if (err) {
                            resolve({ result: 'error', message: `Помилка запиту авторизації ${err}` })
                        } else {
                            if (args.pass == row.password) {
                                resolve({
                                    result: 'success',
                                    user_data: {
                                        id: row.id,
                                        login: row.login,
                                        name: row.name,
                                        money: row.money
                                    }
                                })
                            }
                        }
                        console.log(row.login)
                    })
                })
                resolve(get_user_result)
            }; break;
            case 'register': {
                const arg = args.arguments
                const uid = await new Promise(resolve => {
                    db.get(`SELECT MAX(id) AS max_value FROM users`, (err, row) => {
                        if (err) {
                            resolve({ result: 'error', message: 'Помилка запиту!' })
                        } else {
                            resolve(row.max_value)
                        }
                    })
                })
                if (uid.result == 'error') {
                    resolve(uid)
                    return
                }

                db.run(`INSERT INTO users('id','login','password','name','money','access_level','private_key')
                VALUES('${uid+1}','${arg.email}','${arg.password}','${arg.name}',${0},'${'user'}','${''}')`, (err) => {
                    if (err) {
                        resolve({ result: 'error', message: 'Помилка реєстрації!' })
                    } else {
                        resolve({ result: 'succes', message: 'Успішно зареєстровано!' })
                    }
                })
            }; break;
        }
    })
}