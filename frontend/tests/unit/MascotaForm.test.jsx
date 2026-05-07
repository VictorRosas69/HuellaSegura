import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import MascotaForm from '../../src/pages/MascotaForm';

// ─── Mocks ────────────────────────────────────────────────────────────────────
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../../src/services/mascotaService', () => ({
  crearMascota:      vi.fn(),
  actualizarMascota: vi.fn(),
  obtenerMascota:    vi.fn(),
  subirFotos:        vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: Object.assign(vi.fn(), { success: vi.fn(), error: vi.fn() }),
}));

import * as mascotaService from '../../src/services/mascotaService';
import { toast } from 'sonner';

function renderForm(path = '/mascotas/nueva') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/mascotas/nueva"      element={<MascotaForm />} />
        <Route path="/mascotas/:id/editar" element={<MascotaForm />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('Sprint 2 — MascotaForm (DoD)', () => {
  beforeEach(() => vi.clearAllMocks());

  // ── C1: Renderiza correctamente el formulario wizard ──────────────────────
  test('Renderiza el indicador de paso', () => {
    renderForm();
    expect(screen.getByTestId('paso-indicator')).toBeInTheDocument();
  });

  test('Muestra el paso 1 al iniciar', () => {
    renderForm();
    expect(screen.getByTestId('paso-1')).toBeInTheDocument();
  });

  test('Muestra zona de carga de fotos en paso 1', () => {
    renderForm();
    expect(screen.getByTestId('drop-zone')).toBeInTheDocument();
  });

  test('Muestra el input de archivo (file-input)', () => {
    renderForm();
    expect(screen.getByTestId('file-input')).toBeInTheDocument();
  });

  // ── C6: Validación — no avanza sin nombre ─────────────────────────────────
  test('No avanza al paso 2 si falta el nombre', async () => {
    renderForm();
    const user = userEvent.setup();
    await user.click(screen.getByTestId('btn-siguiente'));
    expect(screen.getByTestId('paso-1')).toBeInTheDocument();
    expect(screen.queryByTestId('paso-2')).not.toBeInTheDocument();
    expect(screen.getByText(/nombre es obligatorio/i)).toBeInTheDocument();
  });

  // ── C1: Avanza con nombre válido ──────────────────────────────────────────
  test('Avanza al paso 2 cuando el nombre es válido', async () => {
    renderForm();
    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText(/cómo se llama/i), 'Firulais');
    await user.click(screen.getByTestId('btn-siguiente'));
    await waitFor(() => {
      expect(screen.getByTestId('paso-2')).toBeInTheDocument();
    });
  });

  // ── C6: Validación paso 2 — no avanza sin especie ─────────────────────────
  test('No avanza al paso 3 si falta la especie', async () => {
    renderForm();
    const user = userEvent.setup();

    // Paso 1
    await user.type(screen.getByPlaceholderText(/cómo se llama/i), 'Luna');
    await user.click(screen.getByTestId('btn-siguiente'));
    await waitFor(() => screen.getByTestId('paso-2'));

    // Intentar avanzar sin especie (solo poner color)
    await user.type(screen.getByPlaceholderText(/escribe el color exacto/i), 'Blanco');
    await user.click(screen.getByTestId('btn-siguiente'));

    expect(screen.getByTestId('paso-2')).toBeInTheDocument();
    expect(screen.getByText(/selecciona la especie/i)).toBeInTheDocument();
  });

  // ── C1: Flujo completo — registra mascota ─────────────────────────────────
  test('Llama a crearMascota y navega tras completar el wizard', async () => {
    mascotaService.crearMascota.mockResolvedValue({ data: { mascota: { id: 42 } } });
    renderForm();
    const user = userEvent.setup();

    // Paso 1 — nombre
    await user.type(screen.getByPlaceholderText(/cómo se llama/i), 'Firulais');
    await user.click(screen.getByTestId('btn-siguiente'));

    // Paso 2 — especie, sexo, color
    await waitFor(() => screen.getByTestId('paso-2'));
    // Especie: buscar dentro de los botones de especie (el label está en un <span>)
    await user.click(screen.getAllByText('Perro')[0]);
    // Sexo: el botón tiene "♂ Macho" como texto — usar regex
    await user.click(screen.getByRole('button', { name: /macho/i }));
    await user.type(screen.getByPlaceholderText(/escribe el color exacto/i), 'Dorado');
    await user.click(screen.getByTestId('btn-siguiente'));

    // Paso 3
    await waitFor(() => screen.getByTestId('paso-3'));
    await user.click(screen.getByTestId('btn-siguiente'));

    // Paso 4 — confirmar
    await waitFor(() => screen.getByTestId('paso-4'));
    await user.click(screen.getByTestId('btn-guardar'));

    await waitFor(() => {
      expect(mascotaService.crearMascota).toHaveBeenCalledWith(
        expect.objectContaining({ nombre: 'Firulais', especie: 'perro' })
      );
    });
    expect(mockNavigate).toHaveBeenCalledWith('/mascotas');
  });

  // ── C4: Toast de éxito al guardar ────────────────────────────────────────
  test('Muestra toast de éxito al guardar correctamente', async () => {
    mascotaService.crearMascota.mockResolvedValue({ data: { mascota: { id: 1 } } });
    renderForm();
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText(/cómo se llama/i), 'Max');
    await user.click(screen.getByTestId('btn-siguiente'));
    await waitFor(() => screen.getByTestId('paso-2'));
    await user.click(screen.getAllByText('Perro')[0]);
    await user.click(screen.getByRole('button', { name: /macho/i }));
    await user.type(screen.getByPlaceholderText(/escribe el color exacto/i), 'Negro');
    await user.click(screen.getByTestId('btn-siguiente'));
    await waitFor(() => screen.getByTestId('paso-3'));
    await user.click(screen.getByTestId('btn-siguiente'));
    await waitFor(() => screen.getByTestId('paso-4'));
    await user.click(screen.getByTestId('btn-guardar'));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        expect.stringMatching(/registrado|actualizado/i)
      );
    });
  });
});
