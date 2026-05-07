const { calcularDistancia } = require('../../src/services/distanciaHelper');

describe('distanciaHelper', () => {
  test('Calcula correctamente la distancia entre dos coordenadas cercanas', () => {
    // ~1.1 km al norte dentro de Pasto
    const distancia = calcularDistancia(1.2136, -77.2811, 1.2236, -77.2811);
    expect(distancia).toBeGreaterThan(0);
    expect(distancia).toBeLessThan(2);
  });

  test('Retorna 0 si las coordenadas son iguales', () => {
    const distancia = calcularDistancia(1.2136, -77.2811, 1.2136, -77.2811);
    expect(distancia).toBe(0);
  });

  test('Distancia Pasto centro a Jongovito es aproximadamente 8.5 km', () => {
    // Pasto centro: 1.2136°N, 77.2811°W
    // Jongovito (sector rural, Nariño): 1.1385°N, 77.2590°W  → ~8.7 km
    const distancia = calcularDistancia(1.2136, -77.2811, 1.1385, -77.2590);
    expect(distancia).toBeGreaterThan(7);
    expect(distancia).toBeLessThan(10);
  });

  test('Distancia es simétrica (A→B = B→A)', () => {
    const d1 = calcularDistancia(1.2136, -77.2811, 1.2236, -77.2900);
    const d2 = calcularDistancia(1.2236, -77.2900, 1.2136, -77.2811);
    expect(Math.abs(d1 - d2)).toBeLessThan(0.0001);
  });

  test('Distancia entre Bogotá y Pasto es mayor a 450 km en línea recta', () => {
    // Bogotá: 4.7110°N, 74.0721°W  — Pasto: 1.2136°N, 77.2811°W  → ~527 km Haversine
    const distancia = calcularDistancia(4.7110, -74.0721, 1.2136, -77.2811);
    expect(distancia).toBeGreaterThan(450);
    expect(distancia).toBeLessThan(600);
  });
});
