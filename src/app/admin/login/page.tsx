'use client';

import { isAdminAuthenticated, setTokens, setUser } from '@/lib/auth';
import { authService } from '@/services/authService';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

const LOGO_CLICK_COUNT_KEY = 'hsr_logo_click_count';

// Reset logo click count after successful login
const resetLogoClickCount = (): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(LOGO_CLICK_COUNT_KEY);
  } catch {
    // Ignore localStorage errors
  }
};

import { FiEye, FiEyeOff } from 'react-icons/fi';

// ... (existing imports)

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAdminAuthenticated()) {
      const returnTo = searchParams.get('returnTo') || '/admin/dashboard';
      router.replace(returnTo);
    }
  }, [router, searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await authService.login({ email, password });

      // Store tokens and user
      setTokens(response.tokens);
      setUser(response.user);

      // Reset logo click count after successful login
      resetLogoClickCount();

      // Get returnTo parameter or default to dashboard
      const returnTo = searchParams.get('returnTo') || '/admin/dashboard';

      // Redirect immediately - tokens are already stored synchronously
      router.replace(returnTo);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.errors?.non_field_errors?.[0] ||
        'Invalid email or password. Please try again.'
      );
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2E936B]"
          placeholder="Enter email"
          required
          disabled={isSubmitting}
          autoComplete="email"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2E936B] pr-10"
            placeholder="Enter password"
            required
            disabled={isSubmitting}
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2E936B] transition-colors focus:outline-none"
          >
            {showPassword ? <FiEye size={20} /> : <FiEyeOff size={20} />}
          </button>
        </div>
        <div className="mt-2 text-right">
          <Link
            href="/admin/forgot"
            className="text-sm text-white/80 hover:text-white transition-colors underline-offset-2 hover:underline"
          >
            Forgot password?
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-500/20 text-red-50 text-sm text-center">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || !email.trim() || !password.trim()}
        className="w-full bg-white text-[#2E936B] font-semibold py-3 rounded-xl hover:bg-gray-50 transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a4d3a] via-[#2E936B] to-[#1a4d3a] px-4 py-8">
      <div className="w-full max-w-md bg-white/10 backdrop-blur rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/20">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center mb-4 overflow-hidden cursor-pointer hover:bg-gray-50 transition-colors">
              <Image
                src="/images/logo.png"
                alt="HSR Green Homes Logo"
                width={48}
                height={48}
                priority
              />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-white">Admin Access</h1>
          <p className="text-white/80 mt-2 text-sm">
            Enter your credentials to continue.
          </p>
        </div>

        <Suspense fallback={
          <div className="space-y-6">
            <div className="h-12 bg-white/20 rounded-xl animate-pulse" />
            <div className="h-12 bg-white/20 rounded-xl animate-pulse" />
            <div className="h-12 bg-white/20 rounded-xl animate-pulse" />
          </div>
        }>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
