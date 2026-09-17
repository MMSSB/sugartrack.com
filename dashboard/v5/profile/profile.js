// // // profile.js - Fixed Import Paths
// // import { auth, db } from "./firebase-init.js";
// // import { doc, getDoc, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
// // import { PROFILE_ICONS } from "./pimage.js"; // Changed from ../ to ./

// // document.addEventListener('DOMContentLoaded', () => {
// //     let selectedId = null;

// //     // Load initial data
// //     auth.onAuthStateChanged(async (user) => {
// //         if (user) {
// //             const docSnap = await getDoc(doc(db, "users", user.uid));
// //             if (docSnap.exists()) {
// //                 const data = docSnap.data();
// //                 const fNameInput = document.getElementById('firstName');
// //                 const lNameInput = document.getElementById('lastName');
                
// //                 if(fNameInput) fNameInput.value = data.firstName || "";
// //                 if(lNameInput) lNameInput.value = data.lastName || "";
                
// //                 selectedId = data.profileIconId || 1;
// //             }
// //         }
// //     });

// //     // Handle Avatar Modal
// //     const modal = document.getElementById('avatarModal');
// //     const openBtn = document.getElementById('openAvatarModal');
    
// //     if (openBtn) {
// //         openBtn.onclick = () => {
// //             modal.classList.add('active');
// //             const grid = document.getElementById('avatarGridModal');
// //             grid.innerHTML = '';
            
// //             Object.entries(PROFILE_ICONS).forEach(([id, url]) => {
// //                 const img = document.createElement('img');
// //                 img.src = url;
// //                 img.className = `avatar-option ${id == selectedId ? 'selected' : ''}`;
// //                 img.onclick = () => {
// //                     document.querySelectorAll('.avatar-option').forEach(i => i.classList.remove('selected'));
// //                     img.classList.add('selected');
// //                     selectedId = id;
// //                 };
// //                 grid.appendChild(img);
// //             });
// //         };
// //     }

// //     // Close Modal Logic (Added missing close logic)
// //     document.querySelectorAll('.close-modal').forEach(btn => {
// //         btn.onclick = () => modal.classList.remove('active');
// //     });

// //     // Save Logic
// //     const saveImgBtn = document.getElementById('saveProfileImageModal');
// //     if (saveImgBtn) {
// //         saveImgBtn.onclick = async () => {
// //             await updateDoc(doc(db, "users", auth.currentUser.uid), {
// //                 profileIconId: selectedId,
// //                 lastUpdated: serverTimestamp()
// //             });
// //             modal.classList.remove('active');
// //         };
// //     }

// //     const updateDetailsBtn = document.getElementById('updateProfileButton');
// //     if (updateDetailsBtn) {
// //         updateDetailsBtn.onclick = async () => {
// //             await updateDoc(doc(db, "users", auth.currentUser.uid), {
// //                 firstName: document.getElementById('firstName').value,
// //                 lastName: document.getElementById('lastName').value,
// //                 lastUpdated: serverTimestamp()
// //             });
            
// //             // Trigger the notification you have in HTML
// //             const note = document.getElementById('notification');
// //             const noteMsg = document.getElementById('notification-message');
// //             if(note && noteMsg) {
// //                 noteMsg.textContent = "Profile successfully updated!";
// //                 note.classList.remove('hidden');
// //                 setTimeout(() => note.classList.add('hidden'), 3000);
// //             }
// //         };
// //     }
// // });


























// // profile.js - Complete Working Version
// import { auth, db } from "./firebase-init.js";
// import { doc, getDoc, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
// import { PROFILE_ICONS } from "./pimage.js";

// // Global variables
// let selectedId = null;
// let currentUser = null;

// document.addEventListener('DOMContentLoaded', () => {
//     initializeEventListeners();
//     checkAuthState();
// });

// function initializeEventListeners() {
//     // Avatar modal open
//     const openBtn = document.getElementById('openAvatarModal');
//     if (openBtn) {
//         openBtn.addEventListener('click', openAvatarModal);
//     }

//     // Close modal buttons
//     document.querySelectorAll('.close-modal').forEach(btn => {
//         btn.addEventListener('click', closeAvatarModal);
//     });

