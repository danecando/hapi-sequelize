'use strict';

const Glob = require('glob');

function getFiles(paths, ignored) {
  const opts = {
    nodir: true,
    dot: false
  };

  if (!Array.isArray(paths)) paths = [paths];

  if (ignored && !Array.isArray(ignored)) opts.ignore = [ignored];
  else if (ignored) opts.ignore = ignored;

  return paths.reduce((acc, glob) => {
    const joinPaths = [].concat.bind(null, acc);
    try {
      const paths = Glob.sync(glob, opts);
      return joinPaths(paths);
    } catch (e) {
      console.error(e);
      return joinPaths([]);
    }
  }, []);
}

function load(files, fn) {
  if (!files) throw new Error('No model files were found');
  if (files && !Array.isArray(files)) files = [files];
  return files.reduce((acc, path) => {
    const models = {};
    try {
      const Model = fn(path);
      models[Model.name] = Model;
    } catch (e) {
      console.error(e);
    }
    return Object.assign({}, acc, models);
  }, {});
}

function applyRelations(models) {
  if (!models || typeof models !== 'object')
    throw new Error('Can\'t apply relationships on invalid models object');

  Object.keys(models).forEach((name) => {
    if (models[name].hasOwnProperty('associate')) {
      models[name].associate(models);
    }
  });

  return models;
}

module.exports = {
  getFiles: getFiles,
  load: load,
  applyRelations: applyRelations
};

