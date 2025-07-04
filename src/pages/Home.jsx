import { useEffect } from "react";
import Header from "../components/Header";
import AutoSlider from "../components/AutoSlider";
import ItemCard from "../components/ui/ItemCard";
import channels from "../data/categories.json"; // Import the JSON data
import WelcomePopup from "../components/ui/WelcomePopup"; // Import the WelcomePopup component
import Footer from "../components/ui/Footer"; // Import the Footer component
import { updatePageSEO, addStructuredData } from "../utils/seoUtils";

const Home = () => {
  useEffect(() => {
    // Update SEO for home page
    updatePageSEO('home');
    
    // Add structured data
    addStructuredData('organization');
    addStructuredData('website');
  }, []);

  return (
    <>
      <Header />
      <div className="mt-20"></div>
      <WelcomePopup />
      <AutoSlider />
      <div className="text-center mt-6 ">
        <p className="text-lg font-semibold mt-4 mb-2 gradient-text">
          Explore our services and their plans.
        </p>
      </div>

      {channels.map((channel, index) => (
        <ItemCard key={index} {...channel} />
      ))}
      <Footer />
    </>
  );
};

export default Home;