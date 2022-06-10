// routes in this file all being with /api-docs

const router = require( 'express' ).Router();
const swaggerUi = require( 'swagger-ui-express' );
const swaggerDocument = require( '../swagger.json' );
const { auth, requiresAuth } = require('express-openid-connect'); // dereference return, store in variables
require('dotenv').config();

// load whatever swaggerUi.serve is
router.use( '/', swaggerUi.serve );

const options = {
    swaggerOptions: {
        client_id: process.env.CLIENT_ID
    }
}

// pass requests to swaggerDocument ... does this load the UI ?
// #swagger.ignore = true
//router.get( '/', swaggerUi.setup( swaggerDocument, options ));
router.get( '/', requiresAuth(), swaggerUi.setup( swaggerDocument ));

module.exports = router; // what does this really do ?