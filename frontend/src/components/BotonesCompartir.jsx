export default function BotonesCompartir({ mascotaId, nombreMascota }) {
  const urlPublica = `${window.location.origin}/publico/mascotas/${mascotaId}`;
  const mensajeWA  = encodeURIComponent(
    `🐾 ¡Ayúdame a encontrar a ${nombreMascota}! Mira su perfil en HuellaSegura: ${urlPublica}`
  );

  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(urlPublica)}`;
  const whatsappUrl = `https://wa.me/?text=${mensajeWA}`;

  return (
    <div className="d-flex gap-2 flex-wrap" data-testid="botones-compartir">
      <a
        href={facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-sm btn-outline-primary"
        data-testid="btn-facebook"
      >
        <i className="bi bi-facebook me-1" />Facebook
      </a>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-sm btn-outline-success"
        data-testid="btn-whatsapp"
      >
        <i className="bi bi-whatsapp me-1" />WhatsApp
      </a>
    </div>
  );
}
