const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Backend Coding Test API Docs',
    version: '1.0.0',
    description: 'Simple App for Coding Test',
    contact: {
      name: 'Tek Loon',
      url: 'https://tekloon.dev',
      email: 'tekloon.1991@gmail.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:8010',
    },
  ],
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJSDoc(options);
