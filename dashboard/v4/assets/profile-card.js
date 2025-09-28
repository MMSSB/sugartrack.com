// document.addEventListener('DOMContentLoaded', function() {
//   // Check auth state
//   auth.onAuthStateChanged(function(user) {
//     if (user) {
//       loadProfileData(user);
//     }
//   });

    
//     /**
//      * Populates the profile card with user data.
//      * @param {object} userData - The user data object from Firestore.
//      * @param {object} user - The Firebase auth user object.
//      */
//     function updateProfileCard(userData, user) {
//         // Set profile picture
//         const profileAvatar = document.getElementById('profileAvatar');
//         if (profileAvatar) {
//             profileAvatar.src = userData.profileImage || 'images/user.png';
//             profileAvatar.onerror = function() { this.src = 'images/user.png'; };
//         }
        
//         // Set user's first name in the main display and welcome message
//         const userNameDisplay = document.getElementById('userNameDisplay');
//         const userWelcomeName = document.getElementById('userWelcomeName');
//         if(userNameDisplay) userNameDisplay.textContent = userData.firstName || "User";
//         if(userWelcomeName) userWelcomeName.textContent = userData.firstName || 'User';
        
//         // Set email
//         const emailElement = document.getElementById('UserEmailDisplay');
//         if (emailElement) {
//             emailElement.textContent = user.email;
//         }
        
//         // Set user ID if it exists (formatted with leading zeros)
//         const userNumberElement = document.getElementById('profileUserNumber');
//         if (userNumberElement && userData.id) {
//             const userNumberFormatted = String(userData.id).padStart(2, '0');
//             userNumberElement.textContent = `#${userNumberFormatted}`;
//         } else if (userNumberElement) {
//             userNumberElement.textContent = "#00";
//         }
        
//         // Set join date (format: Month Year)
//         const joinDateElement = document.getElementById('profileJoinDate');
//         if (joinDateElement && userData.createdAt && userData.createdAt.toDate) {
//             const joinDate = userData.createdAt.toDate();
//             joinDateElement.textContent = joinDate.toLocaleString('default', { month: 'long', year: 'numeric' });
//         }
        
//         // Set last active
//         const lastActiveElement = document.getElementById('profileLastActive');
//         if (lastActiveElement) {
//             lastActiveElement.textContent = "Just now"; 
//         }
        
//         // Load custom fields
//         loadCustomFields(userData);
//     }
    
//     /**
//      * Loads and displays custom fields from user data
//      * @param {object} userData - The user data object from Firestore.
//      */
//     function loadCustomFields(userData) {
//         // Example custom fields - you can add more as needed
//         const customFields = [
//               /**
//      * Loads and displays custom fields from user data
//      * @param {object} userData - The user data object from Firestore.
//      */
//     function loadCustomFields(userData) {
//         // Example custom fields - you can add more as needed
//         const customFields = [
//             { id: '@user', fieldName: '@user', label: '@user', default: '@user' },
//             // { id: 'customBio', fieldName: 'bio', label: 'Bio', default: 'No bio yet' },
//             // { id: 'customLocation', fieldName: 'location', label: 'Location', default: 'Not specified' },
//             // { id: 'customWebsite', fieldName: 'website', label: 'Website', default: 'No website' },
//             // { id: 'customInterests', fieldName: 'interests', label: 'Interests', default: 'No interests yet' }
//         ];
        
//         customFields.forEach(field => {
//             const element = document.getElementById(field.id);
//             if (element) {
//                 // Check if the field exists in userData and is not empty
//                 if (userData[field.fieldName] && userData[field.fieldName].trim() !== '') {
//                     element.textContent = userData[field.fieldName];
//                 } else {
//                     element.textContent = field.default;
//                 }
//             }
//         });
//     }
//             // { id: 'customBio', fieldName: 'bio', label: 'Bio', default: 'No bio yet' },
//             // { id: 'customLocation', fieldName: 'location', label: 'Location', default: 'Not specified' },
//             // { id: 'customWebsite', fieldName: 'website', label: 'Website', default: 'No website' },
//             // { id: 'customInterests', fieldName: 'interests', label: 'Interests', default: 'No interests yet' }
//         ];
        
