var fs          = require('fs'),
    path        = require('path'),
    Sequelize   = require('sequelize'),
    db          = {};

exports.register = function(plugin, options, next) {

    // Create db connection
    var sequelize = new Sequelize(options.database, options.user, options.pass, {
        dialect: options.dialect || 'mysql',
        port: options.port || 3306
    });

    // Add all models in directory to db object
    fs
    .readdirSync(path.resolve(__dirname, '../../models'))
    .filter(function(file) {
        return (file.indexOf('.') !== 0) && (file !== 'index.js'));
    })
    .forEach(function(file) {
        var model = sequelize.import(path.join(path.resolve(__dirname, '../../models'), file));
        db[model.name] = model;
    });

    // Create associations
    Object.keys(db).forEach(function (modelName) {
        if ('associate' in db[modelName]) {
            db[modelName].associate(db)
        }
    });

    db.sequelize = sequelize;
    db.Sequelize = Sequelize;

    plugin.expose('models', db);

    next();
};

exports.register.attributes = {
    pkg: require('./package.json')
};