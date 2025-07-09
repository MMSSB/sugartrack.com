// accentcolor.js - Handles accent color application on all pages

/**
 * Applies the accent color to all registered elements
 * @param {string} color - Hex color string (#FF5733)
 */
function applyAccentColor(color) {
    if (!color) return;

    // Update CSS variables for global theme
    document.documentElement.style.setProperty('--primary', color);
    const lighterColor = lightenColor(color, 20);
    document.documentElement.style.setProperty('--primary-light', lighterColor);

    // Register elements to update + their CSS property
    const elementsToUpdate = [
        // Background color
        { selector: '.settings-buttonsave, .menu-item.active, ', property: 'backgroundColor' },
        // Color (text color)
        { selector: '.some-text-element, .highlight-text, .inbox-updates', property: 'color' },
        // Border color
        { selector: '.custom-border', property: 'borderColor' },
        // Scrollbar thumb (WebKit only)
        { selector: '.hourly-container::-webkit-scrollbar-thumb', property: 'backgroundColor' },
        // Add more as needed...
    ];

    elementsToUpdate.forEach(({ selector, property }) => {
        try {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                el.style[property] = color;
            });
        } catch (e) {
            console.warn(`Error applying color to ${selector}:`, e);
        }
    });

    // Optional: Save to localStorage for faster load next time
    localStorage.setItem('accentColor', color);
}
document.addEventListener('DOMContentLoaded', function () {
    auth.onAuthStateChanged((user) => {
        if (user) {
            const savedColorFromStorage = localStorage.getItem('accentColor');

            if (savedColorFromStorage) {
                applyAccentColor(savedColorFromStorage);
            }

            db.collection('users').doc(user.uid).get()
                .then((doc) => {
                    if (doc.exists && doc.data().accentColor) {
                        applyAccentColor(doc.data().accentColor);
                    }
                })
                .catch((error) => {
                    console.error('Error loading accent color:', error);
                });
        }
    });
});

function lightenColor(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, (num >> 16) + amt);
    const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
    const B = Math.min(255, (num & 0x0000FF) + amt);

    return "#" + (
        (1 << 24 | R << 16 | G << 8 | B)
            .toString(16)
            .substring(1)
            .toUpperCase()
    );
}