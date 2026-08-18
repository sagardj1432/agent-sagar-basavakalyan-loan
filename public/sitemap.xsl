<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" 
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
      <head>
        <title>XML Sitemap | Agent Sagar Basavakalyan Loans</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style type="text/css">
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #0f172a;
            background-color: #f8fafc;
            margin: 0;
            padding: 30px 20px;
          }
          .container {
            max-width: 960px;
            margin: 0 auto;
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            padding: 32px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          }
          .header {
            border-bottom: 2px solid #f1f5f9;
            padding-bottom: 20px;
            margin-bottom: 24px;
          }
          h1 {
            color: #ea580c;
            font-size: 24px;
            margin: 0 0 8px 0;
            font-weight: 800;
          }
          p {
            color: #64748b;
            font-size: 14px;
            margin: 0;
            line-height: 1.5;
          }
          .badge {
            display: inline-block;
            background: #ffedd5;
            color: #ea580c;
            font-size: 12px;
            font-weight: 700;
            padding: 4px 10px;
            border-radius: 9999px;
            margin-bottom: 12px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 16px;
            font-size: 13px;
          }
          th {
            background-color: #0f172a;
            color: #ffffff;
            text-align: left;
            padding: 12px 14px;
            font-weight: 600;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
          }
          td {
            padding: 12px 14px;
            border-bottom: 1px solid #e2e8f0;
            color: #334155;
          }
          tr:hover td {
            background-color: #f8fafc;
          }
          a {
            color: #ea580c;
            text-decoration: none;
            font-weight: 600;
            word-break: break-all;
          }
          a:hover {
            text-decoration: underline;
          }
          .count-box {
            margin-top: 20px;
            font-size: 13px;
            color: #64748b;
            text-align: right;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <span class="badge">Official XML Sitemap</span>
            <h1>Agent Sagar – Basavakalyan Loan Services</h1>
            <p>This is a standard XML Sitemap generated for search engines like Google, Bing, and Yahoo. It lists all public, crawlable loan service pages.</p>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width: 55%;">URL Address</th>
                <th style="width: 15%;">Priority</th>
                <th style="width: 15%;">Change Frequency</th>
                <th style="width: 15%;">Last Modified</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="sitemap:urlset/sitemap:url">
                <tr>
                  <td>
                    <a href="{sitemap:loc}">
                      <xsl:value-of select="sitemap:loc"/>
                    </a>
                  </td>
                  <td><strong><xsl:value-of select="sitemap:priority"/></strong></td>
                  <td><xsl:value-of select="sitemap:changefreq"/></td>
                  <td><xsl:value-of select="sitemap:lastmod"/></td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>

          <div class="count-box">
            Total URLs indexed: <strong style="color: #0f172a;"><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></strong>
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
