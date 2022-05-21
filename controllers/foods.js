const mongodb = require( '../db/connect' );
const ObjectId = require( 'mongodb' ).ObjectId;

/*******************************
* GET
*******************************/
const getFoods = async ( req, res ) => {
    /*
    #swagger.description = 'Return all foods'
    */

    console.log( "Debug: getAll" );

    const result = await mongodb.getDb().db().collection( 'foods' ).find();
    console.log( result );
    result.toArray().then(( lists ) => {
        res.setHeader( 'Content-Type', 'application/json' );
        res.status( 200 ).json( lists) ;
    });
};

/*******************************
* GET
*******************************/
const getFood = async ( req, res ) => {
    /*
    #swagger.description = 'Return the food with matching id'
    */

    console.log( "Debug: getSingle" );
    const userId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db().collection( 'foods' ).find({ _id: userId });
    result.toArray().then(( lists ) => {
        res.setHeader( 'Content-Type', 'application/json' );
        res.status( 200 ).json( lists[0] );
    });
};

/*******************************
* POST
*******************************/
const createFood = async ( req, res ) => {
    /*
    #swagger.description = 'Create a new food'
    */

    console.log( "Debug: createFood" );
    console.log( req.body ); // made possible thanks to body-parser

    // make sure values exist
    if (req.body.name.length > 0 &&
        req.body.category.length > 0 &&
        req.body.weight.length > 0 &&
        req.body.measure.length > 0 &&
        req.body.calories.length > 0 &&
        req.body.energy.length > 0 &&
        req.body.foodGroup.length > 0
        ) {
        const food = {
            name: req.body.name,
            category: req.body.category,
            weight: req.body.weight,
            measure: req.body.measure,
            calories: req.body.calories,
            energy: req.body.energy,
            foodGroup: req.body.foodGroup
        };

        console.log( food );

        try {
            const response = await mongodb.getDb().db().collection( 'foods' ).insertOne( food );
            if ( response.acknowledged ) {
                res.setHeader( 'Content-Type', 'application/json' );
                res.status( 201 ).json( response );
            }
            else {
                res.status( 500 ).json( response.error || 'Some error occurred while creating the document.' );
            }
        }
        catch ( err ) {
            console.log( err );
            res.status( 500 ).json( response.error || 'Some error occurred while creating the document.' );
        }
    }
    else {
        res.status( 500 ).json( "error: missing data" );
    }
};

module.exports = { getFoods, getFood, createFood };