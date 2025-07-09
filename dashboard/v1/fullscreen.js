// =============================================
// Fullscreen Control Functions for DHC
// =============================================

// Check if fullscreen is active
dhc.app.inFullscreen = function() {
    if (typeof dhc !== 'undefined' && dhc.app && dhc.app.inFullscreen) {
        return dhc.app.inFullscreen();
    }
    // Fallback for browser testing
    return !!(document.fullscreenElement || document.webkitFullscreenElement || 
             document.mozFullScreenElement || document.msFullscreenElement);
};

// Enter fullscreen mode
dhc.app.enterFullscreen = function() {
    if (typeof dhc !== 'undefined' && dhc.app && dhc.app.enterFullscreen) {
        return dhc.app.enterFullscreen();
    }
    // Fallback for browser testing
    const element = document.documentElement;
    if (element.requestFullscreen) element.requestFullscreen();
    else if (element.webkitRequestFullscreen) element.webkitRequestFullscreen();
    else if (element.mozRequestFullScreen) element.mozRequestFullScreen();
    else if (element.msRequestFullscreen) element.msRequestFullscreen();
};

// Exit fullscreen mode
dhc.app.exitFullscreen = function() {
    if (typeof dhc !== 'undefined' && dhc.app && dhc.app.exitFullscreen) {
        return dhc.app.exitFullscreen();
    }
    // Fallback for browser testing
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
    else if (document.msExitFullscreen) document.msExitFullscreen();
};

// Toggle fullscreen mode
dhc.app.toggleFullscreen = function() {
    if (dhc.app.inFullscreen()) {
        dhc.app.exitFullscreen();
    } else {
        dhc.app.enterFullscreen();
    }
};

// =============================================
// F11 Key Binding for Fullscreen Toggle
// =============================================
document.addEventListener('keydown', function(event) {
    if (event.key === 'F11') {
        event.preventDefault(); // Prevent default browser fullscreen
        dhc.app.toggleFullscreen(); // Use DHC's fullscreen toggle
    }
});

// =============================================
// Fullscreen Change Listener (updates UI)
// =============================================
function setupFullscreenChangeListener() {
    const eventNames = [
        'fullscreenchange',
        'webkitfullscreenchange',
        'mozfullscreenchange',
        'MSFullscreenChange'
    ];
    
    eventNames.forEach(eventName => {
        document.addEventListener(eventName, function() {
            const isFullscreen = dhc.app.inFullscreen();
            console.log('Fullscreen state changed:', isFullscreen);
            
            // Update a button's text (if you have one)
            const fsButton = document.getElementById('fullscreen-button');
            if (fsButton) {
                fsButton.textContent = isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen';
            }
        });
    });
}

// =============================================
// Initialize Fullscreen Functionality on Load
// =============================================
document.addEventListener('DOMContentLoaded', function() {
    setupFullscreenChangeListener();
    
    // Optional: Start in fullscreen automatically
    // dhc.app.enterFullscreen();
});