// return User model as a function to sequelize.import()

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Blog', {
        name: DataTypes.STRING,
        url: DataTypes.STRING,
        owner: DataTypes.STRING
    });
};
