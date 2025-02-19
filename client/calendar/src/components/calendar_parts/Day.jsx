import React from 'react'

function Day() {
    var hours = [];
    for (var i = 0; i < 24; i++) {
        var period;
        if (i < 12) {
            period = "AM";
        }
        else {
            period = 'PM'
        }
        var hour;
        if (i % 12 === 0) {
            hour = 12;
        }
        else {
            hour = i % 12
        }
        hours.push(hour + " " + period);
    }
    var divElements = []
    for (var i=0;i<24;i++){
        divElements.push(
            <div className='w-full border-t border-gray-400 py-8 '></div>
        )
    }

    return (
        <>
            <div className='shadow-lg bg-white rounded-md flex flex-row'>
                {/* day time */}
                <div className="w-20 min-h-screen p-2 ">
                    {hours.map((time, index) => (
                        <div key={index} className="py-8 border-gray-400 flex items-center justify-center text-center ">
                            {time}
                        </div>
                    ))}
                </div>
                {/* day events */}
                <div className=' flex flex-row w-full flex-wrap p-4'>
                    {divElements}

                </div>
            </div>

        </>
    )
    console.log(hours)
};

export default Day