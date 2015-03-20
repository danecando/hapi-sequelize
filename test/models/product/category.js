// return User model as a function to sequelize.import()

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Category', {
        name: DataTypes.STRING,
        rootCategory: DataTypes.BOOLEAN
    });
};
