$(document).ready(function () {
    // Handle ENTER key in both inputs
    $("#desktopSearchInput, #mobileSearchInput").on("keypress", function (e) {
        if (e.which === 13) {
            let query = $(this).val().trim();
            if (query) {
                showSearchView(query);
            }
        }
    });

    // Handle click on dropdown results
    $(document).on("click", "#desktopSearchResults div, #mobileSearchResults div", function () {
        $("#desktopSearchResults, #mobileSearchResults").addClass("hidden").empty();
        $("#desktopSearchInput, #mobileSearchInput").val("");
        let query = $(this).text().trim();

        if (query) {
            // Hide mobile overlay if open
            $("#mobileSearchOverlay").addClass("hidden");

            showSearchView(query);
        }
    });

    // Handle Enter key in search inputs
    $("#desktopSearchInput, #mobileSearchInput").on("keypress", function (e) {
        if (e.which === 13) {
            let query = $(this).val().trim();
            if (query) {
                // Hide mobile overlay if open
                $("#mobileSearchOverlay").addClass("hidden");

                // hide other views
                $('#dayView, #weekView, #monthView').hide();
                // show search view
                $('#searchView').show();
                // call your AJAX search
                performSearch(query);
            }
        }
    });

    // Delegate click for search result cards
    // $(document).on("click", "#searchResults .search-result-card", function () {
    //     let startDate = $(this).data("date"); // stored below in card HTML
    //     let targetDate = new Date(startDate);

    //     console.log("Opening month view for:", targetDate);

    //     // Set the global date (so month.js can use it)
    //     setGlobalDate(targetDate);

    //     // Hide search view, show month view
    //     $('#searchView').hide();
    //     $('#dayView, #weekView').hide();
    //     $('#monthView').show();

    //     // Re-render month grid with selected date
    //     renderMonthGrid(targetDate);
    // });
});

// Dedicated function for SearchView rendering
function showSearchView(query) {
    // Hide other views
    $('#dayView, #weekView, #monthView').hide();

    // Inject the white wrapper first
    $('#searchView').show().html(`
        <div class="outer relative shadow-lg bg-white rounded-md transition-all min-h-screen">
            <div id="searchResults" class="p-4">
                <div class="p-2 text-gray-400 text-sm">Searching...</div>
            </div>
        </div>
    `);

    $.ajax({
        url: `api/calendar/search/?search=${encodeURIComponent(query)}`,
        method: "GET",
        success: function (data) {
            let resultsContainer = $("#searchResults");
            resultsContainer.empty();

            if (data.length === 0) {
                resultsContainer.append(`<div class="p-2 text-gray-500 text-sm">No results found</div>`);
            } else {
                for (let i = 0; i < data.length; i++) {
                    let item = data[i];
                    resultsContainer.append(`
                        <div class="search-result-card p-4 border rounded-lg shadow hover:bg-gray-50 cursor-pointer mb-2 flex items-start gap-4" data-id="${item.id}" data-date="${item.start_date}">
                            <!-- Date Circle -->
                            <div class="flex flex-col items-center">
                                <div class="w-12 h-12 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold text-sm">
                                    ${new Date(item.start_date).getDate()}
                                </div>
                                <span class="text-xs text-gray-600 mt-1">
                                    ${new Date(item.start_date).toLocaleString('default', { month: 'short' })} ${new Date(item.start_date).getFullYear()}
                                </span>
                            </div>

                            <!-- Event Content -->
                            <div class="flex-1">
                                <h3 class="font-semibold text-lg">${item.note_title}</h3>
                                <p class="text-sm text-gray-600 mt-1">${item.note_description || ''}</p>
                            </div>
                        </div>
                    `);



                }
            }
            // start_date: "2025-03-30T18:30:00"
        },
        error: function (err) {
            console.error("Search error:", err);
        }
    });
}
