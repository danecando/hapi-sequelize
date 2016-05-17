## hapi-sequelized - a hapi plugin for the sequelize orm

[![npm](https://img.shields.io/npm/dm/localeval.svg)](https://www.npmjs.com/package/hapi-sequelized)

### Warning

This version is still in beta. Hardly and only tested with current versions of Hapi (13.x) & Sequelize (3.x)

### Installation

`npm install --save hapi-sequelize`

### Configuration

Simply pass in your sequelize instance and a few basic options and voila. Options accepts a single object
 or an array for multiple dbs.

```javascript
server.register([
  {
      register: require('hapi-sequelized'),
      options: [ 
        {
          name: 'dbname', // identifier
          models: ['./server/models/**/*.js'],  // paths/globs to model files
          sequelize: new Sequelize(config, opts), // sequelize instance
          sync: true, // sync models - default false
          forceSync: false // force sync (drops tables) - default false
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

### TODO/Contributing

  * finalize api
  * write tests
  * improve readme
