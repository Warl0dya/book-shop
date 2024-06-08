const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./storage/data_base.db');

module.exports = function(args){
    return new Promise(async resolve =>{
        switch(args.type){
            
        }
    })
}