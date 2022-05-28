const router = require( 'express' ).Router();

// route any uri that begins with /api-docs
router.use( '/api-docs', require( './swagger' )); // goto swagger.js

// route any uri that begins with /ants
router.use( '/ants', require( './ants' )); // goto ants.js

// route any uri that begins with /food
router.use( '/food', require( './foods' )); // goto food.js

// for testing
router.get( '/', ( req, res ) => {
    res.send( 'Welcome to the picnic' );
    // res.json( {'Hello': 'Ants'} );
});

module.exports = router; // make public