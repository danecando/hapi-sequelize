'use strict';

const Path = require('path');
const Glob = require('glob');

function getFiles(paths, ignored) {
  const opts = {
    nodir: true,
    dot: false
  };

  if (!Array.isArray(paths)) paths = [paths];
  if (ignored) opts.ignore = ignored;

  return paths.reduce((acc, pattern) => {
    const joinPaths = Array.prototype.concat.bind([], acc);
    try {
      const paths = Glob.sync(pattern, opts);
      return joinPaths(paths);
    } catch (e) {
      console.error(e);
      return joinPaths([]);
    }
  }, []);
}

function load(files, fn) {
  if (!files || !files.length) throw new Error('No model files were found');
  if (files && !Array.isArray(files)) files = [files];
  return files.reduce((acc, file) => {
    const models = {};
    const filepath = Path.isAbsolute(file) ? file : Path.join(process.cwd(), file);
    try {
      const Model = fn(filepath);
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

