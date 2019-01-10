
const express = require("express");

const { ValidationController } = require('./controller/validationController');
const { StarController } = require('./controller/starController');

/**
 * Class Definition for the REST API
 */
class NotaryServiceAPI {

    /**
     * Constructor that allows initialize the class 
     */
    constructor() {
		this.app = express();
		this.initExpress();
		this.initExpressMiddleWare();
		this.initControllers();
		this.start();
	}

    /**
     * Initilization of the Express framework
     */
	initExpress() {
		this.app.set("port", 8000);
	}

    /**
     * Initialization of the middleware modules
     */
	initExpressMiddleWare() {
		this.app.use(express.json());
	}

    /**
     * Initilization of all the controllers
     */
	initControllers() {
		new ValidationController(this.app);
		new StarController(this.app);
	}

    /**
     * Starting the REST Api application
     */
	start() {
		let self = this;
		this.app.listen(this.app.get("port"), () => {
			console.log(`Server Listening for port: ${self.app.get("port")}`);
		});
	}

}

new NotaryServiceAPI();