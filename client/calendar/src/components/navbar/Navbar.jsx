import React, { useState } from 'react';

function Navbar() {
  const [isButtonActive, setButtonActive] = useState("Week");
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleButtonClick = (buttonName) => {
    setButtonActive(buttonName);
    setDropdownOpen(false); // Close dropdown on selection
  };

  return (
    <nav className="fixed top-0 left-0 md:left-[300px] w-full md:w-[calc(100%-300px)] bg-white shadow-md z-40 h-16 transition-all duration-300">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center px-4 py-2">
        
        {/* Left-Side Navigation */}
        <div className="flex items-center gap-4">
          
          {/* Mobile Dropdown */}
          <div className="relative md:hidden mr-4 ml-16">
            <button
              onClick={() => setDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 py-2 px-4 bg-[#dc2625] text-white rounded-lg"
            >
              <span>{isButtonActive}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                <path d="M12 6L7.5 10.5L3 6" />
              </svg>
            </button>

            {isDropdownOpen && (
              <ul className="absolute left-0 mt-2 w-full bg-white border rounded-md shadow-md">
                {["Day", "Week", "Month", "Year"].filter(item => item !== isButtonActive).map((item) => (
                  <li key={item}>
                    <button
                      onClick={() => handleButtonClick(item)}
                      className="block w-full text-left py-2 px-4 hover:bg-gray-200"
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-4">
            {["Day", "Week", "Month", "Year"].map((item) => (
              <li key={item}>
                <button
                  onClick={() => handleButtonClick(item)}
                  className={`py-2 px-4 rounded-lg ${
                    isButtonActive === item ? "bg-[#dc2625] text-white" : "text-black bg-transparent hover:bg-gray-200"
                  }`}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Right-Side Search Bar */}
        <div className="flex-grow w-full sm:max-w-sm ml-4">
          <div className="relative">
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
