import { motion } from 'framer-motion';

const variants = {
  default:  'bg-white dark:bg-dark-700 shadow-card',
  elevated: 'bg-white dark:bg-dark-600 shadow-card-lg',
  glass:    'glass shadow-card',
  flat:     'bg-white dark:bg-dark-700 border border-warm-border dark:border-dark-500',
  warm:     'bg-warm-50 dark:bg-dark-700 border border-warm-border dark:border-dark-500',
  primary:  'bg-primary-gradient text-white',
  teal:     'bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-700/30',
};

export default function Card({
  children,
  variant = 'default',
  className = '',
  padding = 'p-5',
  radius = 'rounded-3xl',
  animate = false,
  onClick,
  ...props
}) {
  const classes = [
    variants[variant] ?? variants.default,
    radius,
    padding,
    onClick ? 'cursor-pointer active:scale-[0.98] transition-transform duration-150' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (animate) {
    return (
      <motion.div
        className={classes}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        onClick={onClick}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={classes} onClick={onClick} {...props}>
      {children}
    </div>
  );
}