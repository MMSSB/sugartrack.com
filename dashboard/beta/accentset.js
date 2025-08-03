// // accentset.js - Handles accent color settings in settings.html

// document.addEventListener('DOMContentLoaded', function () {
//     // Assuming auth and db are already initialized from firebase.js or similar
//     auth.onAuthStateChanged((user) => {
//         if (user) {
//             initializeAccentColorSettings();
//         } else {
//             console.warn("No user signed in.");
//         }
//     });
// });

// function initializeAccentColorSettings() {
//     const accentColorInput = document.getElementById('accentColor');
//     const saveAccentColorButton = document.getElementById('saveAccentColor');
//     const colorPresets = document.querySelectorAll('.color-preset');

//     // Ensure required DOM elements exist
//     if (!accentColorInput || !saveAccentColorButton) {
//         console.error("Required elements not found.");
//         return;
//     }

//     // Load current accent color from Firestore
//     const currentUser = auth.currentUser;
//     if (!currentUser) return;

//     db.collection('users').doc(currentUser.uid).get()
//         .then((doc) => {
//             if (doc.exists && doc.data().accentColor) {
//                 accentColorInput.value = doc.data().accentColor;
//                 applyAccentColorPreview(doc.data().accentColor);
//             }
//         })
//         .catch((error) => {
//             console.error("Error fetching accent color:", error);
//         });

//     // Color preset buttons
//     colorPresets.forEach(preset => {
//         preset.addEventListener('click', (e) => {
//             e.preventDefault();
//             const color = preset.dataset.color;
//             if (color) {
//                 accentColorInput.value = color;
//                 applyAccentColorPreview(color);
//             }
//         });
//     });

//     // Live preview on input change
//     accentColorInput.addEventListener('input', (e) => {
//         applyAccentColorPreview(e.target.value);
//     });

//     // Save accent color
//     saveAccentColorButton.addEventListener('click', () => {
//         const color = accentColorInput.value;

//         saveAccentColorButton.disabled = true;
//         saveAccentColorButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

//         db.collection('users').doc(currentUser.uid).update({
//             accentColor: color
//         })
//         .then(() => {
//             applyAccentColor(color); // Apply saved color
//             alert('Accent color updated successfully!');
//         })
//         .catch((error) => {
//             console.error('Error updating accent color:', error);
//             alert('Error updating accent color. Please try again.');
//         })
//         .finally(() => {
//             saveAccentColorButton.disabled = false;
//             saveAccentColorButton.innerHTML = '<i class="fas fa-save"></i> Save Color';
//         });
//     });
// }

// // // Helper function to preview changes without saving
// // function applyAccentColorPreview(color) {
// //     document.documentElement.style.setProperty('--primary', color);
// //             // document.documentElement.style.setProperty('--actives', color);
// //     const lighterColor = lightenColor(color, 20);
// //     document.documentElement.style.setProperty('--primary-light', lighterColor);
// //             // document.documentElement.style.setProperty('--actives-light', lighterColor);
// // }

// // // Apply accent color globally (used after saving)
// // function applyAccentColor(color) {
// //     // Optional: You can store it in localStorage too
// //     localStorage.setItem('accentColor', color);

// //     // Or just keep applying the theme
// //     document.documentElement.style.setProperty('--primary', color);
// //             // document.documentElement.style.setProperty('--actives', color);
// //     const lighterColor = lightenColor(color, 20);
// //     document.documentElement.style.setProperty('--primary-light', lighterColor);
// //         // document.documentElement.style.setProperty('--actives-light', lighterColor);
// // }

// // // Helper function to lighten a color
// // function lightenColor(color, percent) {
// //     let R = parseInt(color.slice(1, 3), 16);
// //     let G = parseInt(color.slice(3, 5), 16);
// //     let B = parseInt(color.slice(5, 7), 16);

