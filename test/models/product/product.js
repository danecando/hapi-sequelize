// return User model as a function to sequelize.import()

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Product', {
        name: DataTypes.STRING,
        inventory: DataTypes.INTEGER
    });
};
