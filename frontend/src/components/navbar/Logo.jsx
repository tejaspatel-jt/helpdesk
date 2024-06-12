import React from "react";
import jtlogo from "../../images/jtHollowLogo.png";

const Logo = () => {
  return (
    <div
      className="flex lg:w-52 h-14 bg-cover items-center"
      style={{ backgroundImage: `url(${jtlogo})` }}
    ></div>
  );
};

export default Logo;
