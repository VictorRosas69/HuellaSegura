'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('entidades_aliadas', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER.UNSIGNED },
      nombre:    { type: Sequelize.STRING(150), allowNull: false },
      tipo:      { type: Sequelize.ENUM('veterinaria', 'albergue', 'otro'), allowNull: false },
      direccion: { type: Sequelize.STRING(255), allowNull: true },
      telefono:  { type: Sequelize.STRING(20),  allowNull: true },
      latitud:   { type: Sequelize.DECIMAL(10, 8), allowNull: true },
      longitud:  { type: Sequelize.DECIMAL(11, 8), allowNull: true },
      descripcion: { type: Sequelize.TEXT, allowNull: true },
      activo:    { type: Sequelize.BOOLEAN, defaultValue: true },
      created_at: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('entidades_aliadas');
  },
};
