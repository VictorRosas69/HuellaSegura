const QRCode = require('qrcode');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

async function generarQR(mascotaId) {
  const url = `${FRONTEND_URL}/publico/mascotas/${mascotaId}`;
  const buffer = await QRCode.toBuffer(url, { type: 'png', width: 300, margin: 2 });
  const dataUrl = `data:image/png;base64,${buffer.toString('base64')}`;
  return { buffer, dataUrl, url };
}

module.exports = { generarQR };
