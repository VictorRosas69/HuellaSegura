import { useState, useRef } from 'react';

const MAX_FOTOS = 5;
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

export default function ImageUploader({ fotos, onFotosChange }) {
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  function validarArchivos(archivos) {
    const invalidos = archivos.filter((f) => !ALLOWED_TYPES.includes(f.type));
    if (invalidos.length > 0) {
      setError('Solo se permiten archivos JPG y PNG.');
      return false;
    }
    if (fotos.length + archivos.length > MAX_FOTOS) {
      setError(`Solo puedes subir hasta ${MAX_FOTOS} fotos por mascota.`);
      return false;
    }
    setError('');
    return true;
  }

  function handleSeleccion(e) {
    const nuevos = Array.from(e.target.files);
    if (!validarArchivos(nuevos)) return;

    const nuevosConPreview = nuevos.map((archivo) => ({
      archivo,
      preview: URL.createObjectURL(archivo),
    }));

    onFotosChange([...fotos, ...nuevosConPreview]);
    // Reset input para permitir seleccionar el mismo archivo de nuevo
    e.target.value = '';
  }

  function handleEliminar(index) {
    URL.revokeObjectURL(fotos[index].preview);
    const actualizadas = fotos.filter((_, i) => i !== index);
    onFotosChange(actualizadas);
    setError('');
  }

  function handleDrop(e) {
    e.preventDefault();
    const nuevos = Array.from(e.dataTransfer.files);
    if (!validarArchivos(nuevos)) return;

    const nuevosConPreview = nuevos.map((archivo) => ({
      archivo,
      preview: URL.createObjectURL(archivo),
    }));

    onFotosChange([...fotos, ...nuevosConPreview]);
  }

  return (
    <div>
      {/* Zona de drop */}
      {fotos.length < MAX_FOTOS && (
        <div
          className="border border-2 border-dashed rounded-3 p-4 text-center bg-light mb-3"
          style={{ cursor: 'pointer', borderStyle: 'dashed' }}
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          data-testid="drop-zone"
        >
          <i className="bi bi-cloud-upload fs-2 text-primary mb-2 d-block" />
          <p className="mb-1 fw-semibold">Haz clic o arrastra fotos aquí</p>
          <p className="text-muted small mb-0">
            JPG o PNG · Máx. 5 MB por foto · {fotos.length}/{MAX_FOTOS} subidas
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png"
            multiple
            className="d-none"
            onChange={handleSeleccion}
            data-testid="file-input"
          />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="alert alert-danger py-2 small mb-3" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2" />
          {error}
        </div>
      )}

      {/* Previews */}
      {fotos.length > 0 && (
        <div className="row g-2">
          {fotos.map((foto, index) => (
            <div key={index} className="col-4 col-md-3 position-relative">
              <img
                src={foto.preview}
                alt={`Foto ${index + 1}`}
                className="img-fluid rounded"
                style={{ height: '100px', width: '100%', objectFit: 'cover' }}
                data-testid={`preview-${index}`}
              />
              <button
                type="button"
                className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1 p-0"
                style={{ width: '22px', height: '22px', lineHeight: '1' }}
                onClick={() => handleEliminar(index)}
                aria-label={`Eliminar foto ${index + 1}`}
              >
                <i className="bi bi-x" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
