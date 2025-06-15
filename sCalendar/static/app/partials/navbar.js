$(document).ready(function () {
    let isButtonActive = "Week"; // Default state

    // ✅ Function to update the state consistently
    function updateState(newState) {
        isButtonActive = newState;

        // Update dropdown text
        $(".dropdown-button span").text(isButtonActive);


        //update next-previous button name according to the active button

        const viewBtn = document.getElementById("view_day_week_month");
        if (viewBtn){
            viewBtn.innerHTML = isButtonActive;
        }

        // Remove active styles from desktop menu
        $(".desktop-menu")
            .removeClass("bg-[#dc2625] text-white")
            .addClass("hover:bg-gray-200");

        // Add active style to the matching desktop button
        $(".desktop-menu").filter(function () {
            return $(this).text() === isButtonActive;
        }).addClass("bg-[#dc2625] text-white").removeClass("hover:bg-gray-200");
    }

    // ✅ Initialize state on page load
    updateState(isButtonActive);

    // ✅ Handle dropdown menu button click
    $(".dropdown-button").click(function () {
        $(".dropdown-menu").toggleClass("hidden");
    });

    $(".dropdown-menu button").click(function () {
        let newState = $(this).text();
        $(".dropdown-menu").addClass("hidden");
        updateState(newState);
    });

    // ✅ Handle desktop menu button click
    $(".desktop-menu").click(function () {
        let newState = $(this).text();
        updateState(newState);
    });


});
