# hapi-sequelized - a plugin for using sequelize with hapi

[![Build Status](https://travis-ci.org/tribou/hapi-sequelized.svg)](https://travis-ci.org/tribou/hapi-sequelized)

* http://hapijs.com/
* http://sequelizejs.com/

## Installation
npm install hapi-sequelized --save

## Setup
See http://hapijs.com/tutorials/plugins if you're not sure how hapi plugins work but here is an example:

```javascript
server.register(
    [
        {
            register: require('hapi-sequelized'),
            options: {
                models: 'models',
                database: 'dbname',
                user: 'root',
                pass: 'root',
                port: 8889
            }
        }
    ], function(err) {
        if (err) {
            console.log('failed to load plugin');
        }
    }
);
```

## Available Options
```javascript
options: {
    host: 'localhost',  // db host
    database: 'dbName', // name of your db
    user: 'dbUser',     // db username
    pass: 'dbPass',     // db password
    dialect: 'mysql',   // database type
    port: 8889,         // database port #
    models: 'models',   // path to models directory from project root
    defaults: { }       // see: http://sequelize.readthedocs.org/en/latest/docs/getting-started/#application-wide-model-options
}
```

## Usage
Create your sequelize models in the models directory in the root of your hapi project. The plugin will automatically import all of your models and make them available throughout your application.

Your models will be availble throughout your application via server.plugins (which is also available through the request object ie: request.server.plugins) or plugin.plugins
See: http://hapijs.com/api#pluginplugins

```javascript
var db = request.server.plugins['hapi-sequelized'].db;

db.Test.create({
    email: 'some@email.com',
    password: 'alskfjdfoa'
});
```
