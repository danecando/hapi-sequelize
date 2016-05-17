/**
 * hapi-sequelize
 *
 * A Hapi plugin for the Sequelize ORM
 *
 * ## config
 *  [{
 *    name: 'dbname',
 *    models: ['path/one/*.js', 'path/two/*.js'],
 *    sequelize: new Sequelize(options),
 *    sync: true,
 *    forceSync: false,
 *    debug: true
 *  }]
 *
 * @exports register
 */

'use strict';

const Joi = require('joi');
const Schema = require('./schema');
const Models = require('./models');
const DB = require('./DB');
const Pkg = require('../package.json');

// Module globals
const internals = {};

internals.configure = function (opts) {
  return opts.sequelize.authenticate()
    .then(() => {
      const files = Models.getFiles(opts.models);
      const models = Models.applyRelations(Models.load(files, opts.sequelize.import.bind(opts.sequelize)));

      if (opts.sync) {
        return opts.sequelize.sync({ force: opts.forceSync })
          .then(() => Promise.resolve(new DB(opts.sequelize, models)));
      }

      return Promise.resolve(new DB(opts.sequelize, models));
    });
};

exports.register = function(server, options, next) {
  if (!options) throw new Error('Missing hapi-sequelize plugin options');
  if (!Array.isArray(options)) options = [options];

  const validation = Joi.validate(options, Schema.options);
  if (!validation || validation.error) throw validation.error;

  const getDb = (request) => {
    return function getDb(name) {
      if (!name || !request.server.plugins[Pkg.name].hasOwnProperty(name)) {
        const key = Object.keys(request.server.plugins[Pkg.name]).shift();
        return request.server.plugins[Pkg.name][key];
      }
      return request.server.plugins[Pkg.name][name];
    };
  };

  server.decorate('request', 'getDb', getDb, { apply: true });

  const configured = options.reduce((acc, opts) => {
    return [].concat(acc, [
      internals.configure(opts)
        .then((db) => {
          server.expose(opts.name, db);
          return Promise.resolve(db);
        })
    ]);
  }, []);

  return Promise.all(configured)
    .then(() => next())
    .catch((err) => next(err));
};


exports.register.attributes = {
  pkg: Pkg
};
