var Hapi = require('hapi');

var server = new Hapi.Server();
server.connection({ port: 3000 });

server.register(
    [
        {
            register: require('hapi-sequelized'),
            options: {
                database: 'dbName',
                user: 'root',
                pass: 'root',
                dialect: 'mysql',
                port: 8889,
                models: 'models/**/*.js',
                sequelize: {
                    define: {
                        underscoredAll: true
                    }
                }
            }
        }
    ], function(err) {
        if (err) {
            console.log('failed to load plugin');
        }
    }
);

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        var models = request.server.plugins['hapi-sequelized'].db.sequelize.models;

        models.Account.create({
            email: 'some@email.com',
            firstName: 'John',
            lastName: 'Smith'
        });

        reply();
    }
});

server.plugins['hapi-sequelized'].db.sequelize.sync().then(function () {
    server.start(function () {
        console.log('Server running at:', server.info.uri);
    });
});