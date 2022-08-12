require('dotenv').config();

const express = require('express');
const http = require('http');
const path = require('path');
const morgan = require('morgan');
const log4js = require('log4js');
const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression');

const { appUtility } = require('./utilities/server-utils');
const { constants } = require('./config');
const { logger } = require("./utilities/log-service.js");

const app = express();
const port = constants.PORT || 8443;

global.logger = logger;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(morgan('combined'));
app.use(compression());
app.use(cors());

// load all routes and middleware =========================================================
appUtility.loadRoutesAndMiddleware(app);

// configuration loggers and sys log
log4js.configure(path.join(__dirname, './config/log-config.json'));

app.use("/ping", function(req, res) {
  res.json({ reply: "pong" });
  res.end();
});

// Event listener to catch uncaught errors
process.on('unhandledRejection', (error) => {
    console.log(error)
    const loggerObject = {
      fileName: "server.js",
      methodName: "unhandledRejection",
      type: constants.LOGGER_LEVELS.ERROR,
      error,
    };
    global.logger(loggerObject);
    console.log(`unhandledRejection : ${error}`);
    process.exit(1);
});

http.createServer(app).listen(port);
