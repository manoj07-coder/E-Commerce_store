import React from "react";

const Loader = ({ size = 8 }) => {
  return (
    <div className="flex items-center justify-between">
      <div
        style={{ width: size * 4, height: size * 4 }}
        className="border-4 border-primary loader-spin"
      />
    </div>
  );
};

export default Loader;
