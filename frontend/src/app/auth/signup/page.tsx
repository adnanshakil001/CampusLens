'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { apiFetch } from '@/lib/api';
import { signIn } from 'next-auth/react';
import { GraduationCap, Sparkles, User, Lock, Mail, ShieldAlert, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();

  // Form states
  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!fullName || !email || !password) {
      setError('Please fill in all registration fields.');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setIsLoading(false);
      return;
    }

    try {
      // Direct Express POST registration
      const data = await apiFetch<{ token: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          fullName,
          email,
          password,
        }),
      });

      if (data && data.token) {
        // Auto-signin after successful registration!
        const signinRes = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });

        if (signinRes?.error) {
          router.push('/auth/login?registered=true');
        } else {
          router.push('/dashboard');
          router.refresh();
        }
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-grow bg-[#fcf9f8] flex items-center justify-center py-16 px-4 min-h-screen">
      <Card className="bg-white border-border-subtle p-8 rounded-2xl shadow-xl max-w-md w-full flex flex-col gap-6 relative overflow-hidden">
        
        {/* Decorative Top Accent */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-primary via-primary-container to-secondary" />

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center gap-3">
          <GraduationCap className="h-12 w-12 text-primary animate-bounce" />
          <h2 className="text-2xl font-extrabold text-on-surface font-sans">
            Create your Account
          </h2>
          <p className="text-sm font-semibold text-on-surface-variant max-w-xs">
            Start saving colleges and comparing matrices side-by-side!
          </p>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Your Full Name"
            placeholder="Aarav Sharma"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <Input
            label="Email Address"
            placeholder="student@example.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Choose Password"
            placeholder="••••••••"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <div className="flex items-start gap-2 p-3 bg-error/5 text-error rounded-lg text-xs font-semibold">
              <ShieldAlert size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <Button variant="primary" type="submit" isLoading={isLoading} className="w-full mt-2 flex items-center justify-center gap-1.5">
            <span>Create Account</span>
            <ArrowRight size={16} />
          </Button>
        </form>

        <hr className="border-border-subtle" />

        {/* Signin Redirect */}
        <p className="text-sm font-semibold text-on-surface-variant text-center">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-secondary hover:text-secondary-container font-extrabold transition-colors">
            Sign In Instead
          </Link>
        </p>

      </Card>
    </div>
  );
}
