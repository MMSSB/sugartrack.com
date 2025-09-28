// // // accentset.js - Handles accent color settings in settings.html

// // document.addEventListener('DOMContentLoaded', function () {
// //     // Assuming auth and db are already initialized from firebase.js or similar
// //     auth.onAuthStateChanged((user) => {
// //         if (user) {
// //             initializeAccentColorSettings();
// //         } else {
// //             console.warn("No user signed in.");
// //         }
// //     });
// // });

// // function initializeAccentColorSettings() {
// //     const accentColorInput = document.getElementById('accentColor');
// //     const saveAccentColorButton = document.getElementById('saveAccentColor');
// //     const colorPresets = document.querySelectorAll('.color-preset');

// //     // Ensure required DOM elements exist
// //     if (!accentColorInput || !saveAccentColorButton) {
// //         console.error("Required elements not found.");
// //         return;
// //     }

// //     // Load current accent color from Firestore
// //     const currentUser = auth.currentUser;
// //     if (!currentUser) return;

// //     db.collection('users').doc(currentUser.uid).get()
// //         .then((doc) => {
// //             if (doc.exists && doc.data().accentColor) {
// //                 accentColorInput.value = doc.data().accentColor;
// //                 applyAccentColorPreview(doc.data().accentColor);
// //             }
// //         })
// //         .catch((error) => {
// //             console.error("Error fetching accent color:", error);
// //         });

// //     // Color preset buttons
// //     colorPresets.forEach(preset => {
// //         preset.addEventListener('click', (e) => {
// //             e.preventDefault();
// //             const color = preset.dataset.color;
// //             if (color) {
// //                 accentColorInput.value = color;
// //                 applyAccentColorPreview(color);
// //             }
// //         });
// //     });

// //     // Live preview on input change
// //     accentColorInput.addEventListener('input', (e) => {
// //         applyAccentColorPreview(e.target.value);
// //     });

// //     // Save accent color
// //     saveAccentColorButton.addEventListener('click', () => {
// //         const color = accentColorInput.value;

// //         saveAccentColorButton.disabled = true;
// //         saveAccentColorButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

// //         db.collection('users').doc(currentUser.uid).update({
// //             accentColor: color
// //         })
// //         .then(() => {
// //             applyAccentColor(color); // Apply saved color
// //             alert('Accent color updated successfully!');
// //         })
// //         .catch((error) => {
// //             console.error('Error updating accent color:', error);
// //             alert('Error updating accent color. Please try again.');
// //         })
// //         .finally(() => {
// //             saveAccentColorButton.disabled = false;
// //             saveAccentColorButton.innerHTML = '<i class="fas fa-save"></i> Save Color';
// //         });
// //     });
// // }

// // // // Helper function to preview changes without saving
// // // function applyAccentColorPreview(color) {
// // //     document.documentElement.style.setProperty('--primary', color);
// // //             // document.documentElement.style.setProperty('--actives', color);
// // //     const lighterColor = lightenColor(color, 20);
// // //     document.documentElement.style.setProperty('--primary-light', lighterColor);
// // //             // document.documentElement.style.setProperty('--actives-light', lighterColor);
// // // }

// // // // Apply accent color globally (used after saving)
// // // function applyAccentColor(color) {
// // //     // Optional: You can store it in localStorage too
// // //     localStorage.setItem('accentColor', color);

// // //     // Or just keep applying the theme
// // //     document.documentElement.style.setProperty('--primary', color);
// // //             // document.documentElement.style.setProperty('--actives', color);
// // //     const lighterColor = lightenColor(color, 20);
// // //     document.documentElement.style.setProperty('--primary-light', lighterColor);
// // //         // document.documentElement.style.setProperty('--actives-light', lighterColor);
// // // }

// // // // Helper function to lighten a color
// // // function lightenColor(color, percent) {
// // //     let R = parseInt(color.slice(1, 3), 16);
// // //     let G = parseInt(color.slice(3, 5), 16);
// // //     let B = parseInt(color.slice(5, 7), 16);

// // //     R = Math.min(255, Math.max(0, R + (255 * percent / 100)));
// // //     G = Math.min(255, Math.max(0, G + (255 * percent / 100)));
// // //     B = Math.min(255, Math.max(0, B + (255 * percent / 100)));

// // //     const toHex = (c) => c.toString(16).padStart(2, '0');
// // //     return `#${toHex(R)}${toHex(G)}${toHex(B)}`;
// // // }






