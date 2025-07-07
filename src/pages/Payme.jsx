import React from "react";
import { ChevronLeft } from "lucide-react";

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
  const upi_address = "grocery334078.rzp@icici";
  const payee_name = "Grocery";
  const note = "PaymenttoGrocery";
  const mcc = "5411";
  const amount = "1.00";

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

    const redirect_url = `${scheme}://pay?${query}`;
    window.location.href = redirect_url;
  };

  return (
    <div className="px-5">
      {/* Header */}
      <div className="flex items-center gap-3 py-4">
        <div className="-ml-2 cursor-pointer">
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
        <span className="font-medium">₹5,000</span>
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
  );
};

export default Payme;
