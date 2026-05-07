/**
 * Sprint 2 — Definition of Done
 * Criterios verificados por este archivo de pruebas
 */
process.env.JWT_SECRET     = 'test_secret_huella_segura_2026';
process.env.JWT_EXPIRES_IN = '24h';
process.env.NODE_ENV       = 'test';

const request = require('supertest');
const app     = require('../../src/app');
const { sign } = require('../../src/config/jwt');

jest.mock('../../src/models', () => ({
  Usuario: { findOne: jest.fn(), findByPk: jest.fn(), create: jest.fn() },
  Mascota: { findOne: jest.fn(), findAll: jest.fn(), create: jest.fn() },
}));
jest.mock('../../src/config/connection', () => ({
  authenticate: jest.fn().mockResolvedValue(true),
  define: jest.fn(),
}));
jest.mock('../../src/config/cloudinary', () => ({
  uploadBuffer: jest.fn().mockResolvedValue({ secure_url: 'https://res.cloudinary.com/test/foto.jpg' }),
  deleteImage:  jest.fn().mockResolvedValue({}),
}));

const { Usuario, Mascota } = require('../../src/models');

const TOKEN = sign({ id: 1, rol: 'usuario', tokenVersion: 0 });

const mockUsuario = {
  id: 1, nombre: 'Test', email: 'test@test.com',
  rol: 'usuario', token_version: 0, activo: true,
  toPublicJSON: jest.fn().mockReturnValue({ id: 1 }),
};

function buildMascota(o = {}) {
  return {
    id: 1, usuario_id: 1, nombre: 'Max', especie: 'perro',
    sexo: 'macho', color: 'dorado', foto_urls: [],
    update: jest.fn().mockImplementation(function (d) { Object.assign(this, d); return Promise.resolve(this); }),
    save:   jest.fn().mockResolvedValue(true),
    destroy:jest.fn().mockResolvedValue(true),
    toPublicJSON: jest.fn().mockReturnValue({ id: 1, nombre: 'Max', especie: 'perro' }),
    ...o,
  };
}

