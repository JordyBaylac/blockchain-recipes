
class ValidationInfo {

    constructor(walletAddress) {
        if (!walletAddress) return;
        this.walletAddress = walletAddress;
        this.requestTimeStamp = this._nowtimeStamp();
        this.message = `${walletAddress}:${this.requestTimeStamp}:starRegistry`;
        this.validationWindow = 300; //seconds
    }
    
    //factory constructor to return an updated ValidationInfo object
    updated(validationInfo) {
        const timeElapse = this._nowtimeStamp() - validationInfo.requestTimeStamp;
        const timeLeft = validationInfo.validationWindow - timeElapse; 
        return { ...validationInfo, validationWindow: timeLeft };
    }
    
    _nowtimeStamp() {
        return new Date().getTime().toString().slice(0,-3);
    }
}

module.exports.ValidationInfo = ValidationInfo;
