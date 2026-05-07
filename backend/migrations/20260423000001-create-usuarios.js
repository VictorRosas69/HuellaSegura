'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('usuarios', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
      },
      nombre: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      rol: {
        type: Sequelize.ENUM('usuario', 'admin'),
        defaultValue: 'usuario',
      },
      radio_alerta: {
        type: Sequelize.INTEGER,
        defaultValue: 5,
      },
      token_version: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      activo: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
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

    await queryInterface.addIndex('usuarios', ['email'], { unique: true, name: 'idx_usuarios_email' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('usuarios');
  },
};
