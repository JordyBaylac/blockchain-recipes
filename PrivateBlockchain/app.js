
const { Blockchain, Block } = require('./simpleChain.js');

(async function() {

    const blockchain = new Blockchain();
    await createBulkBlocks(blockchain);
    printChain(blockchain);

}());

function printChain(myBlockChain) {
    myBlockChain.getChain()
        .then(chain => {
            console.log('-------------------');
            console.log('       Chain');
            console.log('-------------------');
            console.log(chain);
            return myBlockChain.validateChain();
        })
        .then(isValid => {
            console.log('************************');
            console.log('  Is chain valid?', isValid ? "yep" : "nop");
            console.log('************************');
        })
        .catch(err => {
            console.error('unexpected error printing the chain', err);
        });
}

function createBulkBlocks(myBlockChain) {
    return new Promise(async(resolve, _) => {
        
        const height = await myBlockChain.getBlockHeight() || 1; //perhaps the genesis doesn\t exist yet
        const nextTen = height+10;

        (function theLoop(i) {
            setTimeout(function () {
                let blockTest = new Block("Test Block - " + (i + 1));
                myBlockChain.addBlock(blockTest).then(_ => {
                    i++;
                    if (i < nextTen)
                        theLoop(i);
                    else
                        resolve();
                });
            }, 0);
        })(height-1);
    })
}