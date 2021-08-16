const app = require('./src/app');
const logger = require('./src/logger');

const port = 8010;

// Start server
app.listen(port, () => logger.info(`App started and listening on port ${port}`));
