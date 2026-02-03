import { cn } from '@/lib/utils';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helpText?: string;
  options: Array<{ value: string; label: string }>;
}

export function Select({
  className,
  label,
  error,
  helpText,
  id,
  options,
  ...props
}: SelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-dark mb-2">
          {label}
        </label>
      )}
      <select
        id={id}
        className={cn(
          'w-full px-4 py-2.5 text-base border border-blue-100 rounded-xl',
          'bg-white text-dark',
          'transition-all duration-200 appearance-none',
          'focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent',
          'hover:border-blue-200',
          'cursor-pointer',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      >
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-red-600 mt-1.5">{error}</p>}
      {helpText && !error && <p className="text-sm text-medium-grey mt-1.5">{helpText}</p>}
    </div>
  );
}
