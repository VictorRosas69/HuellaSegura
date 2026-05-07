'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Eliminar la foreign key existente antes de cambiar la columna
    await queryInterface.removeConstraint('notificaciones', 'notificaciones_ibfk_3').catch(() => {});

    await queryInterface.changeColumn('notificaciones', 'reporte_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
    });

    // Re-agregar la foreign key con ON DELETE SET NULL
    await queryInterface.addConstraint('notificaciones', {
      fields: ['reporte_id'],
      type: 'foreign key',
      name: 'notificaciones_reporte_id_fk',
      references: { table: 'reportes', field: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('notificaciones', 'notificaciones_reporte_id_fk').catch(() => {});

    await queryInterface.changeColumn('notificaciones', 'reporte_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
    });

    await queryInterface.addConstraint('notificaciones', {
      fields: ['reporte_id'],
      type: 'foreign key',
      name: 'notificaciones_ibfk_3',
      references: { table: 'reportes', field: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },
};
