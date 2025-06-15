$(document).ready(function () {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    // --- Header Row ---
    const $monthHeader = $('.month-header');
    days.forEach(day => {
        const $col = $('<div>', {
            class: 'text-center text-sm text-gray-700 pt-4 font-medium border-r border-gray-300 bg-white',
            text: day
        });
        $monthHeader.append($col);
    });

    // --- Month Grid ---
    const $monthGrid = $('.month-grid');
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth(); // 0-based

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const totalDays = lastDayOfMonth.getDate();
    const startDay = (firstDayOfMonth.getDay() + 6) % 7; // Monday = 0

    const totalCells = Math.ceil((startDay + totalDays) / 7) * 7;

    for (let i = 0; i < totalCells; i++) {
        const dayNum = i - startDay + 1;
        const isCurrentMonth = dayNum >= 1 && dayNum <= totalDays;

        const $cell = $('<div>', {
            class: `border border-gray-200 p-1 text-xs text-gray-700 relative overflow-hidden ${isCurrentMonth ? '' : 'bg-gray-50 text-gray-300'}`
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
});
