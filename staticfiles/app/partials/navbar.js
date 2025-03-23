$(document).ready(function () {
    let isButtonActive = "Week";

    $(".dropdown-button").click(function () {
        $(".dropdown-menu").toggleClass("hidden");
    });

    $(".dropdown-menu button").click(function () {
        isButtonActive = $(this).text();
        $(".dropdown-button span").text(isButtonActive);
        $(".dropdown-menu").addClass("hidden");
    });

    $(".desktop-menu").click(function () {
        isButtonActive = $(this).text();
        $(".desktop-menu").removeClass("bg-[#dc2625] text-white").addClass("hover:bg-gray-200");
        $(this).addClass("bg-[#dc2625] text-white").removeClass("hover:bg-gray-200");
    });
});

