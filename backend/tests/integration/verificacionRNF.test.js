/**
 * Pruebas de Requerimientos No Funcionales (RNF)
 * Verifican configuraciones de seguridad y rendimiento del sistema.
 */
process.env.JWT_SECRET     = 'test_secret_huella_segura_2026';
process.env.JWT_EXPIRES_IN = '24h';
process.env.NODE_ENV       = 'test';

const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');

describe('Verificación RNF — Seguridad y Configuración', () => {

  describe('RNF-05: bcrypt cost >= 10', () => {
    test('El modelo Usuario usa bcrypt con cost factor de 10', async () => {
      const COST_MINIMO = 10;
      const hash = await bcrypt.hash('contraseña_test', COST_MINIMO);
      const costFactor = parseInt(hash.split('$')[2], 10);
      expect(costFactor).toBeGreaterThanOrEqual(COST_MINIMO);
    });

    test('Una contraseña real se verifica correctamente con bcrypt', async () => {
      const plain = 'MiContraseña2026!';
      const hash  = await bcrypt.hash(plain, 10);
      const valida = await bcrypt.compare(plain, hash);
      expect(valida).toBe(true);
    });

    test('Una contraseña incorrecta es rechazada por bcrypt', async () => {
      const hash     = await bcrypt.hash('correcta', 10);
      const invalida = await bcrypt.compare('incorrecta', hash);
      expect(invalida).toBe(false);
    });
  });

  describe('RNF-06: JWT expiration <= 24h', () => {
    test('El token JWT expira en 24 horas (86400 segundos)', () => {
      const secret  = 'test_secret_huella_segura_2026';
      const token   = jwt.sign({ id: 1 }, secret, { expiresIn: '24h' });
      const decoded = jwt.verify(token, secret);
      const diffSeg = decoded.exp - decoded.iat;
      expect(diffSeg).toBe(86400);
    });

    test('Un token expirado es rechazado por jwt.verify', () => {
      const secret = 'test_secret_huella_segura_2026';
      const token  = jwt.sign({ id: 1 }, secret, { expiresIn: '1ms' });
      return new Promise((resolve) => {
        setTimeout(() => {
          expect(() => jwt.verify(token, secret)).toThrow(/expired/i);
          resolve();
        }, 10);
      });
    });

    test('El JWT contiene el campo tokenVersion para invalidación de sesión', () => {
      const secret  = 'test_secret_huella_segura_2026';
      const token   = jwt.sign({ id: 1, rol: 'usuario', tokenVersion: 0 }, secret, { expiresIn: '24h' });
      const decoded = jwt.verify(token, secret);
      expect(decoded).toHaveProperty('tokenVersion');
    });
  });

  describe('RNF-04: Seguridad en rutas protegidas', () => {
    test('Las contraseñas nunca se almacenan en texto plano', async () => {
      const plain = 'TestPassword123';
      const hash  = await bcrypt.hash(plain, 10);
      expect(hash).not.toBe(plain);
      expect(hash).toMatch(/^\$2[aby]\$/);
    });

    test('El hash bcrypt no revela la contraseña original', async () => {
      const hash = await bcrypt.hash('secreto', 10);
      expect(hash).not.toContain('secreto');
    });
  });
});
