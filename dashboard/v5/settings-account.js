import { auth, db } from "./firebase-init.js";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword, deleteUser } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, getDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { PROFILE_ICONS } from "./profile/pimage.js";

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const emailInput = document.getElementById('userEmail');
    const userIdInput = document.getElementById('userIdInput');
    
    // Password Elements
    const currentPasswordInput = document.getElementById('currentPassword');
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const changePasswordBtn = document.getElementById('changePasswordButton');
    
    // Delete Account Elements
    const deleteAccountBtn = document.getElementById('deleteAccountButton');
    const deleteModal = document.getElementById('deleteModal');
    const closeDeleteModalBtn = document.getElementById('closeDeleteModal');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const deletePasswordInput = document.getElementById('deletePasswordInput');
    
    // Notification Elements
    const notification = document.getElementById('notification');
    const notificationMsg = document.getElementById('notification-message');

    let currentUser = null;

    // ==========================================
    // 1. LOAD USER DATA & SIDEBAR
    // ==========================================
    auth.onAuthStateChanged((user) => {
        if (user) {
            currentUser = user;
            if (emailInput) emailInput.value = user.email;
            if (userIdInput) userIdInput.value = user.uid;
            
            // Sync Sidebar UI (Name and Avatar)
            const userRef = doc(db, 'users', user.uid);
            getDoc(userRef).then((docSnap) => {
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    const displayName = data.firstName ? `${data.firstName} ${data.lastName}` : (data.username || user.email.split('@')[0]);
                    
                    document.querySelectorAll('.u-name, #userBadgeName').forEach(el => el.textContent = displayName);
                    
                    const iconSrc = PROFILE_ICONS[data.profileIconId || 1] || "images/user.png";
                    document.querySelectorAll('.avatar').forEach(div => {
                        div.innerHTML = `<img src="${iconSrc}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
                    });
                }
            });
        } else {
            window.location.href = 'login.html';
        }
    });

    // ==========================================
    // HELPER: SHOW NOTIFICATION
    // ==========================================
    function showNotification(msg, isError = false) {
        notificationMsg.textContent = msg;
        notification.style.background = isError ? 'var(--danger)' : 'var(--success)';
        
        notification.classList.remove('hidden');
        notification.style.display = 'block'; // Fallback if hidden class isn't fully styled
        
        setTimeout(() => {
            notification.classList.add('hidden');
            setTimeout(() => notification.style.display = 'none', 300); // Wait for fade out
        }, 3500);
    }

    // ==========================================
    // 2. CHANGE PASSWORD LOGIC
    // ==========================================
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', async () => {
            const currentPwd = currentPasswordInput.value;
            const newPwd = newPasswordInput.value;
            const confirmPwd = confirmPasswordInput.value;

            // Basic Validation
            if (!currentPwd || !newPwd || !confirmPwd) {
                return showNotification("Please fill out all password fields.", true);
            }
            if (newPwd !== confirmPwd) {
                return showNotification("Your new passwords do not match.", true);
            }
            if (newPwd.length < 6) {
                return showNotification("New password must be at least 6 characters.", true);
            }

            // UI Loading State
            changePasswordBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Updating...';
            changePasswordBtn.style.pointerEvents = "none";

            try {
                // Firebase Requires Re-Authentication for sensitive actions
                const credential = EmailAuthProvider.credential(currentUser.email, currentPwd);
                await reauthenticateWithCredential(currentUser, credential);

                // Update Password
                await updatePassword(currentUser, newPwd);
                
                showNotification("Password updated successfully!");
                
                // Clear fields
                currentPasswordInput.value = '';
                newPasswordInput.value = '';
                confirmPasswordInput.value = '';

            } catch (error) {
                console.error("Error updating password:", error);
                let errMsg = "Failed to update password.";
                if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
                    errMsg = "Incorrect current password.";
                }
                showNotification(errMsg, true);
            } finally {
                // Reset UI
                changePasswordBtn.innerHTML = '<i class="fas fa-key"></i> Update Password';
                changePasswordBtn.style.pointerEvents = "auto";
            }
        });
    }

    // ==========================================
    // 3. DELETE ACCOUNT MODAL LOGIC
    // ==========================================
    // Open Modal
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', () => {
            deleteModal.classList.add('active');
            deletePasswordInput.value = ''; // Clear previous input
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
    }

    // Close Modal helpers
    const closeDeleteModal = () => {
        deleteModal.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (closeDeleteModalBtn) closeDeleteModalBtn.addEventListener('click', closeDeleteModal);
    if (cancelDeleteBtn) cancelDeleteBtn.addEventListener('click', closeDeleteModal);
    if (deleteModal) {
        deleteModal.addEventListener('click', (e) => {
            if (e.target === deleteModal) closeDeleteModal();
        });
    }

    // Execute Deletion
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', async () => {
            const currentPwd = deletePasswordInput.value;
            
            if (currentPwd.trim() === "") {
                return showNotification("Password is required to delete your account.", true);
            }

            // UI Loading State
            confirmDeleteBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Deleting...';
            confirmDeleteBtn.style.pointerEvents = "none";
            cancelDeleteBtn.style.pointerEvents = "none";

            try {
                // 1. Re-authenticate user before deletion
                const credential = EmailAuthProvider.credential(currentUser.email, currentPwd);
                await reauthenticateWithCredential(currentUser, credential);

                // 2. Delete user document from Firestore database
                try {
                    await deleteDoc(doc(db, "users", currentUser.uid));
                } catch (e) {
                    console.warn("Could not delete Firestore doc, proceeding with Auth deletion.", e);
                }

                // 3. Delete user from Firebase Auth
                await deleteUser(currentUser);
                
                alert("Your account has been successfully deleted.");
                window.location.href = "login.html";
                
            } catch (error) {
                console.error("Error deleting account:", error);
                let errMsg = "Failed to delete account.";
                if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
                    errMsg = "Incorrect password.";
                }
                showNotification(errMsg, true);
                
                // Reset Button UI
                confirmDeleteBtn.innerHTML = 'Delete Forever';
                confirmDeleteBtn.style.pointerEvents = "auto";
                cancelDeleteBtn.style.pointerEvents = "auto";
            }
        });
    }
});