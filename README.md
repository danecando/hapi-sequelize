# hapi-sequelized - a plugin for using sequelize with hapi

http://hapijs.com/
http://sequelizejs.com/

## Installation
npm install hapi-sequelized --save

## Setup
See http://hapijs.com/tutorials/plugins if you're not sure how hapi plugins work but here is an example:

```javascript
server.pack.register({
    plugin: require('hapi-sequelized'),
    options: {
        database: 'dbName',
        user: 'dbUser',
        pass: 'dbPass',
        dialect: 'mysql'
    }
}, function(err) {
    if (err) throw err;
    
    var models = server.plugins['hapi-sequelized'].models;
    models
    .sequelize
    .sync()
    .complete(function(err) {
        if (err) throw err[0];
        else {
            server.start(function() {
                console.log('Server running at: ', server.info.uri);
            });
        }
    });
});
```

## All Options
```javascript
options: {
    database: 'dbName', // name of your db
    user: 'dbUser',     // db username
    pass: 'dbPass',     // db password
    dialect: 'mysql'    // database type
    port: 8889          // database port #
}
```

## Usage
Create your sequelize models in the models directory in the root of your hapi project. The plugin will automatically import all of your models and make them available throughout your application.

Your models will be availble throughout your application via server.plugins or plugin.plugins
See: http://hapijs.com/api#pluginplugins 

```javascript
var db = plugin.plugins['hapi-sequelized'].models;

db.Test.create({
    email: 'some@email.com',
    password: 'alskfjdfoa'
});
```