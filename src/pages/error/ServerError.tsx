import { Link } from 'react-router-dom';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';
import { RefreshCw, Home, ServerCrash } from 'lucide-react';
import { ROUTES } from '../../constants';
import { SlideIn } from '../../components/animations/SlideIn';

export default function ServerError() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center py-20 px-4">
      <Container className="text-center max-w-2xl">
        <SlideIn direction="up">
          <div className="mx-auto w-24 h-24 bg-error/10 text-error rounded-full flex items-center justify-center mb-8">
            <ServerCrash className="w-12 h-12" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">Internal Server Error</h1>
          <p className="text-text-secondary text-lg md:text-xl mb-12">
            We are experiencing technical difficulties. Our team has been notified and is working to restore service.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" onClick={() => window.location.reload()}>
              <RefreshCw className="w-5 h-5 mr-2" />
              Try Again
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link to={ROUTES.PUBLIC.HOME}>
                <Home className="w-5 h-5 mr-2" />
                Back to Homepage
              </Link>
            </Button>
          </div>
        </SlideIn>
      </Container>
    </div>
  );
}
