const logger = require('../log/logger');

module.exports = function(req, res) {
  logger.info('GET /Healthcheck');
  res.status(200).send('OK');
};
