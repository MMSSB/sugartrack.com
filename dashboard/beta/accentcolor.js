// // accentcolor.js - Apply accent color from Firebase to CSS and DOM elements

// /**
//  * Applies the accent color to CSS variables and specified elements
//  * @param {string} color - Hex color string like "#FF5733"
//  */
// function applyAccentColor(color) {
//     if (!color || !isValidHexColor(color)) {
//         console.warn("Invalid or missing accent color:", color);
//         return;
//     }

//     // Update global CSS variables
//     document.documentElement.style.setProperty('--primary', color);
//     const lighterColor = lightenColor(color, 20);
//     document.documentElement.style.setProperty('--primary-light', lighterColor);

//     // Define which elements should be styled and how
//     const elementsToUpdate = [
//         // Background color
//         {
//             selector: '.settings-buttonsave, .menu-item.active, .inbox-updates, .veseeta, .sidebar-header .logo2, .nav-left .logo.mobile-only, .reading-value',
//             property: 'backgroundColor'
//         },
//         // Text color
//         {
//             selector: '.highlight-text, .reading-value, .some-text-element',
//             property: 'color'
//         },
//         // Border color
//         {
//             selector: '.custom-border, .input-group button',
//             property: 'borderColor'
//         },
//         // Scrollbar thumb
//         {
//             selector: '.hourly-container::-webkit-scrollbar-thumb',
//             property: 'backgroundColor'
//         }
//     ];

//     // Apply styles to each element
//     elementsToUpdate.forEach(({ selector, property }) => {
//         try {
//             const elements = document.querySelectorAll(selector);
//             if (elements.length === 0) {
//                 console.warn(`No elements found for selector: ${selector}`);
//             }
//             elements.forEach(el => {
//                 el.style[property] = color;
//             });
//         } catch (e) {
//             console.error(`Error applying style to "${selector}"`, e);
//         }
//     });
// }

// /**
//  * Validates a hex color string
//  * @param {string} color
//  * @returns {boolean}
//  */
// function isValidHexColor(color) {
//     const regex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
//     return regex.test(color);
// }

// /**
//  * Lighten a hex color by a percentage
//  */
// function lightenColor(color, percent) {
//     const num = parseInt(color.replace("#", ""), 16),
//         amt = Math.round(2.55 * percent),
//         R = Math.min(255, ((num >> 16) + amt)),
//         G = Math.min(255, ((num >> 8 & 0x00FF) + amt)),
//         B = Math.min(255, ((num & 0x0000FF) + amt));

//     return "#" + (
//         (1 << 24 | R << 16 | G << 8 | B)
//             .toString(16)
//             .substring(1)
//             .toUpperCase()
//     );
// }

// /**
//  * On page load: Listen to Firebase auth state and fetch accent color
//  */
// document.addEventListener('DOMContentLoaded', function () {
//     if (!auth || !db) {
//         console.error("Firebase auth or db is not initialized.");
//         return;
//     }

//     auth.onAuthStateChanged((user) => {
//         if (user) {
//             const userRef = db.collection('users').doc(user.uid);

//             // Real-time update listener
//             userRef.onSnapshot((doc) => {
//                 if (doc.exists && doc.data().accentColor) {
//                     applyAccentColor(doc.data().accentColor);
//                 } else {
//                     console.warn("No accentColor field found in user doc.");
//                 }
//             }, (error) => {
//                 console.error("Firebase onSnapshot error:", error);
//             });
//         }
//     });
// });

























// accentcolor.js - Simplified accent color application

/**
 * Applies the accent color to CSS variables and key elements
//  * @param {string} color - Hex color string like "#FF5733"
//  */
// function applyAccentColor(color) {
//     if (!color || !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) {
//         console.warn("Invalid accent color:", color);
//         return;
//     }

//     // Update global CSS variables
//     document.documentElement.style.setProperty('--primary', color);
//     document.documentElement.style.setProperty('--primary-light', lightenColor(color, 20));
    
// accentcolor.js - Simplified accent color application

