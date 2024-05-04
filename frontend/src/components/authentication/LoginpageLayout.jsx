import React from "react";

function LoginpageLayout({ children }) {
  return (
    <>
      <div className="flex min-h-screen mr-[1%] bg-center place-content-center">
        {children}
      </div>
    </>
  );
}

export default LoginpageLayout;
