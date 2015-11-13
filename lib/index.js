/**
 * hapi-sequelize
 *
 * A Hapi plugin for the Sequelize ORM
 *
 * @author Dane Grant
 */

'use strict';

const Hoek = require('hoek');
const Joi = require('Joi');
const Sequelize = require('sequelize');
const Schema = require('./schema');
const Util = require('./util');
const Api = require('./api');


// Module globals
const internals = {};


exports.register = function(plugin, options, next) {

  // wrap single option object in array
  if (!Array.isArray(options)) {
    options = [options];
  }


};

exports.register.attributes = {
  pkg: require('../package.json')
};
