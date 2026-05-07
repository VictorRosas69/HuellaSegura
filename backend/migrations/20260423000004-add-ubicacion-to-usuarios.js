'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('usuarios', 'ubicacion_lat', {
      type: Sequelize.DECIMAL(10, 8),
      allowNull: true,
    });
    await queryInterface.addColumn('usuarios', 'ubicacion_lng', {
      type: Sequelize.DECIMAL(11, 8),
      allowNull: true,
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('usuarios', 'ubicacion_lat');
    await queryInterface.removeColumn('usuarios', 'ubicacion_lng');
  },
};
