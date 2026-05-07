import { useState, useEffect } from 'react';
import * as notificacionService from '../services/notificacionService';

export default function PanelNotificaciones({ onCerrar }) {
  const [notificaciones, setNotificaciones] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    notificacionService.listarNotificaciones()
      .then(({ data }) => setNotificaciones(data.notificaciones))
      .catch(() => {})
      .finally(() => setCargando(false));
  }, []);

  async function handleMarcarLeida(id) {
    try {
      await notificacionService.marcarLeida(id);
      setNotificaciones((prev) =>
        prev.map((n) => (n.id === id ? { ...n, leida: true } : n))
      );
    } catch { /* silencioso */ }
  }

  async function handleMarcarTodas() {
    try {
      await notificacionService.marcarTodasLeidas();
      setNotificaciones((prev) => prev.map((n) => ({ ...n, leida: true })));
    } catch { /* silencioso */ }
  }

  const noLeidas = notificaciones.filter((n) => !n.leida).length;

  return (
    <div
      className="card border-0 shadow-lg"
      style={{ width: '340px', maxHeight: '480px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
      data-testid="panel-notificaciones"
    >
      {/* Encabezado */}
      <div className="card-header bg-white d-flex align-items-center justify-content-between py-2">
        <h6 className="mb-0 fw-bold">
          Notificaciones
          {noLeidas > 0 && (
            <span className="badge bg-danger ms-2">{noLeidas}</span>
          )}
        </h6>
        <div className="d-flex gap-2">
          {noLeidas > 0 && (
            <button
              className="btn btn-link btn-sm text-muted p-0"
              onClick={handleMarcarTodas}
              data-testid="btn-marcar-todas"
            >
              Marcar todas
            </button>
          )}
          <button
            className="btn btn-link btn-sm text-muted p-0"
            onClick={onCerrar}
            aria-label="Cerrar panel"
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>
      </div>

      {/* Lista */}
      <div style={{ overflowY: 'auto', flex: 1 }}>
        {cargando && (
          <div className="text-center py-4">
            <div className="spinner-border spinner-border-sm text-primary" role="status" />
          </div>
        )}

        {!cargando && notificaciones.length === 0 && (
          <div className="text-center py-4 text-muted" data-testid="panel-vacio">
            <i className="bi bi-bell-slash fs-3 d-block mb-2" />
            <span className="small">Sin notificaciones nuevas</span>
          </div>
        )}

        {notificaciones.map((notif) => (
          <div
            key={notif.id}
            className={`p-3 border-bottom ${notif.leida ? '' : 'bg-primary bg-opacity-10'}`}
            style={{ cursor: notif.leida ? 'default' : 'pointer' }}
            onClick={() => !notif.leida && handleMarcarLeida(notif.id)}
            data-testid={`notif-item-${notif.id}`}
          >
            <div className="d-flex gap-2">
              <i className={`bi bi-bell${notif.leida ? '' : '-fill'} text-primary mt-1`} />
              <div className="flex-grow-1">
                <p className="mb-1 small">{notif.mensaje}</p>
                <p className="mb-0 text-muted" style={{ fontSize: '0.72rem' }}>
                  {new Date(notif.created_at).toLocaleString('es-CO', {
                    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
                  })}
                  {!notif.leida && (
                    <span className="badge bg-primary ms-2" style={{ fontSize: '0.65rem' }}>Nueva</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
