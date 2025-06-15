// Show toast with slide down animation
function showToast(message) {
    $('#toast-message').text(message);
    $('#toast')
    .css({ right: '-100%', display: 'block' }) // Start off-screen
        .animate({ right: '1rem' }, 2000) // Slide in
        .delay(3000) // Keep it visible for 3 seconds
        .animate({ right: '-100%' }, 300, function() {
        $(this).hide(); // Hide after sliding out
        });
}

// Hide toast with fade out animation
function hideToast() {
    $('#toast').fadeOut(300);
}

// Close button handler
$('#toast button').on('click', function() {
    hideToast();
});
