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

    var dir = [];
    var logging = process.env.NODE_ENV === 'production' ? false : console.log;

    Array.isArray(options.models) ? dir = options.models : dir.push(options.models);

    dir.forEach(function(folder, index, arr) {
        arr[index] = path.join(process.cwd(), folder);
    });

    var sequelize = new Sequelize(options.database, options.user, options.pass, {
        host: options.host || 'localhost',
        dialect: options.dialect || 'mysql',
        port: options.port || 3306,
        define: options.defaults || {},
        logging: logging
    });

    sequelize.authenticate()
        .then(function() {
            var db = {};

            // recursively get all models in 'models' directory, and all nested sub-directories
            var getModels = function(folder) {
                var fileContents = fs.readdirSync(folder)

                fileContents.forEach(function(fileName) {
                    var stats = fs.lstatSync(folder + '/' + fileName);

                    if (stats.isDirectory()) {
                        getModels(folder + '/' + fileName)
                    } else if (fileName.indexOf('.') !== 0) {
                        var filePath = path.join(folder, fileName);
                        var model = sequelize.import(filePath);
                        db[model.name] = model;
                    }
                });
            }

            dir.forEach(function(folder) {
                getModels(folder);
            });

            Object.keys(db).forEach(function(modelName) {
                if ("associate" in db[modelName]) {
                    db[modelName].associate(db);
                }
            });

            db.sequelize = sequelize;
            db.Sequelize = Sequelize;

            plugin.expose('db', db);

            return next();
        })
        .catch(function(err) {
            return next(err);
        });
};

exports.register.attributes = {
    pkg: require('../package.json')
};
