import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import PanelNotificaciones from '../../src/components/PanelNotificaciones';

vi.mock('../../src/services/notificacionService', () => ({
  listarNotificaciones: vi.fn(),
  marcarLeida:          vi.fn(),
  marcarTodasLeidas:    vi.fn(),
}));

import * as notificacionService from '../../src/services/notificacionService';

function buildNotif(overrides = {}) {
  return {
    id: 1, usuario_id: 1, reporte_id: 10,
    mensaje: 'Mascota perdida cerca de tu ubicación.',
    tipo: 'proximidad', leida: false,
    created_at: new Date().toISOString(),
    ...overrides,
  };
}

function renderPanel() {
  return render(
    <MemoryRouter>
      <PanelNotificaciones onCerrar={vi.fn()} />
    </MemoryRouter>
  );
}

describe('PanelNotificaciones', () => {
  beforeEach(() => vi.clearAllMocks());

  test('muestra estado vacío cuando no hay notificaciones', async () => {
    notificacionService.listarNotificaciones.mockResolvedValue({ data: { notificaciones: [], no_leidas: 0 } });
    renderPanel();
    await waitFor(() => {
      expect(screen.getByTestId('panel-vacio')).toBeInTheDocument();
    });
  });

  test('renderiza una fila por cada notificación', async () => {
    const notifs = [buildNotif({ id: 1 }), buildNotif({ id: 2, mensaje: 'Otro aviso.' })];
    notificacionService.listarNotificaciones.mockResolvedValue({ data: { notificaciones: notifs, no_leidas: 2 } });
    renderPanel();
    await waitFor(() => {
      expect(screen.getByTestId('notif-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('notif-item-2')).toBeInTheDocument();
    });
  });

  test('muestra badge con conteo de no leídas', async () => {
    const notifs = [buildNotif({ id: 1, leida: false }), buildNotif({ id: 2, leida: false })];
    notificacionService.listarNotificaciones.mockResolvedValue({ data: { notificaciones: notifs, no_leidas: 2 } });
    renderPanel();
    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument();
    });
  });

  test('llama a marcarLeida al hacer clic en una notificación no leída', async () => {
    notificacionService.listarNotificaciones.mockResolvedValue({
      data: { notificaciones: [buildNotif({ id: 5, leida: false })], no_leidas: 1 },
    });
    notificacionService.marcarLeida.mockResolvedValue({});
    renderPanel();
    await waitFor(() => screen.getByTestId('notif-item-5'));

    const user = userEvent.setup();
    await user.click(screen.getByTestId('notif-item-5'));
    expect(notificacionService.marcarLeida).toHaveBeenCalledWith(5);
  });

  test('llama a marcarTodasLeidas al hacer clic en "Marcar todas"', async () => {
    notificacionService.listarNotificaciones.mockResolvedValue({
      data: { notificaciones: [buildNotif()], no_leidas: 1 },
    });
    notificacionService.marcarTodasLeidas.mockResolvedValue({});
    renderPanel();

    await waitFor(() => screen.getByTestId('btn-marcar-todas'));
    const user = userEvent.setup();
    await user.click(screen.getByTestId('btn-marcar-todas'));
    expect(notificacionService.marcarTodasLeidas).toHaveBeenCalledTimes(1);
  });
});
