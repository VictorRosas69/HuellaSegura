'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('reportes', 'moderado', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      after: 'fecha_perdida',
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('reportes', 'moderado');
  },
};
