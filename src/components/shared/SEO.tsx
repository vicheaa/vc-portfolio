import React from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article";
}

// Default SEO keywords for Vichea's portfolio
const DEFAULT_KEYWORDS = [
  "Vichea",
  "Saro Sereyvichea",
  "SARO SEREYVICHEA",
  "Serey Vichea",
  "សារូ សិរីវិជ្ជា",
  "Full Stack Developer",
  "Web Developer",
  "Software Engineer",
  "Cambodia Developer",
  "Phnom Penh Developer",
  "React Developer",
  "TypeScript Developer",
  "Portfolio",
];

const SITE_NAME = "Saro Sereyvichea | Vichea";
const DEFAULT_DESCRIPTION =
  "Saro Sereyvichea (សារូ សិរីវិជ្ជា) - Full Stack Developer from Cambodia. Building beautiful web applications and sharing knowledge through writing.";

export const SEO: React.FC<SEOProps> = ({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = [],
  image = "/og-image.jpg",
  url = typeof window !== "undefined" ? window.location.href : "",
  type = "website",
}) => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const allKeywords = [...DEFAULT_KEYWORDS, ...keywords];

  return (
    <>
      {/* Basic metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={allKeywords.join(", ")} />
      <meta name="author" content="Saro Sereyvichea" />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:creator" content="@vichea" />
    </>
  );
};
