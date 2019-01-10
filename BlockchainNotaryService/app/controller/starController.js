const { Blockchain } = require('../domain/models/blockchain');
const { Block } = require('../domain/models/block');
const { mempool } = require('../domain/mempool');
const hex2ascii = require('hex2ascii')
 

class StarController {

    constructor(app) {
        this.app = app;
        this.blockchain = new Blockchain();
        this.submitStar();
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
                    story: Buffer(req.body.star.story).toString('hex')
                }
            });

            try {
                const starBlock = await this.blockchain.addBlock(block);
                starBlock.body.star["storyDecoded"] = hex2ascii(starBlock.body.star.story);
                res.status(200).json(starBlock);
            } catch (err) {
                res.status(417).json({
                    message: `Error creating block`,
                    description: err
                })
            }
        });
    }

}

module.exports.StarController = StarController;
