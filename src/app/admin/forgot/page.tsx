'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import Image from 'next/image';
import Link from 'next/link';
import { FiCheck, FiLock } from 'react-icons/fi';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordRequirements = [
    'At least 8 characters long',
    'Include uppercase and lowercase letters',
    'Include at least one number',
    'Include at least one special character',
  ];

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!email || !newPassword || !confirmPassword) {
      setError('Please fill all fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      await authService.resetPassword({
        email,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      setSuccess(true);
      setEmail('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        router.push('/admin/login');
      }, 2000);
    } catch (err: any) {
      const errorData = err.response?.data;
      let errorMessage = 'Failed to reset password';
      
      if (errorData?.errors) {
        const errorMessages: string[] = [];
        if (errorData.errors.email) {
          errorMessages.push(...(Array.isArray(errorData.errors.email) 
            ? errorData.errors.email 
            : [errorData.errors.email]));
        }
        if (errorData.errors.new_password) {
          errorMessages.push(...(Array.isArray(errorData.errors.new_password) 
            ? errorData.errors.new_password 
            : [errorData.errors.new_password]));
        }
        if (errorData.errors.confirm_password) {
          errorMessages.push(...(Array.isArray(errorData.errors.confirm_password) 
            ? errorData.errors.confirm_password 
            : [errorData.errors.confirm_password]));
        }
        if (errorData.errors.non_field_errors) {
          errorMessages.push(...(Array.isArray(errorData.errors.non_field_errors) 
            ? errorData.errors.non_field_errors 
            : [errorData.errors.non_field_errors]));
        }
        errorMessage = errorMessages.length > 0 ? errorMessages.join('\n') : errorData.message || errorMessage;
      } else if (errorData?.message) {
        errorMessage = errorData.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a4d3a] via-[#2E936B] to-[#1a4d3a] px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur rounded-2xl p-8 shadow-2xl border border-white/20">
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
          <h1 className="text-2xl font-bold text-white mb-2">Reset Password</h1>
          <p className="text-white/80 mt-2 text-sm">
            Enter your new password to reset your account.
          </p>
        </div>

        <form onSubmit={handleReset} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2E936B]"
              placeholder="Enter your email"
              required
              disabled={isSubmitting}
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2E936B]"
              placeholder="Enter new password"
              required
              disabled={isSubmitting}
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2E936B]"
              placeholder="Confirm new password"
              required
              disabled={isSubmitting}
              autoComplete="new-password"
            />
          </div>

          <div className="bg-blue-500/20 border border-blue-300/30 rounded-xl p-4">
            <p className="text-sm font-semibold mb-3 text-white flex items-center gap-2">
              <FiLock className="w-4 h-4" />
              Password Requirements:
            </p>
            <ul className="space-y-2">
              {passwordRequirements.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-white/90">
                  <FiCheck className="w-4 h-4 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/20 text-red-50 text-sm text-center">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-50 text-sm text-center">
              Password reset successfully. Redirecting to login...
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !email.trim() || !newPassword.trim() || !confirmPassword.trim()}
            className="w-full bg-white text-[#2E936B] font-semibold py-3 rounded-xl hover:bg-gray-50 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/admin/login"
            className="text-sm text-white/80 hover:text-white transition-colors underline-offset-2 hover:underline"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}


