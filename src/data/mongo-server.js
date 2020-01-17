const mongoClient = require("mongoose");
const url = process.env.MongoClient || "mongodb://localhost:27017/Tempranon";

const logger = require("../log/logger");

function Connect() {
  try {
    mongoClient.connect(
      url,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true
      },
      () => logger.info("MongoDb successfuly connected")
    );
  } catch (err) {
    logger.warn(err.stack);
  }
}

module.exports = Connect();
