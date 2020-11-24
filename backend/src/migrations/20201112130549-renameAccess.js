'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Users', 'accesToken', 'accessToken');
  },

  down: async (queryInterface, Sequelize) => {
  }
};
