$(document).ready(function () {
    let isButtonActive = "Week"; // Default state
    let searchTimeout = null;

    function performSearch(query, isMobile = false) {
        $.ajax({
            url: `api/calendar/search/?search=${encodeURIComponent(query)}`,
            method: "GET",
            success: function (data) {
                // console.log("Search results:", data);

                let resultsContainer = isMobile ? $("#mobileSearchResults") : $("#desktopSearchResults");
                resultsContainer.empty(); // clear old results

                if (data.length === 0) {
                    resultsContainer.append(`<div class="p-2 text-gray-500 text-sm">No results found</div>`);
                } else {
                    for (let i = 0; i < data.length; i++) {
                        let item = data[i];
                        resultsContainer.append(`
                            <div class="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                                data-id="${item.id}">
                                ${item.note_title}
                            </div>
                        `);
                    }
                }

                resultsContainer.removeClass("hidden");
            },
            error: function (err) {
                console.error("Search error:", err);
            }
        });
    }


    // Debounce input (desktop + mobile)
    $("#desktopSearchInput").on("input", function () {
        let query = $(this).val().trim();
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(function () {
            if (query.length > 0) {
                performSearch(query, false); // desktop
            } else {
                $("#desktopSearchResults").addClass("hidden");
            }
        }, 400);
    });

    $("#mobileSearchInput").on("input", function () {
        let query = $(this).val().trim();
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(function () {
            if (query.length > 0) {
                performSearch(query, true); // mobile
            } else {
                $("#mobileSearchResults").addClass("hidden");
            }
        }, 400);
    });


    // Function to update the state consistently
    function updateState(newState) {
        isButtonActive = newState;

        // Update dropdown text
        $(".dropdown-button span").text(isButtonActive);


        //update next-previous button name according to the active button

        const viewBtn = document.getElementById("view_day_week_month");
        if (viewBtn) {
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

        // Sync with views
        if (isButtonActive === "Day") {
            getEvents(getGlobalDate());
        } else if (isButtonActive === "Week") {
            renderWeek(getGlobalDate());
        } else if (isButtonActive === "Month") {
            renderMonthGrid(getGlobalDate());
        }
    }

    // Initialize state on page load
    updateState(isButtonActive);

    // Handle dropdown menu button click
    $(".dropdown-button").click(function () {
        $(".dropdown-menu").toggleClass("hidden");
    });

    $(".dropdown-menu button").click(function () {
        let newState = $(this).text();
        $(".dropdown-menu").addClass("hidden");
        updateState(newState);
    });

    // Handle desktop menu button click
    $(".desktop-menu").click(function () {
        let newState = $(this).text();
        updateState(newState);
    });


});
