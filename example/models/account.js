'use strict';

module.exports = function(sequelize, DataTypes) {
    var Account = sequelize.define(
        'Account',
        {
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isEmail: true
                }
            },
            firstName: {
                type: DataTypes.STRING,
                field: 'first_name',
                allowNull: false,
                validate: {
                    isAlpha: true
                }
            },
            lastName: {
                type: DataTypes.STRING,
                field: 'last_name',
                allowNull: false,
                validate: {
                    isAlpha: true
                }
            }
        }
    );

    return Account;
}