function applyAccentColor(color) {
    if (!color || !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) {
        console.warn("Invalid accent color:", color);
        return;
    }

    // Update global CSS variables
    document.documentElement.style.setProperty('--primary', color);
    document.documentElement.style.setProperty('--primary-light', lightenColor(color, 20));
    // Apply to key elements
    const elements = {
        // Reading items and related elements
        '.reading-value': 'color',
        '.Doctors': 'color',
        '.reading-item::before': 'backgroundColor',
        '.location-toggle button:hover': 'backgroundColor',
        '.reading-input button': 'backgroundColor',
        '.logo': 'backgroundColor',
        '.user-badge:hover': 'backgroundColor',
        '.location-toggle button:hover': 'backgroundColor',
        '.logo2': 'backgroundColor',
        '.logov': 'backgroundColor',
        '.trybeta:hover': 'backgroundColor',
        '#copyBtn': 'backgroundColor',
        '.veseeta': 'backgroundColor',
        // '.dark-theme .user-badge:hover': 'background',
        '.reading-value':'color',
        '.sub-menu-link:hover':'color',
        '.dark-theme .sub-menu-link:hover':'color',
        '.sub-menu-link:hover p':'color',
        '.welcomeh1':'color',
        '.detail-item i':'color',
        '.metric-value':'color',
        '.ai-insight-header i':'color',
        '.location':'color',
        '.search-box button':'color',
        '.aqi-component-value':'color',
        '.aqi-component-value':'color',
        '.hourly-container':'scrollbarcolor',
        '.Version':'color',
        '.note':'color',
        '.active-link':'color',
        '.nav__link:hover':'color',
        '.ai':'color',
        '.nav__expand-link:hover':'color',
        // '.profile-image':'border',
        '.dark-theme .avatar-option':'border',
        '.spinner':'bordertopcolor',
        '.avatar-option':'border',
        '.export-options button:hover':'border',
        '.export-options button:hover':'color',
        '.avatar-option.selected':'boxShadow',
        '.daily-icon img':'filter',
        '.hourly-icon img':'filter',
        
        // UI elements
        '.menu-item.active': 'backgroundColor',
        '.notification-badge': 'backgroundColor',
        '.icon-button__badge': 'backgroundColor',
        '.settings-buttonsaveaccent': 'backgroundColor',
        '.nav__expand': 'backgroundColor',
        '.sidebar-header .logo2': 'backgroundColor',
        '.nav-left .logo.mobile-only': 'backgroundColor',
        
        // Special elements
        '.hourly-container::-webkit-scrollbar-thumb': 'backgroundColor',
        '.inbox-updates': 'color'
    };

//     Object.entries(elements).forEach(([selector, property]) => {
//         document.querySelectorAll(selector).forEach(el => {
//             el.style[property] = color;
//         });
//     });
// }
    Object.entries(elements).forEach(([selector, property]) => {
        document.querySelectorAll(selector).forEach(el => {
            el.style[property] = color;
        });
    });
}
/**
//  * Lighten a hex color by a percentage
//  */
// function lightenColor(color, percent) {
//     const num = parseInt(color.replace("#", ""), 16),
//         amt = Math.round(2.55 * percent),
//         R = Math.min(255, (num >> 16) + amt),
//         G = Math.min(255, ((num >> 8) & 0x00FF) + amt),
//         B = Math.min(255, (num & 0x0000FF) + amt);

//     return "#" + (1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1).toUpperCase();
// }

// // Initialize on page load
// document.addEventListener('DOMContentLoaded', () => {
//     if (!auth || !db) {
//         console.error("Firebase not initialized");
//         return;
//     }

//     auth.onAuthStateChanged(user => {
//         if (user) {
//             db.collection('users').doc(user.uid).onSnapshot(doc => {
//                 if (doc.exists && doc.data().accentColor) {
//                     applyAccentColor(doc.data().accentColor);
//                 }
//             });
//         }
//     });
// });




function lightenColor(color, percent) {
    const num = parseInt(color.replace("#", ""), 16),
        amt = Math.round(2.55 * percent),
        R = Math.min(255, (num >> 16) + amt),
        G = Math.min(255, ((num >> 8) & 0x00FF) + amt),
        B = Math.min(255, (num & 0x0000FF) + amt);

    return "#" + (1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1).toUpperCase();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    if (!auth || !db) {
        console.error("Firebase not initialized");
        return;
    }

    // Check localStorage first for faster loading
    const localColor = localStorage.getItem('accentColor');
    if (localColor && /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(localColor)) {
        applyAccentColor(localColor);
    }

    // Then check Firebase for updates
    auth.onAuthStateChanged(user => {
        if (user) {
            db.collection('users').doc(user.uid).onSnapshot(doc => {
                if (doc.exists && doc.data().accentColor) {
                    const firebaseColor = doc.data().accentColor;
                    // Only update if different from local storage
                    if (!localColor || localColor !== firebaseColor) {
                        applyAccentColor(firebaseColor);
                        localStorage.setItem('accentColor', firebaseColor);
                    }
                }
            });
        }
    });
});









