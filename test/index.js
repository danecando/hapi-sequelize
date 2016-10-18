'use strict';

// Load modules
const Lab = require('lab');
const Code = require('code');
const Hapi = require('hapi');
const Sequelize = require('sequelize');

// Module globals
const internals = {};

// Test shortcuts
const lab = exports.lab = Lab.script();
const test = lab.test;
const expect = Code.expect;

lab.suite('hapi-sequelize', () => {

  test('plugin works', { parallel: true }, (done) => {

    const server = new Hapi.Server();
    server.connection();

    const sequelize = new Sequelize('shop', 'root', '', {
      host: '127.0.0.1',
      port: 3306,
      dialect: 'mysql'
    });

    server.register([
      {
        register: require('../lib'),
        options: [
          {
            name: 'shop',
            models: ['./models/**/*.js'],
            sequelize: sequelize,
            sync: true,
            forceSync: true
          }
        ]
      }
    ], (err) => {
      expect(err).to.not.exist();
      expect(server.plugins['hapi-sequelize']['shop'].sequelize).to.be.an.instanceOf(Sequelize);
      done();
    })
  });
});
