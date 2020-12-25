'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class boards extends Model {
        static associate(models) {
            this.belongsTo(models.User, { foreignKey: 'id' });
            this.hasMany(models.List, { foreignKey: 'boardId' });
            this.hasMany(models.Card, { foreignKey: 'boardId' });
            this.hasMany(models.Activity, { foreignKey: 'boardId' });
        }
    }
    boards.init(
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            name: {
                allowNull: false,
                unique: true,
                type: DataTypes.STRING,
            },
            user: {
                allowNull: false,
                type: DataTypes.INTEGER,
            },
        },
        {
            sequelize,
            timestamps: false,
            modelName: 'Board',
        }
    );
    return boards;
};
