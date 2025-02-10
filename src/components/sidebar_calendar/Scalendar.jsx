import React, { useState } from 'react';

function Scalendar() {
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());

    const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    const handlePrevMonth = () => {
        setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
        setCurrentYear((prev) => (currentMonth === 0 ? prev - 1 : prev));
    };

    const handleNextMonth = () => {
        setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
        setCurrentYear((prev) => (currentMonth === 11 ? prev + 1 : prev));  
    };

    const days = [];
    const totalDays = daysInMonth(currentYear, currentMonth);
    const prevMonthDays = daysInMonth(currentYear, currentMonth - 1);
    const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Adjust for Monday start

    // Fill in previous month's days
    for (let i = startOffset; i > 0; i--) {
        days.push({ day: prevMonthDays - i + 1, isCurrentMonth: false });
    }

    // Fill in current month's days
    for (let i = 1; i <= totalDays; i++) {
        days.push({ day: i, isCurrentMonth: true });
    }

    // Fill in next month's days
    while (days.length % 7 !== 0) {
        days.push({ day: days.length - totalDays - startOffset + 1, isCurrentMonth: false });
    }

    return (
        <div className="w-full text-white bg-black p-4 rounded-lg">
            <div className="flex justify-between items-center">
                <button onClick={handlePrevMonth} className="text-gray-400 hover:text-gray-200">
                    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m15 19-7-7 7-7" />
                    </svg>
                </button>
                <span className="text-2xl ">{`${new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })}`}</span>
                <span className="text-2xl text-red-500">{currentYear}</span>
                <button onClick={handleNextMonth} className="text-gray-400 hover:text-gray-200">
                    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7" />
                    </svg>
                </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mt-4">
                {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day) => (
                    <div key={day} className="text-center font-semibold">{day}</div>
                ))}
                {days.map(({ day, isCurrentMonth }, index) => (
                    <div
                        key={index}
                        className={`p-2 text-center rounded-full ${isCurrentMonth ? 'text-white' : 'text-gray-500'} ${today.getDate() === day && today.getMonth() === currentMonth && today.getFullYear() === currentYear
                            ? 'bg-blue-500'
                            : 'hover:bg-gray-700'
                            }`}
                    >
                        {day}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Scalendar;
