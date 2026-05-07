import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const variants = {
  primary:   'bg-primary-gradient text-white shadow-warm hover:shadow-warm-lg active:shadow-warm-xs',
  secondary: 'bg-white dark:bg-dark-600 text-primary border-2 border-primary hover:bg-primary-50',
  ghost:     'bg-transparent text-primary hover:bg-primary-50 dark:hover:bg-dark-600',
  teal:      'bg-teal-gradient text-white shadow-teal hover:brightness-105',
  danger:    'bg-danger text-white hover:bg-red-600',
  dark:      'bg-dark-700 text-white hover:bg-dark-600',
  light:     'bg-warm-100 text-dark-700 dark:bg-dark-600 dark:text-white hover:bg-warm-200 dark:hover:bg-dark-500',
};

const sizes = {
  xs: 'h-8  px-3   text-xs  gap-1.5',
  sm: 'h-10 px-4   text-sm  gap-2',
  md: 'h-12 px-6   text-sm  gap-2',
  lg: 'h-14 px-7   text-base gap-2.5',
  xl: 'h-16 px-8   text-lg  gap-3',
};

const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    fullWidth = false,
    iconLeft,
    iconRight,
    className = '',
    onClick,
    type = 'button',
    ...props
  },
  ref
) {
  const isDisabled = disabled || loading;

  return (
    <motion.button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      whileTap={isDisabled ? {} : { scale: 0.96 }}
      transition={{ duration: 0.1 }}
      className={[
        'inline-flex items-center justify-center font-semibold font-poppins',
        'rounded-full select-none outline-none',
        'transition-all duration-150',
        'focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:pointer-events-none',
        variants[variant] ?? variants.primary,
        sizes[size] ?? sizes.md,
        fullWidth ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        iconLeft && <span className="shrink-0">{iconLeft}</span>
      )}
      {children && <span className={loading ? 'opacity-0' : ''}>{children}</span>}
      {!loading && iconRight && <span className="shrink-0">{iconRight}</span>}
    </motion.button>
  );
});

export default Button;