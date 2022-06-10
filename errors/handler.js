const ApiError = require("./ApiError");

function apiErrorHandler( err, req, res, next ) {

    // TODO: log error library

    if ( err instanceof ApiError ) {
        res.status( err.code).json( err.message );
        return;
    }

    console.log( err );
    res.status( 500 ).json( "An unknown error has taken place. Make sure you are logged in to post, put, or delete" );
}

module.exports = apiErrorHandler;