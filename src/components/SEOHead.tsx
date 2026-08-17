import React, { useEffect } from 'react';
import { LOAN_CATEGORIES } from '../data/loansData';

interface SEOHeadProps {
  activeView: 'home' | 'loan-detail' | 'admin';
  activeSlug?: string;
}

export const SEOHead: React.FC<SEOHeadProps> = ({ activeView, activeSlug }) => {
  useEffect(() => {
    const origin = typeof window !== 'undefined' && window.location.origin && !window.location.origin.includes('localhost') && !window.location.origin.includes('run.app')
      ? window.location.origin 
      : 'https://agent-sagar-basavakalyan-loan.vercel.app';
    
    let title = 'Loans in Basavakalyan | Personal, Home & Business Loans';
    let description = 'Get loan assistance in Basavakalyan, Bidar, Karnataka for personal, home, business, vehicle, gold, mortgage and agriculture loans. Submit your enquiry today.';
    let canonicalUrl = `${origin}/`;
    let ogTitle = title;
    let ogDescription = description;
    let jsonLdData: any = null;

    if (activeView === 'home') {
      title = 'Loans in Basavakalyan | Personal, Home & Business Loans';
      description = 'Get loan assistance in Basavakalyan, Bidar, Karnataka for personal, home, business, vehicle, gold, mortgage and agriculture loans. Submit your enquiry today.';
      canonicalUrl = `${origin}/`;
      ogTitle = 'Loan Services in Basavakalyan, Bidar, Karnataka | Agent Sagar';
      ogDescription = 'Official local loan assistance in Basavakalyan. Compare low interest rates and get fast documentation guidance for personal, housing, gold, business, vehicle, and kisan loans.';
      
      jsonLdData = {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebSite",
            "@id": `${origin}/#website`,
            "url": `${origin}/`,
            "name": "Agent Sagar – Basavakalyan Loan Assistance",
            "description": description,
            "publisher": {
              "@id": `${origin}/#localbusiness`
            }
          },
          {
            "@type": ["FinancialService", "LocalBusiness"],
            "@id": `${origin}/#localbusiness`,
            "name": "Agent Sagar – Basavakalyan Loan Assistance",
            "telephone": "+919632636718",
            "email": "sagardj1432@gmail.com",
            "url": `${origin}/`,
            "priceRange": "₹₹",
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
            "openingHoursSpecification": [
              {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                "opens": "09:00",
                "closes": "19:30"
              }
            ],
            "areaServed": [
              {
                "@type": "AdministrativeArea",
                "name": "Basavakalyan"
              },
              {
                "@type": "AdministrativeArea",
                "name": "Bidar District"
              },
              {
                "@type": "AdministrativeArea",
                "name": "Karnataka"
              }
            ]
          },
          {
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What loan services are available in Basavakalyan?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Assistance is available for Personal Loans, Home Loans, Business Loans, Vehicle Loans, Gold Loans, Mortgage Loans (LAP), Agriculture Loans, and Credit Cards across Basavakalyan, Bidar district, Karnataka."
                }
              },
              {
                "@type": "Question",
                "name": "How can I submit a loan enquiry in Basavakalyan?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Submit your enquiry via the online form with your name and mobile number, call +91 96326 36718, or send a message on WhatsApp for immediate consultation."
                }
              },
              {
                "@type": "Question",
                "name": "What documents may be required for a loan in Basavakalyan?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Documents vary depending on the lender and loan type. Common documents include Aadhaar Card, PAN Card, bank statements, income proof (salary slips or business ITR/GST), and land or property records where applicable."
                }
              },
              {
                "@type": "Question",
                "name": "Can business owners and shopkeepers in Basavakalyan apply?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, local shopkeepers, merchants, traders, and small business owners in Basavakalyan can submit enquiries for unsecured working capital and business expansion loans."
                }
              }
            ]
          }
        ]
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
