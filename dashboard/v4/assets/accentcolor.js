// // // accentcolor.js - Fixed with user-specific storage and default values
// // function applyAccentColor(color, userId = null) {
// //     if (!color || !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) {
// //         console.warn("Invalid accent color:", color);
// //         // Apply default color if invalid
// //         color = '#3b82f6';
// //     }

// //     // Update global CSS variables
// //     document.documentElement.style.setProperty('--primary', color);
// //     document.documentElement.style.setProperty('--primary-light', lightenColor(color, 20));
    
// //     // Apply to key elements
// //     const elements = {
// //         // Reading items and related elements
// //         '.reading-value': 'color',
// //         '.Doctors': 'color',
// //         '.reading-item::before': 'backgroundColor',
// //         '.location-toggle button:hover': 'backgroundColor',
// //         '.reading-input button': 'backgroundColor',
// //         '.logo': 'backgroundColor',
// //         '.user-badge:hover': 'backgroundColor',
// //         '.location-toggle button:hover': 'backgroundColor',
// //         '.logo2': 'backgroundColor',
// //         '.logov': 'backgroundColor',
// //         '.trybeta:hover': 'backgroundColor',
// //         '#copyBtn': 'backgroundColor',
// //         '.veseeta': 'backgroundColor',
// //         '.reading-value':'color',
// //         '.sub-menu-link:hover':'color',
// //         '.dark-theme .sub-menu-link:hover':'color',
// //         '.sub-menu-link:hover p':'color',
// //         '.welcomeh1':'color',
// //         '.detail-item i':'color',
// //         '.metric-value':'color',
// //         '.ai-insight-header i':'color',
// //         '.location':'color',
// //         '.search-box button':'color',
// //         '.aqi-component-value':'color',
// //         '.aqi-component-value':'color',
// //         '.hourly-container':'scrollbarcolor',
// //         '.Version':'color',
// //         '.note':'color',
// //         '.active-link':'color',
// //         '.nav__link:hover':'color',
// //         '.ai':'color',
// //         '.nav__expand-link:hover':'color',
// //         '.dark-theme .avatar-option':'border',
// //         '.spinner':'bordertopcolor',
// //         '.avatar-option':'border',
// //         '.export-options button:hover':'border',
// //         '.export-options button:hover':'color',
// //         '.avatar-option.selected':'boxShadow',
// //         '.daily-icon img':'filter',
// //         '.hourly-icon img':'filter',
        
// //         // UI elements
// //         '.menu-item.active': 'backgroundColor',
// //         '.notification-badge': 'backgroundColor',
// //         '.icon-button__badge': 'backgroundColor',
// //         '.robot-avatar': 'backgroundColor',
// //         '.ai-message-user .ai-text': 'backgroundColor',
// //         '.ai-chat-input button': 'backgroundColor',
// //         '.settings-buttonsaveaccent': 'backgroundColor',
// //         '.nav__expand': 'backgroundColor',
// //         '.sidebar-header .logo2': 'backgroundColor',
// //         '.nav-left .logo.mobile-only': 'backgroundColor',
        
// //         // Special elements
// //         '.hourly-container::-webkit-scrollbar-thumb': 'backgroundColor',
// //         '.hrm': 'backgroundColor',
// //         '.inbox-updates': 'color'
// //     };

// //     Object.entries(elements).forEach(([selector, property]) => {
// //         document.querySelectorAll(selector).forEach(el => {
// //             el.style[property] = color;
// //         });
// //     });
    
// //     // Store with user ID if available
// //     if (userId) {
// //         localStorage.setItem(`accentColor_${userId}`, color);
// //     }
// // }

// // function lightenColor(color, percent) {
// //     const num = parseInt(color.replace("#", ""), 16),
// //         amt = Math.round(2.55 * percent),
// //         R = Math.min(255, (num >> 16) + amt),
// //         G = Math.min(255, ((num >> 8) & 0x00FF) + amt),
// //         B = Math.min(255, (num & 0x0000FF) + amt);

// //     return "#" + (1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1).toUpperCase();
// // }

// // // Clear all accent colors from localStorage (call this on logout)
// // function clearAllAccentColors() {
// //     Object.keys(localStorage).forEach(key => {
// //         if (key.startsWith('accentColor_')) {
// //             localStorage.removeItem(key);
// //         }
// //     });
// // }

// // // Initialize on page load
// // document.addEventListener('DOMContentLoaded', () => {
// //     if (!auth || !db) {
// //         console.error("Firebase not initialized");
// //         // Apply default color even if Firebase isn't ready
// //         applyAccentColor('#3b82f6');
// //         return;
// //     }

