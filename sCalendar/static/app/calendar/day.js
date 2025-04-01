
$(document).ready(function () {
   function getEvents(){
    let today = new Date();
    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed, so add 1
    let day = String(today.getDate()).padStart(2, '0'); // Ensure two digits

    let currentDate = `${year}-${month}-${day}`;
    console.log(currentDate);

    $.ajax({
        type:"GET",
        url: "api/calendar/filter_note/",
        data:{  
                start_date : currentDate,
                end_date : currentDate
            },
        success: function(response){
            console.log(response)
            displayEvents(response)
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
        
    })
   }
   function displayEvents(events) {
    $(".time").find(".event-box").remove(); // Clear previous events

    events.forEach(event => {
        let startTime = event.start_time.split(":");  // Split time (HH:MM:SS)
        let endTime = event.end_time.split(":");

        let startHour = parseInt(startTime[0]) + parseInt(startTime[1]) / 60;
        let endHour = parseInt(endTime[0]) + parseInt(endTime[1]) / 60;

        let duration = endHour - startHour;  // Calculate duration in hours

        let topPercentage = Math.round((startHour / 24) * 100);
        let heightPercentage = Math.round((duration / 24) * 100);

        let eventBox = `
            <div class="event-box absolute left-1/4 w-3/4 bg-blue-500 text-white p-2 rounded-md shadow-md"
                 style="top: ${topPercentage}%; height: ${heightPercentage}%; position: absolute; transition: all 0.3s ease-in-out;">
                <p class="font-bold">${event.note_title}</p>
                <p class="text-sm">${event.note_description}</p>
            </div>
        `;

        $(".time").append(eventBox); // Add event to the timeline
    });
}
   getEvents();
   
});


