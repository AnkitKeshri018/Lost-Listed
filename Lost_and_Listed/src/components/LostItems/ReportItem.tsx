import React from "react";
import Lottie from "lottie-react";
import reportitem from "../../animations/Report Item.json";

const ReportItem: React.FC = () => {
  return (
    <div style={{ width: 300, height: 300 }}>
      <Lottie animationData={reportitem} loop={true} />
    </div>
  );
};

export default ReportItem;
