import React from 'react'

function Day() {
    const hours = Array.from({ length: 24 }, (_, i) => {
        const period = i < 12 ? "AM" : "PM";
        const hour = i % 12 === 0 ? 12 : i % 12;
        return `${hour} ${period}`;
    });
    return (
        <>
            <div className='shadow-lg bg-white rounded-md'>
                {/* day time */}
                <div className="w-20 min-h-screen p-4">
                    {hours.map((time, index) => (
                        <div key={index} className="py-8 border-t">
                            {time}
                        </div>
                    ))}
                </div>
                {/* day events */}

            </div>
        </>
    )
}

export default Day