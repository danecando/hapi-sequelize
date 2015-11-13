/**
 * Joi schemas & related methods
 * @module schema
 */

'use strict';

const Joi = require('joi');

// Module globals
const internals = {};

/**
 * DB option schema
 * @type {Joi.schema}
 */
exports.option = internals.option = Joi.object().keys({
  database: Joi.string().required(),
  host: Joi.string().default('localhost'),
  port: Joi.number().default('3306'),
  user: Joi.string().default('root'),
  pass: Joi.string().default('root'),
  dialect: Joi.string().default('mysql'),
  uri: Joi.uri(),
  models: Joi.any().allow(Joi.string(), Joi.array().items(Joi.string())).required(),
  sync: Joi.object(),
  logging: Joi.boolean().default(false),
  sequelize: Joi.object()
});

/**
 * Plugin option schema
 * @type {Joi.schema}
 */
exports.options = Joi.array().items(internals.option);


/**
 * Model definition schema
 * @todo create schema...
 */
exports.model =  Joi.any();
