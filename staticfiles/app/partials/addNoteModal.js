$('#createNote').submit(function (e){

        e.preventDefault();

        const data = {
        title:$('#title').val(),
        description:$('#text').val(),
        startDate:$('#startDate').val(),
        endDate:$('#endDate').val(),
        startTime:$('#startTime').val(),
        endTime:$('#endTime').val(),
    };
    $.ajax({
        type:'POST',
        url:'http://127.0.0.1:8000/api/calendar/createnote/',
        data:JSON.stringify(data),
        contentType: "application/json",
        dataType: "json",

        encode: True,

    }).done((data) => {
    console.log({ data });
    })
    
    // .always(() => {
    //   console.log('always called');
    // });
    console.log('modal is loaded')
})