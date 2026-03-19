import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, keywords }) {
  const siteTitle = 'ShareBite - Connect Surplus Food with Those in Need';
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  
  const defaultDescription = 'ShareBite is a platform designed to seamlessly connect food donors, NGOs, and volunteers to minimize food waste and feed communities.';
  const defaultKeywords = 'food donation, zero food waste, volunteer, NGO, charity, help community';

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={keywords || defaultKeywords} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      {/* Open Graph Meta Tags for Social Media */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={window.location.href} />
      <meta property="og:site_name" content="ShareBite" />
      <meta property="og:image" content="/images/og-image.jpg" /> {/* Replace with actual image Path */}
      
      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content="/images/og-image.jpg" />
    </Helmet>
  );
}
