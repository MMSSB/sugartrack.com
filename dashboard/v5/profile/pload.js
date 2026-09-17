// // profile/pload.js - FIXED FOR FOLDER STRUCTURE
// import { auth, db, signOut } from "../firebase-init.js"; // Added ../ to reach root
// import { doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
// import { PROFILE_ICONS } from "./pimage.js"; // If pimage.js is in the SAME profile folder

// window.logoutUser = () => {
//     signOut(auth).then(() => {
//         window.location.href = 'login.html';
//     }).catch(err => console.error("Logout Error:", err));
// };

// document.addEventListener("DOMContentLoaded", () => {
//     auth.onAuthStateChanged((user) => {
//         if (user) {
//             const userRef = doc(db, "users", user.uid);
//             onSnapshot(userRef, (docSnap) => {
//                 if (docSnap.exists()) {
//                     const userData = docSnap.data();
//                     syncUI(user, userData);
//                 }
//             });
//         } else {
//             const path = window.location.pathname;
//             if (!path.includes('login.html') && !path.includes('signup.html')) {
//                 window.location.href = 'login.html';
//             }
//         }
//     });
// });

// function syncUI(user, data) {
//     // 1. Update First Name (Hero section and Sidebar)
//     const nameEls = document.querySelectorAll('.u-name, #userWelcomeName, #userNameDisplay, .hero-section h1');
//     nameEls.forEach(el => {
//         const name = data.firstName || user.email.split('@')[0];
//         if (el.tagName === 'H1') el.textContent = `Hello, ${name} 👋`;
//         else el.textContent = name;
//     });

//     // 2. Update Email (Sidebar - Added missing selector)
//     const emailEls = document.querySelectorAll('.u-mail, #UserEmailDisplay');
//     emailEls.forEach(el => {
//         el.textContent = user.email;
//     });

//     // 3. Resolve Image
//     const imageSrc = data.profileIconId ? PROFILE_ICONS[data.profileIconId] : "images/user.png";

//     // 4. Update all existing image tags
//     const imgs = document.querySelectorAll('.avatar img, #profilePhoto, #navProfilePhoto, #currentProfileImage');
//     imgs.forEach(img => {
//         img.src = imageSrc;
//         img.onerror = () => { img.src = "images/user.png"; };
//     });

//     // 5. Inject Image into Sidebar "Avatar" div
//     const avatarDivs = document.querySelectorAll('.avatar');
//     avatarDivs.forEach(div => {
//         div.innerHTML = `<img src="${imageSrc}" style="width:100%; height:100%; border-radius:inherit; object-fit:cover;">`;
//         div.style.background = 'transparent';
//     });
// }








// import { auth, db } from "../firebase-init.js"; 
// import { doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
// import { PROFILE_ICONS } from "./pimage.js"; 

// // Global Logout Function
// window.logoutUser = () => {
//     auth.signOut().then(() => {
//         window.location.href = 'login.html';
//     }).catch(err => console.error("Logout Error:", err));
// };

// document.addEventListener("DOMContentLoaded", () => {
//     auth.onAuthStateChanged((user) => {
//         if (user) {
//             const userRef = doc(db, "users", user.uid);
            
//             // Listen to Firestore for real-time profile updates
//             onSnapshot(userRef, (docSnap) => {
//                 if (docSnap.exists()) {
//                     const userData = docSnap.data();
//                     syncUI(user, userData);
//                 }
//             });
//         } else {
//             // Kick user to login if not authenticated
//             const path = window.location.pathname;
//             if (!path.includes('login.html') && !path.includes('signup.html')) {
//                 window.location.href = 'login.html';
//             }
//         }
//     });
// });

// function syncUI(user, data) {
//     // --- Update Names ---
//     const displayName = data.firstName && data.lastName ? `${data.firstName} ${data.lastName}` : (data.firstName || data.username || user.email.split('@')[0]);
    
//     const nameElements = document.querySelectorAll('.u-name, #userBadgeName, #UserNameDisplay, #displayNameLabel');
//     nameElements.forEach(el => {
//         if (el) el.textContent = displayName;
//     });

//     // --- Update Emails ---
//     const emailElements = document.querySelectorAll('.u-mail');
//     emailElements.forEach(el => {
//         if (el) el.textContent = user.email;
//     });
    
//     const emailDisplay = document.getElementById('UserEmailDisplay');
//     if (emailDisplay) {
//         emailDisplay.innerHTML = `<i class="fa-solid fa-envelope" style="font-size: 0.8rem; margin-right: 5px;"></i> ${user.email}`;
//     }

//     // --- Update Inputs in Profile Page (If currently on profile.html) ---
//     if (document.getElementById('inputFirstName')) document.getElementById('inputFirstName').value = data.firstName || data.username || "";
//     if (document.getElementById('inputLastName')) document.getElementById('inputLastName').value = data.lastName || "";
//     if (document.getElementById('inputEmail')) document.getElementById('inputEmail').value = user.email || "";
//     if (document.getElementById('inputBio')) document.getElementById('inputBio').value = data.bio || "";
//     if (document.getElementById('inputLocation')) document.getElementById('inputLocation').value = data.location || "";
//     if (document.getElementById('inputType')) document.getElementById('inputType').value = data.diabetesType || "none";

