import { useState } from 'react';
import { descargarQR } from '../services/avistamientoService';

export default function QRDescargable({ mascotaId, nombreMascota }) {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  async function handleDescargar() {
    setCargando(true);
    setError('');
    try {
      const { data } = await descargarQR(mascotaId);
      const url = URL.createObjectURL(new Blob([data], { type: 'image/png' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = `qr-${nombreMascota.replace(/\s+/g, '-')}.png`;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      setError('No se pudo generar el QR. Intenta nuevamente.');
    } finally {
      setCargando(false);
    }
  }

  return (
    <div data-testid="qr-descargable">
      <button
        className="btn btn-outline-secondary btn-sm"
        onClick={handleDescargar}
        disabled={cargando}
        data-testid="btn-descargar-qr"
        title={`Descargar QR de ${nombreMascota}`}
      >
        {cargando ? (
          <><span className="spinner-border spinner-border-sm me-1" role="status" />Generando…</>
        ) : (
          <><i className="bi bi-qr-code me-1" />Descargar QR</>
        )}
      </button>
      {error && <p className="text-danger small mt-1 mb-0">{error}</p>}
    </div>
  );
}
