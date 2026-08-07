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
    <div className="relative overflow-hidden bg-surface py-16 sm:py-24 lg:py-32">
      <Container>
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="sm:text-center md:mx-auto md:max-w-2xl lg:col-span-6 lg:text-left lg:flex lg:flex-col lg:justify-center">
            <SlideIn direction="up" duration={0.5}>
              <h1 className="text-4xl font-extrabold tracking-tight text-text-primary sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl text-balance">
                {headline}
              </h1>
              <p className="mt-6 text-base text-text-secondary sm:text-lg sm:max-w-xl sm:mx-auto md:mt-8 md:text-xl lg:mx-0">
                {description}
              </p>
              <div className="mt-8 sm:flex sm:justify-center lg:justify-start gap-4">
                {primaryCtaText && (
                  <Button size="lg" asChild className="w-full sm:w-auto">
                    <Link to={primaryCtaLink}>{primaryCtaText}</Link>
                  </Button>
                )}
                {secondaryCtaText && (
                  <Button size="lg" variant="outline" asChild className="w-full sm:w-auto mt-3 sm:mt-0">
                    <Link to={secondaryCtaLink}>{secondaryCtaText}</Link>
                  </Button>
                )}
              </div>
            </SlideIn>
          </div>
          <div className="relative mt-12 sm:mx-auto sm:max-w-lg lg:col-span-6 lg:mx-0 lg:mt-0 lg:flex lg:max-w-none lg:items-center">
            <FadeIn delay={0.2} duration={0.8} className="relative mx-auto w-full rounded-2xl shadow-floating lg:max-w-md group overflow-hidden">
              <img
                className="w-full rounded-2xl object-cover aspect-[4/3] transition-transform duration-700 ease-out group-hover:scale-105"
                src={imageSrc}
                alt="MR Institute Education"
                loading="lazy"
              />
            </FadeIn>
          </div>
        </div>
      </Container>
    </div>
  );
}