//         customFields.forEach(field => {
//             const element = document.getElementById(field.id);
//             if (element) {
//                 // Check if the field exists in userData and is not empty
//                 if (userData[field.fieldName] && userData[field.fieldName].trim() !== '') {
//                     element.textContent = userData[field.fieldName];
//                 } else {
//                     element.textContent = field.default;
//                 }
//             }
//         });
//     }
    
//     // ... rest of your existing code ...

//   function loadProfileData(user) {
//     db.collection('users').doc(user.uid).get().then(function(doc) {
//       if (doc.exists) {
//         const userData = doc.data();
        
//         // Set profile picture
//         const profileAvatar = document.getElementById('profileAvatar');
//         if (profileAvatar) {
//           profileAvatar.src = userData.profileImage || 'images/default-avatar.png';
//           profileAvatar.onerror = function() {
//             this.src = 'images/default-avatar.png';
//           };
//         }
        
//         // Set full name
//         const fullNameElement = document.getElementById('profileFullName');
//         if (fullNameElement) {
//           const fullName = [userData.firstName, userData.lastName].filter(Boolean).join(' ');
//           fullNameElement.textContent = fullName || "User";
//         }
        
//         // Set email
//         const emailElement = document.getElementById('profileEmail');
//         if (emailElement) {
//           emailElement.textContent = user.email;
//         }
        
//         // Set username
//         const usernameElement = document.getElementById('profileUsername');
//         if (usernameElement) {
//           usernameElement.textContent = userData.username ? `@${userData.username}` : "@user";
//         }
        
//         // Set join date (format: Month Year)
//         const joinDateElement = document.getElementById('profileJoinDate');
//         if (joinDateElement && userData.createdAt) {
//           const joinDate = userData.createdAt.toDate();
//           joinDateElement.textContent = joinDate.toLocaleString('default', { month: 'long', year: 'numeric' });
//         }
        
//         // Set last active
//         const lastActiveElement = document.getElementById('profileLastActive');
//         if (lastActiveElement) {
//           lastActiveElement.textContent = "Just now"; // You can implement more precise timing
//         }
//       }
//     }).catch(function(error) {
//       console.error("Error loading profile data:", error);
//     });
//   }

//   // Add event listeners for buttons
//   document.getElementById('changeAvatarBtn')?.addEventListener('click', function() {
//     // Implement avatar change functionality
//     alert("Avatar change functionality would go here");
//   });
  
//   document.getElementById('editProfileBtn')?.addEventListener('click', function() {
//     window.location.href = "profile-edit.html";
//   });
  
//   document.getElementById('accountSettingsBtn')?.addEventListener('click', function() {
//     window.location.href = "settings.html";
//   });
  
// });






// // // Replace your profile-card.js with this updated code
// // document.addEventListener('DOMContentLoaded', function() {
// //     // A short delay to ensure Firebase is initialized by your other scripts.
// //     setTimeout(() => {
// //         if (typeof firebase === 'undefined') {
// //             console.error("Firebase is not loaded. Make sure the Firebase scripts are included and initialized in your HTML.");
// //             alert("Error: Firebase is not connected.");
// //             return;
// //         }

// //         const auth = firebase.auth();
// //         const db = firebase.firestore();

// //         // Check auth state
// //         auth.onAuthStateChanged(function(user) {
// //             if (user) {
// //                 const appContainer = document.getElementById('appContainer');
// //                 if(appContainer) appContainer.style.display = 'flex';
                
// //                 const userDocRef = db.collection('users').doc(user.uid);
                
// //                 // Load or create user data
// //                 loadOrCreateUserData(db, userDocRef, user);
// //             } else {
// //                 // User is signed out. Redirect to login page.
// //                 console.log("User is not signed in. Redirecting to login.html");
// //                 window.location.href = 'login.html';
// //             }
// //         });
// //     }, 500);

