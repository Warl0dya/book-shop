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
                        resolve(rows)
                    }
                })
            }; break;
        }
    })
}