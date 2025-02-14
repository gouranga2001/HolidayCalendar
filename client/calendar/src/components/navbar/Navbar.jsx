import React from 'react'

function Navbar() {
  return (
    <>
      <nav className="h-5 w-full fixed top-0 z-40 md:ml-[300px] text-black m-3">
        <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">

          {/* Navigation Menu (Always Visible) */}
          <div className="w-full flex justify-center">
            <ul className="flex space-x-8">
              <li>
                <button className="block py-2 px-4 text-black bg-transparent hover:bg-gray-200 rounded-lg">
                  Home
                </button>
              </li>
              <li>
                <button className="block py-2 px-4 text-black bg-transparent hover:bg-gray-200 rounded-lg">
                  About
                </button>
              </li>
              <li>
                <button className="block py-2 px-4 text-black bg-transparent hover:bg-gray-200 rounded-lg">
                  Services
                </button>
              </li>
            </ul>
          </div>

          {/* Search Bar (Always Visible) */}
          <div className="flex justify-end w-full">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                </svg>
              </div>
              <input
                type="text"
                className="block w-64 p-2 pl-10 text-sm text-black border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search..."
              />
            </div>
          </div>

        </div>
      </nav>

    </>
  );
};

export default Navbar;