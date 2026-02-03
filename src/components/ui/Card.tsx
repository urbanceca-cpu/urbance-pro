import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated';
}

export function Card({ className, variant = 'default', ...props }: CardProps) {
  const variantStyles = {
    default: 'bg-white border border-blue-100 hover:border-blue-200 hover:shadow-soft transition-all',
    elevated: 'bg-white shadow-soft-md hover:shadow-soft-lg border border-blue-50 transition-all',
  };

  return (
    <div
      className={cn('rounded-2xl p-6 transition-all duration-300', variantStyles[variant], className)}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mb-4', className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('text-xl font-bold text-dark', className)} {...props} />;
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-medium-grey text-sm', className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('space-y-4', className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mt-6 pt-6 border-t border-blue-100 flex items-center justify-between', className)} {...props} />;
}
