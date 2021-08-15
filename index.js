'use strict';

const express = require('express');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const app = express();
const port = 8010;

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

const buildSchemas = require('./src/schemas');
const swaggerSpec = require('./swaggerSpec');
const logger = require('./src/logger');

db.serialize(() => {
    buildSchemas(db);

    const app = require('./src/app')(db);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


    app.listen(port, () => logger.info(`App started and listening on port ${port}`));
});