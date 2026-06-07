'use client'

import { useEffect, useState } from 'react';
import { contactSettingsAPI } from '../services/api';

interface ContactSettings {
  email: string;
  enquiryEmail: string;
  address: string;
  phoneNumbers: string[];
  instagram?: string;
  twitter?: string;
  linkedin?: string;
}

export function SEOSchemas() {
  const [contactSettings, setContactSettings] = useState<ContactSettings | null>(null);

  useEffect(() => {
    const loadContactSettings = async () => {
      try {
        const response = await contactSettingsAPI.getContactSettings();
        if (response.success && response.settings) {
          setContactSettings({
            ...response.settings,
            phoneNumbers: response.settings.phoneNumbers || []
          });
        }
      } catch (error) {
        console.error('Failed to load contact settings for SEO:', error);
      }
    };

    loadContactSettings();
  }, []);

  useEffect(() => {
    if (!contactSettings) return;

    const SITE_URL = 'https://stint.digital';
    const phoneNumbers = contactSettings.phoneNumbers || [];

    // Create dynamic organization schema with contact info
    const organizationSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'STINT',
      alternateName: 'STINT Digital',
      url: SITE_URL,
      logo: `${SITE_URL}/stint-logo.png`,
      description:
        'A digital product and software studio specialising in web, mobile, custom software, backend, and cloud development.',
      email: contactSettings.email || 'contact@stint.digital',
      ...(phoneNumbers.length > 0 && {
        telephone: phoneNumbers
      }),
      ...(contactSettings.address && {
        address: {
          '@type': 'PostalAddress',
          streetAddress: contactSettings.address
        }
      }),
      contactPoint: {
        '@type': 'ContactPoint',
        email: contactSettings.enquiryEmail || contactSettings.email || 'contact@stint.digital',
        ...(phoneNumbers.length > 0 && {
          telephone: phoneNumbers[0]
        }),
        contactType: 'customer support',
        availableLanguage: ['English'],
      },
      sameAs: [
        contactSettings.twitter || 'https://x.com/stintbuild',
        contactSettings.instagram || 'https://www.instagram.com/stint.7',
        contactSettings.linkedin,
        'https://github.com/BuildWithStint',
      ].filter(Boolean),
    };

    // Create local business schema if address is available
    const localBusinessSchema = contactSettings.address ? {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'STINT',
      url: SITE_URL,
      image: `${SITE_URL}/stint-logo.png`,
      email: contactSettings.email,
      ...(phoneNumbers.length > 0 && {
        telephone: phoneNumbers
      }),
      address: {
        '@type': 'PostalAddress',
        streetAddress: contactSettings.address
      },
      priceRange: '$$',
      areaServed: 'Worldwide',
      serviceType: [
        'Web Development',
        'Mobile App Development',
        'Custom Software Development',
        'Backend & API Development',
        'Cloud & DevOps',
      ],
    } : null;

    // Remove existing dynamic schemas
    const existingSchemas = document.querySelectorAll('script[data-schema="dynamic"]');
    existingSchemas.forEach(schema => schema.remove());

    // Add updated organization schema
    const orgScript = document.createElement('script');
    orgScript.type = 'application/ld+json';
    orgScript.setAttribute('data-schema', 'dynamic');
    orgScript.textContent = JSON.stringify(organizationSchema);
    document.head.appendChild(orgScript);

    // Add local business schema if available
    if (localBusinessSchema) {
      const localScript = document.createElement('script');
      localScript.type = 'application/ld+json';
      localScript.setAttribute('data-schema', 'dynamic');
      localScript.textContent = JSON.stringify(localBusinessSchema);
      document.head.appendChild(localScript);
    }

    return () => {
      // Cleanup on unmount
      const schemas = document.querySelectorAll('script[data-schema="dynamic"]');
      schemas.forEach(schema => schema.remove());
    };
  }, [contactSettings]);

  return null; // This component doesn't render anything visible
}