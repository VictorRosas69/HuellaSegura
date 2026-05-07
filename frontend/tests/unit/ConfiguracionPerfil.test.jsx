import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import ConfiguracionPerfil from '../../src/pages/ConfiguracionPerfil';

// ─── Mocks ────────────────────────────────────────────────────────────────────
vi.mock('../../src/context/AuthContext', () => ({
  useAuth: () => ({
    usuario: { id: 1, nombre: 'Ana García', email: 'ana@example.com', radio_alerta: 5 },
    logout: vi.fn(),
  }),
}));

vi.mock('../../src/providers/ThemeProvider', () => ({
  ThemeContext: { Consumer: ({ children }) => children({ isDark: false, toggleTheme: vi.fn() }) },
  useThemeContext: () => ({ isDark: false, toggleTheme: vi.fn() }),
}));

vi.mock('../../src/services/notificacionService', () => ({
  actualizarRadioAlerta: vi.fn(),
  listarNotificaciones:  vi.fn().mockResolvedValue({ data: { notificaciones: [], no_leidas: 0 } }),
}));

vi.mock('../../src/services/mascotaService', () => ({
  listarMascotas: vi.fn().mockResolvedValue({ data: { mascotas: [] } }),
}));

// Mock Sonner para capturar toasts en tests
vi.mock('sonner', () => ({
  toast: Object.assign(vi.fn(), {
    success: vi.fn(),
    error:   vi.fn(),
  }),
}));

import * as notificacionService from '../../src/services/notificacionService';
import { toast } from 'sonner';

function renderPage() {
  return render(<MemoryRouter><ConfiguracionPerfil /></MemoryRouter>);
}

describe('Sprint 5 — ConfiguracionPerfil (DoD)', () => {
  beforeEach(() => vi.clearAllMocks());

  // ── C2: Panel muestra datos del usuario ───────────────────────────────────
  test('Muestra el nombre y correo del usuario', () => {
    renderPage();
    expect(screen.getByText('Ana García')).toBeInTheDocument();
    expect(screen.getByText('ana@example.com')).toBeInTheDocument();
  });

  // ── C3: Radio de alertas configurable 1-10 km ─────────────────────────────
  test('Renderiza el slider del radio de alerta con testid', () => {
    renderPage();
    expect(screen.getByTestId('slider-radio')).toBeInTheDocument();
    expect(screen.getByTestId('btn-guardar-radio')).toBeInTheDocument();
  });

  test('Slider inicia con el radio actual del usuario (5 km)', () => {
    renderPage();
    const slider = screen.getByTestId('slider-radio');
    expect(slider.value).toBe('5');
  });

  test('Llama a actualizarRadioAlerta al guardar', async () => {
    notificacionService.actualizarRadioAlerta.mockResolvedValue({ data: { radio_alerta: 5 } });
    renderPage();
    const user = userEvent.setup();
    await user.click(screen.getByTestId('btn-guardar-radio'));
    await waitFor(() => {
      expect(notificacionService.actualizarRadioAlerta).toHaveBeenCalledWith(5);
    });
  });

  test('Muestra toast de éxito tras guardar correctamente', async () => {
    notificacionService.actualizarRadioAlerta.mockResolvedValue({ data: {} });
    renderPage();
    const user = userEvent.setup();
    await user.click(screen.getByTestId('btn-guardar-radio'));
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        expect.stringMatching(/actualizado/i)
      );
    });
  });

  test('Muestra toast de error si la actualización falla', async () => {
    notificacionService.actualizarRadioAlerta.mockRejectedValue({
      response: { data: { message: 'Error al guardar.' } },
    });
    renderPage();
    const user = userEvent.setup();
    await user.click(screen.getByTestId('btn-guardar-radio'));
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

  // ── C6: Botón guardar radio visible en UI ────────────────────────────────
  test('Botón guardar radio no está deshabilitado inicialmente', () => {
    renderPage();
    const btn = screen.getByTestId('btn-guardar-radio');
    expect(btn).not.toBeDisabled();
  });
});
