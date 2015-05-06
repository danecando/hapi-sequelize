## hapi-sequelized - a hapi plugin for the sequelize orm

[![Build Status](https://travis-ci.org/danecando/hapi-sequelized.svg)](https://travis-ci.org/danecando/hapi-sequelized)
[![npm](https://img.shields.io/npm/dm/localeval.svg)](https://www.npmjs.com/package/hapi-sequelized)

* http://hapijs.com/
* http://sequelizejs.com/

### Installation
npm install --save hapi-sequelized

### Loading the plugin
See http://hapijs.com/tutorials/plugins     

```javascript
server.register(
    [
        {
            register: require('hapi-sequelized'),
            options: {
                database: 'dbName',
                user: 'root',
                pass: 'root',
                dialect: 'mysql',
                port: 8889,
                models: 'models/**/*.js',
                sequelize: {
                    define: {
                        underscoredAll: true
                    }
                }
            }
        },
    ], function(err) {
        if (err) {
            console.error('failed to load plugin');
        }
    }
);
```

### Available Options

```javascript
options: {
    database: 'dbName', // database name
    user: 'root',       // db username
    pass: 'root',       // db password
    dialect: 'mysql',   // database type
    host: 'localhost',  // db host
    port: 8889,         // database port #
    models: ['models/**/*.js', 'other/models/*.js'],   // glob or an array of globs to directories containing your sequelize models
    logging: false      // sql query logging
    sequelize: {}       // Application wide model options object passed to the Sequelize constructor http://docs.sequelizejs.com/en/latest/api/sequelize/#new-sequelizedatabase-usernamenull-passwordnull-options
}
```

### Usage
Your models will be available throughout your application via server.plugins (which is also available through the request object ie: request.server.plugins)

```javascript
var db = request.server.plugins['hapi-sequelized'].db;

db.User.create({
    email: 'some@email.com',
    password: 'password123'
});
```

### Model Definitions
Exports a function that returns a model definition 
http://docs.sequelizejs.com/en/latest/docs/models-definition/

```javascript
module.exports = function(sequelize, DataTypes) {
    var StoreOptions = sequelize.define(
        'StoreOptions',
        {
            optionName: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false
            },
            optionValue: {
                type: DataTypes.TEXT
            }
        },
        {
            tableName: 'store_config',
            timestamps: false
        }
    );

    return StoreOptions;
};
```

### Syncing Models
Creates all your tables and sets up your database

```javascript
var db = server.plugins['hapi-sequelized'].db;
db.sequelize.sync().then(function() {
  console.log('models synced');
});
```