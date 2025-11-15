import React from "react";
import Lottie from "lottie-react";
import sellItems from "../../animations/MarketPlace/sell.json";

const SellItems: React.FC = () => {
  return (
    <div style={{ width: 300, height: 300 }}>
      <Lottie animationData={sellItems} loop={true} />
    </div>
  );
};

export default SellItems;
