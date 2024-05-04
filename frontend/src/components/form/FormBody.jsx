import React from "react";

function FormBody({ children, handleSubmit }) {
  return (
    <>
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        {children}
      </form>
    </>
  );
}

export default FormBody;