// accentcolor.js - Fixed for both light/dark modes

/**
 * Applies accent color while respecting theme contrast
 */
// function applyAccentColor(color) {
//     if (!color || !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) {
//         console.warn("Invalid accent color:", color);
//         return;
//     }

//     // Calculate colors that work in both themes
//     const lighterColor = lightenColor(color, 20);
//     const darkerColor = darkenColor(color, 15);
//     const textColor = getContrastColor(color);

//     // Update CSS variables
//     document.documentElement.style.setProperty('--primary', color);
//     document.documentElement.style.setProperty('--primary-light', lighterColor);
//     document.documentElement.style.setProperty('--primary-dark', darkerColor);
//     document.documentElement.style.setProperty('--primary-text', textColor);

//     // Apply to elements - now theme-aware
//     const elements = {
//         // Reading items
//         '.reading-value': { property: 'color', value: color },
//         '.reading-item:hover::before': { property: 'backgroundColor', value: color },
//         '.reading-input button': { 
//             property: 'backgroundColor', 
//             value: color,
//             extra: `color: ${textColor};`
//         },
        
//         // UI elements
//         '.menu-item.active': { 
//             property: 'backgroundColor', 
//             value: color,
//             extra: `color: ${textColor};`
//         },
//         '.settings-buttonsave': { 
//             property: 'backgroundColor', 
//             value: color,
//             extra: `color: ${textColor};`
//         },
        
//         // Special elements
//         '.hourly-container::-webkit-scrollbar-thumb': { property: 'backgroundColor', value: color },
//         '.inbox-updates': { property: 'color', value: color }
        
//     };

//     Object.entries(elements).forEach(([selector, styles]) => {
//         document.querySelectorAll(selector).forEach(el => {
//             el.style[styles.property] = styles.value;
//             if (styles.extra) {
//                 Object.assign(el.style, cssToObject(styles.extra));
//             }
//         });
//     });
// }

// /**
//  * Helper functions for color manipulation
//  */
// function lightenColor(color, percent) {
//     const num = parseInt(color.replace("#", ""), 16),
//         amt = Math.round(2.55 * percent),
//         R = Math.min(255, (num >> 16) + amt),
//         G = Math.min(255, ((num >> 8) & 0x00FF) + amt),
//         B = Math.min(255, (num & 0x0000FF) + amt);
//     return "#" + (1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1).toUpperCase();
// }

// function darkenColor(color, percent) {
//     const num = parseInt(color.replace("#", ""), 16),
//         amt = Math.round(2.55 * percent),
//         R = Math.max(0, (num >> 16) - amt),
//         G = Math.max(0, ((num >> 8) & 0x00FF) - amt),
//         B = Math.max(0, (num & 0x0000FF) - amt);
//     return "#" + (1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1).toUpperCase();
// }

// function getContrastColor(hex) {
//     const r = parseInt(hex.slice(1, 3), 16),
//           g = parseInt(hex.slice(3, 5), 16),
//           b = parseInt(hex.slice(5, 7), 16);
//     return (r * 0.299 + g * 0.587 + b * 0.114) > 150 ? '#000000' : '#FFFFFF';
// }

// function cssToObject(css) {
//     return css.split(';').reduce((acc, pair) => {
//         const [key, value] = pair.split(':').map(s => s.trim());
//         if (key) acc[key] = value;
//         return acc;
//     }, {});
// }

// // Initialize with theme awareness
// document.addEventListener('DOMContentLoaded', () => {
//     if (!auth || !db) {
//         console.error("Firebase not initialized");
//         return;
//     }

//     auth.onAuthStateChanged(user => {
//         if (user) {
//             db.collection('users').doc(user.uid).onSnapshot(doc => {
//                 if (doc.exists && doc.data().accentColor) {
//                     applyAccentColor(doc.data().accentColor);
//                 }
//             });
//         }
//     });

//     // Re-apply when theme changes
//     const themeObserver = new MutationObserver(() => {
//         const currentColor = getComputedStyle(document.documentElement)
//             .getPropertyValue('--primary').trim();
//         if (currentColor) applyAccentColor(currentColor);
//     });
    
//     themeObserver.observe(document.documentElement, {
//         attributes: true,
//         attributeFilter: ['class']
//     });
// });














// // accentcolor.js - Updated for dark mode compatibility

