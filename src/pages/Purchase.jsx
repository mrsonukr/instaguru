import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { BsCheckCircleFill } from "react-icons/bs";
import Header from "../components/Header";
import PurchaseForm from "../components/ui/PurchaseForm";
import servicesData from "../data/categories.json";
import { updatePageSEO } from "../utils/seoUtils";

const Purchase = () => {
  const { id } = useParams();
  const pack = servicesData
    .flatMap((service) => service.packs)
    .find((p) => p.id === parseInt(id));
  const service = servicesData.find((s) =>
    s.packs.some((p) => p.id === parseInt(id))
  );

  useEffect(() => {
    if (pack && service) {
      // Update SEO for purchase page
      updatePageSEO('purchase', pack);
    }
  }, [pack, service]);

  const benefits = [
    { id: 1, message: "High-Quality Real Followers" },
    { id: 2, message: "Fast Delivery Guaranteed" },
    { id: 3, message: "Safe & Secure Service" },
    { id: 4, message: "24/7 Customer Support" },
    { id: 5, message: "No Password Required" },
    { id: 6, message: "100% Satisfaction Guarantee" },
  ];

  if (!pack || !service) {
    return (
      <div>
        <Header />
        <div className="mt-20 m-4 text-center">
          <p className="text-lg font-semibold text-gray-800">Pack not found</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="mt-20 m-4">
        <PurchaseForm
          serviceData={service}
          color={service.color}
          filter={pack.filter}
          onSubmit={(link) => console.log("Submitted:", link)}
        />
      </div>
      <div className="grid grid-cols-2 gap-x-8 gap-y-4 m-4 mt-8">
        {benefits.map((item) => (
          <div key={item.id} className="flex items-center space-x-2">
            <BsCheckCircleFill className="text-green-500 text-sm" />
            <p className="text-xs font-semibold text-gray-800">
              {item.message}
            </p>
          </div>
        ))}
      </div>
      <div>
        <div className="text-center mt-6">
          <p className="text-lg font-semibold mt-4 mb-2 gradient-text">
            How to Use
          </p>
        </div>
        <div className="m-4 rounded-2xl overflow-hidden aspect-video">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/NyqkkX0-v60"
            title="How to Use"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Purchase;