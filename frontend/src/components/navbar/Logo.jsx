import React from "react";
import jtlogo from "../../images/jtHollowLogo.png";

const Logo = () => {
  return (
    <div className="flex lg:w-52 h-14 bg-cover items-center">
      <img
        src={jtlogo}
        alt=""
        className="w-36"
        style={{
          zoom: 1.15,
        }}
      />
    </div>
  );
};

export default Logo;
