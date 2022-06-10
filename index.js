/**
 * Create a new Node.js project
 * You'll use the same MongoDB cluster/account, but you should create a new database for this project.
 * Create your first REST API routes. You will need at least one GET and one POST for this assignment.
 * Create API documentation for these two routes, and test them
 * Create a new Heroku project
 * Publish your project to Heroku
 * Be sure to create an env file for your local MongoDB credentials, and add config vars to your Heroku project. Your MongoDB credentials should never get pushed to git, so be sure to include your env file in your gitignore.
 * Submit your Github and Heroku links in I-learn
 * 
 * https://www.freecodecamp.org/news/how-to-choose-which-validator-to-use-a-comparison-between-joi-express-validator-ac0b910c1a8c/
 * https://www.freecodecamp.org/news/get-started-with-graphql-and-nodejs/
 * swagger : https://www.youtube.com/watch?v=apouPYPh_as
 */

// imports
const express = require( 'express' );
const bodyParser = require( 'body-parser' ); // get access to request parameters 
const apiErrorHandler = require( './errors/handler' );
const Joi = require( 'joi' ); // returns a class for validation
const { auth } = require('express-openid-connect'); // dereference require, store return in auth variable
require('dotenv').config();

// create port and application
const port = process.env.PORT || 3000;
const app = express();

/*
OAUTH
I´ve been reading a lot to understand oauth.  I have several promising implementation ideas including
https://www.npmjs.com/package/passport-oauth
https://youtu.be/SBvmnHTQIPY
https://tomanagle.medium.com/google-oauth-with-node-js-4bff90180fe6
At this point, I´m not sure what to do with the access token that is returned.  Do I save it, is it saved for me or do I need to give permission each time?
I expect to implement a working login this week

https://www.jamesqquick.com/blog/the-easiest-way-to-add-node-js-user-authentication
https://www.youtube.com/watch?v=w1zvS9-k7EU
*/

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SECRET,
    baseURL: process.env.BASE_URL,
    clientID: process.env.CLIENT_ID,
    issuerBaseURL: process.env.ISSUER_BASE_URL
  };

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use( auth(config) );


/*
http://localhost:3000/login
http://localhost:3000/logout

app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});
*/

// load routes
app
    .use( bodyParser.json() )
    .use(( req, res, next ) => {
        res.setHeader( 'Access-Control-Allow-Origin', '*' ); // CORS
        next();
    })
    .use( '/', require( './routes' )) // goto routes
    .use( apiErrorHandler ); // last middleware

// load db connection
const mongodb = require( './db/connect' );


// listen if connection is made
mongodb.initDb(( err, mongodb ) => {

    // start server if db is connected
    if ( err ) {
        console.log( err );
    }
    else {
        // listen for client requests ... control C to stop server once it is up and running
        app.listen( port, () => {
            console.log( `Connected to DB and listening on port: ${port}` );
        });
    }
});