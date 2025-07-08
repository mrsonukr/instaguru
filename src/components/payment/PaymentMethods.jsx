import React from "react";
import WalletOption from "./WalletOption";
import SectionLabel from "./SectionLabel";

const PaymentMethods = ({ selectedPaymentMethod, onMethodSelect }) => {
  return (
    <>
      {/* PAY WITH UPI */}
      <SectionLabel text="PAY WITH" icon="/ic/upi.png" />
      <div className="flex flex-col py-5 flex-grow">
        <WalletOption
          icon="/ic/paytm.svg"
          label="PayTM"
          value="paytm"
          selectedMethod={selectedPaymentMethod}
          onSelect={onMethodSelect}
        />
        <WalletOption
          icon="/ic/phonepe.svg"
          label="Phone Pe"
          value="phonepe"
          selectedMethod={selectedPaymentMethod}
          onSelect={onMethodSelect}
        />
        <WalletOption
          icon="/ic/gpay.svg"
          label="Google Pay"
          value="gpay"
          selectedMethod={selectedPaymentMethod}
          onSelect={onMethodSelect}
        />
        <WalletOption
          icon="/ic/upi.svg"
          label="Other UPI"
          value="upi"
          selectedMethod={selectedPaymentMethod}
          onSelect={onMethodSelect}
        />
        <WalletOption
          icon="/ic/qr-code.svg"
          label="Scan QR Code"
          value="qrcode"
          selectedMethod={selectedPaymentMethod}
          onSelect={onMethodSelect}
        />
      </div>
    </>
  );
};

export default PaymentMethods;