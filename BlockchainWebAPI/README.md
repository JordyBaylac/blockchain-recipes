# Blockchain WebAPI

A basic REST API using **express**. The API exposes a private blockchain.

## Tech dependencies

- [express](https://expressjs.com/en/4x/api.html), web framework used for exposing the API.
- [levelDB](https://github.com/Level/level) for storing and loading the chain.
- [crypto-js](https://github.com/brix/crypto-js) for hashing blocks.

Application is composed by:

- *app/controllers/*: Block controller exposing method for retrieving and creating blocks.
- *app/domain*: Block and Blockchain entities.
- *app/presistence*: LevelDB wrapper for key-value storage of the blockchain.
- *app/app.js*: REST API definition and entry point of the application.

## Deployment instructions

To start, install package, run node application and then access the API on *localhost:8000/block*

```sh
npm install
npm start
```

    Note: For testing purposes, the blockchain is started with 10 blocks beside the genesis block.  

## API endpoints

- **GET**: ```localhost:8000/block/{blockHeight}``` Get existing Block
- **POST**: ```localhost:8000/block/``` Create a new Block

Check **blockchain.postman_collection.json** file for testing the API with Postman.
