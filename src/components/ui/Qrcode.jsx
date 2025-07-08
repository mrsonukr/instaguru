import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import { Loader2 } from "lucide-react";
import RazorpayLogo from "./Razorpaylogo";
import Timer from "./Timer";
import siteConfig from "../../config/siteConfig";

export default function Qrcode() {
  const { token } = useParams();
  const [amountError, setAmountError] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedUpiId, setSelectedUpiId] = useState("");
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [paymentExpired, setPaymentExpired] = useState(false);
  const [txnId, setTxnId] = useState(""); // Add state for transaction ID
  const navigate = useNavigate();

  // Function to generate unique transaction ID
  const generateTxnId = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `RZP${timestamp}${random}`;
  };

  const updatePaymentStatus = (status) => {
    const existingTransactions = JSON.parse(localStorage.getItem("paymentTransactions") || "[]");
    const updatedTransactions = existingTransactions.map(txn => {
      if (txn.paymentToken === token) {
        return {
          ...txn,
          status: status,
          updatedAt: new Date().toISOString(),
          description: status === "cancelled" 
            ? `Payment Cancelled - ₹${txn.amount}` 
            : status === "processing"
            ? `Payment Processing - ₹${txn.amount}`
            : txn.description
        };
      }
      return txn;
    });
    localStorage.setItem("paymentTransactions", JSON.stringify(updatedTransactions));
  };

  useEffect(() => {
    try {
      // Decode and validate token
      const decodedToken = atob(token);
      const tokenParts = decodedToken.split('-');
      const [encodedAmount, , , upiIndex] = tokenParts;
      const parsedAmount = parseInt(encodedAmount, 10);
      
      if (parsedAmount && parsedAmount >= siteConfig.minimumAmount) {
        setAmount(parsedAmount.toString());
        // Generate unique transaction ID when component loads
        setTxnId(generateTxnId());
        
        // Get UPI ID from token or fallback to random selection
        if (upiIndex !== undefined && siteConfig.upiIds[parseInt(upiIndex)]) {
          setSelectedUpiId(siteConfig.upiIds[parseInt(upiIndex)]);
        } else {
          // Fallback to random UPI ID if token doesn't contain valid index
          setSelectedUpiId(siteConfig.getRandomUpiId());
        }
      } else {
        setAmountError("Invalid payment amount");
        setTimeout(() => navigate("/addfund"), 2000);
      }
    } catch {
      setAmountError("Invalid payment token");
      setTimeout(() => navigate("/addfund"), 2000);
    }

    // Prevent browser back button
    const handlePopState = (e) => {
      e.preventDefault();
      setShowCancelConfirm(true);
      window.history.pushState(null, null, window.location.pathname);
    };

    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [token, navigate]);

  const handleCancel = () => {
    setShowCancelConfirm(true);
  };

  const confirmCancel = async () => {
    setIsCancelling(true);
    updatePaymentStatus("cancelled");
    await new Promise(resolve => setTimeout(resolve, 2000));
    navigate("/wallet");
  };

  const handlePaymentExpired = () => {
    // Update status to processing instead of expired
    updatePaymentStatus("processing");
    // Redirect to wallet after a short delay
    setTimeout(() => {
      navigate("/wallet");
    }, 1000);
  };

  if (amountError || !amount || !selectedUpiId || !txnId) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md w-full space-y-6">
          <div className="flex justify-center mb-4">
            <RazorpayLogo />
          </div>
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-800">Error</h2>
            <p
              className="text-red-600 bg-red-50 p-2 rounded-md mt-2 text-sm"
              aria-live="polite"
            >
              {amountError || "Loading payment details..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const paymentLink = `upi://pay?pa=${selectedUpiId}&pn=${siteConfig.siteName}&am=${amount}&cu=INR&tn=${txnId}`;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md w-full space-y-6">
        <div className="flex justify-center mb-4">
          <RazorpayLogo />
        </div>

        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-800">
            Scan to Pay ₹{amount}
          </h2>
          <p className="text-sm text-gray-500 mb-2">
            Use any UPI app to scan and pay
          </p>
          <p className="text-xs text-gray-400 mb-4">
            Payment ID: {selectedUpiId}
          </p>
          <div className="flex-col flex items-center justify-center bg-blue-50 p-6 rounded-lg">
            <QRCode
              value={paymentLink}
              size={180}
              bgColor="#F0F5FF"
              fgColor="#000000"
              level="H"
            />
            <div className="flex justify-center items-center gap-4 mt-4">
              <img src="/ic/gpay.svg" alt="Google Pay" className="h-4" />
              <img src="/ic/phonepe.svg" alt="PhonePe" className="h-4" />
              <img src="/ic/paytm.svg" alt="Paytm" className="h-3" />
              <img src="/ic/upi.svg" alt="UPI" className="h-3" />
            </div>
          </div>

          <Timer onExpired={handlePaymentExpired} />
          <p className="text-sm text-gray-500">
            Your payment will be processed automatically.
          </p>
          <button
            onClick={handleCancel}
            className="w-full bg-gray-600 text-white mt-3 font-semibold py-3 rounded-lg hover:bg-gray-700 transition"
          >
            Cancel Payment
          </button>
        </div>

        <p className="text-center text-xs text-gray-500 mt-4">
          Powered by <span className="font-semibold text-blue-600">Razorpay</span>
        </p>
      </div>

      {/* Bottom Sheet Cancel Confirmation */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div 
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 transform transition-transform duration-300 ease-out"
            style={{
              transform: showCancelConfirm ? 'translateY(0)' : 'translateY(100%)'
            }}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Cancel Payment?
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to cancel this payment? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                Continue Payment
              </button>
              <button
                onClick={confirmCancel}
                disabled={isCancelling}
                className="flex-1 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition font-medium flex items-center justify-center"
              >
                {isCancelling ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Cancelling...
                  </>
                ) : (
                  "Yes, Cancel"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}