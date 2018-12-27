
const { Blockchain } = require('../domain/Blockchain');
const { Block } = require('../domain/Block');

class BlockController {

    constructor(app) {
        this.app = app;
        this.blockchain = new Blockchain();
        this.initializeMockBlocks(this.blockchain);
        this.getBlockByHeight();
        this.createBlock();
    }

    getBlockByHeight() {
        this.app.get("/block/:blockHeight", async (req, res) => {
            const blockHeight = req.params.blockHeight;
            const chainHeight = await this.blockchain.getBlockHeight() - 1; // blocks start at 0
            
            // checking that height is valid and in range
            if (isNaN(blockHeight) || blockHeight < 0 || blockHeight > chainHeight) {
                res.status(404).json({
                    message: `Error getting block`,
                    description: `Block height entered need to be in range 0..${chainHeight}`
                });
                return;
            }

            // getting the block and emitting error if it fails
            try {
                const block = await this.blockchain.getBlock(blockHeight);
                res.status(200).json(block);
            } catch (err) {
                res.status(404).json({
                    message: `Error getting block`,
                    description: err
                });
            }
        });
    }

    createBlock() {
        this.app.post("/block", async (req, res) => {

            // checking that body was provided
            if (!req.body || !req.body.body) {
                res.status(417).json({
                    message: 'Error creating block',
                    description: 'Block cannot be created without data'
                });
                return;
            }

            // creating block and emitting error if it fails
            let block = new Block(req.body.body);
            try {
                const createdBlock = await this.blockchain.addBlock(block);
                res.status(200).json(createdBlock);
            } catch (err) {
                res.status(417).json({
                    message: `Error creating block`,
                    description: err
                })
            }
        });
    }

    // mocking blocks (10  + genesis = 11 mocks)
    initializeMockBlocks(myBlockChain) {
        (async () => {
            const currentHeight = await myBlockChain.getBlockHeight() || 1; //perhaps the genesis doesn't exist yet

            if (currentHeight > 1)
                return;  

            const nextTen = currentHeight + 10;

            (function theLoop(i) {
                setTimeout(() => {
                    let blockTest = new Block("Test Block - " + (i + 1));
                    myBlockChain.addBlock(blockTest).then(_ => {
                        i++;
                        if (i < nextTen)
                            theLoop(i);
                    });
                }, 0);
            })(currentHeight - 1);
        })();
    }

}

module.exports.BlockController = BlockController;