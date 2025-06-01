
$(document).ready(function(){
    // function to show the respectative view when clicking on the navbar
    $('#dayView, #monthView').hide();
    $(' #weekView').show();
    $('.day, .week, .month').click(function(){
        const viewMap = {
            'day': '#dayView',
            'week': '#weekView',
            'month': '#monthView'
        };
        // Get the class name of the clicked button (either day, week, or month)
        const selectedClass = $(this).attr('class').split(' ').filter(cls => viewMap[cls])[0];
        $('#dayView, #weekView, #monthView').hide();
        $(viewMap[selectedClass]).show();
    });
});

