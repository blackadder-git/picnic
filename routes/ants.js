// routes in this file all being with /ants

const router = require( 'express' ).Router();
const antsController = require( '../controllers/ants' );

// GET all ants
router.get( '/', antsController.getAnts );

// GET a single ant based on id
router.get( '/:id', antsController.getAnt );

// POST to create a new ant
router.post( '/', antsController.createAnt );

// PUT to update an ant
router.put( '/:id', antsController.updateAnt );

// DELETE to delete an ant
router.delete( '/:id', antsController.deleteAnt );

module.exports = router;