'use client';

import { useState } from 'react';
import { getAdminPasscode } from '@/lib/auth';
import { saveAdminSettings } from '@/lib/adminSettingsStore';
import { useRouter } from 'next/navigation';

export default function ChangePasscodePage() {
  const router = useRouter();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');

  const handleChange = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setOk('');

    const expected = getAdminPasscode();
    if (current !== expected) {
      setError('Current passcode is incorrect.');
      return;
    }
    if (!next || next.length < 6) {
      setError('New passcode must be at least 6 characters.');
      return;
    }
    if (next !== confirm) {
      setError('New passcode and confirm do not match.');
      return;
    }
    saveAdminSettings({ password: next });
    setOk('Passcode updated. Use your new passcode to login.');
    setCurrent('');
    setNext('');
    setConfirm('');
    setTimeout(() => router.push('/admin/login'), 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a4d3a] via-[#2E936B] to-[#1a4d3a] px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur rounded-2xl p-8 shadow-2xl border border-white/20">
        <h1 className="text-2xl font-bold text-white text-center mb-1">Change Passcode</h1>
        <p className="text-white/80 text-center mb-6 text-sm">Update your admin passcode securely.</p>
        <form onSubmit={handleChange} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Current passcode</label>
            <input
              className="w-full px-4 py-3 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2E936B]"
              type="password"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">New passcode</label>
            <input
              className="w-full px-4 py-3 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2E936B]"
              type="password"
              value={next}
              onChange={(e) => setNext(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Confirm new passcode</label>
            <input
              className="w-full px-4 py-3 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2E936B]"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>
          {error && <div className="p-3 rounded-xl bg-red-500/20 text-red-50 text-sm text-center">{error}</div>}
          {ok && <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-50 text-sm text-center">{ok}</div>}
          <button
            type="submit"
            className="w-full bg-white text-[#2E936B] font-semibold py-3 rounded-xl hover:bg-gray-50 transition"
          >
            Update Passcode
          </button>
        </form>
        <button
          className="mt-6 w-full text-white/90 hover:text-white text-sm underline underline-offset-4"
          onClick={() => router.push('/admin/login')}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}


