$(document).ready(function () {
    $('#createNote').submit(function (e) {
        e.preventDefault();
        const data = {
            note_title: $('#title').val(),  // Updated to match model field
            note_description: $('#text').val(),
            start_date: $('#startDate').val(),
            end_date: $('#endDate').val(),
            start_time: $('#startTime').val(),
            end_time: $('#endTime').val(),
        };

        function getCSRFToken() {
            return $('input[name="csrfmiddlewaretoken"]').val();
        }

        $.ajax({
            method: 'POST',
            url: 'http://127.0.0.1:8000/api/calendar/createnote/',
            data: JSON.stringify(data),
            headers: { 'X-CSRFToken': getCSRFToken() },
            contentType: "application/json",
            dataType: "json",
        }).done((response) => {
            $('#createNote')[0].reset();
            $('#modal').addClass("hidden");
            showToast('Note Created Successfully')
        })
        // .fail((jqXHR, textStatus, errorThrown) => {
        //     console.error("AJAX Error:", textStatus, errorThrown);
        //     console.log(jqXHR.responseText);
        //     alert('Failed to create note: ' + jqXHR.responseText);
        // });
    });
});
