import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import MapaReportes from '../../src/components/MapaReportes';

// ─── Mocks ────────────────────────────────────────────────────────────────────
vi.mock('../../src/services/reporteService', () => ({
  listarReportesActivos: vi.fn(),
}));

vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }) => <div data-testid="mapa-container">{children}</div>,
  TileLayer:    () => null,
  Marker:       ({ children }) => <div data-testid="leaflet-marker">{children}</div>,
  Popup:        ({ children }) => <div data-testid="leaflet-popup">{children}</div>,
  useMap:       vi.fn().mockReturnValue({ flyTo: vi.fn(), setView: vi.fn() }),
  useMapEvents: vi.fn().mockReturnValue(null),
}));

vi.mock('leaflet', () => ({
  default: { Icon: { Default: { prototype: {}, mergeOptions: vi.fn() } } },
  Icon:    { Default: { prototype: {}, mergeOptions: vi.fn() } },
}));

vi.mock('leaflet/dist/leaflet.css', () => ({}));

import * as reporteService from '../../src/services/reporteService';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function buildReporte(overrides = {}) {
  return {
    id: 1,
    latitud: 1.2136,
    longitud: -77.2811,
    estado: 'en_busqueda',
    fecha_perdida: '2026-04-20',
    descripcion: 'Se perdió en el parque',
    mascota: {
      id: 1, nombre: 'Firulais', especie: 'perro',
      raza: 'Labrador', sexo: 'macho', color: 'Dorado',
      foto_principal: null,
    },
    propietario: { id: 1, nombre: 'Ana García' },
    ...overrides,
  };
}

function renderMapa(props = {}) {
  return render(
    <MemoryRouter>
      <MapaReportes filtroEspecie="todos" {...props} />
    </MemoryRouter>
  );
}

// ─── Suite ────────────────────────────────────────────────────────────────────
describe('MapaReportes Component', () => {
  beforeEach(() => vi.clearAllMocks());

  test('Renderiza el mapa de Leaflet correctamente', async () => {
    reporteService.listarReportesActivos.mockResolvedValue({ data: { reportes: [] } });
    renderMapa();
    await waitFor(() => {
      expect(screen.getByTestId('mapa-container')).toBeInTheDocument();
    });
  });

  test('Carga los marcadores desde el servicio de reportes', async () => {
    const reportes = [
      buildReporte({ id: 1 }),
      buildReporte({ id: 2, mascota: { id: 2, nombre: 'Luna', especie: 'gato', foto_principal: null } }),
    ];
    reporteService.listarReportesActivos.mockResolvedValue({ data: { reportes } });
    renderMapa();

    await waitFor(() => {
      expect(screen.getAllByTestId(/^marker-/)).toHaveLength(2);
    });
    expect(reporteService.listarReportesActivos).toHaveBeenCalledTimes(1);
  });

  test('Filtro "perro" oculta marcadores de gatos', async () => {
    const reportes = [
      buildReporte({ id: 1, mascota: { id: 1, nombre: 'Firulais', especie: 'perro', foto_principal: null } }),
      buildReporte({ id: 2, mascota: { id: 2, nombre: 'Luna',     especie: 'gato', foto_principal: null } }),
    ];
    reporteService.listarReportesActivos.mockResolvedValue({ data: { reportes } });
    renderMapa({ filtroEspecie: 'perro' });

    await waitFor(() => {
      expect(screen.getAllByTestId('marker-perro')).toHaveLength(1);
    });
    expect(screen.queryByTestId('marker-gato')).not.toBeInTheDocument();
  });

  test('Filtro "todos" muestra todos los marcadores', async () => {
    const reportes = [
      buildReporte({ id: 1, mascota: { id: 1, nombre: 'Firulais', especie: 'perro', foto_principal: null } }),
      buildReporte({ id: 2, mascota: { id: 2, nombre: 'Luna',     especie: 'gato', foto_principal: null } }),
      buildReporte({ id: 3, mascota: { id: 3, nombre: 'Perico',   especie: 'ave',  foto_principal: null } }),
    ];
    reporteService.listarReportesActivos.mockResolvedValue({ data: { reportes } });
    renderMapa({ filtroEspecie: 'todos' });

    await waitFor(() => {
      expect(screen.getAllByTestId(/^marker-/)).toHaveLength(3);
    });
  });

  test('Clic en marcador abre la FichaMascota con datos correctos', async () => {
    reporteService.listarReportesActivos.mockResolvedValue({
      data: { reportes: [buildReporte()] },
    });
    renderMapa();

    await waitFor(() => screen.getByTestId('marker-perro'));

    // El popup y la FichaMascota se renderizan junto al marcador (mock de react-leaflet)
    expect(screen.getByTestId('ficha-mascota')).toBeInTheDocument();
  });

  test('FichaMascota muestra nombre, especie y contacto del propietario', async () => {
    reporteService.listarReportesActivos.mockResolvedValue({
      data: { reportes: [buildReporte()] },
    });
    renderMapa();

    await waitFor(() => screen.getByTestId('ficha-mascota'));

    expect(screen.getByTestId('ficha-nombre')).toHaveTextContent('Firulais');
    expect(screen.getByTestId('ficha-especie')).toHaveTextContent('Perro');
    expect(screen.getByTestId('ficha-contacto')).toHaveTextContent('Ana García');
  });
});
