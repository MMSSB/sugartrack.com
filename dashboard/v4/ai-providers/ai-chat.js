document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    let aiProvider = null;
    let chatHistory = null;
    let currentUser = null;
    
    // DOM Elements
    const aiQuestionInput = document.getElementById('aiQuestionInput');
    const askAiButton = document.getElementById('askAiButton');
    const aiChatMessages = document.getElementById('aiChatMessages');
    const aiProviderSelect = document.getElementById('aiProviderSelect');
    const aiStatus = document.getElementById('aiStatus');
    const toggleHistoryBtn = document.getElementById('toggleHistory');
    const historySidebar = document.getElementById('chatHistorySidebar');
    const closeHistoryBtn = document.getElementById('closeHistory');
    
    // Initialize the app
    async function initApp() {
        // Wait for Firebase auth
        await waitForAuth();
        
        currentUser = firebase.auth().currentUser;
        if (!currentUser) {
            console.error('No user logged in');
            return;
        }
        
        // Initialize chat history
        chatHistory = new ChatHistoryManager(currentUser.uid);
        await chatHistory.loadConversations();
        
        // Initialize AI provider
        initAIProvider();
        
        // Set up event listeners
        setupEventListeners();
        
        // Set current time
        document.getElementById('currentTime').textContent = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }
    
    function waitForAuth() {
        return new Promise((resolve) => {
            if (firebase.auth().currentUser) {
                resolve();
            } else {
                const unsubscribe = firebase.auth().onAuthStateChanged(user => {
                    unsubscribe();
                    resolve();
                });
            }
        });
    }
    
    function initAIProvider() {
        const provider = aiProviderSelect.value;
        AI_CONFIG.currentProvider = provider;
        
        switch(provider) {
            case 'gemini':
                aiProvider = new GeminiProvider(AI_CONFIG.gemini.apiKey, AI_CONFIG.gemini.model);
                break;
            case 'openai':
                aiProvider = new OpenAIProvider(AI_CONFIG.openai.apiKey, AI_CONFIG.openai.model);
                break;
            case 'ollama':
                aiProvider = new OllamaProvider(AI_CONFIG.ollama.baseUrl, AI_CONFIG.ollama.model);
                break;
            default:
                aiProvider = new GeminiProvider(AI_CONFIG.gemini.apiKey, AI_CONFIG.gemini.model);
        }
        
        updateProviderStatus();
    }
    
    function updateProviderStatus() {
        const provider = aiProviderSelect.value;
        let status = 'Online';
        
        switch(provider) {
            case 'gemini':
                status = AI_CONFIG.gemini.apiKey && AI_CONFIG.gemini.apiKey !== 'your-gemini-api-key-here' 
                    ? 'Online' : 'API Key Required';
                break;
            case 'openai':
                status = AI_CONFIG.openai.apiKey && AI_CONFIG.openai.apiKey !== 'your-openai-api-key-here' 
                    ? 'Online' : 'API Key Required';
                break;
            case 'ollama':
                status = 'Local Connection';
                break;
        }
        
        aiStatus.textContent = status;
    }
    
    function setupEventListeners() {
        // Ask AI button
        askAiButton.addEventListener('click', handleAskAI);
        
        // Enter key in input
        aiQuestionInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAskAI();
            }
        });
        
        // Auto-resize textarea
        aiQuestionInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
        
        // Provider selection change
        aiProviderSelect.addEventListener('change', initAIProvider);
        
        // Toggle history sidebar
        toggleHistoryBtn.addEventListener('click', function() {
            historySidebar.classList.toggle('open');
        });
        
        // Close history sidebar
        closeHistoryBtn.addEventListener('click', function() {
            historySidebar.classList.remove('open');
        });
    }
    
    async function handleAskAI() {
        const question = aiQuestionInput.value.trim();
        if (!question) return;
        
        // Clear input and reset height
        aiQuestionInput.value = '';
        aiQuestionInput.style.height = 'auto';
        
        // Add user message to UI
        chatHistory.addMessageToUI(question, 'user');
        
        // Save user message to history
        await chatHistory.saveMessage('user', question);
        
        // Show typing indicator
        showTypingIndicator();
        
        try {
            // Get user data for context
            const userData = await getUserData();
            const glucoseData = await getGlucoseData();
            
            // Prepare the prompt with context
            const contextPrompt = buildContextPrompt(question, userData, glucoseData);
            
            // Get AI response
            const response = await aiProvider.generateResponse(contextPrompt);
            
            // Remove typing indicator
            removeTypingIndicator();
            
            // Add AI response to UI
            chatHistory.addMessageToUI(response, 'bot');
            
            // Save AI response to history
            await chatHistory.saveMessage('bot', response);
            
        } catch (error) {
            // Remove typing indicator
            removeTypingIndicator();
            
            // Show error message
            chatHistory.addMessageToUI(`Sorry, I encountered an error: ${error.message}. Please try again.`, 'bot');
            console.error('AI Error:', error);
        }
    }
    
    function showTypingIndicator() {
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        typingIndicator.id = 'typingIndicator';
        typingIndicator.innerHTML = `
            <div class="message-avatar">
                <div class="robot-avatar">
                    <div class="eye"></div>
                    <div class="eye"></div>
                </div>
            </div>
            <div class="typing-dots">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        aiChatMessages.appendChild(typingIndicator);
        aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
    }
    
    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    async function getUserData() {
        try {
            const userDoc = await db.collection('users').doc(currentUser.uid).get();
            return userDoc.exists ? userDoc.data() : null;
        } catch (error) {
            console.error('Error getting user data:', error);
            return null;
        }
    }
    
    async function getGlucoseData() {
        try {
            const today = new Date();
            const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            
            const snapshot = await db.collection('glucoseReadings')
                .where('userId', '==', currentUser.uid)
                .where('timestamp', '>=', sevenDaysAgo)
                .orderBy('timestamp', 'asc')
                .get();
            
            const readings = [];
            snapshot.forEach(doc => {
                readings.push(doc.data());
            });
            
            return readings;
        } catch (error) {
            console.error('Error getting glucose data:', error);
            return [];
        }
    }
    
    function buildContextPrompt(question, userData, glucoseData) {
        let prompt = AI_CONFIG.SYSTEM_PROMPT + '\n\n';
        
        // Add user context if available
        if (userData) {
            prompt += `User Information:
- Name: ${userData.name || 'Not provided'}
- Age: ${userData.age || 'Not provided'}
- Diabetes Type: ${userData.diabetesType || 'Not provided'}
- Medications: ${userData.medications ? userData.medications.join(', ') : 'Not provided'}\n\n`;
        }
        
        // Add glucose data context if available
        if (glucoseData && glucoseData.length > 0) {
            prompt += `Recent Glucose Readings (last 7 days):\n`;
            
            glucoseData.forEach(reading => {
                const date = reading.timestamp.toDate ? reading.timestamp.toDate() : new Date(reading.timestamp);
                prompt += `- ${date.toLocaleDateString()}: ${reading.value} mg/dL (${reading.mealTime || 'No meal context'})\n`;
            });
            
            prompt += '\n';
        }
        
        prompt += `Current Question: ${question}`;
        
        return prompt;
    }
    
    // Initialize the app
    initApp();
});