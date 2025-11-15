import React from "react";
import Lottie from "lottie-react";
import itemlost from "../../animations/Item Lost.json"

const ItemLost: React.FC = () => {
  return (
    <div style={{ width: 300, height: 300 }}>
      <Lottie animationData={itemlost} loop={true} />
    </div>
  );
};

export default ItemLost;
