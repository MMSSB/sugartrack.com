


// DOM Elements
const appContainer = document.getElementById('appContainer');



// Initialize variables
let readings = [];
let currentUser = null;




// Initialize Firebase Auth listener
auth.onAuthStateChanged((user) => {
    if (user) {
        currentUser = user;
        appContainer.style.display = 'flex';
        loadUserData();
    } else {
        window.location.href = 'login.html';
    }
});

// Load user data from Firestore
function loadUserData() {
    // Set up logout button handler
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }
document.addEventListener('click', function(e) {
    if (e.target.id === 'logoutButton' || e.target.closest('#logoutButton')) {
        handleLogout();
    }
});
    // Load user's name
    db.collection('users').doc(currentUser.uid).get()
        .then((doc) => {
            if (doc.exists) {
                const userData = doc.data();
                const userWelcomeName = document.getElementById('userWelcomeName');
                if (userWelcomeName && userData.firstName) {
                    userWelcomeName.textContent = userData.firstName;
                }
            } else {
                return db.collection('users').doc(currentUser.uid).set({
                    firstName: 'User',
                    lastName: '',
                    email: currentUser.email,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            }
        })
        .catch((error) => {
            console.error('Error loading user data:', error);
        });


}

// Handle logout
function handleLogout() {
    if (window._unsubscribeReadings) {
        window._unsubscribeReadings();
    }
    
    auth.signOut()
        .then(() => {
            window.location.href = 'login.html';
        })
        .catch((error) => {
            console.error('Logout error:', error);
        });
}