//     // Click outside modal to close
//     const modal = document.getElementById('avatarModal');
//     if (modal) {
//         modal.addEventListener('click', (e) => {
//             if (e.target === modal) {
//                 closeAvatarModal();
//             }
//         });
//     }

//     // Save avatar button
//     const saveImgBtn = document.getElementById('saveProfileImageModal');
//     if (saveImgBtn) {
//         saveImgBtn.addEventListener('click', saveAvatar);
//     }

//     // Save all changes button
//     const updateBtn = document.getElementById('updateProfileButton');
//     if (updateBtn) {
//         updateBtn.addEventListener('click', saveAllChanges);
//     }

//     // Date of birth input
//     const dobInput = document.querySelector('input[type="date"]');
//     if (dobInput) {
//         dobInput.addEventListener('change', handleDateChange);
//     }

//     // Diabetes type radio buttons
//     document.querySelectorAll('input[name="dtype"]').forEach(radio => {
//         radio.addEventListener('change', handleDiabetesTypeChange);
//     });

//     // Therapy method select
//     const therapySelect = document.querySelector('select');
//     if (therapySelect) {
//         therapySelect.addEventListener('change', handleTherapyChange);
//     }

//     // Diagnosis year input
//     const diagnosisInput = document.querySelector('input[type="number"]');
//     if (diagnosisInput) {
//         diagnosisInput.addEventListener('input', handleDiagnosisChange);
//     }
// }

// function checkAuthState() {
//     auth.onAuthStateChanged(async (user) => {
//         if (user) {
//             currentUser = user;
//             await loadUserData(user.uid);
//             await loadUserStats(user.uid);
//         } else {
//             // Redirect to login if not authenticated
//             const path = window.location.pathname;
//             if (!path.includes('login.html') && !path.includes('signup.html')) {
//                 window.location.href = 'login.html';
//             }
//         }
//     });
// }

// async function loadUserData(uid) {
//     try {
//         const docRef = doc(db, "users", uid);
//         const docSnap = await getDoc(docRef);
        
//         if (docSnap.exists()) {
//             const data = docSnap.data();
            
//             // Load personal details
//             document.getElementById('firstName').value = data.firstName || '';
//             document.getElementById('lastName').value = data.lastName || '';
//             document.getElementById('UserEmailDisplay').innerHTML = `<i class="fa-solid fa-envelope" style="font-size: 0.8rem;"></i> ${currentUser.email}`;
            
//             // Load date of birth
//             const dobInput = document.querySelector('input[type="date"]');
//             if (dobInput && data.dateOfBirth) {
//                 dobInput.value = data.dateOfBirth;
//             }
            
//             // Load diabetes type
//             if (data.diabetesType) {
//                 const radio = document.getElementById(data.diabetesType);
//                 if (radio) radio.checked = true;
//             }
            
//             // Load therapy method
//             const therapySelect = document.querySelector('select');
//             if (therapySelect && data.therapyMethod) {
//                 therapySelect.value = data.therapyMethod;
//             }
            
//             // Load diagnosis year
//             const diagnosisInput = document.querySelector('input[type="number"]');
//             if (diagnosisInput && data.diagnosisYear) {
//                 diagnosisInput.value = data.diagnosisYear;
//             }
            
//             // Load profile icon
//             selectedId = data.profileIconId || 1;
            
//             // Update profile image
//             updateProfileImage(selectedId);
            
//             // Update display name
//             const displayName = data.firstName || currentUser.email.split('@')[0];
//             document.getElementById('userNameDisplay').textContent = displayName;
//             document.getElementById('userWelcomeName').textContent = displayName;
//             document.querySelectorAll('.u-name').forEach(el => {
//                 el.textContent = displayName;
//             });
//         }
//     } catch (error) {
//         console.error("Error loading user data:", error);
//         showNotification("Error loading profile data", "error");
//     }
// }

// async function loadUserStats(uid) {
//     try {
//         // Load readings count from readings subcollection
//         const readingsRef = collection(db, "users", uid, "readings");
//         const readingsSnap = await getDocs(readingsRef);
//         const readingsCount = readingsSnap.size;
        
//         // Update stats in UI
//         const statVals = document.querySelectorAll('.stat-val');
//         if (statVals.length >= 2) {
//             statVals[0].textContent = readingsCount || '0';
            
