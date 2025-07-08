import React, { useState } from "react";
import { X } from "lucide-react";
import Skeleton from "../ui/Skeleton";

const PaymentPopup = ({ 
  showPopup, 
  isClosing, 
  selectedPaymentMethod, 
  qrCodeDataUrl, 
  timeLeft, 
  amount, 
  onClose 
}) => {
  const [loadedImages, setLoadedImages] = useState({});

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleImageLoad = (imageName) => {
    setLoadedImages(prev => ({ ...prev, [imageName]: true }));
  };

  const PaymentIcon = ({ src, alt, className, imageName }) => (
    <div className="relative inline-block">
      {!loadedImages[imageName] && (
        <Skeleton className={`absolute inset-0 ${className} rounded`} />
      )}
      <img 
        src={src} 
        alt={alt} 
        className={`${className} transition-opacity duration-200 ${
          loadedImages[imageName] ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => handleImageLoad(imageName)}
      />
    </div>
  );

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
      <div className={`bg-white w-full rounded-t-3xl transform transition-transform duration-300 ease-out ${
        isClosing ? 'translate-y-full' : 'translate-y-0'
      }`}>
        {/* iPhone-style handle bar */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
        </div>
        
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {selectedPaymentMethod === "qrcode" ? "Scan QR Code" : "Processing Payment"}
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content based on payment method */}
          {selectedPaymentMethod === "qrcode" ? (
            <div className="text-center py-4">
              {qrCodeDataUrl ? (
                <>
                  <div className="bg-white p-4 rounded-xl border-2 border-gray-200 inline-block mb-4">
                    <img 
                      src={qrCodeDataUrl} 
                      alt="Payment QR Code" 
                      className="mx-auto"
                    />
                  </div>
                  <p className="text-sm text-red-600 mb-4">{formatTime(timeLeft)} Time Remaining</p>

                  <p className="text-sm text-gray-600 mb-2">
                    Scan this QR code with any UPI app to pay ₹{amount}
                  </p>
                  <div className="flex justify-center items-center gap-4 mt-4">
                    <PaymentIcon 
                      src="/ic/gpay.svg" 
                      alt="Google Pay" 
                      className="h-6" 
                      imageName="gpay"
                    />
                    <PaymentIcon 
                      src="/ic/phonepe.svg" 
                      alt="PhonePe" 
                      className="h-6" 
                      imageName="phonepe"
                    />
                    <PaymentIcon 
                      src="/ic/paytm.svg" 
                      alt="Paytm" 
                      className="h-5" 
                      imageName="paytm"
                    />
                    <PaymentIcon 
                      src="/ic/upi.svg" 
                      alt="UPI" 
                      className="h-5" 
                      imageName="upi"
                    />
                  </div>
                </>
              ) : (
                <div className="py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Generating QR Code...</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <h4 className="text-lg font-semibold mb-2">Processing Payment</h4>
              <p className="text-gray-600 mb-4">
                Redirecting to {selectedPaymentMethod === "paytm" ? "PayTM" : 
                               selectedPaymentMethod === "phonepe" ? "PhonePe" : 
                               selectedPaymentMethod === "gpay" ? "Google Pay" : "UPI"} app...
              </p>
              <p className="text-sm text-gray-500">
                If the app doesn't open automatically, please check your installed apps.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentPopup;