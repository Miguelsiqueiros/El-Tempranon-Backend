const MongoClient = require('mongodb').MongoClient;
const url = process.env.MongoClient || 'mongodb://localhost:27017/Tempranon';

const logger = require('../log/logger');

async function Client() {
  try {
    const client = new MongoClient(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    await client.connect();
    logger.info('succesfuly conected');
    return client;
  } catch (err) {
    logger.warn(err.stack);
  }
}

module.exports = Client();
