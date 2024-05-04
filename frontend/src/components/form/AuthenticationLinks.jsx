import React from "react";
import { Link } from "react-router-dom";

function AuthenticationLinks({ message, route, pagename }) {
  return (
    <p className="mt-4 text-center text-gray-600">
      {message}{" "}
      <Link to={route} className="text-blue-500 hover:underline">
        {pagename}
      </Link>
    </p>
  );
}

export default AuthenticationLinks;
