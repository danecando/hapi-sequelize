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

describe('hapi-sequelize', function() {
    // Hapi server for each test
    var server;

    // Options to test
    var options = {};

    // Setup Hapi server to register the plugin
    beforeEach(function(done) {
        server = new Hapi.Server();
        server.connection();
        done();

        options = {
            host: '127.0.0.1',
            database: 'testing',
            user: 'root',
            pass: '',
            port: 3306,
            dialect: 'mysql',
            models: ['test/models/**/*.js', 'test/other-models/**/*.js'],
            sequelize: {
                define: {
                    timestamps: false
                }
            }
        };

    });

    it('should register the plugin',
        function(done) {
            var register = {
                register: require('../lib'),
                options: options
            };

            server.register([register], function(err) {
                // no errors
                expect(err).to.not.exist;

                // instance of Sequelize should be registered
                expect(server.plugins['hapi-sequelize'].db.sequelize).to.be.an.instanceOf(Sequelize);

                done();
            });
        });

    it('should apply all the options passed during register',
        function(done) {
            var register = {
                register: require('../lib'),
                options: options
            };

            server.register([register], function() {
                var opt = server.plugins['hapi-sequelize'].db.sequelize.options;
                var config = server.plugins['hapi-sequelize'].db.sequelize.config;

                // test all options in documentation
                expect(opt.dialect).to.equal(options.dialect);
                expect(opt.port).to.equal(options.port);
                expect(opt.host).to.equal(options.host);
                expect(config.database).to.equal(options.database);
                expect(config.username).to.equal(options.user);

                done();
            });
        });

    it('should apply application-wide model options',
        function(done) {

            var register = {
                register: require('../lib'),
                options: options
            };

            server.register([register], function() {
                var models = server.plugins['hapi-sequelize'].db.sequelize.models;

                // check if the { timestamps: false } was applied to the User model
                expect(models.User.options.timestamps).to.be.false();

                done();
            });
        });

    it('should import all models from the specified models directory',
        function(done) {
            var register = {
                register: require('../lib'),
                options: options
            };

            server.register([register], function() {
                var models = server.plugins['hapi-sequelize'].db.sequelize.models;

                // check if the User model was imported
                expect(models.User).to.exist();

                done();
            });
        });

    it('should apply default host, dialect, port',
        function(done) {
            // unset host, dialect, and port
            delete options.host;
            delete options.port;
            delete options.dialect;

            var register = {
                register: require('../lib'),
                options: options
            };

            server.register([register], function(err) {
                var opt = server.plugins['hapi-sequelize'].db.sequelize.options;
                var config = server.plugins['hapi-sequelize'].db.sequelize.config;

                // check if the default options were applied
                expect(err).to.not.exist();
                expect(opt.dialect).to.equal('mysql');
                expect(opt.port).to.equal(3306);
                expect(opt.host).to.equal('localhost');

                done();
            });
        });

    it('should import all models from the models array specified in options, from all directories, and their respective nested directories, and confirm that the models exist',
        function(done) {
            var register = {
                register: require('../lib'),
                options: options
            };

            server.register([register], function() {
                var models = server.plugins['hapi-sequelize'].db.sequelize.models;

                // check if all models were imported
                expect(models.User).to.exist();
                expect(models.Product).to.exist();
                expect(models.Category).to.exist();
                expect(models.BlogRoll).to.exist();
                expect(models.Blog).to.exist();
                expect(models.Post).to.exist();

                done();
            });
        });

    it('should connect to a database using the URI format',
       function(done) {
            options.uri = options.dialect + '://' + options.user + ':' + options.pass + '@' + options.host + ':' + options.port + '/' + options.database
            delete options.host;
            delete options.port;
            delete options.dialect;
            delete options.user;
            delete options.pass;
            delete options.database;

            var register = {
               register: require('../lib'),
               options: options
            };

           server.register([register], function() {
                var models = server.plugins['hapi-sequelize'].db.sequelize.models;

                // check if all models were imported
                expect(models.User).to.exist();
                expect(models.Product).to.exist();
                expect(models.Category).to.exist();
                expect(models.BlogRoll).to.exist();
                expect(models.Blog).to.exist();
                expect(models.Post).to.exist();

                done();
           });
       });
});
