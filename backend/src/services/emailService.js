const nodemailer = require('nodemailer');

function crearTransporte() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT, 10) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

async function enviarCorreoReporteCreado({ propietario, mascota, reporte }) {
  const transporte = crearTransporte();
  const fotosHtml = mascota.foto_principal
    ? `<img src="${mascota.foto_principal}" alt="${mascota.nombre}" style="max-width:200px;border-radius:8px;" />`
    : '';

  const info = await transporte.sendMail({
    from: `"HuellaSegura" <${process.env.EMAIL_USER}>`,
    to: propietario.email,
    subject: `🐾 Alerta creada — ${mascota.nombre} está en búsqueda`,
    html: `
      <div style="font-family:sans-serif;max-width:500px;margin:auto;">
        <h2 style="color:#2563eb;">HuellaSegura</h2>
        <p>Hola <strong>${propietario.nombre}</strong>,</p>
        <p>Tu reporte de pérdida ha sido publicado exitosamente.</p>
        ${fotosHtml}
        <table style="width:100%;border-collapse:collapse;margin-top:16px;">
          <tr><td style="padding:6px;font-weight:bold;">Mascota</td><td>${mascota.nombre}</td></tr>
          <tr><td style="padding:6px;font-weight:bold;">Especie</td><td>${mascota.especie}</td></tr>
          <tr><td style="padding:6px;font-weight:bold;">Fecha</td><td>${reporte.fecha_perdida}</td></tr>
        </table>
        <p style="margin-top:16px;color:#555;">
          La comunidad de HuellaSegura en Pasto ya puede ver tu alerta en el mapa.
        </p>
        <p style="color:#888;font-size:12px;">Este es un correo automático, no respondas a este mensaje.</p>
      </div>`,
  });

  return info;
}

module.exports = { enviarCorreoReporteCreado };
