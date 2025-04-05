
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
        let [sh, sm] = event.start_time.split(":").map(Number);
        let [eh, em] = event.end_time.split(":").map(Number);

        let startHour = sh + sm / 60;
        let endHour = eh + em / 60;
        let duration = endHour - startHour;

        // Each hour = 60px height → total 1440px
        let top = startHour * 60;
        let height = Math.max(duration * 60, 30);  // Minimum height: 30px


        const eventBox = `
            <div class="event-box absolute left-[150px] right-4 bg-blue-500 text-white p-2 rounded-md shadow-md"
                 style="top: ${top}px; height: ${height}px;">
                <p class="font-bold text-[13px] leading-tight">${event.note_title}</p>
                <p class="text-[12px] leading-snug">${event.note_description}</p>

            </div>
        `;

        $(".time").append(eventBox);
    });
}

   getEvents();
   
});


