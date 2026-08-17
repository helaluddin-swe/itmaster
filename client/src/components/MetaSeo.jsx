import React from "react";
import { Helmet } from "react-helmet-async";

const MetaSeo = ({ seoData, contentHeader, articleBody }) => {
  const title = seoData?.title_tag || "BCS Preparation | DestinationBCS";
  const description = seoData?.meta_description || "বিসিএস প্রস্তুতির পূর্ণাঙ্গ গাইড।";
  const keywords = seoData?.focus_keywords?.join(", ") || "";
  const canonicalUrl = seoData?.canonical_url || (typeof window !== "undefined" ? window.location.href : "");
  
  // Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": seoData?.schema_type || "EducationalArticle",
    "headline": title,
    "description": description,
    "author": {
      "@type": "Organization",
      "name": "DestinationBCS",
      "url": "https://bcs-mu.vercel.app"
    },
    "datePublished": articleBody?.createdAt,
    "dateModified": contentHeader?.last_updated ? new Date(contentHeader.last_updated).toISOString() : new Date().toISOString(),
    "articleSection": contentHeader?.subject || "General Knowledge"
  };

  return (
    <Helmet>
      <title>{title.slice(0,76)}</title>
      <meta name="description" content={description.slice(0,155)} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Social Media - Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="article" />
      <meta property="og:image" content="https://bcs-mu.vercel.app/og-image.jpg" />

      {/* Structured Data Implementation */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>
    </Helmet>
  );
};

export default MetaSeo;