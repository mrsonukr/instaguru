// Site Configuration - Change everything from here
const siteConfig = {
  // Website Information
  siteName: "InstaGuru",
  siteDescription: "Get real followers, subscribers & OTT subscriptions at the lowest prices. Trusted by thousands for Instagram, YouTube, Facebook and more.",
  siteKeywords: "social media marketing, instagram followers, youtube subscribers, facebook likes, social media services",
  siteUrl: "https://instaguru.shop",
  
  // Contact Information
  supportEmail: "help@instaguru.shop",
  supportPhone: "+91 74930 28113",
  whatsappNumber: "917493028113",
  
  // Payment Configuration - Multiple UPI IDs
  upiIds: [
    "mrsonukr@ybl",
    "instaguru@slice", 
    "akbar3815@amazonpay",
  ],
  minimumAmount: 30,
  maximumAmount: 2500,
  
  // Analytics
  googleAnalyticsId: "G-C7CC3P7X8Z",
  
  // Banners - Add or remove banners here
  banners: [
    {
      id: 1,
      src: "/banner/banner-1.webp",
      alt: "Banner 1",
      width: 1000,
      height: 367
    },
    {
      id: 2,
      src: "/banner/banner-2.webp",
      alt: "Banner 2",
      width: 1000,
      height: 367
    },
    {
      id: 3,
      src: "/banner/banner-3.webp",
      alt: "Banner 3",
      width: 1000,
      height: 367
    }
  ],
  
  // Bonuses
  welcomeBonus: 10,
  referralBonus: 10,
  
  // Logo path
  logoPath: "/ic/logo.svg",

  // Helper function to get random UPI ID
  getRandomUpiId: function() {
    return this.upiIds[Math.floor(Math.random() * this.upiIds.length)];
  }
};

export default siteConfig;