import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../components/ui/Container';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Alert } from '../components/ui/Alert';
import { AuthService } from '../services/AuthService';
import { ROUTES } from '../constants';
import { KeyRound, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { FadeIn } from '../components/animations/FadeIn';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await AuthService.resetPasswordForEmail(email);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Container className="sm:max-w-md w-full">
        <FadeIn>
          <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
            <div className="w-16 h-16 bg-brand-primary rounded-md flex items-center justify-center text-white mx-auto shadow-sm mb-4">
              <KeyRound className="w-8 h-8" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-text-primary">
              Reset Password
            </h2>
            <p className="mt-2 text-center text-sm text-text-secondary">
              Enter your email and we'll send you a password recovery link
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
                    <h3 className="text-lg font-semibold text-text-primary">Reset Link Sent</h3>
                    <p className="text-sm text-text-secondary mt-2">
                      If an account exists for <span className="font-medium text-text-primary">{email}</span>, you will receive an email with instructions to reset your password.
                    </p>
                  </div>
                  <Link to={ROUTES.AUTH.LOGIN}>
                    <Button variant="outline" className="w-full">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Sign In
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
                    <label className="text-sm font-semibold text-text-primary">Email Address</label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                      required
                      placeholder="admin@mrinstitute.edu"
                    />
                  </div>

                  <Button type="submit" className="w-full h-12 text-base" loading={loading}>
                    Send Reset Link
                  </Button>

                  <div className="text-center">
                    <Link
                      to={ROUTES.AUTH.LOGIN}
                      className="inline-flex items-center text-sm font-medium text-brand-primary hover:text-brand-primary-dark"
                    >
                      <ArrowLeft className="w-4 h-4 mr-1" />
                      Back to Sign In
                    </Link>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </FadeIn>
      </Container>
    </div>
  );
}
