import { Link } from 'react-router-dom';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';
import { Home, ArrowLeft } from 'lucide-react';
import { ROUTES } from '../../constants';
import { SlideIn } from '../../components/animations/SlideIn';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center py-20 px-4">
      <Container className="text-center max-w-2xl">
        <SlideIn direction="up">
          <div className="text-brand-primary font-black text-9xl tracking-tighter mb-4 opacity-20">404</div>
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">Page Not Found</h1>
          <p className="text-text-secondary text-lg md:text-xl mb-12">
            The page you are looking for doesn't exist, has been moved, or is temporarily unavailable.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg">
              <Link to={ROUTES.PUBLIC.HOME}>
                <Home className="w-5 h-5 mr-2" />
                Back to Homepage
              </Link>
            </Button>
            <Button variant="outline" size="lg" onClick={() => window.history.back()}>
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </Button>
          </div>
        </SlideIn>
      </Container>
    </div>
  );
}
