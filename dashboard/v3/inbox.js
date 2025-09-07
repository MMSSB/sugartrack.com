// inbox.js
document.addEventListener('DOMContentLoaded', function() {
    // Wait for Firebase to be initialized
    if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
        initializeInbox();
    } else {
        // If Firebase isn't loaded yet, wait for it
        const checkFirebase = setInterval(() => {
            if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
                clearInterval(checkFirebase);
                initializeInbox();
            }
        }, 100);
    }
});

function initializeInbox() {
    const auth = firebase.auth();
    const db = firebase.firestore();
    
    let currentUser = null;
    let currentMessages = [];
    
    // Check if user is authenticated
    auth.onAuthStateChanged(user => {
        if (user) {
            currentUser = user;
            loadMessages();
        } else {
            document.getElementById('messagesContainer').innerHTML = 
                '<div class="alert alert-error">Please sign in to view your messages</div>';
        }
    });
    
    // Set up event listeners
    document.getElementById('refreshInbox').addEventListener('click', loadMessages);
    document.getElementById('markAllRead').addEventListener('click', markAllAsRead);
    
    // Modal event listeners
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    document.getElementById('markAsReadBtn').addEventListener('click', function() {
        const messageId = this.dataset.messageId;
        if (messageId) {
            markMessageAsRead(messageId);
        }
    });
    
    // Close modal when clicking outside
    document.getElementById('messageModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
    
    // Load user messages
    function loadMessages() {
        if (!currentUser) return;
        
        const messagesContainer = document.getElementById('messagesContainer');
        const noMessages = document.getElementById('noMessages');
        
        messagesContainer.innerHTML = '<div class="loading-messages"><i class="fas fa-spinner fa-spin"></i> Loading messages...</div>';
        noMessages.style.display = 'none';
        
        db.collection('users').doc(currentUser.uid).collection('inbox')
            .orderBy('timestamp', 'desc')
            .get()
            .then(snapshot => {
                messagesContainer.innerHTML = '';
                currentMessages = [];
                
                if (snapshot.empty) {
                    noMessages.style.display = 'block';
                    return;
                }
                
                snapshot.forEach(doc => {
                    const message = {
                        id: doc.id,
                        ...doc.data()
                    };
                    currentMessages.push(message);
                    
                    // Convert Firestore timestamp to Date if needed
                    if (message.timestamp && message.timestamp.toDate) {
                        message.timestamp = message.timestamp.toDate();
                    }
                    
                    const messageElement = createMessageElement(message);
                    messagesContainer.appendChild(messageElement);
                });
            })
            .catch(error => {
                console.error('Error loading messages:', error);
                messagesContainer.innerHTML = '<div class="alert alert-error">Error loading messages: ' + error.message + '</div>';
            });
    }
    
    function createMessageElement(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message-item ${message.read ? '' : 'unread'}`;
        messageDiv.dataset.messageId = message.id;
        
        const dateString = message.timestamp ? formatDate(message.timestamp) : 'Unknown date';
        
        messageDiv.innerHTML = `
            ${!message.read ? '<div class="unread-indicator"></div>' : ''}
            <div class="message-header">
                <h4 class="message-subject">${escapeHtml(message.subject || 'No subject')}</h4>
                <span class="message-date">${dateString}</span>
            </div>
            <p class="message-preview">${escapeHtml(truncateText(message.body || '', 120))}</p>
        `;
        
        messageDiv.addEventListener('click', () => {
            openMessageModal(message);
            
            // Mark as read when opened if not already read
            if (!message.read) {
                markMessageAsRead(message.id);
            }
        });
        
        return messageDiv;
    }
    
    function openMessageModal(message) {
        const modal = document.getElementById('messageModal');
        const subjectEl = document.getElementById('modalSubject');
        const senderEl = document.getElementById('modalSender');
        const dateEl = document.getElementById('modalDate');
        const priorityEl = document.getElementById('modalPriority');
        const bodyEl = document.getElementById('modalBody');
        const markAsReadBtn = document.getElementById('markAsReadBtn');
        
        // Set message content
        subjectEl.textContent = message.subject || 'No subject';
        senderEl.textContent = `From: SugarTrack`;
        // senderEl.textContent = `From: ${message.senderEmail || 'System'}`;
        dateEl.textContent = `Date: ${formatDate(message.timestamp)}`;
        
        // Set priority badge
        priorityEl.textContent = message.priority || 'normal';
        priorityEl.className = 'priority-badge priority-' + (message.priority || 'normal');
        
        // Set message body
        bodyEl.textContent = message.body || 'No content';
        
        // Set up mark as read button
        markAsReadBtn.dataset.messageId = message.id;
        markAsReadBtn.style.display = message.read ? 'none' : 'block';
        
        // Show modal
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
    
    function closeModal() {
        document.getElementById('messageModal').style.display = 'none';
        document.body.style.overflow = ''; // Re-enable scrolling
    }
    
    function markMessageAsRead(messageId) {
        if (!currentUser) return;
        
        db.collection('users').doc(currentUser.uid).collection('inbox').doc(messageId)
            .update({
                read: true,
                readAt: firebase.firestore.FieldValue.serverTimestamp()
            })
            .then(() => {
                // Update UI
                const messageElement = document.querySelector(`.message-item[data-message-id="${messageId}"]`);
                if (messageElement) {
                    messageElement.classList.remove('unread');
                    const indicator = messageElement.querySelector('.unread-indicator');
                    if (indicator) indicator.remove();
                }
                
                // Hide mark as read button in modal
                document.getElementById('markAsReadBtn').style.display = 'none';
                
                // Update the message in our local array
                const messageIndex = currentMessages.findIndex(m => m.id === messageId);
                if (messageIndex !== -1) {
                    currentMessages[messageIndex].read = true;
                }
            })
            .catch(error => {
                console.error('Error marking message as read:', error);
                alert('Error marking message as read: ' + error.message);
            });
    }
    
    function markAllAsRead() {
        if (!currentUser || currentMessages.length === 0) return;
        
        const batch = db.batch();
        const unreadMessages = currentMessages.filter(m => !m.read);
        
        if (unreadMessages.length === 0) {
            alert('All messages are already marked as read');
            return;
        }
        
        unreadMessages.forEach(message => {
            const messageRef = db.collection('users').doc(currentUser.uid).collection('inbox').doc(message.id);
            batch.update(messageRef, {
                read: true,
                readAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        });
        
        batch.commit()
            .then(() => {
                // Update UI
                document.querySelectorAll('.message-item.unread').forEach(item => {
                    item.classList.remove('unread');
                    const indicator = item.querySelector('.unread-indicator');
                    if (indicator) indicator.remove();
                });
                
                // Update local messages array
                currentMessages.forEach(m => { m.read = true; });
                
                alert(`Marked ${unreadMessages.length} messages as read`);
            })
            .catch(error => {
                console.error('Error marking all messages as read:', error);
                alert('Error marking messages as read: ' + error.message);
            });
    }
    
    // Utility functions
    function formatDate(date) {
        if (!date) return 'Unknown date';
        
        if (typeof date === 'string') {
            date = new Date(date);
        }
        
        // Format as: "MMM DD, YYYY at HH:MM"
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    function truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }
    
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}