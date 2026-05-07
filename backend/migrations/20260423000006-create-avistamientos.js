'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('avistamientos', {
      id: {
        allowNull: false, autoIncrement: true, primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
      },
      mascota_id: {
        type: Sequelize.INTEGER.UNSIGNED, allowNull: false,
        references: { model: 'mascotas', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'CASCADE',
      },
      reporte_id: {
        type: Sequelize.INTEGER.UNSIGNED, allowNull: true,
        references: { model: 'reportes', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'SET NULL',
      },
      latitud:         { type: Sequelize.DECIMAL(10, 8), allowNull: false },
      longitud:        { type: Sequelize.DECIMAL(11, 8), allowNull: false },
      descripcion:     { type: Sequelize.TEXT, allowNull: true },
      foto_url:        { type: Sequelize.STRING(500), allowNull: true },
      nombre_testigo:  { type: Sequelize.STRING(100), allowNull: true },
      email_testigo:   { type: Sequelize.STRING(150), allowNull: true },
      created_at: {
        allowNull: false, type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        allowNull: false, type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });
    await queryInterface.addIndex('avistamientos', ['mascota_id'], { name: 'idx_avistamientos_mascota_id' });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('avistamientos');
  },
};
