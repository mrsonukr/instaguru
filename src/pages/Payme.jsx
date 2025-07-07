import React, { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import NoCopyText from "../components/ui/NoCopyText";

const WalletOption = ({ icon, label, onClick }) => (
  <div
    onClick={onClick}
    className="flex items-center gap-4 my-2 cursor-pointer"
  >
    <div className="w-10 h-10 border border-gray-300 rounded-xl p-1 flex items-center justify-center">
      <img src={icon} alt={label} />
    </div>
    <p className="font-semibold opacity-80">{label}</p>
  </div>
);

const SectionLabel = ({ text, icon }) => (
  <div className="bg-gray-100 flex gap-2 text-gray-500 font-semibold text-xs -mx-5 px-5 py-2 items-center">
    <span>{text}</span>
    {icon && <img className="w-8" src={icon} alt={text} />}
  </div>
);

const Payme = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [amount, setAmount] = useState("1.00");
  const [amountError, setAmountError] = useState("");
  const [hasCreatedTransaction, setHasCreatedTransaction] = useState(false);
  const [paymentClicked, setPaymentClicked] = useState(false);

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

      // Auto-redirect after 2 minutes (120 seconds) only if no payment method clicked
      const redirectTimer = setTimeout(() => {
        if (!paymentClicked && !hasCreatedTransaction) {
          createProcessingTransaction();
          setHasCreatedTransaction(true);
          navigate("/redirecting");
        }
      }, 45000);

      return () => clearTimeout(redirectTimer);
    }
  }, [token, navigate, hasCreatedTransaction, paymentClicked]);

  const createProcessingTransaction = () => {
    if (token) {
      const existingTransactions = JSON.parse(
        localStorage.getItem("paymentTransactions") || "[]"
      );
      const updatedTransactions = existingTransactions.map((txn) => {
        if (txn.paymentToken === token && txn.status === "initiated") {
          return {
            ...txn,
            status: "processing",
            updatedAt: new Date().toISOString(),
            description: `Payment Processing - ₹${txn.amount}`,
          };
        }
        return txn;
      });
      localStorage.setItem(
        "paymentTransactions",
        JSON.stringify(updatedTransactions)
      );
    }
  };

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

  const payNow = (payType) => {
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
    switch (payType.toLowerCase()) {
      case "paytm":
        scheme = "paytmmp";
        break;
      case "phone pe":
      case "phonepe":
        scheme = "phonepe";
        break;
      case "google pay":
      case "gpay":
        scheme = "tez";
        break;
      default:
        scheme = "upi";
    }

    // Mark that payment method was clicked
    setPaymentClicked(true);

    // Create processing transaction when user actually tries to pay
    if (!hasCreatedTransaction) {
      createProcessingTransaction();
      setHasCreatedTransaction(true);
    }

    const redirect_url = `${scheme}://pay?${query}`;

    // Same page redirect - no new tab
    window.location.href = redirect_url;

    // Start 1-minute countdown from when payment method is clicked
    setTimeout(() => {
      navigate("/redirecting");
    }, 30000); // 1 minute
  };

  if (amountError) {
    return (
      <div className="px-5">
        <div className="flex items-center gap-3 py-4">
          <div className="-ml-2 cursor-pointer" onClick={handleBack}>
            <ChevronLeft size={32} />
          </div>
          <p className="text-xl font-semibold">Payment Error</p>
        </div>
        <div className="text-center mt-8">
          <p className="text-red-600 font-semibold">{amountError}</p>
          <p className="text-gray-500 mt-2">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <NoCopyText>
      <div className="px-5">
        {/* Header */}
        <div className="flex items-center gap-3 py-4">
          <div className="-ml-2 cursor-pointer" onClick={handleBack}>
            <ChevronLeft size={32} />
          </div>
          <p className="text-xl font-semibold">Payment Methods</p>
        </div>

        {/* Add Money */}
        <div className="flex items-center justify-between my-4">
          <div className="flex gap-3 items-center">
            <img src="/ic/bill.svg" alt="Add Money" />
            <p>Add Money</p>
          </div>
          <span className="font-medium">₹{amount}</span>
        </div>

        {/* PAY WITH UPI */}
        <SectionLabel text="PAY WITH" icon="/ic/upi.png" />
        <div className="flex flex-col py-5 gap-5">
          <WalletOption
            icon="/ic/paytm.svg"
            label="PayTM"
            onClick={() => payNow("PayTM")}
          />
          <WalletOption
            icon="/ic/phonepe.svg"
            label="Phone Pe"
            onClick={() => payNow("Phone Pe")}
          />
          <WalletOption
            icon="/ic/gpay.svg"
            label="Google Pay"
            onClick={() => payNow("Google Pay")}
          />
          <WalletOption
            icon="/ic/upi.svg"
            label="Other UPI"
            onClick={() => payNow("UPI")}
          />
        </div>

        {/* PAY WITH CARDS */}
        <SectionLabel text="PAY WITH CARDS" />
        <div className="flex flex-col py-5 gap-5">
          <div className="flex items-center gap-4 my-2 opacity-80 select-none">
            <div className="w-10 h-10 border border-gray-300 rounded-xl p-1 flex items-center justify-center">
              <img src="/ic/plus.svg" alt="Add Credit Card" />
            </div>
            <p className="font-semibold">Add Credit Card</p>
          </div>
        </div>
      </div>
    </NoCopyText>
  );
};

export default Payme;
