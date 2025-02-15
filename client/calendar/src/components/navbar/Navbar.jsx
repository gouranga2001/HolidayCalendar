import React, { useState } from 'react';

function Navbar() {
  const [isButtonActive, setButtonActive] = useState("Week");
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleButtonClick = (buttonName) => {
    setButtonActive(buttonName);
    setDropdownOpen(false);
  };

  return (
    <nav className="h-16 w-full fixed top-0 z-40 md:ml-[300px] text-black bg-white shadow-md">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
        {/* Navigation Menu */}
        <div className="w-full flex justify-between items-center">
          {/* Mobile Dropdown */}
          <div className="relative md:hidden">
            <button
              onClick={() => setDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 py-1 px-8 rounded-lg bg-[#dc2625] text-white"
            >
              <span>{isButtonActive}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                <path d="M12 6L7.5 10.5L3 6" />
              </svg>
            </button>

            {isDropdownOpen && (
              <ul className="absolute left-0 mt-2 w-full bg-white border rounded-md shadow-md">
                {["Day", "Week", "Month", "Year"].map((item) => (
                  item !== isButtonActive && (
                    <li key={item}>
                      <button
                        onClick={() => handleButtonClick(item)}
                        className="block w-full text-left py-2 px-4 hover:bg-gray-200"
                      >
                        {item}
                      </button>
                    </li>
                  )
                ))}
              </ul>
            )}
          </div>
          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-8">
            {["Day", "Week", "Month", "Year"].map((item) => (
              <li key={item}>
                <button
                  onClick={() => handleButtonClick(item)}
                  className={`block py-1 px-8 rounded-lg ${isButtonActive === item ? "bg-[#dc2625] text-white" : "text-black bg-transparent hover:bg-gray-200"}`}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Search Bar */}
        <div className="flex justify-end w-full md:w-auto">
          <div className="relative w-full max-w-[300px] md:max-w-[400px]">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full p-2 pl-10 text-sm text-black border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search..."
            />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
