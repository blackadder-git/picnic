// this files gets called by running: npm run swagger (see scripts in package.json)
// https://www.npmjs.com/package/swagger-autogen

const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'My API',
    description: 'Picnic API Documentation',
  },
  //host: 'localhost:3000',
  //schemes: ['http'],
  host: 'picnic-341.herokuapp.com',
  schemes: ['https'],  
};

const outputFile = './swagger.json'; // file to create
const endpointsFiles = ['./routes/index.js']; // file to investigate

/* NOTE: if you use the express Router, you must pass in the 
   'endpointsFiles' only the root file where the route starts,
   such as index.js, app.js, routes.js, ... */

swaggerAutogen(outputFile, endpointsFiles, doc);