// //     /**
// //      * Loads user data or creates it if it doesn't exist
// //      * @param {firebase.firestore.Firestore} db - The Firestore instance.
// //      * @param {firebase.firestore.DocumentReference} userDocRef - The document reference for the user.
// //      * @param {object} user - The Firebase auth user object.
// //      */
// //     async function loadOrCreateUserData(db, userDocRef, user) {
// //         try {
// //             const doc = await userDocRef.get();
            
// //             if (doc.exists) {
// //                 // User document exists, update the profile card
// //                 const userData = doc.data();
// //                 updateProfileCard(userData, user);
                
// //                 // If user doesn't have an ID yet, assign one
// //                 if (!userData.id) {
// //                     await assignUserId(db, userDocRef);
// //                 }
// //             } else {
// //                 // User document doesn't exist, create it with a new ID
// //                 console.log("User document does not exist. Creating one and assigning an ID.");
// //                 await createUserDocument(db, userDocRef, user);
// //             }
// //         } catch (error) {
// //             console.error("Error loading user data:", error);
// //         }
// //     }

// //     /**
// //      * Creates a new user document with a unique ID
// //      * @param {firebase.firestore.Firestore} db - The Firestore instance.
// //      * @param {firebase.firestore.DocumentReference} userDocRef - The document reference for the user.
// //      * @param {object} user - The Firebase auth user object.
// //      */
// //     async function createUserDocument(db, userDocRef, user) {
// //         try {
// //             // First get a new user ID
// //             const newUserId = await getNextUserId(db);
            
// //             // Create the user document with the new ID
// //             await userDocRef.set({
// //                 id: newUserId,
// //                 createdAt: firebase.firestore.FieldValue.serverTimestamp(),
// //                 email: user.email,
// //                 // Add other default fields if needed
// //             });
            
// //             // Update the profile card with the new data
// //             const doc = await userDocRef.get();
// //             if (doc.exists) {
// //                 updateProfileCard(doc.data(), user);
// //             }
// //         } catch (error) {
// //             console.error("Error creating user document:", error);
// //         }
// //     }

// //     /**
// //      * Gets the next available user ID
// //      * @param {firebase.firestore.Firestore} db - The Firestore instance.
// //      * @returns {Promise<number>} The next user ID
// //      */
// //     async function getNextUserId(db) {
// //         try {
// //             // Try to get the current max ID from users collection
// //             const usersSnapshot = await db.collection('users')
// //                 .orderBy('id', 'desc')
// //                 .limit(1)
// //                 .get();
            
// //             if (!usersSnapshot.empty) {
// //                 // Get the highest ID and increment it
// //                 const highestId = usersSnapshot.docs[0].data().id;
// //                 return highestId + 1;
// //             } else {
// //                 // No users yet, start from 1
// //                 return 1;
// //             }
// //         } catch (error) {
// //             console.error("Error getting next user ID:", error);
// //             // Fallback: Count existing users and add 1
// //             try {
// //                 const usersCount = await db.collection('users').count().get();
// //                 return usersCount.data().count + 1;
// //             } catch (countError) {
// //                 console.error("Error counting users:", countError);
// //                 // Final fallback: use timestamp
// //                 return Math.floor(Date.now() / 1000);
// //             }
// //         }
// //     }

// //     /**
// //      * Assigns a user ID to an existing user document
// //      * @param {firebase.firestore.Firestore} db - The Firestore instance.
// //      * @param {firebase.firestore.DocumentReference} userDocRef - The document reference for the user.
// //      */
// //     async function assignUserId(db, userDocRef) {
// //         try {
// //             const newUserId = await getNextUserId(db);
// //             await userDocRef.update({
// //                 id: newUserId
// //             });
// //             console.log("Assigned user ID:", newUserId);
// //         } catch (error) {
// //             console.error("Error assigning user ID:", error);
// //         }
// //     }
// // // ... existing code ...

// // // /**
// // //  * Populates the profile card with user data.
// // //  * @param {object} userData - The user data object from Firestore.
// // //  * @param {object} user - The Firebase auth user object.
// // //  */
// // // function updateProfileCard(userData, user) {
// // //     // Set profile picture
// // //     const profileAvatar = document.getElementById('profileAvatar');
// // //     if (profileAvatar) {
// // //         profileAvatar.src = userData.profileImage || 'images/user.png';
// // //         profileAvatar.onerror = function() { this.src = 'images/user.png'; };
// // //     }
    
