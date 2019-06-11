const mongoose = require('mongoose');
const util = require('util');
const debug = require('debug');

// config should be imported before importing any other file
const config = require('./config/config');
const app = require('./config/express');

// const debug = require('debug')('express-mongoose-es6-rest-api:index');

// plugin bluebird promise in mongoose
mongoose.Promise = Promise;

// connect to mongo db
const mongoUri = config.mongo.host;
mongoose.connect(mongoUri,
  {
    keepAlive: 1,
    useNewUrlParser: true,
    useCreateIndex: true
  } );
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${mongoUri}`);
});

// print mongoose logs in dev env
if (config.mongooseDebug) {
  mongoose.set('debug', (collectionName, method, query, doc) => {
    debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
  });
}

const server = require('http').createServer(app)
const io = require('socket.io')(server)

io.on("connection", function() {
  console.log('a user connected')
});

app.set("io", io)

// listen on port config.port
server.listen(config.port, () => {
  console.info(`server started on port ${config.port} (${config.env})`); // eslint-disable-line no-console
});

module.exports = app;
