document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    // const currentProfileImage = document.getElementById('currentProfileImage');
    const avatarGrid = document.getElementById('avatarGrid');
    const saveProfileImageBtn = document.getElementById('saveProfileImage');
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const userEmailInput = document.getElementById('userEmail');
    const updateProfileButton = document.getElementById('updateProfileButton');
    const deleteAccountButton = document.getElementById('deleteAccountButton');
    const userWelcomeName = document.getElementById('userWelcomeName');
    const appContainer = document.getElementById('appContainer');
    
    // Password change elements
    const currentPasswordInput = document.getElementById('currentPassword');
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const changePasswordButton = document.getElementById('changePasswordButton');
    const avatarModal = document.getElementById('avatarModal');
    const openAvatarModalBtn = document.getElementById('openAvatarModal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const avatarGridModal = document.getElementById('avatarGridModal');
    const saveProfileImageModalBtn = document.getElementById('saveProfileImageModal');
    // Initialize Fancybox when profile image is clicked
    const profileImageLink = document.getElementById('profileImageLink');
    const currentProfileImage = document.getElementById('currentProfileImage');

// Update your modal open/close functions in profile.js:

// Open modal with animation
if (openAvatarModalBtn) {
    openAvatarModalBtn.addEventListener('click', () => {
        avatarModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling behind modal
        loadAvatarOptionsModal();
    });
}

// Close modal with animation
function closeModal() {
    avatarModal.classList.remove('active');
    document.body.style.overflow = ''; // Re-enable scrolling
}

closeModalBtns.forEach(btn => {
    btn.addEventListener('click', closeModal);
});

// Close when clicking outside modal
avatarModal.addEventListener('click', (e) => {
    if (e.target === avatarModal) {
        closeModal();
    }
});

// Load avatar options with staggered animation
function loadAvatarOptionsModal() {
    if (!avatarGridModal) return;
    
    avatarGridModal.innerHTML = '';
    
    avatarOptions.forEach((avatarPath, index) => {
        const avatarOption = document.createElement('img');
        avatarOption.src = avatarPath;
        avatarOption.alt = 'Avatar option';
        avatarOption.classList.add('avatar-option');
        avatarOption.style.setProperty('--i', index);
        
        if (selectedAvatar && selectedAvatar.includes(avatarPath)) {
            avatarOption.classList.add('selected');
        }
        
        avatarOption.addEventListener('click', () => {
            document.querySelectorAll('#avatarGridModal .avatar-option').forEach(option => {
                option.classList.remove('selected');
            });
            
            avatarOption.classList.add('selected');
            selectedAvatar = avatarPath;
            
            if (currentProfileImage) {
                currentProfileImage.src = avatarPath;
            }
        });
        
        avatarGridModal.appendChild(avatarOption);
    });
}

    //     // Open modal
    // if (openAvatarModalBtn) {
    //     openAvatarModalBtn.addEventListener('click', () => {
    //         avatarModal.classList.remove('hidden');
    //         loadAvatarOptionsModal();
    //     });
    // }
    
    // // Close modal
    // closeModalBtns.forEach(btn => {
    //     btn.addEventListener('click', () => {
    //         avatarModal.classList.add('hidden');
    //     });
    // });
    
    // // Close when clicking outside modal
    // avatarModal.addEventListener('click', (e) => {
    //     if (e.target === avatarModal) {
    //         avatarModal.classList.add('hidden');
    //     }
    // });
    
    // // Load avatar options into modal
    // function loadAvatarOptionsModal() {
    //     if (!avatarGridModal) return;
        
    //     avatarGridModal.innerHTML = '';
        
    //     avatarOptions.forEach((avatarPath) => {
    //         const avatarOption = document.createElement('img');
    //         avatarOption.src = avatarPath;
    //         avatarOption.alt = 'Avatar option';
    //         avatarOption.classList.add('avatar-option');
            
    //         if (selectedAvatar && selectedAvatar.includes(avatarPath)) {
    //             avatarOption.classList.add('selected');
    //         }
            
    //         avatarOption.addEventListener('click', () => {
    //             document.querySelectorAll('#avatarGridModal .avatar-option').forEach(option => {
    //                 option.classList.remove('selected');
    //             });
                
    //             avatarOption.classList.add('selected');
    //             selectedAvatar = avatarPath;
                
    //             if (currentProfileImage) {
    //                 currentProfileImage.src = avatarPath;
    //             }
    //         });
            
    //         avatarGridModal.appendChild(avatarOption);
    //     });
    // }
    
    // Save profile image from modal
    if (saveProfileImageModalBtn) {
        saveProfileImageModalBtn.addEventListener('click', () => {
            if (!selectedAvatar) {
                alert('Please select an avatar first.');
                return;
            }
            
            saveProfileImageModalBtn.disabled = true;
            saveProfileImageModalBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
            
            db.collection('users').doc(currentUser.uid).update({
                profileImage: selectedAvatar,
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            })
            .then(() => {
                alert('Profile image updated successfully!');
                avatarModal.classList.add('hidden');
            })
            .catch((error) => {
                console.error('Error updating profile image:', error);
                alert('Error updating profile image. Please try again.');
            })
            .finally(() => {
                saveProfileImageModalBtn.disabled = false;
                saveProfileImageModalBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes';
            });
        });
    }

    // Example for save profile
if (updateProfileButton) {
  updateProfileButton.addEventListener('click', () => {
    const firstName = firstNameInput.value.trim();
    const lastName = lastNameInput.value.trim();

    if (!firstName) {
      showNotification('Please enter your first name', 'error');
      return;
    }

    updateProfileButton.disabled = true;
    updateProfileButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

    db.collection('users').doc(currentUser.uid).update({
      firstName: firstName,
      lastName: lastName
    })
    .then(() => {
      if (userWelcomeName) {
        userWelcomeName.textContent = firstName;
      }
      showNotification('Profile updated successfully!');
    })
    .catch((error) => {
      console.error('Error updating profile:', error);
      showNotification('Error updating profile. Please try again.', 'error');
    })
    .finally(() => {
      updateProfileButton.disabled = false;
      updateProfileButton.innerHTML = '<i class="fas fa-save"></i> Save Changes';
    });
  });
}
    // Available avatar options
    const avatarOptions = [
        // "images/images/thunder.gif",
        "images/images/userblue.png",
        "images/images/userred.png",
        "images/images/usergreen.png",
        "images/images/useryellow.png",
        "images/images/male.png",
        // "images/images/maleuser.gif",
        "images/images/female.png",
        // "images/images/femaleuser.gif",
        "images/images/h1.jpg",
        "images/images/h2.jpg",
        "images/images/h3.jpg",
        "images/images/h4.jpg",
        "images/images/h5.jpg",
        "images/images/h6.jpg",
        "images/images/h7.jpg",
        "images/images/j1.jpg",
        "images/images/j2.jpg",
        "images/images/coolcats/0.png",
        "images/images/coolcats/1.png",
        "images/images/coolcats/2.png",
        "images/images/coolcats/3.png",
        "images/images/coolcats/4.png",
        "images/images/coolcats/5.png",
        "images/images/coolcats/6.png",
        "images/images/coolcats/7.png",
        "images/images/coolcats/8.png",
        "images/images/coolcats/9.png",
        "images/images/coolcats/10.png",
        "images/images/coolcats/11.png",
        "images/images/coolcats/12.png",
        "images/images/coolcats/13.png",
        "images/images/coolcats/15.png",
        "images/images/coolcats/16.png",
        "images/images/coolcats/17.png",
        "images/images/coolcats/18.png",
        "images/images/coolcats/19.png",
        "images/images/coolcats/20.png",
        "images/images/coolcats/21.png",
        "images/images/coolcats/22.png",
        "images/images/coolcats/23.png",
        "images/images/coolcats/24.png",
        "images/images/coolcats/25.png",
        "images/images/coolcats/26.png",
        "images/images/coolcats/27.png",
        "images/images/coolcats/28.png",
        "images/images/coolcats/29.png",
        "images/images/coolcats/30.png",
        "images/images/coolcats/31.png",
        "images/images/coolcats/32.png",
        "images/images/coolcats/33.png",
        "images/images/coolcats/34.png",
        "images/images/coolcats/35.png",
        "images/images/coolcats/36.png",
        "images/images/coolcats/37.png",
        "images/images/coolcats/38.png",
        "images/images/coolcats/39.png",
        "images/images/coolcats/40.png",
        "images/images/coolcats/41.png",
        "images/images/coolcats/42.png",
        "images/images/coolcats/43.png",
        "images/images/coolcats/44.png",
        "images/images/coolcats/45.png",
        "images/images/coolcats/46.png",
        "images/images/coolcats/47.png",
        "images/images/coolcats/48.png",
        "images/images/coolcats/49.png",
        "images/images/coolcats/50.png"
    ];
    
    // Selected avatar
    let selectedAvatar = null;
    
    // Check auth state
    auth.onAuthStateChanged((user) => {
        if (user) {
            currentUser = user;
            loadUserData();
            loadUserProfile();
            if (appContainer) appContainer.style.display = 'flex';
        } else {
            window.location.href = 'login.html';
        }
    });
    
    // Load user data from Firestore
    function loadUserData() {
        if (!currentUser) return;
        
        db.collection('users').doc(currentUser.uid).get()
            .then((doc) => {
                if (doc.exists) {
                    const userData = doc.data();
                    console.log('User data loaded:', userData);
                    
                    // Update form fields
                    if (firstNameInput) firstNameInput.value = userData.firstName || '';
                    if (lastNameInput) lastNameInput.value = userData.lastName || '';
                    if (userEmailInput) userEmailInput.value = currentUser.email;
                    
                    // Update welcome name (first name only)
                    if (userWelcomeName) {
                        userWelcomeName.textContent = userData.firstName || 'User';
                    }
                } else {
                    console.log('No user document found, creating default');
                    return db.collection('users').doc(currentUser.uid).set({
                        firstName: 'User',
                        lastName: '',
                        email: currentUser.email,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        profileImage: 'images/images/userblue.png' // Default avatar
                    });
                }
            })
            .catch((error) => {
                console.error('Error loading user data:', error);
                alert('Error loading user data. Please try again.');
            });
    }

    // Update profile
    if (updateProfileButton) {
        updateProfileButton.addEventListener('click', () => {
            const firstName = firstNameInput.value.trim();
            const lastName = lastNameInput.value.trim();

            if (!firstName) {
                alert('Please enter your first name');
                return;
            }

            updateProfileButton.disabled = true;
            updateProfileButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

            db.collection('users').doc(currentUser.uid).update({
                firstName: firstName,
                lastName: lastName
            })
            .then(() => {
                // Update welcome name (first name only)
                if (userWelcomeName) {
                    userWelcomeName.textContent = firstName;
                }
                alert('Profile updated successfully!');
            })
            .catch((error) => {
                console.error('Error updating profile:', error);
                alert('Error updating profile. Please try again.');
            })
            .finally(() => {
                updateProfileButton.disabled = false;
                updateProfileButton.innerHTML = '<i class="fas fa-save"></i> Save Changes';
            });
        });
    }
// In your profile.js, replace all alerts with showNotification()

// Example for updating profile:
if (updateProfileButton) {
    updateProfileButton.addEventListener('click', () => {
        const firstName = firstNameInput.value.trim();
        const lastName = lastNameInput.value.trim();

        if (!firstName) {
            showNotification('Please enter your first name', 'error');
            return;
        }

        updateProfileButton.disabled = true;
        updateProfileButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

        db.collection('users').doc(currentUser.uid).update({
            firstName: firstName,
            lastName: lastName
        })
        .then(() => {
            if (userWelcomeName) {
                userWelcomeName.textContent = firstName;
            }
            showNotification('Profile updated successfully!');
        })
        .catch((error) => {
            console.error('Error updating profile:', error);
            showNotification('Error updating profile. Please try again.', 'error');
        })
        .finally(() => {
            updateProfileButton.disabled = false;
            updateProfileButton.innerHTML = '<i class="fas fa-save"></i> Save Changes';
        });
    });
}
    // Change Password
    if (changePasswordButton) {
        changePasswordButton.addEventListener('click', () => {
            const currentPassword = currentPasswordInput.value;
            const newPassword = newPasswordInput.value;
            const confirmPassword = confirmPasswordInput.value;

            if (!currentPassword || !newPassword || !confirmPassword) {
                alert('Please fill in all password fields');
                return;
            }

            if (newPassword !== confirmPassword) {
                alert('New passwords do not match');
                return;
            }

            if (newPassword.length < 6) {
                alert('New password must be at least 6 characters long');
                return;
            }

            changePasswordButton.disabled = true;
            changePasswordButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';

            // Reauthenticate user
            const credential = firebase.auth.EmailAuthProvider.credential(
                currentUser.email,
                currentPassword
            );

            currentUser.reauthenticateWithCredential(credential)
                .then(() => {
                    return currentUser.updatePassword(newPassword);
                })
                .then(() => {
                    alert('Password updated successfully!');
                    currentPasswordInput.value = '';
                    newPasswordInput.value = '';
                    confirmPasswordInput.value = '';
                })
                .catch((error) => {
                    console.error('Error updating password:', error);
                    if (error.code === 'auth/wrong-password') {
                        alert('Current password is incorrect');
                    } else {
                        alert('Error updating password: ' + error.message);
                    }
                })
                .finally(() => {
                    changePasswordButton.disabled = false;
                    changePasswordButton.innerHTML = '<i class="fas fa-key"></i> Update Password';
                });
        });
    }

    // Delete Account
    if (deleteAccountButton) {
        deleteAccountButton.addEventListener('click', () => {
            const confirmDelete = confirm('Are you sure you want to delete your account? This action cannot be undone.');
            
            if (confirmDelete) {
                deleteAccountButton.disabled = true;
                deleteAccountButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Deleting...';

                // Delete user data from Firestore first
                db.collection('users').doc(currentUser.uid).delete()
                    .then(() => {
                        // Then delete the user account
                        return currentUser.delete();
                    })
                    .then(() => {
                        // Redirect to login page after successful deletion
                        window.location.href = 'login.html';
                    })
                    .catch((error) => {
                        console.error('Error deleting account:', error);
                        if (error.code === 'auth/requires-recent-login') {
                            alert('For security reasons, please log out and log back in before deleting your account.');
                        } else {
                            alert('Error deleting account: ' + error.message);
                        }
                        deleteAccountButton.disabled = false;
                        deleteAccountButton.innerHTML = '<i class="fas fa-trash-alt"></i> Delete Account';
                    });
            }
        });
    }
    // Delete Account
if (deleteAccountButton) {
    deleteAccountButton.addEventListener('click', () => {
        // Create a custom confirmation modal instead of using confirm()
        const confirmDelete = confirm('Are you sure you want to delete your account? This action cannot be undone.');
        
        if (confirmDelete) {
            deleteAccountButton.disabled = true;
            deleteAccountButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Deleting...';

            db.collection('users').doc(currentUser.uid).delete()
                .then(() => {
                    return currentUser.delete();
                })
                .then(() => {
                    window.location.href = 'login.html';
                })
                .catch((error) => {
                    console.error('Error deleting account:', error);
                    if (error.code === 'auth/requires-recent-login') {
                        showNotification('Please log out and log back in before deleting your account.', 'warning');
                    } else {
                        showNotification('Error deleting account: ' + error.message, 'error');
                    }
                    deleteAccountButton.disabled = false;
                    deleteAccountButton.innerHTML = '<i class="fas fa-trash-alt"></i> Delete Account';
                });
        }
    });
}
    // Load user profile data
    function loadUserProfile() {
        if (!currentUser) return;
        
        db.collection('users').doc(currentUser.uid).get()
            .then((doc) => {
                if (doc.exists) {
                    const userData = doc.data();
                    
                    // Set current profile image
                    if (currentProfileImage) {
                        currentProfileImage.src = userData.profileImage || 'images/images/userblue.png';
                        selectedAvatar = userData.profileImage;
                    }
                    
                    // Load avatar options
                    loadAvatarOptions();
                }
            })
            .catch((error) => {
                console.error('Error loading user profile:', error);
                alert('Error loading profile data. Please try again.');
            });
    }
    
    // Load avatar selection options
    function loadAvatarOptions() {
        if (!avatarGrid) return;
        
        avatarGrid.innerHTML = '';
        
        avatarOptions.forEach((avatarPath) => {
            const avatarOption = document.createElement('img');
            avatarOption.src = avatarPath;
            avatarOption.alt = 'Avatar option';
            avatarOption.classList.add('avatar-option');
            
            // Check if this is the current profile image
            if (selectedAvatar && selectedAvatar.includes(avatarPath)) {
                avatarOption.classList.add('selected');
            }
            
            avatarOption.addEventListener('click', () => {
                // Remove selected class from all options
                document.querySelectorAll('.avatar-option').forEach(option => {
                    option.classList.remove('selected');
                });
                
                // Add selected class to clicked option
                avatarOption.classList.add('selected');
                selectedAvatar = avatarPath;
                
                // Preview the selected avatar
                if (currentProfileImage) {
                    currentProfileImage.src = avatarPath;
                }
            });
            
            avatarGrid.appendChild(avatarOption);
        });
    }
    
    // Save profile image
    if (saveProfileImageBtn) {
        saveProfileImageBtn.addEventListener('click', () => {
            if (!selectedAvatar) {
                alert('Please select an avatar first.');
                return;
            }
            
            saveProfileImageBtn.disabled = true;
            saveProfileImageBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
            
            db.collection('users').doc(currentUser.uid).update({
                profileImage: selectedAvatar,
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            })
            .then(() => {
                alert('Profile image updated successfully!');
            })
            .catch((error) => {
                console.error('Error updating profile image:', error);
                alert('Error updating profile image. Please try again.');
            })
            .finally(() => {
                saveProfileImageBtn.disabled = false;
                saveProfileImageBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes';
            });
        });
    }
// Save profile image
if (saveProfileImageBtn) {
    saveProfileImageBtn.addEventListener('click', () => {
        if (!selectedAvatar) {
            showNotification('Please select an avatar first.', 'error');
            return;
        }
        
        saveProfileImageBtn.disabled = true;
        saveProfileImageBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        
        db.collection('users').doc(currentUser.uid).update({
            profileImage: selectedAvatar,
            lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
            showNotification('Profile image updated successfully!');
        })
        .catch((error) => {
            console.error('Error updating profile image:', error);
            showNotification('Error updating profile image. Please try again.', 'error');
        })
        .finally(() => {
            saveProfileImageBtn.disabled = false;
            saveProfileImageBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes';
        });
    });
}
    // Update user-badge with full name
    function updateUserBadge() {
        if (!currentUser) return;
        
        db.collection('users').doc(currentUser.uid).get()
            .then((doc) => {
                if (doc.exists) {
                    const userData = doc.data();
                    const userBadgeName = document.querySelector('.user-badge-name');
                    
                    if (userBadgeName) {
                        // Show full name (first + last) in user badge
                        const fullName = [userData.firstName, userData.lastName].filter(Boolean).join(' ');
                        userBadgeName.textContent = fullName || currentUser.email.split('@')[0];
                    }
                }
            })
            .catch((error) => {
                console.error('Error loading user badge data:', error);
            });
    }
    
    // Initialize user badge
    updateUserBadge();
});
    // Handle logout
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            auth.signOut()
                .then(() => {
                    window.location.href = 'login.html';
                })
                .catch((error) => {
                    console.error('Logout error:', error);
                    alert('Error logging out. Please try again.');
                });
        });
    }s
