'use client';

import { broadcastAdminLogoutAll, clearAdminAuthentication, getRefreshToken, setUser } from '@/lib/auth';
import { authService, SessionInfo } from '@/services/authService';
import { ApiInfo } from '@/services/healthService';
import { settingsService, SystemSettings } from '@/services/settingsService';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
    FiAlertTriangle,
    FiCheck,
    FiCheckCircle,
    FiExternalLink,
    FiLock,
    FiLogOut,
    FiMapPin,
    FiMonitor,
    FiPower,
    FiSettings,
    FiShield,
    FiUser,
} from 'react-icons/fi';
import { RiTimer2Line } from 'react-icons/ri';

export default function Settings() {
  const [activeTab, setActiveTab] = useState<'account' | 'password' | 'system' | 'security'>('account');
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveState, setSaveState] = useState<'idle' | 'success' | 'error'>('idle');
  
  const [accountData, setAccountData] = useState({
    full_name: '',
    email: '',
    role: '',
    last_login: '',
  });
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [systemSettings, setSystemSettings] = useState<SystemSettings | null>(null);
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
  const [apiInfo, setApiInfo] = useState<ApiInfo | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [user, system, session] = await Promise.all([
        authService.getCurrentUser(),
        settingsService.getSystemSettings().catch(() => null), // System settings might not exist
        authService.getSessionInfo(),
      ]);
      
      setAccountData({
        full_name: user.full_name,
        email: user.email,
        role: user.role || '',
        last_login: '', // Will be shown from session info
      });
      if (system) {
        setSystemSettings(system);
      }
      setSessionInfo(session);
      // API info endpoint doesn't exist yet, so we'll skip it for now
      // setApiInfo(api);
    } catch (err: any) {
      console.error('Failed to load settings:', err);
      setSaveState('error');
    } finally {
      setLoading(false);
    }
  };

  const passwordRequirements = [
    'At least 8 characters long',
    'Include uppercase and lowercase letters',
    'Include at least one number',
    'Include at least one special character',
  ];

  const securityStatus = {
    accessChecks: ['Hidden entry point active', 'Session management enabled', 'Auto-logout configured'],
    recommendations: [
      'Change your password regularly',
      "Don't share admin credentials with others",
      'Always logout when finished',
      'Use incognito mode on shared devices',
    ],
  };

  const tabs = [
    { id: 'account', label: 'Account Info', icon: FiUser },
    { id: 'password', label: 'Password', icon: FiLock },
    { id: 'system', label: 'System', icon: FiSettings },
    { id: 'security', label: 'Security', icon: FiShield },
  ] as const;

  const handleUpdateAccount = async () => {
    setSaving(true);
    setSaveState('idle');
    try {
      const updated = await authService.updateAccount({
        full_name: accountData.full_name,
        email: accountData.email,
      });
      setUser(updated);
      setSaveState('success');
      setTimeout(() => setSaveState('idle'), 3000);
    } catch (err: any) {
      setSaveState('error');
      alert(err.response?.data?.message || 'Failed to update account');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.current_password || !passwordData.new_password || !passwordData.confirm_password) {
      alert('Please fill all password fields.');
      return;
    }
    if (passwordData.new_password !== passwordData.confirm_password) {
      alert('New password and confirm password do not match.');
      return;
    }

    setSaving(true);
    setSaveState('idle');
    try {
      await authService.changePassword({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
        confirm_password: passwordData.confirm_password,
      });
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
      setSaveState('success');
      setTimeout(() => setSaveState('idle'), 3000);
    } catch (err: any) {
      setSaveState('error');
      const errorData = err.response?.data;
      let errorMessage = 'Failed to change password';
      
      if (errorData?.errors) {
        // Handle validation errors
        const errorMessages: string[] = [];
        if (errorData.errors.current_password) {
          errorMessages.push(...(Array.isArray(errorData.errors.current_password) 
            ? errorData.errors.current_password 
            : [errorData.errors.current_password]));
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
      
      alert(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateSystemSettings = async () => {
    if (!systemSettings) return;
    
    setSaving(true);
    setSaveState('idle');
    try {
      // Only send editable fields (session_timeout is the only active field)
      // Commented out fields (site_name, site_url, maintenance_mode, auto_backup, email_notifications) 
      // are not sent to prevent accidental updates
      await settingsService.updateSystemSettings({
        session_timeout: systemSettings.session_timeout,
      });
      
      // Dispatch event to notify AdminLayout to refresh session timeout
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('system-settings-updated', {
          detail: { session_timeout: systemSettings.session_timeout }
        }));
      }
      
      setSaveState('success');
      setTimeout(() => setSaveState('idle'), 3000);
    } catch (err: any) {
      setSaveState('error');
      alert(err.response?.data?.message || 'Failed to update system settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2E936B] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div className="flex-1">
          <h2 className="text-3xl font-bold mb-2" style={{ color: '#343A40' }}>
            Settings
          </h2>
          <p className="text-base" style={{ color: '#6c757d' }}>
            Manage your account and system preferences
          </p>
        </div>
      </div>

      {saveState === 'success' && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          Settings saved successfully.
        </div>
      )}
      {saveState === 'error' && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Failed to save settings. Please try again.
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 lg:px-6 py-4 font-medium text-sm flex items-center gap-2 transition-colors whitespace-nowrap flex-shrink-0 border-b-2 ${
                activeTab === tab.id
                  ? 'bg-white border-[#2E936B] text-[#2E936B]'
                  : 'bg-white border-transparent text-[#343A40] hover:text-[#2E936B] hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span>{tab.label}</span>
            </button>
          ))}
          </div>
        </div>
      </div>

      {activeTab === 'account' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6" style={{ color: '#343A40' }}>
              Account Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
              {[
                { key: 'full_name', label: 'Full Name', type: 'text' },
                { key: 'email', label: 'Email Address', type: 'email' },
                { key: 'role', label: 'Role', type: 'text' },
              ].map((f) => (
                <div key={f.key}>
                <label className="block text-sm font-medium mb-2" style={{ color: '#343A40' }}>
                    {f.label}
                </label>
                <input
                    type={f.type}
                    value={accountData[f.key as keyof typeof accountData]}
                    onChange={(e) => setAccountData({ ...accountData, [f.key]: e.target.value })}
                  className="w-full min-w-0 px-4 py-2 border border-[#ced4da] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E936B] focus:border-transparent"
                  style={{ color: '#343A40' }}
                  disabled={f.key === 'role' || saving}
                />
              </div>
              ))}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#343A40' }}>
                  Last Login
                </label>
                <input
                  type="text"
                  value={accountData.last_login ? new Date(accountData.last_login).toLocaleString() : 'Never'}
                  readOnly
                  className="w-full min-w-0 px-4 py-2 border border-[#ced4da] rounded-lg bg-gray-50"
                  style={{ color: '#343A40' }}
                />
              </div>
            </div>
            <button
              className="w-full sm:w-auto px-6 py-2 bg-[#2E936B] text-white rounded-lg font-semibold text-sm transition-colors hover:bg-[#247556] disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={handleUpdateAccount}
              disabled={saving}
            >
              {saving ? 'Updating...' : 'Update Account'}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'password' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6" style={{ color: '#343A40' }}>
              Change Password
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:gap-5 mb-4 sm:mb-6">
              {[
                { key: 'current_password', label: 'Current Password' },
                { key: 'new_password', label: 'New Password' },
                { key: 'confirm_password', label: 'Confirm New Password' },
              ].map((f, i) => (
                <div key={f.key} className={i === 1 ? 'md:col-span-1' : ''}>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#343A40' }}>
                    {f.label}
                  </label>
                  <input
                    type="password"
                    value={passwordData[f.key as keyof typeof passwordData]}
                    onChange={(e) => setPasswordData({ ...passwordData, [f.key]: e.target.value })}
                    className="w-full min-w-0 px-4 py-2 border border-[#ced4da] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E936B] focus:border-transparent"
                    disabled={saving}
                  />
                </div>
              ))}
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-5 mb-4 sm:mb-6">
              <p className="text-sm font-semibold mb-3" style={{ color: '#1D4ED8' }}>
                Password Requirements:
              </p>
              <ul className="space-y-2">
                {passwordRequirements.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm break-words" style={{ color: '#1D4ED8' }}>
                    <FiCheck className="w-4 h-4 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <button
              className="w-full sm:w-auto px-6 py-2 bg-[#2E936B] text-white rounded-lg font-semibold text-sm transition-colors hover:bg-[#247556] disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={handleChangePassword}
              disabled={saving}
            >
              {saving ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'system' && systemSettings && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6" style={{ color: '#343A40' }}>
              System Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
              {/* Commented out: site_name and site_url - Not used in UI, reserved for future use */}
              {/* {[
                { key: 'site_name', label: 'Site Name', type: 'text' },
                { key: 'site_url', label: 'Site URL', type: 'url' },
              ].map((f) => (
                <div key={f.key}>
                <label className="block text-sm font-medium mb-2 break-words" style={{ color: '#343A40' }}>
                    {f.label}
                </label>
                <input
                    type={f.type}
                    value={systemSettings[f.key as keyof SystemSettings] as string | number}
                    onChange={(e) => setSystemSettings({ 
                      ...systemSettings, 
                      [f.key]: f.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value 
                    })}
                  className="w-full min-w-0 px-4 py-2 border border-[#ced4da] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E936B] focus:border-transparent"
                  disabled={saving}
                />
              </div>
              ))} */}
              
              {/* Session Timeout - Active setting */}
              <div>
                <label className="block text-sm font-medium mb-2 break-words" style={{ color: '#343A40' }}>
                  Session Timeout (minutes)
                </label>
                <input
                  type="number"
                  value={systemSettings.session_timeout}
                  onChange={(e) => setSystemSettings({ 
                    ...systemSettings, 
                    session_timeout: parseInt(e.target.value) || 30 
                  })}
                  className="w-full min-w-0 px-4 py-2 border border-[#ced4da] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E936B] focus:border-transparent"
                  disabled={saving}
                />
              </div>
            </div>
            
            {/* Commented out: maintenance_mode, auto_backup, email_notifications - Not actively used, reserved for future implementation */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
              {[
                { key: 'maintenance_mode', label: 'Maintenance Mode', hint: 'Enable to show maintenance page to visitors' },
                { key: 'auto_backup', label: 'Auto Backup', hint: 'Automatically backup data daily' },
                { key: 'email_notifications', label: 'Email Notifications', hint: 'Receive email notifications for new leads', full: true },
              ].map((f) => (
                <label
                  key={f.key}
                  className={`flex items-start gap-3 p-3 sm:p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors ${
                    f.full ? 'md:col-span-2' : ''
                  }`}
                >
                <input
                  type="checkbox"
                    checked={systemSettings[f.key as keyof SystemSettings] as boolean}
                    onChange={(e) => setSystemSettings({ ...systemSettings, [f.key]: e.target.checked })}
                  className="mt-1 w-5 h-5 rounded border-gray-300 text-[#2E936B] focus:ring-[#2E936B] flex-shrink-0"
                  disabled={saving}
                />
                <div className="min-w-0">
                    <p className="text-sm font-semibold break-words" style={{ color: '#343A40' }}>
                      {f.label}
                    </p>
                    <p className="text-xs break-words" style={{ color: '#6c757d' }}>
                      {f.hint}
                    </p>
                </div>
              </label>
              ))}
            </div> */}
            <button
              className="w-full sm:w-auto px-6 py-2 bg-[#2E936B] text-white rounded-lg font-semibold text-sm transition-colors hover:bg-[#247556] disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={handleUpdateSystemSettings}
              disabled={saving}
            >
              {saving ? 'Updating...' : 'Update Settings'}
            </button>
            
            {apiInfo && (
              <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200">
                <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 break-words" style={{ color: '#343A40' }}>
                  API Information
                </h4>
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4 space-y-2">
                  {apiInfo.name && (
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0 text-sm">
                      <span className="font-medium" style={{ color: '#6c757d' }}>API Name:</span>
                      <span className="break-words sm:text-right" style={{ color: '#343A40' }}>{apiInfo.name}</span>
                    </div>
                  )}
                  {apiInfo.version && (
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0 text-sm">
                      <span className="font-medium" style={{ color: '#6c757d' }}>Version:</span>
                      <span className="break-words sm:text-right" style={{ color: '#343A40' }}>{apiInfo.version}</span>
                    </div>
                  )}
                  {apiInfo.description && (
                    <div className="text-sm">
                      <span className="font-medium break-words" style={{ color: '#6c757d' }}>Description:</span>
                      <p className="mt-1 break-words" style={{ color: '#343A40' }}>{apiInfo.description}</p>
                    </div>
                  )}
                  {apiInfo.documentation_url && (
                    <div className="text-sm">
                      <a
                        href={apiInfo.documentation_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#2E936B] hover:underline flex items-center gap-1 break-words"
                      >
                        View API Documentation
                        <FiExternalLink className="w-3 h-3 flex-shrink-0" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'security' && sessionInfo && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6" style={{ color: '#343A40' }}>
              Security Settings
            </h3>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
              <div className="border border-green-200 rounded-2xl p-4 sm:p-6 bg-green-50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-green-200 text-green-800 flex items-center justify-center flex-shrink-0">
                    <FiShield className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm break-words" style={{ color: '#166534' }}>
                      Admin Access Security
                    </p>
                    <p className="text-xs break-words" style={{ color: '#166534' }}>
                      Admin panel is secured with hidden access and password protection.
                    </p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {securityStatus.accessChecks.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm break-words" style={{ color: '#166534' }}>
                      <FiCheckCircle className="w-4 h-4 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border border-blue-200 rounded-2xl p-4 sm:p-6 bg-blue-50">
                <p className="font-semibold text-sm mb-3 sm:mb-4 break-words" style={{ color: '#1D4ED8' }}>
                  Session Information
                </p>
                <div className="space-y-3 text-sm" style={{ color: '#1D4ED8' }}>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                    <span className="break-words">Status:</span>
                    <span className="font-semibold break-words sm:text-right">{sessionInfo.is_authenticated ? 'Active' : 'Inactive'}</span>
                  </div>
                  {sessionInfo.session_start && (
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                      <span className="flex items-center gap-2 break-words">
                        <RiTimer2Line className="w-4 h-4 flex-shrink-0" />
                        Session Start:
                      </span>
                      <span className="break-words sm:text-right">{new Date(sessionInfo.session_start).toLocaleString()}</span>
                    </div>
                  )}
                  {sessionInfo.last_activity && (
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                      <span className="flex items-center gap-2 break-words">
                        <RiTimer2Line className="w-4 h-4 flex-shrink-0" />
                        Last Activity:
                      </span>
                      <span className="break-words sm:text-right">{new Date(sessionInfo.last_activity).toLocaleString()}</span>
                    </div>
                  )}
                  {sessionInfo.ip_address && (
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                      <span className="flex items-center gap-2 break-words">
                        <FiMapPin className="w-4 h-4 flex-shrink-0" />
                        IP Address:
                      </span>
                      <span className="break-words sm:text-right">{sessionInfo.ip_address}</span>
                    </div>
                  )}
                  {sessionInfo.user_agent && (
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                      <span className="flex items-center gap-2 break-words">
                        <FiMonitor className="w-4 h-4 flex-shrink-0" />
                        User Agent:
                      </span>
                      <span className="text-xs break-words sm:text-right truncate max-w-[150px]" title={sessionInfo.user_agent}>
                        {sessionInfo.user_agent}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="border border-orange-200 rounded-2xl p-4 sm:p-6 bg-orange-50">
                <p className="font-semibold text-sm mb-3 sm:mb-4 break-words" style={{ color: '#9A3412' }}>
                  Security Recommendations
                </p>
                <ul className="space-y-2 text-sm" style={{ color: '#9A3412' }}>
                  {securityStatus.recommendations.map((item) => (
                    <li key={item} className="flex items-start gap-2 break-words">
                      <FiAlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                className="flex-1 px-6 py-2 border border-[#dc2626] text-[#dc2626] rounded-lg font-semibold text-sm transition-colors hover:bg-[#fee2e2] flex items-center justify-center gap-2"
                onClick={async () => {
                  try {
                    const refreshToken = getRefreshToken();
                    if (refreshToken) {
                      await authService.logout(refreshToken);
                    }
                  } catch (err) {
                    console.error('Logout error:', err);
                  } finally {
                    broadcastAdminLogoutAll();
                    router.replace('/admin/login');
                  }
                }}
              >
                <FiLogOut className="w-4 h-4" />
                Logout All Sessions
              </button>
              <button
                className="flex-1 px-6 py-2 border border-[#F97316] text-[#F97316] rounded-lg font-semibold text-sm transition-colors hover:bg-[#ffedd5] flex items-center justify-center gap-2"
                onClick={async () => {
                  try {
                    const refreshToken = getRefreshToken();
                    if (refreshToken) {
                      await authService.logout(refreshToken);
                    }
                  } catch (err) {
                    console.error('Logout error:', err);
                  } finally {
                    clearAdminAuthentication();
                    router.replace('/admin/login');
                  }
                }}
              >
                <FiPower className="w-4 h-4" />
                Logout Current Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
