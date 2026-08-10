import { Button } from '../ui/Button';
import { Container } from '../ui/Container';
import { FadeIn } from '../animations/FadeIn';
import { SlideIn } from '../animations/SlideIn';
import { Link } from 'react-router-dom';

export interface HeroSectionProps {
  headline: string;
  description: string;
  primaryCtaText?: string;
  primaryCtaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  imageSrc: string;
}

export function HeroSection({
  headline,
  description,
  primaryCtaText,
  primaryCtaLink = '/courses',
  secondaryCtaText,
  secondaryCtaLink = '/contact',
  imageSrc,
}: HeroSectionProps) {
  return (
    <div className="relative overflow-hidden bg-surface py-24 sm:py-32 lg:py-40">
      <Container className="relative z-10">
        <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
          <div className="sm:text-center md:mx-auto md:max-w-2xl lg:col-span-6 lg:text-left">
            <SlideIn direction="up" duration={0.6}>
              <div className="flex justify-center lg:justify-start mb-6">
                <span className="inline-block w-12 h-1 bg-brand-secondary rounded-full"></span>
              </div>
              <h1 className="font-serif text-4xl font-bold tracking-tight text-text-primary sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl text-balance leading-[1.1]">
                {headline}
              </h1>
              <p className="mt-6 text-base text-text-secondary sm:text-lg sm:max-w-xl sm:mx-auto md:mt-8 md:text-xl lg:mx-0 font-medium leading-relaxed">
                {description}
              </p>
              <div className="mt-10 sm:flex sm:justify-center lg:justify-start gap-4">
                {primaryCtaText && (
                  <Button size="lg" asChild className="w-full sm:w-auto px-10 shadow-md">
                    <Link to={primaryCtaLink}>{primaryCtaText}</Link>
                  </Button>
                )}
                {secondaryCtaText && (
                  <Button size="lg" variant="outline" asChild className="w-full sm:w-auto px-10 mt-3 sm:mt-0">
                    <Link to={secondaryCtaLink}>{secondaryCtaText}</Link>
                  </Button>
                )}
              </div>
            </SlideIn>
          </div>
          <div className="relative mt-16 sm:mx-auto sm:max-w-lg lg:col-span-6 lg:mx-0 lg:mt-0 lg:flex lg:max-w-none lg:items-center">
            <FadeIn delay={0.2} duration={0.8} className="relative mx-auto w-full lg:max-w-xl">
              <div className="relative rounded-md shadow-sm overflow-hidden border-2 border-brand-secondary/30 bg-surface-muted p-1 group">
                <div className="absolute inset-0 bg-brand-secondary/5 rounded-md"></div>
                <img
                  className="relative w-full rounded-md object-cover aspect-[4/3] transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  src={imageSrc}
                  alt="MR Institute Education"
                  fetchPriority="high"
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </Container>
    </div>
  );
}