describe('Sprint 2 — Gestión de mascotas (DoD)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Usuario.findByPk.mockResolvedValue(mockUsuario);
  });

  // ── Criterio 1: Registrar mascota con datos básicos ────────────────────────
  test('C1 — Registra mascota con datos básicos obligatorios → 201', async () => {
    Mascota.create.mockResolvedValue(buildMascota());
    const res = await request(app)
      .post('/api/mascotas')
      .set('Authorization', `Bearer ${TOKEN}`)
      .send({ nombre: 'Max', especie: 'perro', sexo: 'macho', color: 'dorado' });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.mascota).toBeDefined();
  });

  test('C1 — Rechaza registro sin nombre → 400', async () => {
    const res = await request(app)
      .post('/api/mascotas')
      .set('Authorization', `Bearer ${TOKEN}`)
      .send({ especie: 'perro', sexo: 'macho', color: 'dorado' });
    expect(res.status).toBe(400);
  });

  test('C1 — Rechaza registro sin especie → 400', async () => {
    const res = await request(app)
      .post('/api/mascotas')
      .set('Authorization', `Bearer ${TOKEN}`)
      .send({ nombre: 'Max', sexo: 'macho', color: 'dorado' });
    expect(res.status).toBe(400);
  });

  // ── Criterio 2: Fotos JPG y PNG (validación de tipo) ──────────────────────
  test('C2 — fileFilter acepta image/jpeg', () => {
    const { fileFilter } = require('../../src/middlewares/uploadMiddleware');
    const cb = jest.fn();
    fileFilter({}, { mimetype: 'image/jpeg' }, cb);
    expect(cb).toHaveBeenCalledWith(null, true);
  });

  test('C2 — fileFilter acepta image/png', () => {
    const { fileFilter } = require('../../src/middlewares/uploadMiddleware');
    const cb = jest.fn();
    fileFilter({}, { mimetype: 'image/png' }, cb);
    expect(cb).toHaveBeenCalledWith(null, true);
  });

  test('C2 — fileFilter rechaza image/gif', () => {
    const { fileFilter } = require('../../src/middlewares/uploadMiddleware');
    const cb = jest.fn();
    fileFilter({}, { mimetype: 'image/gif' }, cb);
    expect(cb).toHaveBeenCalledWith(expect.any(Error), false);
  });

  test('C2 — Máximo 5 fotos — rechaza la sexta foto', async () => {
    Mascota.findOne.mockResolvedValue(buildMascota({ usuario_id: 1, foto_urls: ['u1','u2','u3','u4','u5'] }));
    const res = await request(app)
      .post('/api/mascotas/1/fotos')
      .set('Authorization', `Bearer ${TOKEN}`)
      .attach('fotos', Buffer.from('img'), { filename: 'test.jpg', contentType: 'image/jpeg' });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/5 fotos/i);
  });

  test('C2 — Sube foto correctamente cuando hay espacio', async () => {
    Mascota.findOne.mockResolvedValue(buildMascota({ usuario_id: 1, foto_urls: [] }));
    const res = await request(app)
      .post('/api/mascotas/1/fotos')
      .set('Authorization', `Bearer ${TOKEN}`)
      .attach('fotos', Buffer.from('img'), { filename: 'perro.jpg', contentType: 'image/jpeg' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  // ── Criterio 4: Editar perfil ──────────────────────────────────────────────
  test('C4 — Edita cualquier campo del perfil → 200', async () => {
    Mascota.findOne.mockResolvedValue(buildMascota({ usuario_id: 1 }));
    const res = await request(app)
      .put('/api/mascotas/1')
      .set('Authorization', `Bearer ${TOKEN}`)
      .send({ nombre: 'MaxiMo', especie: 'perro', sexo: 'macho', color: 'café' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('C4 — No puede editar mascota de otro usuario → 403', async () => {
    Mascota.findOne.mockResolvedValue(buildMascota({ usuario_id: 2 }));
    const res = await request(app)
      .put('/api/mascotas/1')
      .set('Authorization', `Bearer ${TOKEN}`)
      .send({ nombre: 'X', especie: 'perro', sexo: 'macho', color: 'negro' });
    expect(res.status).toBe(403);
  });

  // ── Criterio 5: Listado con foto, nombre y especie ────────────────────────
  test('C5 — Listado retorna array de mascotas del usuario', async () => {
    Mascota.findAll.mockResolvedValue([buildMascota(), buildMascota({ id: 2, nombre: 'Luna' })]);
    const res = await request(app)
      .get('/api/mascotas')
      .set('Authorization', `Bearer ${TOKEN}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.mascotas)).toBe(true);
    expect(res.body.mascotas.length).toBeGreaterThanOrEqual(1);
  });

  test('C5 — Listado vacío si el usuario no tiene mascotas', async () => {
    Mascota.findAll.mockResolvedValue([]);
    const res = await request(app)
      .get('/api/mascotas')
      .set('Authorization', `Bearer ${TOKEN}`);
    expect(res.status).toBe(200);
    expect(res.body.mascotas).toHaveLength(0);
  });

  // ── Criterio 6: Validación de campos obligatorios ─────────────────────────
  test('C6 — Formulario requiere autenticación → 401 sin token', async () => {
    const res = await request(app)
      .post('/api/mascotas')
      .send({ nombre: 'Max', especie: 'perro', sexo: 'macho', color: 'negro' });
    expect(res.status).toBe(401);
  });

  test('C6 — Rechaza body vacío → 400', async () => {
    const res = await request(app)
      .post('/api/mascotas')
      .set('Authorization', `Bearer ${TOKEN}`)
      .send({});
    expect(res.status).toBe(400);
  });
});
