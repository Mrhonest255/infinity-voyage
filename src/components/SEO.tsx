import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  noIndex?: boolean;
  structuredData?: object;
}

const DEFAULT_IMAGE = 'https://infinityvoyagetours.com/og-image.jpg';
const SITE_NAME = 'Infinity Voyage Tours & Safaris';
const BASE_URL = 'https://infinityvoyagetours.com';

/**
 * SEO Component - Updates document head with meta tags for better SEO
 * Use this component on every page to set unique titles, descriptions, and meta tags
 */
export const SEO = ({
  title,
  description,
  keywords,
  image = DEFAULT_IMAGE,
  url,
  type = 'website',
  noIndex = false,
  structuredData,
}: SEOProps) => {
  useEffect(() => {
    // Update document title
    const fullTitle = title.includes(SITE_NAME) 
      ? title 
      : `${title} | ${SITE_NAME}`;
    document.title = fullTitle;

    // Helper function to update or create meta tags
    const setMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Basic meta tags
    setMetaTag('description', description);
    if (keywords) {
      setMetaTag('keywords', keywords);
    }
    
    // Robots
    setMetaTag('robots', noIndex ? 'noindex, nofollow' : 'index, follow');

    // Open Graph
    setMetaTag('og:title', fullTitle, true);
    setMetaTag('og:description', description, true);
    setMetaTag('og:image', image, true);
    setMetaTag('og:type', type, true);
    setMetaTag('og:site_name', SITE_NAME, true);
    if (url) {
      setMetaTag('og:url', url.startsWith('http') ? url : `${BASE_URL}${url}`, true);
    }

    // Twitter Card
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', fullTitle);
    setMetaTag('twitter:description', description);
    setMetaTag('twitter:image', image);

    // Canonical URL
    if (url) {
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', url.startsWith('http') ? url : `${BASE_URL}${url}`);
    }

    // Structured Data
    if (structuredData) {
      // Remove existing dynamic structured data
      const existingScript = document.querySelector('script[data-dynamic-schema="true"]');
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-dynamic-schema', 'true');
      script.text = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }

    // Cleanup function
    return () => {
      // Remove dynamic structured data on unmount
      const dynamicScript = document.querySelector('script[data-dynamic-schema="true"]');
      if (dynamicScript) {
        dynamicScript.remove();
      }
    };
  }, [title, description, keywords, image, url, type, noIndex, structuredData]);

  return null; // This component doesn't render anything
};

/**
 * Generate TouristTrip structured data for tour pages
 */
export const generateTourSchema = (tour: {
  title: string;
  description: string;
  price?: number;
  currency?: string;
  duration?: string;
  image?: string;
  highlights?: string[];
  included?: string[];
  url: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "TouristTrip",
  "name": tour.title,
  "description": tour.description,
  "image": tour.image || DEFAULT_IMAGE,
  "touristType": "Adventure Tourist",
  "tourBookingPage": `${BASE_URL}${tour.url}`,
  "provider": {
    "@type": "TravelAgency",
    "name": SITE_NAME,
    "url": BASE_URL,
    "telephone": "+255758241294",
    "email": "info@infinityvoyagetours.com"
  },
  ...(tour.price && {
    "offers": {
      "@type": "Offer",
      "price": tour.price.toString(),
      "priceCurrency": tour.currency || "USD",
      "availability": "https://schema.org/InStock",
      "validFrom": new Date().toISOString().split('T')[0]
    }
  }),
  ...(tour.duration && { "duration": tour.duration }),
  ...(tour.highlights && {
    "includesAttraction": tour.highlights.map(h => ({
      "@type": "TouristAttraction",
      "name": h
    }))
  }),
  ...(tour.included && {
    "amenityFeature": tour.included.map(i => ({
      "@type": "LocationFeatureSpecification",
      "name": i
    }))
  })
});

/**
 * Generate Product structured data for transfer services
 */
export const generateTransferSchema = (transfer: {
  title: string;
  description: string;
  priceSmall?: number;
  priceLarge?: number;
  routeFrom: string;
  routeTo: string;
  duration?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  "name": transfer.title,
  "description": transfer.description,
  "category": "Airport Transfer Service",
  "brand": {
    "@type": "Brand",
    "name": SITE_NAME
  },
  "offers": {
    "@type": "AggregateOffer",
    "lowPrice": transfer.priceSmall?.toString() || "25",
    "highPrice": transfer.priceLarge?.toString() || "100",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "offerCount": "2"
  },
  "areaServed": {
    "@type": "Place",
    "name": `${transfer.routeFrom} to ${transfer.routeTo}`
  }
});

/**
 * SEO Keywords organized by page/topic
 */
export const SEO_KEYWORDS = {
  home: "Tanzania safari, Serengeti safari, Zanzibar tours, Kilimanjaro trekking, African safari, wildlife tours, Tanzania travel, best Tanzania tour operator, safari booking Tanzania",
  
  safaris: "Tanzania safari packages, Serengeti game drive, Ngorongoro crater safari, Tarangire national park, Lake Manyara safari, big five safari, great migration safari, balloon safari Serengeti, luxury safari Tanzania, budget safari Tanzania, family safari, honeymoon safari Tanzania",
  
  zanzibar: "Zanzibar excursions, Stone Town tour, spice tour Zanzibar, prison island tour, dolphin tour Zanzibar, Nakupenda sandbank, Jozani forest tour, Mnemba island snorkeling, Safari Blue, sunset cruise Zanzibar, Zanzibar beach holiday, Zanzibar island hopping",
  
  transfers: "Zanzibar airport transfer, airport pickup Zanzibar, Stone Town transfer, beach hotel transfer, Nungwi transfer, Paje transfer, Kendwa transfer, private car Zanzibar, taxi Zanzibar airport",
  
  kilimanjaro: "Kilimanjaro climbing, Mount Kilimanjaro trek, Kilimanjaro routes, Machame route, Marangu route, Lemosho route, Kilimanjaro summit, climb Africa highest peak",
  
  prices: "Tanzania safari prices, cheap safari Tanzania, affordable safari packages, Zanzibar tour prices, safari cost Tanzania, budget travel Tanzania"
};

export default SEO;
