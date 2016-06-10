'use strict';

// Load modules
const Path = require('path');
const Lab = require('lab');
const Code = require('code');
const Hapi = require('hapi');
const Sequelize = require('sequelize');

// Module globals
const internals = {};

// Test shortcutse
const lab = exports.lab = Lab.script();
const suite = lab.suite;
const test = lab.test;
const expect = Code.expect;

suite('hapi-sequelize', () => {

  // test('accepts one or more databases to be configured', { parallel: true }, (done) => {
  //
  //   expect(true).to.equal(true);
  //   done();
  // });
  //
  // test('returns all model files for provided path(s) / glob(s)', { parallel: true }, (done) => {
  //
  // });



  // lab.before((done) => {
  //
  //   // Create Sequelize instances
  //   if (process.env.NODE_ENV === 'travis') {
  //     internals.blogDB = new Sequelize('blog', 'root', '', {
  //       host: 'localhost',
  //       port: 3306,
  //       dialect: 'mysql'
  //     });
  //     internals.shopDB = new Sequelize('shop', 'root', '', {
  //       host: 'localhost',
  //       port: 3306,
  //       dialect: 'mysql'
  //     })
  //   } else {
  //     internals.blogDB = new Sequelize('blog', null, null, {
  //       dialect: 'sqlite',
  //       storage: Path.join(__dirname, 'db/blog.sqlite')
  //     });
  //     internals.shopDB = new Sequelize('shop', null, null, {
  //       dialect: 'sqlite',
  //       storage: Path.join(__dirname, 'db/shop.sqlite')
  //     });
  //   }
  //
  //   done();
  // });




});
