// auth.js
// import * as firebaseConfig from './firebase-config.js'
// document.addEventListener('DOMContentLoaded', function() {
//     // Login form
//     const loginForm = document.getElementById('loginForm');
//     if (loginForm) {
//         loginForm.addEventListener('submit', (e) => {
//             e.preventDefault();
//             const email = document.getElementById('loginEmail').value;
//             const password = document.getElementById('loginPassword').value;
            
//             auth.signInWithEmailAndPassword(email, password)
//                 .then((userCredential) => {
//                     // Redirect to dashboard
//                     window.location.href = 'index.html';
//                 })
//                 .catch((error) => {
//                     // Handle specific error cases
//                     let errorMessage;
//                     switch (error.code) {
//                         case 'auth/user-not-found':
//                         case 'auth/wrong-password':
//                             errorMessage = 'Invalid email or password';
//                             break;
//                         case 'auth/invalid-email':
//                             errorMessage = 'Please enter a valid email address';
//                             break;
//                         case 'auth/too-many-requests':
//                             errorMessage = 'Too many failed attempts. Please try again later';
//                             break;
//                         default:
//                             errorMessage = 'An error occurred. Please try again';
//                     }
//                     document.getElementById('loginError').textContent = errorMessage;
//                 });
//         });
//     }
document.addEventListener('DOMContentLoaded', function() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Check reCAPTCHA first
            const recaptchaResponse = grecaptcha.getResponse();
            if (!recaptchaResponse) {
                document.getElementById('loginError').textContent = 'Please complete the reCAPTCHA verification';
                return;
            }
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            // Disable button during processing
            const loginButton = document.querySelector('#loginForm button[type="submit"]');
            loginButton.disabled = true;
            loginButton.textContent = 'Signing in...';
            
            try {
                // First verify reCAPTCHA with your backend (you'll need to implement this)
                // const recaptchaVerified = await verifyRecaptcha(recaptchaResponse);
                // if (!recaptchaVerified) {
                //     throw new Error('reCAPTCHA verification failed');
                // }
                
                // Then proceed with Firebase auth
                const userCredential = await auth.signInWithEmailAndPassword(email, password);
                
                // Reset reCAPTCHA
                grecaptcha.reset();
                
                // Redirect to dashboard
                window.location.href = 'index.html';
            } catch (error) {
                // Reset reCAPTCHA on error
                grecaptcha.reset();
                
                // Re-enable button
                loginButton.disabled = false;
                loginButton.textContent = 'Sign In';
                
                // Handle specific error cases
                let errorMessage;
                switch (error.code) {
                    case 'auth/user-not-found':
                    case 'auth/wrong-password':
                        errorMessage = 'Invalid email or password';
                        break;
                    case 'auth/invalid-email':
                        errorMessage = 'Please enter a valid email address';
                        break;
                    case 'auth/too-many-requests':
                        errorMessage = 'Too many failed attempts. Please try again later';
                        break;
                    default:
                        errorMessage = 'An error occurred. Please try again';
                }
                document.getElementById('loginError').textContent = errorMessage;
            }
        });
    }

    // ... rest of your auth.js code remains the same ...

    // Forgot password
    const forgotPassword = document.getElementById('forgotPassword');
    if (forgotPassword) {
        forgotPassword.addEventListener('click', (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            
            if (!email) {
                document.getElementById('loginError').textContent = 'Please enter your email address';
                return;
            }

            // Send password reset email
            auth.sendPasswordResetEmail(email)
                .then(() => {
                    document.getElementById('loginError').textContent = '';
                    alert('If an account exists with this email, a password reset link will be sent.');
                })
                .catch((error) => {
                    let errorMessage;
                    switch (error.code) {
                        case 'auth/invalid-email':
                            errorMessage = 'Please enter a valid email address';
                            break;
                        case 'auth/too-many-requests':
                            errorMessage = 'Too many requests. Please try again later';
                            break;
                        default:
                            errorMessage = 'An error occurred. Please try again';
                    }
                    document.getElementById('loginError').textContent = errorMessage;
                });
        });
    }

    // // Signup form
    // const signupForm = document.getElementById('signupForm');
    // if (signupForm) {
    //     signupForm.addEventListener('submit', (e) => {
    //         e.preventDefault();
            
    //         // const firstName = document.getElementById('firstName').value;
    //         // const lastName = document.getElementById('lastName').value;
    //         const email = document.getElementById('signupEmail').value;
    //         const password = document.getElementById('signupPassword').value;
    //         const confirmPassword = document.getElementById('confirmPassword').value;
            
    //         if (password !== confirmPassword) {
    //             document.getElementById('signupError').textContent = 'Passwords do not match';
    //             return;
    //         }

    //         if (password.length < 6) {
    //             document.getElementById('signupError').textContent = 'Password must be at least 6 characters long';
    //             return;
    //         }
            
    //         auth.createUserWithEmailAndPassword(email, password)
    //             .then((userCredential) => {
    //                 // Add user data to Firestore
    //                 return db.collection('users').doc(userCredential.user.uid).set({
    //                     firstName: firstName,
    //                     lastName: lastName,
    //                     email: email,
    //                     createdAt: firebase.firestore.FieldValue.serverTimestamp()
    //                 });
    //             })
    //             .then(() => {
    //                 // Redirect to dashboard directly after signup
    //                 window.location.href = 'index.html';
    //             })
    //             .catch((error) => {
    //                 let errorMessage;
    //                 switch (error.code) {
    //                     case 'auth/email-already-in-use':
    //                         errorMessage = 'This email is already registered';
    //                         break;
    //                     case 'auth/invalid-email':
    //                         errorMessage = 'Please enter a valid email address';
    //                         break;
    //                     case 'auth/operation-not-allowed':
    //                         errorMessage = 'Email/password accounts are not enabled';
    //                         break;
    //                     case 'auth/weak-password':
    //                         errorMessage = 'Password is too weak';
    //                         break;
    //                     default:
    //                         errorMessage = 'An error occurred during signup';
    //                 }
    //                 document.getElementById('signupError').textContent = errorMessage;
    //             });
    //     });
    // }








