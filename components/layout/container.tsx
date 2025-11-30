import { cn } from '@/lib/utils';

interface ContainerProps {
  className?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export default function Container({
  className,
  children,
  size = 'lg'
}: ContainerProps) {
  const sizeClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full'
  };

  return (
    <div className={cn(
      'mx-auto px-4 sm:px-6 lg:px-8',
      sizeClasses[size],
      className
    )}>
      {children}
    </div>
  );
}