// // //     // Set user's first name in the main display and welcome message
// // //     const userNameDisplay = document.getElementById('userNameDisplay');
// // //     const userWelcomeName = document.getElementById('userWelcomeName');
// // //     if(userNameDisplay) userNameDisplay.textContent = userData.firstName || "User";
// // //     if(userWelcomeName) userWelcomeName.textContent = userData.firstName || 'User';
    
// // //     // Set email
// // //     const emailElement = document.getElementById('UserEmailDisplay');
// // //     if (emailElement) {
// // //         emailElement.textContent = user.email;
// // //     }
    
// // //     // Set user ID if it exists (formatted with leading zeros)
// // //     const userNumberElement = document.getElementById('profileUserNumber');
// // //     if (userNumberElement && userData.id) {
// // //         // Format the ID with leading zeros (e.g., 1 becomes "01")
// // //         const userNumberFormatted = String(userData.id).padStart(2, '0');
// // //         userNumberElement.textContent = `#${userNumberFormatted}`;
// // //     } else if (userNumberElement) {
// // //         userNumberElement.textContent = "#00";
// // //     }
    
// // //     // Set join date (format: Month Year)
// // //     const joinDateElement = document.getElementById('profileJoinDate');
// // //     if (joinDateElement && userData.createdAt && userData.createdAt.toDate) {
// // //         const joinDate = userData.createdAt.toDate();
// // //         joinDateElement.textContent = joinDate.toLocaleString('default', { month: 'long', year: 'numeric' });
// // //     }
    
// // //     // Set last active
// // //     const lastActiveElement = document.getElementById('profileLastActive');
// // //     if (lastActiveElement) {
// // //         lastActiveElement.textContent = "Just now"; 
// // //     }
// // // }

// // // ... existing code ...
// //     /**
// //      * Populates the profile card with user data.
// //      * @param {object} userData - The user data object from Firestore.
// //      * @param {object} user - The Firebase auth user object.
// //      */
// //     function updateProfileCard(userData, user) {
// //         // Set profile picture
// //         const profileAvatar = document.getElementById('profileAvatar');
// //         if (profileAvatar) {
// //             profileAvatar.src = userData.profileImage || 'images/user.png';
// //             profileAvatar.onerror = function() { this.src = 'images/user.png'; };
// //         }
        
// //         // Set user's first name in the main display and welcome message
// //         const userNameDisplay = document.getElementById('userNameDisplay');
// //         const userWelcomeName = document.getElementById('userWelcomeName');
// //         if(userNameDisplay) userNameDisplay.textContent = userData.firstName || "User";
// //         if(userWelcomeName) userWelcomeName.textContent = userData.firstName || 'User';
        
// //         // Set email
// //         const emailElement = document.getElementById('UserEmailDisplay');
// //         if (emailElement) {
// //             emailElement.textContent = user.email;
// //         }
        
// //         // Set user ID if it exists
// //         const userNumberElement = document.getElementById('profileUserNumber');
// //         if (userNumberElement && userData.id) {
// //             const userNumberFormatted = String(userData.id).padStart(2, '0');
// //             userNumberElement.textContent = `#${userNumberFormatted}`;
// //         } else if (userNumberElement) {
// //             userNumberElement.textContent = "#00";
// //         }
        
// //         // Set join date (format: Month Year)
// //         const joinDateElement = document.getElementById('profileJoinDate');
// //         if (joinDateElement && userData.createdAt && userData.createdAt.toDate) {
// //             const joinDate = userData.createdAt.toDate();
// //             joinDateElement.textContent = joinDate.toLocaleString('default', { month: 'long', year: 'numeric' });
// //         }
        
// //         // Set last active
// //         const lastActiveElement = document.getElementById('profileLastActive');
// //         if (lastActiveElement) {
// //             lastActiveElement.textContent = "Just now"; 
// //         }
// //     }

