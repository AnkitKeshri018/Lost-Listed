import React from "react";
import Lottie from "lottie-react";
import itemreport from "../../animations/Found_Items/report_found.json";

const FoundItemReport: React.FC = () => {
  return (
    <div style={{ width: 300, height: 300 }}>
      <Lottie animationData={itemreport} loop={true} />
    </div>
  );
};

export default FoundItemReport;
