/**
 * hapi-sequelize
 *
 * A Hapi plugin for the Sequelize ORM
 *
 * ## config (not finalized)
 *  [{
 *    name: 'instance-name',
 *    models: ['path/one', 'path/two'],
 *    instance: new Sequelize(options),
 *    debug: true
 *  }]
 *
 * @exports
 */

'use strict';


// Module globals
const internals = {};

exports.register = function(server, options, next) {

};


exports.register.attributes = {
  pkg: require('../package.json')
};
