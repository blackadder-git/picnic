// routes in this file all being with /foods

const router = require( 'express' ).Router();
const foodsController = require( '../controllers/foods' );
const { auth, requiresAuth } = require('express-openid-connect'); // dereference return

// GET all foods
router.get( '/', foodsController.getFoods );

// GET a single food based on id
router.get( '/:id', foodsController.getFood );

// POST to create a new food, require oauth
router.post( '/', requiresAuth(), foodsController.createFood );

// PUT to update a food, require oauth
router.put( '/:id', requiresAuth(), foodsController.updateFood );

// DELETE to delete a food, require oauth
router.delete( '/:id', requiresAuth(), foodsController.deleteFood );

module.exports = router;