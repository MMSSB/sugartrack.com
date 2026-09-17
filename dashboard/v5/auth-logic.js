// // auth-logic.js
// import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "./firebase-init.js";
// import { getFirestore, doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// const db = getFirestore();

// document.addEventListener("DOMContentLoaded", () => {
    
//     // --- 1. LOGIN LOGIC ---
//     const loginForm = document.querySelector('.auth-form'); // Logic to find the form
//     const loginBtn = document.querySelector('button[type="submit"]');
//     const errorDisplay = document.getElementById('loginError');

//     if (loginForm && window.location.pathname.includes('login.html')) {
//         loginForm.addEventListener('submit', async (e) => {
//             e.preventDefault(); // STOP THE PAGE REFRESH
            
//             // Clear previous errors
//             if(errorDisplay) {
//                 errorDisplay.style.display = 'none';
//                 errorDisplay.textContent = '';
//             }

//             const emailInput = loginForm.querySelector('input[type="email"]');
//             const passInput = loginForm.querySelector('input[type="password"]');
            
//             const email = emailInput.value;
//             const password = passInput.value;

//             // UI Loading State
//             const originalText = loginBtn.textContent;
//             loginBtn.textContent = "Verifying...";
//             loginBtn.disabled = true;
//             loginBtn.style.opacity = "0.7";

//             try {
//                 // Attempt Login
//                 await signInWithEmailAndPassword(auth, email, password);
                
//                 // Success! The onAuthStateChanged below will handle the redirect.
//                 loginBtn.textContent = "Success! Redirecting...";
                
//             } catch (error) {
//                 // Handle Errors
//                 console.error("Login Error:", error);
                
//                 loginBtn.textContent = originalText;
//                 loginBtn.disabled = false;
//                 loginBtn.style.opacity = "1";

//                 if(errorDisplay) {
//                     errorDisplay.style.display = 'block';
//                     // Show friendly messages
//                     if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
//                         errorDisplay.textContent = "Incorrect email or password.";
//                     } else if (error.code === 'auth/too-many-requests') {
//                         errorDisplay.textContent = "Too many failed attempts. Try again later.";
//                     } else {
//                         errorDisplay.textContent = "Error: " + error.message;
//                     }
//                 } else {
//                     alert("Login Error: " + error.message);
//                 }
//             }
//         });
//     }

//     // --- 2. SIGNUP LOGIC ---
//     const signupForm = document.getElementById('signupForm'); // Ensure your signup form has id="signupForm"
//     if (signupForm) {
//         signupForm.addEventListener('submit', async (e) => {
//             e.preventDefault();

//             const email = document.getElementById('signupEmail').value;
//             const password = document.getElementById('signupPassword').value;
//             const fName = document.getElementById('firstName').value;
//             const lName = document.getElementById('lastName').value;
//             const btn = signupForm.querySelector('button[type="submit"]');

//             try {
//                 btn.textContent = "Creating Account...";
//                 btn.disabled = true;

//                 const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//                 const user = userCredential.user;

//                 // Save extra data
//                 await setDoc(doc(db, "users", user.uid), {
//                     firstName: fName,
//                     lastName: lName,
//                     email: email,
//                     createdAt: serverTimestamp()
//                 });

//                 window.location.href = 'welcome.html';

//             } catch (error) {
//                 console.error(error);
//                 alert(error.message);
//                 btn.textContent = "Create Account";
//                 btn.disabled = false;
//             }
//         });
//     }

//     // --- 3. AUTH STATE OBSERVER (The Guard) ---
//     onAuthStateChanged(auth, (user) => {
//         const path = window.location.pathname;
//         const isAuthPage = path.includes('login.html') || path.includes('signup.html');
//         const isDashboard = path.includes('dashboard.html') || path.includes('index.html') || path === '/' || path.endsWith('/SugarTrack/');

//         if (user) {
//             // If user IS logged in, but is on login page -> Send to Dashboard
//             if (isAuthPage) {
//                 window.location.href = 'dashboard.html';
//             }
//         } else {
//             // If user is NOT logged in, but is on Dashboard -> Send to Login
//             if (isDashboard) {
//                 // Optional: Check if we are actually on the dashboard to avoid loops
//                 window.location.href = 'login.html';
//             }
//         }
//     });

//     // Make logout available globally
//     window.logoutUser = () => {
//         signOut(auth).then(() => {
//             window.location.href = 'login.html';
//         });
//     };
// });



















