import { forwardRef, useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Input = forwardRef(function Input(
  {
    label,
    error,
    hint,
    iconLeft,
    iconRight,
    type = 'text',
    className = '',
    containerClassName = '',
    required,
    id,
    ...props
  },
  ref
) {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type;
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-2xs font-semibold uppercase tracking-widest text-dark-300 dark:text-dark-400"
        >
          {label}
          {required && <span className="text-primary ml-0.5">*</span>}
        </label>
      )}

      <div className="relative">
        {iconLeft && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-300 dark:text-dark-400 pointer-events-none">
            {iconLeft}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          type={inputType}
          className={[
            'input-base',
            iconLeft  ? 'pl-11' : '',
            iconRight || type === 'password' ? 'pr-11' : '',
            error ? 'border-danger focus:border-danger focus:ring-danger/20 bg-red-50/40 dark:bg-red-900/10' : '',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />

        {type === 'password' && (
          <span
            tabIndex={-1}
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-300 dark:text-dark-400
                       hover:text-dark-700 dark:hover:text-white transition-colors cursor-pointer select-none"
            aria-label={showPassword ? 'Ocultar' : 'Mostrar'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        )}

        {iconRight && type !== 'password' && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-300 dark:text-dark-400 pointer-events-none">
            {iconRight}
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            id={`${inputId}-error`}
            aria-live="assertive"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-1.5 text-xs text-danger font-medium"
          >
            <AlertCircle size={13} className="shrink-0" />
            {error}
          </motion.p>
        )}
        {hint && !error && (
          <p className="text-xs text-dark-300 dark:text-dark-400">{hint}</p>
        )}
      </AnimatePresence>
    </div>
  );
});

export default Input;