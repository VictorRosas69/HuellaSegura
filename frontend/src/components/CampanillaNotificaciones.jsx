import { useState, useEffect, useRef } from 'react';
import PanelNotificaciones from './PanelNotificaciones';
import * as notificacionService from '../services/notificacionService';

export default function CampanillaNotificaciones() {
  const [panelAbierto, setPanelAbierto] = useState(false);
  const [noLeidas, setNoLeidas] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    notificacionService.listarNotificaciones()
      .then(({ data }) => setNoLeidas(data.no_leidas || 0))
      .catch(() => {});
  }, []);

  // Cerrar panel al hacer clic fuera
  useEffect(() => {
    function handleClickFuera(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setPanelAbierto(false);
      }
    }
    if (panelAbierto) document.addEventListener('mousedown', handleClickFuera);
    return () => document.removeEventListener('mousedown', handleClickFuera);
  }, [panelAbierto]);

  return (
    <div className="position-relative" ref={ref} data-testid="campanilla-wrapper">
      <button
        className="btn btn-outline-light btn-sm position-relative"
        onClick={() => setPanelAbierto((prev) => !prev)}
        aria-label="Ver notificaciones"
        data-testid="btn-campanilla"
      >
        <i className="bi bi-bell-fill" />
        {noLeidas > 0 && (
          <span
            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
            style={{ fontSize: '0.6rem' }}
            data-testid="badge-notificaciones"
          >
            {noLeidas > 99 ? '99+' : noLeidas}
          </span>
        )}
      </button>

      {panelAbierto && (
        <div className="position-absolute end-0 mt-1" style={{ zIndex: 1050 }}>
          <PanelNotificaciones onCerrar={() => setPanelAbierto(false)} />
        </div>
      )}
    </div>
  );
}
