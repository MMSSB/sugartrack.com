// settings.js
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const userWelcomeName = document.getElementById('userWelcomeName');
    const themeSelect = document.getElementById('themeSelect');
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const userEmailInput = document.getElementById('userEmail');
    const updateProfileButton = document.getElementById('updateProfileButton');
    const currentPasswordInput = document.getElementById('currentPassword');
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const logoutButton = document.getElementById('logoutButton');
    const deleteAccountButton = document.getElementById('deleteAccountButton');
    const appContainer = document.getElementById('appContainer');

    // Check auth state
    let currentUser = null;
    auth.onAuthStateChanged((user) => {
        if (user) {
            currentUser = user;
            loadUserData();
            appContainer.style.display = 'flex';
        } else {
            window.location.href = 'login.html';
        }
    });

    // // Load user data from Firestore
    // function loadUserData() {
    //     console.log('Loading user data for:', currentUser.uid);
    //     db.collection('users').doc(currentUser.uid).get()
    //         .then((doc) => {
    //             if (doc.exists) {
    //                 const userData = doc.data();
    //                 console.log('User data loaded:', userData);
                    
    //                 // Update form fields
    //                 firstNameInput.value = userData.firstName || '';
    //                 lastNameInput.value = userData.lastName || '';
    //                 userEmailInput.value = currentUser.email;
                    
    //                 // Update welcome name
    //                 if (userWelcomeName) {
    //                     userWelcomeName.textContent = userData.firstName || 'User';
    //                 }
    //             } else {
    //                 console.log('No user document found, creating default');
    //                 return db.collection('users').doc(currentUser.uid).set({
    //                     firstName: 'User',
    //                     lastName: '',
    //                     email: currentUser.email,
    //                     createdAt: firebase.firestore.FieldValue.serverTimestamp()
    //                 });
    //             }
    //         })
    //         .catch((error) => {
    //             console.error('Error loading user data:', error);
    //             alert('Error loading user data. Please try again.');
    //         });
    // }
// In the loadUserData function:
function loadUserData() {
    console.log('Loading user data for:', currentUser.uid);
    db.collection('users').doc(currentUser.uid).get()
        .then((doc) => {
            if (doc.exists) {
                const userData = doc.data();
                console.log('User data loaded:', userData);
                
                // Update form fields
                firstNameInput.value = userData.firstName || '';
                lastNameInput.value = userData.lastName || '';
                document.getElementById('userEmailInput').value = currentUser.email;
                
                // Update display elements
                document.getElementById('UserEmailDisplay').textContent = currentUser.email;
                document.getElementById('userNameDisplay').textContent = 
                    `${userData.firstName || ''} ${userData.lastName || ''}`.trim();
                
                // Update welcome name
                if (userWelcomeName) {
                    userWelcomeName.textContent = userData.firstName || 'User';
                }
            } else {
                console.log('No user document found, creating default');
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

    // Change password
    const changePasswordButton = document.getElementById('changePasswordButton');
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
    }

    // Theme handling
    function applyTheme(theme) {
        if (theme === 'system') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.body.classList.toggle('dark-theme', prefersDark);
        } else {
            document.body.classList.toggle('dark-theme', theme === 'dark');
        }
    }

    // Load saved theme
    if (themeSelect) {
        const savedTheme = localStorage.getItem('theme') || 'system';
        themeSelect.value = savedTheme;
        applyTheme(savedTheme);

        // Theme selection
        themeSelect.addEventListener('change', () => {
            const theme = themeSelect.value;
            localStorage.setItem('theme', theme);
            applyTheme(theme);
        });

        // System theme listener
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            if (themeSelect.value === 'system') {
                applyTheme('system');
            }
        });
    }
});

// Sidebar functionality
document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.sidebar');
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const closeBtn = document.querySelector('.close-btn');
    const toggleCollapse = document.querySelector('.toggle-collapse');
    const mainContent = document.querySelector('.main-content');
    
    // Load sidebar state from localStorage
    const isSidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    const isMobile = window.matchMedia('(max-width: 992px)').matches;
    
    if (isSidebarCollapsed && !isMobile) {
        sidebar.classList.add('collapsed');
        mainContent.classList.add('expanded');
    }
    
    // Hamburger button (mobile)
    hamburgerBtn.addEventListener('click', () => {
        sidebar.classList.add('open');
    });
    
    // Close button (mobile)
    closeBtn.addEventListener('click', () => {
        sidebar.classList.remove('open');
    });
    
    // Toggle collapse (desktop)
    toggleCollapse.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('expanded');
        
        // Save state to localStorage
        if (window.matchMedia('(min-width: 993px)').matches) {
            localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        const isMobileNow = window.matchMedia('(max-width: 992px)').matches;
        
        if (isMobileNow) {
            sidebar.classList.remove('collapsed', 'open');
            mainContent.classList.remove('expanded');
        } else {
            // Restore desktop state
            if (localStorage.getItem('sidebarCollapsed') === 'true') {
                sidebar.classList.add('collapsed');
                mainContent.classList.add('expanded');
            } else {
                sidebar.classList.remove('collapsed');
                mainContent.classList.remove('expanded');
            }
        }
    });
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.matchMedia('(max-width: 992px)').matches) {
            if (!sidebar.contains(e.target) && !hamburgerBtn.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        }
    });
});