// //     auth.onAuthStateChanged(user => {
// //         if (user) {
// //             // Check localStorage for this specific user first
// //             const userColorKey = `accentColor_${user.uid}`;
// //             const localColor = localStorage.getItem(userColorKey);
            
// //             if (localColor && /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(localColor)) {
// //                 applyAccentColor(localColor, user.uid);
// //             } else {
// //                 // Apply default color if no local color found
// //                 applyAccentColor('#3b82f6', user.uid);
// //             }

// //             // Then check Firebase for updates
// //             db.collection('users').doc(user.uid).onSnapshot(doc => {
// //                 if (doc.exists) {
// //                     let firebaseColor = doc.data().accentColor;
                    
// //                     // If no accent color in Firebase, set default and update Firebase
// //                     if (!firebaseColor) {
// //                         firebaseColor = '#3b82f6';
// //                         db.collection('users').doc(user.uid).update({
// //                             accentColor: firebaseColor
// //                         }).catch(error => {
// //                             console.error("Error setting default accent color:", error);
// //                         });
// //                     }
                    
// //                     // Only update if different from current color
// //                     const currentColor = getComputedStyle(document.documentElement)
// //                         .getPropertyValue('--primary').trim();
                    
// //                     if (!currentColor || currentColor !== firebaseColor) {
// //                         applyAccentColor(firebaseColor, user.uid);
// //                     }
// //                 }
// //             }, error => {
// //                 console.error("Firebase snapshot error:", error);
// //                 // Fallback to default color
// //                 applyAccentColor('#3b82f6', user.uid);
// //             });
// //         } else {
// //             // User is logged out - apply default color
// //             applyAccentColor('#3b82f6');
// //         }
// //     });
// // });

// // // Add logout handler to clear user-specific colors
// // function setupLogoutHandler() {
// //     const logoutButtons = document.querySelectorAll('[onclick*="logout"], [id*="logout"], .logout-btn');
// //     logoutButtons.forEach(button => {
// //         button.addEventListener('click', () => {
// //             clearAllAccentColors();
// //         });
// //     });
    
// //     // Also listen for auth state changes
// //     if (auth) {
// //         auth.onAuthStateChanged(user => {
// //             if (!user) {
// //                 clearAllAccentColors();
// //             }
// //         });
// //     }
// // }

// // // Call this when your page loads
// // setupLogoutHandler();

// // // Utility function to save accent color to Firebase
// // function saveAccentColorToFirebase(color, userId) {
// //     if (!auth || !db || !userId) return;
    
// //     db.collection('users').doc(userId).update({
// //         accentColor: color,
// //         lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
// //     }).catch(error => {
// //         console.error("Error saving accent color to Firebase:", error);
// //     });
// // }

// // // Make this function available globally for your color picker
// // window.saveAccentColor = function(color) {
// //     const user = auth.currentUser;
// //     if (user) {
// //         applyAccentColor(color, user.uid);
// //         saveAccentColorToFirebase(color, user.uid);
// //     }
// // };













// // accentcolor.js - Simplified accent color application

// function applyAccentColor(color) {
//     if (!color || !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) {
//         console.warn("Invalid accent color:", color);
//         return;
//     }

//     // Update global CSS variables
//     document.documentElement.style.setProperty('--primary', color);
//     document.documentElement.style.setProperty('--primary-light', lightenColor(color, 20));
//     // Apply to key elements
//     const elements = {
//         // Reading items and related elements
//         '.reading-value': 'color',
//         '.Doctors': 'color',
//         '.reading-item::before': 'backgroundColor',
//         '.location-toggle button:hover': 'backgroundColor',
//         '.reading-input button': 'backgroundColor',
//         '.logo': 'backgroundColor',
//         '.user-badge:hover': 'backgroundColor',
//         '.location-toggle button:hover': 'backgroundColor',
//         '.logo2': 'backgroundColor',
//         '.logov': 'backgroundColor',
//         '.trybeta:hover': 'backgroundColor',
//         '#copyBtn': 'backgroundColor',
//         '.veseeta': 'backgroundColor',
//         // '.dark-theme .user-badge:hover': 'background',
//         '.reading-value':'color',
//         '.sub-menu-link:hover':'color',
//         '.dark-theme .sub-menu-link:hover':'color',
//         '.sub-menu-link:hover p':'color',
//         '.welcomeh1':'color',
//         '.detail-item i':'color',
//         '.metric-value':'color',
//         '.ai-insight-header i':'color',
//         '.location':'color',
//         '.search-box button':'color',
//         '.aqi-component-value':'color',
//         '.aqi-component-value':'color',
//         '.hourly-container':'scrollbarcolor',
//         '.Version':'color',
//         '.note':'color',
//         '.active-link':'color',
//         '.nav__link:hover':'color',
//         '.ai':'color',
//         '.nav__expand-link:hover':'color',
//         // '.profile-image':'border',
//         '.dark-theme .avatar-option':'border',
//         '.spinner':'bordertopcolor',
//         '.avatar-option':'border',
//         '.export-options button:hover':'border',
//         '.export-options button:hover':'color',
//         '.avatar-option.selected':'boxShadow',
//         '.daily-icon img':'filter',
//         '.hourly-icon img':'filter',
        
