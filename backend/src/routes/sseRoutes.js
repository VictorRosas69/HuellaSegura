'use strict';
const { Router } = require('express');
const { authenticate } = require('../middlewares/authMiddleware');

const router = Router();

// Mapa de clientes conectados: usuarioId -> res
const clientes = new Map();

// Función exportada para enviar eventos desde otros controladores
function notificarUsuario(usuarioId, evento, datos) {
  const res = clientes.get(String(usuarioId));
  if (res) {
    res.write(`event: ${evento}\n`);
    res.write(`data: ${JSON.stringify(datos)}\n\n`);
  }
}

// GET /api/sse/eventos — conexión SSE del cliente
router.get('/eventos', authenticate, (req, res) => {
  const usuarioId = String(req.usuario.id);

  res.setHeader('Content-Type',  'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection',    'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  // Heartbeat cada 25 s para mantener la conexión viva
  const heartbeat = setInterval(() => {
    res.write(': ping\n\n');
  }, 25000);

  // Mensaje de bienvenida
  res.write(`event: conectado\n`);
  res.write(`data: ${JSON.stringify({ mensaje: 'Conectado a HuellaSegura en tiempo real' })}\n\n`);

  clientes.set(usuarioId, res);

  req.on('close', () => {
    clearInterval(heartbeat);
    clientes.delete(usuarioId);
  });
});

module.exports = { router, notificarUsuario };
