'use strict';
const CONSTANTS = require('../CONSTANTS');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Activities', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      type: {
        type: Sequelize.ENUM(Object.keys(CONSTANTS.activityTypes)),
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },        
      },
      boardId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Boards', key: 'id' },
        onDelete: 'CASCADE',
      },
      listId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'Lists', key: 'id' },
        onDelete: 'CASCADE',
      },
      cardId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'Cards', key: 'id' },
        onDelete: 'CASCADE',
      },
      sourceList: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'Lists', key: 'id' },
        onDelete: 'CASCADE',
      },
      name:{
        type: Sequelize.STRING,
        allowNull: true,
      },
      time: {
        type: Sequelize.DATE,
        noUpdate: {
          readOnly: true
        },
        default: Sequelize.literal('CURRENT_TIMESTAMP')
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Activities');
  }
};