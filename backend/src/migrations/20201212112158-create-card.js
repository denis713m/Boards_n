'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable(
            'Cards',
            {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER,
                },
                name: {
                    type: Sequelize.STRING,
                    allowNull: false,
                    unique: true,
                    unique: 'unique_tag',
                },
                description: {
                    allowNull: true,
                    type: Sequelize.STRING,
                },
                userId: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: { model: 'Users', key: 'id' },
                    onDelete: 'SET NULL',
                },
                listId: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: { model: 'Lists', key: 'id' },
                    onDelete: 'CASCADE',
                },
                index: {
                    allowNull: false,
                    type: Sequelize.INTEGER,
                },
                boardId: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: { model: 'Boards', key: 'id' },
                    unique: 'unique_tag',
                    onDelete: 'CASCADE',
                },
            },
            {
                uniqueKeys: {
                    unique_tag: {
                        customIndex: true,
                        fields: ['boardId', 'name'],
                    },
                },
            }
        );
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Cards');
    },
};
