const mongoose = require('mongoose');
const config = require('./config');

const connect = () => {
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

  return mongoose;
}

module.exports = connect;