// import React from "react";

// function Card({ children }) {
//   return (
//     <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
//       <div className="bg-white rounded-lg p-8 max-w-md w-full md:max-w-lg lg:max-w-xl">
//         {children}
//       </div>
//     </div>
//   );
// }

// export default Card;

// --------------------------------------- abouve code is previous----------------------------
import React from "react";

function Card({ children }) {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-start overflow-y-auto p-4">
      <div className="bg-white rounded-lg p-8 w-full max-w-md md:max-w-lg lg:max-w-xl mt-10 mb-10">
        {children}
      </div>
    </div>
  );
}

export default Card;
