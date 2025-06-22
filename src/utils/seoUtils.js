import siteConfig from '../config/siteConfig.js';

// Update document title and meta tags dynamically
export const updateSEO = (title, description, keywords, imageUrl) => {
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

  // Update Open Graph image
  const ogImage = document.querySelector('meta[property="og:image"]');
  if (ogImage && imageUrl) {
    ogImage.setAttribute('content', imageUrl);
  }

  // Update Twitter Card image
  const twitterImage = document.querySelector('meta[name="twitter:image"]');
  if (twitterImage && imageUrl) {
    twitterImage.setAttribute('content', imageUrl);
  }
};

// Update Google Analytics ID
export const updateAnalytics = () => {
  // Update gtag config
  if (window.gtag) {
    window.gtag('config', siteConfig.googleAnalyticsId);
  }
};

// Generate dynamic social preview for specific pages
export const updatePageSEO = (pageType, data = {}) => {
  switch (pageType) {
    case 'service':
      updateSEO(
        `${data.name} Services - ${siteConfig.siteName}`,
        `Get real ${data.name} ${data.description} at lowest prices. Fast delivery, 24/7 support.`,
        `${data.name.toLowerCase()}, social media marketing, ${siteConfig.siteKeywords}`,
        `${siteConfig.siteUrl}/social-preview.jpg`
      );
      break;
    
    case 'purchase':
      updateSEO(
        `${data.title} - ${siteConfig.siteName}`,
        `Purchase ${data.title} for just ₹${data.price}. ${data.description}`,
        `${data.title.toLowerCase()}, buy followers, social media services`,
        `${siteConfig.siteUrl}/social-preview.jpg`
      );
      break;
    
    default:
      updateSEO();
      break;
  }
};