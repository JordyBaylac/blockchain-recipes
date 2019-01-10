const bitcoin = require('bitcoinjs-lib');
const bitcoinMessage = require('bitcoinjs-message');

function verifyMessage(message, address, signature) {
    return bitcoinMessage.verify(message, address, signature);
}

module.exports.verifyMessage = verifyMessage;
