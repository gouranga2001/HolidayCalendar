// ==========================
// Global State
// ==========================
let currentSelectedDate = getGlobalDate();

console.log("this is the current date", currentSelectedDate)
// ==========================
// Utility Functions
// ==========================
function formatDateLocal(date) {
    return date.getFullYear() + '-' +
        String(date.getMonth() + 1).padStart(2, '0') + '-' +
        String(date.getDate()).padStart(2, '0');
}

function toHour(time) {
    const [h, m] = time.split(":").map(Number);
    return h + m / 60;
}


// ==========================
// Rendering Functions
// ==========================
function updateWeekViewHeader(selectedDateStr) {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const selectedDate = new Date(selectedDateStr);

    // Calculate start of the week (Monday)
    const dayOfWeek = selectedDate.getDay();
    const offset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() + offset);

    // Clear current header
    const $dayHeader = $('.day-header');
    $dayHeader.empty();

    // Rebuild headers (Mon → Sun)
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

function renderWeekEvents(events) {
    $(".week-grid .event-box").remove(); // Clean previous
    const columns = $(".week-grid").children();

    events.forEach(event => {
        console.log("Event:", event);

        const date = new Date(event.start_date);
        const dayIndex = (date.getDay() + 6) % 7; // Map Sunday=0 → index 6

        const start = toHour(event.start_time);
        const end = toHour(event.end_time);

        const top = start * 60;
        const height = Math.max((end - start) * 60, 60);

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
            </div>
        `);

        if (columns[dayIndex]) {
            $(columns[dayIndex]).append($event);
        } else {
            console.warn("Invalid dayIndex:", dayIndex, "→ event skipped");
        }
    });
}

function renderWeek(date = getGlobalDate()) {
    const dateStr = formatDateLocal(date);
    setGlobalDate(date);             // keep global in sync
    updateWeekViewHeader(dateStr);
    getWeekEvents(dateStr);
}

// ==========================
// Data Fetching
// ==========================
function getWeekEvents(selectedDateStr = null) {
    const today = selectedDateStr ? new Date(selectedDateStr) : new Date();
    const dayOfWeek = today.getDay();
    const offset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

    const monday = new Date(today);
    monday.setDate(today.getDate() + offset);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    // ISO Week number
    const oneJan = new Date(monday.getFullYear(), 0, 1);
    const daysSince = Math.floor((monday - oneJan) / (24 * 60 * 60 * 1000));
    const isoWeek = Math.ceil((daysSince + oneJan.getDay() + 1) / 7);

    // Current month
    const month = monday.toLocaleString("en-US", { month: "long" });

    $("#week-date-header").text(`Week ${isoWeek} • ${month}`);

    // Fix timezone issue - use local date formatting instead of toISOString()
    const startStr = formatDateLocal(monday);
    const endStr = formatDateLocal(sunday);

    $.ajax({
        type: "GET",
        url: "api/calendar/filter_note/",
        data: {
            start_date: startStr,
            end_date: endStr
        },
        success: function (response) {
            console.log("week view response", response);
            renderWeekEvents(response);
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });
}


// ==========================
// Initialization
// ==========================
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

    // ---- Day Header Row ----
    const $dayHeader = $('.day-header');
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

    // ---- Grid Rows per Day ----
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

    // Initial render
    getWeekEvents();
    renderWeek(getGlobalDate());

    // ---- Hook prev/next buttons ----
    $("#prevBtn").click(function () {
        if ($("#view_day_week_month").text() === "Week") {
            const dt = getGlobalDate();      // get global
            dt.setDate(dt.getDate() - 7);    // shift 1 week back
            setGlobalDate(dt);               // update global
            renderWeek(dt);                  // re-render
        }
    });

    $("#nextBtn").click(function () {
        if ($("#view_day_week_month").text() === "Week") {
            const dt = getGlobalDate();      // get global
            dt.setDate(dt.getDate() + 7);    // shift 1 week forward
            setGlobalDate(dt);               // update global
            renderWeek(dt);                  // re-render
        }
    });

});
