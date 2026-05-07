const { validationResult } = require('express-validator');
const { Usuario } = require('../models');
const { sign } = require('../config/jwt');

async function register(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { nombre, email, password } = req.body;

    const existe = await Usuario.findOne({ where: { email } });
    if (existe) {
      return res.status(409).json({
        success: false,
        message: 'Ya existe una cuenta con ese correo electrónico.',
      });
    }

    const usuario = await Usuario.create({ nombre, email, password });

    const token = sign({
      id: usuario.id,
      rol: usuario.rol,
      tokenVersion: usuario.token_version,
    });

    return res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente.',
      token,
      usuario: usuario.toPublicJSON(),
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'No existe una cuenta con ese correo electrónico.',
      });
    }

    if (!usuario.activo) {
      return res.status(403).json({
        success: false,
        message: 'Tu cuenta ha sido desactivada. Contacta al administrador.',
      });
    }

    const passwordValida = await usuario.verificarPassword(password);
    if (!passwordValida) {
      return res.status(401).json({
        success: false,
        message: 'Contraseña incorrecta.',
      });
    }

    const token = sign({
      id: usuario.id,
      rol: usuario.rol,
      tokenVersion: usuario.token_version,
    });

    return res.status(200).json({
      success: true,
      message: 'Inicio de sesión exitoso.',
      token,
      usuario: usuario.toPublicJSON(),
    });
  } catch (error) {
    next(error);
  }
}

async function logout(req, res, next) {
  try {
    // Incrementar tokenVersion invalida todos los tokens anteriores del usuario
    await req.usuario.increment('token_version');

    return res.status(200).json({
      success: true,
      message: 'Sesión cerrada exitosamente.',
    });
  } catch (error) {
    next(error);
  }
}

async function me(req, res) {
  return res.status(200).json({
    success: true,
    usuario: req.usuario.toPublicJSON(),
  });
}

module.exports = { register, login, logout, me };
