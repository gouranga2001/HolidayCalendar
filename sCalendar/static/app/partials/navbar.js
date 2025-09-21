$(document).ready(function () {
    let isButtonActive = "Week"; // Default state
    let searchTimeout = null;

    function performSearch(query, isMobile = false) {
        $.ajax({
            url: `api/calendar/search/?search=${encodeURIComponent(query)}`,
            method: "GET",
            success: function (data) {
                console.log("Search results:", data);

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
    // Mobile Search Overlay Toggle
    $("#mobileSearchBtn").on("click", function () {
        $("#mobileSearchOverlay").removeClass("hidden");
        $("#mobileSearchOverlay input").focus();
    });

    // Close on outside click
    $("#mobileSearchOverlay").on("click", function (e) {
        if (e.target.id === "mobileSearchOverlay") {
            $(this).addClass("hidden");
        }
    });



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

    // Delegate click for search result cards
    $(document).on("click", "#searchResults .search-result-card", function () {
        let startDate = $(this).data("date"); // stored in card HTML
        let targetDate = new Date(startDate);

        console.log("Opening month view for:", targetDate);

        // Set the global date (so month.js can use it)
        setGlobalDate(targetDate);

        // Switch navbar state to "Month" (this will auto-show month view)
        updateState("Month");

        // Also ensure month view re-renders with correct date
        renderMonthGrid(targetDate);

        // Hide search view after navigation
        $('#searchView').hide();
    });


    // Function to update the state consistently
    function updateState(newState) {
        isButtonActive = newState;

        // Update dropdown text
        $(".dropdown-button span").text(isButtonActive);

        // Update next-previous button
        const viewBtn = document.getElementById("view_day_week_month");
        if (viewBtn) {
            viewBtn.innerHTML = isButtonActive;
        }

        // Reset styles
        $(".desktop-menu")
            .removeClass("bg-[#dc2625] text-white")
            .addClass("hover:bg-gray-200");

        // Highlight active button
        $(".desktop-menu").filter(function () {
            return $(this).text() === isButtonActive;
        }).addClass("bg-[#dc2625] text-white").removeClass("hover:bg-gray-200");

        // Hide all views
        $('#dayView, #weekView, #monthView, #searchView').hide();

        // Show relevant view
        if (isButtonActive === "Day") {
            $('#dayView').show();
            getEvents(getGlobalDate());
        } else if (isButtonActive === "Week") {
            $('#weekView').show();
            renderWeek(getGlobalDate());
        } else if (isButtonActive === "Month") {
            $('#monthView').show();
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


