// routes in this file all being with /ants

const router = require( 'express' ).Router();
const antsController = require( '../controllers/ants' );
const { auth, requiresAuth } = require('express-openid-connect'); // dereference return

// GET all ants
router.get( '/', antsController.getAnts );

// GET a single ant based on id
router.get( '/:id', antsController.getAnt );

// POST to create a new ant, require oauth
router.post( '/', requiresAuth(), antsController.createAnt );

// PUT to update an ant, require oauth
router.put( '/:id', requiresAuth(), antsController.updateAnt );

// DELETE to delete an ant, require oauth
router.delete( '/:id', requiresAuth(), antsController.deleteAnt );

module.exports = router;