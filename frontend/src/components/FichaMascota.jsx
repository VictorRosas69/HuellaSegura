const ESPECIE_LABELS = {
  perro: 'Perro', gato: 'Gato', ave: 'Ave', reptil: 'Reptil', otro: 'Otro',
};

export default function FichaMascota({ reporte }) {
  const { mascota, propietario, fecha_perdida, descripcion } = reporte;

  return (
    <div style={{ minWidth: '200px', maxWidth: '260px' }} data-testid="ficha-mascota">
      {/* Foto */}
      {mascota?.foto_principal ? (
        <img
          src={mascota.foto_principal}
          alt={mascota.nombre}
          className="w-100 rounded mb-2"
          style={{ height: '120px', objectFit: 'cover' }}
          data-testid="ficha-foto"
        />
      ) : (
        <div
          className="w-100 bg-light rounded mb-2 d-flex align-items-center justify-content-center"
          style={{ height: '80px' }}
          data-testid="ficha-foto-placeholder"
        >
          <i className="bi bi-paw fs-2 text-secondary" />
        </div>
      )}

      {/* Nombre y especie */}
      <h6 className="fw-bold mb-1" data-testid="ficha-nombre">
        {mascota?.nombre || 'Mascota'}
      </h6>
      <p className="mb-1 small">
        <span className="badge bg-primary me-1" data-testid="ficha-especie">
          {ESPECIE_LABELS[mascota?.especie] || mascota?.especie}
        </span>
        {mascota?.raza && <span className="text-muted">{mascota.raza}</span>}
      </p>

      {/* Detalles */}
      {mascota?.color && (
        <p className="small mb-1 text-muted">
          <i className="bi bi-palette me-1" />
          {mascota.color}
          {mascota.sexo && ` · ${mascota.sexo}`}
        </p>
      )}

      <p className="small mb-1 text-muted">
        <i className="bi bi-calendar3 me-1" />
        Perdido el{' '}
        {new Date(fecha_perdida + 'T12:00:00').toLocaleDateString('es-CO', {
          day: '2-digit', month: 'short', year: 'numeric',
        })}
      </p>

      {descripcion && (
        <p className="small mb-1 text-truncate" title={descripcion}>
          <i className="bi bi-chat-text me-1" />
          {descripcion}
        </p>
      )}

      {/* Contacto */}
      {propietario && (
        <div className="mt-2 pt-2 border-top" data-testid="ficha-contacto">
          <p className="small mb-0 fw-semibold">
            <i className="bi bi-person-circle me-1 text-primary" />
            Reportado por: {propietario.nombre}
          </p>
        </div>
      )}
    </div>
  );
}
