## hapi-sequelize - a hapi plugin for the sequelize orm

[![Build Status](https://travis-ci.org/danecando/hapi-sequelize.svg?branch=master)](https://travis-ci.org/danecando/hapi-sequelize)
[![Coverage Status](https://coveralls.io/repos/github/danecando/hapi-sequelize/badge.svg)](https://coveralls.io/github/danecando/hapi-sequelize)
[![npm](https://img.shields.io/npm/dm/localeval.svg)](https://www.npmjs.com/package/hapi-sequelize)


### Warning

This version of hapi-sequelize should be compatible with at least Hapi 13+ & Sequelize 3.x. If you're
encountering an issue related to any specific version please open an issue. The rewrite of this plugin
 (3.x) has simplified things and made the plugin a bit more flexible. 
 
### Installation

`npm install --save hapi-sequelize`

### Configuration

Simply pass in your sequelize instance and a few basic options and voila. Options accepts a single object
 or an array for multiple dbs.

```javascript
server.register([
  {
      register: require('hapi-sequelize'),
      options: [ 
        {
          name: 'dbname', // identifier
          models: ['./server/models/**/*.js'],  // paths/globs to model files
          sequelize: new Sequelize(config, opts), // sequelize instance
          sync: true, // sync models - default false
          forceSync: false, // force sync (drops tables) - default false
          onConnect: function (database) { // Optional
            // migrations, seeders, etc.
          }
        }
      ]
  }
]);
```

### Database Instances

Each registration adds a DB instance to the `server.plugins['hapi-sequelize']` object with the
name option as the key.

```javascript
function DB(sequelize, models) {
  this.sequelize = sequelize;
  this.models = models;
} 

// smth like this
server.plugins['hapi-sequelize'][opts.name] = new DB(opts.sequelize, models);
```

### API

#### `getDb(name)`

The request object gets decorated with the method `getDb`. This allows you to easily grab a
DB instance in a route handler. If you have multiple registrations pass the name of the one
you would like returned or else the single or first registration will be returned.

```javascript
handler(request, reply) {
  const db1 = request.getDb('db1');
  console.log(db1.sequelize);
  console.log(db1.models);
}
```

#### `db.getModel('User')`

Returns single model that matches the passed argument or null if the model doesn't exist.

#### `db.getModels()`

Returns all models on the db instance

### Contributing 
 If you have any ideas for useful additions to the API or any other improvements to the plugin
 please open an issue or a PR. 
 
 Also feel free to tackle any of the outstanding todo's in the issues. These are mostly currently
 for testing, documentation. I hope to at least provide a reliable, developer friendly plugin.