// // // Helper function to preview changes without saving
// // function applyAccentColorPreview(color) {
// //     document.documentElement.style.setProperty('--primary', color);
// //     const lighterColor = lightenColor(color, 20);
// //     const darkerColor = darkenColor(color, 15);
// //     const textColor = getContrastColor(color);
    
// //     document.documentElement.style.setProperty('--primary-light', lighterColor);
// //     document.documentElement.style.setProperty('--primary-dark', darkerColor);
// //     document.documentElement.style.setProperty('--primary-text', textColor);
// // }

// // // Apply accent color globally (used after saving)
// // function applyAccentColor(color) {
// //     localStorage.setItem('accentColor', color);
// //     applyAccentColorPreview(color);
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

// // // Helper function to darken a color
// // function darkenColor(color, percent) {
// //     let R = parseInt(color.slice(1, 3), 16);
// //     let G = parseInt(color.slice(3, 5), 16);
// //     let B = parseInt(color.slice(5, 7), 16);

// //     R = Math.max(0, R - (255 * percent / 100));
// //     G = Math.max(0, G - (255 * percent / 100));
// //     B = Math.max(0, B - (255 * percent / 100));

// //     const toHex = (c) => c.toString(16).padStart(2, '0');
// //     return `#${toHex(R)}${toHex(G)}${toHex(B)}`;
// // }

// // // Helper function to get contrasting text color
// // function getContrastColor(hex) {
// //     const r = parseInt(hex.slice(1, 3), 16);
// //     const g = parseInt(hex.slice(3, 5), 16);
// //     const b = parseInt(hex.slice(5, 7), 16);
// //     return (r * 0.299 + g * 0.587 + b * 0.114) > 150 ? '#000000' : '#FFFFFF';
// // }
























// // accentset.js - Handles accent color settings in settings.html

// document.addEventListener('DOMContentLoaded', function () {
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

//     if (!accentColorInput || !saveAccentColorButton) {
//         console.error("Required elements not found.");
//         return;
//     }

//     const currentUser = auth.currentUser;
//     if (!currentUser) return;

//     // Check localStorage first for faster loading
//     const localColor = localStorage.getItem('accentColor');
//     if (localColor && isValidHexColor(localColor)) {
//         accentColorInput.value = localColor;
//         applyAccentColorPreview(localColor);
//     }

//     // Then check Firebase
//     db.collection('users').doc(currentUser.uid).get()
//         .then((doc) => {
//             if (doc.exists && doc.data().accentColor) {
//                 const firebaseColor = doc.data().accentColor;
//                 // Only update if different from local storage
//                 if (!localColor || localColor !== firebaseColor) {
//                     accentColorInput.value = firebaseColor;
//                     applyAccentColorPreview(firebaseColor);
//                     // Update localStorage to match Firebase
//                     localStorage.setItem('accentColor', firebaseColor);
//                 }
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

//         if (!isValidHexColor(color)) {
//             alert('Please select a valid color');
//             return;
//         }

//         saveAccentColorButton.disabled = true;
//         saveAccentColorButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

//         // Save to localStorage immediately
//         localStorage.setItem('accentColor', color);
//         applyAccentColor(color);

//         // Then save to Firebase
//         db.collection('users').doc(currentUser.uid).update({
//             accentColor: color
//         })
//         .then(() => {
//             showNotification('Accent color updated successfully!');
//         })
//         .catch((error) => {
//             console.error('Error updating accent color:', error);
//             showNotification('Error updating accent color. Changes saved locally.', 'error');
//         })
//         .finally(() => {
//             saveAccentColorButton.disabled = false;
//             saveAccentColorButton.innerHTML = '<i class="fas fa-save"></i> Save Color';
//         });
//     });
// }

// function isValidHexColor(color) {
//     return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
// }

// function showNotification(message, type = 'success') {
//     const notification = document.getElementById('notification');
//     const notificationMessage = document.getElementById('notification-message');
    
//     notificationMessage.textContent = message;
//     notification.className = `notification ${type}`;
//     notification.classList.remove('hidden');
    
//     setTimeout(() => {
//         notification.classList.add('hidden');
//     }, 3000);
// }

// // Helper function to preview changes without saving
// function applyAccentColorPreview(color) {
//     if (!isValidHexColor(color)) return;
    
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
//     if (!isValidHexColor(color)) return;
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






















