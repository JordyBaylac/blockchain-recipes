
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

module.exports.Block = Block;