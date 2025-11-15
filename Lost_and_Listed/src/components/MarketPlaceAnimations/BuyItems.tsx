import React from "react";
import Lottie from "lottie-react";
import buyItems from "../../animations/MarketPlace/buy.json";

const BuyItems: React.FC = () => {
  return (
    <div style={{ width: 300, height: 300 }}>
      <Lottie animationData={buyItems} loop={true} />
    </div>
  );
};

export default BuyItems;
