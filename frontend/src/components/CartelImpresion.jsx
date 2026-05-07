import { useCallback } from 'react';

export default function CartelImpresion({ mascota, onCerrar }) {
  const handleImprimir = useCallback(() => {
    window.print();
  }, []);

  return (
    <>
      {/* Estilos solo para impresión */}
      <style>{`
        @media print {
          body > *:not(#cartel-raiz) { display: none !important; }
          #cartel-raiz { display: block !important; }
          .no-print { display: none !important; }
          @page { size: A4 portrait; margin: 15mm; }
        }
      `}</style>

      <div id="cartel-raiz" data-testid="cartel-impresion"
        style={{ maxWidth: '600px', margin: '0 auto', padding: '24px', textAlign: 'center' }}>

        {/* Botones de control — se ocultan al imprimir */}
        <div className="no-print d-flex justify-content-between mb-3">
          <button className="btn btn-secondary btn-sm" onClick={onCerrar}>
            <i className="bi bi-x-lg me-1" />Cerrar
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleImprimir} data-testid="btn-imprimir">
            <i className="bi bi-printer me-1" />Imprimir cartel
          </button>
        </div>

        {/* Encabezado */}
        <div style={{ background: '#dc3545', color: 'white', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>¡MASCOTA PERDIDA!</h1>
        </div>

        {/* Foto */}
        {mascota.foto_principal ? (
          <img
            src={mascota.foto_principal}
            alt={mascota.nombre}
            style={{ maxWidth: '280px', maxHeight: '280px', objectFit: 'cover', borderRadius: '8px', marginBottom: '16px' }}
            data-testid="cartel-foto"
          />
        ) : (
          <div style={{ fontSize: '5rem', marginBottom: '16px' }}>🐾</div>
        )}

        {/* Nombre */}
        <h2 style={{ color: '#dc3545', fontSize: '2.2rem', fontWeight: 'bold' }}
          data-testid="cartel-nombre">{mascota.nombre}</h2>

        {/* Detalles */}
        <div style={{ fontSize: '1.1rem', color: '#333', lineHeight: 1.8, marginBottom: '16px' }}>
          <p><strong>Especie:</strong> {mascota.especie}{mascota.raza ? ` · ${mascota.raza}` : ''}</p>
          {mascota.color && <p><strong>Color:</strong> {mascota.color}</p>}
          {mascota.sexo  && <p><strong>Sexo:</strong> {mascota.sexo}</p>}
        </div>

        {mascota.descripcion && (
          <p style={{ fontSize: '1rem', color: '#555', fontStyle: 'italic', marginBottom: '16px' }}>
            "{mascota.descripcion}"
          </p>
        )}

        {/* Pie */}
        <div style={{ borderTop: '2px solid #2563eb', paddingTop: '12px', color: '#2563eb', fontWeight: 'bold' }}>
          <p style={{ margin: 0 }}>Si la encontraste, repórtala en</p>
          <p style={{ margin: 0, fontSize: '1.2rem' }}>HuellaSegura — Pasto, Nariño</p>
        </div>
      </div>
    </>
  );
}
