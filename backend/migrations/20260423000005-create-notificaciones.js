'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('notificaciones', {
      id: {
        allowNull: false, autoIncrement: true, primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
      },
      usuario_id: {
        type: Sequelize.INTEGER.UNSIGNED, allowNull: false,
        references: { model: 'usuarios', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'CASCADE',
      },
      reporte_id: {
        type: Sequelize.INTEGER.UNSIGNED, allowNull: false,
        references: { model: 'reportes', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'CASCADE',
      },
      mensaje: { type: Sequelize.STRING(255), allowNull: false },
      tipo: {
        type: Sequelize.ENUM('proximidad', 'avistamiento'),
        defaultValue: 'proximidad',
      },
      leida: { type: Sequelize.BOOLEAN, defaultValue: false },
      created_at: {
        allowNull: false, type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        allowNull: false, type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });
    await queryInterface.addIndex('notificaciones', ['usuario_id', 'leida'], { name: 'idx_notificaciones_usuario_leida' });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('notificaciones');
  },
};
