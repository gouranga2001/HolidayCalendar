
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
    $(".time").find(".event-box").remove();

    // Constants
    const containerLeft = 150; // Left padding of the time slot
    const containerRight = 16; // Tailwind right-4 = 16px
    const containerWidth = $(".time").width() - containerLeft - containerRight;
    const gap = 6;

    // Parse event times and sort
    const parsedEvents = events.map((e, i) => {
        const [sh, sm] = e.start_time.split(":").map(Number);
        const [eh, em] = e.end_time.split(":").map(Number);
        return {
            ...e,
            id: i,
            start: sh + sm / 60,
            end: eh + em / 60
        };
    }).sort((a, b) => a.start - b.start);

    // Group into clusters of overlapping events
    const clusters = [];
    let currentCluster = [];

    parsedEvents.forEach(event => {
        if (currentCluster.length === 0) {
            currentCluster.push(event);
        } else {
            const last = currentCluster[currentCluster.length - 1];
            if (event.start < Math.max(...currentCluster.map(e => e.end))) {
                currentCluster.push(event);
            } else {
                clusters.push([...currentCluster]);
                currentCluster = [event];
            }
        }
    });
    if (currentCluster.length) clusters.push(currentCluster);

    // Render each cluster
    clusters.forEach(cluster => {
        const columnCount = cluster.length;
        const totalGap = (columnCount - 1) * gap;
        const colWidth = (containerWidth - totalGap) / columnCount;

        cluster.forEach((event, index) => {
            const top = event.start * 60;
            const duration = event.end - event.start;
            const height = Math.max(duration * 60, 30);
            const left = containerLeft + index * (colWidth + gap);

            const eventBox = `
                <div class="event-box absolute bg-blue-500 text-white p-2 rounded-md shadow-md text-[13px] leading-tight"
                    style="top: ${top}px; height: ${height}px; left: ${left}px; width: ${colWidth}px;">
                    <p class="font-bold">${event.note_title}</p>
                </div>
            `;

            $(".time").append(eventBox);
        });
    });
}


   getEvents();
   
});


