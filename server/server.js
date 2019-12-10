"use strict";
const express = require('express');
const morgan = require('morgan'); //HTTP Logger
const helmet = require('helmet'); //HTTP security
const config = require('config');
//const graphqlHTTP = require('express-graphql');
//const schema = require('./schema/schema');
const mongoose = require('mongoose');

console.log('--==IOU APP STARTING==--');


//Connect to database
console.log("Connecting to DB...");
mongoose.connect(config.get('dbSettings.dbURI'), {useNewUrlParser: true});
var dbConn = mongoose.connection;
dbConn.on('error', console.error.bind(console, 'connection error:'));
dbConn.once('open', function() {
  console.log('Connected to database!');
});

console.log('Express Server starting...');
const svr = express();
const port = config.get('expressSettings.serverPort');


svr.use(helmet({
  frameguard: {
    action: 'deny'
  }
}));

const morganFormat = config.get('expressSettings.morganFormat');
svr.use(morgan(morganFormat));
console.log('Express HTTP request logger started with mode('+morganFormat+')!');

/*
svr.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}));
*/

//add in new route
svr.get('/', function (req, res) {
  res.send('Nothing Here try elsewhere');
});

svr.listen(port, () => {
    console.log('Server listening on port:' + port);
});

process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);

console.log('SIGTERM & SIGINT registered to shutdown gracefully...');
function shutDown() {
  console.log('Received kill signal, shutting down gracefully');
  //Do cleanup here if needed
  //Gracefull shutdown of express not required currently 
  
  //Shutdown DB connection
  //mongoose.disconnect();

  console.log('Bye Bye...');
  process.exit(0);
}


