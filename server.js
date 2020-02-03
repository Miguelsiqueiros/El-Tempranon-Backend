const express = require('express');
const router = require('./src/Routes/routes');
const bodyParser = require('body-parser');
const cors = require('cors');
const pino = require('pino');
const expressPino = require('express-pino-logger');

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });
const expressLogger = expressPino({ logger });

const healthcheck = require('./src/API/healthcheck');

const port = process.env.PORT || 8080;

function Server() {
  const app = express();

  app.use(bodyParser.json());

  app.use(expressLogger);

  app.use(
    cors({
      origin: 'https://tempranon-angular.herokuapp.com'
    })
  );

  app.use('/api/v1/', router);

  app.get('/', healthcheck);

  if (!module.parent) {
    app.listen(port, () => logger.info(`Listening to port: ${port}`));
  }
  return app;
}

module.exports = Server;
