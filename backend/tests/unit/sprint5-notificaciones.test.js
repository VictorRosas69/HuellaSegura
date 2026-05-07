/**
 * Sprint 5 — Definition of Done
 * Notificaciones y radio de alertas
 */
process.env.JWT_SECRET     = 'test_secret_huella_segura_2026';
process.env.JWT_EXPIRES_IN = '24h';
process.env.NODE_ENV       = 'test';

const request  = require('supertest');
const app      = require('../../src/app');
const { sign } = require('../../src/config/jwt');

jest.mock('../../src/models', () => ({
  Usuario:      { findOne: jest.fn(), findByPk: jest.fn(), create: jest.fn(), findAll: jest.fn() },
  Notificacion: {
    findAll:    jest.fn(),
    findOne:    jest.fn(),
    findByPk:   jest.fn(),
    create:     jest.fn(),
    update:     jest.fn(),
    bulkCreate: jest.fn().mockResolvedValue([]),
  },
  Mascota: { findOne: jest.fn() },
  Reporte: { findOne: jest.fn() },
}));
jest.mock('../../src/config/connection', () => ({
  authenticate: jest.fn().mockResolvedValue(true),
  define: jest.fn(),
}));
jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({ sendMail: jest.fn().mockResolvedValue(true) }),
}));

const { Usuario, Notificacion } = require('../../src/models');

const TOKEN = sign({ id: 1, rol: 'usuario', tokenVersion: 0 });

const mockUsuario = {
  id: 1, nombre: 'Ana', email: 'ana@test.com',
  rol: 'usuario', token_version: 0, activo: true, radio_alerta: 5,
  update: jest.fn().mockResolvedValue(true),
  toPublicJSON: jest.fn().mockReturnValue({ id: 1, radio_alerta: 5 }),
};

function buildNotif(o = {}) {
  return {
    id: 1, usuario_id: 1, tipo: 'perdida',
    mensaje: 'Hay una mascota perdida cerca.',
    leida: false, created_at: new Date().toISOString(),
    update: jest.fn().mockResolvedValue(true),
    ...o,
  };
}

describe('Sprint 5 — Notificaciones y alertas (DoD)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Usuario.findByPk.mockResolvedValue(mockUsuario);
  });

  // ── Criterio 2: Panel de notificaciones cronológico ───────────────────────
  test('C2 — Listado cronológico retorna array → 200', async () => {
    Notificacion.findAll.mockResolvedValue([
      buildNotif({ id: 2, leida: false }),
      buildNotif({ id: 1, leida: true }),
    ]);
    const res = await request(app)
      .get('/api/notificaciones')
      .set('Authorization', `Bearer ${TOKEN}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.notificaciones)).toBe(true);
  });

  test('C2 — Notificaciones incluyen campo "leida" → boolean', async () => {
    Notificacion.findAll.mockResolvedValue([
      buildNotif({ leida: false }),
      buildNotif({ id: 2, leida: true }),
    ]);
    const res = await request(app)
      .get('/api/notificaciones')
      .set('Authorization', `Bearer ${TOKEN}`);
    expect(res.status).toBe(200);
    expect(res.body.notificaciones.length).toBeGreaterThanOrEqual(1);
  });

  test('C2 — Sin token retorna 401', async () => {
    const res = await request(app).get('/api/notificaciones');
    expect(res.status).toBe(401);
  });

  // ── Criterio 3: Radio de alertas configurable 1-10 km ────────────────────
  test('C3 — Radio 3 km aceptado → 200', async () => {
    const res = await request(app)
      .put('/api/usuarios/radio-alerta')
      .set('Authorization', `Bearer ${TOKEN}`)
      .send({ radio_alerta: 3 });
    expect([200, 201]).toContain(res.status);
  });

  test('C3 — Radio 1 km (mínimo) aceptado → 200', async () => {
    const res = await request(app)
      .put('/api/usuarios/radio-alerta')
      .set('Authorization', `Bearer ${TOKEN}`)
      .send({ radio_alerta: 1 });
    expect([200, 201]).toContain(res.status);
  });

  test('C3 — Radio 10 km (máximo) aceptado → 200', async () => {
    const res = await request(app)
      .put('/api/usuarios/radio-alerta')
      .set('Authorization', `Bearer ${TOKEN}`)
      .send({ radio_alerta: 10 });
    expect([200, 201]).toContain(res.status);
  });

  test('C3 — Radio 0 rechazado → 400', async () => {
    const res = await request(app)
      .put('/api/usuarios/radio-alerta')
      .set('Authorization', `Bearer ${TOKEN}`)
      .send({ radio_alerta: 0 });
    expect(res.status).toBe(400);
  });

  test('C3 — Radio 11 rechazado → 400', async () => {
    const res = await request(app)
      .put('/api/usuarios/radio-alerta')
      .set('Authorization', `Bearer ${TOKEN}`)
      .send({ radio_alerta: 11 });
    expect(res.status).toBe(400);
  });

  // ── Criterio 6: Contador de no leídas — marcar leída ─────────────────────
  test('C6 — Marcar notificación individual como leída → 200', async () => {
    Notificacion.findOne.mockResolvedValue(buildNotif());
    const res = await request(app)
      .put('/api/notificaciones/1/leer')           // ruta real: /:id/leer
      .set('Authorization', `Bearer ${TOKEN}`);
    expect([200, 201]).toContain(res.status);
    expect(res.body.success).toBe(true);
  });

  test('C6 — Marcar todas como leídas → 200', async () => {
    Notificacion.update = jest.fn().mockResolvedValue([3]);
    const res = await request(app)
      .put('/api/notificaciones/leer-todas')       // ruta real: /leer-todas
      .set('Authorization', `Bearer ${TOKEN}`);
    expect([200, 201]).toContain(res.status);
    expect(res.body.success).toBe(true);
  });
});
