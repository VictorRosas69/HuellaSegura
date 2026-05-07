import { motion } from 'framer-motion';

const sizes = {
  xs: 'h-4 w-4',
  sm: 'h-6 w-6',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16',
};

export default function LoadingSpinner({ size = 'md', color = 'primary', fullScreen = false, label }) {
  const colorClass =
    color === 'primary' ? 'border-primary'
    : color === 'teal'  ? 'border-teal'
    : color === 'white' ? 'border-white'
    : 'border-dark-300';

  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        className={[
          sizes[size] ?? sizes.md,
          'rounded-full border-2 border-t-transparent',
          colorClass,
        ].join(' ')}
        role="status"
        aria-label={label || 'Cargando'}
      />
      {label && (
        <p className="text-sm text-dark-400 dark:text-dark-300 font-medium animate-pulse-soft">
          {label}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-warm-50/80 dark:bg-dark-800/80 backdrop-blur-sm z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
}
