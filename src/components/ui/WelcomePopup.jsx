import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { X } from "lucide-react";
import siteConfig from "../../config/siteConfig";

const WelcomePopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has already seen the popup
    const hasVisited = localStorage.getItem("hasVisited");
    if (!hasVisited) {
      setIsOpen(true);
      localStorage.setItem("hasVisited", "true");
      
      // Save welcome bonus transaction
      const welcomeBonus = {
        id: "welcome_bonus",
        type: "credit",
        amount: siteConfig.welcomeBonus,
        date: new Date().toISOString(), // Save full ISO date-time
        description: "Welcome Bonus",
      };
      localStorage.setItem("welcomeBonusTxn", JSON.stringify(welcomeBonus));

      triggerConfetti();
    }
  }, []);

  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative max-w-xs w-full mx-4">
        {/* X Button - top-right inside the box */}
        <button
          className="absolute text-gray-700 right-2 top-2 hover:text-gray-500 transition z-50"
          onClick={() => setIsOpen(false)}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* White box */}
        <div className="bg-green-50 border border-green-500 rounded-2xl p-6 shadow-2xl">
          <h2 className="text-xl font-bold text-green-600 mb-3 text-center">
            🎉 Congratulations!
          </h2>
          <p className="text-center font-semibold text-gray-700">You got ₹{siteConfig.welcomeBonus}</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomePopup;