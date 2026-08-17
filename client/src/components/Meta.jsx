import React from "react";
import { Helmet } from "react-helmet-async";

const Meta = ({ title = "Default Title", description = "", keywords = "" }) => {
  // Safe check for window to avoid build errors
  const canonicalUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <Helmet>
      <title>{title.slice(0, 60)}</title>
      <meta name="description" content={description.slice(0, 155)} />
      <meta name="keywords" content={keywords} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
    </Helmet>
  );
};

export default Meta