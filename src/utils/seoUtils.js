import siteConfig from '../config/siteConfig.js';

// Update document title and meta tags dynamically
export const updateSEO = (title, description, keywords) => {
  // Update title
  document.title = title || `${siteConfig.siteName} - Social Media Marketing Services`;
  
  // Update meta description
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', description || siteConfig.siteDescription);
  }
  
  // Update meta keywords
  const metaKeywords = document.querySelector('meta[name="keywords"]');
  if (metaKeywords) {
    metaKeywords.setAttribute('content', keywords || siteConfig.siteKeywords);
  }
  
  // Update Open Graph tags
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) {
    ogTitle.setAttribute('content', title || `${siteConfig.siteName} - Social Media Marketing Services`);
  }
  
  const ogDescription = document.querySelector('meta[property="og:description"]');
  if (ogDescription) {
    ogDescription.setAttribute('content', description || siteConfig.siteDescription);
  }
  
  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) {
    ogUrl.setAttribute('content', siteConfig.siteUrl);
  }
};

// Update Google Analytics ID
export const updateAnalytics = () => {
  // Update gtag config
  if (window.gtag) {
    window.gtag('config', siteConfig.googleAnalyticsId);
  }
};