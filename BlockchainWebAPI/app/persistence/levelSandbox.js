/* ===== Persist data with LevelDB ==================
|  Learn more: level: https://github.com/Level/level |
/===================================================*/

const level = require('level');
const chainDB = './chaindata';

class LevelSandbox {

    constructor() {
        this.db = level(chainDB);
    }

    // Get data from levelDB with key (Promise)
    getLevelDBData(key){
        return new Promise( (resolve, reject) => {
            this.db.get(key, (err, value) => {
                if (err) reject(`key '${key}' not found!`, err);
                resolve(value);
            })
        });
    }

    // Add data to levelDB with key and value (Promise)
    addLevelDBData(key, value) {
        return new Promise((resolve, reject) => {
            this.db.put(key, value, (err) => {
                if (err) reject(`Data with '${key}' failed to store`, err);
                resolve({key, value});
            })
        });
    }

    // Method that return the number of elements in the DB
    getBlocksCount() {
        return new Promise( (resolve, reject) => {
            let i = 0;
            this.db.createReadStream().on('data', (data) => {
                i++;
            }).on('error', (err) => {
                reject('Unable to read data stream!', err);
            }).on('close', () => {
                resolve(i);
            });
        });
    }

    // Method that return the blockchain
    getBlockchain() {
        return new Promise( (resolve, reject) => {
            let chain = [];
            this.db.createReadStream().on('data', (data) => {
                chain.push(data);
            }).on('error', (err) => {
                reject('Unable to read data stream!', err);
            }).on('close', () => {
                const sortedByKey = chain.sort((a, b) => a.key-b.key);
                const values = sortedByKey.map(e => e.value);
                resolve(values);
            });
        });
    }
        

}

module.exports.DB = new LevelSandbox();