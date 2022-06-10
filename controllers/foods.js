const Joi = require('joi');
const mongodb = require( '../db/connect' );
const ObjectId = require( 'mongodb' ).ObjectId;
const ApiError = require('../errors/ApiError');

/*******************************
* GET
*******************************/
const getFoods = async ( req, res, next) => {
    /*
    #swagger.description = 'Return all foods'
    */

    console.log( "Debug: getFoods" );

    await mongodb.getDb().db().collection( 'foods' ).find().toArray()
    .then ( result => {
        // throw new Error("Intentional error");
        console.log( result );
        res.setHeader( 'Content-Type', 'application/json' );
        res.status( 200 ).json( result);
        next();
    })
    .catch( err => {
        // handle db related errors
        console.log( err );
        // res.status( 500 ).json( e || 'An error occurred while getting food' );
        next( ApiError.badRequest( "An error occurred while getting foods" ));
    });
};

/*******************************
* GET
*******************************/
const getFood = async ( req, res, next ) => {
    /*
    #swagger.description = 'Return the food with matching id'
    */

    console.log( "Debug: getFood" );

    // use try/catch for synchronous request
    try {
        const objectId = new ObjectId( req.params.id ); // throws error on invalid
        
        await mongodb.getDb().db().collection( 'foods' ).find({ _id: objectId }).toArray()
        .then ( result => {
            // throw new Error("Intentional error");
            console.log( result );            
            res.setHeader( 'Content-Type', 'application/json' );
            res.status( 200 ).json( result[0] );
            next();
        })
        .catch (err => {
            // handle db related errors
            console.log( err );
            next( ApiError.internalServerError( 'An error occurred while getting the food' ));
        });
    }
    catch ( err ) {
        next ( ApiError.badRequest( "Error: invalid id" ));
    }
};

/*******************************
* POST
*******************************/
const createFood = async ( req, res, next ) => {
    /*
    #swagger.description = 'Create a new food'
    #swagger.security = [{
            "oAuthGruffalo": [
                "createFood"
            ]
    }] */

    console.log( "Debug: createFood" );
    console.log( req.body ); // made possible thanks to body-parser

    // object destructoring ... get the property of the object that gets returned
    const { error } = validateFood( req.body );

    if ( error ) {
        next( ApiError.badRequest( 'Invalid food data: ' + error.details[0].message ));
        return;
    }
    const food = {
        name: req.body.name,
        category: req.body.category,
        weight: req.body.weight,
        measure: req.body.measure,
        calories: req.body.calories,
        energy: req.body.energy,
        foodGroup: req.body.foodGroup
    };

    console.log( "New data: ", food );

    await mongodb.getDb().db().collection( 'foods' ).insertOne( food )
    .then ( result => {
        if ( result.acknowledged ) {
            res.setHeader( 'Content-Type', 'application/json' );
            res.status( 201 ).json( result );
            next();
        }
        else {
            next( ApiError.internalServerError( 'An error occurred after creating the food' ));
        }
    })
    .catch ( err => {
        console.log( err );
        next( ApiError.internalServerError( 'An error occurred while creating the food' ));
    });
};

/*******************************
* PUT
*******************************/
const updateFood = async ( req, res, next ) => {
    /*
    #swagger.description = 'Update food'
    #swagger.security = [{
            "oAuthGruffalo": [
                "updateFood"
            ]
    }] */

    console.log( "Debug: updateFood" );
    
    try {
        const objectId = new ObjectId( req.params.id );

        // object destructoring ... get the property of the object that gets returned
        const { error } = validateFood( req.body );

        if ( error ) {
            next( ApiError.badRequest( 'Invalid food data: ' + error.details[0].message ));
            return;
        }

        const food = { $set: {
            name: req.body.name,
            category: req.body.category,
            weight: req.body.weight,
            measure: req.body.measure,
            calories: req.body.calories,
            energy: req.body.energy,
            foodGroup: req.body.foodGroup
        }};

        // use then/catch for asynchronous code
        await mongodb.getDb().db().collection( 'foods' ).updateOne( { _id: objectId }, food )
        .then ( result => {
            if ( result.acknowledged ) {
                res.setHeader( 'Content-Type', 'application/json' );
                res.status( 201 ).json( result );
                next();
            }
            else {
                next( ApiError.internalServerError( 'An error occurred after updating the food' ));
            }
        })
        .catch ( err => {
            console.log( err );
            next( ApiError.internalServerError( 'An error occurred while updating the food' ));
        });
    }
    catch ( err ) {
        console.log( err );
        next ( ApiError.badRequest( "Error: invalid id" ));
    }    
};

/*******************************
* DELETE
*******************************/
const deleteFood = async ( req, res, next ) => {
    /*
    #swagger.description = 'Delete food'
    #swagger.security = [{
            "oAuthGruffalo": [
                "deleteFood"
            ]
    }] */

    console.log( "Debug: deleteFood" );

    try {
        const objectId = new ObjectId( req.params.id );

        // use then/catch for asynchronous code
        await mongodb.getDb().db().collection( 'foods' ).deleteOne({ _id: objectId })
        .then ( result => {
            if ( result.acknowledged ) {
                res.setHeader( 'Content-Type', 'application/json' );
                res.status( 201 ).json( result );
                next();
            }
            else {
                next( ApiError.internalServerError( 'An error occurred after deleting the food' ));
            }
        })
        .catch ( err => {
            console.log( err );
            next( ApiError.internalServerError( 'An error occurred while deleting the food' ));
        });
    }
    catch ( err ) {
        next ( ApiError.badRequest( "Error: invalid id" ));
    }     
};

/*******************************
* VALIDATION
* https://joi.dev/api/?v=17.6.0
*******************************/
function validateFood( food ) {
    // validation
    const schema = Joi.object({
        name: Joi.string().required(),
        category: Joi.string().required(),
        weight: Joi.number().required(),
        measure: Joi.string().required(),
        calories:  Joi.number().required(),
        energy: Joi.number().required(),
        foodGroup: Joi.string().required()
    });

    return schema.validate( food );
}

module.exports = { getFoods, getFood, createFood, updateFood, deleteFood };