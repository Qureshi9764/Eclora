import { motion } from 'framer-motion';
import Loader from './Loader';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  icon,
  className = '',
}) => {
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variants = {
    primary: 'bg-gradient-to-r from-pink-light to-lavender-500 text-white hover:shadow-lg focus:ring-lavender-500',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-400',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
    success: 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-500',
    outline: 'border-2 border-lavender-500 text-lavender-600 hover:bg-lavender-50 focus:ring-lavender-500',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const classes = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${fullWidth ? 'w-full' : ''}
    ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `;

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      className={classes}
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Loading...
        </>
      ) : (
        <>
          {icon && icon}
          {children}
        </>
      )}
    </motion.button>
  );
};

export default Button;

