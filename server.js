const express = require('express');
const router = require('./src/Routes/routes');
const bodyParser = require('body-parser');
const pino = require('pino');
const expressPino = require('express-pino-logger');

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });
const expressLogger = expressPino({ logger });

const mongo = require('./src/data/mongo-server');

function Server() {
  const port = process.env.Port || 8080;

  mongo.call();

  const app = express();

  app.use(bodyParser.json());

  app.use(expressLogger);

  app.use('/api/v1/', router);

  return app.listen(port, () => logger.info(`Listening to port: ${port}`));
}

Server();

module.exports = Server;
