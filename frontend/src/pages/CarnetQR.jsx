import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import { Share2, Download, Printer, CheckCircle } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import { obtenerMascota } from '../services/mascotaService';

const FRONTEND_URL = import.meta.env.VITE_APP_URL || window.location.origin;

export default function CarnetQR() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const carnetRef  = useRef(null);

  const [mascota,  setMascota]  = useState(null);
  const [cargando, setCargando] = useState(true);
  const [copiado,  setCopiado]  = useState(false);

  useEffect(() => {
    obtenerMascota(id)
      .then(({ data }) => setMascota(data.mascota))
      .catch(() => navigate(-1))
      .finally(() => setCargando(false));
  }, [id, navigate]);

  const publicUrl = `${FRONTEND_URL}/publico/mascotas/${id}`;
  const hsId = `HS-PT-${String(id).padStart(5, '0')}`;

  async function handleCompartir() {
    if (navigator.share) {
      try {
        await navigator.share({ title: `${mascota?.nombre} — HuellaSegura`, url: publicUrl });
      } catch { /* cancelado */ }
    } else {
      try {
        await navigator.clipboard.writeText(publicUrl);
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2500);
      } catch { /* fallback silencioso */ }
    }
  }

  function handleImprimir() { window.print(); }

  async function handleDescargarPNG() {
    try {
      const node = carnetRef.current;
      if (!node) return;

      // Usar html2canvas si está disponible, si no serializar el SVG del QR
      const svgEl = node.querySelector('svg');
      if (!svgEl) return;

      const svgData   = new XMLSerializer().serializeToString(svgEl);
      const svgBlob   = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl    = URL.createObjectURL(svgBlob);
      const img       = new Image();
      img.onload = () => {
        const canvas  = document.createElement('canvas');
        canvas.width  = img.width  * 3;
        canvas.height = img.height * 3;
        const ctx = canvas.getContext('2d');
        ctx.scale(3, 3);
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(svgUrl);
        const link  = document.createElement('a');
        link.href   = canvas.toDataURL('image/png');
        link.download = `carnet-${mascota?.nombre || 'mascota'}.png`;
        link.click();
      };
      img.src = svgUrl;
    } catch {
      alert('No se pudo descargar la imagen. Intenta imprimir la página.');
    }
  }

  if (cargando) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: '#FFF8F5' }}>
        <div className="h-10 w-10 rounded-full border-2 border-t-transparent animate-spin"
             style={{ borderColor: '#F97B62', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-10" style={{ background: '#FFF8F5' }}>

      {/* Header */}
      <PageHeader
        title="Carnet digital"
        actionRight={
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={handleCompartir}
            className="h-9 w-9 rounded-2xl flex items-center justify-center"
            style={{ background: '#FFF0EA' }}
          >
            {copiado
              ? <CheckCircle size={18} style={{ color: '#00C4B4' }} />
              : <Share2 size={18} style={{ color: '#F97B62' }} />}
          </motion.button>
        }
      />

      {/* Card carnet */}
      <motion.div
        ref={carnetRef}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mx-5 mt-4 rounded-3xl overflow-hidden shadow-card-lg"
        style={{ background: 'white' }}
      >
        {/* Branding header */}
        <div className="flex items-center justify-between px-5 py-3.5"
             style={{ background: '#FFF8F5', borderBottom: '1px solid #F0E8E4' }}>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg flex items-center justify-center text-sm"
                 style={{ background: 'linear-gradient(135deg,#FF9280,#F97B62)' }}>
              🐾
            </div>
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#F97B62' }}>
              HuellaSegura
            </span>
          </div>
          <span className="text-xs font-medium" style={{ color: '#9CA3AF' }}>
            ID · {hsId}
          </span>
        </div>

        {/* Info mascota */}
        <div className="flex items-center gap-4 px-5 py-4">
          <div className="h-16 w-16 rounded-2xl overflow-hidden shrink-0"
               style={{ background: 'linear-gradient(135deg,#FFD0BF,#F97B62)' }}>
            {mascota?.foto_urls?.[0]
              ? <img src={mascota.foto_urls[0]} alt="" className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-2xl">
                  {{ perro:'🐶',gato:'🐱',ave:'🐦',reptil:'🦎',otro:'🐾' }[mascota?.especie] || '🐾'}
                </div>
            }
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-poppins font-bold" style={{ color: '#1A1A2E' }}>
              {mascota?.nombre}
            </h2>
            <p className="text-sm mt-0.5" style={{ color: '#6B7280' }}>
              {[mascota?.raza, mascota?.edad ? `${mascota.edad} años` : null].filter(Boolean).join(' · ')}
            </p>
            {/* Badge verificado */}
            <span className="inline-flex items-center gap-1 mt-1.5 text-xs font-semibold
                             px-2.5 py-0.5 rounded-full"
                  style={{ background: '#E0F9F7', color: '#00C4B4', border: '1px solid #B3F1ED' }}>
              <CheckCircle size={11} /> VERIFICADO
            </span>
          </div>
        </div>

        {/* QR code */}
        <div className="flex items-center justify-center py-6 px-5">
          <div className="relative">
            <QRCodeSVG
              value={publicUrl}
              size={220}
              level="H"
              includeMargin={false}
              style={{ display: 'block' }}
            />
            {/* Overlay pata en el centro */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                         h-12 w-12 rounded-full flex items-center justify-center shadow-warm text-xl"
              style={{ background: 'linear-gradient(135deg,#FF9280,#F97B62)' }}
            >
              🐾
            </div>
          </div>
        </div>

        {/* Info propietario */}
        <div className="grid grid-cols-2 gap-px mx-5 mb-5 rounded-2xl overflow-hidden"
             style={{ background: '#F0E8E4' }}>
          <div className="px-4 py-3" style={{ background: '#FFF8F5' }}>
            <p className="text-2xs font-semibold uppercase tracking-widest mb-0.5"
               style={{ color: '#9CA3AF', fontSize: '0.6rem' }}>DUEÑO</p>
            <p className="text-sm font-semibold" style={{ color: '#1A1A2E' }}>
              {mascota?.usuario_id ? `Usuario #${mascota.usuario_id}` : '—'}
            </p>
          </div>
          <div className="px-4 py-3" style={{ background: '#FFF8F5' }}>
            <p className="text-2xs font-semibold uppercase tracking-widest mb-0.5"
               style={{ color: '#9CA3AF', fontSize: '0.6rem' }}>CONTACTO</p>
            <p className="text-sm font-semibold" style={{ color: '#1A1A2E' }}>HuellaSegura</p>
          </div>
        </div>

        <p className="text-center text-xs pb-5" style={{ color: '#C9B8B0' }}>
          Escanea para ver el perfil completo
        </p>
      </motion.div>

      {/* Botones de acción */}
      <div className="flex gap-3 mx-5 mt-5">
        <button
          onClick={handleDescargarPNG}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl
                     border text-sm font-semibold transition-opacity active:opacity-70"
          style={{ borderColor: '#EDE5E1', color: '#6B7280', background: 'white' }}
        >
          <Download size={16} /> PNG
        </button>

        <button
          onClick={handleImprimir}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl
                     border text-sm font-semibold"
          style={{ borderColor: '#EDE5E1', color: '#6B7280', background: 'white' }}
        >
          <Printer size={16} /> Imprimir
        </button>

        <button
          onClick={handleCompartir}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl
                     text-white text-sm font-semibold shadow-warm"
          style={{ background: 'linear-gradient(135deg,#FF9280,#F97B62)' }}
        >
          <Share2 size={16} /> {copiado ? '¡Copiado!' : 'Compartir'}
        </button>
      </div>
    </div>
  );
}
