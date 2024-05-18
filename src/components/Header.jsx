import React from "react";

const Header = ({ distance, time, stops, currentStopIndex }) => {
  return (
    <div className="bg-gradient-to-r from-green-500 to-blue-500 ">
      <div className="flex justify-between items-center p-5 text-3xl">
        <div className="cursor-pointer lg:hidden">
          <div className="w-6 h-0.5 bg-white mb-1"></div>
          <div className="w-6 h-0.5 bg-white mb-1"></div>
          <div className="w-6 h-0.5 bg-white"></div>
        </div>
        <div className="text-right">Startup</div>
      </div>
      <div className="bg-white flex flex-col items-center p-2 py-8">
        <div>
          <h1 className="text-xl font-bold">NYABUGOGO - KIMIRONKO</h1>
        </div>
        <div className="flex">
          <h1>Next stop:</h1>
          <h4>{stops[currentStopIndex].name}</h4>
        </div>
        <div className="flex gap-3">
          <div className="flex">
            <h1>Distance :</h1>
            <h4>
              {distance === 0 ? "Calculating..." : `${distance.toFixed(2)} km`}
            </h4>
          </div>
          <div className="flex">
            <h1>Time :</h1>
            <h4>{time === null ? "Calculating..." : `${time}`}</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
