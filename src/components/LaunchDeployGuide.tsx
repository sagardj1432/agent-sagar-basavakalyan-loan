import React, { useState } from 'react';
import { Rocket, Globe, Server, Smartphone, Search, Copy, Check, ExternalLink, Code, ShieldCheck, FileCode } from 'lucide-react';

export const LaunchDeployGuide: React.FC = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://basavakalyanloans.in/</loc>
    <lastmod>2026-08-07</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://basavakalyanloans.in/personal-loan-basavakalyan</loc>
    <lastmod>2026-08-07</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://basavakalyanloans.in/home-loan-basavakalyan</loc>
    <lastmod>2026-08-07</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://basavakalyanloans.in/gold-loan-basavakalyan</loc>
    <lastmod>2026-08-07</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://basavakalyanloans.in/business-loan-basavakalyan</loc>
    <lastmod>2026-08-07</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://basavakalyanloans.in/agriculture-loan-basavakalyan</loc>
    <lastmod>2026-08-07</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://basavakalyanloans.in/credit-card-basavakalyan</loc>
    <lastmod>2026-08-07</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`;

  const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin

Sitemap: https://basavakalyanloans.in/sitemap.xml`;

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-8 shadow-sm space-y-3 relative overflow-hidden">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-vermillion-light border border-vermillion-light text-vermillion text-xs font-bold">
            <Rocket className="w-4 h-4 text-vermillion" />
            <span>Launch Checklist</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Launch, Custom Domain & Google Search Console Guide
          </h1>
          <p className="text-slate-700 text-xs sm:text-sm max-w-3xl leading-relaxed font-normal">
            Follow these simple steps to point your custom domain (e.g., <code className="text-vermillion font-bold font-mono">basavakalyanloans.in</code>), deploy production builds on Vercel / Cloud Run, and verify your sitemap in Google Search Console.
          </p>
        </div>

        {/* Launch Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Step 1: Connect Custom Domain */}
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-vermillion text-white font-black rounded-xl flex items-center justify-center text-lg shadow-xs">
                1
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-vermillion" />
                  <span>Connect Custom Domain</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium">DNS settings for your registrar (GoDaddy, Namecheap, etc.)</p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs space-y-3 font-medium">
              <p className="text-slate-800 font-bold">Add the following DNS records in your domain manager:</p>

              <div className="space-y-2 font-mono text-[11px]">
                <div className="bg-white p-3 rounded-xl border border-slate-200 flex justify-between items-center shadow-xs">
                  <div>
                    <span className="text-vermillion font-bold">A Record:</span> <br />
                    Host: <span className="text-slate-900 font-bold">@</span> | Value: <span className="text-slate-900 font-bold">76.76.21.21</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard('76.76.21.21', 'dns-a')}
                    className="p-1.5 text-slate-700 hover:text-slate-900 bg-slate-100 rounded-lg cursor-pointer"
                  >
                    {copiedSection === 'dns-a' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200 flex justify-between items-center shadow-xs">
                  <div>
                    <span className="text-vermillion font-bold">CNAME Record:</span> <br />
                    Host: <span className="text-slate-900 font-bold">www</span> | Value: <span className="text-slate-900 font-bold">cname.vercel-dns.com</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard('cname.vercel-dns.com', 'dns-cname')}
                    className="p-1.5 text-slate-700 hover:text-slate-900 bg-slate-100 rounded-lg cursor-pointer"
                  >
                    {copiedSection === 'dns-cname' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Deploy on Vercel / Cloud Run */}
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-600 text-white font-black rounded-xl flex items-center justify-center text-lg shadow-xs">
                2
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Server className="w-5 h-5 text-emerald-600" />
                  <span>Deploy on Vercel or Cloud Run</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium">One-click deployment with server bundle</p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs space-y-3 font-medium">
              <p className="text-slate-800">
                1. Connect your GitHub repository to Vercel or Google Cloud Run.
              </p>
              <p className="text-slate-800">
                2. Set Build Command: <code className="text-vermillion font-bold font-mono">npm run build</code>
              </p>
              <p className="text-slate-800">
                3. Set Output Directory: <code className="text-vermillion font-bold font-mono">dist</code>
              </p>
            </div>
          </div>

          {/* Step 3: Google Search Console & Sitemap */}
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 space-y-4 md:col-span-2 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-900 text-white font-black rounded-xl flex items-center justify-center text-lg shadow-xs">
                3
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Search className="w-5 h-5 text-vermillion" />
                  <span>Google Search Console & Sitemap</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium">Submit sitemap.xml to index Basavakalyan Loan keywords on Google</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Sitemap.xml */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-extrabold text-vermillion flex items-center gap-1">
                    <FileCode className="w-3.5 h-3.5" /> sitemap.xml
                  </span>
                  <button
                    onClick={() => copyToClipboard(sitemapXml, 'sitemap')}
                    className="text-[11px] font-bold text-slate-800 hover:text-vermillion flex items-center gap-1 cursor-pointer"
                  >
                    {copiedSection === 'sitemap' ? 'Copied!' : 'Copy XML'}
                  </button>
                </div>
                <pre className="text-[10px] text-slate-800 overflow-x-auto max-h-40 p-3 bg-white border border-slate-200 rounded-xl font-mono">
                  {sitemapXml}
                </pre>
              </div>

              {/* Robots.txt */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-extrabold text-emerald-700 flex items-center gap-1">
                    <Code className="w-3.5 h-3.5" /> robots.txt
                  </span>
                  <button
                    onClick={() => copyToClipboard(robotsTxt, 'robots')}
                    className="text-[11px] font-bold text-slate-800 hover:text-vermillion flex items-center gap-1 cursor-pointer"
                  >
                    {copiedSection === 'robots' ? 'Copied!' : 'Copy Text'}
                  </button>
                </div>
                <pre className="text-[10px] text-slate-800 overflow-x-auto max-h-40 p-3 bg-white border border-slate-200 rounded-xl font-mono">
                  {robotsTxt}
                </pre>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
