
const sha256 = require("crypto-js/sha256");
const sandbox = require('./levelSandbox').LevelSandbox;

/**
 * Block class representing a block data model
 */
class Block {

    constructor(data) {

        this.hash = '';
        this.height = 0;
        this.body = data;
        this.time = 0;
        this.previousBlockHash = ''

    }

    copyFrom(rawBlock) {
        this.hash = rawBlock.hash;
        this.height = rawBlock.height;
        this.body = rawBlock.body;
        this.time = rawBlock.time;
        this.previousBlockHash = rawBlock.previousBlockHash;
        return this;
    }

    copyFromStringified(stringifiedBlock) {
        const dbBlock = JSON.parse(stringifiedBlock);
        return this.copyFrom(dbBlock);
    }
}

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
        // genesis block will be created when first time a block is inserted
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
        return sandbox.addLevelDBData(block.height, JSON.stringify(block))
            .then(res => {
                return res;
            }).catch(err => {
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
        return this._saveBlock(newBlock);
    }

    async getChain() {
        const dbBlockChain = await sandbox.getBlockchain();
        return dbBlockChain.map(data => { //converting from the raw Block stored in levelDB to an instance of Block
            return new Block().copyFromStringified(data);
        });
    }

    async getBlockHeight() {
        return await sandbox.getBlocksCount();
    }

    async getLatestBlock() {
        const numberOfBlocks = await sandbox.getBlocksCount();        
        return numberOfBlocks > 0 ? this.getBlock(numberOfBlocks - 1) : null;
    }

    async getBlock(blockHeight) {
        const data = await sandbox.getLevelDBData(blockHeight);
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
module.exports.Block = Block;