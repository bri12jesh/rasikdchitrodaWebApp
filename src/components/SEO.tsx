import React from 'react';
import { Helmet } from 'react-helmet-async';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  noindex?: boolean;
  schema?: Record<string, any> | Array<Record<string, any>>;
}

const DEFAULT_TITLE = "Rasik D Chitroda Furniture | No 1 Furniture Manufacturer, School Benches & Office Furniture in Gujarat";
const DEFAULT_DESCRIPTION = "Rasik D Chitroda Furniture is Gujarat's premier furniture manufacturer & contractor since 2016. Specializing in durable School Benches, School Furniture, Office Furniture, Hospital Furniture & Institutional Interiors in Ahmedabad & Gandhinagar.";
const DEFAULT_KEYWORDS = "Furniture, School Benches, Hospital Furniture, Office Furniture, Best Furniture, School Furniture, Interior, No 1 furniture, Ahmedabad, Gujarat, Gandhinagar, Library Furniture, Laboratory Furniture, Rasik D Chitroda";
const SITE_URL = "https://officefurnitureonline.in";
const DEFAULT_OG_IMAGE = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200";

export default function SEO({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  noindex = false,
  schema
}: SEOProps) {
  const fullTitle = title.includes("Rasik D Chitroda") ? title : `${title} | Rasik D Chitroda Furniture`;
  
  // Format canonical url
  const canonicalUrl = canonical 
    ? (canonical.startsWith("http") ? canonical : `${SITE_URL}${canonical.startsWith("/") ? "" : "/"}${canonical}`)
    : undefined;

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph / Facebook / WhatsApp */}
      <meta property="og:site_name" content="Rasik D Chitroda Furniture" />
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Structured Data (JSON-LD) */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}

