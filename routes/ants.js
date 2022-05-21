// routes in this file all being with /ants

const router = require( 'express' ).Router();
const antsController = require( '../controllers/ants' );

// GET all ants
router.get( '/', antsController.getAnts );

// GET a single ant based on id
router.get( '/:id', antsController.getAnt );

// POST to create a new ant
router.post( '/', antsController.createAnt );

module.exports = router; // what does this really do ?