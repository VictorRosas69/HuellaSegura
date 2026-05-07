import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PageHeader({
  title,
  subtitle,
  onBack,
  actionRight,
  transparent = false,
  dark = false,
  className = '',
}) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) onBack();
    else navigate(-1);
  };

  return (
    <header
      className={[
        'flex items-center gap-3 px-5 pt-safe min-h-[60px]',
        transparent ? '' : 'bg-white dark:bg-dark-800',
        dark ? 'text-white' : 'text-dark-900 dark:text-white',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Back button */}
      <motion.button
        whileTap={{ scale: 0.88 }}
        transition={{ duration: 0.1 }}
        onClick={handleBack}
        className={[
          'h-9 w-9 rounded-2xl flex items-center justify-center shrink-0',
          'transition-colors duration-150',
          dark
            ? 'bg-white/20 hover:bg-white/30 text-white'
            : 'bg-warm-100 dark:bg-dark-600 hover:bg-warm-200 dark:hover:bg-dark-500 text-dark-700 dark:text-white',
        ]
          .filter(Boolean)
          .join(' ')}
        aria-label="Volver"
      >
        <ChevronLeft size={20} strokeWidth={2.2} />
      </motion.button>

      {/* Title */}
      <div className="flex-1 min-w-0">
        {title && (
          <h1
            className={[
              'font-poppins font-semibold truncate',
              subtitle ? 'text-base leading-tight' : 'text-lg',
            ].join(' ')}
          >
            {title}
          </h1>
        )}
        {subtitle && (
          <p className={`text-xs mt-0.5 truncate ${dark ? 'text-white/70' : 'text-dark-400'}`}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Right action */}
      {actionRight ? (
        <div className="shrink-0">{actionRight}</div>
      ) : (
        <div className="h-9 w-9 shrink-0" aria-hidden />
      )}
    </header>
  );
}
