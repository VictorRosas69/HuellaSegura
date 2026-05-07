import { useState, useCallback } from 'react';

export function useGeolocalizacion() {
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  const obtenerUbicacion = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Tu navegador no soporta geolocalización.');
      return;
    }
    setCargando(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
        setCargando(false);
      },
      () => {
        setError('No se pudo obtener tu ubicación. Verifica los permisos del navegador.');
        setCargando(false);
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  return { coords, error, cargando, obtenerUbicacion };
}
