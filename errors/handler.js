const ApiError = require("./ApiError");

function apiErrorHandler( err, req, res, next ) {

    // TODO: log error library

    if ( err instanceof ApiError ) {
        res.status( err.code).json( err.message );
        return;
    }

    res.status( 500 ).json( "An unknown error has taken place" );
}

module.exports = apiErrorHandler;