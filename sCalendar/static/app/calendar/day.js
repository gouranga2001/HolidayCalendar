
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

    const containerLeft = 150;
    const containerRight = 16;
    const gap = 6;
    const containerWidth = $(".time").width() - containerLeft - containerRight;

    const parsed = parseAndSort(events);
    const clusters = groupOverlapping(parsed);
    
    clusters.forEach(cluster => renderCluster(cluster, containerLeft, containerWidth, gap));
}

function parseAndSort(events) {
    return events.map((e, i) => {
        const toHour = time => {
            const [h, m] = time.split(":").map(Number);
            return h + m / 60;
        };
        return { ...e, id: i, start: toHour(e.start_time), end: toHour(e.end_time) };
    }).sort((a, b) => a.start - b.start);
}

function groupOverlapping(events) {
    const clusters = [];
    let current = [];

    events.forEach(event => {
        const lastEnd = Math.max(...current.map(e => e.end), -Infinity);
        if (event.start < lastEnd) {
            current.push(event);
        } else {
            if (current.length) clusters.push(current);
            current = [event];
        }
    });
    if (current.length) clusters.push(current);
    return clusters;
}

function renderCluster(cluster, containerLeft, containerWidth, gap) {
    const cols = cluster.length;
    const totalGap = (cols - 1) * gap;
    const colWidth = (containerWidth - totalGap) / cols;

    cluster.forEach((event, i) => {
        const top = event.start * 60;
        const height = Math.max((event.end - event.start) * 60, 30);
        const left = containerLeft + i * (colWidth + gap);

        const html = `
            <div class="event-box absolute bg-blue-500 text-white p-2 rounded-md shadow-md text-[13px] leading-tight"
                 style="top: ${top}px; height: ${height}px; left: ${left}px; width: ${colWidth}px;">
                <p class="font-bold">${event.note_title}</p>
            </div>
        `;
        $(".time").append(html);
    });
}


   getEvents();
   
});


