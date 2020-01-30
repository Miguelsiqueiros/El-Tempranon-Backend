const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const logger = require('../../src/log/logger');

const mongod = new MongoMemoryServer();

module.exports.Connect = async () => {
  const uri = await mongod.getConnectionString();

  const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  };

  await mongoose
    .connect(uri, mongooseOpts)
    .then(() => logger.info('Connected to in memory MongoDb'));
};

module.exports.CloseDatabase = async () => {
  await mongoose.connection
    .close()
    .then(() => logger.info('Disconnected to in memory MongoDb'));
  await mongod.stop();
};

module.exports.clearDatabase = async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
};
