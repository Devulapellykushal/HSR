'use client';

import { useContactSettings } from '@/hooks/useContactSettings';
import { useProjectsAPI } from '@/hooks/useProjectsAPI';
import { buildWhatsAppLink, sanitizePhoneNumber } from '@/lib/contactStore';
import { leadsService } from '@/services/leadsService';
import { pageHeroImagesService } from '@/services/pageHeroImagesService';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const CONTACT_FORM_STORAGE_KEY = 'hsr_contact_form_draft';

export default function ContactPage() {
  const [messageLength, setMessageLength] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  
  // Load form data from localStorage on mount
  const [formData, setFormData] = useState(() => {
    if (typeof window === 'undefined') {
      return { name: '', phone: '', email: '', project: '', message: '' };
    }
    try {
      const saved = localStorage.getItem(CONTACT_FORM_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          name: parsed.name || '',
          phone: parsed.phone || '',
          email: parsed.email || '',
          project: parsed.project || '',
          message: parsed.message || '',
        };
      }
    } catch (error) {
      console.error('Error loading saved form data:', error);
    }
    return { name: '', phone: '', email: '', project: '', message: '' };
  });

  const { projects } = useProjectsAPI();
  const contact = useContactSettings();
  
  const DEFAULT_HERO_BG = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop';
  const [heroBg, setHeroBg] = useState<string>(DEFAULT_HERO_BG);

  // Save form data to localStorage on change (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem(CONTACT_FORM_STORAGE_KEY, JSON.stringify(formData));
      } catch (error) {
        console.error('Error saving form data:', error);
      }
    }, 500); // Debounce: save 500ms after last change
    
    return () => clearTimeout(timeoutId);
  }, [formData]);

  useEffect(() => {
    const fetchHeroImage = async () => {
      try {
        const images = await pageHeroImagesService.getPageHeroImages();
        if (images.contact_hero_image_url) {
          setHeroBg(images.contact_hero_image_url);
        }
      } catch (error) {
        console.error('Failed to load contact hero image:', error);
        // Keep default image on error
      }
    };
    fetchHeroImage();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'message') {
      setMessageLength(value.length);
    }
  };
  
  // Clear saved form data after successful submission
  const clearSavedFormData = () => {
    try {
      localStorage.removeItem(CONTACT_FORM_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing saved form data:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This will be handled by WhatsApp button
  };

  // Function to convert technical error messages to user-friendly ones
  const getUserFriendlyErrorMessage = (error: any): string => {
    // Network/Connection errors
    if (!error.response) {
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        return 'The request took too long. Please check your internet connection and try again.';
      }
      if (error.message?.includes('Network Error') || error.code === 'ERR_NETWORK') {
        return 'Unable to connect to the server. Please check your internet connection and try again.';
      }
      return 'Unable to submit your inquiry. Please check your internet connection and try again.';
    }

    const status = error.response?.status;
    
    // Server errors (500, 502, 503, etc.)
    if (status >= 500) {
      return 'Our server is temporarily unavailable. Please try again in a few moments. If the problem persists, please contact us directly.';
    }

    // Unauthorized/Authentication errors
    if (status === 401 || status === 403) {
      return 'There was an authentication issue. Please refresh the page and try again.';
    }

    // Not Found errors
    if (status === 404) {
      return 'The requested service was not found. Please refresh the page and try again.';
    }

    // Bad Request errors (400) - Validation errors
    if (status === 400 && error.response?.data?.errors) {
      const errors = error.response.data.errors;
      const friendlyMessages: string[] = [];

      // Handle field-specific errors
      if (errors.phone) {
        const phoneError = Array.isArray(errors.phone) ? errors.phone[0] : errors.phone;
        if (phoneError?.includes('Invalid phone number format') || phoneError?.includes('regex')) {
          friendlyMessages.push('Please enter a valid phone number with 9 to 15 digits. You can optionally start with + or country code (e.g., +91 9876543210).');
        } else if (phoneError?.includes('required')) {
          friendlyMessages.push('Phone number is required.');
        } else if (phoneError?.includes('blank') || phoneError?.includes('null')) {
          friendlyMessages.push('Please enter your phone number.');
        } else {
          friendlyMessages.push(`Phone number: ${phoneError}`);
        }
      }

      if (errors.email) {
        const emailError = Array.isArray(errors.email) ? errors.email[0] : errors.email;
        if (emailError?.includes('valid') || emailError?.includes('format') || emailError?.includes('Enter a valid')) {
          friendlyMessages.push('Please enter a valid email address (e.g., yourname@example.com).');
        } else if (emailError?.includes('required')) {
          friendlyMessages.push('Email address is required.');
        } else if (emailError?.includes('blank') || emailError?.includes('null')) {
          friendlyMessages.push('Please enter your email address.');
        } else {
          friendlyMessages.push(`Email: ${emailError}`);
        }
      }

      if (errors.name) {
        const nameError = Array.isArray(errors.name) ? errors.name[0] : errors.name;
        if (nameError?.includes('required')) {
          friendlyMessages.push('Full name is required.');
        } else if (nameError?.includes('blank') || nameError?.includes('null')) {
          friendlyMessages.push('Please enter your full name.');
        } else {
          friendlyMessages.push(`Name: ${nameError}`);
        }
      }

      if (errors.message) {
        const messageError = Array.isArray(errors.message) ? errors.message[0] : errors.message;
        if (messageError?.includes('required')) {
          friendlyMessages.push('Message is required. Please tell us about your requirements.');
        } else if (messageError?.includes('blank') || messageError?.includes('null')) {
          friendlyMessages.push('Please enter your message.');
        } else {
          friendlyMessages.push(`Message: ${messageError}`);
        }
      }

      if (errors.project_id) {
        const projectError = Array.isArray(errors.project_id) ? errors.project_id[0] : errors.project_id;
        if (projectError?.includes('not found') || projectError?.includes('does not exist')) {
          friendlyMessages.push('The selected project was not found. Please select a valid project from the list.');
        } else if (projectError?.includes('deleted')) {
          friendlyMessages.push('The selected project is no longer available. Please select a different project.');
        } else {
          friendlyMessages.push(`Project: ${projectError}`);
        }
      }

      // Handle non-field errors
      if (errors.non_field_errors) {
        const nonFieldErrors = Array.isArray(errors.non_field_errors) 
          ? errors.non_field_errors 
          : [errors.non_field_errors];
        friendlyMessages.push(...nonFieldErrors);
      }

      // Handle any other field errors
      Object.keys(errors).forEach((key) => {
        if (!['phone', 'email', 'name', 'message', 'project_id', 'non_field_errors'].includes(key)) {
          const fieldError = Array.isArray(errors[key]) ? errors[key][0] : errors[key];
          const fieldLabel = key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
          friendlyMessages.push(`${fieldLabel}: ${fieldError}`);
        }
      });

      if (friendlyMessages.length > 0) {
        return friendlyMessages.length === 1 
          ? friendlyMessages[0] 
          : `Please correct the following:\n\n${friendlyMessages.map((msg, idx) => `${idx + 1}. ${msg}`).join('\n')}`;
      }
    }

    // Default error message from backend
    if (error.response?.data?.message) {
      return error.response.data.message;
    }

    // Fallback message
    return 'We encountered an issue while submitting your inquiry. Please check all fields and try again. If the problem continues, please contact us directly via phone or WhatsApp.';
  };

  // Prevent duplicate submissions
  const handleWhatsAppSubmit = async () => {
    // Prevent duplicate submissions
    if (isSubmitting) {
      return;
    }

    // Validate required fields
    if (!formData.name || !formData.phone || !formData.email || !formData.project || !formData.message) {
      setSubmitStatus('error');
      setSubmitMessage('Please fill in all required fields marked with * (Name, Phone, Email, Project, and Message).');
      setTimeout(() => setSubmitStatus('idle'), 4000);
      return;
    }

    // Validate phone number format (matches backend regex: ^\+?1?\d{9,15}$)
    const phoneRegex = /^\+?1?\d{9,15}$/;
    const cleanPhone = formData.phone.replace(/\s/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      setSubmitStatus('error');
      setSubmitMessage('Please enter a valid phone number with 9 to 15 digits. You can optionally start with + or country code (e.g., +91 9876543210).');
      setTimeout(() => setSubmitStatus('idle'), 5000);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmitMessage('');

    try {
      // Get project ID
      const selectedProject = projects.find((p) => p.slug === formData.project);
      
      // Create lead in database first
      // Remove spaces from phone number before sending (already cleaned above)
      await leadsService.createLead({
        name: formData.name,
        email: formData.email,
        phone: cleanPhone,
        project_id: selectedProject?.id || null,
        message: formData.message,
        source: 'contact_form',
      });

      // Get project name for WhatsApp message
      const projectName = selectedProject?.title || formData.project;

      // Format message for WhatsApp
      const whatsappMessage = `*Contact Form Inquiry*

*Name:* ${formData.name}
*Phone:* ${formData.phone}
*Email:* ${formData.email}
*Interested Project:* ${projectName}

*Message:*
${formData.message}`;

      // Reset form on success and clear saved data
      setFormData({
        name: '',
        phone: '',
        email: '',
        project: '',
        message: '',
      });
      setMessageLength(0);
      clearSavedFormData();

      // Open WhatsApp if configured
      if (contact.whatsapp.enabled && contact.whatsapp.number) {
        const whatsappLink = buildWhatsAppLink(contact.whatsapp.number);
        const encodedMessage = encodeURIComponent(whatsappMessage);
        const fullLink = `${whatsappLink}?text=${encodedMessage}`;
        window.open(fullLink, '_blank', 'noopener,noreferrer');
        
        setSubmitStatus('success');
        setSubmitMessage('Thank you! Your inquiry has been submitted successfully. Opening WhatsApp...');
      } else {
        setSubmitStatus('success');
        setSubmitMessage('Thank you! Your inquiry has been submitted successfully. We will contact you soon.');
      }

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
        setSubmitMessage('');
      }, 5000);
    } catch (error: any) {
      console.error('Failed to submit contact form:', error);
      setSubmitStatus('error');
      
      // Get user-friendly error message
      const errorMessage = getUserFriendlyErrorMessage(error);
      setSubmitMessage(errorMessage);
      
      // Clear error message after appropriate duration (longer for multi-line errors)
      const messageDuration = errorMessage.includes('\n') ? 10000 : 7000;
      setTimeout(() => {
        setSubmitStatus('idle');
        setSubmitMessage('');
      }, messageDuration);
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqs = [
    {
      question: 'What is the booking process for HSR Green Homes projects?',
      answer:
        'Our booking process is simple and transparent. Contact us to schedule a site visit, choose your preferred unit, complete the documentation, and make the booking amount. Our team will guide you through each step.',
    },
    {
      question: 'Are all projects RERA approved?',
      answer:
        'Yes, all our projects are RERA approved and registered. We provide complete RERA documentation and ensure full compliance with all regulatory requirements.',
    },
    {
      question: 'What are the payment options available?',
      answer:
        'We offer flexible payment plans including construction-linked plans, time-linked plans, and bank loan assistance. Our team will help you choose the best payment option that suits your needs.',
    },
    {
      question: 'Do you provide home loan assistance?',
      answer:
        'Yes, we have tie-ups with leading banks and financial institutions to provide home loan assistance at competitive interest rates. Our team will help you with the loan application process.',
    },
    {
      question: 'What is the typical timeline for project completion?',
      answer:
        'Project timelines vary based on the size and complexity. Typically, our residential projects are completed within 24-36 months from the start of construction. We maintain strict adherence to delivery schedules.',
    },
  ];

  const addressLine = [
    contact.address.streetAddress,
    contact.address.area,
    contact.address.city,
    contact.address.state,
    contact.address.pincode,
    contact.address.country,
  ]
    .filter(Boolean)
    .join(', ');
  const directionsLink = addressLine ? `https://maps.google.com/?q=${encodeURIComponent(addressLine)}` : '#';
  const whatsappLink =
    contact.whatsapp.enabled && contact.whatsapp.number
      ? buildWhatsAppLink(contact.whatsapp.number)
      : '';
  const primaryDigits = sanitizePhoneNumber(contact.phones.primaryPhone);
  const callLink = primaryDigits ? `tel:+${primaryDigits}` : '';
  const infoEmailLink = contact.email.infoEmail ? `mailto:${contact.email.infoEmail}` : '';
  const mapEmbedSrc = contact.address.googleEmbedCode;

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[50vh] sm:min-h-[60vh] md:min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={heroBg || DEFAULT_HERO_BG}
            alt="Get in Touch"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 md:py-16 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif mb-3 sm:mb-4 md:mb-6 text-white leading-tight">
            Get in <span className="text-[#2E936B]">Touch</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-white max-w-2xl mx-auto font-sans leading-relaxed px-2">
            Ready to find your dream home? Contact our expert team for personalized
            assistance and detailed project information.
          </p>
        </div>
      </section>

      {/* Contact Cards Section */}
      <section className="py-10 sm:py-12 md:py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Visit Our Office Card */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-[#E8F5EF] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#2E936B]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-3 text-gray-900">Visit Our Office</h3>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">{addressLine}</p>
              <Link
                href={directionsLink || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-[#2E936B] hover:bg-[#247556] text-white rounded-lg font-semibold text-sm transition-colors"
              >
                Get Directions
              </Link>
            </div>

            {/* Call Us Card */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-[#E8F5EF] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#2E936B]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-3 text-gray-900">Call Us</h3>
              <p className="text-sm text-gray-600 mb-1">{contact.phones.primaryPhone}</p>
              <p className="text-xs text-gray-500 mb-4">{contact.phones.businessHours}</p>
              {callLink && (
                <Link
                  href={callLink}
                  className="inline-block px-4 py-2 bg-[#2E936B] hover:bg-[#247556] text-white rounded-lg font-semibold text-sm transition-colors"
                >
                  Call Now
                </Link>
              )}
            </div>

            {/* WhatsApp Card */}
            {contact.whatsapp.enabled && (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="w-16 h-16 bg-[#E8F5EF] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#2E936B]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-3 text-gray-900">WhatsApp</h3>
                <p className="text-sm text-gray-600 mb-1">{contact.whatsapp.businessHours}</p>
                <p className="text-xs text-gray-500 mb-4">{contact.whatsapp.autoReply}</p>
                {whatsappLink && (
                  <Link
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 bg-[#2E936B] hover:bg-[#247556] text-white rounded-lg font-semibold text-sm transition-colors"
                  >
                    Chat Now
                  </Link>
                )}
              </div>
            )}

            {/* Email Us Card */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-[#E8F5EF] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-[#2E936B]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-3 text-gray-900">Email Us</h3>
              <p className="text-sm text-gray-600 mb-1">{contact.email.infoEmail}</p>
              <p className="text-xs text-gray-500 mb-4">We reply within 24 hours</p>
              {infoEmailLink && (
                <Link
                  href={infoEmailLink}
                  className="inline-block px-4 py-2 bg-[#2E936B] hover:bg-[#247556] text-white rounded-lg font-semibold text-sm transition-colors"
                >
                  Send Email
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form and Map Section */}
      <section className="py-10 sm:py-12 md:py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-gray-900">
                Send us a Message
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mb-6 leading-relaxed">
                Fill out the form below and our team will get back to you within 24 hours
                with detailed information about our projects.
              </p>
              
              {/* Submit Status Messages */}
              {submitStatus === 'success' && (
                <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  {submitMessage}
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 whitespace-pre-line">
                  {submitMessage}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E936B] focus:border-transparent outline-none transition-colors"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number (e.g., +91 9876543210)"
                    pattern="^\+?1?\d{9,15}$"
                    title="Phone number must be 9-15 digits, optionally starting with + or 1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E936B] focus:border-transparent outline-none transition-colors"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E936B] focus:border-transparent outline-none transition-colors"
                  />
                </div>
                <div>
                  <label
                    htmlFor="project"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Interested Project <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="project"
                    name="project"
                    required
                    value={formData.project}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E936B] focus:border-transparent outline-none transition-colors"
                  >
                    <option value="">Select a project</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.slug}>
                        {project.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    maxLength={500}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us about your requirements..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E936B] focus:border-transparent outline-none transition-colors resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1 text-right">
                    {messageLength}/500 characters
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleWhatsAppSubmit}
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 bg-[#25D366] hover:bg-[#20BA5A] disabled:bg-[#20BA5A] disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-lg font-semibold text-base transition-colors shadow-lg flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                      </svg>
                      <span>Send via WhatsApp</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Office Location and Map */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-gray-900">
                Visit Our Office
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mb-6 leading-relaxed">
                Come visit our office in Karimnagar to discuss your requirements in person
                and view our project models.
              </p>
              <div className="mb-6">
                <div className="relative w-full h-64 sm:h-80 md:h-96 rounded-lg overflow-hidden shadow-lg">
                  <iframe
                    src={mapEmbedSrc}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0"
                  />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold mb-4 text-gray-900">Office Hours</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span className="font-medium">Primary Line</span>
                    <span>{contact.phones.businessHours}</span>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-4">
                    For immediate assistance outside office hours, contact us via
                    WhatsApp.
                  </p>
                  {whatsappLink && (
                    <Link
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#2E936B] hover:bg-[#247556] text-white rounded-lg font-semibold text-sm transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                      </svg>
                      WhatsApp Support
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section (currently disabled as per requirement) */}
      {/*
      <section className="py-10 sm:py-12 md:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-3 text-gray-900">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-gray-600 text-center mb-8 max-w-2xl mx-auto">
            Quick answers to common questions about our projects and services
          </p>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
              >
                <h3 className="text-lg font-bold mb-3 text-gray-900">{faq.question}</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      */}
    </>
  );
}
