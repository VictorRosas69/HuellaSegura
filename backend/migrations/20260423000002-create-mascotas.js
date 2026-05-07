'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('mascotas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
      },
      usuario_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'usuarios', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      nombre: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      especie: {
        type: Sequelize.ENUM('perro', 'gato', 'ave', 'reptil', 'otro'),
        allowNull: false,
      },
      raza: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      edad: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
      },
      edad_unidad: {
        type: Sequelize.ENUM('meses', 'años'),
        defaultValue: 'años',
      },
      sexo: {
        type: Sequelize.ENUM('macho', 'hembra'),
        allowNull: false,
      },
      color: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      microchip: {
        type: Sequelize.STRING(100),
        allowNull: true,
        unique: true,
      },
      foto_urls: {
        type: Sequelize.JSON,
        defaultValue: [],
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

    await queryInterface.addIndex('mascotas', ['usuario_id'], { name: 'idx_mascotas_usuario_id' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('mascotas');
  },
};
