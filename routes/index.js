const router = require( 'express' ).Router();
const path = require( 'path' );
const { auth, requiresAuth } = require('express-openid-connect'); // dereference return, store in variables

// route any uri that begins with /api-docs
router.use( '/api-docs', require( './swagger' )); // goto swagger.js

// route any uri that begins with /ants
router.use( '/ants', require( './ants' )); // goto ants.js

// route any uri that begins with /foods
router.use( '/foods', require( './foods' )); // goto food.js


// https://www.youtube.com/watch?v=qTsqpYz5cGE

// req.isAuthenticated is provided from the auth router
router.get( '/', ( req, res ) => {
   console.log( req.oidc.isAuthenticated() );
   
    if ( req.oidc.isAuthenticated() ) {
        res.sendFile( path.join(__dirname, '../views/admin.html') );
    }
    else {
        res.sendFile( path.join(__dirname, '../views/index.html') );
        //res.sendFile( path.join(__dirname, '../views/index.html') );
    }
});

// require oauth to view profile
// https://github.com/auth0/express-openid-connect/blob/master/EXAMPLES.md#3-route-customization
router.get( '/profile', requiresAuth(), (req, res) => {
    //res.send( `hello ${req.oidc.user.name}` );
    console.log( req.oidc );
    res.send( JSON.stringify(req.oidc.user) );
});

module.exports = router; // make public