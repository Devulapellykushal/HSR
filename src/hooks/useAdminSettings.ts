'use client';

import { useEffect, useState } from 'react';
import {
  AdminSettings,
  getAdminSettings,
  subscribeToAdminSettings,
} from '@/lib/adminSettingsStore';

export function useAdminSettings() {
  const [settings, setSettings] = useState<AdminSettings>(getAdminSettings());

  useEffect(() => {
    setSettings(getAdminSettings());
    const unsubscribe = subscribeToAdminSettings((next) => setSettings(next));
    return unsubscribe;
  }, []);

  return settings;
}


