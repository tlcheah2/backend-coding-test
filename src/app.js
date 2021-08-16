const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swaggerSpec');
const router = require('./routes');
const dbConnection = require('./bootstrap/dbConnection');

// Init DB Connection
dbConnection.initDatabase();

const app = express();
// Add json body parser middleware
app.use(express.json());
// Add routing
app.use(router);
// Add Swagger UI Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = app;
