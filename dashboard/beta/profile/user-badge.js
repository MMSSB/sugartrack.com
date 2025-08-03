// class UserBadge extends HTMLElement {
//     constructor() {
//         super();
//         this.attachShadow({ mode: 'open' });
//         this.shadowRoot.innerHTML = `
//             <style>
//                 :host {
//                     display: inline-block;
//                 }
//                 .user-badge {
//                     display: flex;
//                     align-items: center;
//                     gap: 0.75rem;
//                     padding: 0.5rem 1rem;
//                     border-radius: 2rem;
//                     background: var(--card-bg);
//                     border: 1px solid var(--border);
//                     transition: all 0.3s ease;
//                     width: fit-content;
//                     max-width: 100%;
//                 }
//                 .user-badge:hover {
//                     background: var(--background);
//                     transform: translateY(-2px);
//                     box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
//                 }
//                 .user-badge-avatar {
//                     width: 40px;
//                     height: 40px;
//                     border-radius: 50%;
//                     object-fit: cover;
//                     border: 2px solid var(--primary);
//                 }
//                 .user-badge-name {
//                     font-weight: 600;
//                     white-space: nowrap;
//                     overflow: hidden;
//                     text-overflow: ellipsis;
//                     max-width: 150px;
//                 }
//             </style>
//             <div class="user-badge">
//                 <img class="user-badge-avatar" src="" alt="User Avatar">
//                 <span class="user-badge-name">Loading...</span>
//             </div>
//         `;
//     }

//     connectedCallback() {
//         this.loadUserData();
//     }

//     async loadUserData() {
//         const user = auth.currentUser;
//         if (!user) return;

//         try {
//             const userDoc = await db.collection('users').doc(user.uid).get();
//             if (userDoc.exists) {
//                 const userData = userDoc.data();
                
//                 const avatar = this.shadowRoot.querySelector('.user-badge-avatar');
//                 const name = this.shadowRoot.querySelector('.user-badge-name');
                
//                 // Set avatar (fallback to default if not set)
//                 avatar.src = userData.profileImage || 'avatars/default.png';
                
//                 // Set name (first name or email if name not set)
//                 name.textContent = userData.firstName || user.email.split('@')[0];
                
//                 // Apply size if specified
//                 const size = this.getAttribute('size');
//                 if (size === 'compact') {
//                     this.shadowRoot.querySelector('.user-badge').classList.add('compact');
//                 } else if (size === 'stacked') {
//                     this.shadowRoot.querySelector('.user-badge').classList.add('stacked');
//                 }
                
//                 // Apply custom click action if specified
//                 const clickAction = this.getAttribute('onclick');
//                 if (clickAction) {
//                     this.shadowRoot.querySelector('.user-badge').style.cursor = 'pointer';
//                     this.shadowRoot.querySelector('.user-badge').addEventListener('click', () => {
//                         eval(clickAction);
//                     });
//                 }
//             }
//         } catch (error) {
//             console.error('Error loading user data:', error);
//         }
//     }
// }

// // Define the custom element
// customElements.define('user-badge', UserBadge);

// // Function to initialize all user badges on a page
// function initializeUserBadges() {
//     // For standard user badges (not web components)
//     const userBadges = document.querySelectorAll('.user-badge:not([data-initialized])');
    
//     userBadges.forEach(badge => {
//         badge.setAttribute('data-initialized', 'true');
//         loadBadgeData(badge);
//     });
// }

// async function loadBadgeData(badgeElement) {
//     const user = auth.currentUser;
//     if (!user) return;

//     try {
//         const userDoc = await db.collection('users').doc(user.uid).get();
//         if (userDoc.exists) {
//             const userData = userDoc.data();
//             const avatar = badgeElement.querySelector('.user-badge-avatar');
//             const name = badgeElement.querySelector('.user-badge-name');
            
//             // Set avatar
//             avatar.src = userData.profileImage || 'avatars/default.png';
            
//             // Set name
//             name.textContent = userData.firstName || user.email.split('@')[0];
            
//             // Apply size if specified
//             if (badgeElement.classList.contains('compact')) {
//                 avatar.style.width = '30px';
//                 avatar.style.height = '30px';
//                 name.style.fontSize = '0.9rem';
//                 name.style.maxWidth = '100px';
//             }
            
//             if (badgeElement.classList.contains('stacked')) {
//                 badgeElement.style.flexDirection = 'column';
//                 badgeElement.style.textAlign = 'center';
//                 badgeElement.style.padding = '1rem';
//                 badgeElement.style.width = '100px';
//                 avatar.style.width = '60px';
//                 avatar.style.height = '60px';
//                 avatar.style.marginBottom = '0.5rem';
//                 name.style.whiteSpace = 'normal';
//                 name.style.textAlign = 'center';
//                 name.style.maxWidth = '100%';
//             }
//         }
//     } catch (error) {
//         console.error('Error loading user badge data:', error);
//     }
// }

// // Initialize badges when auth state changes
// auth.onAuthStateChanged(() => {
//     initializeUserBadges();
// });

// // Also initialize when DOM is loaded
// document.addEventListener('DOMContentLoaded', initializeUserBadges);
// Initialize user badges when auth state changes


// user-badge.js - Simplified version
document.addEventListener('DOMContentLoaded', function() {
    auth.onAuthStateChanged((user) => {
        if (user) {
            loadUserBadgeData(user);
        }
    });
});

async function loadUserBadgeData(user) {
    try {
        const userDoc = await db.collection('users').doc(user.uid).get();
        if (userDoc.exists) {
            const userData = userDoc.data();
            
            // Update all user badges on the page
            document.querySelectorAll('.user-badge').forEach(badge => {
                const avatar = badge.querySelector('.user-badge-avatar');
                const name = badge.querySelector('.user-badge-name');
                
                // Set avatar (fallback to default if not set)
                if (avatar) {
                    avatar.src = userData.profileImage || 'avatars/default.png';
                }
                
                // Set full name (first + last) or email if name not set
                if (name) {
                    const fullName = [userData.firstName].filter(Boolean).join(' ');
                    // const fullName = [userData.firstName, userData.lastName].filter(Boolean).join(' ');
                    name.textContent = fullName || user.email.split('@')[0];
                }
            });
        }
    } catch (error) {
        console.error('Error loading user badge data:', error);
    }
}




// auth.onAuthStateChanged((user) => {
//     if (user) {
//         loadUserBadgeData();
//     }
// });

// // Also initialize when DOM is loaded
// document.addEventListener('DOMContentLoaded', loadUserBadgeData);

// async function loadUserBadgeData() {
//     const user = auth.currentUser;
//     if (!user) return;

//     try {
//         const userDoc = await db.collection('users').doc(user.uid).get();
//         if (userDoc.exists) {
//             const userData = userDoc.data();
            
//             // Update all user badges on the page
//             document.querySelectorAll('.user-badge').forEach(badge => {
//                 const avatar = badge.querySelector('.user-badge-avatar');
//                 const name = badge.querySelector('.user-badge-name');
                
//                 // Set avatar (fallback to default if not set)
//                 avatar.src = userData.profileImage || 'avatars/default.png';
                
//                 // Set name (first name or email if name not set)
//                 name.textContent = userData.firstName || user.email.split('@')[0];
//             });
//         }
//     } catch (error) {
//         console.error('Error loading user badge data:', error);
//     }
// }