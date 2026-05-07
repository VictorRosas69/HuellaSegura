import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Bell, Users } from 'lucide-react';
import Button from '../components/ui/Button';

const SLIDES = [
  {
    id: 0,
    icon: '🐾',
    iconBg: 'bg-gradient-to-br from-primary-400 to-primary-500',
    badge: { icon: MapPin, bg: 'bg-teal' },
    titleLight: 'Huella',
    titleAccent: 'Segura',
    description: 'Reencuentra a tu mejor amigo.\nUna red de vecinos cuidando a Pasto.',
  },
  {
    id: 1,
    icon: '🗺️',
    iconBg: 'bg-gradient-to-br from-teal-400 to-teal-500',
    badge: { icon: Bell, bg: 'bg-primary' },
    titleLight: 'Alertas ',
    titleAccent: 'en tiempo real',
    description: 'Recibe notificaciones cuando se reporte una mascota cerca de ti. Cada segundo cuenta.',
  },
  {
    id: 2,
    icon: '🤝',
    iconBg: 'bg-gradient-to-br from-violet-400 to-violet-500',
    badge: { icon: Users, bg: 'bg-violet-500' },
    titleLight: 'Red de ',
    titleAccent: 'vecinos',
    description: 'Más de 500 vecinos en Pasto se ayudan mutuamente para encontrar mascotas perdidas.',
  },
];

const slideVariants = {
  enter:  (d) => ({ x: d > 0 ?  48 : -48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:   (d) => ({ x: d > 0 ? -48 :  48, opacity: 0 }),
};

export default function Splash() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [dir,     setDir]     = useState(1);

  const goTo = (idx) => {
    setDir(idx > current ? 1 : -1);
    setCurrent(idx);
  };

  const next = () => {
    if (current < SLIDES.length - 1) goTo(current + 1);
    else navigate('/register');
  };

  const slide = SLIDES[current];
  const BadgeIcon = slide.badge.icon;

  return (
    /*
      Forzamos fondo cálido SIEMPRE (sin dark mode):
      el Splash es una pantalla de marca que siempre muestra colores claros.
    */
    <div
      className="flex flex-col min-h-screen overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #FFF0EA 0%, #FFF8F5 55%, #FFE8E0 100%)' }}
    >
      {/* ── Círculos decorativos de fondo (muy sutiles) ─────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-primary-200/30" />
        <div className="absolute top-1/3 -left-12 h-40 w-40 rounded-full bg-teal-200/25" />
        <div className="absolute bottom-1/4 right-4 h-32 w-32 rounded-full bg-primary-100/40" />
      </div>

      {/* ── Botón "Saltar" ───────────────────────────────────────────────── */}
      {current < SLIDES.length - 1 && (
        <button
          onClick={() => navigate('/register')}
          style={{ color: '#6B7280' }}
          className="absolute top-12 right-6 text-sm font-medium hover:opacity-70 transition-opacity z-10"
        >
          Saltar
        </button>
      )}

      {/* ── Área central ────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 gap-8 relative z-10 pt-16 pb-4">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={current}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
            className="flex flex-col items-center gap-7"
          >
            {/* ── Icono con badge ──────────────────────────────────────── */}
            <div className="relative">
              <div
                className={`h-[7.5rem] w-[7.5rem] rounded-[2rem] ${slide.iconBg}
                            flex items-center justify-center text-5xl
                            shadow-[0_12px_40px_rgba(249,123,98,0.35)]
                            select-none`}
              >
                {slide.icon}
              </div>
              {/* Badge ubicación */}
              <div
                className={`absolute -bottom-2.5 -right-2.5
                            h-9 w-9 rounded-full ${slide.badge.bg}
                            flex items-center justify-center
                            shadow-[0_4px_12px_rgba(0,0,0,0.18)]`}
              >
                <BadgeIcon size={17} color="white" strokeWidth={2.2} />
              </div>
            </div>

            {/* ── Título ──────────────────────────────────────────────── */}
            <div className="text-center flex flex-col gap-3">
              <h1
                className="text-[2.6rem] font-poppins font-extrabold leading-tight tracking-tight"
                style={{ color: '#1A1A2E' }}
              >
                {slide.titleLight}
                <span style={{ color: '#F97B62' }}>{slide.titleAccent}</span>
              </h1>
              <p
                className="text-[1rem] leading-relaxed whitespace-pre-line"
                style={{ color: '#6B7280' }}
              >
                {slide.description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <div className="px-7 pb-10 flex flex-col items-center gap-5 relative z-10">
        {/* Dots */}
        <div className="flex items-center gap-2" aria-label="Progreso del onboarding">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
              style={{ background: i === current ? '#F97B62' : '#E5D5CF' }}
              className={`rounded-full transition-all duration-300 ${
                i === current ? 'h-2.5 w-7' : 'h-2.5 w-2.5'
              }`}
            />
          ))}
        </div>

        {/* CTA */}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={next}
          className="shadow-warm-lg"
        >
          {current < SLIDES.length - 1 ? 'Siguiente' : 'Comenzar'} →
        </Button>

        {/* Link inferior */}
        <p style={{ color: '#9CA3AF' }} className="text-sm">
          ¿Ya tienes cuenta?{' '}
          <Link
            to="/login"
            style={{ color: '#F97B62' }}
            className="font-semibold hover:underline"
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
