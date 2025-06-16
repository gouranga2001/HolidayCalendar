$(document).ready(function () {
    let today = new Date();
    let currentMonth = today.getMonth() + 1; // Months are 1-based
    let currentYear = today.getFullYear();

    // Function to fetch and update calendar
    function fetchCalendar(year, month) {
        $.ajax({
            url: `api/calendar/${year}/${month}/`,  // Your Django API endpoint
            method: "GET",
            dataType: "json",
            success: function (data) {
                $("#calendarMonth").text(data.month);
                $("#calendarYear").text(data.year);
                updateCalendarGrid(data.days,data.year,month);
                
                
            },
            error: function (xhr, status, error) {
                console.error("Error fetching calendar:", error);
            }
        });
    }

    // Function to update calendar UI
    function updateCalendarGrid(days, year, month) {
        let calendarGrid = $("#calendarDays");
        calendarGrid.empty(); // Clear previous days

        days.forEach(({ day, isCurrentMonth, isToday}) => {
            const fullDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            
            let dayElement = $("<button>")
                .addClass("p-1 text-center rounded-full cursor-pointer transition-colors duration-200 ease-in-out")
                .text(day)
                .attr("id", fullDate)
                .click(function () {      
                const selectedDate = $(this).attr("id");
                $("#calendarDays button").removeClass("bg-gray-600");
                if(!isToday){
                    $(this).addClass("bg-gray-600")
                }
                 // call getEvents(selectedDate) here to get the events of the designated date 
                getEvents(selectedDate)
                updateWeekViewHeader(selectedDate);
            });
                

            if (!isCurrentMonth) {
                dayElement.addClass("text-gray-500"); // Previous/next month days
            } else {
                dayElement.addClass("text-white"); // Current month days
            }

            if (isToday) {
                dayElement.addClass("bg-blue-500"); // Highlight today
            } else {
                dayElement.addClass("hover:bg-gray-700");
            }

            calendarGrid.append(dayElement);
        });
    }

   




    // Previous month button
    $("#prevMonth").click(function () {
        currentMonth = currentMonth === 1 ? 12 : currentMonth - 1;
        currentYear = currentMonth === 12 ? currentYear - 1 : currentYear;
        fetchCalendar(currentYear, currentMonth);
    });

    // Next month button
    $("#nextMonth").click(function () {
        currentMonth = currentMonth === 12 ? 1 : currentMonth + 1;
        currentYear = currentMonth === 1 ? currentYear + 1 : currentYear;
        fetchCalendar(currentYear, currentMonth);
    });

    // Initial fetch
    fetchCalendar(currentYear, currentMonth);

    
});
