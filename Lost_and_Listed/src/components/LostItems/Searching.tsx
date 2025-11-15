import React from "react";
import Lottie from "lottie-react";
import searching from "../../animations/Not Found.json";

const Searching: React.FC = () => {
  return (
    <div style={{ width: 300, height: 300 }}>
      <Lottie animationData={searching} loop={true} />
      </div>
  );
};

export default Searching;
