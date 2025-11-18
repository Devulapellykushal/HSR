'use client';

import { contactSettingsService, ContactSettings } from '@/services/contactSettingsService';
import { invalidateContactSettingsCache } from '@/hooks/useContactSettings';
import { useEffect, useState } from 'react';
import { FiMail, FiMapPin, FiPhone, FiSend, FiShare2, FiAlertCircle } from 'react-icons/fi';

interface FieldErrors {
  [key: string]: string[];
}

export default function ContactSettingsPage() {
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'phone' | 'email' | 'address' | 'social'>('whatsapp');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveState, setSaveState] = useState<'idle' | 'success' | 'error'>('idle');
  const [settings, setSettings] = useState<ContactSettings | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await contactSettingsService.getContactSettings();
      setSettings(data);
    } catch (err: any) {
      console.error('Failed to load contact settings:', err);
      setSaveState('error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;
    
    // Clear previous errors
    setFieldErrors({});
    setErrorMessage('');
    setSaving(true);
    setSaveState('idle');
    
    try {
      await contactSettingsService.updateContactSettings(settings);
      // Invalidate cache so frontend immediately reflects changes
      invalidateContactSettingsCache();
      setSaveState('success');
      setTimeout(() => setSaveState('idle'), 3000);
    } catch (err: any) {
      console.error('Failed to save contact settings:', err);
      setSaveState('error');
      
      const errorData = err.response?.data;
      if (errorData?.errors) {
        // Parse field-specific errors
        const errors: FieldErrors = {};
        Object.keys(errorData.errors).forEach((field) => {
          const fieldError = errorData.errors[field];
          errors[field] = Array.isArray(fieldError) ? fieldError : [fieldError];
        });
        setFieldErrors(errors);
        
        // Set general error message
        const errorMessages: string[] = [];
        Object.keys(errors).forEach((field) => {
          const fieldLabel = field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          errors[field].forEach((msg) => {
            errorMessages.push(`${fieldLabel}: ${msg}`);
          });
        });
        setErrorMessage(errorMessages.length > 0 
          ? errorMessages.join('. ') 
          : errorData.message || 'Failed to save contact settings. Please check the form for errors.');
      } else {
        setErrorMessage(errorData?.message || 'Failed to save contact settings. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof ContactSettings, value: any) => {
    if (!settings) return;
    setSettings({ ...settings, [field]: value });
    // Clear error for this field when user starts typing
    if (fieldErrors[field]) {
      const newErrors = { ...fieldErrors };
      delete newErrors[field];
      setFieldErrors(newErrors);
      if (Object.keys(newErrors).length === 0) {
        setErrorMessage('');
      }
    }
  };

  const getFieldError = (fieldName: string): string | undefined => {
    return fieldErrors[fieldName]?.[0];
  };

  const hasFieldError = (fieldName: string): boolean => {
    return !!fieldErrors[fieldName];
  };

  const tabs = [
    { id: 'whatsapp', label: 'WhatsApp', icon: FiSend },
    { id: 'phone', label: 'Phone Numbers', icon: FiPhone },
    { id: 'email', label: 'Email Settings', icon: FiMail },
    { id: 'address', label: 'Address & Map', icon: FiMapPin },
    { id: 'social', label: 'Social Media', icon: FiShare2 },
  ] as const;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2E936B] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading contact settings...</p>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Failed to load contact settings. Please refresh the page.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div className="flex-1">
          <h2 className="text-3xl font-bold mb-2" style={{ color: '#343A40' }}>
            Contact Settings
          </h2>
          <p className="text-base" style={{ color: '#6c757d' }}>
            Manage contact information and communication settings
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full sm:w-auto px-4 py-2 bg-[#2E936B] text-white rounded-lg font-semibold text-sm transition-colors hover:bg-[#247556] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed flex-shrink-0"
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
          </svg>
          <span className="whitespace-nowrap">{saving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>

      {saveState === 'success' && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          Contact settings saved successfully.
        </div>
      )}
      {saveState === 'error' && errorMessage && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <div className="flex items-start gap-2">
            <FiAlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold mb-1">Failed to save contact settings</p>
              <p className="text-sm">{errorMessage}</p>
            </div>
          </div>
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

      {activeTab === 'whatsapp' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-bold break-words" style={{ color: '#343A40' }}>
                WhatsApp Configuration
              </h3>
              <label className="flex items-center gap-2 cursor-pointer flex-shrink-0">
                <span className="text-sm font-medium whitespace-nowrap" style={{ color: '#343A40' }}>
                  Enable WhatsApp Integration
                </span>
                <input
                  type="checkbox"
                  checked={settings.whatsapp_enabled}
                  onChange={(e) => updateField('whatsapp_enabled', e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-[#2E936B] focus:ring-[#2E936B] flex-shrink-0"
                />
              </label>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#343A40' }}>
                  WhatsApp Number
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  value={settings.whatsapp_number}
                  onChange={(e) => updateField('whatsapp_number', e.target.value)}
                  className={`w-full min-w-0 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E936B] focus:border-transparent bg-gray-50 ${
                    hasFieldError('whatsapp_number') ? 'border-red-300 focus:ring-red-500' : 'border-[#ced4da]'
                  }`}
                  style={{ color: '#343A40' }}
                  placeholder="+91 9876543210"
                />
                {getFieldError('whatsapp_number') && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
                    {getFieldError('whatsapp_number')}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#343A40' }}>
                  Business Hours
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  value={settings.whatsapp_business_hours}
                  onChange={(e) => updateField('whatsapp_business_hours', e.target.value)}
                  className={`w-full min-w-0 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E936B] focus:border-transparent bg-gray-50 ${
                    hasFieldError('whatsapp_business_hours') ? 'border-red-300 focus:ring-red-500' : 'border-[#ced4da]'
                  }`}
                  style={{ color: '#343A40' }}
                  placeholder="9:00 AM - 8:00 PM"
                />
                {getFieldError('whatsapp_business_hours') && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
                    {getFieldError('whatsapp_business_hours')}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#343A40' }}>
                  Auto Reply Message
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <textarea
                  value={settings.whatsapp_auto_reply}
                  onChange={(e) => updateField('whatsapp_auto_reply', e.target.value)}
                  rows={4}
                  className={`w-full min-w-0 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E936B] focus:border-transparent bg-gray-50 resize-y ${
                    hasFieldError('whatsapp_auto_reply') ? 'border-red-300 focus:ring-red-500' : 'border-[#ced4da]'
                  }`}
                  style={{ color: '#343A40' }}
                  placeholder="Hello! Thank you for contacting HSR Green Homes. We will get back to you shortly."
                />
                {getFieldError('whatsapp_auto_reply') && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
                    {getFieldError('whatsapp_auto_reply')}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'phone' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6" style={{ color: '#343A40' }}>
              Phone Numbers
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {[
                { key: 'primary_phone', label: 'Primary Phone', required: true },
                { key: 'secondary_phone', label: 'Secondary Phone', required: false },
                { key: 'toll_free_number', label: 'Toll Free Number', required: false },
                { key: 'phone_business_hours', label: 'Business Hours', required: true },
              ].map((f) => {
                const fieldKey = f.key as keyof ContactSettings;
                const error = getFieldError(f.key);
                const hasError = hasFieldError(f.key);
                
                return (
                  <div key={f.key}>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#343A40' }}>
                      {f.label}
                      {f.required && <span className="text-red-500 ml-1">*</span>}
                      {!f.required && <span className="text-gray-400 font-normal ml-1">(Optional)</span>}
                    </label>
                    <input
                      type="text"
                      value={settings[fieldKey] as string || ''}
                      onChange={(e) => updateField(fieldKey, e.target.value)}
                      className={`w-full min-w-0 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E936B] focus:border-transparent bg-gray-50 ${
                        hasError ? 'border-red-300 focus:ring-red-500' : 'border-[#ced4da]'
                      }`}
                      style={{ color: '#343A40' }}
                    />
                    {error && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
                        {error}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'email' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6" style={{ color: '#343A40' }}>
              Email Configuration
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {[
                { key: 'info_email', label: 'Info Email', type: 'email' },
                { key: 'sales_email', label: 'Sales Email', type: 'email' },
                { key: 'support_email', label: 'Support Email', type: 'email' },
              ].map((f) => {
                const fieldKey = f.key as keyof ContactSettings;
                const error = getFieldError(f.key);
                const hasError = hasFieldError(f.key);
                
                return (
                  <div key={f.key}>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#343A40' }}>
                      {f.label}
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type={f.type}
                      value={settings[fieldKey] as string}
                      onChange={(e) => updateField(fieldKey, e.target.value)}
                      className={`w-full min-w-0 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E936B] focus:border-transparent bg-gray-50 ${
                        hasError ? 'border-red-300 focus:ring-red-500' : 'border-[#ced4da]'
                      }`}
                      style={{ color: '#343A40' }}
                      placeholder={`${f.label.toLowerCase()}@example.com`}
                    />
                    {error && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
                        {error}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="border border-gray-200 rounded-lg p-4 sm:p-6 bg-gray-50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
                <h4 className="text-base sm:text-lg font-semibold break-words" style={{ color: '#343A40' }}>
                  Auto Reply Settings
                </h4>
                <label className="flex items-center gap-2 cursor-pointer flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={settings.email_auto_reply_enabled}
                    onChange={(e) => updateField('email_auto_reply_enabled', e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-[#2E936B] focus:ring-[#2E936B] flex-shrink-0"
                  />
                  <span className="text-sm font-medium whitespace-nowrap" style={{ color: '#343A40' }}>
                    Enable Auto Reply
                  </span>
                </label>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#343A40' }}>
                    Auto Reply Subject
                    {settings.email_auto_reply_enabled && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  <input
                    type="text"
                    value={settings.email_auto_reply_subject}
                    onChange={(e) => updateField('email_auto_reply_subject', e.target.value)}
                    className={`w-full min-w-0 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E936B] focus:border-transparent bg-white ${
                      hasFieldError('email_auto_reply_subject') ? 'border-red-300 focus:ring-red-500' : 'border-[#ced4da]'
                    }`}
                    style={{ color: '#343A40' }}
                    disabled={!settings.email_auto_reply_enabled}
                    placeholder="Thank you for contacting HSR Green Homes"
                  />
                  {getFieldError('email_auto_reply_subject') && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
                      {getFieldError('email_auto_reply_subject')}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#343A40' }}>
                    Auto Reply Message
                    {settings.email_auto_reply_enabled && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  <textarea
                    rows={4}
                    value={settings.email_auto_reply_message}
                    onChange={(e) => updateField('email_auto_reply_message', e.target.value)}
                    className={`w-full min-w-0 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E936B] focus:border-transparent bg-white resize-y ${
                      hasFieldError('email_auto_reply_message') ? 'border-red-300 focus:ring-red-500' : 'border-[#ced4da]'
                    }`}
                    style={{ color: '#343A40' }}
                    disabled={!settings.email_auto_reply_enabled}
                    placeholder="We have received your inquiry and will respond within 24 hours."
                  />
                  {getFieldError('email_auto_reply_message') && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
                      {getFieldError('email_auto_reply_message')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'address' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6" style={{ color: '#343A40' }}>
              Office Address & Map
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
              {[
                { key: 'street_address', label: 'Street Address', required: true },
                { key: 'area', label: 'Area / Locality', required: true },
                { key: 'city', label: 'City', required: true },
                { key: 'state', label: 'State', required: true },
                { key: 'pincode', label: 'Pincode', required: true },
                { key: 'country', label: 'Country', required: true },
              ].map((f) => {
                const fieldKey = f.key as keyof ContactSettings;
                const error = getFieldError(f.key);
                const hasError = hasFieldError(f.key);
                
                return (
                  <div key={f.key}>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#343A40' }}>
                      {f.label}
                      {f.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <input
                      type="text"
                      value={settings[fieldKey] as string}
                      onChange={(e) => updateField(fieldKey, e.target.value)}
                      className={`w-full min-w-0 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E936B] focus:border-transparent bg-gray-50 ${
                        hasError ? 'border-red-300 focus:ring-red-500' : 'border-[#ced4da]'
                      }`}
                      style={{ color: '#343A40' }}
                    />
                    {error && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
                        {error}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#343A40' }}>
                Google Maps Embed Code
                <span className="text-gray-400 font-normal ml-1">(Optional)</span>
              </label>
              <textarea
                rows={3}
                value={settings.google_maps_embed_code || ''}
                onChange={(e) => updateField('google_maps_embed_code', e.target.value)}
                className={`w-full min-w-0 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E936B] focus:border-transparent bg-gray-50 resize-y ${
                  hasFieldError('google_maps_embed_code') ? 'border-red-300 focus:ring-red-500' : 'border-[#ced4da]'
                }`}
                style={{ color: '#343A40' }}
                placeholder="Paste your Google Maps embed code or URL here"
              />
              {getFieldError('google_maps_embed_code') && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
                  {getFieldError('google_maps_embed_code')}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'social' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6" style={{ color: '#343A40' }}>
              Social Media Links
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              All social media links are optional. Leave blank if you don't have a profile on that platform.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {[
                { 
                  key: 'facebook_url', 
                  label: 'Facebook Page', 
                  type: 'url',
                  hint: 'Example: https://www.facebook.com/yourpage',
                  placeholder: 'https://www.facebook.com/yourpage'
                },
                { 
                  key: 'instagram_url', 
                  label: 'Instagram Profile', 
                  type: 'url',
                  hint: 'Example: https://www.instagram.com/yourprofile',
                  placeholder: 'https://www.instagram.com/yourprofile'
                },
                { 
                  key: 'twitter_url', 
                  label: 'Twitter/X Profile', 
                  type: 'url',
                  hint: 'Example: https://twitter.com/yourprofile or https://x.com/yourprofile',
                  placeholder: 'https://twitter.com/yourprofile'
                },
                { 
                  key: 'linkedin_url', 
                  label: 'LinkedIn Company', 
                  type: 'url',
                  hint: 'Example: https://www.linkedin.com/company/yourcompany',
                  placeholder: 'https://www.linkedin.com/company/yourcompany'
                },
              ].map((f) => {
                const fieldKey = f.key as keyof ContactSettings;
                const error = getFieldError(f.key);
                const hasError = hasFieldError(f.key);
                
                return (
                  <div key={f.key}>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#343A40' }}>
                      {f.label}
                      <span className="text-gray-400 font-normal ml-1">(Optional)</span>
                    </label>
                    <input
                      type={f.type}
                      value={settings[fieldKey] as string || ''}
                      onChange={(e) => updateField(fieldKey, e.target.value)}
                      placeholder={f.placeholder}
                      className={`w-full min-w-0 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E936B] focus:border-transparent bg-gray-50 ${
                        hasError ? 'border-red-300 focus:ring-red-500' : 'border-[#ced4da]'
                      }`}
                      style={{ color: '#343A40' }}
                    />
                    {error && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
                        {error}
                      </p>
                    )}
                    {!error && f.hint && (
                      <p className="mt-1 text-xs text-gray-500">{f.hint}</p>
                    )}
                  </div>
                );
              })}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2" style={{ color: '#343A40' }}>
                  YouTube Channel
                  <span className="text-gray-400 font-normal ml-1">(Optional)</span>
                </label>
                <input
                  type="url"
                  value={settings.youtube_url || ''}
                  onChange={(e) => updateField('youtube_url', e.target.value)}
                  placeholder="https://www.youtube.com/@yourchannel"
                  className={`w-full min-w-0 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E936B] focus:border-transparent bg-gray-50 ${
                    hasFieldError('youtube_url') ? 'border-red-300 focus:ring-red-500' : 'border-[#ced4da]'
                  }`}
                  style={{ color: '#343A40' }}
                />
                {getFieldError('youtube_url') && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
                    {getFieldError('youtube_url')}
                  </p>
                )}
                {!getFieldError('youtube_url') && (
                  <p className="mt-1 text-xs text-gray-500">
                    Example: https://www.youtube.com/@yourchannel or https://www.youtube.com/c/yourchannel
                  </p>
                )}
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> URLs must start with http:// or https:// and include the full domain (e.g., facebook.com, instagram.com). 
                If you only have a partial URL, leave the field empty.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
