
import { cn } from '../../utils';
import { FadeIn, type FadeInProps } from '../animations/FadeIn';

export interface SectionHeadingProps extends Omit<FadeInProps, 'title'> {
  title: string;
  subtitle?: string;
  alignment?: 'left' | 'center' | 'right';
}

export function SectionHeading({ title, subtitle, alignment = 'center', className, ...props }: SectionHeadingProps) {
  return (
    <FadeIn
      className={cn(
        'mb-12 flex flex-col',
        {
          'items-start text-left': alignment === 'left',
          'items-center text-center': alignment === 'center',
          'items-end text-right': alignment === 'right',
        },
        className
      )}
      {...props}
    >
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-text-secondary max-w-2xl">
          {subtitle}
        </p>
      )}
      <div className={cn("h-1 w-20 bg-brand-primary mt-6 rounded-full", {
        'mx-auto': alignment === 'center',
        'ml-auto': alignment === 'right'
      })} />
    </FadeIn>
  );
}
