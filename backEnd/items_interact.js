const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./storage/data_base.db');


async function get_search_data() {
    let search_data = {
        authours: [],
        languages: [],
        tags: []
    }

    return await new Promise(resolve => {
        db.all(`SELECT * FROM items`, (err, rows) => {
            if (err) {
                console.log(err)
            } else {
                for (const item of rows) {
                    if (!search_data.authours.includes(item.author.toLowerCase().replace(/(\r\n|\n|\r)/gm, ""))) {
                        search_data.authours.push(item.author.toLowerCase().replace(/(\r\n|\n|\r)/gm, ""))
                    }

                    if (!search_data.languages.includes(item.language.toLowerCase().replace(/(\r\n|\n|\r)/gm, ""))) {
                        search_data.languages.push(item.language.toLowerCase().replace(/(\r\n|\n|\r)/gm, ""))
                    }

                    const item_tags = JSON.parse(item.tags)

                    for (const tag of item_tags) {
                        if (!search_data.tags.includes(tag.toLowerCase().replace(/(\r\n|\n|\r)/gm, ""))) {
                            search_data.tags.push(tag.toLowerCase().replace(/(\r\n|\n|\r)/gm, ""))
                        }
                    }
                }
            }
            resolve(search_data)
        })
    })
}


module.exports = function (args) {
    return new Promise(async resolve => {
        switch (args.type) {
            case 'get_filters': {
                resolve(await get_search_data())
            }; break;
            case 'get_items': {
                db.all(`SELECT * FROM items`, (err, rows) => {
                    if (err) {
                        console.log(err)
                        resolve(err)
                    } else {
                        let items = rows
                        for (let item of items) {
                            item.tags = JSON.parse(item.tags)
                        }
                        resolve(items)
                    }
                })
            }; break;
            case 'get_item': {
                db.get(`SELECT * FROM items WHERE id = "${args.arguments.id}"`, (err, row) => {
                    if (err) {
                        console.log(err)
                        resolve(err)
                    } else {
                        resolve(row)
                    }
                })
            }; break;
            case 'update_prefs': {
                let udata = await new Promise(resolve => {
                    db.get(`SELECT * FROM users WHERE "private_key" = "${args.user.temp_key}"`, (err, row) => {
                        if (err) {
                            console.log(err)
                            resolve({
                                result: 'error',
                                message: 'Помилка запиту!'
                            })
                        } else {
                            resolve(JSON.parse(row.user_data))
                        }
                    })
                })
                if (udata.result == 'error') {
                    resolve(uid)
                    return
                }

                udata[args.arguments.type] = args.arguments.data

                db.run(`UPDATE users SET user_data = '${JSON.stringify(udata)}'
                WHERE "private_key" = "${args.user.temp_key}"`, (err) => {
                    if (err) {
                        console.log(err)
                        resolve(err)
                    } else {
                        resolve('ok')
                    }
                })
            }; break;
            case 'check_buy_ability': {
                const usr_money = await new Promise(resolve => {
                    db.get(`SELECT * FROM users WHERE "private_key" = "${args.user.temp_key}"`, (err, row) => {
                        if (err) {
                            console.log(err)
                            resolve({
                                result: 'error',
                                message: 'Помилка запиту!'
                            })
                        } else {
                            resolve(row.money)
                        }
                    })
                })
                if (usr_money.result == 'error') {
                    resolve(uid)
                    return
                }

                const itm_cost = await new Promise(resolve => {
                    db.get(`SELECT * FROM items WHERE "id" = "${args.arguments.id}"`, (err, row) => {
                        if (err) {
                            console.log(err)
                            resolve({
                                result: 'error',
                                message: 'Помилка запиту!'
                            })
                        } else {
                            resolve(row.cost)
                        }
                    })
                })
                if (itm_cost.result == 'error') {
                    resolve(uid)
                    return
                }

                if(itm_cost>usr_money){
                    resolve({result:'error',message:'Бракує коштів!'})
                }else{
                    db.run(`UPDATE users SET money = "${usr_money-itm_cost}" WHERE "private_key" = "${args.user.temp_key}"`,(err)=>{
                        if(err){
                            resolve({result:'error',message:'Помилка придбання!'})
                        }else{
                            resolve({result:'success',message:'Успішно придбано'})
                        }
                    })
                }
            }; break;
        }
    })
}