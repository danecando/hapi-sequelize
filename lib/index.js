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

  // default directory for models
  options.models = options.models || 'models/**/*.js';

  var defaultOptions = {
    host: options.host || 'localhost',
    dialect: options.dialect || 'mysql',
    port: options.port || 3306,
    logging: options.logging === false ? false : options.logging || console.log,
    uri: options.uri === false ? false : options.uri
  };

  // apply top level plugin options to a full sequelize options object
  var sequelizeOptions = Hoek.applyToDefaults(defaultOptions, options.sequelize || {});
  var sequelize;
  if (!options.uri) {
    delete options.uri;
    sequelize = new Sequelize(options.database, options.user, options.pass, sequelizeOptions);
  } else {
    sequelize = new Sequelize(options.uri, sequelizeOptions);
  }

  // test the database connection
  sequelize.authenticate()
    .then(function() {
      // import models
      sqlizr(sequelize, options.models);

      var db = {
        sequelize: sequelize,
        Sequelize: Sequelize
      };

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
