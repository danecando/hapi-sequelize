## hapi-sequelize - a Node.js Hapi plugin for Sequelize ORM

[![npm](https://img.shields.io/npm/dm/localeval.svg)](https://www.npmjs.com/package/hapi-sequelize)
![status](https://img.shields.io/badge/build-beta-red.svg)
![hapi version](https://img.shields.io/badge/hapi-v.13.x-yellow.svg)
![sequelize version](https://img.shields.io/badge/sequelize-v.3.x-yellow.svg)

### About

hapi-sequelize is a Node.js [Hapi](http://hapijs.com) ([GitHub](https://github.com/hapijs/hapi)) plugin for the [Sequelize ORM](http://docs.sequelizejs.com/en/v3/). Sequalize is Promise-based, Object-Relational mapping for Node.js compatable with PostgreSQL, MySQL, MariaDB, SQLite and MSSQL. hapi-sequelize connects your Node.js application with these databases!

This version is still in beta. Tested with Hapi (13.x) and Sequelize (3.x) older versions have not been tested.

### Installation

`npm install --save hapi-sequelize`

### Configuration

Simply pass in your Sequelize instance to hapi-sequalize and a few basic options and voilà! Options will accept a single object or an array (for multiple databases).

```javascript
server.register([
  {
      register: require('hapi-sequelize'),
      options: [ 
        {
          name: '<DBNAME>',         // identifier
          models: ['./server/models/**/*.js'],        // paths/globs to model files
          sequelize: new Sequelize(config, opts),     // sequelize instance
          sync: true,               // sync models - default false
          forceSync: false          // force sync (drops tables) - default false
        }
      ]
  }
]);
```

### Database Instances

Each registration adds a database instance to the `server.plugins['hapi-sequelize']` object with the name option as the key.

```javascript
function DB(sequelize, models) {
  this.sequelize = sequelize;
  this.models = models;
} 

// something like this
server.plugins['hapi-sequelize'][opts.name] = new DB(opts.sequelize, models);
```

-----  
### API

#### `getDb(name)`

The request object gets decorated with the method `getDb`. This allows you to easily grab a
database instance in a route handler. If you have multiple registrations, pass the name of the one
you would like returned. Otherwise the single or first registration will be returned.

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

Returns all models on the database instance.

-----

### TODO and Contributing

  * Finalize API
  * Write Tests
  * Improve README.md
