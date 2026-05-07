'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('reportes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
      },
      mascota_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'mascotas', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      usuario_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'usuarios', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      latitud: {
        type: Sequelize.DECIMAL(10, 8),
        allowNull: false,
      },
      longitud: {
        type: Sequelize.DECIMAL(11, 8),
        allowNull: false,
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      estado: {
        type: Sequelize.ENUM('en_busqueda', 'encontrada', 'cerrado'),
        defaultValue: 'en_busqueda',
      },
      fecha_perdida: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex('reportes', ['estado'], { name: 'idx_reportes_estado' });
    await queryInterface.addIndex('reportes', ['usuario_id'], { name: 'idx_reportes_usuario_id' });
    await queryInterface.addIndex('reportes', ['mascota_id'], { name: 'idx_reportes_mascota_id' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('reportes');
  },
};
