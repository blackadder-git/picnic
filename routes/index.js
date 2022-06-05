const router = require( 'express' ).Router();
const path = require( 'path' );

// route any uri that begins with /api-docs
router.use( '/api-docs', require( './swagger' )); // goto swagger.js

// route any uri that begins with /ants
router.use( '/ants', require( './ants' )); // goto ants.js

// route any uri that begins with /food
router.use( '/food', require( './foods' )); // goto food.js


// authentication
router.get( '/auth', ( req, res ) => {
    res.redirect( `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&${process.env.GITHUB_SECRET}` );
});

// https://www.youtube.com/watch?v=qTsqpYz5cGE

// home page
router.get( '/', ( req, res ) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

module.exports = router; // make public