import React, { useState, useEffect } from 'react';
import axios from 'axios'

function Scalendar() {
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [calendarData, setCalendarData] = useState({ days: [], month: "", year: "" });

    useEffect(() => {
        fetchCalendar();
    }, [currentMonth, currentYear]);

    const fetchCalendar = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/calendar/${currentYear}/${currentMonth}/`);
            setCalendarData(response.data);
        } catch (error) {
            console.error("Error fetching calendar", error);
        }
    };

    const handlePrevMonth = () => {
        setCurrentMonth((prev) => (prev === 1 ? 12 : prev - 1));
        setCurrentYear((prev) => (currentMonth === 1 ? prev - 1 : prev));
    };

    const handleNextMonth = () => {
        setCurrentMonth((prev) => (prev === 12 ? 1 : prev + 1));
        setCurrentYear((prev) => (currentMonth === 12 ? prev + 1 : prev));
    };



    return (
        <div className="w-full text-white bg-[rgba(24,24,27,1)] p-3 rounded-md">
            <div className="flex justify-between items-center">
                <button onClick={handlePrevMonth} className="text-gray-400 hover:text-gray-200">
                    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m15 19-7-7 7-7" />
                    </svg>
                </button>
                <span className="text-xl">{calendarData.month}</span>
                <span className="text-xl text-red-500">{calendarData.year}</span>
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
                {calendarData.days.map(({ day, isCurrentMonth, isToday }, index) => (
                    <div
                        key={index}
                        className={`p-1 text-center rounded-full 
                            ${isCurrentMonth ? 'text-white' : 'text-gray-500'}
                            ${isToday ? 'bg-blue-500' : 'hover:bg-gray-700'}`}
                    >
                        {day}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Scalendar;
