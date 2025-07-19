document.addEventListener('DOMContentLoaded', function() {
  // Check auth state
  auth.onAuthStateChanged(function(user) {
    if (user) {
      loadProfileData(user);
    }
  });

  function loadProfileData(user) {
    db.collection('users').doc(user.uid).get().then(function(doc) {
      if (doc.exists) {
        const userData = doc.data();
        
        // Set profile picture
        const profileAvatar = document.getElementById('profileAvatar');
        if (profileAvatar) {
          profileAvatar.src = userData.profileImage || 'images/default-avatar.png';
          profileAvatar.onerror = function() {
            this.src = 'images/default-avatar.png';
          };
        }
        
        // Set full name
        const fullNameElement = document.getElementById('profileFullName');
        if (fullNameElement) {
          const fullName = [userData.firstName, userData.lastName].filter(Boolean).join(' ');
          fullNameElement.textContent = fullName || "User";
        }
        
        // Set email
        const emailElement = document.getElementById('profileEmail');
        if (emailElement) {
          emailElement.textContent = user.email;
        }
        
        // Set username
        const usernameElement = document.getElementById('profileUsername');
        if (usernameElement) {
          usernameElement.textContent = userData.username ? `@${userData.username}` : "@user";
        }
        
        // Set join date (format: Month Year)
        const joinDateElement = document.getElementById('profileJoinDate');
        if (joinDateElement && userData.createdAt) {
          const joinDate = userData.createdAt.toDate();
          joinDateElement.textContent = joinDate.toLocaleString('default', { month: 'long', year: 'numeric' });
        }
        
        // Set last active
        const lastActiveElement = document.getElementById('profileLastActive');
        if (lastActiveElement) {
          lastActiveElement.textContent = "Just now"; // You can implement more precise timing
        }
      }
    }).catch(function(error) {
      console.error("Error loading profile data:", error);
    });
  }

  // Add event listeners for buttons
  document.getElementById('changeAvatarBtn')?.addEventListener('click', function() {
    // Implement avatar change functionality
    alert("Avatar change functionality would go here");
  });
  
  document.getElementById('editProfileBtn')?.addEventListener('click', function() {
    window.location.href = "profile-edit.html";
  });
  
  document.getElementById('accountSettingsBtn')?.addEventListener('click', function() {
    window.location.href = "settings.html";
  });
});