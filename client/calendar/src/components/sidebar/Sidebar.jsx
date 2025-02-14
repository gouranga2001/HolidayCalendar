import React, { useState, useEffect, useRef } from 'react';
import plusIcon from '/src/assets/plus.svg';
import Scalendar from '../sidebar_calendar/Scalendar';

function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        closeSidebar();
      }
    };

    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSidebarOpen]);

  return (
    <>
      {/* Toggle Button - Only Visible on Mobile & Hidden When Sidebar is Open */}
      {!isSidebarOpen && (
        <button
          onClick={openSidebar}
          className="md:hidden fixed top-4 left-4 z-50 p-2 text-black bg-transparent rounded"
        >
          <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M8.99994 10 7 11.9999l1.99994 2M12 5v14M5 4h14c.5523 0 1 .44772 1 1v14c0 .5523-.4477 1-1 1H5c-.55228 0-1-.4477-1-1V5c0-.55228.44772-1 1-1Z"
            />
          </svg>
        </button>
      )}

      {/* Sidebar (Always Visible on Desktop) */}
      <div
        ref={sidebarRef}
        className={`w-[300px] min-h-screen fixed top-0 left-0 bg-[rgba(24,24,27,1)] text-white transition-transform duration-300 ease-in-out
    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:border-2 md:border-black 
    z-50 md:z-40`}
      >
        {/* Close button (Only for Mobile) */}
        <button
          onClick={closeSidebar}
          className="md:hidden absolute top-4 right-4 bg-transparent text-white"
        >
          <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Plus Icon */}
        <button className='cursor-pointer'>
          <img src={plusIcon} alt="Plus Icon" className="size-5 bg-gray-400 rounded absolute right-4 top-4 stroke-white" />
        </button>

        {/* Sidebar Content */}
        <ul className='mt-8'>
          <li><Scalendar /></li>
        </ul>
      </div>
    </>
  );
}

export default Sidebar;
