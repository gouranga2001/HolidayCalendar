$(document).ready(function () {
    $("#openSidebar").click(function () {
        $("#sidebar").removeClass("-translate-x-full");  // Show sidebar
    });

    $("#closeSidebar").click(function () {
        $("#sidebar").addClass("-translate-x-full");  // Hide sidebar
    });

    $(document).click(function (event) {
        if (!$("#sidebar").is(event.target) && $("#sidebar").has(event.target).length === 0 && !$("#openSidebar").is(event.target)) {
            $("#sidebar").addClass("-translate-x-full");  // Hide sidebar
        }
    });

    console.log("sidebar.js is loaded!");

    $("#addNote").click(function () {
        $("#modal").removeClass("hidden");
        if (!$("#modal").hasClass("hidden")) {
            $("#closeSidebar").trigger("click");
        }
    });

    $("#close_modal_button").click(function () {
        $("#modal").addClass("hidden");
    });

    // Close modal when clicking outside
    $(document).mouseup(function (e) {
        let modal = $("#modal");
        let addNoteBtn = $("#addNote");

        // If click is NOT inside the modal AND NOT on the "Add Note" button, close the modal
        if (!modal.is(e.target) && modal.has(e.target).length === 0 && !addNoteBtn.is(e.target)) {
            modal.addClass("hidden");
        }
    });
});

