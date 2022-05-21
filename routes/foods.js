// routes in this file all being with /food

const router = require( 'express' ).Router();
const foodsController = require( '../controllers/foods' );

// GET all foods
router.get( '/', foodsController.getFoods );

// GET a single food based on id
router.get( '/:id', foodsController.getFood );

// POST to create a new food
router.post( '/', foodsController.createFood );

module.exports = router; // what does this really do ?