import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import PBanner from "../components/ui/PBanner";
import PackCard from "../components/ui/PackCard";
import PackFilter from "../components/ui/PackFilter";
import Suggestion from "../components/ui/Suggestion";
import WelcomePopup from "../components/ui/WelcomePopup";
import data from "../data/categories.json";
import Footer from "../components/ui/Footer";
import { updatePageSEO, addStructuredData } from "../utils/seoUtils";

const Products = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState("All");

  const selectedItem = data.find((item) => item.slug === slug);

  // Redirect to home if service not found
  useEffect(() => {
    if (!selectedItem) {
      navigate("/");
    } else {
      // Update SEO for service page
      updatePageSEO('service', selectedItem);
      updatePageSEO(selectedItem.slug, selectedItem);
      
      // Add structured data for service
      addStructuredData('service', selectedItem);
    }
  }, [selectedItem, navigate]);

  if (!selectedItem) {
    return null; // Or a loader if needed
  }

  // Get unique filter values from packs
  const packFilters = [
    ...new Set(selectedItem.packs.map((pack) => pack.filter)),
  ].sort(); // Sort for consistent order

  // Filter packs based on selected filter
  const filteredPacks =
    selectedFilter === "All"
      ? selectedItem.packs
      : selectedItem.packs.filter((pack) => pack.filter === selectedFilter);

  return (
    <div>
      <Header />
      <WelcomePopup />
      <Header />
      <div className="mt-20">
        <PBanner
          key={selectedItem.slug}
          imageSrc={selectedItem.logo}
          altText={`${selectedItem.name} logo`}
          title={`Discover ${selectedItem.name} Plans`}
          description={selectedItem.description}
          color={selectedItem.color}
        />
        {/* <PackFilter/> */}
        <PackFilter
          packFilters={packFilters}
          onFilterChange={setSelectedFilter}
          variant={selectedItem.color}
        />
        <div className="m-4 mt-0 flex flex-col items-center">
          {filteredPacks.length > 0 ? (
            filteredPacks.map((pack) => (
              <PackCard
                key={pack.id}
                color={selectedItem.color}
                title={pack.title}
                description={pack.description}
                price={pack.price}
                link={`/purchase/${pack.id}`}
                logo={selectedItem.logo}
              />
            ))
          ) : (
            <p className="text-gray-600">No plans available for this filter.</p>
          )}
        </div>
        <div className="text-center mt-6 mb-4 ">
          <p className="text-lg font-semibold mt-4 mb-2 gradient-text">
            Explore our services and their plans.
          </p>
        </div>
        <div className="flex gap-2 overflow-x-auto px-4 pb-2 scrollbar-hide">
          {data.map((service) => (
            <Link key={service.slug} to={`/${service.slug}`}>
              <Suggestion
                logo={service.logo}
                name={service.name}
                color={service.color}
              />
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Products;