// return User model as a function to sequelize.import()

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Post', {
        title: DataTypes.STRING,
        content: DataTypes.TEXT
    });
};
