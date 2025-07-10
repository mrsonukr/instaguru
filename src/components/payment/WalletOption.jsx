import React, { useState } from "react";
import Skeleton from "../ui/Skeleton";

const WalletOption = ({ icon, label, value, selectedMethod, onSelect }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  return (
    <div
      onClick={() => onSelect(value)}
      className={`flex items-center justify-between my-2 cursor-pointer p-3 rounded-lg transition-colors ${
        selectedMethod === value ? 'bg-gray-50' : 'hover:bg-gray-50'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 border border-gray-300 rounded-xl p-1 flex items-center justify-center relative">
          {/* Loading spinner */}
          {!imageLoaded && !imageError && (
            <Skeleton className="absolute inset-0 rounded-xl" />
          )}
          
          {/* Image or SVG icon */}
          {typeof icon === 'string' ? (
            <img 
              src={icon} 
              alt={label}
              onLoad={handleImageLoad}
              onError={handleImageError}
              className={`transition-opacity duration-200 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ display: imageLoaded ? 'block' : 'none' }}
            />
          ) : (
            // For SVG icons (like QR code)
            <div className="w-6 h-6 text-gray-600">
              {icon}
            </div>
          )}
          
          {/* Error fallback */}
          {imageError && typeof icon === 'string' && (
            <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center">
              <span className="text-xs text-gray-500">?</span>
            </div>
          )}
        </div>
        <p className="font-semibold opacity-80">{label}</p>
      </div>
      <div className="flex items-center">
        <input
          type="radio"
          name="paymentMethod"
          value={value}
          checked={selectedMethod === value}
          onChange={() => onSelect(value)}
          className="w-4 h-4 text-black border-gray-300 focus:ring-black accent-black"
        />
      </div>
    </div>
  );
};

export default WalletOption;