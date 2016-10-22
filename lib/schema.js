'use strict';

const Joi = require('joi');
const Sequelize = require('sequelize');

const internals = {};

internals.option = exports.option = Joi.object().keys({
  name: Joi.string().token().required(),
  models: Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string())),
  sequelize: Joi.object().type(Sequelize).required(),
  sync: Joi.boolean().default(false),
  forceSync: Joi.boolean().default(false),
  debug: Joi.boolean(),
  onConnect: Joi.func().arity(1)
});

exports.options = Joi.alternatives().try(Joi.array().items(internals.option), internals.option);
