const { mempool } = require('../domain/mempool');
const { verifyMessage } = require('../domain/identityVerification');

class ValidationController {

    constructor(app) {
        this.app = app;
        this.requestValidation();
        this.validateSignature();
    }

    /**
     * POST Endpoint for requesting validation.
     * 
     * Request:
     *  - { "address":"..." }
     * 
     */
    requestValidation() {
        this.app.post("/requestValidation", (req, res) => {
            console.log("injected amazing");
            // checking that address was provided
            if (!req.body || !req.body.address) {
                res.status(417).json({
                    message: 'Error requesting validation',
                    description: 'Request validation action needs an address as input'
                });
                return;
            }
            const validationInfo = mempool.storeValidation(req.body.address);
            res.status(200).json(validationInfo);
        });
    }

    /**
    * POST Endpoint for validating signature.
    * 
    * Request:
    *  - { address:"...", signature: "..." }
    * 
    */
    validateSignature() {
        this.app.post("/message-signature/validate", (req, res) => {

            // checking that address and signature were provided
            if (!req.body || !req.body.address || !req.body.signature) {
                res.status(417).json({ 
                    message: 'Error validating signature',
                    description: 'Message validation needs an address and a signature as input'
                });
                return;
            }

            const { address, signature } = req.body;

            let requestValidation = mempool.getRequestValidation(address);
            if (!requestValidation) {
                res.status(401).json({
                    message: 'Error validating signature',
                    description: `Verification not pending or timespan expired for address (${address})`
                });
                return;
            }

            const isValid = verifyMessage(requestValidation.message, address, signature)
            if (isValid)
                mempool.storeValidRequest(address);

            res.status(200).json({
                registerStar: isValid,
                status: {
                    ...requestValidation,
                    messageSignature: isValid
                }
            });
        });
    }

}

module.exports.ValidationController = ValidationController;
