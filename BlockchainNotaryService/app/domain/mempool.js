
const { ValidationInfo } = require('./models/validationInfo');

class Mempool {

    constructor(options) {
        this.options = options;
        //pools
        this.validationsPool = {};
        this.validRequestsPool = {};
        //timers
        this.deletionTimers = {};
    }

    storeValidation(walletAddress) {
        const validation = this.getRequestValidation(walletAddress);
        if (validation)
            return validation;

        const newValidation = new ValidationInfo(walletAddress);
        this.validationsPool[walletAddress] = newValidation;
        this._addTimerForDeletion(walletAddress);
        return newValidation;
    }

    storeValidRequest(walletAddress) {
        const validation = this.getRequestValidation(walletAddress);
        if (!validation)
            throw new Error(`Verification not pending or timespan expired for address (${validation.walletAddress})`);

        const updatedValidation = new ValidationInfo().updated(validation);
        if (updatedValidation.validationWindow <= 0) {
            console.log('updatedValidation', updatedValidation);
            throw new Error(`Timespan expired for address (${updatedValidation.walletAddress})`);
        }

        this._removeTimer(walletAddress);
        this.validRequestsPool[walletAddress] = updatedValidation;  
    }

    getRequestValidation(walletAddress) {
        const validation = this.validationsPool[walletAddress];
        return validation ? new ValidationInfo().updated(validation) : null;
    }

    hasValidRequest(walletAddress) {
        return this.validRequestsPool[walletAddress] != null;
    }

    markValidRequestAsUsed(walletAddress) {
        if (this.validRequestsPool[walletAddress] != null) {
            delete this.validRequestsPool[walletAddress];
        }
    }

    _addTimerForDeletion(walletAddress) {
        let self = this;
        let timeout = setTimeout(() => {
            delete self.validationsPool[walletAddress];
        }, this.options.validationWindow);
        this.deletionTimers[walletAddress] = timeout;
    }

    _removeTimer(walletAddress) {
        let timer = this.deletionTimers[walletAddress];
        if (timer) {
            clearTimeout(timer);
            delete this.deletionTimers[walletAddress];
            delete this.validationsPool[walletAddress];
        } 
    }
}

module.exports.mempool = new Mempool({
    validationWindow: 5 * 60 * 1000 // 5 minutes
});