//             // Calculate streak (you'll need to implement this based on your data)
//             statVals[1].textContent = calculateStreak(readingsSnap.docs) || '0';
//         }
//     } catch (error) {
//         console.error("Error loading stats:", error);
//     }
// }

// function calculateStreak(readings) {
//     // Implement streak calculation based on your readings data
//     // This is a placeholder - customize based on your needs
//     return '7'; // Example: 7 day streak
// }

// function updateProfileImage(iconId) {
//     const imageSrc = PROFILE_ICONS[iconId] || "images/user.png";
//     const profileImg = document.getElementById('currentProfileImage');
//     if (profileImg) {
//         profileImg.src = imageSrc;
//         profileImg.onerror = () => { profileImg.src = "images/user.png"; };
//     }
    
//     // Update sidebar avatar
//     const avatarDivs = document.querySelectorAll('.avatar');
//     avatarDivs.forEach(div => {
//         div.innerHTML = `<img src="${imageSrc}" style="width:100%; height:100%; border-radius:inherit; object-fit:cover;">`;
//     });
// }

// function openAvatarModal() {
//     const modal = document.getElementById('avatarModal');
//     const grid = document.getElementById('avatarGridModal');
    
//     // Clear and populate grid
//     grid.innerHTML = '';
//     Object.entries(PROFILE_ICONS).forEach(([id, url]) => {
//         const img = document.createElement('img');
//         img.src = url;
//         img.className = `avatar-option ${id == selectedId ? 'selected' : ''}`;
//         img.dataset.id = id;
//         img.addEventListener('click', () => selectAvatar(img, id));
//         grid.appendChild(img);
//     });
    
//     modal.classList.add('active');
// }

// function selectAvatar(imgElement, id) {
//     document.querySelectorAll('.avatar-option').forEach(i => i.classList.remove('selected'));
//     imgElement.classList.add('selected');
//     selectedId = id;
// }

// function closeAvatarModal() {
//     document.getElementById('avatarModal').classList.remove('active');
// }

// async function saveAvatar() {
//     if (!currentUser || !selectedId) return;
    
//     try {
//         await updateDoc(doc(db, "users", currentUser.uid), {
//             profileIconId: parseInt(selectedId),
//             lastUpdated: serverTimestamp()
//         });
        
//         updateProfileImage(selectedId);
//         closeAvatarModal();
//         showNotification("Profile picture updated successfully!");
//     } catch (error) {
//         console.error("Error saving avatar:", error);
//         showNotification("Error updating profile picture", "error");
//     }
// }

// async function saveAllChanges() {
//     if (!currentUser) return;
    
//     try {
//         const updates = {
//             firstName: document.getElementById('firstName').value,
//             lastName: document.getElementById('lastName').value,
//             dateOfBirth: document.querySelector('input[type="date"]').value,
//             diabetesType: getSelectedDiabetesType(),
//             therapyMethod: document.querySelector('select').value,
//             diagnosisYear: document.querySelector('input[type="number"]').value,
//             lastUpdated: serverTimestamp()
//         };
        
//         await updateDoc(doc(db, "users", currentUser.uid), updates);
        
//         // Update display name
//         const displayName = updates.firstName || currentUser.email.split('@')[0];
//         document.getElementById('userNameDisplay').textContent = displayName;
//         document.getElementById('userWelcomeName').textContent = displayName;
//         document.querySelectorAll('.u-name').forEach(el => {
//             el.textContent = displayName;
//         });
        
//         showNotification("Profile successfully updated!");
//     } catch (error) {
//         console.error("Error saving profile:", error);
//         showNotification("Error saving profile changes", "error");
//     }
// }

// function getSelectedDiabetesType() {
//     const selected = document.querySelector('input[name="dtype"]:checked');
//     return selected ? selected.id : null;
// }

// function handleDateChange(e) {
//     // You can add real-time validation if needed
//     console.log("Date of birth changed:", e.target.value);
// }

// function handleDiabetesTypeChange(e) {
//     console.log("Diabetes type changed:", e.target.id);
// }

// function handleTherapyChange(e) {
//     console.log("Therapy method changed:", e.target.value);
// }

// function handleDiagnosisChange(e) {
//     // Ensure valid year
//     const year = parseInt(e.target.value);
//     const currentYear = new Date().getFullYear();
//     if (year < 1900 || year > currentYear) {
//         e.target.value = '';
//     }
// }

