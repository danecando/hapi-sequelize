'use strict';

var Hoek = require('hoek');
var sqlizr = require('sqlizr');
var Sequelize = require('sequelize');

/**
 * Creates database connection, imports models, and exposes them via the db object
 * @param plugin
 * @param options
 * @param next
 */
exports.register = function(plugin, options, next) {

    // sequelize query output disabled in production
    var logging = process.env.NODE_ENV === 'production' ? false : console.log;

    // default directory for models
    options.models = options.models || 'models';

    var defaultOptions = {
        host: options.host || 'localhost',
        dialect: options.dialect || 'mysql',
        port: options.port || 3306,
        logging: logging
    };

    // apply top level plugin options to a full sequelize options object
    var sequelizeOptions = Hoek.applyToDefaults(defaultOptions, options.sequelize || {});
    var sequelize = new Sequelize(options.database, options.user, options.pass, sequelizeOptions);

    // test the database connection
    sequelize.authenticate()
        .then(function() {

            // import models
            var db = sqlizr(sequelize, options.models);
            db.sequelize = sequelize;
            db.Sequelize = Sequelize;

            // make available in hapi application
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