// //     R = Math.min(255, Math.max(0, R + (255 * percent / 100)));
// //     G = Math.min(255, Math.max(0, G + (255 * percent / 100)));
// //     B = Math.min(255, Math.max(0, B + (255 * percent / 100)));

// //     const toHex = (c) => c.toString(16).padStart(2, '0');
// //     return `#${toHex(R)}${toHex(G)}${toHex(B)}`;
// // }






// // Helper function to preview changes without saving
// function applyAccentColorPreview(color) {
//     document.documentElement.style.setProperty('--primary', color);
//     const lighterColor = lightenColor(color, 20);
//     const darkerColor = darkenColor(color, 15);
//     const textColor = getContrastColor(color);
    
//     document.documentElement.style.setProperty('--primary-light', lighterColor);
//     document.documentElement.style.setProperty('--primary-dark', darkerColor);
//     document.documentElement.style.setProperty('--primary-text', textColor);
// }

// // Apply accent color globally (used after saving)
// function applyAccentColor(color) {
//     localStorage.setItem('accentColor', color);
//     applyAccentColorPreview(color);
// }

// // Helper function to lighten a color
// function lightenColor(color, percent) {
//     let R = parseInt(color.slice(1, 3), 16);
//     let G = parseInt(color.slice(3, 5), 16);
//     let B = parseInt(color.slice(5, 7), 16);

//     R = Math.min(255, Math.max(0, R + (255 * percent / 100)));
//     G = Math.min(255, Math.max(0, G + (255 * percent / 100)));
//     B = Math.min(255, Math.max(0, B + (255 * percent / 100)));

//     const toHex = (c) => c.toString(16).padStart(2, '0');
//     return `#${toHex(R)}${toHex(G)}${toHex(B)}`;
// }

// // Helper function to darken a color
// function darkenColor(color, percent) {
//     let R = parseInt(color.slice(1, 3), 16);
//     let G = parseInt(color.slice(3, 5), 16);
//     let B = parseInt(color.slice(5, 7), 16);

//     R = Math.max(0, R - (255 * percent / 100));
//     G = Math.max(0, G - (255 * percent / 100));
//     B = Math.max(0, B - (255 * percent / 100));

//     const toHex = (c) => c.toString(16).padStart(2, '0');
//     return `#${toHex(R)}${toHex(G)}${toHex(B)}`;
// }

// // Helper function to get contrasting text color
// function getContrastColor(hex) {
//     const r = parseInt(hex.slice(1, 3), 16);
//     const g = parseInt(hex.slice(3, 5), 16);
//     const b = parseInt(hex.slice(5, 7), 16);
//     return (r * 0.299 + g * 0.587 + b * 0.114) > 150 ? '#000000' : '#FFFFFF';
// }



// accentset.js - Handles accent color settings in settings.html

document.addEventListener('DOMContentLoaded', function () {
    auth.onAuthStateChanged((user) => {
        if (user) {
            initializeAccentColorSettings();
        } else {
            console.warn("No user signed in.");
        }
    });
});

