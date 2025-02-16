import React, { useState, useEffect, useRef, useCallback } from 'react';
import plusIcon from '/src/assets/plus.svg';
import Scalendar from '../sidebar_calendar/Scalendar';

function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  // Memoized open/close functions
  const openSidebar = useCallback(() => setIsSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);

  // Click outside handler (runs once)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Toggle Button - Only Visible on Mobile */}
      {!isSidebarOpen && (
        <button
          onClick={openSidebar}
          className="md:hidden fixed top-4 left-4 z-50 p-2 bg-transparent text-black rounded"
          aria-label="Open Sidebar"
        >
          <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8.99994 10 7 11.9999l1.99994 2M12 5v14M5 4h14c.5523 0 1 .44772 1 1v14c0 .5523-.4477 1-1 1H5c-.55228 0-1-.4477-1-1V5c0-.55228.44772-1 1-1Z" />
          </svg>
        </button>
      )}

      {/* Sidebar (Fixed on Desktop, Slide-In on Mobile) */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 w-[300px] min-h-screen bg-[rgba(24,24,27,1)] text-white transition-transform duration-300 ease-in-out z-50
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:border-2 md:border-black`}
      >
        {/* Close button (Mobile Only) */}
        <button
          onClick={closeSidebar}
          className="md:hidden absolute top-4 right-4 bg-transparent text-white"
          aria-label="Close Sidebar"
        >
          <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Plus Icon */}
        <button className="absolute right-4 top-4 cursor-pointer">
          <img src={plusIcon} alt="Plus Icon" className="size-5 bg-gray-400 rounded stroke-white" />
        </button>

        {/* Sidebar Content */}
        <ul className="mt-8">
          <li><Scalendar /></li>
        </ul>
      </div>
    </>
  );
}

export default Sidebar;
