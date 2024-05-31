import React from "react";

function Card({ children, extraStyle }) {
  return (
    <div className="fixed z-50 top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center overflow-y-auto p-4">
      <div
        className={`${extraStyle} bg-white rounded-lg px-[24px] py-[16px] w-full max-w-md md:max-w-lg lg:max-w-xl mt-10 mb-10`}
      >
        {children}
      </div>
    </div>
  );
}

export default Card;
