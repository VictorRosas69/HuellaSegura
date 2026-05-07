const { body, validationResult } = require('express-validator');
const { uploadBuffer } = require('../config/cloudinary');

async function actualizarRadioAlerta(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    const { radio_alerta } = req.body;
    await req.usuario.update({ radio_alerta });
    return res.status(200).json({
      success: true,
      message: `Radio de alerta actualizado a ${radio_alerta} km.`,
      radio_alerta,
    });
  } catch (error) { next(error); }
}

async function actualizarUbicacion(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    const { latitud, longitud } = req.body;
    await req.usuario.update({ ubicacion_lat: latitud, ubicacion_lng: longitud });
    return res.status(200).json({ success: true, message: 'Ubicación actualizada.' });
  } catch (error) { next(error); }
}

async function actualizarFoto(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No se recibió ninguna imagen.' });
    }

    const resultado = await uploadBuffer(req.file.buffer, {
      folder: 'huella-segura/perfiles',
      public_id: `perfil_${req.usuario.id}`,
      overwrite: true,
      transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }],
    });

    await req.usuario.update({ foto_url: resultado.secure_url });

    return res.status(200).json({
      success: true,
      message: 'Foto de perfil actualizada.',
      foto_url: resultado.secure_url,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { actualizarRadioAlerta, actualizarUbicacion, actualizarFoto };