//     // --- Update Profile Image ---
//     updateProfileImage(data);
// }

// function updateProfileImage(data) {
//     // FIX: Look for 'profileImage' first (the actual string path in Firebase)
//     // If not found, fallback to 'profileIconId' or use a default image.
//     const imageSrc = data.profileImage || (data.profileIconId ? PROFILE_ICONS[data.profileIconId] : "images/user.png");
    
//     // Update all standalone image tags
//     const imgSelectors = ['#profilePhoto', '#navProfilePhoto', '#mainProfilePhoto', '#currentProfileImage'];
//     imgSelectors.forEach(selector => {
//         document.querySelectorAll(selector).forEach(img => {
//             if (img) {
//                 img.src = imageSrc;
                
//                 // Fallback just in case the image fails to load
//                 img.onerror = () => { img.src = "images/user.png"; };
//             }
//         });
//     });
    
//     // Update avatar container divs (like in the sidebar where it used to just say 'U')
//     document.querySelectorAll('.avatar').forEach(div => {
//         // If there's no image tag inside the avatar div yet, inject one
//         if (!div.querySelector('img')) {
//             // Keep the border-radius 6px to match your new modern square UI
//             div.innerHTML = `<img src="${imageSrc}" style="width: 100%; height: 100%; border-radius: 6px; object-fit: cover;">`;
//         } else {
//             // If it already has an image tag, just update the source
//             div.querySelector('img').src = imageSrc;
//         }
//     });
// }








// // profile/pload.js - Complete Working Version
// import { auth, db, signOut } from "../firebase-init.js";
// import { doc, onSnapshot, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
// import { PROFILE_ICONS } from "./pimage.js";

// // Make logout function globally available
// window.logoutUser = () => {
//     signOut(auth).then(() => {
//         window.location.href = 'login.html';
//     }).catch(err => console.error("Logout Error:", err));
// };

// // Initialize on page load
// document.addEventListener("DOMContentLoaded", () => {
//     initializeAuthListener();
//     initializeEventListeners();
// });

// function initializeAuthListener() {
//     auth.onAuthStateChanged((user) => {
//         if (user) {
//             // Real-time listener for user data
//             const userRef = doc(db, "users", user.uid);
//             onSnapshot(userRef, (docSnap) => {
//                 if (docSnap.exists()) {
//                     const userData = docSnap.data();
//                     syncUI(user, userData);
//                 }
//             });
            
//             // Load stats
//             loadUserStats(user.uid);
//         } else {
//             // Redirect to login if not on login/signup page
//             const path = window.location.pathname;
//             if (!path.includes('login.html') && !path.includes('signup.html')) {
//                 window.location.href = 'login.html';
//             }
//         }
//     });
// }

// function initializeEventListeners() {
//     // Logout button
//     const logoutBtn = document.getElementById('logoutButton');
//     if (logoutBtn) {
//         logoutBtn.addEventListener('click', (e) => {
//             e.preventDefault();
//             logoutUser();
//         });
//     }
// }

// async function loadUserStats(uid) {
//     try {
//         const readingsRef = collection(db, "users", uid, "readings");
//         const readingsSnap = await getDocs(readingsRef);
//         const readingsCount = readingsSnap.size;
        
//         // Update stats in sidebar or anywhere else
//         const statElements = document.querySelectorAll('.stat-item .stat-val');
//         if (statElements.length > 0) {
//             statElements[0].textContent = readingsCount || '0';
//         }
//     } catch (error) {
//         console.error("Error loading user stats:", error);
//     }
// }

// function syncUI(user, data) {
//     if (!user) return;
    
//     // Get display name
//     const displayName = data.firstName || user.email.split('@')[0];
    
//     // Update all name elements
//     updateNameElements(displayName);
    
//     // Update email displays
//     updateEmailElements(user.email);
    
//     // Update profile image
//     updateProfileImage(data);
// }

// function updateNameElements(displayName) {
//     const nameSelectors = ['.u-name', '#userWelcomeName', '#userNameDisplay', '.hero-section h1'];
//     nameSelectors.forEach(selector => {
//         document.querySelectorAll(selector).forEach(el => {
//             if (el) {
//                 if (el.tagName === 'H1') {
//                     el.textContent = `Hello, ${displayName} 👋`;
//                 } else {
//                     el.textContent = displayName;
//                 }
//             }
//         });
//     });
// }

// function updateEmailElements(email) {
//     const emailSelectors = ['.u-mail', '#UserEmailDisplay'];
//     emailSelectors.forEach(selector => {
//         document.querySelectorAll(selector).forEach(el => {
//             if (el) {
//                 if (el.id === 'UserEmailDisplay') {
//                     el.innerHTML = `<i class="fa-solid fa-envelope" style="font-size: 0.8rem;"></i> ${email}`;
//                 } else {
//                     el.textContent = email;
//                 }
//             }
//         });
//     });
// }

// function updateProfileImage(data) {
//     // Determine image source
//     const imageSrc = data.profileIconId ? PROFILE_ICONS[data.profileIconId] : "images/user.png";
    
