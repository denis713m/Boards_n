'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Card extends Model {
        static associate(models) {
            this.belongsTo(models.User, { foreignKey: 'userId' });
            this.belongsTo(models.Board, { foreignKey: 'boardId' });
            this.belongsTo(models.List, { foreignKey: 'listId' });
            this.hasMany(models.Activity, { foreignKey: 'cardId' });
        }
    }
    Card.init(
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            name: {
                allowNull: false,
                type: DataTypes.STRING,
            },
            description: {
                allowNull: true,
                type: DataTypes.STRING,
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
                allowNull: false,
                type: DataTypes.INTEGER,
            },
            index: {
                allowNull: true,
                defaultValue: 0,
                type: DataTypes.INTEGER,
            },
        },
        {
            hooks: {
                beforeCreate: async (card, options) => {
                    card.index = await sequelize.models.Card.count({ where: { listId: card.listId } });
                }
            },
            sequelize,
            modelName: 'Card',
            timestamps: false,
        }
    );
    return Card;
};
