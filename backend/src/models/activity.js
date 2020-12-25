'use strict';
const { Model } = require('sequelize');
const CONSTANTS = require('../CONSTANTS');
module.exports = (sequelize, DataTypes) => {
    class Activity extends Model {
        static associate(models) {
            this.belongsTo(models.User, { foreignKey: 'userId' });
            this.belongsTo(models.Board, { foreignKey: 'boardId' });
            this.belongsTo(models.List, { as: 'List', foreignKey: 'listId' });
            this.belongsTo(models.List, { as: 'List_sourceList', foreignKey: 'sourceList' });
            this.belongsTo(models.Card, { foreignKey: 'cardId' });
        }
    }
    Activity.init(
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            type: {
                type: DataTypes.ENUM(Object.keys(CONSTANTS.activityTypes)),
                allowNull: false,
            },
            userId: {
                allowNull: false,
                type: DataTypes.INTEGER,
            },
            boardId: {
                allowNull: false,
                type: DataTypes.INTEGER,
            },
            listId: {
                allowNull: true,
                type: DataTypes.INTEGER,
            },
            cardId: {
                allowNull: true,
                type: DataTypes.INTEGER,
            },
            sourceList: {
                allowNull: true,
                type: DataTypes.INTEGER,
            },
            name: {
                allowNull: true,
                type: DataTypes.STRING,
            },
            time: {
                type: DataTypes.DATE,
                noUpdate: {
                    readOnly: true,
                },
                allowNull: false,
                defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
            },
        },
        {
            sequelize,
            modelName: 'Activity',
            timestamps: false,
        }
    );
    return Activity;
};