// //     // Add event listeners for buttons
// //     document.getElementById('changeAvatarBtn')?.addEventListener('click', function() {
// //         alert("Avatar change functionality would go here");
// //     });
    
// //     document.getElementById('editProfileBtn')?.addEventListener('click', function() {
// //         window.location.href = "profile-edit.html";
// //     });
    
// //     document.getElementById('accountSettingsBtn')?.addEventListener('click', function() {
// //         window.location.href = "settings.html";
// //     });
// // });


document.addEventListener('DOMContentLoaded', function() {
    // A short delay to ensure Firebase is initialized by your other scripts.
    setTimeout(() => {
        if (typeof firebase === 'undefined') {
            console.error("Firebase is not loaded. Make sure the Firebase scripts are included and initialized in your HTML.");
            alert("Error: Firebase is not connected.");
            return;
        }

        const auth = firebase.auth();
        const db = firebase.firestore();

        // Check auth state
        auth.onAuthStateChanged(function(user) {
            if (user) {
                const appContainer = document.getElementById('appContainer');
                if(appContainer) appContainer.style.display = 'flex';
                
                const userDocRef = db.collection('users').doc(user.uid);
                
                // Load or create user data
                loadOrCreateUserData(db, userDocRef, user);
            } else {
                // User is signed out. Redirect to login page.
                console.log("User is not signed in. Redirecting to login.html");
                window.location.href = 'login.html';
            }
        });
    }, 500);

    /**
     * Loads user data or creates it if it doesn't exist
     * @param {firebase.firestore.Firestore} db - The Firestore instance.
     * @param {firebase.firestore.DocumentReference} userDocRef - The document reference for the user.
     * @param {object} user - The Firebase auth user object.
     */
    async function loadOrCreateUserData(db, userDocRef, user) {
        try {
            const doc = await userDocRef.get();
            
            if (doc.exists) {
                // User document exists, update the profile card
                const userData = doc.data();
                updateProfileCard(userData, user);
                
                // If user doesn't have an ID yet, assign one
                if (!userData.id) {
                    await assignUserId(db, userDocRef);
                }
            } else {
                // User document doesn't exist, create it with a new ID
                console.log("User document does not exist. Creating one and assigning an ID.");
                await createUserDocument(db, userDocRef, user);
            }
        } catch (error) {
            console.error("Error loading user data:", error);
        }
    }

    /**
     * Creates a new user document with a unique ID
     * @param {firebase.firestore.Firestore} db - The Firestore instance.
     * @param {firebase.firestore.DocumentReference} userDocRef - The document reference for the user.
     * @param {object} user - The Firebase auth user object.
     */
    async function createUserDocument(db, userDocRef, user) {
        try {
            // First get a new user ID
            const newUserId = await getNextUserId(db);
            
            // Create the user document with the new ID
            await userDocRef.set({
                id: newUserId,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                email: user.email,
                // Add default values for custom fields
                 user: ''
                // bio: '',
                // location: '',
                // website: '',
                // interests: ''
            });
            
            // Update the profile card with the new data
            const doc = await userDocRef.get();
            if (doc.exists) {
                updateProfileCard(doc.data(), user);
            }
        } catch (error) {
            console.error("Error creating user document:", error);
        }
    }

    /**
     * Gets the next available user ID
     * @param {firebase.firestore.Firestore} db - The Firestore instance.
     * @returns {Promise<number>} The next user ID
     */
    async function getNextUserId(db) {
        try {
            // Try to get the current max ID from users collection
            const usersSnapshot = await db.collection('users')
                .orderBy('id', 'desc')
                .limit(1)
                .get();
            
            if (!usersSnapshot.empty) {
                // Get the highest ID and increment it
                const highestId = usersSnapshot.docs[0].data().id;
                return highestId + 1;
            } else {
                // No users yet, start from 1
                return 1;
            }
        } catch (error) {
            console.error("Error getting next user ID:", error);
            // Fallback: Count existing users and add 1
            try {
                const usersCount = await db.collection('users').count().get();
                return usersCount.data().count + 1;
            } catch (countError) {
                console.error("Error counting users:", countError);
                // Final fallback: use timestamp
                return Math.floor(Date.now() / 1000);
            }
        }
    }

    /**
     * Assigns a user ID to an existing user document
     * @param {firebase.firestore.Firestore} db - The Firestore instance.
     * @param {firebase.firestore.DocumentReference} userDocRef - The document reference for the user.
     */
    async function assignUserId(db, userDocRef) {
        try {
            const newUserId = await getNextUserId(db);
            await userDocRef.update({
                id: newUserId
            });
            console.log("Assigned user ID:", newUserId);
        } catch (error) {
            console.error("Error assigning user ID:", error);
        }
    }

    /**
     * Populates the profile card with user data.
     * @param {object} userData - The user data object from Firestore.
     * @param {object} user - The Firebase auth user object.
     */
    function updateProfileCard(userData, user) {
        // Set profile picture
        const profileAvatar = document.getElementById('profileAvatar');
        if (profileAvatar) {
            profileAvatar.src = userData.profileImage || 'images/user.png';
            profileAvatar.onerror = function() { this.src = 'images/user.png'; };
        }
        
        // Set user's first name in the main display and welcome message
        const userNameDisplay = document.getElementById('userNameDisplay');
        const userWelcomeName = document.getElementById('userWelcomeName');
        if(userNameDisplay) userNameDisplay.textContent = userData.firstName || "User";
        if(userWelcomeName) userWelcomeName.textContent = userData.firstName || 'User';
        
        // Set email
        const emailElement = document.getElementById('UserEmailDisplay');
        if (emailElement) {
            emailElement.textContent = user.email;
        }
        
        // Set user ID if it exists (formatted with leading zeros)
        const userNumberElement = document.getElementById('profileUserNumber');
        if (userNumberElement && userData.id) {
            const userNumberFormatted = String(userData.id).padStart(2, '0');
            userNumberElement.textContent = `#${userNumberFormatted}`;
        } else if (userNumberElement) {
            userNumberElement.textContent = "#00";
        }
        
        // Set join date (format: Month Year)
        const joinDateElement = document.getElementById('profileJoinDate');
        if (joinDateElement && userData.createdAt && userData.createdAt.toDate) {
            const joinDate = userData.createdAt.toDate();
            joinDateElement.textContent = joinDate.toLocaleString('default', { month: 'long', year: 'numeric' });
        }
        
        // Set last active
        const lastActiveElement = document.getElementById('profileLastActive');
        if (lastActiveElement) {
            lastActiveElement.textContent = "Just now"; 
        }
        
        // Load custom fields
        loadCustomFields(userData);
    }
    
    /**
     * Loads and displays custom fields from user data
     * @param {object} userData - The user data object from Firestore.
     */
    function loadCustomFields(userData) {
        // Custom fields configuration
        const customFields = [
          { id: '@user', fieldName: '@user', label: '@user', default: '@user' }
            // { id: 'customBio', fieldName: 'bio', label: 'Bio', default: 'No bio yet' },
            // { id: 'customLocation', fieldName: 'location', label: 'Location', default: 'Not specified' },
            // { id: 'customWebsite', fieldName: 'website', label: 'Website', default: 'No website' },
            // { id: 'customInterests', fieldName: 'interests', label: 'Interests', default: 'No interests yet' }
        ];
        
        customFields.forEach(field => {
            const element = document.getElementById(field.id);
            if (element) {
                // Check if the field exists in userData and is not empty
                if (userData[field.fieldName] && userData[field.fieldName].trim() !== '') {
                    element.textContent = userData[field.fieldName];
                } else {
                    element.textContent = field.default;
                }
            }
        });
    }

    // Add event listeners for buttons
    document.getElementById('changeAvatarBtn')?.addEventListener('click', function() {
        alert("Avatar change functionality would go here");
    });
    
    document.getElementById('editProfileBtn')?.addEventListener('click', function() {
        window.location.href = "profile-edit.html";
    });
    
    document.getElementById('accountSettingsBtn')?.addEventListener('click', function() {
        window.location.href = "settings.html";
    });
});