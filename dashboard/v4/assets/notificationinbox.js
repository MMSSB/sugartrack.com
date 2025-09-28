// // This file handles setting up push notifications for the user's inbox.

// // This function is called once the DOM is loaded.
// function setupFirebaseMessaging() {
//     // First, check if Firebase Messaging is supported by the browser.
//     if (!firebase.messaging.isSupported()) {
//         console.log("Firebase Messaging is not supported in this browser.");
//         const enableButton = document.getElementById('enableNotifications');
//         if (enableButton) {
//             enableButton.style.display = 'none'; // Hide button if not supported
//         }
//         return;
//     }

//     const messaging = firebase.messaging();

//     // Handle incoming messages when the web page is open and in the foreground.
//     messaging.onMessage((payload) => {
//         console.log('Message received in foreground.', payload);
//         // Display a custom, non-native notification inside the app.
//         showInAppNotification(payload.notification.title, payload.notification.body);
//         // You might want to refresh the inbox list here as well.
//         if (window.loadMessages) {
//             window.loadMessages();
//         }
//     });

//     // Update the "Enable Notifications" button based on the current permission status.
//     updateNotificationButton();
// }

// // This function requests permission from the user to show notifications.
// function requestNotificationPermission() {
//     console.log('Requesting notification permission...');
//     const messaging = firebase.messaging();
    
//     Notification.requestPermission().then((permission) => {
//         if (permission === 'granted') {
//             console.log('Notification permission granted.');
//             // If permission is granted, get the unique token for this device.
//             // The VAPID key is a public key that authenticates your app server to the push service.
//             return messaging.getToken({ vapidKey: 'BIo5H8RFOvDaR5lkDeOK3xZn8ibNeud_eSUH-8vX_mTvFYsbw0rul-LVfGeXfIXSjPK0cUUPfVZuqxD5DwyOVcM' });
//         } else {
//             console.log('Unable to get permission to notify.');
//             alert('Notification permission was denied. You can change this in your browser settings.');
//         }
//     }).then(token => {
//         if (token) {
//             console.log('FCM Token:', token);
//             // Save the token to the user's profile in Firestore.
//             saveTokenToFirestore(token);
//         }
//     }).catch((err) => {
//         console.log('An error occurred while retrieving token. ', err);
//         alert('An error occurred while enabling notifications.');
//     });
// }

// // Saves the given FCM token to the currently logged-in user's document in Firestore.
// function saveTokenToFirestore(token) {
//     const auth = firebase.auth();
//     const db = firebase.firestore();

//     const user = auth.currentUser;
//     if (user) {
//         db.collection('users').doc(user.uid).update({
//             fcmToken: token,
//             notificationsEnabled: true // A flag to indicate the user has enabled notifications.
//         }).then(() => {
//             console.log('Token saved to Firestore successfully.');
//             alert('Notifications have been enabled successfully!');
//             updateNotificationButton();
//         }).catch(error => {
//             console.error('Error saving token to Firestore: ', error);
//         });
//     } else {
//         console.log("No user is signed in to save the token.");
//     }
// }

// // Updates the UI of the notification button based on the permission status.
// function updateNotificationButton() {
//      const enableButton = document.getElementById('enableNotifications');
//      if (!enableButton) return;

//      if (Notification.permission === 'granted') {
//          enableButton.textContent = 'Notifications Enabled';
//          enableButton.disabled = true;
//          enableButton.style.cursor = 'default';
//          enableButton.style.backgroundColor = '#28a745'; // Green
//      } else if (Notification.permission === 'denied') {
//          enableButton.textContent = 'Notifications Blocked';
//          enableButton.disabled = true;
//          enableButton.style.cursor = 'default';
//          enableButton.style.backgroundColor = '#dc3545'; // Red
//      } else {
//         enableButton.textContent = 'Enable Notifications';
//         enableButton.disabled = false;
//         enableButton.style.backgroundColor = '#007bff'; // Blue
//      }
// }

// // Displays a simple, temporary notification within the app window.
// function showInAppNotification(title, body) {
//     const notification = document.createElement('div');
//     notification.className = 'in-app-notification';
//     notification.innerHTML = `
//         <h4><i class="fas fa-bell"></i> ${title}</h4>
//         <p>${body}</p>
//     `;
    
//     // Basic styling for the notification pop-up
//     notification.style.position = 'fixed';
//     notification.style.top = '20px';
//     notification.style.right = '20px';
//     notification.style.backgroundColor = 'white';
//     notification.style.padding = '15px';
//     notification.style.borderRadius = '8px';
//     notification.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
//     notification.style.zIndex = '10000';
//     notification.style.borderLeft = '5px solid #3b82f6';
//     notification.style.maxWidth = '300px';
    
//     document.body.appendChild(notification);
    
//     // Automatically remove the notification after 5 seconds.
//     setTimeout(() => {
//         notification.style.opacity = '0';
//         notification.style.transition = 'opacity 0.5s ease';
//         setTimeout(() => notification.remove(), 500);
//     }, 5000);
// }

// // Initialize everything when the page content is loaded.
// document.addEventListener('DOMContentLoaded', () => {
//     const enableButton = document.getElementById('enableNotifications');
//     if (enableButton) {
//         enableButton.addEventListener('click', requestNotificationPermission);
//     }
    
//     // We need to make sure Firebase is initialized before we try to use it.
//     const checkFirebase = setInterval(() => {
//         if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
//             clearInterval(checkFirebase);
//             setupFirebaseMessaging();
//         }
//     }, 100);
// });



// assets/notificationinbox.js
document.addEventListener('DOMContentLoaded', () => {
  if (!('Notification' in window)) return;

  const messaging = firebase.messaging();
  const auth = firebase.auth();
  const db = firebase.firestore();

  // Register service worker
  navigator.serviceWorker.register('/firebase-messaging-sw.js')
    .then(reg => {
      messaging.useServiceWorker(reg);
    });

  // Button in inbox.html
  const enableBtn = document.getElementById('enableNotifications');
  if (enableBtn) {
    enableBtn.addEventListener('click', async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          alert('Notifications denied');
          return;
        }

        const token = await messaging.getToken({
          vapidKey: 'YOUR_PUBLIC_VAPID_KEY'
        });

        const user = auth.currentUser;
        if (user) {
          await db.collection('users').doc(user.uid).update({
            fcmToken: token,
            notificationsEnabled: true
          });
          alert('✅ Notifications enabled');
        }
      } catch (err) {
        console.error('Notification setup error:', err);
      }
    });
  }

  // Foreground messages
  messaging.onMessage(payload => {
    const { title, body } = payload.notification;
    new Notification(title, { body, icon: '/favicon.ico' });
  });
});
