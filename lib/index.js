'use strict';

var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');

/**
 * Register sequelize as a Hapi plugin
 * @param plugin
 * @param options
 * @param next
 */
exports.register = function(plugin, options, next) {

    var db = {};
    var dir = path.join(process.cwd(), options.models);

    var sequelize = new Sequelize(options.database, options.user, options.pass, {
        host: options.host || 'localhost',
        dialect: options.dialect || 'mysql',
        port: options.port || 3306,
        define: options.defaults || {}
    });

    //recursively get all models in 'models' directory, and all nested sub-directories
    var getJSModels = function (folder) {
        var fileContents = fs.readdirSync(folder),
            stats;
     
        fileContents.forEach(function (fileName) {
            stats = fs.lstatSync(folder + '/' + fileName);
     
            if (stats.isDirectory()) {
                getJSModels(folder + '/' + fileName)
            } else {
                if(fileName.indexOf('.') !== 0) {
                    var filePath = path.join(folder, fileName);
                    var model = sequelize.import(filePath);
                    db[model.name] = model;
                }
            }
        });
     
    };

    getJSModels(dir);
    
    Object.keys(db).forEach(function(modelName) {
        if ("associate" in db[modelName]) {
            db[modelName].associate(db);
        }
    });

    db.sequelize = sequelize;
    db.Sequelize = Sequelize;

    plugin.expose('db', db);

    next();
};

exports.register.attributes = {
    pkg: require('../package.json')
};
