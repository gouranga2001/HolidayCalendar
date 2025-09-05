let currentMonthDate = new Date(); 


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

     $("#prevBtn").click(function () {
        currentMonthDate.setMonth(currentMonthDate.getMonth() - 1);
        renderMonthGrid(currentMonthDate);
    });

    // Next button (go one month forward)
    $("#nextBtn").click(function () {
        currentMonthDate.setMonth(currentMonthDate.getMonth() + 1);
        renderMonthGrid(currentMonthDate);
    });
});

function formatDateLocal(date) {
    return date.getFullYear() + '-' +
        String(date.getMonth() + 1).padStart(2, '0') + '-' +
        String(date.getDate()).padStart(2, '0');
}


function renderMonthGrid(selectedDate = new Date()) {
    const $monthGrid = $('.month-grid');
    $monthGrid.empty();

    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth(); // 0-indexed

    const monthName = selectedDate.toLocaleString("en-US", { month: "long" });
    $("#month-date-header").text(`${monthName} ${year}`);

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
    const startDate = formatDateLocal(new Date(year, month - 1, 1));
    const endDate = formatDateLocal(new Date(year, month, 0));

    $.ajax({
        type: "GET",
        url: "/api/calendar/filter_note/",
        data: {
            start_date: startDate,
            end_date: endDate
        },
        success: function (response) {
            renderMonthEvents(response);
            console.log("month view response:", response)
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });
}

function renderMonthEvents(events) {
    $(".month-grid .event-box").remove(); // Clear old boxes

    events.forEach(event => {
        const start = new Date(event.start_date);
        const end = new Date(event.end_date);

        // Loop through all days from start → end
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            const dateStr = formatDateLocal(d);

            const $targetCell = $(`.month-grid [data-date="${dateStr}"]`);

            if ($targetCell.length) {
                const $event = $(`
                    <div 
                        class="event-box mt-1 px-2 py-[3px] rounded bg-blue-500 text-white text-[10px] leading-snug truncate shadow-sm border border-blue-700 hover:bg-blue-600 transition-all mr-4"
                        title="${event.note_title} (${event.start_time.slice(0, 5)} - ${event.end_time.slice(0, 5)})"
                    >
                        <div class="font-medium truncate">${event.note_title}</div>
                    </div>
                `);

                $targetCell.append($event);
            }
        }
    });
}