//         // UI elements
//         '.menu-item.active': 'backgroundColor',
//         '.notification-badge': 'backgroundColor',
//         '.icon-button__badge': 'backgroundColor',
//         '.robot-avatar': 'backgroundColor',
//         '.robot-avatar': 'backgroundColor',
//         '.ai-message-user .ai-text': 'backgroundColor',
//         '.ai-chat-input button': 'backgroundColor',
//         '.settings-buttonsaveaccent': 'backgroundColor',
//         '.nav__expand': 'backgroundColor',
//         '.sidebar-header .logo2': 'backgroundColor',
//         '.nav-left .logo.mobile-only': 'backgroundColor',
        
//         // Special elements
//         '.hourly-container::-webkit-scrollbar-thumb': 'backgroundColor',
//         '.hrm': 'backgroundColor',
//         '.inbox-updates': 'color'
//     };

// //     Object.entries(elements).forEach(([selector, property]) => {
// //         document.querySelectorAll(selector).forEach(el => {
// //             el.style[property] = color;
// //         });
// //     });
// // }
//     Object.entries(elements).forEach(([selector, property]) => {
//         document.querySelectorAll(selector).forEach(el => {
//             el.style[property] = color;
//         });
//     });
// }
// /**
// //  * Lighten a hex color by a percentage
// //  */
// // function lightenColor(color, percent) {
// //     const num = parseInt(color.replace("#", ""), 16),
// //         amt = Math.round(2.55 * percent),
// //         R = Math.min(255, (num >> 16) + amt),
// //         G = Math.min(255, ((num >> 8) & 0x00FF) + amt),
// //         B = Math.min(255, (num & 0x0000FF) + amt);

// //     return "#" + (1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1).toUpperCase();
// // }

// // // Initialize on page load
// // document.addEventListener('DOMContentLoaded', () => {
// //     if (!auth || !db) {
// //         console.error("Firebase not initialized");
// //         return;
// //     }

// //     auth.onAuthStateChanged(user => {
// //         if (user) {
// //             db.collection('users').doc(user.uid).onSnapshot(doc => {
// //                 if (doc.exists && doc.data().accentColor) {
// //                     applyAccentColor(doc.data().accentColor);
// //                 }
// //             });
// //         }
// //     });
// // });




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

//     // Check localStorage first for faster loading
//     const localColor = localStorage.getItem('accentColor');
//     if (localColor && /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(localColor)) {
//         applyAccentColor(localColor);
//     }

//     // Then check Firebase for updates
//     auth.onAuthStateChanged(user => {
//         if (user) {
//             db.collection('users').doc(user.uid).onSnapshot(doc => {
//                 if (doc.exists && doc.data().accentColor) {
//                     const firebaseColor = doc.data().accentColor;
//                     // Only update if different from local storage
//                     if (!localColor || localColor !== firebaseColor) {
//                         applyAccentColor(firebaseColor);
//                         localStorage.setItem('accentColor', firebaseColor);
//                     }
//                 }
//             });
//         }
//     });
// });




































































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
        '.robot-avatar': 'backgroundColor',
        '.robot-avatar': 'backgroundColor',
        '.ai-message-user .ai-text': 'backgroundColor',
        '.ai-chat-input button': 'backgroundColor',
        '.settings-buttonsaveaccent': 'backgroundColor',
        '.nav__expand': 'backgroundColor',
        '.sidebar-header .logo2': 'backgroundColor',
        '.nav-left .logo.mobile-only': 'backgroundColor',
        '.tour-btn': 'backgroundColor',
        '.tour-btnI': 'backgroundColor',
        
        // Special elements
        '.hourly-container::-webkit-scrollbar-thumb': 'backgroundColor',
        '.hrm': 'backgroundColor',
        '.inbox-updates': 'color',
        '.tour-popup h3': 'color',

        // messages
 '.messages-container::-webkit-scrollbar-thumb': 'backgroundColor',
 '.unread-indicator': 'background',
 '.messages-container::-webkit-scrollbar-thumb:hover': 'backgroundColor'
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






