// // // accentset.js - Complete accent color management system
// // document.addEventListener('DOMContentLoaded', function () {
// //     // Wait for Firebase to initialize
// //     setTimeout(() => {
// //         if (typeof firebase === 'undefined' || !auth || !db) {
// //             console.error("Firebase not initialized");
// //             return;
// //         }

// //         auth.onAuthStateChanged((user) => {
// //             if (user) {
// //                 initializeAccentColorSettings(user);
// //             } else {
// //                 console.warn("No user signed in.");
// //                 // Apply default color for logged out state
// //                 applyAccentColor('#3b82f6');
// //             }
// //         });
// //     }, 500);
// // });

// // function initializeAccentColorSettings(user) {
// //     const accentColorInput = document.getElementById('accentColor');
// //     const saveAccentColorButton = document.getElementById('saveAccentColor');
// //     const colorPresets = document.querySelectorAll('.color-preset');
// //     const resetColorButton = document.getElementById('resetColorButton');

// //     if (!accentColorInput || !saveAccentColorButton) {
// //         console.error("Required elements not found.");
// //         return;
// //     }

// //     // Check localStorage first for faster loading
// //     const userColorKey = `accentColor_${user.uid}`;
// //     const localColor = localStorage.getItem(userColorKey);
    
// //     if (localColor && isValidHexColor(localColor)) {
// //         accentColorInput.value = localColor;
// //         applyAccentColorPreview(localColor);
// //     } else {
// //         // Apply default color if no local color found
// //         accentColorInput.value = '#3b82f6';
// //         applyAccentColorPreview('#3b82f6');
// //     }

// //     // Then check Firebase
// //     db.collection('users').doc(user.uid).get()
// //         .then((doc) => {
// //             if (doc.exists) {
// //                 let firebaseColor = doc.data().accentColor;
                
// //                 // If no accent color in Firebase, set default and update Firebase
// //                 if (!firebaseColor) {
// //                     firebaseColor = '#3b82f6';
// //                     db.collection('users').doc(user.uid).update({
// //                         accentColor: firebaseColor
// //                     }).catch(error => {
// //                         console.error("Error setting default accent color:", error);
// //                     });
// //                 }
                
// //                 // Only update if different from local storage
// //                 if (!localColor || localColor !== firebaseColor) {
// //                     accentColorInput.value = firebaseColor;
// //                     applyAccentColorPreview(firebaseColor);
// //                     // Update localStorage to match Firebase
// //                     localStorage.setItem(userColorKey, firebaseColor);
// //                 }
// //             }
// //         })
// //         .catch((error) => {
// //             console.error("Error fetching accent color:", error);
// //         });

// //     // Color preset buttons
// //     colorPresets.forEach(preset => {
// //         preset.addEventListener('click', (e) => {
// //             e.preventDefault();
// //             const color = preset.dataset.color;
// //             if (color && isValidHexColor(color)) {
// //                 accentColorInput.value = color;
// //                 applyAccentColorPreview(color);
// //             }
// //         });
// //     });

// //     // Live preview on input change
// //     accentColorInput.addEventListener('input', (e) => {
// //         if (isValidHexColor(e.target.value)) {
// //             applyAccentColorPreview(e.target.value);
// //         }
// //     });

// //     // Save accent color
// //     saveAccentColorButton.addEventListener('click', () => {
// //         const color = accentColorInput.value;

// //         if (!isValidHexColor(color)) {
// //             showNotification('Please select a valid color', 'error');
// //             return;
// //         }

// //         saveAccentColorButton.disabled = true;
// //         saveAccentColorButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

// //         // Save to localStorage immediately
// //         localStorage.setItem(userColorKey, color);
// //         applyAccentColor(color, user.uid);

// //         // Then save to Firebase
// //         db.collection('users').doc(user.uid).update({
// //             accentColor: color,
// //             lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
// //         })
// //         .then(() => {
// //             showNotification('Accent color updated successfully!');
// //         })
// //         .catch((error) => {
// //             console.error('Error updating accent color:', error);
// //             showNotification('Error updating accent color. Changes saved locally.', 'error');
// //         })
// //         .finally(() => {
// //             saveAccentColorButton.disabled = false;
// //             saveAccentColorButton.innerHTML = '<i class="fas fa-save"></i> Save Color';
// //         });
// //     });

// //     // Reset to default color
// //     if (resetColorButton) {
// //         resetColorButton.addEventListener('click', () => {
// //             const defaultColor = '#3b82f6';
// //             accentColorInput.value = defaultColor;
// //             applyAccentColorPreview(defaultColor);
            
