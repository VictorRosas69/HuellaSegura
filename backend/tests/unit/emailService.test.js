process.env.NODE_ENV = 'test';
process.env.EMAIL_USER = 'test@huellasegura.co';

// Jest hoists jest.mock() — accedemos al mock a través del módulo requerido
jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue({ messageId: 'test-msg-id-123' }),
  }),
}));

const nodemailer = require('nodemailer');
const mockSendMail = nodemailer.createTransport().sendMail;
const { enviarCorreoReporteCreado } = require('../../src/services/emailService');

const DATOS_MOCK = {
  propietario: { email: 'ana@example.com', nombre: 'Ana García' },
  mascota:     { nombre: 'Firulais', especie: 'perro', foto_principal: 'https://res.cloudinary.com/test/perro.jpg' },
  reporte:     { fecha_perdida: '2026-04-20' },
};

describe('emailService', () => {
  beforeEach(() => mockSendMail.mockClear());

  test('Envía correo al propietario al crear un reporte', async () => {
    await enviarCorreoReporteCreado(DATOS_MOCK);
    expect(mockSendMail).toHaveBeenCalledTimes(1);
    const [opciones] = mockSendMail.mock.calls[0];
    expect(opciones.to).toBe('ana@example.com');
  });

  test('El correo contiene el nombre de la mascota', async () => {
    await enviarCorreoReporteCreado(DATOS_MOCK);
    const [opciones] = mockSendMail.mock.calls[0];
    expect(opciones.subject).toMatch(/Firulais/);
    expect(opciones.html).toMatch(/Firulais/);
  });

  test('El correo contiene la foto de la mascota cuando existe', async () => {
    await enviarCorreoReporteCreado(DATOS_MOCK);
    const [opciones] = mockSendMail.mock.calls[0];
    expect(opciones.html).toMatch(/cloudinary/);
  });

  test('El correo se envía aunque la mascota no tenga foto', async () => {
    const datosSinFoto = { ...DATOS_MOCK, mascota: { ...DATOS_MOCK.mascota, foto_principal: null } };
    await expect(enviarCorreoReporteCreado(datosSinFoto)).resolves.toBeDefined();
    expect(mockSendMail).toHaveBeenCalledTimes(1);
  });

  test('El correo incluye saludo personalizado al propietario', async () => {
    await enviarCorreoReporteCreado(DATOS_MOCK);
    const [opciones] = mockSendMail.mock.calls[0];
    expect(opciones.html).toMatch(/Ana García/);
  });
});
