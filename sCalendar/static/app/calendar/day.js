

function getEvents(date = null) {
    let currentDate;
        if (date) {
        currentDate = date;
    } else {
        let today = new Date();
        currentDate = today.toISOString().split("T")[0];
    }


    let displayDate = new Date(currentDate);
    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let formatted = displayDate.toLocaleDateString('en-US', options);

    document.getElementById("event-date-header").innerText = formatted;

    $.ajax({
        type: "GET",
        url: "api/calendar/filter_note/",
        data: {
            start_date: currentDate,
            end_date: currentDate
        },
        success: function (response) {
            console.log("day view response:",response)
            displayEvents(response)
        },
        error: function (xhr, status, error) {
            console.error(error);
        }

    })
}
function displayEvents(events) {
    $(".time").find(".event-box").remove();

    const containerWidth = $(".day-column").width(); // Now correct
    const gap = 6;

    const parsed = parseAndSort(events);
    const clusters = groupOverlapping(parsed);

    clusters.forEach(cluster => renderCluster(cluster, 0, containerWidth, gap));
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



function renderCluster(cluster, containerLeft = 0) {
    cluster.forEach(event => {
        const top = event.start * 60;
        const height = Math.max((event.end - event.start) * 60, 60);

        const startTime = event.start_time.slice(0, 5);
        const endTime = event.end_time.slice(0, 5);

        const html = `
            <div 
                class="event-box absolute text-white px-3 py-2 rounded-lg shadow-md text-sm leading-tight border border-blue-600 hover:bg-blue-600 transition-all duration-150 overflow-hidden w-full "
                style="
                    top: ${top}px; 
                    left: ${containerLeft}px; 
                    height: ${height}px; 
                    background-color: ${event.color || '#3B82F6'};
                "
            >
                <div class="font-semibold truncate">${event.note_title}</div>

            </div>
        `;

        $(".time").append(html);
    });
}

getEvents();




// there is a problem in col width we need to fix the width on how its being calculated


//here every thing is fine all we need to fix the col width to 100%