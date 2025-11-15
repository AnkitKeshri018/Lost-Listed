import React from "react";
import Lottie from "lottie-react";
import itemfound from "../../animations/Item Found.json";

const ItemFound: React.FC = () => {
  return (
    <div style={{ width: 300, height: 300 }}>
      <Lottie animationData={itemfound} loop={true} />
    </div>
  );
};

export default ItemFound;
