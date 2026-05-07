import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import QRDescargable from '../../src/components/QRDescargable';

vi.mock('../../src/services/avistamientoService', () => ({
  descargarQR: vi.fn(),
  obtenerPerfilPublico: vi.fn(),
  crearAvistamiento: vi.fn(),
}));

import * as avistamientoService from '../../src/services/avistamientoService';

function renderQR(props = {}) {
  return render(
    <MemoryRouter>
      <QRDescargable mascotaId={1} nombreMascota="Firulais" {...props} />
    </MemoryRouter>
  );
}

describe('QRDescargable', () => {
  beforeEach(() => vi.clearAllMocks());

  test('renderiza el botón de descarga', () => {
    renderQR();
    expect(screen.getByTestId('btn-descargar-qr')).toBeInTheDocument();
    expect(screen.getByText(/Descargar QR/i)).toBeInTheDocument();
  });

  test('llama a descargarQR al hacer clic', async () => {
    avistamientoService.descargarQR.mockResolvedValue({ data: new Blob(['png'], { type: 'image/png' }) });
    renderQR();
    const user = userEvent.setup();

    await user.click(screen.getByTestId('btn-descargar-qr'));

    await waitFor(() => {
      expect(avistamientoService.descargarQR).toHaveBeenCalledWith(1);
    });
  });

  test('muestra estado de carga mientras descarga', async () => {
    avistamientoService.descargarQR.mockImplementation(() => new Promise(() => {}));
    renderQR();
    const user = userEvent.setup();

    await user.click(screen.getByTestId('btn-descargar-qr'));

    await waitFor(() => {
      expect(screen.getByRole('button')).toBeDisabled();
    });
    expect(screen.getByText(/Generando/i)).toBeInTheDocument();
  });

  test('muestra error si la descarga falla', async () => {
    avistamientoService.descargarQR.mockRejectedValue(new Error('Network'));
    renderQR();
    const user = userEvent.setup();

    await user.click(screen.getByTestId('btn-descargar-qr'));

    await waitFor(() => {
      expect(screen.getByText(/No se pudo generar el QR/i)).toBeInTheDocument();
    });
  });
});
