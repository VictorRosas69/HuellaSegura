import { motion } from 'framer-motion';
import Button from './Button';

export default function EmptyState({
  icon: Icon,
  emoji,
  title,
  description,
  action,
  actionLabel,
  className = '',
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col items-center justify-center text-center px-8 py-12 gap-4 ${className}`}
    >
      {emoji && (
        <div className="h-20 w-20 rounded-3xl bg-warm-100 dark:bg-dark-600 flex items-center justify-center text-4xl select-none">
          {emoji}
        </div>
      )}
      {Icon && !emoji && (
        <div className="h-20 w-20 rounded-3xl bg-warm-100 dark:bg-dark-600 flex items-center justify-center text-primary">
          <Icon size={36} strokeWidth={1.5} />
        </div>
      )}

      {title && (
        <h3 className="font-poppins font-semibold text-lg text-dark-800 dark:text-white">
          {title}
        </h3>
      )}
      {description && (
        <p className="text-sm text-dark-400 dark:text-dark-300 leading-relaxed max-w-xs">
          {description}
        </p>
      )}
      {action && actionLabel && (
        <Button variant="primary" size="md" onClick={action} className="mt-2">
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
}
