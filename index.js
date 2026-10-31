const express = require('express');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const gen_routes = require('./router/general.js').general;

const app = express();
app.use(express.json());

app.use('/customer', session({secret: 'fingerprint_customer', resave: true, saveUninitialized: true}));

app.use('/customer/auth', function auth(req,res,next){
  next();
});

app.use('/', gen_routes);
app.use('/customer', customer_routes);

const PORT = 5000;
app.listen(PORT, ()=>console.log('Server is running on port 5000'));
