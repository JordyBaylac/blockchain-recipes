# Private Blockchain

A very basic private blockchain implementation using ES6 and levelDB.

It depends on:

- [levelDB](https://github.com/Level/level) for storing and loading the chain.
- [crypto-js](https://github.com/brix/crypto-js) for hashing blocks.

Application is composed by:

- *simpleChain.js*: Block data model and Blockchain implementation.
- *levelSandbox.js*: wrapper around levelDB to store and load the chain.
- *app.js*: sample usage of the blockchain.

To start, install package and run node application.

```sh
npm install
node app.js
```