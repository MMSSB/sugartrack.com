import { getFirestore, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
import { firebaseConfig } from './firebase-config.js';

export const PROFILE_ICONS = {
  1: "images/userblue.png",
  2: "images/userred.png",
  3: "images/usergreen.png",
  4: "images/useryellow.png",
  5: "images/thunder.gif",
  6: "images/male.png",
  7: "images/maleuser.gif",
  8: "images/female.png",
  9: "images/femaleuser.gif",
  10: "images/h1.jpg",
  11: "images/h2.jpg",
  12: "images/h3.jpg",
  13: "images/h4.jpg",
  14: "images/h5.jpg",
  15: "images/h6.jpg",
  16: "images/h7.jpg",
  17: "images/j1.jpg",
  18: "images/j2.jpg"
};

export function updateProfileImages(iconId, customUrl = null) {
  const iconUrl = iconId ? PROFILE_ICONS[iconId] : customUrl;
  if (!iconUrl) return;
  
  const profileImages = document.querySelectorAll(
    '#profilePhoto, #navProfilePhoto, .profile-photo img, .sub-menu-wrap .user-info img'
  );
  
  profileImages.forEach(img => {
    img.src = iconUrl;
    img.style.width = 'auto';
    img.style.height = 'auto';
  });
}

export async function selectProfileIcon(iconId) {
  const userId = localStorage.getItem('loggedInUserId');
  if (!userId) {
    console.error('User not logged in');
    return false;
  }
  
  try {
    const docRef = doc(getFirestore(), "users", userId);
    await updateDoc(docRef, { 
      profileIconId: iconId,
      profilePhoto: PROFILE_ICONS[iconId]
    });
    updateProfileImages(iconId);
    return true;
  } catch (error) {
    console.error('Error updating profile icon:', error);
    return false;
  }
}

export function setupProfileIcons() {
  const iconsContainer = document.getElementById('profileIconsContainer');
  if (!iconsContainer) {
    console.error('Profile icons container not found');
    return;
  }

  iconsContainer.innerHTML = '';

  Object.entries(PROFILE_ICONS).forEach(([id, url]) => {
    const iconDiv = document.createElement('div');
    iconDiv.className = 'profile-icon-option';
    iconDiv.innerHTML = `<img src="${url}" alt="Profile ${id}" loading="lazy">`;
    
    iconDiv.addEventListener('click', async () => {
      const success = await selectProfileIcon(id);
      if (success) {
        document.querySelectorAll('.profile-icon-option').forEach(div => {
          div.classList.remove('selected');
        });
        iconDiv.classList.add('selected');
        
        const notification = document.createElement('div');
        notification.className = 'profile-icon-notification';
        notification.textContent = 'Profile icon updated!';
        iconsContainer.parentNode.appendChild(notification);
        setTimeout(() => notification.remove(), 2000);
      }
    });
    
    iconsContainer.appendChild(iconDiv);
  });
}