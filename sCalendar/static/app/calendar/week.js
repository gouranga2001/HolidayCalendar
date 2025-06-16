$(document).ready(function (){


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

