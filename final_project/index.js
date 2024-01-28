const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req, res, next){
    // Check if the user is authenticated using the session and access token
    if (req.session && req.session.accessToken) {
      // Access token is found in the session, user is authenticated
      next();
    } else {
      // Access token is not found, user is not authenticated
      res.status(401).json({ message: 'Unauthorized access' });
    }
  });
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
