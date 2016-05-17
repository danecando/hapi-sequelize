// return User model as a function to sequelize.import()

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('BlogRoll', {
        blogUrl: DataTypes.STRING,
        previousBlogUrl: DataTypes.STRING,
		nextBlogUrl: DataTypes.STRING
    });
};