// ... existing code ...

// Signup form
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Check reCAPTCHA first
        const recaptchaResponse = grecaptcha.getResponse();
        if (!recaptchaResponse) {
            document.getElementById('signupError').textContent = 'Please complete the reCAPTCHA verification';
            return;
        }
        
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (password !== confirmPassword) {
            document.getElementById('signupError').textContent = 'Passwords do not match';
            return;
        }

        if (password.length < 6) {
            document.getElementById('signupError').textContent = 'Password must be at least 6 characters long';
            return;
        }
        
        try {
            // Disable button during processing
            const signupButton = document.querySelector('#signupForm button[type="submit"]');
            signupButton.disabled = true;
            signupButton.textContent = 'Creating Account...';
            
            // Get the next available user ID
            const nextUserId = await getNextUserId();
            
            // Create the user account
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            
            // Add user data to Firestore with the assigned ID
            await db.collection('users').doc(userCredential.user.uid).set({
                id: nextUserId,
                email: email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            // Reset reCAPTCHA
            grecaptcha.reset();
            
            // Redirect to dashboard directly after signup
            window.location.href = 'index.html';
        } catch (error) {
            // Reset reCAPTCHA on error
            grecaptcha.reset();
            
            // Re-enable button
            const signupButton = document.querySelector('#signupForm button[type="submit"]');
            signupButton.disabled = false;
            signupButton.textContent = 'Create Account';
            
            let errorMessage;
            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage = 'This email is already registered';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Please enter a valid email address';
                    break;
                case 'auth/operation-not-allowed':
                    errorMessage = 'Email/password accounts are not enabled';
                    break;
                case 'auth/weak-password':
                    errorMessage = 'Password is too weak';
                    break;
                default:
                    errorMessage = 'An error occurred during signup: ' + error.message;
            }
            document.getElementById('signupError').textContent = errorMessage;
        }
    });
}












// // ... existing code ...

// // Signup form
// const signupForm = document.getElementById('signupForm');
// if (signupForm) {
//     signupForm.addEventListener('submit', async (e) => {
//         e.preventDefault();
        
//         // Check reCAPTCHA first
//         const recaptchaResponse = grecaptcha.getResponse();
//         if (!recaptchaResponse) {
//             document.getElementById('signupError').textContent = 'Please complete the reCAPTCHA verification';
//             return;
//         }
        
