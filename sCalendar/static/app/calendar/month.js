$(document).ready(function () {
    console.log("Month.js loaded and ready!...............................................");
    

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const $monthHeader = $('.month-header');
    days.forEach(day => {
        const $col = $('<div>', {
            class: 'text-center text-sm text-gray-700 pt-4 font-medium border-r border-gray-300 bg-white',
            text: day
        });
        $monthHeader.append($col);
    });

    // Month grid rendering
    renderMonthGrid();
});

function renderMonthGrid(selectedDate = new Date()) {
    const $monthGrid = $('.month-grid');
    $monthGrid.empty();

    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth(); // 0-indexed

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const totalDays = lastDayOfMonth.getDate();
    const startDay = (firstDayOfMonth.getDay() + 6) % 7; // Monday = 0
    const totalCells = Math.ceil((startDay + totalDays) / 7) * 7;

    for (let i = 0; i < totalCells; i++) {
        const dayNum = i - startDay + 1;
        const isCurrentMonth = dayNum >= 1 && dayNum <= totalDays;

        const $cell = $('<div>', {
            class: `border border-gray-200 p-1 text-xs text-gray-700 relative overflow-hidden min-h-[150px] ${isCurrentMonth ? '' : 'bg-gray-50 text-gray-300'}`,
            'data-date': isCurrentMonth ? `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}` : ''
        });

        if (isCurrentMonth) {
            const dateBox = $('<div>', {
                class: 'absolute top-1 right-1 text-[10px] text-gray-400',
                text: dayNum
            });
            $cell.append(dateBox);
        }

        $monthGrid.append($cell);
    }

    // Load events for current month
    getMonthEvents(year, month + 1);
}

function getMonthEvents(year, month) {
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = new Date(year, month, 0).toISOString().split("T")[0];

    $.ajax({
        type: "GET",
        url: "/api/calendar/filter_note/",
        data: {
            start_date: startDate,
            end_date: endDate
        },
        success: function (response) {
            renderMonthEvents(response);
            console.log("month view response:",response)
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });
}

function renderMonthEvents(events) {
    $(".month-grid .event-box").remove(); // Clear old boxes

    events.forEach(event => {
        const eventDate = event.start_date.split("T")[0]; // Extract "YYYY-MM-DD"
        const startTime = event.start_time.slice(0, 5);
        const endTime = event.end_time.slice(0, 5);

        const $targetCell = $(`.month-grid [data-date="${eventDate}"]`);

        if ($targetCell.length) {
            const $event = $(`
                <div 
                    class="event-box mt-1 px-2 py-[3px] rounded bg-blue-500 text-white text-[10px] leading-snug truncate shadow-sm border border-blue-700 hover:bg-blue-600 transition-all mr-4"
                    title="${event.note_title} (${startTime} - ${endTime})"
                >
                    <div class="font-medium truncate">${event.note_title}</div>
                    <div class="opacity-80 text-[9px]">${startTime} - ${endTime}</div>
                </div>
            `);
            $targetCell.append($event);
        } else {
            console.warn(`No matching cell found for ${eventDate}`);
        }
    });
}
