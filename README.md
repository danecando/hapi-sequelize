# hapi-seq - a plugin for using sequelize with hapi

http://hapijs.com/
http://sequelizejs.com/

This plugin is a port of the example of using sequelize with express from: http://sequelizejs.com/articles/express

## Installation
I have left in the lodash.extend in for now so this plugin requires lodash to work. You can run npm install in the plugin directory or npm install lodash in your project root.

## Setup
See http://hapijs.com/tutorials/plugins if you're not sure how hapi plugins work but here is an example:

    server.pack.register({
        plugin: require('./hapi-seq'),
        options: {
            database: 'dbName',
            user: 'dbUser',
            pass: 'dbPass',
            dialect: 'mysql'
        }
    }, function(err) {
        if (err) throw err;
        
        var models = server.plugins['hapi-seq'].models;
        models
        .sequelize
        .sync({ force: true })
        .complete(function(err) {
            if (err) throw err[0];
            else {
                server.start(function() {
                    console.log('Server running at: ', server.info.uri);
                });
            }
        });
    });


## Options

        options: {
            database: 'dbName', // name of your db
            user: 'dbUser',     // db username
            pass: 'dbPass',     // db password
            dialect: 'mysql'    // database type
            port: 8889          // database port #
        }

## Usage
Create your sequelize models in the hapi-seq directory. The plugin will automatically import all of your models and make them available throughout your application.

Your models will be availble throughout your application via server.plugins or plugin.plugins
See: http://hapijs.com/api#pluginplugins 

    var db = plugin.plugins['hapi-seq'].models;
    
    db.Test.create({
        email: 'some@email.com',
        password: 'alskfjdfoa'
    });