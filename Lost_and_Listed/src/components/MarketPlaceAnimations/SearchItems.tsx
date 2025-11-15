import React from "react";
import Lottie from "lottie-react";
import searchItems from "../../animations/MarketPlace/search.json";

const SearchItems: React.FC = () => {
  return (
    <div style={{ width: 300, height: 300 }}>
      <Lottie animationData={searchItems} loop={true} />
    </div>
  );
};

export default SearchItems;
