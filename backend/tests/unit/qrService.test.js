process.env.FRONTEND_URL = 'http://localhost:5173';
process.env.NODE_ENV = 'test';

const { generarQR } = require('../../src/services/qrService');

describe('qrService', () => {
  test('Genera un buffer PNG válido para un ID de mascota', async () => {
    const { buffer } = await generarQR(1);
    expect(Buffer.isBuffer(buffer)).toBe(true);
    expect(buffer.length).toBeGreaterThan(0);
    // Los archivos PNG inician con la firma \x89PNG
    expect(buffer[0]).toBe(0x89);
    expect(buffer.slice(1, 4).toString()).toBe('PNG');
  });

  test('El QR contiene la URL correcta del perfil público', async () => {
    const { url } = await generarQR(42);
    expect(url).toBe('http://localhost:5173/publico/mascotas/42');
    expect(url).toContain('/publico/mascotas/42');
  });

  test('QR distintos para mascotas distintas', async () => {
    const { url: url1 } = await generarQR(1);
    const { url: url2 } = await generarQR(2);
    expect(url1).not.toBe(url2);
    expect(url1).toContain('/publico/mascotas/1');
    expect(url2).toContain('/publico/mascotas/2');
  });

  test('Retorna un dataUrl base64 válido', async () => {
    const { dataUrl } = await generarQR(1);
    expect(dataUrl).toMatch(/^data:image\/png;base64,/);
    expect(dataUrl.length).toBeGreaterThan(100);
  });
});
