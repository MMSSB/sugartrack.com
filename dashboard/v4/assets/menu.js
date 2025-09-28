    let submenu2 = document.getElementById("submenu2");
function toggleMenu(){
     submenu2.classList.toggle("open-menu2");
}



document.addEventListener('DOMContentLoaded', function() {
    const userBadge = document.getElementById('userBadge');
    const subMenuWrap = document.querySelector('.sub-menu-wrap');
    
    if (userBadge && subMenuWrap) {
        userBadge.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
            subMenuWrap.classList.toggle('open-menu');
        });
        
        // Close when clicking outside
        document.addEventListener('click', function(e) {
            if (!userBadge.contains(e.target) && !subMenuWrap.contains(e.target)) {
                userBadge.classList.remove('active');
                subMenuWrap.classList.remove('open-menu');
            }
        });
        
        // Update submenu user info
        auth.onAuthStateChanged(user => {
            if (user) {
                db.collection('users').doc(user.uid).get().then(doc => {
                    if (doc.exists) {
                        const userData = doc.data();
                        const submenuAvatar = document.getElementById('submenuUserAvatar');
                        const submenuName = document.getElementById('submenuUserName');
                        const submenuEmail = document.getElementById('submenuUserEmail');
                        
                        if (submenuAvatar) submenuAvatar.src = userData.profileImage || 'images/user.png';
                        if (submenuName) submenuName.textContent = [userData.firstName, userData.lastName].filter(Boolean).join(' ') || 'User';
                        if (submenuEmail) submenuEmail.textContent = user.email;
                    }
                });
            }
        });
    // }
    
        // Update submenu user info
        auth.onAuthStateChanged(user => {
            if (user) {
                db.collection('users').doc(user.uid).get().then(doc => {
                    if (doc.exists) {
                        const userData = doc.data();
                        const submenuAvatar = document.getElementById('submenuUserAvatar2');
                        const submenuName = document.getElementById('submenuUserName2');
                        const submenuEmail = document.getElementById('submenuUserEmail2');
                        
                        if (submenuAvatar) submenuAvatar.src = userData.profileImage || 'images/user.png';
                        if (submenuName) submenuName.textContent = [userData.firstName, userData.lastName].filter(Boolean).join(' ') || 'User';
                        if (submenuEmail) submenuEmail.textContent = user.email;
                    }
                });
            }
        });
    }
    
    // Handle logout
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function(e) {
            e.preventDefault();
            auth.signOut().then(() => {
                window.location.href = 'login.html';
            });
        });
    }
});

document.addEventListener('click', function(e) {
    if (e.target.id === 'logoutButton' || e.target.closest('#logoutButton')) {
        handleLogout();
    }
});





// Simple User Display System
document.addEventListener('DOMContentLoaded', function() {
  // Initialize Firebase (make sure securityFlase.js is loaded first)
  if (typeof auth === 'undefined') {
    console.error("Firebase Auth not initialized");
    return;
  }

  // Check auth state
  auth.onAuthStateChanged(function(user) {
    if (user) {
      updateUserDisplay(user);
    } else {
      console.log("No user signed in");
    }
  });

  // Update user display
  function updateUserDisplay(user) {
    // Get user data from Firestore
    db.collection('users').doc(user.uid).get()
      .then(function(doc) {
        if (doc.exists) {
          const userData = doc.data();
          
          // Update name display
          const nameDisplay = document.getElementById('userNameDisplay');
          if (nameDisplay) {
            const fullName = `${userData.firstName || ''} ${userData.lastName || ''}`.trim();
            nameDisplay.textContent = fullName || "User";
          }
          const EDisplay = document.getElementById('UserEmailDisplay');
          if (UserEmailDisplay) EDisplay.textContent = user.email;
        


          // Update profile image
          const profileImage = document.getElementById('profileImageDisplay');
          if (profileImage) {
            profileImage.src = userData.profileImage || 'images/user.png';
            profileImage.onerror = function() {
              this.src = 'images/user.png';
            };
          }
        }
      })
      .catch(function(error) {
        console.error("Error getting user data:", error);
      });
  }

  // Optional: Auto-refresh every 5 seconds if you want live updates
  setInterval(function() {
    if (auth.currentUser) {
      updateUserDisplay(auth.currentUser);
    }
  }, 5000);
});














