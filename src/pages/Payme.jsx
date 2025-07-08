import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import QRCode from "qrcode";
import NoCopyText from "../components/ui/NoCopyText";
import PaymentHeader from "../components/payment/PaymentHeader";
import PaymentMethods from "../components/payment/PaymentMethods";
import PaymentPopup from "../components/payment/PaymentPopup";

const Payme = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [amount, setAmount] = useState("1.00");
  const [amountError, setAmountError] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes = 180 seconds

  // Original UPI details from your code
  const upi_address = "grocery334078.rzp@icici";
  const payee_name = "Grocery";
  const note = "PaymenttoGrocery";
  const mcc = "5411";

  useEffect(() => {
    if (token) {
      try {
        // Decode and validate token
        const decodedToken = atob(token);
        const tokenParts = decodedToken.split("-");
        const [encodedAmount] = tokenParts;
        const parsedAmount = parseInt(encodedAmount, 10);

        if (parsedAmount && parsedAmount >= 40) {
          setAmount(parsedAmount.toString());
        } else {
          setAmountError("Invalid payment amount");
          setTimeout(() => navigate("/addfund"), 2000);
          return;
        }
      } catch {
        setAmountError("Invalid payment token");
        setTimeout(() => navigate("/addfund"), 2000);
        return;
      }
    }
  }, [token, navigate]);

  // Timer effect for QR code
  useEffect(() => {
    let timer;
    if (showPopup && selectedPaymentMethod === "qrcode" && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Time expired, close popup
            closePopup();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [showPopup, selectedPaymentMethod, timeLeft]);

  const handleBack = () => {
    // Back button pe koi transaction nahi hoga, direct wallet pe redirect
    // Remove any initiated transaction for this token
    if (token) {
      const existingTransactions = JSON.parse(
        localStorage.getItem("paymentTransactions") || "[]"
      );
      const filteredTransactions = existingTransactions.filter(
        (txn) => !(txn.paymentToken === token && txn.status === "initiated")
      );
      localStorage.setItem(
        "paymentTransactions",
        JSON.stringify(filteredTransactions)
      );
    }
    navigate("/wallet");
  };

  const generateQRCode = async () => {
    const txnId = "RZPQq20UpfM9HksWcqrv2";
    const paymentLink = `upi://pay?pa=${upi_address}&pn=${payee_name}&tr=${txnId}&cu=INR&mc=${mcc}&tn=${note}&am=${amount}`;
    
    try {
      const qrDataUrl = await QRCode.toDataURL(paymentLink, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrCodeDataUrl(qrDataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const handleContinue = async () => {
    if (!selectedPaymentMethod) {
      alert("Please select a payment method");
      return;
    }

    // Show popup for all payment methods
    setShowPopup(true);
    setIsClosing(false);
    setTimeLeft(180); // Reset timer to 3 minutes

    // If QR Code is selected, generate QR code
    if (selectedPaymentMethod === "qrcode") {
      await generateQRCode();
      return;
    }

    // For other payment methods, redirect to app after showing popup
    const txnId = "RZPQq20UpfM9HksWcqrv2";

    const params = {
      ver: "01",
      mode: "19",
      pa: upi_address,
      pn: payee_name,
      tr: txnId,
      cu: "INR",
      mc: mcc,
      qrMedium: "04",
      tn: note,
      am: amount,
    };

    const query = new URLSearchParams(params).toString();

    let scheme = "upi";
    switch (selectedPaymentMethod.toLowerCase()) {
      case "paytm":
        scheme = "paytmmp";
        break;
      case "phonepe":
        scheme = "phonepe";
        break;
      case "gpay":
        scheme = "tez";
        break;
      default:
        scheme = "upi";
    }

    const redirect_url = `${scheme}://pay?${query}`;

    // Wait a bit then redirect to app
    setTimeout(() => {
      window.location.href = redirect_url;
    }, 1000);
  };

  const closePopup = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowPopup(false);
      setIsClosing(false);
      setQrCodeDataUrl("");
      setTimeLeft(180); // Reset timer
    }, 300); // Wait for animation to complete
  };

  if (amountError) {
    return (
      <div className="px-5">
        <PaymentHeader onBack={handleBack} />
        <div className="text-center mt-8">
          <p className="text-red-600 font-semibold">{amountError}</p>
          <p className="text-gray-500 mt-2">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <NoCopyText>
      <div className="px-5 min-h-screen flex flex-col">
        {/* Header */}
        <PaymentHeader onBack={handleBack} />

        {/* Add Money */}
        <div className="flex items-center justify-between my-4">
          <div className="flex gap-3 items-center">
            <img src="/ic/bill.svg" alt="Add Money" />
            <p>Add Money</p>
          </div>
          <span className="font-medium">₹{amount}</span>
        </div>

        {/* Payment Methods */}
        <PaymentMethods 
          selectedPaymentMethod={selectedPaymentMethod}
          onMethodSelect={setSelectedPaymentMethod}
        />

        {/* Continue Button - Fixed at bottom */}
        <div className="mt-auto pb-6">
          <button
            onClick={handleContinue}
            disabled={!selectedPaymentMethod}
            className={`w-full py-3 rounded-lg font-semibold text-white transition-colors ${
              selectedPaymentMethod
                ? 'bg-black hover:bg-gray-800'
                : 'bg-gray-700 cursor-not-allowed'
            }`}
          >
            Continue
          </button>
        </div>

        {/* Payment Popup */}
        <PaymentPopup
          showPopup={showPopup}
          isClosing={isClosing}
          selectedPaymentMethod={selectedPaymentMethod}
          qrCodeDataUrl={qrCodeDataUrl}
          timeLeft={timeLeft}
          amount={amount}
          onClose={closePopup}
        />
      </div>
    </NoCopyText>
  );
};

export default Payme;