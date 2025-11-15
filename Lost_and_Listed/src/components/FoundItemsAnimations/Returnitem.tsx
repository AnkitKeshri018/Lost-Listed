import React from "react";
import Lottie from "lottie-react";
import returnitem from "../../animations/Found_Items/return_item.json";

const Returnitem: React.FC = () => {
  return (
    <div style={{ width: 300, height: 300 }}>
      <Lottie animationData={returnitem} loop={true} />
    </div>
  );
};

export default Returnitem;