//     // Update all image elements
//     const imgSelectors = ['.avatar img', '#profilePhoto', '#navProfilePhoto', '#currentProfileImage'];
//     imgSelectors.forEach(selector => {
//         document.querySelectorAll(selector).forEach(img => {
//             if (img) {
//                 img.src = imageSrc;
//                 img.onerror = () => { img.src = "images/user.png"; };
//             }
//         });
//     });
    
//     // Update avatar divs
//     document.querySelectorAll('.avatar').forEach(div => {
//         if (!div.querySelector('img')) {
//             div.innerHTML = `<img src="${imageSrc}" style="width:100%; height:100%; border-radius:inherit; object-fit:cover;">`;
//         }
//         div.style.background = 'transparent';
//     });
// }
























import { auth, db, signOut } from "../firebase-init.js";
import { doc, onSnapshot, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { PROFILE_ICONS } from "./pimage.js";

// Import the smart greetings engine
import { getSmartGreeting } from "../greetings.js";

// Make logout function globally available
window.logoutUser = () => {
    signOut(auth).then(() => {
        window.location.href = 'login.html';
    }).catch(err => console.error("Logout Error:", err));
};

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
    initializeAuthListener();
    initializeEventListeners();
});

function initializeAuthListener() {
    auth.onAuthStateChanged((user) => {
        if (user) {
            // Real-time listener for user data
            const userRef = doc(db, "users", user.uid);
            onSnapshot(userRef, (docSnap) => {
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    syncUI(user, userData);
                }
            });
            
            // Load stats (for sidebar or dashboard if needed)
            loadUserStats(user.uid);
        } else {
            // Redirect to login if not on login/signup page
            const path = window.location.pathname;
            if (!path.includes('login.html') && !path.includes('signup.html')) {
                window.location.href = 'login.html';
            }
        }
    });
}

function initializeEventListeners() {
    // Logout button
    const logoutBtn = document.getElementById('logoutButton');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logoutUser();
        });
    }
}

async function loadUserStats(uid) {
    try {
        const readingsRef = collection(db, "users", uid, "readings");
        const readingsSnap = await getDocs(readingsRef);
        const readingsCount = readingsSnap.size;
        
        // Update stats in sidebar or anywhere else
        const statElements = document.querySelectorAll('.stat-item .stat-val');
        if (statElements.length > 0) {
            statElements[0].textContent = readingsCount || '0';
        }
    } catch (error) {
        console.error("Error loading user stats:", error);
    }
}

function syncUI(user, data) {
    if (!user) return;
    
    // Get display name
    const displayName = data.firstName || user.email.split('@')[0];
    
    // Update all name elements (passing dateOfBirth for the smart greeting)
    updateNameElements(displayName, data.dateOfBirth);
    
    // Update email displays
    updateEmailElements(user.email);
    
    // Update profile image properly from Firebase
    updateProfileImage(data);
}

function updateNameElements(displayName, dob) {
    const nameSelectors = ['.u-name', '#userWelcomeName', '#userNameDisplay', '.hero-section h1', '#displayNameLabel'];
    nameSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            if (el) {
                // If it's the main H1 tag in the hero section, apply the smart greeting + birthday check
                if (el.tagName === 'H1' && el.closest('.hero-section')) {
                    el.textContent = getSmartGreeting(displayName, dob);
                } else {
                    el.textContent = displayName;
                }
            }
        });
    });
}

function updateEmailElements(email) {
    const emailSelectors = ['.u-mail', '#UserEmailDisplay', '#inputEmail'];
    emailSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            if (el) {
                if (el.id === 'UserEmailDisplay') {
                    el.innerHTML = `<i class="fa-solid fa-envelope" style="font-size: 0.8rem; margin-right: 5px;"></i> ${email}`;
                } else if (el.tagName === 'INPUT') {
                    el.value = email;
                } else {
                    el.textContent = email;
                }
            }
        });
    });
}

function updateProfileImage(data) {
    // FIX: Look for 'profileImage' first (the actual string path in Firebase)
    // If not found, fallback to 'profileIconId' or use a default image.
    const imageSrc = data.profileImage || (data.profileIconId ? PROFILE_ICONS[data.profileIconId] : "images/user.png");
    
    // Update all standalone image tags
    const imgSelectors = ['#profilePhoto', '#navProfilePhoto', '#mainProfilePhoto', '#currentProfileImage'];
    imgSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(img => {
            if (img) {
                img.src = imageSrc;
                // Fallback just in case the image fails to load
                img.onerror = () => { img.src = "images/user.png"; };
            }
        });
    });
    
    // Update avatar container divs (sidebar, headers, etc.)
    document.querySelectorAll('.avatar').forEach(div => {
        // If there's no image tag inside the avatar div yet, inject one
        if (!div.querySelector('img')) {
            div.innerHTML = `<img src="${imageSrc}" style="width: 100%; height: 100%; border-radius: inherit; object-fit: cover;">`;
        } else {
            // If it already has an image tag, just update the source
            div.querySelector('img').src = imageSrc;
        }
        div.style.background = 'transparent';
    });
}