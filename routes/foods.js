// routes in this file all being with /food

const router = require( 'express' ).Router();
const foodsController = require( '../controllers/foods' );

// GET all foods
router.get( '/', foodsController.getFoods );

// GET a single food based on id
router.get( '/:id', foodsController.getFood );

// POST to create a new food
router.post( '/', foodsController.createFood );

// PUT to update a food
router.put( '/:id', foodsController.updateFood );

// DELETE to delete a food
router.delete( '/:id', foodsController.deleteFood );

module.exports = router;