function initializeAccentColorSettings() {
    const accentColorInput = document.getElementById('accentColor');
    const saveAccentColorButton = document.getElementById('saveAccentColor');
    const colorPresets = document.querySelectorAll('.color-preset');

    if (!accentColorInput || !saveAccentColorButton) {
        console.error("Required elements not found.");
        return;
    }

    const currentUser = auth.currentUser;
    if (!currentUser) return;

    // Check localStorage first for faster loading
    const localColor = localStorage.getItem('accentColor');
    if (localColor && isValidHexColor(localColor)) {
        accentColorInput.value = localColor;
        applyAccentColorPreview(localColor);
    }

    // Then check Firebase
    db.collection('users').doc(currentUser.uid).get()
        .then((doc) => {
            if (doc.exists && doc.data().accentColor) {
                const firebaseColor = doc.data().accentColor;
                // Only update if different from local storage
                if (!localColor || localColor !== firebaseColor) {
                    accentColorInput.value = firebaseColor;
                    applyAccentColorPreview(firebaseColor);
                    // Update localStorage to match Firebase
                    localStorage.setItem('accentColor', firebaseColor);
                }
            }
        })
        .catch((error) => {
            console.error("Error fetching accent color:", error);
        });

    // Color preset buttons
    colorPresets.forEach(preset => {
        preset.addEventListener('click', (e) => {
            e.preventDefault();
            const color = preset.dataset.color;
            if (color) {
                accentColorInput.value = color;
                applyAccentColorPreview(color);
            }
        });
    });

    // Live preview on input change
    accentColorInput.addEventListener('input', (e) => {
        applyAccentColorPreview(e.target.value);
    });

    // Save accent color
    saveAccentColorButton.addEventListener('click', () => {
        const color = accentColorInput.value;

        if (!isValidHexColor(color)) {
            alert('Please select a valid color');
            return;
        }

        saveAccentColorButton.disabled = true;
        saveAccentColorButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

        // Save to localStorage immediately
        localStorage.setItem('accentColor', color);
        applyAccentColor(color);

        // Then save to Firebase
        db.collection('users').doc(currentUser.uid).update({
            accentColor: color
        })
        .then(() => {
            showNotification('Accent color updated successfully!');
        })
        .catch((error) => {
            console.error('Error updating accent color:', error);
            showNotification('Error updating accent color. Changes saved locally.', 'error');
        })
        .finally(() => {
            saveAccentColorButton.disabled = false;
            saveAccentColorButton.innerHTML = '<i class="fas fa-save"></i> Save Color';
        });
    });
}

function isValidHexColor(color) {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    
    notificationMessage.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.remove('hidden');
    
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 3000);
}

// Helper function to preview changes without saving
function applyAccentColorPreview(color) {
    if (!isValidHexColor(color)) return;
    
    document.documentElement.style.setProperty('--primary', color);
    const lighterColor = lightenColor(color, 20);
    const darkerColor = darkenColor(color, 15);
    const textColor = getContrastColor(color);
    
    document.documentElement.style.setProperty('--primary-light', lighterColor);
    document.documentElement.style.setProperty('--primary-dark', darkerColor);
    document.documentElement.style.setProperty('--primary-text', textColor);
}

// Apply accent color globally (used after saving)
function applyAccentColor(color) {
    if (!isValidHexColor(color)) return;
    localStorage.setItem('accentColor', color);
    applyAccentColorPreview(color);
}

// Helper function to lighten a color
function lightenColor(color, percent) {
    let R = parseInt(color.slice(1, 3), 16);
    let G = parseInt(color.slice(3, 5), 16);
    let B = parseInt(color.slice(5, 7), 16);

    R = Math.min(255, Math.max(0, R + (255 * percent / 100)));
    G = Math.min(255, Math.max(0, G + (255 * percent / 100)));
    B = Math.min(255, Math.max(0, B + (255 * percent / 100)));

    const toHex = (c) => c.toString(16).padStart(2, '0');
    return `#${toHex(R)}${toHex(G)}${toHex(B)}`;
}

// Helper function to darken a color
function darkenColor(color, percent) {
    let R = parseInt(color.slice(1, 3), 16);
    let G = parseInt(color.slice(3, 5), 16);
    let B = parseInt(color.slice(5, 7), 16);

    R = Math.max(0, R - (255 * percent / 100));
    G = Math.max(0, G - (255 * percent / 100));
    B = Math.max(0, B - (255 * percent / 100));

    const toHex = (c) => c.toString(16).padStart(2, '0');
    return `#${toHex(R)}${toHex(G)}${toHex(B)}`;
}

// Helper function to get contrasting text color
function getContrastColor(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return (r * 0.299 + g * 0.587 + b * 0.114) > 150 ? '#000000' : '#FFFFFF';
}