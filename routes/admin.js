// routes in this file all being with /admin

const router = require( 'express' ).Router();
//const { auth, requiresAuth } = require('express-openid-connect'); // dereference return
const path = require( 'path' );

// GET admin
router.get( '/', ( req, res ) => {
    console.log( req.oidc.isAuthenticated() );
    
     if ( req.oidc.isAuthenticated() ) {
        res.render( 'admin' ); 
     }
     else {
        res.render( 'index', {
            message: 'You must login first to view the admin page ...'
        } ); 
     }
 });


module.exports = router;