import React from "react";
const Loader = ({ size = "h-8 w-8", color = "border-blue-500" }) => {
    return (
      <div className="flex items-center justify-center">
        <div
          className={`${size} animate-spin rounded-full border-4 ${color} border-t-transparent`}
        />
      </div>
    );
  };
  
  export default Loader;
  