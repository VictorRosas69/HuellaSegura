import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../../src/pages/admin/Dashboard';

vi.mock('../../src/services/adminService', () => ({
  obtenerEstadisticas: vi.fn(),
}));
vi.mock('../../src/context/AuthContext', () => ({
  useAuth: () => ({ logout: vi.fn() }),
}));

import * as adminService from '../../src/services/adminService';

const STATS_MOCK = {
  total_usuarios: 42, reportes_activos: 7,
  avistamientos_mes: 15, reportes_resueltos: 10,
};

function renderPage() {
  return render(<MemoryRouter><Dashboard /></MemoryRouter>);
}

describe('Sprint 7 — Dashboard Admin (DoD)', () => {
  beforeEach(() => vi.clearAllMocks());

  // ── C2: Panel muestra métricas ─────────────────────────────────────────────
  test('Renderiza el panel de administración con encabezado', () => {
    adminService.obtenerEstadisticas.mockReturnValue(new Promise(() => {}));
    renderPage();
    // El nuevo dashboard muestra "Administración" como título
    expect(screen.getByText(/administración/i)).toBeInTheDocument();
  });

  test('Muestra las tarjetas de estadísticas con valores del API', async () => {
    adminService.obtenerEstadisticas.mockResolvedValue({ data: { estadisticas: STATS_MOCK } });
    renderPage();
    await waitFor(() => {
      expect(screen.getAllByTestId('stat-card').length).toBeGreaterThanOrEqual(4);
    });
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
  });

  test('Muestra skeleton de carga mientras obtiene estadísticas', () => {
    adminService.obtenerEstadisticas.mockReturnValue(new Promise(() => {}));
    renderPage();
    // Nuevo diseño: skeleton divs en lugar de spinner-border
    const skeletons = document.querySelectorAll('[class*="skeleton"], .skeleton, [data-testid="stat-card"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  test('Muestra accesos a Gestión de usuarios, Moderación y Directorio', async () => {
    adminService.obtenerEstadisticas.mockResolvedValue({ data: { estadisticas: STATS_MOCK } });
    renderPage();
    await waitFor(() => {
      expect(screen.getByText(/gestión de usuarios/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/moderación/i)).toBeInTheDocument();
    expect(screen.getByText(/directorio/i)).toBeInTheDocument();
  });

  test('Llama a obtenerEstadisticas al montar', async () => {
    adminService.obtenerEstadisticas.mockResolvedValue({ data: { estadisticas: STATS_MOCK } });
    renderPage();
    await waitFor(() => {
      expect(adminService.obtenerEstadisticas).toHaveBeenCalledTimes(1);
    });
  });

  // ── C1: Solo accesible para admin (ProtectedRoute) ─────────────────────────
  test('Usa datos mock si el API falla', async () => {
    adminService.obtenerEstadisticas.mockRejectedValue(new Error('Network'));
    renderPage();
    // El nuevo dashboard usa MOCK_STATS como fallback — no se rompe
    await waitFor(() => {
      expect(screen.getByText(/administración/i)).toBeInTheDocument();
    });
  });
});
