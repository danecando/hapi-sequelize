// Load modules
var Lab = require('lab');
var Code = require('code');
var Hapi = require('hapi');
var Sequelize = require('sequelize');

// Test shortcuts
var lab = exports.lab = Lab.script();
var expect = Code.expect;
var beforeEach = lab.beforeEach;
var describe = lab.describe;
var it = lab.it;

describe('Hapi-Sequelized', function () {

    // Hapi server for each test
    var server;

    // Options to test
    var options = {
        host: 'myhostname', // db host
        database: 'dbName', // name of your db
        user: 'dbUser', // db username
        pass: 'dbPass', // db password
        dialect: 'sqlite', // database type
        port: 8889, // database port #
        models: 'test/models', // path to models directory from project root
        defaults: {
            timestamps: false
        } // see: http://sequelize.readthedocs.org/en/latest/docs/getting-started/#application-wide-model-options
    };

    // Setup Hapi server to register the plugin
    beforeEach(function (done) {
        server = new Hapi.Server();
        server.connection();
        done();
    });

    it('should import all models from the models folder specified in options, and from any nested directories, and confirm that the models exist',
        function (done) {

            var register = {
                register: require('..'),
                options: options
            };

            server.register([register], function (err) {

                var models = server.plugins['hapi-sequelized']
                    .db.sequelize.models;

                // check if the User model was imported
                expect(models.User).to.exist();
                expect(models.Product).to.exist();
                expect(models.Category).to.exist();
                done();
        });

    });


});