// auth-logic.js
import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "./firebase-init.js";
import { getFirestore, doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js"; // IMPORT FOR FORGOT PASSWORD

const db = getFirestore();

document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. LOGIN LOGIC ---
    const loginForm = document.querySelector('.auth-form'); 
    const loginBtn = document.querySelector('button[type="submit"]');
    const errorDisplay = document.getElementById('loginError');
    const successDisplay = document.getElementById('resetSuccess');
    const forgotPasswordBtn = document.getElementById('forgotPasswordBtn');

    if (loginForm && window.location.pathname.includes('login.html')) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); 
            
            // Clear previous messages
            if(errorDisplay) {
                errorDisplay.style.display = 'none';
                errorDisplay.textContent = '';
            }
            if(successDisplay) successDisplay.style.display = 'none';

            const emailInput = loginForm.querySelector('input[type="email"]');
            const passInput = loginForm.querySelector('input[type="password"]');
            
            const email = emailInput.value;
            const password = passInput.value;

            const originalText = loginBtn.textContent;
            loginBtn.textContent = "Verifying...";
            loginBtn.disabled = true;
            loginBtn.style.opacity = '0.7';

            try {
                await signInWithEmailAndPassword(auth, email, password);
                window.location.href = 'dashboard.html'; 
            } catch (error) {
                console.error("Login Error:", error);
                loginBtn.textContent = "Sign In";
                loginBtn.disabled = false;
                loginBtn.style.opacity = '1';
                
                if (errorDisplay) {
                    errorDisplay.textContent = "Invalid email or password.";
                    errorDisplay.style.display = 'block';
                }
            }
        });

        // --- FORGOT PASSWORD LOGIC ---
        if (forgotPasswordBtn) {
            forgotPasswordBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                const emailInput = loginForm.querySelector('input[type="email"]');
                const email = emailInput.value;

                if(errorDisplay) errorDisplay.style.display = 'none';
                if(successDisplay) successDisplay.style.display = 'none';

                if (!email) {
                    if (errorDisplay) {
                        errorDisplay.textContent = "Please enter your email address above first to reset your password.";
                        errorDisplay.style.display = 'block';
                    }
                    return;
                }

                try {
                    await sendPasswordResetEmail(auth, email);
                    if (successDisplay) {
                        successDisplay.textContent = "Password reset email sent! Please check your inbox.";
                        successDisplay.style.display = 'block';
                    }
                } catch (error) {
                    if (errorDisplay) {
                        errorDisplay.textContent = "Error: " + error.message;
                        errorDisplay.style.display = 'block';
                    }
                }
            });
        }
    }

    // --- 2. SIGNUP LOGIC ---
    const signupForm = document.getElementById('signupForm');
    
    if (signupForm && window.location.pathname.includes('signup.html')) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // STOP THE PAGE REFRESH

            const btn = signupForm.querySelector('button[type="submit"]');
            const signupErrorDisplay = document.getElementById('signupError');

            if (signupErrorDisplay) {
                signupErrorDisplay.style.display = 'none';
                signupErrorDisplay.textContent = '';
            }

            const inputs = signupForm.querySelectorAll('input');
            const fName = inputs[0].value;
            const lName = inputs[1].value;
            const email = inputs[2].value;
            const password = inputs[3].value;

            btn.textContent = "Creating...";
            btn.disabled = true;

            try {
                // Try creating the account
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // Save extra info to Firestore
                await setDoc(doc(db, 'users', user.uid), {
                    firstName: fName,
                    lastName: lName,
                    email: email,
                    createdAt: serverTimestamp()
                });

                window.location.href = 'welcome.html';

            } catch (error) {
                console.error(error);
                btn.textContent = "Create Account";
                btn.disabled = false;

                // CATCH THE "ALREADY EXISTS" ERROR
                if (signupErrorDisplay) {
                    if (error.code === 'auth/email-already-in-use') {
                        signupErrorDisplay.textContent = "An account with this email already exists! Please log in instead.";
                    } else if (error.code === 'auth/weak-password') {
                        signupErrorDisplay.textContent = "Password is too weak. Please use at least 6 characters.";
                    } else {
                        signupErrorDisplay.textContent = "Error: " + error.message;
                    }
                    signupErrorDisplay.style.display = 'block';
                } else {
                    alert(error.message);
                }
            }
        });
    }

    // --- 3. AUTH STATE OBSERVER (The Guard) ---
    onAuthStateChanged(auth, (user) => {
        const path = window.location.pathname;
        const isAuthPage = path.includes('login.html') || path.includes('signup.html');
        const isDashboard = path.includes('dashboard.html') || path.includes('index.html') || path === '/' || path.endsWith('/SugarTrack/');

        if (user) {
            // If user IS logged in, but is on login page -> Send to Dashboard
            if (isAuthPage) {
                window.location.href = 'dashboard.html';
            }
        } else {
            // If user is NOT logged in, but is on Dashboard -> Send to Login
            if (isDashboard) {
                window.location.href = 'login.html';
            }
        }
    });

    // Make logout available globally
    window.logoutUser = () => {
        signOut(auth).then(() => {
            window.location.href = 'login.html';
        }).catch((error) => {
            console.error("Logout error", error);
        });
    };
});