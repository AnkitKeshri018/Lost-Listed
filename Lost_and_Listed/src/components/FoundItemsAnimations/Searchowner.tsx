import React from "react";
import Lottie from "lottie-react";
import searchowner from "../../animations/Found_Items/searching_owner.json";

const Searchowner: React.FC = () => {
  return (
    <div style={{ width: 300, height: 300 }}>
      <Lottie animationData={searchowner} loop={true} />
    </div>
  );
};

export default Searchowner;
