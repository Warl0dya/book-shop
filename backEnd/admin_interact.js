const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./storage/data_base.db');

module.exports = function (args) {
    return new Promise(async resolve => {
        const acc_lvl = await new Promise(resolve => {
            db.get(`SELECT access_level FROM users WHERE "private_key" = "${args.user.temp_key}"`, (err, row) => {
                if (err) {
                    console.log(err)
                    resolve({
                        result: 'error',
                        message: 'Помилка запиту!'
                    })
                } else {
                    resolve(row.access_level)
                }
            })
        })
        if (!acc_lvl || acc_lvl < 1) {
            resolve({
                result: 'error',
                message: 'Немає доступу'
            })
            return
        }

        if (acc_lvl.result == 'error') {
            resolve(acc_lvl)
            return
        }

        switch (args.type) {
            case 'add_item': {
                const item_data = args.arguments

                const id = await new Promise(async resolve => {
                    db.get(`SELECT MAX(id) AS max_value FROM items`, (err, row) => {
                        if (err) {
                            console.log(err)
                            resolve({
                                result: 'error',
                                message: 'Помилка запиту!'
                            })
                        } else {
                            resolve(row.max_value + 1)
                        }
                    })
                })

                db.run(`INSERT INTO items(id,name,author,description,tags,thumbnail,cost,quantity)
                    VALUES("${id}","${item_data.name}","${item_data.author}","${item_data.description}","${JSON.stringify(item_data.tags)}","${item_data.thumbnail}","${item_data.cost}","${item_data.quantity}")`, (err) => {
                        if(err){
                            console.log(err)
                        }
                })

                resolve({ message: 'ok' })
            }; break;
        }
    })
}