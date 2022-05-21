const mongodb = require( '../db/connect' );
const ObjectId = require( 'mongodb' ).ObjectId;

/*******************************
* GET
*******************************/
const getAnts = async ( req, res, next ) => {
    /*
    #swagger.description = 'Return all ants'
    */

    console.log( "Debug: getAnts" );

    const result = await mongodb.getDb().db().collection( 'ants' ).find();
    console.log( result );
    result.toArray().then(( lists ) => {
        res.setHeader( 'Content-Type', 'application/json' );
        res.status( 200 ).json( lists) ;
    });
};

/*******************************
* GET
*******************************/
const getAnt = async ( req, res ) => {
    /*
    #swagger.description = 'Return the ant with matching id'
    */

    console.log( "Debug: getAnt" );
    const userId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db().collection( 'ants' ).find({ _id: userId });
    result.toArray().then(( lists ) => {
        res.setHeader( 'Content-Type', 'application/json' );
        res.status( 200 ).json( lists[0] );
    });
};

/*******************************
* POST
*******************************/
const createAnt = async ( req, res ) => {
    /*
    #swagger.description = 'Create a new ant'
    */

    console.log( "Debug: createAnt" );
    console.log( req.body ); // made possible thanks to body-parser

    // make sure values exist
    if (req.body.name.length > 0 &&
        req.body.species.length > 0 &&
        req.body.points.length > 0 &&
        req.body.health.length > 0 &&
        req.body.colony.length > 0
        ) {
        const ant = {
            name: req.body.name,
            species: req.body.species,
            points: req.body.points,
            health: req.body.health,
            colony: req.body.colony
        };

        console.log( ant );

        try {
            const response = await mongodb.getDb().db().collection( 'ants' ).insertOne( ant );
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

module.exports = { getAnts, getAnt, createAnt };