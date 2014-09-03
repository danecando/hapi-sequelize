var fs          = require('fs'),
    path        = require('path'),
    Sequelize   = require('sequelize'),
    Hoek        = require('hoek'),
    db          = {};

exports.register = function(plugin, options, next) {

    // Create db connection
    var sequelize = new Sequelize(options.database, options.user, options.pass, {
        dialect: options.dialect || 'mysql',
        port: options.port || 8889
    });

    // Add all models in directory to db object
    fs
        .readdirSync(__dirname)
        .filter(function(file) {
            return (file.indexOf('.') !== 0) && (file !== 'index.js') && (file !== 'package.json');
        })
        .forEach(function(file) {
            var model = sequelize.import(path.join(__dirname, file));
            db[model.name] = model;
        });


    // Add associations here


    // Create associations
    Object.keys(db).forEach(function (modelName) {
        if ('associate' in db[modelName]) {
            db[modelName].associate(db)
        }
    });


    // Expose sequelize objects to the application
    plugin.expose('models', Hoek.merge(db, { sequelize: sequelize, Sequelize: Sequelize }));


    next();
};

exports.register.attributes = {
    pkg: require('./package.json')
};