const logger = require('./src/log/logger');
const port = process.env.PORT || 8080;
const server = require('./server');
const mongo = require('./src/data/mongo-server');

const app = server.call();
mongo.call();
app.listen(port, () => logger.info(`Listening to port: ${port}`));
