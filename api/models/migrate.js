const mongoose = require('mongoose');
const util = require('util');
const debug = require('debug');
const Category = require('./category');

/**
 * Setup mongose
 */
// config should be imported before importing any other file
const config = require('../config/config');

// plugin bluebird promise in mongoose
mongoose.Promise = Promise;

// connect to mongo db
const mongoUri = config.mongo.host;
mongoose.connect(mongoUri,
  {
    // keepAlive: 1,
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

// start migrating
const migrate = async () => {
  // category
  const categories = await Category.find({}).exec()
  const defaultCategories = [
    {
      name: 'Music',
      slug: 'music',
      description: '',
    },{
      name: 'Food & drink',
      slug: 'food-drink',
      description: '',
    },{
      name: 'Business',
      slug: 'business',
      description: '',
    },{
      name: 'Family & Education',
      slug: 'family-education',
      description: '',
    },{
      name: 'Community',
      slug: 'community',
      description: '',
    },{
      name: 'Science & Tech',
      slug: 'science-tech',
      description: '',
    },{
      name: 'Sport',
      slug: 'sport',
      description: '',
    },{
      name: 'Other',
      slug: 'other',
      description: '',
    },
  ]

  if (categories.length == 0){
    console.log( `Migration: `, `Start migrate event categories`);
    defaultCategories.forEach(async cat => {
      const catDoc = new Category(cat);
      try {
        await catDoc.save();
        console.log( `Migration: `, `Event category '${cat.name}' is saved.`);
      } catch (e) {
        console.log(e.message);
      }

    })
  }

  // process.exit();
}

migrate();
