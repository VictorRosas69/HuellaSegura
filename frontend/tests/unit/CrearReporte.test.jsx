import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import CrearReporte from '../../src/pages/CrearReporte';

// ─── Mocks ────────────────────────────────────────────────────────────────────
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../../src/services/reporteService', () => ({
  crearReporte: vi.fn(),
}));

vi.mock('../../src/components/MapaSelector', () => ({
  default: ({ onCoordsChange }) => (
    <div data-testid="mapa-selector">
      <button
        type="button"
        data-testid="simular-ubicacion"
        onClick={() => onCoordsChange(1.2136, -77.2811)}
      >
        Simular ubicación
      </button>
    </div>
  ),
}));

vi.mock('sonner', () => ({
  toast: Object.assign(vi.fn(), { success: vi.fn(), error: vi.fn() }),
}));

import * as reporteService from '../../src/services/reporteService';

function renderPage() {
  return render(<MemoryRouter><CrearReporte /></MemoryRouter>);
}

// ─── Suite — Sprint 3 — Crear reporte (persona que vio mascota) ───────────────
describe('Sprint 3 — CrearReporte (DoD)', () => {
  beforeEach(() => vi.clearAllMocks());

  // ── C2: Formulario incluye mapa para marcar ubicación ────────────────────
  test('Renderiza el selector de mapa', () => {
    renderPage();
    expect(screen.getByTestId('mapa-selector')).toBeInTheDocument();
  });

  // ── C1: Selector de tipo de animal (especie) ──────────────────────────────
  test('Muestra chips de selección de especie', () => {
    renderPage();
    expect(screen.getByText('Perro')).toBeInTheDocument();
    expect(screen.getByText('Gato')).toBeInTheDocument();
    expect(screen.getByText('Ave')).toBeInTheDocument();
  });

  // ── Selector de tiempo ────────────────────────────────────────────────────
  test('Muestra chips de tiempo (hace cuánto)', () => {
    renderPage();
    expect(screen.getByTestId('input-fecha')).toBeInTheDocument();
  });

  // ── Botón CTA visible ────────────────────────────────────────────────────
  test('Muestra el botón para enviar alerta', () => {
    renderPage();
    expect(screen.getByTestId('btn-crear-reporte')).toBeInTheDocument();
  });

  // ── C2: Validación — requiere ubicación ──────────────────────────────────
  test('No envía sin ubicación marcada en el mapa', async () => {
    renderPage();
    const user = userEvent.setup();

    // Seleccionar especie
    await user.click(screen.getByText('Perro'));
    // Intentar enviar sin marcar mapa
    await user.click(screen.getByTestId('btn-crear-reporte'));

    await waitFor(() => {
      expect(screen.getByText(/marca la ubicación/i)).toBeInTheDocument();
    });
    expect(reporteService.crearReporte).not.toHaveBeenCalled();
  });

  // ── C1: Validación — requiere tipo de animal ──────────────────────────────
  test('No envía sin seleccionar especie', async () => {
    renderPage();
    const user = userEvent.setup();

    // Marcar ubicación pero no seleccionar especie
    await user.click(screen.getByTestId('simular-ubicacion'));
    await user.click(screen.getByTestId('btn-crear-reporte'));

    await waitFor(() => {
      expect(screen.getByText(/selecciona el tipo de animal/i)).toBeInTheDocument();
    });
    expect(reporteService.crearReporte).not.toHaveBeenCalled();
  });

  // ── C1+C2: Envío válido con especie y ubicación ───────────────────────────
  test('Llama a crearReporte con latitud y longitud al enviar correctamente', async () => {
    reporteService.crearReporte.mockResolvedValue({ data: { reporte: { id: 1 } } });
    renderPage();
    const user = userEvent.setup();

    await user.click(screen.getByText('Perro'));
    await user.click(screen.getByTestId('simular-ubicacion'));
    await user.click(screen.getByTestId('btn-crear-reporte'));

    await waitFor(() => {
      expect(reporteService.crearReporte).toHaveBeenCalledWith(
        expect.objectContaining({ latitud: 1.2136, longitud: -77.2811 })
      );
    });
  });

  // ── C3: Después de enviar exitosamente muestra pantalla de éxito ──────────
  test('Muestra pantalla de éxito tras enviar correctamente', async () => {
    reporteService.crearReporte.mockResolvedValue({ data: {} });
    const { container } = renderPage();
    const user = userEvent.setup();

    await user.click(screen.getByText('Perro'));
    await user.click(screen.getByTestId('simular-ubicacion'));

    const form = container.querySelector('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(reporteService.crearReporte).toHaveBeenCalledWith(
        expect.objectContaining({ latitud: 1.2136, longitud: -77.2811 })
      );
    });

    // El componente muestra pantalla de éxito (no navega, muestra mensaje)
    await waitFor(() => {
      expect(screen.getByText(/gracias por ayudar/i)).toBeInTheDocument();
    });
  });
});
