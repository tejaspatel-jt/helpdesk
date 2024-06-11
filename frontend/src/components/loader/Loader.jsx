import React from "react";

const Loader = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50">
      <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-400 h-16 w-16">
        {/* Loading... */}
      </div>
    </div>
  );
};

export default Loader;

// <------------- Loader with blur background -------------->

// import React from "react";

// const Loader = () => {
//   return (
//     <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50 bg-opacity-50 backdrop-filter backdrop-blur-md">
//       <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-24 w-24"></div>
//     </div>
//   );
// };

// export default Loader;

// import React from "react";

// const Loader = () => {
//   return (
//     <span className="loading loading-spinner fixed top-0 left-[45%] w-[5%] h-full flex justify-center items-center z-50 bg-opacity-50 backdrop-filter backdrop-blur-md"></span>
//   );
// };

// export default Loader;
