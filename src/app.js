const express = require('express');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swaggerSpec');
const router = require('./routes');
const dbConnection = require('./bootstrap/dbConnection');

// Init DB Connection
dbConnection.initDatabase();

const app = express();
// Add json body parser middleware
app.use(express.json());
// Add helmet middleware to add basic security
app.use(helmet());
// Add routing
app.use(router);
// Add Swagger UI Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = app;
