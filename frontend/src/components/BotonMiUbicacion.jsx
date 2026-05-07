import { useEffect } from 'react';
import { useGeolocalizacion } from '../hooks/useGeolocalizacion';

export default function BotonMiUbicacion({ onUbicacion }) {
  const { coords, error, cargando, obtenerUbicacion } = useGeolocalizacion();

  useEffect(() => {
    if (coords) onUbicacion(coords);
  }, [coords, onUbicacion]);

  return (
    <div>
      <button
        className="btn btn-outline-secondary btn-sm"
        onClick={obtenerUbicacion}
        disabled={cargando}
        title="Centrar mapa en mi ubicación"
        data-testid="btn-mi-ubicacion"
      >
        {cargando ? (
          <><span className="spinner-border spinner-border-sm me-1" role="status" />Obteniendo…</>
        ) : (
          <><i className="bi bi-crosshair me-1" />Mi ubicación</>
        )}
      </button>
      {error && (
        <p className="text-danger small mt-1 mb-0" data-testid="error-geolocalizacion">
          <i className="bi bi-exclamation-circle me-1" />
          {error}
        </p>
      )}
    </div>
  );
}
