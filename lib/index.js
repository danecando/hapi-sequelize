'use strict';

var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var sqlizr = require('sqlizr')
var defaults = require('defaults')
var omit = require('lodash.omit')

var toOmit = ['user', 'pass', 'database', 'models']

var defaultOptions = {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306,
    define: {},
    logging: process.env.NODE_ENV === 'production' ? false : console.log
}

/**
 * Register sequelize as a Hapi plugin
 * @param plugin
 * @param options
 * @param next
 */
exports.register = function(plugin, options, next) {

    var sqlOpts = omit(options, toOmit)
    var sequelize = new Sequelize(options.database, options.user, options.pass, sqlOpts);

    sequelize.authenticate()
        .then(function() {
            var db = sqlizr(sequelize, options.models);

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
