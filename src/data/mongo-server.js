const MongoClient = require('mongodb').MongoClient;
const loggger = require('../log/logger');

module.exports = async function() {
  const url =
    process.env.MONGO_CONNECTION_STRING ||
    'mongodb://localhost:27017/Tempranon';

  const dbName = 'Tempranon';
  const client = new MongoClient(url, { useNewUrlParser: true });

  try {
    await client.connect();

    return client.db(dbName);
  } catch (err) {
    loggger.error(err.stack);
  }

  client.close();
};
