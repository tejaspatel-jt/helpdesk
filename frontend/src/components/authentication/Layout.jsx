import React from "react";

function Layout({ children }) {
  return (
    <>
      <div className="flex bg-white min-h-full flex-1 flex-col justify-center px-6 py-10 lg:px-8">
        {children}
      </div>
    </>
  );
}

export default Layout;
