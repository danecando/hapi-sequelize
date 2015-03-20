var Hapi = require('hapi');

var server = new Hapi.Server();
server.connection({ port: 3000 });

server.register(
    [
        {
            register: require('hapi-sequelized'),
            options: {
                models: 'models',
                database: 'dbname',
                user: 'root',
                pass: 'root',
                port: 8889
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
        var db = request.server.plugins['hapi-sequelized'].db;

        db.Account.create({
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