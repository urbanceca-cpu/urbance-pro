import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary: 'bg-gradient-to-r from-[#2F80ED] to-[#1B5BC0] text-white hover:shadow-lg hover:shadow-blue-500/40 active:from-[#2470D0] active:to-[#1A4FA8]',
    secondary: 'bg-gradient-to-r from-cyan-200 to-blue-100 text-blue-900 hover:from-cyan-300 hover:to-blue-200 active:from-cyan-300 active:to-blue-200',
    outline: 'border-2 border-blue-200 text-blue-800 hover:bg-blue-50 hover:border-blue-300 active:bg-blue-100',
    ghost: 'text-blue-800 hover:bg-blue-50 active:bg-blue-100',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3.5 text-lg font-semibold',
  };

  return (
    <button
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
      )}
      {children}
    </button>
  );
}
