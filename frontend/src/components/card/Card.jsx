import React from "react";

function Card({ children }) {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-8 w-full max-w-md">{children}</div>
    </div>
  );
}

export default Card;
