import { cn } from '@/lib/utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

export function Textarea({ className, label, error, helpText, id, ...props }: TextareaProps) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-dark mb-2">
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={cn(
          'w-full px-4 py-2.5 text-base border border-blue-100 rounded-xl',
          'bg-white text-dark placeholder-medium-grey',
          'transition-all duration-200 resize-none',
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
