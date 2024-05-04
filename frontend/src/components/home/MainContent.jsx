import React from "react";

const MainContent = () => {
  return (
    <div className="flex-grow p-8">
      <h1 className="text-3xl font-bold text-blue-800">Welcome,!</h1>
      <div className="flex justify-center">
        <img src="data:image/png;base64,..." alt="" />
      </div>
      <p className="mt-4 text-gray-700">You are now on the home page.</p>
    </div>
  );
};

export default MainContent;
