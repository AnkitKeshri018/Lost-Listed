import React from "react";
import Lottie from "lottie-react";
import exchangeItems from "../../animations/MarketPlace/exchange.json";

const ExchangeItems: React.FC = () => {
  return (
    <div style={{ width: 300, height: 300 }}>
      <Lottie animationData={exchangeItems} loop={true} />
    </div>
  );
};

export default ExchangeItems;
