import React from "react";
import jtlogo from "../../images/jignect_logo.png";

const Logo = () => {
  return (
    <div
      className="flex lg:w-52 h-14 bg-cover "
      style={{ backgroundImage: `url(${jtlogo})` }}
    ></div>
  );
};

export default Logo;
