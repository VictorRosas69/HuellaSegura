'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('usuarios', 'reset_code', {
      type: Sequelize.STRING(6),
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.addColumn('usuarios', 'reset_code_expires', {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.addColumn('usuarios', 'foto_url', {
      type: Sequelize.STRING(500),
      allowNull: true,
      defaultValue: null,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('usuarios', 'reset_code');
    await queryInterface.removeColumn('usuarios', 'reset_code_expires');
    await queryInterface.removeColumn('usuarios', 'foto_url');
  },
};
