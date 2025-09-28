class ChatHistoryManager {
    constructor(userId) {
        this.userId = userId;
        this.currentConversationId = this.generateConversationId();
        this.conversations = [];
    }

    generateConversationId() {
        return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    async loadConversations() {
        try {
            const snapshot = await db.collection('aiConversations')
                .where('userId', '==', this.userId)
                .orderBy('lastUpdated', 'desc')
                .get();
            
            this.conversations = [];
            snapshot.forEach(doc => {
                this.conversations.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            
            this.renderConversationList();
        } catch (error) {
            console.error('Error loading conversations:', error);
        }
    }

    async saveMessage(role, content) {
        try {
            const timestamp = new Date();
            
            // Save to current conversation
            await db.collection('aiConversations').doc(this.currentConversationId).set({
                userId: this.userId,
                title: this.generateConversationTitle(content),
                messages: firebase.firestore.FieldValue.arrayUnion({
                    role,
                    content,
                    timestamp
                }),
                lastUpdated: timestamp
            }, { merge: true });
            
            // Reload conversations to update the list
            this.loadConversations();
        } catch (error) {
            console.error('Error saving message:', error);
        }
    }

    generateConversationTitle(content) {
        // Extract first few words as title
        const words = content.split(' ');
        return words.slice(0, 5).join(' ') + (words.length > 5 ? '...' : '');
    }

    async loadConversation(conversationId) {
        try {
            const doc = await db.collection('aiConversations').doc(conversationId).get();
            if (doc.exists) {
                this.currentConversationId = conversationId;
                return doc.data().messages;
            }
            return [];
        } catch (error) {
            console.error('Error loading conversation:', error);
            return [];
        }
    }

    async deleteConversation(conversationId) {
        try {
            await db.collection('aiConversations').doc(conversationId).delete();
            this.loadConversations();
            
            // If we deleted the current conversation, create a new one
            if (conversationId === this.currentConversationId) {
                this.currentConversationId = this.generateConversationId();
                document.getElementById('aiChatMessages').innerHTML = '';
                this.addWelcomeMessage();
            }
        } catch (error) {
            console.error('Error deleting conversation:', error);
        }
    }

    renderConversationList() {
        const historyList = document.getElementById('chatHistoryList');
        if (!historyList) return;
        
        historyList.innerHTML = '';
        
        this.conversations.forEach(conversation => {
            const listItem = document.createElement('div');
            listItem.className = `chat-history-item ${conversation.id === this.currentConversationId ? 'active' : ''}`;
            
            const preview = conversation.messages && conversation.messages.length > 0 
                ? conversation.messages[0].content 
                : 'Empty conversation';
            
            listItem.innerHTML = `
                <div class="chat-history-item-content">
                    <div class="chat-history-preview" title="${preview}">${preview}</div>
                    <div class="chat-history-date">${this.formatDate(conversation.lastUpdated?.toDate())}</div>
                </div>
                <div class="chat-history-actions">
                    <button class="chat-history-delete" data-id="${conversation.id}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            `;
            
            listItem.addEventListener('click', (e) => {
                if (!e.target.closest('.chat-history-delete')) {
                    this.loadConversationIntoChat(conversation.id);
                }
            });
            
            const deleteBtn = listItem.querySelector('.chat-history-delete');
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteConversation(conversation.id);
            });
            
            historyList.appendChild(listItem);
        });
    }

    formatDate(date) {
        if (!date) return '';
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    }

    async loadConversationIntoChat(conversationId) {
        const messages = await this.loadConversation(conversationId);
        const chatMessages = document.getElementById('aiChatMessages');
        
        chatMessages.innerHTML = '';
        
        if (messages.length === 0) {
            this.addWelcomeMessage();
            return;
        }
        
        messages.forEach(message => {
            this.addMessageToUI(message.content, message.role);
        });
        
        chatMessages.scrollTop = chatMessages.scrollHeight;
        this.loadConversations(); // Refresh list to highlight active conversation
    }

    addWelcomeMessage() {
        const chatMessages = document.getElementById('aiChatMessages');
        chatMessages.innerHTML = `
            <div class="message bot">
                <div class="message-avatar">
                    <div class="robot-avatar">
                        <div class="eye"></div>
                        <div class="eye"></div>
                    </div>
                </div>
                <div class="message-bubble">
                    <div class="message-content">Hi there! I'm STAi, your diabetes assistant. I can help you analyze your glucose data and answer questions about diabetes management. How can I help you today?</div>
                    <div class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                </div>
            </div>
        `;
    }

    addMessageToUI(content, role) {
        const chatMessages = document.getElementById('aiChatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}`;
        
        if (role === 'bot') {
            messageDiv.innerHTML = `
                <div class="message-avatar">
                    <div class="robot-avatar">
                        <div class="eye"></div>
                        <div class="eye"></div>
                    </div>
                </div>
                <div class="message-bubble">
                    <div class="message-content">${this.escapeHtml(content)}</div>
                    <div class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="message-avatar">
                    <img src="images/user.png" alt="User">
                </div>
                <div class="message-bubble">
                    <div class="message-content">${this.escapeHtml(content)}</div>
                    <div class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                </div>
            `;
        }
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}