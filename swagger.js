// this files gets called by running: npm run swagger (see scripts in package.json)
// https://www.npmjs.com/package/swagger-autogen
// https://medium.com/swlh/automatic-api-documentation-in-node-js-using-swagger-dd1ab3c78284

const swaggerAutogen = require('swagger-autogen')();

// https://sookocheff.com/post/api/securing-a-swagger-api-with-oauth2/
// https://swagger.io/docs/specification/authentication/
const doc = {
  "swagger": "2.0",
  info: {
    title: 'My API',
    description: 'Picnic API Documentation',
    version: '1.0.0'
  },
  /*
  securityDefinitions: {
    oAuthSample: {
      type: 'oauth2',
      // authorizationUrl: 'https://petstore.swagger.io/oauth/authorize', https://picnic-341.herokuapp.com/
      // https://auth0.com/docs/get-started/authentication-and-authorization-flow/add-login-auth-code-flow
      // https://manage.auth0.com/dashboard/us/dev-pnt80ma5/applications/5CWBdX2PemFCbEYEIeTKPv39W51kK1bq/settings
      //authorizationUrl: 'https://dev-pnt80ma5.us.auth0.com/authorize?response_type=code&client_id=5CWBdX2PemFCbEYEIeTKPv39W51kK1bq&redirect_uri=http://localhost:3000/callback&scope=SCOPE&state=STATE',
      //authorizationUrl: 'https://dev-pnt80ma5.us.auth0.com/authorize',
      authorizationUrl: 'https://dev-pnt80ma5.us.auth0.com/oauth/authorize',
      flow: 'implicit',
      scopes: {
        createAnt: 'create ant',
        deleteAnt: 'delete ant'
      }
    }
  },*/
  // authorization url = https://dev-pnt80ma5.us.auth0.com/authorize
  // token url = https://dev-pnt80ma5.us.auth0.com/oauth/token
  /*
  https://swagger.io/docs/specification/authentication/oauth2/
  https://auth0.com/docs/quickstart/webapp/express/interactive
  flows are also called grant types, available in Auth0 | Applications | Settings | Advanced Settings
  Implicit (implicit), Authorization Code (authorizationCode), Refresh Token, Client Credentials (clientCredentials), Password (password), MFA, Passwordless OTP
  */
  /*
  If I define a security policy here, an authorize button appears on the swagger doc.  
  The padlock should be opened when I´m not authenticated and closed when I am however this is a problem.  If I secure the page
  and require login to reach it, I see that the padlock still is open.  If I authenticate on the doc page, the padlock will close
  including the locks on the individual routes however I still can't run them.
  So somehow the initial login state is not being transferred to the docs page.
  On the docs page, I have tried several different forms of flow.  While implicit prompted for a client id, it still didn´t work
  authorizationCode looked more promising however this grant type always returned a missing client_id message
  accessCode asked for a client_id and client_secret (this can't be the best way to authenticate) let me login in and closed the padlocks
  on the page.  Unfortunately, when I tried to use the secure routes, they failed
  console message reads, "UnauthorizedError: Authentication is required for this route." so although it looked like it worked
  it didn´t 
  */
  securityDefinitions: {
    oAuthGruffalo: {
      type: 'oauth2',
      //flow: 'authorizationCode',
      flow: 'accessCode',
      authorizationUrl: 'https://dev-pnt80ma5.us.auth0.com/oauth/authorize',
      tokenUrl: 'https://dev-pnt80ma5.us.auth0.com/oauth/token',
        scopes: {
          createAnt: 'create ant',
          putAnt: 'update ant',
          deleteAnt: 'delete ant',
          createFood: 'create food',
          putFood: 'update food',
          deleteFood: 'delete food'
      }      
    }
  },
  //host: 'localhost:3000',
  //schemes: ['http'],
  host: 'picnic-341.herokuapp.com',
  schemes: ['https'],  
};

const outputFile = './swagger.json'; // file to create
const endpointsFiles = ['./routes/index.js']; // file to investigate

/* NOTE: if you use the express Router, you must pass in the 
   'endpointsFiles' only the root file where the route starts,
   such as index.js, app.js, routes.js, ... */

swaggerAutogen( outputFile, endpointsFiles, doc );