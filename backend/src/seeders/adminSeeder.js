'use strict';
const bcrypt = require('bcryptjs');

async function seedAdmin(sequelize) {
  try {
    const [rows] = await sequelize.query(
      "SELECT id FROM usuarios WHERE email = 'vr1004236748@gmail.com' LIMIT 1"
    );
    if (rows.length > 0) return; // Ya existe, no hacer nada

    const hash = await bcrypt.hash('1004236748*', 12);
    await sequelize.query(
      `INSERT INTO usuarios (nombre, email, password, rol, activo, radio_alerta, token_version, created_at, updated_at)
       VALUES (?, ?, ?, 'admin', 1, 5, 0, NOW(), NOW())`,
      { replacements: ['Victor Rosas', 'vr1004236748@gmail.com', hash] }
    );
    console.log('[Seeder] Admin creado correctamente.');
  } catch (err) {
    console.error('[Seeder] Error al crear admin:', err.message);
  }
}

module.exports = { seedAdmin };
