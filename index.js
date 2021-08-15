const swaggerUi = require('swagger-ui-express');
const sqlite3 = require('sqlite3').verbose();
// const bodyParser = require('body-parser');

const db = new sqlite3.Database(':memory:');
const app = require('./src/app')(db);

const port = 8010;

// const jsonParser = bodyParser.json();

const buildSchemas = require('./src/schemas');
const swaggerSpec = require('./swaggerSpec');
const logger = require('./src/logger');

db.serialize(() => {
  buildSchemas(db);

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.listen(port, () => logger.info(`App started and listening on port ${port}`));
});
