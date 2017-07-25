'use strict';

// Load modules
const Lab = require('lab');
const Code = require('code');
const Sinon = require('sinon');
const Hapi = require('hapi');
const Sequelize = require('sequelize');

// Module globals
const internals = {};

// Test shortcuts
const lab = exports.lab = Lab.script();
const test = lab.test;
const expect = Code.expect;

// Test DB
const host = process.env.MYSQL_HOST || '127.0.0.1';
const port = process.env.MYSQL_PORT || '3306';

lab.suite('@fredguile/hapi-sequelize', () => {

  test('plugin works', { parallel: true }, (done) => {

    const server = new Hapi.Server();
    server.connection();

    const sequelize = new Sequelize('shop', 'root', '', {
      host,
      port,
      dialect: 'mysql'
    });

    const onConnect = function (database) {
      server.log('onConnect called');
    }

    const spy = Sinon.spy(onConnect);

    server.register([
      {
        register: require('../lib'),
        options: [
          {
            name: 'shop',
            models: ['./test/models/**/*.js'],
            sequelize: sequelize,
            sync: true,
            forceSync: true,
            onConnect: spy
          }
        ]
      }
    ], (err) => {
      expect(err).to.not.exist();
      expect(server.plugins['@fredguile/hapi-sequelize']).to.exist();
      expect(server.plugins['@fredguile/hapi-sequelize']['shop'].sequelize).to.be.an.instanceOf(Sequelize);
      expect(spy.getCall(0).args[0]).to.be.an.instanceOf(Sequelize);
      server.plugins['@fredguile/hapi-sequelize']['shop'].sequelize.query('show tables', { type: Sequelize.QueryTypes.SELECT }).then((tables) => {
        expect(tables.length).to.equal(6);
        done();
      });
    })
  });

  test('plugin throws error when no models are found', { parallel: true }, (done) => {

    const server = new Hapi.Server();
    server.connection();

    const sequelize = new Sequelize('shop', 'root', '', {
      host,
      port,
      dialect: 'mysql'
    });

    server.register([
      {
        register: require('../lib'),
        options: [
          {
            name: 'foo',
            models: ['./foo/**/*.js'],
            sequelize: sequelize,
            sync: true,
            forceSync: true
          }
        ]
      }
    ], (err) => {
      expect(err).to.exist();
      done();
    })
  });
});
