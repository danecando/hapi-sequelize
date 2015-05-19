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
        host: '127.0.0.1', // db host
        database: 'testing', // name of your db
        user: 'root', // db username
        pass: '', // db password
        dialect: 'mysql', // database type
        //port: 8889, // database port #
        //storage: 'test.sqlite', // db filename for sqlite dialect
        models: 'test/models/**/*', // path to models directory from project root
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

    it('should register the plugin', function (done) {

        var register = {
            register: require('..'),
            options: options
        };

        server.register([register], function (err) {

            // no errors
            expect(err).to.not.exist;

            //instance of Sequelize should be registered
            expect(server.plugins['hapi-sequelized'].db
                .sequelize).to.be.an.instanceOf(
                Sequelize);
            done();
        });

    });

    it('should apply all the options passed during register',
        function (done) {

            var register = {
                register: require('..'),
                options: options
            };

            server.register([register], function (err) {

                var opt = server.plugins['hapi-sequelized']
                    .db.sequelize.options;
                var config = server.plugins[
                        'hapi-sequelized']
                    .db.sequelize.config;

                // test all options in documentation
                expect(opt.dialect).to.equal(options.dialect);
                expect(opt.port).to.equal(options.port);
                expect(config.host).to.equal(options.host);
                expect(config.database).to.equal(options.database);
                expect(config.username).to.equal(options.user);
                expect(config.password).to.equal(options.pass);
                expect(opt.storage).to.equal(options.storage);
                done();
            });

        });

    it('should apply application-wide model options',
        function (done) {

            var register = {
                register: require('..'),
                options: options
            };

            server.register([register], function (err) {

                var models = server.plugins[
                        'hapi-sequelized']
                    .db.sequelize.models;

                // check if the { timestamps: false } was applied to
                // the User model
                expect(models.User.options.timestamps).to.be
                    .false();
                done();
            });

        });

    it('should import all models from the specified models directory',
        function (done) {

            var register = {
                register: require('..'),
                options: options
            };

            server.register([register], function (err) {

                var models = server.plugins[
                        'hapi-sequelized']
                    .db.sequelize.models;

                // check if the User model was imported
                expect(models.User).to.exist();
                done();
            });

        });

    it('should apply default host, dialect, port, and global defaults',
        function (done) {

            // unset host, dialect port, and defaults
            delete options.host;
            delete options.port;
            delete options.dialect;
            delete options.defaults;

            var register = {
                register: require('..'),
                options: options
            };

            server.register([register], function (err) {

                var opt = server.plugins['hapi-sequelized']
                    .db.sequelize.options;
                var config = server.plugins[
                        'hapi-sequelized']
                    .db.sequelize.config;
                var models = server.plugins[
                        'hapi-sequelized']
                    .db.sequelize.models;

                // check if the default options were applied
                expect(err).to.not.exist();
                expect(opt.dialect).to.equal('mysql');
                expect(opt.port).to.equal(3306);
                expect(config.host).to.equal('localhost');
                expect(models.User.options.timestamps).to.be
                    .true();
                done();
            });

        });

});
