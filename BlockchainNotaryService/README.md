# Blockchain Notary Service

REST API exposing a Star Notary Service. The API uses private blockchain and:

* allow users to submit a validation request.
* allow users to validate the request.
* allow users to submit the Star data.
* allow lookup of Stars by hash, wallet address, and height.

## Tech dependencies

* **express**, REST web framework used for exposing the API.
* **levelDB** for storing and loading the chain.
* **crypto-js** for hashing blocks.
* **hex2ascii** for decoding star content.
* **bitcoinjs-lib** and **bitcoinjs-message** for signature verification.

Application is composed by:

* *app/controllers*: Validation and Star controllers exposing basic methods for validating, storing and searching stars.
* *app/domain*: Block, Blockchain and Mempool definition.
* *app/presistence*: LevelDB wrapper for key-value storage of the blockchain.
* *app/app.js*: REST API definition and entry point of the application.

## Deployment instructions

To start, install dependencies, run node application and then access the API on *localhost:8000/block*

```sh
npm install
npm start
```

## API endpoints

* **POST**: ```localhost:8000/requestValidation``` Requesting validation
* **POST**: ```localhost:8000/message-signature/validate``` Validating signature
* **POST**: ```localhost:8000/block``` Submitting a star (after signature has been verified)
* **GET**: ```localhost:8000/stars/hash:[HASH]``` Get star by block hash
* **GET**: ```localhost:8000/stars/address:[ADDRESS]``` Get stars by wallet address
* **GET**: ```localhost:8000/block/[HEIGHT]``` Get star by block height

Check **blockchain-recipes.postman_collection** file for testing the API with Postman.
