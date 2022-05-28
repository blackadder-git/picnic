const Joi = require('joi');
const mongodb = require( '../db/connect' );
const ObjectId = require( 'mongodb' ).ObjectId;
const ApiError = require('../errors/ApiError');

/*******************************
* GET
* find() returns cursor, since then() needs a promise, toArray() is used to convert
* https://www.mongodb.com/docs/manual/reference/method/cursor.toArray/
*******************************/
const getAnts = async ( req, res, next ) => {
    /*
    #swagger.description = 'Return all ants'
    */

    console.log ( "Debug: getAnts" );

    // use then/catch for asynchronous code
    await mongodb.getDb().db().collection( 'ants' ).find().toArray()
    .then ( result => {
        // throw new Error("Intentional error");
        console.log( result );
        res.setHeader( 'Content-Type', 'application/json' );
        res.status( 200 ).json( result) ;
        next();
    })
    .catch (err => {
        // handle db related errors
        console.log( err );
        // res.status( 500 ).json( err || 'An error occurred while getting ants.' );
        next ( ApiError.badRequest( "An error occurred while getting ants" ));
    });
};

/*******************************
* GET
*******************************/
const getAnt = async ( req, res, next ) => {
    /*
    #swagger.description = 'Return the ant with matching id'
    */

    console.log ( "Debug: getAnt" );

    // use try/catch for synchronous request
    try {
        const objectId = new ObjectId( req.params.id ); // throws error on invalid

        // use then/catch for asynchronous request
        await mongodb.getDb().db().collection( 'ants' ).find( { _id: objectId } ).toArray()
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
            // res.status( 500 ).json( err || 'An error occurred while getting the ant' );
            next( ApiError.internalServerError( 'An error occurred while getting the ant' ));
        });
    }
    catch ( err ) {
        next ( ApiError.badRequest( "Error: invalid id" ));
    }        
};

/*******************************
* POST
*******************************/
const createAnt = async ( req, res, next ) => {
    /*
    #swagger.description = 'Create a new ant'
    */

    console.log( "Debug: createAnt" );
    console.log( "Create: ", req.body ); // made possible thanks to body-parser

    // object destructoring ... get the property of the object that gets returned
    const { error } = validateAnt( req.body );

    if (error) {
        next( ApiError.badRequest( 'Invalid ant data: ' + error.details[0].message ));
        return;
    }

    // make sure values exist
    const ant = {
        name: req.body.name,
        species: req.body.species,
        points: req.body.points,
        health: req.body.health,
        colony: req.body.colony
    };

    console.log( "New data: ", ant );

    // use then/catch for asynchronous code
    await mongodb.getDb().db().collection( 'ants' ).insertOne( ant )
    .then ( result => {
        if ( result.acknowledged ) {
            res.setHeader( 'Content-Type', 'application/json' );
            res.status( 201 ).json( result );
            next();
        }
        else {
            // res.status( 500 ).json( 'An error occurred after creating the ant' );
            next( ApiError.internalServerError( 'An error occurred after creating the ant' ));
        }
    })
    .catch ( err => {
        console.log( err );
        //res.status( 500 ).json( err || 'An error occurred while creating the ant' );
        next( ApiError.internalServerError( 'An error occurred while creating the ant' ));
    });
};

/*******************************
* PUT
*******************************/
const updateAnt = async ( req, res, next ) => {
    /*
    #swagger.description = 'Update ant'
    */

    console.log( "Debug: updateAnt" );
    
    try {
        const objectId = new ObjectId( req.params.id );

        // object destructoring ... get the property of the object that gets returned
        const { error } = validateAnt( req.body );

        if ( error ) {
            next( ApiError.badRequest( 'Invalid ant data: ' + error.details[0].message ));
            return;
        }

        const ant = { $set: {
            name: req.body.name,
            species: req.body.species,
            points: req.body.points,
            health: req.body.health,
            colony: req.body.colony
        }};

        // use then/catch for asynchronous code
        await mongodb.getDb().db().collection( 'ants' ).updateOne( { _id: objectId }, ant )
        .then ( result => {
            if ( result.acknowledged ) {
                res.setHeader( 'Content-Type', 'application/json' );
                res.status( 201 ).json( result );
                next();
            }
            else {
                next( ApiError.internalServerError( 'An error occurred after updating the ant' ));
            }
        })
        .catch ( err => {
            console.log( err );
            next( ApiError.internalServerError( 'An error occurred while updating the ant' ));
        });
    }
    catch ( err ) {
        next ( ApiError.badRequest( "Error: invalid id" ));
    }     
};

/*******************************
* DELETE
*******************************/
const deleteAnt = async ( req, res, next ) => {
    /*
    #swagger.description = 'Delete ant
    */

    console.log( "Debut: deleteAnt" );

    try {
        const objectId = new ObjectId( req.params.id );

        // use then/catch for asynchronous code
        await mongodb.getDb().db().collection( 'ants' ).deleteOne({ _id: objectId })
        .then ( result => {
            if ( result.acknowledged ) {
                res.setHeader( 'Content-Type', 'application/json' );
                res.status( 201 ).json( result );
                next();
            }
            else {
                next( ApiError.internalServerError( 'An error occurred after deleting the ant' ));
            }
        })
        .catch ( err => {
            console.log( err );
            next( ApiError.internalServerError( 'An error occurred while deleting the ant' ));
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
function validateAnt( ant ) {
    const schema = Joi.object({
        name: Joi.string().required(),
        species: Joi.string().required(),
        points: Joi.number().required(),
        health: Joi.number().required(),
        colony:  Joi.string().required()
    });

    return schema.validate( ant );
}


module.exports = { getAnts, getAnt, createAnt, updateAnt, deleteAnt };