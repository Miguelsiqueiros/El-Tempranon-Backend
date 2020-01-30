const logger = require('./src/log/logger');
const port = process.env.PORT || 8080;
const server = require('./server');

const app = server.call();
app.listen(port, () => logger.info(`Listening to port: ${port}`));
