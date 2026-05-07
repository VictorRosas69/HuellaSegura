const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/connection');

const Usuario = sequelize.define(
  'Usuario',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'El nombre no puede estar vacío.' },
        len: { args: [2, 100], msg: 'El nombre debe tener entre 2 y 100 caracteres.' },
      },
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: { msg: 'Este correo ya está registrado.' },
      validate: {
        isEmail: { msg: 'El correo electrónico no es válido.' },
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    rol: {
      type: DataTypes.ENUM('usuario', 'admin'),
      defaultValue: 'usuario',
    },
    radio_alerta: {
      type: DataTypes.INTEGER,
      defaultValue: 5,
      validate: {
        min: { args: [1], msg: 'El radio mínimo es 1 km.' },
        max: { args: [10], msg: 'El radio máximo es 10 km.' },
      },
    },
    token_version: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    ubicacion_lat: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
    },
    ubicacion_lng: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
    },
  },
  {
    tableName: 'usuarios',
    underscored: true,
    hooks: {
      beforeCreate: async (usuario) => {
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(usuario.password, salt);
      },
      beforeUpdate: async (usuario) => {
        if (usuario.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          usuario.password = await bcrypt.hash(usuario.password, salt);
        }
      },
    },
  }
);

Usuario.prototype.verificarPassword = function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

Usuario.prototype.toPublicJSON = function () {
  return {
    id: this.id,
    nombre: this.nombre,
    email: this.email,
    rol: this.rol,
    radio_alerta: this.radio_alerta,
    activo: this.activo,
    created_at: this.created_at,
  };
};

module.exports = Usuario;
