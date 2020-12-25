'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Lists', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        unique: 'unique_tag'
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' }
      },
      boardId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Boards', key: 'id' },
        unique: 'unique_tag',
        onDelete: 'CASCADE'
      },
      boardAuthor: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' }
      },
    },
    {
      uniqueKeys: {
        unique_tag: {
          customIndex: true,
          fields: ['name', 'boardId']
        }
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Lists');
  }
};