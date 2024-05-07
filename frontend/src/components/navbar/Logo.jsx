import React from "react";
import jtlogo from "../../images/jtlogo1024.png";

const Logo = () => {
  return (
    <div
      className="flex lg:w-14 h-14 bg-cover"
      style={{ backgroundImage: `url(${jtlogo})` }}
    ></div>
  );
};

export default Logo;
