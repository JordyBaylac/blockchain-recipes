const { Blockchain } = require('../domain/models/blockchain');
const { Block } = require('../domain/models/block');
const { mempool } = require('../domain/mempool');
const hex2ascii = require('hex2ascii')


class StarController {

    constructor(app) {
        this.app = app;
        this.blockchain = new Blockchain();
        this.submitStar();
        this.getStarByBlockHash();
        this.getStarsByWallet();
        this.getStarByBlockHeight();
    }

    /**
     * POST Endpoint for submitting the Star information 
     *      to be saved in the Blockchain.
     */
    submitStar() {
        this.app.post("/block", async (req, res) => {
            // checking that address was provided
            if (!req.body || !req.body.address
                || !req.body.star
                || typeof req.body.star != "object" //single star
                || !req.body.star.dec
                || !req.body.star.ra
                || !req.body.star.story) {
                res.status(417).json({
                    message: 'Error submitting star',
                    description: 'Address and star info is required'
                });
                return;
            }

            if (!mempool.hasValidRequest(req.body.address)) {
                res.status(401).json({
                    message: 'Error submitting star',
                    description: `Address ${req.body.address} has not been validated`
                });
                return;
            }

            // creating block model
            let block = new Block({
                address: req.body.address,
                star: {
                    ra: req.body.star.ra || "",
                    dec: req.body.star.dec || "",
                    mag: req.body.star.mag || "",
                    cen: req.body.star.cen || "",
                    story: Buffer.from(req.body.star.story).toString('hex')
                }
            });

            try {
                const starBlock = await this.blockchain.addBlock(block);
                res.status(200).json(starBlock);
            } catch (err) {
                res.status(417).json({
                    message: `Error creating block`,
                    description: err.message || err
                })
            }
        });
    }

    getStarByBlockHash() {
        this.app.get("/stars/hash:hash", async (req, res) => {
            // checking that hash was provided
            if (!req.params.hash) {
                res.status(417).json({
                    message: 'Error searching a star',
                    description: 'Hash need to be provided'
                });
                return;
            }

            try {
                const starHash = req.params.hash.substring(1);            
                let block = await this.blockchain.getBlockByHash(starHash);
                if (!block)
                    throw new Error(`Star not found given the hash ${starHash}`)
                
                res.status(200).json(this._decodedStarStory(block));
            } catch (err) {
                res.status(417).json({
                    message: `Error searching block`,
                    description: err.message || err
                })
            }
            
        });
    }

    getStarsByWallet() {
        this.app.get("/stars/address:address", async (req, res) => {
            // checking that wallet address was provided
            if (!req.params.address) {
                res.status(417).json({
                    message: 'Error searching a star',
                    description: 'Wallet address need to be provided'
                });
                return;
            }

            try {
                const walletAddress = req.params.address.substring(1);            
                let blocks = await this.blockchain.getBlocksByWallet(walletAddress);
                if (blocks.length === 0)
                    throw new Error(`No star found for wallet address ${walletAddress}`)
                
                const blockResult = blocks.map(this._decodedStarStory);
                res.status(200).json(blockResult);
            } catch (err) {
                res.status(417).json({
                    message: `Error searching block`,
                    description: err.message || err
                })
            }
            
        });
    }

    getStarByBlockHeight() {
        this.app.get("/block/:height", async (req, res) => {
            // checking that block height was provided
            if (!req.params.height) {
                res.status(417).json({
                    message: 'Error searching a star',
                    description: 'Block height need to be provided'
                });
                return;
            }

            try {
                const height = req.params.height;           
                let block = await this.blockchain.getBlock(height);
                if (!block)
                    throw new Error(`No star found on the block ${height}`)
                
                res.status(200).json(this._decodedStarStory(block));
            } catch (err) {
                res.status(417).json({
                    message: `Error searching block`,
                    description: err.message || err
                })
            }
            
        });
    }

    _decodedStarStory(block) {
        block.body.star["storyDecoded"] = hex2ascii(block.body.star.story);
        return block;
    }

}

module.exports.StarController = StarController;
