import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container } from '../components/ui/Container';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Alert } from '../components/ui/Alert';
import { AuthService } from '../services/AuthService';
import { ROUTES } from '../constants';
import { Lock, CheckCircle2 } from 'lucide-react';
import { FadeIn } from '../components/animations/FadeIn';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const result = await AuthService.updatePassword(password);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      setTimeout(() => {
        navigate(ROUTES.AUTH.LOGIN);
      }, 3000);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Container className="sm:max-w-md w-full">
        <FadeIn>
          <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
            <div className="w-16 h-16 bg-brand-primary rounded-md flex items-center justify-center text-white mx-auto shadow-sm mb-4">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-text-primary">
              Set New Password
            </h2>
            <p className="mt-2 text-center text-sm text-text-secondary">
              Enter your new secure password below
            </p>
          </div>

          <Card className="border-border shadow-md">
            <CardContent className="p-8">
              {success ? (
                <div className="text-center space-y-6">
                  <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary">Password Updated!</h3>
                    <p className="text-sm text-text-secondary mt-2">
                      Your password has been reset successfully. Redirecting you to login...
                    </p>
                  </div>
                  <Link to={ROUTES.AUTH.LOGIN}>
                    <Button className="w-full">
                      Go to Sign In
                    </Button>
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <Alert variant="destructive" title="Error">
                      {error}
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-text-primary">New Password</label>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-text-primary">Confirm New Password</label>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                    />
                  </div>

                  <Button type="submit" className="w-full h-12 text-base" loading={loading}>
                    Update Password
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </FadeIn>
      </Container>
    </div>
  );
}
