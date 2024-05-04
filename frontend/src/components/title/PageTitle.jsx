import React from "react";

function PageTitle({ children }) {
  return (
    <>
      <h2 className="text-center font-semibold py-3 text-3xl text-zinc-800">
        {children}
      </h2>
    </>
  );
}

export default PageTitle;
