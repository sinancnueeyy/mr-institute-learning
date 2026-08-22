import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '../components/ui/Container';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Alert } from '../components/ui/Alert';
import { AuthService } from '../services/AuthService';
import { ROUTES } from '../constants';
import { GraduationCap, LogIn } from 'lucide-react';
import { FadeIn } from '../components/animations/FadeIn';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.role === 'DEVELOPER') {
        navigate(ROUTES.DEVELOPER.DASHBOARD);
      } else {
        navigate(ROUTES.OFFICE.DASHBOARD);
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await AuthService.login({ email, password });
    
    if (result.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Container className="sm:max-w-md w-full">
        <FadeIn>
          <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
            <div className="w-16 h-16 bg-brand-primary rounded-md flex items-center justify-center text-white mx-auto shadow-sm mb-4">
              <GraduationCap className="w-8 h-8" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-text-primary">
              Portal Login
            </h2>
            <p className="mt-2 text-center text-sm text-text-secondary">
              Sign in to access your dashboard
            </p>
          </div>

          <Card className="border-border shadow-md">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive" title="Authentication Error">
                    {error}
                  </Alert>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-text-primary">Email Address</label>
                  <Input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                    placeholder="admin@mrinstitute.edu"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-semibold text-text-primary">Password</label>
                    <a href="#" className="text-xs font-medium text-brand-primary hover:text-brand-primary-dark">
                      Forgot password?
                    </a>
                  </div>
                  <Input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    placeholder="••••••••"
                  />
                </div>

                <Button type="submit" className="w-full h-12 text-base" loading={loading}>
                  <LogIn className="w-5 h-5 mr-2" />
                  Sign In
                </Button>
              </form>
            </CardContent>
          </Card>
        </FadeIn>
      </Container>
    </div>
  );
}