//         const email = document.getElementById('signupEmail').value;
//         const password = document.getElementById('signupPassword').value;
//         const confirmPassword = document.getElementById('confirmPassword').value;
        
//         if (password !== confirmPassword) {
//             document.getElementById('signupError').textContent = 'Passwords do not match';
//             return;
//         }

//         if (password.length < 6) {
//             document.getElementById('signupError').textContent = 'Password must be at least 6 characters long';
//             return;
//         }
        
//         try {
//             // Disable button during processing
//             const signupButton = document.querySelector('#signupForm button[type="submit"]');
//             signupButton.disabled = true;
//             signupButton.textContent = 'Creating Account...';
            
//             // Get the next available user ID
//             const nextUserId = await getNextUserId();
            
//             // Create the user account
//             const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            
//             // Add user data to Firestore with the assigned ID and default values
//             await db.collection('users').doc(userCredential.user.uid).set({
//                 id: nextUserId,
//                 email: email,
//                 profileImage: 'images/user.png', // Default profile image
//                 accentColor: '#3b82f6', // Default accent color
//                 createdAt: firebase.firestore.FieldValue.serverTimestamp(),
//                 // Add default values for custom fields
//                 // bio: '',
//                 // location: '',
//                 // website: '',
//                 // interests: ''
//             });
            
//             // Reset reCAPTCHA
//             grecaptcha.reset();
            
//             // Redirect to dashboard directly after signup
//             window.location.href = 'index.html';
//         } catch (error) {
//             // Reset reCAPTCHA on error
//             grecaptcha.reset();
            
//             // Re-enable button
//             const signupButton = document.querySelector('#signupForm button[type="submit"]');
//             signupButton.disabled = false;
//             signupButton.textContent = 'Create Account';
            
//             let errorMessage;
//             switch (error.code) {
//                 case 'auth/email-already-in-use':
//                     errorMessage = 'This email is already registered';
//                     break;
//                 case 'auth/invalid-email':
//                     errorMessage = 'Please enter a valid email address';
//                     break;
//                 case 'auth/operation-not-allowed':
//                     errorMessage = 'Email/password accounts are not enabled';
//                     break;
//                 case 'auth/weak-password':
//                     errorMessage = 'Password is too weak';
//                     break;
//                 default:
//                     errorMessage = 'An error occurred during signup: ' + error.message;
//             }
//             document.getElementById('signupError').textContent = errorMessage;
//         }
//     });
// }

// // ... existing code ...

















// Function to get the next available user ID
async function getNextUserId() {
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
            // Final fallback: start from 1
            return 1;
        }
    }
}

// // ... existing code ...
    // Auth state observer
    auth.onAuthStateChanged((user) => {
        if (user) {
            // User is signed in
            if (window.location.pathname.includes('login.html') || 
                window.location.pathname.includes('signup.html')) {
                window.location.href = 'index.html';
            }
        } else {
            // User is signed out
            if (!window.location.pathname.includes('login.html') && 
                !window.location.pathname.includes('signup.html')) {
                window.location.href = 'login.html';
            }
        }
    });
});

// Add this function to your auth.js file
function logoutUser() {
    // Clear all user-specific accent colors
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith('accentColor_')) {
            localStorage.removeItem(key);
        }
    });
    
    // Then perform the Firebase logout
    auth.signOut().then(() => {
        window.location.href = 'login.html';
    }).catch((error) => {
        console.error("Logout error:", error);
    });
}










// Replace your existing logout code with calls to logoutUser()

// const togglePassword = document.querySelector('#togglePassword');
//   const password = document.querySelector('#password');
  

//   togglePassword.addEventListener('click', function (e) {
//     // toggle the type attribute
//     const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
//     password.setAttribute('type', type);
//     // toggle the eye slash icon
//     this.classList.toggle('fa-eye-slash');
// });
// const tPassword = document.querySelector('#tPassword');
//   const passwords = document.querySelector('#loginPassword');
  

//   tPassword.addEventListener('click', function (e) {
//     // toggle the type attribute
//     const type = passwords.getAttribute('type') === 'password' ? 'text' : 'password';
//     passwords.setAttribute('type', type);
//     // toggle the eye slash icon
//     this.classList.toggle('fa-eye-slash');
// });

