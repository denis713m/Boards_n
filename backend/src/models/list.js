'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class List extends Model {
        static associate(models) {
            this.belongsTo(models.User, { foreignKey: 'userId' });
            this.belongsTo(models.User, {as:'boardAuthorId', foreignKey: 'boardAuthor' });
            this.belongsTo(models.Board, { foreignKey: 'boardId' });
            this.hasMany(models.Card, { foreignKey: 'listId' });
            this.hasMany(models.Activity, { as: 'List', foreignKey: 'listId' });
            this.hasMany(models.Activity, { as:'List_sourceList', foreignKey: 'sourceList' });
        }
    }
    List.init(
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
            userId: {
                allowNull: false,
                type: DataTypes.INTEGER,
            },
            boardId: {
                allowNull: false,
                type: DataTypes.INTEGER,
            },
            boardAuthor:{
                allowNull: false,
                type: DataTypes.INTEGER,
            }
        },
        {
            sequelize,
            modelName: 'List',
            timestamps: false,
        }
    );
    return List;
};
