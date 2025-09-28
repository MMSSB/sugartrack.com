// Custom Alert System
let alertResolve;

function showAlert(message) {
  const alert = document.getElementById('customAlert');
  const alertMessage = document.getElementById('customAlertMessage');
  
  alertMessage.textContent = message;
  alert.classList.add('active');
  
  return new Promise((resolve) => {
    alertResolve = resolve;
  });
}

// Setup alert buttons
document.getElementById('customAlertCancel').addEventListener('click', () => {
  document.getElementById('customAlert').classList.remove('active');
  alertResolve(false);
});

document.getElementById('customAlertConfirm').addEventListener('click', () => {
  document.getElementById('customAlert').classList.remove('active');
  alertResolve(true);
});

// Notification System
function showNotification(message, type = 'success') {
  const notification = document.getElementById('notification');
  const messageElement = document.getElementById('notification-message');
  
  messageElement.textContent = message;
  notification.className = `notification ${type}`;
  notification.classList.remove('hidden');
  
  setTimeout(() => {
    notification.classList.add('hidden');
  }, 3000);
}

// Make functions available globally
window.showAlert = showAlert;
window.showNotification = showNotification;