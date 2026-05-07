import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Bell, Users, ArrowRight } from 'lucide-react';

const SLIDES = [
  {
    id: 0,
    icon: '🐾',
    bg: 'linear-gradient(135deg,#FF9280,#F97B62)',
    shadow: 'rgba(249,123,98,0.55)',
    badge: { icon: MapPin, color: '#00C4B4', bg: 'linear-gradient(135deg,#26D6CD,#00C4B4)' },
    title: ['Huella', 'Segura'],
    accentIdx: 1,
    description: 'Reencuentra a tu mejor amigo.\nUna red de vecinos cuidando a Pasto.',
    orb1: 'rgba(249,123,98,0.2)',
    orb2: 'rgba(0,196,180,0.12)',
  },
  {
    id: 1,
    icon: '🗺️',
    bg: 'linear-gradient(135deg,#26D6CD,#00C4B4)',
    shadow: 'rgba(0,196,180,0.55)',
    badge: { icon: Bell, color: '#F97B62', bg: 'linear-gradient(135deg,#FF9280,#F97B62)' },
    title: ['Alertas ', 'instantáneas'],
    accentIdx: 1,
    description: 'Recibe notificaciones cuando se reporte una mascota cerca de ti. Cada segundo cuenta.',
    orb1: 'rgba(0,196,180,0.2)',
    orb2: 'rgba(249,123,98,0.12)',
  },
  {
    id: 2,
    icon: '🤝',
    bg: 'linear-gradient(135deg,#C7B2F5,#9B87E8)',
    shadow: 'rgba(155,135,232,0.55)',
    badge: { icon: Users, color: '#9B87E8', bg: 'linear-gradient(135deg,#C7B2F5,#9B87E8)' },
    title: ['Red de ', 'vecinos'],
    accentIdx: 1,
    description: 'Más de 500 vecinos en Pasto se ayudan mutuamente para encontrar mascotas perdidas.',
    orb1: 'rgba(155,135,232,0.2)',
    orb2: 'rgba(249,123,98,0.1)',
  },
];

const slideVariants = {
  enter:  (d) => ({ x: d > 0 ? 60 : -60, opacity: 0, scale: 0.95 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit:   (d) => ({ x: d > 0 ? -60 : 60, opacity: 0, scale: 0.95 }),
};

export default function Splash() {
  const navigate         = useNavigate();
  const [current, setCurrent] = useState(0);
  const [dir, setDir]         = useState(1);

  const goTo = (idx) => { setDir(idx > current ? 1 : -1); setCurrent(idx); };
  const next = () => current < SLIDES.length - 1 ? goTo(current + 1) : navigate('/register');

  const slide    = SLIDES[current];
  const BadgeIcon = slide.badge.icon;

  return (
    <div className="flex flex-col min-h-screen overflow-hidden"
         style={{ background: 'linear-gradient(160deg,#0F0F1A 0%,#1A1A2E 55%,#0D1F3C 100%)' }}>

      {/* Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute -top-24 -right-20 h-64 w-64 rounded-full"
             style={{ background: `radial-gradient(circle,${slide.orb1} 0%,transparent 70%)`, transition: 'background 0.5s' }} />
        <div className="absolute bottom-1/3 -left-16 h-48 w-48 rounded-full"
             style={{ background: `radial-gradient(circle,${slide.orb2} 0%,transparent 70%)`, transition: 'background 0.5s' }} />
        <div className="absolute top-1/2 right-0 h-32 w-32 rounded-full"
             style={{ background: 'radial-gradient(circle,rgba(155,135,232,0.08) 0%,transparent 70%)' }} />
      </div>

      {/* Saltar */}
      {current < SLIDES.length - 1 && (
        <button onClick={() => navigate('/register')}
                className="absolute top-12 right-6 text-sm font-semibold z-10 px-3 py-1.5 rounded-full transition-opacity hover:opacity-70"
                style={{ color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.08)' }}>
          Saltar
        </button>
      )}

      {/* Área central */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 gap-10 relative z-10 pt-16 pb-4">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={current}
            custom={dir}
            variants={slideVariants}
            initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className="flex flex-col items-center gap-8 w-full"
          >
            {/* Icono */}
            <div className="relative">
              <motion.div
                initial={{ scale: 0.8, rotate: -10 }} animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                className="h-32 w-32 rounded-[2.5rem] flex items-center justify-center text-6xl select-none"
                style={{ background: slide.bg, boxShadow: `0 20px 60px ${slide.shadow}, 0 0 0 1px rgba(255,255,255,0.1)` }}>
                {slide.icon}
              </motion.div>
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.3 }}
                className="absolute -bottom-3 -right-3 h-11 w-11 rounded-full flex items-center justify-center"
                style={{ background: slide.badge.bg, boxShadow: `0 6px 16px ${slide.shadow}` }}>
                <BadgeIcon size={18} color="white" strokeWidth={2.2} />
              </motion.div>
            </div>

            {/* Texto */}
            <div className="text-center flex flex-col gap-4">
              <h1 className="font-poppins font-extrabold leading-tight tracking-tight"
                  style={{ fontSize: '2.8rem', color: 'white' }}>
                {slide.title.map((word, i) => (
                  i === slide.accentIdx
                    ? <span key={i} style={{
                        background: slide.bg,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}>{word}</span>
                    : <span key={i}>{word}</span>
                ))}
              </h1>
              <p className="text-base leading-relaxed whitespace-pre-line max-w-xs mx-auto"
                 style={{ color: 'rgba(255,255,255,0.5)' }}>
                {slide.description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="px-7 pb-12 flex flex-col items-center gap-5 relative z-10">
        {/* Dots */}
        <div className="flex items-center gap-2">
          {SLIDES.map((_, i) => (
            <motion.button
              key={i} onClick={() => goTo(i)}
              animate={{
                width: i === current ? 28 : 8,
                background: i === current ? '#F97B62' : 'rgba(255,255,255,0.2)',
              }}
              className="h-2 rounded-full"
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>

        {/* Botón */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={next}
          className="w-full py-4 rounded-2xl font-poppins font-bold text-base text-white flex items-center justify-center gap-2"
          style={{
            background: 'linear-gradient(135deg,#FF9280,#F97B62)',
            boxShadow: '0 10px 32px rgba(249,123,98,0.45)',
          }}>
          {current < SLIDES.length - 1 ? 'Siguiente' : 'Comenzar'}
          <ArrowRight size={18} strokeWidth={2.5} />
        </motion.button>

        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="font-bold hover:underline" style={{ color: '#F97B62' }}>
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
