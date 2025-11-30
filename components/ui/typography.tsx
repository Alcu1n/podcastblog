import { cn } from '@/lib/utils';

interface TypographyProps {
  className?: string;
  children: React.ReactNode;
}

export function H1({ className, children }: TypographyProps) {
  return (
    <h1 className={cn(
      'font-mono font-bold text-black leading-tight',
      'text-4xl md:text-6xl',
      'tracking-tight',
      className
    )}>
      {children}
    </h1>
  );
}

export function H2({ className, children }: TypographyProps) {
  return (
    <h2 className={cn(
      'font-mono font-bold text-black leading-tight',
      'text-3xl md:text-4xl',
      'tracking-tight',
      className
    )}>
      {children}
    </h2>
  );
}

export function H3({ className, children }: TypographyProps) {
  return (
    <h3 className={cn(
      'font-mono font-bold text-black leading-snug',
      'text-2xl md:text-3xl',
      className
    )}>
      {children}
    </h3>
  );
}

export function BodyText({ className, children }: TypographyProps) {
  return (
    <p className={cn(
      'font-sans text-gray-700 leading-relaxed',
      'text-base md:text-lg',
      className
    )}>
      {children}
    </p>
  );
}

export function CaptionText({ className, children }: TypographyProps) {
  return (
    <p className={cn(
      'font-mono text-sm text-gray-600 uppercase tracking-wider',
      className
    )}>
      {children}
    </p>
  );
}