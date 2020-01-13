const express = require('express');
const router = require('./src/Routes/routes');
const bodyParser = require('body-parser');

function Server() {
  var port = process.env.Port || 8080;

  const app = express();

  app.use(bodyParser.json());

  app.use('/api/v1/', router);

  return app.listen(port, () => console.log(`Listening to port: ${port}`));
}

Server();

module.exports = Server;