// function showNotification(message, type = "success") {
//     const notification = document.getElementById('notification');
//     const messageEl = document.getElementById('notification-message');
//     const icon = notification.querySelector('i');
    
//     if (type === "success") {
//         icon.style.color = "var(--success)";
//         icon.className = "fa-solid fa-circle-check";
//     } else {
//         icon.style.color = "var(--danger)";
//         icon.className = "fa-solid fa-circle-exclamation";
//     }
    
//     messageEl.textContent = message;
//     notification.classList.remove('hidden');
    
//     setTimeout(() => {
//         notification.classList.add('hidden');
//     }, 3000);
// }




















import { auth, db } from "../firebase-init.js";
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { PROFILE_ICONS } from "./pimage.js"; 

document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Elements ---
    const inputFirstName = document.getElementById('inputFirstName');
    const inputLastName = document.getElementById('inputLastName');
    const inputEmail = document.getElementById('inputEmail');
    const inputBio = document.getElementById('inputBio');
    const inputLocation = document.getElementById('inputLocation');
    const inputType = document.getElementById('inputType');

    const saveBar = document.getElementById('profileSaveBar');
    const saveBtn = document.getElementById('profileSaveBtn');
    const discardBtn = document.getElementById('profileDiscardBtn');
    
    const avatarModal = document.getElementById('avatarModal');
    const openModalBtn = document.getElementById('openAvatarModalBtn');
    const closeModalBtn = document.getElementById('closeAvatarModal');
    const modalGrid = document.getElementById('modalAvatarGrid');
    
    const mainProfilePhoto = document.getElementById('mainProfilePhoto');
    const navProfilePhoto = document.getElementById('navProfilePhoto');
    const displayNameLabel = document.getElementById('displayNameLabel');

    const inputDob = document.getElementById('inputDob');       // <--- NEW
    const inputGender = document.getElementById('inputGender'); // <--- NEW
    // --- State Variables ---
    let currentUser = null;
    let currentSavedAvatarSrc = "images/user.png"; // Fallback image
    let pendingAvatarSrc = null; 

    // ==========================================
    // 1. AUTH & LOAD DATA 
    // ==========================================
    auth.onAuthStateChanged((user) => {
        if (user) {
            currentUser = user;
            if (inputEmail) inputEmail.value = user.email;

            const userRef = doc(db, 'users', user.uid);
            getDoc(userRef).then((docSnap) => {
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    
                    // Populate Form Inputs safely
                    if (inputFirstName) inputFirstName.value = data.firstName || data.username || "";
                    if (inputLastName) inputLastName.value = data.lastName || "";
                    if (inputBio) inputBio.value = data.bio || "";
                    if (inputLocation) inputLocation.value = data.location || "";
                    if (inputType) inputType.value = data.diabetesType || "none";
                    if (inputDob) inputDob.value = data.dateOfBirth || "";      // <--- NEW
                    if (inputGender) inputGender.value = data.gender || "none"; // <--- NEW

                    // Smart Name Combiner
                    let displayFullName = "User";
                    if (data.firstName || data.lastName) {
                        displayFullName = [data.firstName, data.lastName].filter(Boolean).join(" ");
                    } else if (data.username) {
                        displayFullName = data.username;
                    } else if (user.email) {
                        displayFullName = user.email.split('@')[0];
                    }

                    if (displayNameLabel) displayNameLabel.textContent = displayFullName;
                    document.querySelectorAll('.u-name, #userBadgeName').forEach(el => el.textContent = displayFullName);

                    // --- PROFILE IMAGE SETUP ---
                    // Read the exact profileImage string from Firebase, or fallback to icon ID, or use default
                    currentSavedAvatarSrc = data.profileImage || (data.profileIconId ? PROFILE_ICONS[data.profileIconId] : "images/user.png");
                    
                    if (mainProfilePhoto) mainProfilePhoto.src = currentSavedAvatarSrc;
                    if (navProfilePhoto) navProfilePhoto.src = currentSavedAvatarSrc;
                    
                    document.querySelectorAll('.avatar').forEach(div => {
                        div.innerHTML = `<img src="${currentSavedAvatarSrc}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
                    });
                }
            }).catch(err => console.error("Error loading profile:", err));
        } else {
            window.location.href = '../login.html';
        }
    });

    // ==========================================
    // 2. MODAL AVATAR GRID
    // ==========================================
    if (modalGrid) {
        for (const [id, src] of Object.entries(PROFILE_ICONS)) {
            const div = document.createElement('div');
            div.className = 'avatar-item';
            div.dataset.id = id;
            div.innerHTML = `<img src="${src}" alt="Avatar ${id}">`;
            
            div.addEventListener('click', () => {
                document.querySelectorAll('.avatar-item').forEach(el => el.classList.remove('active'));
                div.classList.add('active');
                
                // Track the actual image path instead of just the ID
                pendingAvatarSrc = src; 
                mainProfilePhoto.src = src; 
                
                if(saveBar) saveBar.classList.add('visible');
                closeModal();
            });
            modalGrid.appendChild(div);
        }
    }

    function openModal() {
        if(avatarModal) avatarModal.classList.add('active');
        document.body.style.overflow = 'hidden'; 
    }
    function closeModal() {
        if(avatarModal) avatarModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if(openModalBtn) openModalBtn.addEventListener('click', openModal);
    if(closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if(avatarModal) avatarModal.addEventListener('click', (e) => { if (e.target === avatarModal) closeModal(); });

    // ==========================================
    // 3. TRIGGER SAVE BAR ON TYPING
    // ==========================================
    const formInputs = document.querySelectorAll('#profileForm input, #profileForm textarea, #profileForm select');
    formInputs.forEach(input => {
        input.addEventListener('input', () => saveBar.classList.add('visible'));
        input.addEventListener('change', () => saveBar.classList.add('visible'));
    });

    if(discardBtn) discardBtn.addEventListener('click', () => window.location.reload());

    // ==========================================
    // 4. SAVE CHANGES TO FIREBASE
    // ==========================================
    if(saveBtn) {
        saveBtn.addEventListener('click', async () => {
            if (!currentUser) return;

            saveBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';
            saveBtn.style.pointerEvents = "none";
            
            // Build the data packet for Firebase - explicitly saving 'profileImage'
            const updatedData = {
                firstName: inputFirstName.value.trim(),
                lastName: inputLastName.value.trim(),
                bio: inputBio.value.trim(),
                location: inputLocation.value.trim(),
                diabetesType: inputType.value,
                dateOfBirth: inputDob.value,     // <--- NEW
                gender: inputGender.value,       // <--- NEW
                profileImage: pendingAvatarSrc || currentSavedAvatarSrc 
            };

            const fullCombinedName = [updatedData.firstName, updatedData.lastName].filter(Boolean).join(" ");

            try {
                // Upload to Firestore
                const userRef = doc(db, 'users', currentUser.uid);
                await updateDoc(userRef, updatedData);

                // Success Feedback
                saveBtn.innerHTML = '<i class="fa-solid fa-check"></i> Saved';
                saveBtn.style.background = 'var(--success)';
                
                // Update live page names without refresh
                if(displayNameLabel) displayNameLabel.textContent = fullCombinedName || "User";
                document.querySelectorAll('.u-name, #userBadgeName').forEach(el => el.textContent = fullCombinedName || "User");
                
                if (pendingAvatarSrc) {
                    currentSavedAvatarSrc = pendingAvatarSrc;
                    navProfilePhoto.src = pendingAvatarSrc;
                    document.querySelectorAll('.avatar img').forEach(img => img.src = pendingAvatarSrc);
                }

                setTimeout(() => {
                    saveBtn.innerText = 'Save Profile';
                    saveBtn.style.background = 'var(--info, #3b82f6)';
                    saveBtn.style.pointerEvents = "auto";
                    if(saveBar) saveBar.classList.remove('visible');
                    
                    if(window.applyAccent) window.applyAccent(localStorage.getItem('accent_color'));
                }, 1500);

            } catch (error) {
                console.error("Error updating profile:", error);
                saveBtn.innerText = 'Error!';
                saveBtn.style.background = 'var(--danger)';
                setTimeout(() => {
                    saveBtn.innerText = 'Save Profile';
                    saveBtn.style.background = 'var(--info, #3b82f6)';
                    saveBtn.style.pointerEvents = "auto";
                }, 2000);
            }
        });
    }

    setTimeout(() => {
        const savedColor = localStorage.getItem('accent_color');
        if (savedColor && saveBtn) saveBtn.style.backgroundColor = savedColor;
    }, 100);
});







// import { auth, db } from "../firebase-init.js";
// import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
// import { PROFILE_ICONS } from "./pimage.js"; 

// document.addEventListener('DOMContentLoaded', () => {

//     // --- DOM Elements ---
//     const inputFirstName = document.getElementById('inputFirstName');
//     const inputLastName = document.getElementById('inputLastName');
//     const inputEmail = document.getElementById('inputEmail');
//     const inputBio = document.getElementById('inputBio');
//     const inputLocation = document.getElementById('inputLocation');
//     const inputType = document.getElementById('inputType');

//     const saveBar = document.getElementById('profileSaveBar');
//     const saveBtn = document.getElementById('profileSaveBtn');
//     const discardBtn = document.getElementById('profileDiscardBtn');
    
//     const avatarModal = document.getElementById('avatarModal');
//     const openModalBtn = document.getElementById('openAvatarModalBtn');
//     const closeModalBtn = document.getElementById('closeAvatarModal');
//     const modalGrid = document.getElementById('modalAvatarGrid');
    
//     const mainProfilePhoto = document.getElementById('mainProfilePhoto');
//     const navProfilePhoto = document.getElementById('navProfilePhoto');
//     const displayNameLabel = document.getElementById('displayNameLabel');

//     // --- State Variables ---
//     let currentUser = null;
//     let pendingAvatarId = null; 
//     let currentSavedAvatarId = null;

//     // ==========================================
//     // 1. AUTH & LOAD DATA 
//     // ==========================================
//     auth.onAuthStateChanged((user) => {
//         if (user) {
//             currentUser = user;
//             if (inputEmail) inputEmail.value = user.email;

//             const userRef = doc(db, 'users', user.uid);
//             getDoc(userRef).then((docSnap) => {
//                 if (docSnap.exists()) {
//                     const data = docSnap.data();
                    
//                     // Populate Form Inputs safely
//                     if (inputFirstName) inputFirstName.value = data.firstName || data.username || "";
//                     if (inputLastName) inputLastName.value = data.lastName || "";
//                     if (inputBio) inputBio.value = data.bio || "";
//                     if (inputLocation) inputLocation.value = data.location || "";
//                     if (inputType) inputType.value = data.diabetesType || "none";

//                     // Smart Name Combiner for Badges/Headers
//                     let displayFullName = "User";
//                     if (data.firstName || data.lastName) {
//                         displayFullName = [data.firstName, data.lastName].filter(Boolean).join(" ");
//                     } else if (data.username) {
//                         displayFullName = data.username;
//                     } else if (user.email) {
//                         displayFullName = user.email.split('@')[0];
//                     }

//                     if (displayNameLabel) displayNameLabel.textContent = displayFullName;
//                     document.querySelectorAll('.u-name, #userBadgeName').forEach(el => el.textContent = displayFullName);

//                     // Profile Image Setup
//                     currentSavedAvatarId = data.profileIconId || 1;
//                     const iconSrc = PROFILE_ICONS[currentSavedAvatarId] || "../images/user.png";
                    
//                     if (mainProfilePhoto) mainProfilePhoto.src = iconSrc;
//                     if (navProfilePhoto) navProfilePhoto.src = iconSrc;
                    
//                     document.querySelectorAll('.avatar').forEach(div => {
//                         div.innerHTML = `<img src="${iconSrc}" style="width: 100%; height: 100%; border-radius: 10px; object-fit: cover;">`;
//                     });
//                 }
//             }).catch(err => console.error("Error loading profile:", err));
//         } else {
//             window.location.href = '../login.html';
//         }
//     });

//     // ==========================================
//     // 2. MODAL AVATAR GRID
//     // ==========================================
//     if (modalGrid) {
//         for (const [id, src] of Object.entries(PROFILE_ICONS)) {
//             const div = document.createElement('div');
//             div.className = 'avatar-item';
//             div.dataset.id = id;
//             div.innerHTML = `<img src="${src}" alt="Avatar ${id}">`;
            
//             div.addEventListener('click', () => {
//                 document.querySelectorAll('.avatar-item').forEach(el => el.classList.remove('active'));
//                 div.classList.add('active');
                
//                 pendingAvatarId = id;
//                 mainProfilePhoto.src = src; 
                
//                 if(saveBar) saveBar.classList.add('visible');
//                 closeModal();
//             });
//             modalGrid.appendChild(div);
//         }
//     }

//     function openModal() {
//         if(avatarModal) avatarModal.classList.add('active');
//         document.body.style.overflow = 'hidden'; 
//     }
//     function closeModal() {
//         if(avatarModal) avatarModal.classList.remove('active');
//         document.body.style.overflow = '';
//     }

//     if(openModalBtn) openModalBtn.addEventListener('click', openModal);
//     if(closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
//     if(avatarModal) avatarModal.addEventListener('click', (e) => { if (e.target === avatarModal) closeModal(); });

//     // ==========================================
//     // 3. TRIGGER SAVE BAR ON TYPING
//     // ==========================================
//     const formInputs = document.querySelectorAll('#profileForm input, #profileForm textarea, #profileForm select');
//     formInputs.forEach(input => {
//         input.addEventListener('input', () => saveBar.classList.add('visible'));
//         input.addEventListener('change', () => saveBar.classList.add('visible'));
//     });

//     if(discardBtn) discardBtn.addEventListener('click', () => window.location.reload());

//     // ==========================================
//     // 4. SAVE CHANGES TO FIREBASE
//     // ==========================================
//     if(saveBtn) {
//         saveBtn.addEventListener('click', async () => {
//             if (!currentUser) return;

//             // UI Feedback
//             const originalText = saveBtn.innerText;
//             saveBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';
//             saveBtn.style.pointerEvents = "none";
            
//             // Build the data packet for Firebase
//             const updatedData = {
//                 firstName: inputFirstName.value.trim(),
//                 lastName: inputLastName.value.trim(),
//                 bio: inputBio.value.trim(),
//                 location: inputLocation.value.trim(),
//                 diabetesType: inputType.value,
//                 profileIconId: pendingAvatarId || currentSavedAvatarId
//             };

//             // Combine for live UI updates
//             const fullCombinedName = [updatedData.firstName, updatedData.lastName].filter(Boolean).join(" ");

//             try {
//                 // Upload to Firestore
//                 const userRef = doc(db, 'users', currentUser.uid);
//                 await updateDoc(userRef, updatedData);

//                 // Success Feedback
//                 saveBtn.innerHTML = '<i class="fa-solid fa-check"></i> Saved';
//                 saveBtn.style.background = 'var(--success)';
                
//                 // Update live page names without refresh
//                 if(displayNameLabel) displayNameLabel.textContent = fullCombinedName || "User";
//                 document.querySelectorAll('.u-name, #userBadgeName').forEach(el => el.textContent = fullCombinedName || "User");
                
//                 if (pendingAvatarId) {
//                     currentSavedAvatarId = pendingAvatarId;
//                     navProfilePhoto.src = PROFILE_ICONS[pendingAvatarId];
//                     document.querySelectorAll('.avatar img').forEach(img => img.src = PROFILE_ICONS[pendingAvatarId]);
//                 }

//                 // Smoothly close bar
//                 setTimeout(() => {
//                     saveBtn.innerText = 'Save Profile';
//                     saveBtn.style.background = 'var(--info, #3b82f6)';
//                     saveBtn.style.pointerEvents = "auto";
//                     if(saveBar) saveBar.classList.remove('visible');
                    
//                     if(window.applyAccent) window.applyAccent(localStorage.getItem('accent_color'));
//                 }, 1500);

//             } catch (error) {
//                 console.error("Error updating profile:", error);
//                 saveBtn.innerText = 'Error!';
//                 saveBtn.style.background = 'var(--danger)';
//                 setTimeout(() => {
//                     saveBtn.innerText = 'Save Profile';
//                     saveBtn.style.background = 'var(--info, #3b82f6)';
//                     saveBtn.style.pointerEvents = "auto";
//                 }, 2000);
//             }
//         });
//     }

//     // Preserve Custom Accent Color
//     setTimeout(() => {
//         const savedColor = localStorage.getItem('accent_color');
//         if (savedColor && saveBtn) saveBtn.style.backgroundColor = savedColor;
//     }, 100);
// });