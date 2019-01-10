
const sha256 = require("crypto-js/sha256");
const { Block } = require('./block');
const DB = require('../../persistence/levelSandbox').DB;


/**
 * Blockchain class.
 * Supported methods: 
   - addBlock()
   - getChain()          
   - getBlockHeight()          
   - getLatestBlock()    
   - getBlock()
   - validateBlock()     
   - validateChain()  
 */
class Blockchain {

    constructor() {
        // genesis block will be created when the first block is inserted
    }

    async _createGenesisBlock() {
        const genesisBlock = new Block('Genesis block');
        genesisBlock.hash = this._getHashOf(genesisBlock);
        console.log('... creating genesis block');
        await this._saveBlock(genesisBlock);
        return genesisBlock;
    }

    _getHashOf(object) {
        return sha256(JSON.stringify(object)).toString();
    }

    _saveBlock(block) {
        return DB.addLevelDBData(block.height, JSON.stringify(block))
            .catch(err => {
                console.error('_saveBlock::error', err);
            });
    }

    _getBlockWithoutHash(block) {
        return { ...block, hash: '' };
    }

    async addBlock(newBlock) {
        let latestBlock = await this.getLatestBlock();
        if (!latestBlock)
            latestBlock = await this._createGenesisBlock();
        newBlock.previousBlockHash = latestBlock.hash;
        newBlock.height = latestBlock.height + 1;
        newBlock.time = new Date().getTime().toString().slice(0, -3);
        newBlock.hash = this._getHashOf(newBlock);
        await this._saveBlock(newBlock);
        return newBlock;
    }

    async getChain() {
        const dbBlockChain = await DB.getBlockchain();
        return dbBlockChain.map(data => { //converting from the raw Block stored in levelDB to an instance of Block
            return new Block().copyFromStringified(data);
        });
    }

    async getBlockHeight() {
        return await DB.getBlocksCount();
    }

    async getLatestBlock() {
        const numberOfBlocks = await this.getBlockHeight();        
        return numberOfBlocks > 0 ? this.getBlock(numberOfBlocks - 1) : null;
    }

    async getBlock(blockHeight) {
        const data = await DB.getLevelDBData(blockHeight);
        return new Block().copyFromStringified(data);
    }

    async validateBlock(blockHeight) {
        const block = await this.getBlock(blockHeight);
        const unhashedBlock = this._getBlockWithoutHash(block);
        return this._getHashOf(unhashedBlock) === block.hash;
    }

    async validateChain() {
        let valid = true;
        const chain = await this.getChain();
        let previousBlock = chain.length > 0 ? chain[0] : null;

        for (let i = 1; i < chain.length && valid; i++) {
            const currentBlock = chain[i];
            const unhashedCurrentBlock = this._getBlockWithoutHash(currentBlock);
            const unhashedPreviousBlock = this._getBlockWithoutHash(previousBlock);

            if (currentBlock.previousBlockHash !== previousBlock.hash
                || this._getHashOf(unhashedPreviousBlock) !== currentBlock.previousBlockHash
                || this._getHashOf(unhashedCurrentBlock) !== currentBlock.hash) {
                valid = false;
            }
            previousBlock = currentBlock;
        }
        return valid;
    }
}


module.exports.Blockchain = Blockchain;