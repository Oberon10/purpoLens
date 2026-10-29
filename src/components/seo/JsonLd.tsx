import React from 'react';

export default function JsonLd() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'PURPO Creative Agency',
    alternateName: 'PURPO Studios',
    image: 'https://purpo.vercel.app/images/purpo-logo.png',
    '@id': 'https://purpo.vercel.app',
    url: 'https://purpo.vercel.app',
    telephone: '+2348133802278',
    priceRange: '$$$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '27, Ijaoye Street, Jibowu',
      addressLocality: 'Yaba',
      addressRegion: 'Lagos State',
      postalCode: '101212',
      addressCountry: 'NG',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 6.5173,
      longitude: 3.3718,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '08:00',
        closes: '20:00',
      },
    ],
    sameAs: [
      'https://www.instagram.com/purpolens',
      'https://www.youtube.com',
      'https://vimeo.com',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Creative Agency Production Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Videography & Commercial Production in Lagos',
            description:
              'Full-scale cinema production for commercials, documentaries, and events in Nigeria.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Professional Video Editing & Color Grading',
            description:
              'High-end post-production, DaVinci Resolve color grading, motion graphics, and sound design.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Viral Content Creation (Reels & TikTok)',
            description:
              'High-retention vertical video engineered for algorithmic engagement and conversion.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Social Media Management & Strategy',
            description:
              'Comprehensive audience growth, content calendaring, and social distribution.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Brand Strategy & Growth Consulting',
            description:
              'Brand positioning, creative direction audits, and visual identity development.',
          },
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
