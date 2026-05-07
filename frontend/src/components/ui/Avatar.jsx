const sizes = {
  xs:  'h-7  w-7  text-2xs',
  sm:  'h-8  w-8  text-xs',
  md:  'h-10 w-10 text-sm',
  lg:  'h-12 w-12 text-base',
  xl:  'h-14 w-14 text-lg',
  '2xl':'h-20 w-20 text-2xl',
};

// Genera un gradiente de fondo determinista a partir de las iniciales
function getBgGradient(name = '') {
  const gradients = [
    'bg-gradient-to-br from-primary-400 to-primary-600',
    'bg-gradient-to-br from-teal-400 to-teal-600',
    'bg-gradient-to-br from-amber-400 to-orange-500',
    'bg-gradient-to-br from-violet-400 to-purple-600',
    'bg-gradient-to-br from-blue-400 to-indigo-600',
    'bg-gradient-to-br from-emerald-400 to-green-600',
  ];
  const idx = (name.charCodeAt(0) || 0) % gradients.length;
  return gradients[idx];
}

function getInitials(name = '') {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

export default function Avatar({
  src,
  name = '',
  size = 'md',
  className = '',
  badge,
  badgeColor = 'bg-success',
  ring,
  ...props
}) {
  const initials = getInitials(name);
  const bg = getBgGradient(name);

  return (
    <div className={`relative inline-flex shrink-0 ${className}`} {...props}>
      <div
        className={[
          sizes[size] ?? sizes.md,
          'rounded-full overflow-hidden flex items-center justify-center font-poppins font-semibold text-white',
          src ? '' : bg,
          ring ? `ring-2 ring-${ring} ring-offset-2` : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {src ? (
          <img src={src} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span>{initials || '?'}</span>
        )}
      </div>

      {badge && (
        <span
          className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white dark:border-dark-700 ${badgeColor}`}
          aria-hidden="true"
        />
      )}
    </div>
  );
}