// /**
//  * Applies the accent color to CSS variables and key elements
//  * @param {string} color - Hex color string like "#FF5733"
//  */
// function applyAccentColor(color) {
//     if (!color || !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) {
//         console.warn("Invalid accent color:", color);
//         return;
//     }

//     // Calculate colors that work in both themes
//     const lighterColor = lightenColor(color, 20);
//     const darkerColor = darkenColor(color, 15);
//     const textColor = getContrastColor(color);

//     // Update global CSS variables
//     document.documentElement.style.setProperty('--primary', color);
//     document.documentElement.style.setProperty('--primary-light', lighterColor);
//     document.documentElement.style.setProperty('--primary-dark', darkerColor);
//     document.documentElement.style.setProperty('--primary-text', textColor);

//     // Apply to key elements
//     const elements = {
//         // Reading items and related elements
//         // '.reading-value': { property: 'color', value: color },
//         '.note': { property: 'color', value: color },
//         '.sidebar-header .logo2': { property: 'backgrounfColor', value: color },
//         '.reading-item:hover::before': { property: 'backgroundColor', value: color },
//         '.reading-input button': { 
//             property: 'backgroundColor', 
//             value: color,
//             extra: `color: ${textColor};`
//         },
        
//         // UI elements
//         '.menu-item.active': { 
//             property: 'backgroundColor', 
//             value: color,
//             extra: `color: ${textColor};`
//         },
//         '.settings-buttonsave': { 
//             property: 'backgroundColor', 
//             value: color,
//             extra: `color: ${textColor};`
//         },
        
//         // Export buttons
//         '.export-buttons button:hover': {
//             property: 'borderColor',
//             value: color
//         },
        
//         // Special elements
//         '.hourly-container::-webkit-scrollbar-thumb': { property: 'backgroundColor', value: color },
//         '.inbox-updates': { property: 'color', value: color }
//     };

//     Object.entries(elements).forEach(([selector, styles]) => {
//         document.querySelectorAll(selector).forEach(el => {
//             el.style[styles.property] = styles.value;
//             if (styles.extra) {
//                 Object.assign(el.style, cssToObject(styles.extra));
//             }
//         });
//     });
// }

// /**
//  * Helper functions for color manipulation
//  */
// function lightenColor(color, percent) {
//     const num = parseInt(color.replace("#", ""), 16),
//         amt = Math.round(2.55 * percent),
//         R = Math.min(255, (num >> 16) + amt),
//         G = Math.min(255, ((num >> 8) & 0x00FF) + amt),
//         B = Math.min(255, (num & 0x0000FF) + amt);
//     return "#" + (1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1).toUpperCase();
// }

// function darkenColor(color, percent) {
//     const num = parseInt(color.replace("#", ""), 16),
//         amt = Math.round(2.55 * percent),
//         R = Math.max(0, (num >> 16) - amt),
//         G = Math.max(0, ((num >> 8) & 0x00FF) - amt),
//         B = Math.max(0, (num & 0x0000FF) - amt);
//     return "#" + (1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1).toUpperCase();
// }

// function getContrastColor(hex) {
//     const r = parseInt(hex.slice(1, 3), 16),
//           g = parseInt(hex.slice(3, 5), 16),
//           b = parseInt(hex.slice(5, 7), 16);
//     return (r * 0.299 + g * 0.587 + b * 0.114) > 150 ? '#000000' : '#FFFFFF';
// }

// function cssToObject(css) {
//     return css.split(';').reduce((acc, pair) => {
//         const [key, value] = pair.split(':').map(s => s.trim());
//         if (key) acc[key] = value;
//         return acc;
//     }, {});
// }

// // Initialize with theme awareness
// document.addEventListener('DOMContentLoaded', () => {
//     if (!auth || !db) {
//         console.error("Firebase not initialized");
//         return;
//     }

//     auth.onAuthStateChanged(user => {
//         if (user) {
//             db.collection('users').doc(user.uid).onSnapshot(doc => {
//                 if (doc.exists && doc.data().accentColor) {
//                     applyAccentColor(doc.data().accentColor);
//                 }
//             });
//         }
//     });

//     // Re-apply when theme changes
//     const themeObserver = new MutationObserver(() => {
//         const currentColor = getComputedStyle(document.documentElement)
//             .getPropertyValue('--primary').trim();
//         if (currentColor) applyAccentColor(currentColor);
//     });
    
//     themeObserver.observe(document.documentElement, {
//         attributes: true,
//         attributeFilter: ['class']
//     });

// });
