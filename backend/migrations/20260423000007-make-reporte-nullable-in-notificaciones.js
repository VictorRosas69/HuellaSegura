'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('notificaciones', 'reporte_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
      references: { model: 'reportes', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('notificaciones', 'reporte_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: 'reportes', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },
};