// //             // Save the reset immediately
// //             localStorage.setItem(userColorKey, defaultColor);
// //             applyAccentColor(defaultColor, user.uid);
            
// //             // Update Firebase
// //             db.collection('users').doc(user.uid).update({
// //                 accentColor: defaultColor,
// //                 lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
// //             })
// //             .then(() => {
// //                 showNotification('Color reset to default successfully!');
// //             })
// //             .catch((error) => {
// //                 console.error('Error resetting accent color:', error);
// //                 showNotification('Error resetting color. Default applied locally.', 'error');
// //             });
// //         });
// //     }
// // }

// // function isValidHexColor(color) {
// //     return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
// // }

// // function showNotification(message, type = 'success') {
// //     // Create notification element if it doesn't exist
// //     let notification = document.getElementById('colorNotification');
// //     if (!notification) {
// //         notification = document.createElement('div');
// //         notification.id = 'colorNotification';
// //         notification.className = 'notification hidden';
// //         notification.innerHTML = `
// //             <span id="color-notification-message"></span>
// //             <button onclick="this.parentElement.classList.add('hidden')">&times;</button>
// //         `;
// //         document.body.appendChild(notification);
        
// //         // Add some basic styles
// //         const style = document.createElement('style');
// //         style.textContent = `
// //             .notification {
// //                 position: fixed;
// //                 top: 20px;
// //                 right: 20px;
// //                 padding: 15px 20px;
// //                 border-radius: 5px;
// //                 color: white;
// //                 z-index: 10000;
// //                 display: flex;
// //                 align-items: center;
// //                 gap: 10px;
// //                 max-width: 300px;
// //             }
// //             .notification.success { background: #4CAF50; }
// //             .notification.error { background: #f44336; }
// //             .notification.warning { background: #ff9800; }
// //             .notification.hidden { display: none; }
// //             .notification button {
// //                 background: none;
// //                 border: none;
// //                 color: white;
// //                 cursor: pointer;
// //                 font-size: 18px;
// //             }
// //         `;
// //         document.head.appendChild(style);
// //     }
    
// //     const notificationMessage = document.getElementById('color-notification-message');
// //     if (notificationMessage) {
// //         notificationMessage.textContent = message;
// //     }
// //     notification.className = `notification ${type}`;
// //     notification.classList.remove('hidden');
    
// //     setTimeout(() => {
// //         notification.classList.add('hidden');
// //     }, 3000);
// // }

// // // Helper function to preview changes without saving
// // function applyAccentColorPreview(color) {
// //     if (!isValidHexColor(color)) return;
    
// //     document.documentElement.style.setProperty('--primary', color);
// //     const lighterColor = lightenColor(color, 20);
// //     const darkerColor = darkenColor(color, 15);
// //     const textColor = getContrastColor(color);
    
// //     document.documentElement.style.setProperty('--primary-light', lighterColor);
// //     document.documentElement.style.setProperty('--primary-dark', darkerColor);
// //     document.documentElement.style.setProperty('--primary-text', textColor);
// // }

// // // Helper function to lighten a color
// // function lightenColor(color, percent) {
// //     const num = parseInt(color.replace("#", ""), 16);
// //     const amt = Math.round(2.55 * percent);
// //     const R = Math.min(255, (num >> 16) + amt);
// //     const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
// //     const B = Math.min(255, (num & 0x0000FF) + amt);

// //     return "#" + (1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1).toUpperCase();
// // }

// // // Helper function to darken a color
// // function darkenColor(color, percent) {
// //     const num = parseInt(color.replace("#", ""), 16);
// //     const amt = Math.round(2.55 * percent);
// //     const R = Math.max(0, (num >> 16) - amt);
// //     const G = Math.max(0, ((num >> 8) & 0x00FF) - amt);
// //     const B = Math.max(0, (num & 0x0000FF) - amt);

// //     return "#" + (1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1).toUpperCase();
// // }

// // // Helper function to get contrasting text color
// // function getContrastColor(hex) {
// //     const r = parseInt(hex.slice(1, 3), 16);
// //     const g = parseInt(hex.slice(3, 5), 16);
// //     const b = parseInt(hex.slice(5, 7), 16);
// //     return (r * 0.299 + g * 0.587 + b * 0.114) > 150 ? '#000000' : '#FFFFFF';
// // }

// // // Make functions available globally
// // window.applyAccentColorPreview = applyAccentColorPreview;
// // window.isValidHexColor = isValidHexColor;






































































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