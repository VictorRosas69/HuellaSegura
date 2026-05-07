import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import FichaMascota from './FichaMascota';
import * as reporteService from '../services/reporteService';

// Fix iconos de marcador con Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl:       new URL('leaflet/dist/images/marker-icon.png',    import.meta.url).href,
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  shadowUrl:     new URL('leaflet/dist/images/marker-shadow.png',  import.meta.url).href,
});

const CENTRO_PASTO = [1.2136, -77.2811];

// Sub-componente que centra el mapa cuando cambian las coords del usuario
function CentrarMapa({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) map.flyTo([coords.lat, coords.lng], 16);
  }, [coords, map]);
  return null;
}

export default function MapaReportes({ filtroEspecie = 'todos', centrarEn = null }) {
  const [reportes, setReportes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    reporteService.listarReportesActivos()
      .then(({ data }) => setReportes(data.reportes))
      .catch(() => setError('No se pudieron cargar los reportes.'))
      .finally(() => setCargando(false));
  }, []);

  const reportesFiltrados =
    filtroEspecie === 'todos'
      ? reportes
      : reportes.filter((r) => r.mascota?.especie === filtroEspecie);

  return (
    <div className="position-relative" data-testid="mapa-reportes" style={{ height: '100%' }}>
      {cargando && (
        <div className="position-absolute top-50 start-50 translate-middle" style={{ zIndex: 1000 }}>
          <div className="spinner-border text-primary" role="status" />
        </div>
      )}
      {error && (
        <div className="alert alert-warning m-2 py-1 small">{error}</div>
      )}

      <MapContainer
        center={CENTRO_PASTO}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        data-testid="mapa-container"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <CentrarMapa coords={centrarEn} />

        {reportesFiltrados.map((reporte) => (
          <div key={reporte.id} data-testid={`marker-${reporte.mascota?.especie || 'unknown'}`}>
            <Marker position={[parseFloat(reporte.latitud), parseFloat(reporte.longitud)]}>
              <Popup>
                <FichaMascota reporte={reporte} />
              </Popup>
            </Marker>
          </div>
        ))}
      </MapContainer>
    </div>
  );
}
