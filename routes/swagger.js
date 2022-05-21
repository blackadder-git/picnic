// routes in this file all being with /api-docs

const router = require( 'express' ).Router();
const swaggerUi = require( 'swagger-ui-express' );
const swaggerDocument = require( '../swagger.json' );

// load whatever swaggerUi.serve is
router.use( '/', swaggerUi.serve );

// pass requests to swaggerDocument ... does this load the UI ?
router.get( '/', swaggerUi.setup( swaggerDocument ));

module.exports = router; // what does this really do ?