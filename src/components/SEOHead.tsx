import React, { useEffect } from 'react';
import { LOAN_CATEGORIES } from '../data/loansData';

interface SEOHeadProps {
  activeView: 'home' | 'loan-detail' | 'admin';
  activeSlug?: string;
}

export const SEOHead: React.FC<SEOHeadProps> = ({ activeView, activeSlug }) => {
  useEffect(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://ais-pre-s75e7ejq57dngfif4wimrm-41532079685.asia-southeast1.run.app';
    
    let title = 'Agent Sagar - Basavakalyan Loan Services | Personal, Home, Gold, Business & Agri Loans';
    let description = 'Official Agent Sagar Basavakalyan Loan Services. Instant approval on Personal Loans, Home Loans, Gold Loans, Business Loans, Agriculture Loans & Credit Cards with dedicated local doorstep support in Basavakalyan (585327).';
    let canonicalUrl = `${origin}/`;
    let ogTitle = title;
    let ogDescription = description;
    let jsonLdData: any = null;

    if (activeView === 'home') {
      title = 'Agent Sagar - Basavakalyan Loan Services | Personal, Home, Gold & Business Loans';
      description = 'Official Agent Sagar Basavakalyan Loan Services. Instant approval on Personal Loans, Home Loans, Gold Loans, Business Loans, Agriculture Loans & Credit Cards with dedicated local doorstep support in Basavakalyan (585327).';
      canonicalUrl = `${origin}/`;
      ogTitle = 'Agent Sagar - Basavakalyan Loan Services | Instant Loan Sanction';
      ogDescription = 'Leading loan assistance agency in Basavakalyan. Compare low interest rates on Personal, Home, Gold, Business & Agriculture loans with fast local approval.';
      
      jsonLdData = {
        "@context": "https://schema.org",
        "@type": ["FinancialService", "LocalBusiness"],
        "name": "Agent Sagar - Basavakalyan Loan Services",
        "telephone": "+919632636718",
        "email": "sagardj1432@gmail.com",
        "url": canonicalUrl,
        "priceRange": "₹ - ₹₹₹₹",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Near Reliance Mart, Main Road",
          "addressLocality": "Basavakalyan",
          "addressRegion": "Karnataka",
          "postalCode": "585327",
          "addressCountry": "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 17.8744,
          "longitude": 76.9504
        },
        "areaServed": "Basavakalyan"
      };
    } else if (activeView === 'loan-detail') {
      const category = LOAN_CATEGORIES.find(c => c.slug === activeSlug) || LOAN_CATEGORIES[0];
      title = `${category.seoTitle} | Agent Sagar Basavakalyan`;
      description = category.seoDescription;
      canonicalUrl = `${origin}/${category.slug}`;
      ogTitle = category.seoTitle;
      ogDescription = category.seoDescription;

      jsonLdData = {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": `${origin}/`
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": category.title,
                "item": canonicalUrl
              }
            ]
          },
          {
            "@type": "FinancialProduct",
            "name": category.seoTitle,
            "description": category.seoDescription,
            "provider": {
              "@type": "FinancialService",
              "name": "Agent Sagar - Basavakalyan Loan Services",
              "telephone": "+919632636718",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Near Reliance Mart, Main Road",
                "addressLocality": "Basavakalyan",
                "addressRegion": "Karnataka",
                "postalCode": "585327",
                "addressCountry": "IN"
              }
            },
            "areaServed": "Basavakalyan",
            "annualPercentageRate": category.minRate,
            "amount": {
              "@type": "MonetaryAmount",
              "currency": "INR",
              "maxValue": category.maxAmount
            }
          },
          {
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": `How quickly can I get a ${category.title} approved in Basavakalyan?`,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": `In most cases, initial approval for ${category.title} in Basavakalyan is provided within 12 to 24 hours. Gold Loans are disbursed in spot cash within 15 minutes.`
                }
              },
              {
                "@type": "Question",
                "name": `What is the starting interest rate for ${category.title}?`,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": `Our rates start as low as ${category.minRate}. Exact interest rate depends on your income profile, repayment history, or collateral.`
                }
              },
              {
                "@type": "Question",
                "name": `What documents are required for ${category.title}?`,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": `Primary documents required are Aadhaar Card, PAN Card, passport photographs, address proof, and basic income records (bank statements / Pahani for farmers).`
                }
              }
            ]
          }
        ]
      };
    } else if (activeView === 'admin') {
      title = 'Admin Management Portal | Basavakalyan Loan Services';
      description = 'Secure administrative portal for Basavakalyan Loan Services lead management.';
      canonicalUrl = `${origin}/admin`;
    }

    // 1. Update Document Title
    document.title = title;

    // 2. Helper to update or create meta tags
    const updateMeta = (selector: string, attrName: string, attrVal: string, contentVal: string) => {
      let elem = document.querySelector(selector) as HTMLMetaElement | null;
      if (!elem) {
        elem = document.createElement('meta');
        elem.setAttribute(attrName, attrVal);
        document.head.appendChild(elem);
      }
      elem.setAttribute('content', contentVal);
    };

    // 3. Update Meta Description and Keywords
    updateMeta('meta[name="description"]', 'name', 'description', description);
    updateMeta('meta[property="og:title"]', 'property', 'og:title', ogTitle);
    updateMeta('meta[property="og:description"]', 'property', 'og:description', ogDescription);
    updateMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    updateMeta('meta[name="twitter:title"]', 'name', 'twitter:title', ogTitle);
    updateMeta('meta[name="twitter:description"]', 'name', 'twitter:description', ogDescription);

    // 4. Update or create Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // 5. Update Dynamic Schema.org JSON-LD in head
    let dynamicSchema = document.getElementById('dynamic-page-schema') as HTMLScriptElement | null;
    if (jsonLdData) {
      if (!dynamicSchema) {
        dynamicSchema = document.createElement('script');
        dynamicSchema.id = 'dynamic-page-schema';
        dynamicSchema.type = 'application/ld+json';
        document.head.appendChild(dynamicSchema);
      }
      dynamicSchema.textContent = JSON.stringify(jsonLdData);
    } else if (dynamicSchema) {
      dynamicSchema.remove();
    }
  }, [activeView, activeSlug]);

  return null;
};
