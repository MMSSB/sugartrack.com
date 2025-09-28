//    const logoutButton = document.createElement('button'); // We'll add this dynamically

   
   
//    // Load user data from Firestore
//     function loadUserData() {
//         // Set up logout button handler
//         const logoutButton = document.getElementById('logoutButton');
//         if (logoutButton) {
//             logoutButton.addEventListener('click', handleLogout);
//         }
    
// document.addEventListener('click', function(e) {
//     if (e.target.id === 'logoutButton' || e.target.closest('#logoutButton')) {
//         handleLogout();
//     }

// });


// Add event listener for both logout buttons
const logoutButton = document.getElementById('logoutButton');
const mobileLogoutButton = document.getElementById('mobileLogoutButton');

if (logoutButton) logoutButton.addEventListener('click', handleLogout);
if (mobileLogoutButton) mobileLogoutButton.addEventListener('click', handleLogout);