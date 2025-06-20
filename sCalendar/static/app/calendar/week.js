$(document).ready(function () {


    const startHour = 0;
    const endHour = 23;
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const today = new Date();
    const startOfWeek = new Date(today);
    const dayOfWeek = today.getDay(); // Sunday = 0
    const offset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Monday-start week
    startOfWeek.setDate(today.getDate() + offset);

    // ---- Time Column: skip first row for header ----
    const $timeColumn = $('.time-column');
    $timeColumn.append($('<div>', { class: 'h-[60px]' })); // Empty top row

    for (let h = startHour; h <= endHour; h++) {
        const period = h >= 12 ? 'PM' : 'AM';
        const hour = h === 0 ? 12 : (h > 12 ? h - 12 : h);
        const $timeBlock = $('<div>', {
            class: 'h-[60px] text-right pr-2 text-xs text-gray-500 pt-1',
            text: `${hour} ${period}`
        });
        $timeColumn.append($timeBlock);
    }

    // ---- Day Header Row (Day names + dates) ----
    const $dayHeader = $('.day-header');
    for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);

        const dayName = days[i];
        const dayDate = `${date.getDate()}/${date.getMonth() + 1}`; // Format: DD/MM

        const $col = $('<div>', {
            class: 'text-center text-sm text-gray-700 pt-4 font-medium border-r border-gray-300 bg-white',
            html: `<div>${dayName}</div><div class="text-xs text-gray-500">${dayDate}</div>`
        });

        $dayHeader.append($col);
    }

    // ---- Grid Rows per Day (24 hour blocks) ----
    const $weekGrid = $('.week-grid');
    for (let d = 0; d < 7; d++) {
        const $dayCol = $('<div>', { class: 'border-r border-gray-200 relative' });
        for (let h = 0; h <= endHour; h++) {
            const $slot = $('<div>', {
                class: 'h-[60px] border-t border-dotted border-gray-300'
            });
            $dayCol.append($slot);
        }
        $weekGrid.append($dayCol);
    }
    getWeekEvents();
})
function updateWeekViewHeader(selectedDateStr) {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const selectedDate = new Date(selectedDateStr);

    // Calculate start of the week (Monday)
    const dayOfWeek = selectedDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const offset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Monday-start week
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() + offset);

    // Clear current header
    const $dayHeader = $('.day-header');
    $dayHeader.empty();

    // Rebuild headers from Monday to Sunday
    for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);

        const dayName = days[i];
        const dayDate = `${date.getDate()}/${date.getMonth() + 1}`;

        const $col = $('<div>', {
            class: 'text-center text-sm text-gray-700 pt-4 font-medium border-r border-gray-300 bg-white',
            html: `<div>${dayName}</div><div class="text-xs text-gray-500">${dayDate}</div>`
        });

        $dayHeader.append($col);
    }
}

function getWeekEvents(selectedDateStr = null) {
    const today = selectedDateStr ? new Date(selectedDateStr) : new Date();
    const dayOfWeek = today.getDay();
    const offset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + offset);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const startStr = monday.toISOString().split("T")[0];
    const endStr = sunday.toISOString().split("T")[0];

    $.ajax({
        type: "GET",
        url: "api/calendar/filter_note/",
        data: {
            start_date: startStr,
            end_date: endStr
        },
        success: function (response) {
            renderWeekEvents(response);
            console.log("week view response: ", response);

        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });
}


function renderWeekEvents(events) {
    $(".week-grid .event-box").remove(); // Clean previous

    const columns = $(".week-grid").children();
    console.log("Rendering events... columns:", columns.length); // Expect 7

    const toHour = time => {
        const [h, m] = time.split(":").map(Number);
        return h + m / 60;
    };

    events.forEach(event => {
        console.log("Event:", event);

        const date = new Date(event.start_date);
        const dayIndex = (date.getDay() + 6) % 7; // Map Sunday=0 to index 6
        console.log("Date:", event.start_date, "→ dayIndex:", dayIndex);

        const start = toHour(event.start_time);
        const end = toHour(event.end_time);
        const top = start * 60;
        const height = Math.max((end - start) * 60, 60);

        const startTime = event.start_time.slice(0, 5);
        const endTime = event.end_time.slice(0, 5);

        const $event = $(`
    <div 
        class="event-box absolute text-white px-2 py-1 rounded-lg shadow-md text-xs border border-blue-600 hover:bg-blue-600 transition-all duration-150 overflow-hidden"
        style="
            top: ${top}px;
            height: ${height}px;
            left: 2px;
            right: 2px;
            width: calc(100% - 4px);
            background-color: ${event.color || '#3B82F6'};
        "
    >
        <div class="font-semibold truncate">${event.note_title}</div>
        <div class="text-[10px] opacity-90 mt-1">${startTime} - ${endTime}</div>
    </div>
`);


        if (columns[dayIndex]) {
            $(columns[dayIndex]).append($event);
        } else {
            console.warn("Invalid dayIndex:", dayIndex, "→ event skipped");
        }
    });
}

