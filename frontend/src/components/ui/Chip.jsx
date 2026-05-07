const variants = {
  // Filled
  primary:  'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300',
  teal:     'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
  success:  'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  warning:  'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  danger:   'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  neutral:  'bg-warm-100 text-dark-600 dark:bg-dark-600 dark:text-dark-200',
  dark:     'bg-dark-800 text-white dark:bg-dark-500',
  // Status
  sos:      'bg-danger text-white font-bold uppercase tracking-wider',
  lost:     'bg-danger/90 text-white font-bold',
  found:    'bg-success text-white font-bold',
  // Outlined
  'outline-primary': 'border border-primary text-primary bg-transparent',
  'outline-teal':    'border border-teal text-teal-600 bg-transparent',
  'outline-neutral': 'border border-warm-border text-dark-600 dark:border-dark-500 dark:text-dark-200 bg-transparent',
  // Tags especiales directorio
  '24h':     'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  aliada:    'bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-300',
  urgencias: 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-300',
};

const sizes = {
  xs: 'text-2xs px-2 py-0.5 gap-1',
  sm: 'text-xs  px-2.5 py-1   gap-1',
  md: 'text-sm  px-3   py-1   gap-1.5',
};

export default function Chip({
  children,
  variant = 'neutral',
  size = 'sm',
  icon,
  dot,
  className = '',
  onClick,
  active = false,
  ...props
}) {
  return (
    <span
      className={[
        'chip',
        sizes[size] ?? sizes.sm,
        variants[variant] ?? variants.neutral,
        active ? 'ring-2 ring-primary/30' : '',
        onClick ? 'cursor-pointer hover:opacity-80' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={onClick}
      {...props}
    >
      {dot && (
        <span className="h-1.5 w-1.5 rounded-full bg-current shrink-0" />
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
}