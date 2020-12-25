'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            this.hasMany(models.Board, { foreignKey: 'user' });
            this.hasMany(models.List, {as:'boardAuthorId', foreignKey: 'boardAuthor' });
            this.hasMany(models.List, { foreignKey: 'userId' });
            this.hasMany(models.Card, { foreignKey: 'userId' });
            this.hasMany(models.Activity, { foreignKey: 'userId' });
        }
    }
    User.init(
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            email: {
                allowNull: false,
                unique: true,
                type: DataTypes.STRING,
            },
            firstName: {
                allowNull: false,
                type: DataTypes.STRING,
            },
            lastName: {
                allowNull: false,
                type: DataTypes.STRING,
            },
            displayName: {
                allowNull: false,
                type: DataTypes.STRING,
            },
            password: {
                allowNull: false,
                type: DataTypes.TEXT,
            },
            accessToken: {
                allowNull: true,
                type: DataTypes.TEXT,
            },
        },
        {
            sequelize,
            timestamps: false,
            modelName: 'User',
        }
    );
    return User;
};
