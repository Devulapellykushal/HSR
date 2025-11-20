'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface SessionLogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SessionLogoutModal({ isOpen, onClose }: SessionLogoutModalProps) {
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      // Auto redirect to login after 3 seconds
      const timer = setTimeout(() => {
        onClose();
        router.push('/admin/login');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose, router]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 sm:p-8 animate-in fade-in zoom-in duration-200">
        <div className="text-center">
          {/* Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
            <svg
              className="h-8 w-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Session Logged Out
          </h2>

          {/* Message */}
          <p className="text-gray-600 mb-6">
            Your session has been logged out because you logged in from another device.
            You will be redirected to the login page shortly.
          </p>

          {/* Button */}
          <button
            onClick={() => {
              onClose();
              router.push('/admin/login');
            }}
            className="w-full bg-[#2E936B] text-white font-semibold py-3 px-6 rounded-xl hover:bg-[#1a4d3a] transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
}

