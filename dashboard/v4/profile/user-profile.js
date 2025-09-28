// user-badge.js

/**
 * Listens for DOM content to be loaded and for Firebase auth state changes.
 * When a user is logged in, it triggers the function to update all user badges.
 */
document.addEventListener('DOMContentLoaded', () => {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            updateUserBadges(user);
        }
    });
});

/**
 * Fetches user data from Firestore and updates all elements with the class '.user-badge'.
 * This function gracefully handles missing elements, so you can create different
 * versions of the badge (e.g., with or without email).
 *
 * @param {object} user - The Firebase user object.
 */
async function updateUserBadges(user) {
    if (!user) return;

    try {
        const userDocRef = firebase.firestore().collection('users').doc(user.uid);
        const userDoc = await userDocRef.get();

        if (userDoc.exists) {
            const userData = userDoc.data();
            const fullName = userData.firstName || user.email.split('@')[0];
            const profileImageUrl = userData.profileImage || 'images/user.png'; // Fallback to a default image

            // Find all user badge containers on the page
            const badges = document.querySelectorAll('.user-badge2');

            badges.forEach(badge => {
                // Find elements within each badge
                const avatarImg = badge.querySelector('.user-badge-nav');
                const nameSpan = badge.querySelector('.user-badge-name');
                const emailSpan = badge.querySelector('.user-badge-email');

                // Update elements if they exist
                if (avatarImg) {
                    avatarImg.src = profileImageUrl;
                }
                if (nameSpan) {
                    nameSpan.textContent = fullName;
                }
                if (emailSpan) {
                    emailSpan.textContent = user.email;
                }
            });
        } else {
            console.warn("User document not found in Firestore.");
        }
    } catch (error) {
        console.error("Error loading user badge data:", error);
    }
}