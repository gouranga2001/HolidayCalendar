// $(document).ready(function () {
//     $(".event-slot").click(function () {
//         let selectedHour = $(this).data("hour");
//         alert("You clicked on hour: " + selectedHour);
//     });
// });

$(document).ready(function () {
    function loadEvents(date) {
        $.ajax({
            url: "/api/calendar/filter_note/", // Make sure this is the correct URL
            type: "GET",
            data: {
                start_date: date,
                end_date: date
            },
            success: function (data) {
                console.log(data); // Debug to check if correct data is being received
                displayEvents(data);
            },
            error: function (xhr, status, error) {
                console.error("Error loading events:", error);
            }
        });
    }

    function displayEvents(events) {
        $(".event").remove(); // Remove old events before reloading

        events.forEach(event => {
            let startHour = parseInt(event.start_time.split(":")[0]);
            let startMinutes = parseInt(event.start_time.split(":")[1]);
            let endHour = parseInt(event.end_time.split(":")[0]);
            let endMinutes = parseInt(event.end_time.split(":")[1]);

            let duration = ((endHour * 60 + endMinutes) - (startHour * 60 + startMinutes)); // Duration in minutes

            // Find the correct hour block using data-hour attribute
            let $hourBlock = $(`.time [data-hour="${startHour}"] .event-container`);

            if ($hourBlock.length) {
                let eventHtml = `
                <div class="absolute left-0 bg-blue-500 text-white p-2 rounded-md shadow-md event"
                    style="
                        top: ${startMinutes * (8 / 60)}rem; /* Adjust positioning within the hour */
                        height: ${(duration / 60) * 8}rem; /* Height based on duration */
                        width: calc(100% - 1rem);
                    ">
                    ${event.note_title}
                </div>
            `;
                $hourBlock.append(eventHtml);
            }
        });
    }

    // Load today's events by default
    let currentDate = new Date().toISOString().split('T')[0];
    loadEvents(currentDate);
});


