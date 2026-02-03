import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

export function Input({ className, label, error, helpText, id, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-dark mb-2">
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          'w-full px-4 py-2.5 text-base border border-blue-100 rounded-xl',
          'bg-white text-dark placeholder-medium-grey',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent',
          'hover:border-blue-200',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      />
      {error && <p className="text-sm text-red-600 mt-1.5">{error}</p>}
      {helpText && !error && <p className="text-sm text-medium-grey mt-1.5">{helpText}</p>}
    </div>
  );
}
