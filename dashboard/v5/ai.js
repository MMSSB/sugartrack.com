// // ai.js - Super Modern STAi Assistant
// import { auth, db } from "./firebase-init.js";
// import { collection, query, where, orderBy, onSnapshot, doc, getDoc, limit } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// document.addEventListener('DOMContentLoaded', () => {
    
//     // --- DOM Elements ---
//     const chatMessages = document.getElementById('chatMessages');
//     const aiInput = document.getElementById('aiInput');
//     const aiSendBtn = document.getElementById('aiSendBtn');
    
//     // --- State Variables ---
//     let currentUser = null;
//     let userName = "User";
//     let userAvatarSrc = "images/userblue.png";
//     let latestReadingsData = []; 
//     let isProcessing = false;

//     // --- 1. Auth & Data Initialization ---
//     auth.onAuthStateChanged(async (user) => {
//         if (user) {
//             currentUser = user;
//             loadUserProfile(user.uid);
//             subscribeToGlucoseData(user.uid);
//         } else {
//             window.location.href = 'login.html';
//         }
//     });

//     async function loadUserProfile(uid) {
//         try {
//             const userSnap = await getDoc(doc(db, "users", uid));
//             if (userSnap.exists()) {
//                 const data = userSnap.data();
//                 userName = data.firstName || "User";
//                 userAvatarSrc = data.profileImage || "images/userblue.png";
//             }
//         } catch (error) {
//             console.error("Failed to load user profile:", error);
//         }
//     }

//     function subscribeToGlucoseData(uid) {
//         const q = query(
//             collection(db, "readings"), 
//             where("userId", "==", uid),
//             orderBy("timestamp", "desc"),
//             limit(7)
//         );

//         onSnapshot(q, (snapshot) => {
//             latestReadingsData = [];
//             snapshot.forEach(doc => {
//                 const r = doc.data();
//                 latestReadingsData.push({
//                     glucose: r.glucose,
//                     context: r.context || "Manual",
//                     time: r.time,
//                     date: r.date
//                 });
//             });
//         });
//     }

//     // --- 2. Event Listeners ---
//     aiInput.addEventListener('input', () => {
//         aiSendBtn.disabled = aiInput.value.trim() === '' || isProcessing;
//     });

//     aiInput.addEventListener('keypress', (e) => {
//         if (e.key === 'Enter' && !aiSendBtn.disabled) handleSend();
//     });

//     aiSendBtn.addEventListener('click', () => {
//         if (!aiSendBtn.disabled) handleSend();
//     });

//     // --- 3. Core Chat Logic ---
//     async function handleSend() {
//         const queryText = aiInput.value.trim();
//         if (!queryText) return;

//         // Add User Message
//         appendMessage(queryText, 'user');
//         aiInput.value = '';
//         aiSendBtn.disabled = true;
//         isProcessing = true;

//         // Add Typing Loader
//         const typingId = appendTypingIndicator();
//         scrollToBottom();

//         try {
//             const prompt = constructPrompt(queryText);
//             const response = await puter.ai.chat(prompt);
//             const answer = response?.message?.content || "I'm sorry, I couldn't process that right now.";

//             removeTypingIndicator(typingId);
//             appendMessage(answer, 'bot');

//         } catch (error) {
//             console.error("STAi Error:", error);
//             removeTypingIndicator(typingId);
//             appendMessage("I'm having trouble connecting to my servers right now. Please try again in a moment.", 'bot');
//         } finally {
//             isProcessing = false;
//             aiSendBtn.disabled = aiInput.value.trim() === '';
//             scrollToBottom();
//         }
//     }

//     // --- 4. System Prompt Generation ---
//     function constructPrompt(userQuestion) {
//         let dataString = "No recent data available.";
//         if (latestReadingsData.length > 0) {
//             const latest = latestReadingsData[0];
//             dataString = `Most Recent: ${latest.glucose} mg/dL (Context: ${latest.context} on ${latest.date} at ${latest.time}).\n`;
//             dataString += `Previous recent readings: ${latestReadingsData.slice(1).map(r => r.glucose + " mg/dL").join(", ")}`;
//         }

//         const isArabic = /[\u0600-\u06FF]/.test(userQuestion);
//         const languageRule = isArabic ? "Respond in Arabic using friendly Arabic emojis." : "Respond in English.";

//         return `
//             You are STAi, a friendly, empathetic, and human-like diabetes assistant built into the SugarTrack app.
            
//             RULES:
//             1. ${languageRule}
//             2. Be conversational, warm, and concise. Use emojis naturally.
//             3. If the user asks about their recent data or how they are doing, use the "USER DATA CONTEXT" below to answer them. 
//             4. If they just say "hi" or ask a general question, ignore the data and just chat normally.
//             5. MEDICAL DISCLAIMER: If you provide medical advice or drug information, always end with a short italicized sentence: "*I am an AI assistant, please verify with your healthcare provider.*"
//             6. Format your response in Markdown (use **bold** for numbers and bullet points for lists).

//             USER DATA CONTEXT:
//             User Name: ${userName}
//             ${dataString}

//             USER QUESTION: 
//             "${userQuestion}"
//         `;
//     }

//     // --- 5. UI Helpers ---
//     function appendMessage(text, sender) {
//         const row = document.createElement('div');
//         row.className = `chat-bubble-row ${sender}`;

//         let avatarHTML = '';
//         if (sender === 'bot') {
//             // Injecting the Blinking Robot!
//             avatarHTML = `
//                 <div class="chat-avatar">
//                     <div class="robot-avatar">
//                         <div class="eye"></div>
//                         <div class="eye"></div>
//                     </div>
//                 </div>`;
//         } else {
//             avatarHTML = `<div class="chat-avatar user-avatar"><img src="${userAvatarSrc}" alt="User"></div>`;
//         }

//         const contentHTML = sender === 'bot' && typeof marked !== 'undefined' 
//             ? marked.parse(text) 
//             : text.replace(/</g, "&lt;").replace(/>/g, "&gt;");

//         row.innerHTML = `
//             ${avatarHTML}
//             <div class="chat-bubble ${sender}-bubble">
//                 ${sender === 'user' ? `<p>${contentHTML}</p>` : contentHTML}
//             </div>
//         `;

//         chatMessages.appendChild(row);
//         scrollToBottom();
//     }

//     function appendTypingIndicator() {
//         const id = 'typing-' + Date.now();
//         const row = document.createElement('div');
//         row.className = 'chat-bubble-row bot';
//         row.id = id;
        
//         // Injecting the Robot AND the Animated Letters!
//         row.innerHTML = `
//             <div class="chat-avatar">
//                 <div class="robot-avatar">
//                     <div class="eye"></div>
//                     <div class="eye"></div>
//                 </div>
//             </div>
//             <div class="chat-bubble bot-bubble" style="padding: 10px 16px;">
//                 <div class="loader-wrapper">
//                     <span class="loader-letter">T</span>
//                     <span class="loader-letter">y</span>
//                     <span class="loader-letter">p</span>
//                     <span class="loader-letter">i</span>
//                     <span class="loader-letter">n</span>
//                     <span class="loader-letter">g</span>
//                     <div class="loader"></div>
//                 </div>
//             </div>
//         `;
//         chatMessages.appendChild(row);
//         return id;
//     }

//     function removeTypingIndicator(id) {
//         const el = document.getElementById(id);
//         if (el) el.remove();
//     }

//     function scrollToBottom() {
//         chatMessages.scrollTo({
//             top: chatMessages.scrollHeight,
//             behavior: 'smooth'
//         });
//     }
// });



















// // ai.js - Square AI Style Assistant (Firebase Cloud History Edition)
// import { auth, db } from "./firebase-init.js";
// import { collection, query, where, orderBy, onSnapshot, doc, getDoc, limit, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// document.addEventListener('DOMContentLoaded', () => {
    
//     // --- DOM Elements ---
//     const chatMessages = document.getElementById('chatMessages');
//     const emptyStateHero = document.getElementById('emptyStateHero');
//     const aiInput = document.getElementById('aiInput');
//     const aiSendBtn = document.getElementById('aiSendBtn');
//     const quickPrompts = document.querySelectorAll('.quick-prompt-btn');
    
//     // Sidebar History
//     const chatHistoryList = document.getElementById('chatHistoryList');
//     const newChatBtn = document.getElementById('newChatBtn');

//     // Model Selector
//     const modelSelector = document.getElementById('modelSelector');
//     const currentModelDisplay = document.getElementById('currentModelDisplay');
//     const modelDropdown = document.getElementById('modelDropdown');
//     const modelOptions = document.querySelectorAll('.model-option');

//     // Context Toggle
//     const contextToggle = document.getElementById('contextToggle');

//     // --- State Variables ---
//     let currentUser = null;
//     let userName = "User";
//     let userAvatarSrc = "images/userblue.png";
//     let latestReadingsData = []; 
//     let isProcessing = false;
//     let useHealthContext = true;
    
//     // Cloud Chat History State
//     let currentChatId = Date.now().toString();
//     let currentChatMessages = []; 
//     let allChats = {}; // Loaded entirely from Firebase now

//     let currentModel = 'fast'; 

//     // ==========================================
//     // 1. Initialization & Firebase Data
//     // ==========================================
//     auth.onAuthStateChanged(async (user) => {
//         if (user) {
//             currentUser = user;
//             loadUserProfile(user.uid);
//             subscribeToGlucoseData(user.uid);
            
//             // Start listening to Cloud Chat History
//             subscribeToChatHistory(user.uid);
//         } else {
//             window.location.href = 'login.html';
//         }
//     });

//     async function loadUserProfile(uid) {
//         try {
//             const userSnap = await getDoc(doc(db, "users", uid));
//             if (userSnap.exists()) {
//                 const data = userSnap.data();
//                 userName = data.firstName || "User";
//                 userAvatarSrc = data.profileImage || "images/userblue.png";
//             }
//         } catch (error) { console.error(error); }
//     }

//     function subscribeToGlucoseData(uid) {
//         const q = query(collection(db, "readings"), where("userId", "==", uid), orderBy("timestamp", "desc"), limit(10));
//         onSnapshot(q, (snapshot) => {
//             latestReadingsData = [];
//             snapshot.forEach(doc => {
//                 const r = doc.data();
//                 latestReadingsData.push({ glucose: r.glucose, context: r.context || "Manual", time: r.time, date: r.date });
//             });
//         });
//     }

//     // REAL-TIME CLOUD HISTORY SYNC
//     function subscribeToChatHistory(uid) {
//         const chatRef = collection(db, "users", uid, "chatai");
//         onSnapshot(chatRef, (snapshot) => {
//             const loadedChats = {};
//             snapshot.forEach(docSnap => {
//                 loadedChats[docSnap.id] = docSnap.data();
//             });
//             allChats = loadedChats;
//             renderSidebarHistory();
//         }, (error) => {
//             console.error("Error loading chat history from cloud:", error);
//         });
//     }

//     // ==========================================
//     // 2. UI Event Listeners
//     // ==========================================
    
//     aiInput.addEventListener('input', function() {
//         this.style.height = 'auto';
//         this.style.height = (this.scrollHeight) + 'px';
//         if(this.value.trim() === '') this.style.height = 'auto';
//         aiSendBtn.disabled = this.value.trim() === '' || isProcessing;
//     });

//     aiInput.addEventListener('keydown', (e) => {
//         if (e.key === 'Enter' && !e.shiftKey) {
//             e.preventDefault();
//             if (!aiSendBtn.disabled) handleSend();
//         }
//     });

//     aiSendBtn.addEventListener('click', () => {
//         if (!aiSendBtn.disabled) handleSend();
//     });

//     quickPrompts.forEach(btn => {
//         btn.addEventListener('click', () => {
//             aiInput.value = btn.innerText;
//             aiInput.style.height = 'auto';
//             aiSendBtn.disabled = false;
//             handleSend();
//         });
//     });

//     contextToggle.addEventListener('click', () => {
//         useHealthContext = !useHealthContext;
//         contextToggle.classList.toggle('active', useHealthContext);
//     });

//     currentModelDisplay.addEventListener('click', (e) => {
//         e.stopPropagation();
//         modelDropdown.classList.toggle('show');
//     });

//     document.addEventListener('click', () => {
//         modelDropdown.classList.remove('show');
//     });

//     modelOptions.forEach(opt => {
//         opt.addEventListener('click', () => {
//             modelOptions.forEach(o => o.classList.remove('active'));
//             opt.classList.add('active');
//             currentModel = opt.dataset.model;
            
//             if(currentModel === 'fast') {
//                 currentModelDisplay.innerHTML = `STAi Fast <i class="ph ph-caret-down"></i>`;
//             } else {
//                 currentModelDisplay.innerHTML = `<i class="fa-solid fa-microscope" style="color:var(--info);"></i> STAi Analyzer <i class="ph ph-caret-down"></i>`;
//             }
//         });
//     });

//     newChatBtn.addEventListener('click', () => {
//         currentChatId = Date.now().toString(); // Generate unique new chat ID
//         currentChatMessages = [];
//         chatMessages.innerHTML = '';
//         chatMessages.classList.remove('active');
//         emptyStateHero.style.display = 'flex';
//         document.getElementById('quickPrompts').style.display = 'flex';
//         renderSidebarHistory();
//     });

//     // ==========================================
//     // 3. Core Chat Logic
//     // ==========================================
//     async function handleSend() {
//         const queryText = aiInput.value.trim();
//         if (!queryText) return;

//         if (currentChatMessages.length === 0) {
//             emptyStateHero.style.display = 'none';
//             document.getElementById('quickPrompts').style.display = 'none';
//             chatMessages.classList.add('active');
            
//             // Initialize chat packet before sending to Firebase
//             allChats[currentChatId] = {
//                 title: queryText.substring(0, 30) + (queryText.length > 30 ? '...' : ''),
//                 date: new Date().toISOString(),
//                 updatedAt: Date.now(),
//                 messages: []
//             };
//         }

//         appendMessageUI(queryText, 'user');
//         currentChatMessages.push({ role: 'user', content: queryText });
//         saveHistory(); 
        
//         aiInput.value = '';
//         aiInput.style.height = 'auto';
//         aiSendBtn.disabled = true;
//         isProcessing = true;

//         const typingId = appendTypingIndicator();

//         try {
//             const prompt = constructPrompt(queryText);
//             const response = await puter.ai.chat(prompt);
//             const answer = response?.message?.content || "I'm sorry, I couldn't process that right now.";

//             removeTypingIndicator(typingId);
//             appendMessageUI(answer, 'bot');
            
//             currentChatMessages.push({ role: 'bot', content: answer });
//             saveHistory(); 

//         } catch (error) {
//             console.error("STAi Error:", error);
//             removeTypingIndicator(typingId);
//             appendMessageUI("Network error: Unable to reach STAi servers.", 'bot');
//         } finally {
//             isProcessing = false;
//             aiSendBtn.disabled = aiInput.value.trim() === '';
//             scrollToBottom();
//             // renderSidebarHistory() is handled automatically by Firebase onSnapshot now!
//         }
//     }

//     function constructPrompt(userQuestion) {
//         let dataString = "Health context is disabled or unavailable.";
        
//         if (useHealthContext && latestReadingsData.length > 0) {
//             const latest = latestReadingsData[0];
//             dataString = `RECENT GLUCOSE DATA:\nMost Recent: ${latest.glucose} mg/dL (${latest.context} on ${latest.date} at ${latest.time}).\nPast 9 readings: ${latestReadingsData.slice(1).map(r => r.glucose).join(", ")}`;
//         }

//         let behavior = "You are STAi, a friendly and concise diabetes assistant. Keep answers brief, encouraging, and easy to read. Use bullet points.";
//         if (currentModel === 'analyzer') {
//             behavior = "You are STAi Analyzer, a clinical-grade data analysis AI. Provide deep, comprehensive, multi-paragraph analysis of the user's data. Look for trends, suggest scientific reasons for glucose spikes, and be highly detailed.";
//         }

//         return `
//             ${behavior}
//             RULES:
//             1. If asked about health, use the "RECENT GLUCOSE DATA" provided below.
//             2. Format strictly in Markdown.
//             3. Always end medical advice with: "*I am an AI. Verify with your doctor.*"

//             ${dataString}

//             USER QUESTION: "${userQuestion}"
//         `;
//     }

//     // ==========================================
//     // 4. Cloud History Management
//     // ==========================================
//     async function saveHistory() {
//         if(currentChatMessages.length > 0 && currentUser) {
//             // Update local memory
//             allChats[currentChatId].messages = currentChatMessages;
//             allChats[currentChatId].updatedAt = Date.now();
            
//             try {
//                 // Push directly to Firebase
//                 const chatDocRef = doc(db, "users", currentUser.uid, "chatai", currentChatId);
//                 await setDoc(chatDocRef, allChats[currentChatId], { merge: true });
//             } catch (error) {
//                 console.error("Firebase save error:", error);
//             }
//         }
//     }

//     function renderSidebarHistory() {
//         chatHistoryList.innerHTML = '';
        
//         // Sort by 'updatedAt' for accurate recent ordering
//         const sortedChats = Object.entries(allChats).sort((a, b) => {
//             const timeA = a[1].updatedAt || new Date(a[1].date).getTime();
//             const timeB = b[1].updatedAt || new Date(b[1].date).getTime();
//             return timeB - timeA;
//         });

//         sortedChats.forEach(([id, chat]) => {
//             const el = document.createElement('div');
//             el.className = `history-item ${id === currentChatId && currentChatMessages.length > 0 ? 'active' : ''}`;
//             el.innerHTML = `<i class="ph ph-chat-teardrop-text"></i> ${chat.title}`;
            
//             el.addEventListener('click', () => loadChat(id));
//             chatHistoryList.appendChild(el);
//         });
//     }

//     function loadChat(chatId) {
//         const chat = allChats[chatId];
//         if (!chat) return;

//         currentChatId = chatId;
//         currentChatMessages = chat.messages;
        
//         emptyStateHero.style.display = 'none';
//         document.getElementById('quickPrompts').style.display = 'none';
//         chatMessages.classList.add('active');
//         chatMessages.innerHTML = '';

//         currentChatMessages.forEach(msg => {
//             appendMessageUI(msg.content, msg.role);
//         });

//         renderSidebarHistory();
//         scrollToBottom();
        
//         if (window.innerWidth < 1024) {
//             document.getElementById('sidebar').classList.remove('mobile-open');
//             document.getElementById('mobileOverlay').classList.remove('active');
//         }
//     }

//     // ==========================================
//     // 5. UI Render Helpers (WITH CUSTOM ANIMATIONS)
//     // ==========================================
//     function appendMessageUI(text, sender) {
//         const row = document.createElement('div');
//         row.className = `msg-row ${sender}`;

//         let avatarHTML = '';
//         if (sender === 'bot') {
//             avatarHTML = `
//                 <div class="msg-avatar bot">
//                     <div class="robot-avatar">
//                         <div class="eye"></div>
//                         <div class="eye"></div>
//                     </div>
//                 </div>`;
//         } else {
//             avatarHTML = `<div class="msg-avatar user"><img src="${userAvatarSrc}" alt="User"></div>`;
//         }

//         const contentHTML = sender === 'bot' && typeof marked !== 'undefined' 
//             ? marked.parse(text) 
//             : text.replace(/</g, "&lt;").replace(/>/g, "&gt;");

//         row.innerHTML = `
//             ${avatarHTML}
//             <div class="msg-content">
//                 ${sender === 'user' ? `<p>${contentHTML}</p>` : contentHTML}
//             </div>
//         `;

//         chatMessages.appendChild(row);
//         scrollToBottom();
//     }

//     function appendTypingIndicator() {
//         const id = 'typing-' + Date.now();
//         const row = document.createElement('div');
//         row.className = 'msg-row bot';
//         row.id = id;
        
//         row.innerHTML = `
//             <div class="msg-avatar bot">
//                 <div class="robot-avatar">
//                     <div class="eye"></div>
//                     <div class="eye"></div>
//                 </div>
//             </div>
//             <div class="msg-content" style="display: flex; align-items: center; padding-top: 2px;">
//                 <div class="loader-wrapper">
//                     <span class="loader-letter">T</span>
//                     <span class="loader-letter">y</span>
//                     <span class="loader-letter">p</span>
//                     <span class="loader-letter">i</span>
//                     <span class="loader-letter">n</span>
//                     <span class="loader-letter">g</span>
//                     <div class="loader"></div>
//                 </div>
//             </div>
//         `;
//         chatMessages.appendChild(row);
//         return id;
//     }

//     function removeTypingIndicator(id) {
//         const el = document.getElementById(id);
//         if (el) el.remove();
//     }

//     function scrollToBottom() {
//         const scrollArea = document.getElementById('chatScrollArea');
//         scrollArea.scrollTo({ top: scrollArea.scrollHeight, behavior: 'smooth' });
//     }
// });







// // ai.js - Square AI Style Assistant for SugarTrack
// import { auth, db } from "./firebase-init.js";
// import { collection, query, where, orderBy, onSnapshot, doc, getDoc, limit } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// document.addEventListener('DOMContentLoaded', () => {
    
//     // --- DOM Elements ---
//     const chatMessages = document.getElementById('chatMessages');
//     const emptyStateHero = document.getElementById('emptyStateHero');
//     const aiInput = document.getElementById('aiInput');
//     const aiSendBtn = document.getElementById('aiSendBtn');
//     const quickPrompts = document.querySelectorAll('.quick-prompt-btn');
    
//     // Sidebar History
//     const chatHistoryList = document.getElementById('chatHistoryList');
//     const newChatBtn = document.getElementById('newChatBtn');

//     // Model Selector
//     const modelSelector = document.getElementById('modelSelector');
//     const currentModelDisplay = document.getElementById('currentModelDisplay');
//     const modelDropdown = document.getElementById('modelDropdown');
//     const modelOptions = document.querySelectorAll('.model-option');

//     // Context Toggle
//     const contextToggle = document.getElementById('contextToggle');

//     // --- State Variables ---
//     let currentUser = null;
//     let userName = "User";
//     let userAvatarSrc = "images/userblue.png";
//     let latestReadingsData = []; 
//     let isProcessing = false;
//     let useHealthContext = true;
    
//     // Chat History State
//     let currentChatId = Date.now().toString();
//     let currentChatMessages = []; 
//     let allChats = JSON.parse(localStorage.getItem('stai_history')) || {}; 

//     let currentModel = 'fast'; 

//     // ==========================================
//     // 1. Initialization & Firebase Data
//     // ==========================================
//     auth.onAuthStateChanged(async (user) => {
//         if (user) {
//             currentUser = user;
//             loadUserProfile(user.uid);
//             subscribeToGlucoseData(user.uid);
//             renderSidebarHistory();
//         } else {
//             window.location.href = 'login.html';
//         }
//     });

//     async function loadUserProfile(uid) {
//         try {
//             const userSnap = await getDoc(doc(db, "users", uid));
//             if (userSnap.exists()) {
//                 const data = userSnap.data();
//                 userName = data.firstName || "User";
//                 userAvatarSrc = data.profileImage || "images/userblue.png";
//             }
//         } catch (error) { console.error(error); }
//     }

//     function subscribeToGlucoseData(uid) {
//         const q = query(
//             collection(db, "readings"), 
//             where("userId", "==", uid),
//             orderBy("timestamp", "desc"),
//             limit(10)
//         );

//         onSnapshot(q, (snapshot) => {
//             latestReadingsData = [];
//             snapshot.forEach(doc => {
//                 const r = doc.data();
//                 latestReadingsData.push({ glucose: r.glucose, context: r.context || "Manual", time: r.time, date: r.date });
//             });
//         });
//     }

//     // ==========================================
//     // 2. UI Event Listeners
//     // ==========================================
    
//     aiInput.addEventListener('input', function() {
//         this.style.height = 'auto';
//         this.style.height = (this.scrollHeight) + 'px';
//         if(this.value.trim() === '') this.style.height = 'auto';
//         aiSendBtn.disabled = this.value.trim() === '' || isProcessing;
//     });

//     aiInput.addEventListener('keydown', (e) => {
//         if (e.key === 'Enter' && !e.shiftKey) {
//             e.preventDefault();
//             if (!aiSendBtn.disabled) handleSend();
//         }
//     });

//     aiSendBtn.addEventListener('click', () => {
//         if (!aiSendBtn.disabled) handleSend();
//     });

//     quickPrompts.forEach(btn => {
//         btn.addEventListener('click', () => {
//             aiInput.value = btn.innerText;
//             aiInput.style.height = 'auto';
//             aiSendBtn.disabled = false;
//             handleSend();
//         });
//     });

//     contextToggle.addEventListener('click', () => {
//         useHealthContext = !useHealthContext;
//         contextToggle.classList.toggle('active', useHealthContext);
//     });

//     currentModelDisplay.addEventListener('click', (e) => {
//         e.stopPropagation();
//         modelDropdown.classList.toggle('show');
//     });

//     document.addEventListener('click', () => {
//         modelDropdown.classList.remove('show');
//     });

//     modelOptions.forEach(opt => {
//         opt.addEventListener('click', () => {
//             modelOptions.forEach(o => o.classList.remove('active'));
//             opt.classList.add('active');
//             currentModel = opt.dataset.model;
            
//             if(currentModel === 'fast') {
//                 currentModelDisplay.innerHTML = `STAi Fast <i class="ph ph-caret-down"></i>`;
//             } else {
//                 currentModelDisplay.innerHTML = `<i class="fa-solid fa-microscope" style="color:var(--info);"></i> STAi Analyzer <i class="ph ph-caret-down"></i>`;
//             }
//         });
//     });

//     newChatBtn.addEventListener('click', () => {
//         currentChatId = Date.now().toString();
//         currentChatMessages = [];
//         chatMessages.innerHTML = '';
//         chatMessages.classList.remove('active');
//         emptyStateHero.style.display = 'flex';
//         document.getElementById('quickPrompts').style.display = 'flex';
//         renderSidebarHistory();
//     });

//     // ==========================================
//     // 3. Core Chat Logic
//     // ==========================================
//     async function handleSend() {
//         const queryText = aiInput.value.trim();
//         if (!queryText) return;

//         if (currentChatMessages.length === 0) {
//             emptyStateHero.style.display = 'none';
//             document.getElementById('quickPrompts').style.display = 'none';
//             chatMessages.classList.add('active');
            
//             allChats[currentChatId] = {
//                 title: queryText.substring(0, 30) + (queryText.length > 30 ? '...' : ''),
//                 date: new Date().toISOString(),
//                 messages: []
//             };
//         }

//         appendMessageUI(queryText, 'user');
//         currentChatMessages.push({ role: 'user', content: queryText });
//         saveHistory();
        
//         aiInput.value = '';
//         aiInput.style.height = 'auto';
//         aiSendBtn.disabled = true;
//         isProcessing = true;

//         const typingId = appendTypingIndicator();

//         try {
//             const prompt = constructPrompt(queryText);
//             const response = await puter.ai.chat(prompt);
//             const answer = response?.message?.content || "I'm sorry, I couldn't process that right now.";

//             removeTypingIndicator(typingId);
//             appendMessageUI(answer, 'bot');
            
//             currentChatMessages.push({ role: 'bot', content: answer });
//             saveHistory();

//         } catch (error) {
//             console.error("STAi Error:", error);
//             removeTypingIndicator(typingId);
//             appendMessageUI("Network error: Unable to reach STAi servers.", 'bot');
//         } finally {
//             isProcessing = false;
//             aiSendBtn.disabled = aiInput.value.trim() === '';
//             scrollToBottom();
//             renderSidebarHistory(); 
//         }
//     }

//     function constructPrompt(userQuestion) {
//         let dataString = "Health context is disabled or unavailable.";
        
//         if (useHealthContext && latestReadingsData.length > 0) {
//             const latest = latestReadingsData[0];
//             dataString = `RECENT GLUCOSE DATA:\nMost Recent: ${latest.glucose} mg/dL (${latest.context} on ${latest.date} at ${latest.time}).\nPast 9 readings: ${latestReadingsData.slice(1).map(r => r.glucose).join(", ")}`;
//         }

//         let behavior = "You are STAi, a friendly and concise diabetes assistant. Keep answers brief, encouraging, and easy to read. Use bullet points.";
//         if (currentModel === 'analyzer') {
//             behavior = "You are STAi Analyzer, a clinical-grade data analysis AI. Provide deep, comprehensive, multi-paragraph analysis of the user's data. Look for trends, suggest scientific reasons for glucose spikes, and be highly detailed.";
//         }

//         return `
//             ${behavior}
//             RULES:
//             1. If asked about health, use the "RECENT GLUCOSE DATA" provided below.
//             2. Format strictly in Markdown.
//             3. Always end medical advice with: "*I am an AI. Verify with your doctor.*"

//             ${dataString}

//             USER QUESTION: "${userQuestion}"
//         `;
//     }

//     // ==========================================
//     // 4. History Management
//     // ==========================================
//     function saveHistory() {
//         if(currentChatMessages.length > 0) {
//             allChats[currentChatId].messages = currentChatMessages;
//             localStorage.setItem('stai_history', JSON.stringify(allChats));
//         }
//     }

//     function renderSidebarHistory() {
//         chatHistoryList.innerHTML = '';
//         const sortedChats = Object.entries(allChats).sort((a, b) => new Date(b[1].date) - new Date(a[1].date));

//         sortedChats.forEach(([id, chat]) => {
//             const el = document.createElement('div');
//             el.className = `history-item ${id === currentChatId && currentChatMessages.length > 0 ? 'active' : ''}`;
//             el.innerHTML = `<i class="ph ph-chat-teardrop-text"></i> ${chat.title}`;
            
//             el.addEventListener('click', () => loadChat(id));
//             chatHistoryList.appendChild(el);
//         });
//     }

//     function loadChat(chatId) {
//         const chat = allChats[chatId];
//         if (!chat) return;

//         currentChatId = chatId;
//         currentChatMessages = chat.messages;
        
//         emptyStateHero.style.display = 'none';
//         document.getElementById('quickPrompts').style.display = 'none';
//         chatMessages.classList.add('active');
//         chatMessages.innerHTML = '';

//         currentChatMessages.forEach(msg => {
//             appendMessageUI(msg.content, msg.role);
//         });

//         renderSidebarHistory();
//         scrollToBottom();
        
//         if (window.innerWidth < 1024) {
//             document.getElementById('sidebar').classList.remove('mobile-open');
//             document.getElementById('mobileOverlay').classList.remove('active');
//         }
//     }

//     // ==========================================
//     // 5. UI Render Helpers (WITH CUSTOM ANIMATIONS)
//     // ==========================================
//     function appendMessageUI(text, sender) {
//         const row = document.createElement('div');
//         row.className = `msg-row ${sender}`;

//         let avatarHTML = '';
//         if (sender === 'bot') {
//             // THE BLINKING ROBOT AVATAR
//             avatarHTML = `
//                 <div class="msg-avatar bot">
//                     <div class="robot-avatar">
//                         <div class="eye"></div>
//                         <div class="eye"></div>
//                     </div>
//                 </div>`;
//         } else {
//             avatarHTML = `<div class="msg-avatar user"><img src="${userAvatarSrc}" alt="User"></div>`;
//         }

//         const contentHTML = sender === 'bot' && typeof marked !== 'undefined' 
//             ? marked.parse(text) 
//             : text.replace(/</g, "&lt;").replace(/>/g, "&gt;");

//         row.innerHTML = `
//             ${avatarHTML}
//             <div class="msg-content">
//                 ${sender === 'user' ? `<p>${contentHTML}</p>` : contentHTML}
//             </div>
//         `;

//         chatMessages.appendChild(row);
//         scrollToBottom();
//     }

//     function appendTypingIndicator() {
//         const id = 'typing-' + Date.now();
//         const row = document.createElement('div');
//         row.className = 'msg-row bot';
//         row.id = id;
        
//         // THE BLINKING ROBOT + CUSTOM LOADER RING
//         row.innerHTML = `
//             <div class="msg-avatar bot">
//                 <div class="robot-avatar">
//                     <div class="eye"></div>
//                     <div class="eye"></div>
//                 </div>
//             </div>
//             <div class="msg-content" style="display: flex; align-items: center; padding-top: 2px;">
//                 <div class="loader-wrapper">
//                     <span class="loader-letter">T</span>
//                     <span class="loader-letter">y</span>
//                     <span class="loader-letter">p</span>
//                     <span class="loader-letter">i</span>
//                     <span class="loader-letter">n</span>
//                     <span class="loader-letter">g</span>
//                     <div class="loader"></div>
//                 </div>
//             </div>
//         `;
//         chatMessages.appendChild(row);
//         return id;
//     }

//     function removeTypingIndicator(id) {
//         const el = document.getElementById(id);
//         if (el) el.remove();
//     }

//     function scrollToBottom() {
//         const scrollArea = document.getElementById('chatScrollArea');
//         scrollArea.scrollTo({ top: scrollArea.scrollHeight, behavior: 'smooth' });
//     }
// });





































// ai.js - Square AI Style Assistant (Custom Delete Modal & Toasts)
import { auth, db } from "./firebase-init.js";
import { collection, query, where, orderBy, onSnapshot, doc, getDoc, limit, setDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    
    // --- DOM Elements ---
    const chatMessages = document.getElementById('chatMessages');
    const emptyStateHero = document.getElementById('emptyStateHero');
    const aiInput = document.getElementById('aiInput');
    const aiSendBtn = document.getElementById('aiSendBtn');
    const quickPrompts = document.querySelectorAll('.quick-prompt-btn');
    
    // Sidebar History
    const chatHistoryList = document.getElementById('chatHistoryList');
    const newChatBtn = document.getElementById('newChatBtn');
    const historySearch = document.getElementById('historySearch'); 

    // Model Selector & Context
    const modelSelector = document.getElementById('modelSelector');
    const currentModelDisplay = document.getElementById('currentModelDisplay');
    const modelDropdown = document.getElementById('modelDropdown');
    const modelOptions = document.querySelectorAll('.model-option');
    const contextToggle = document.getElementById('contextToggle');

    // Delete Modal Elements
    const deleteModal = document.getElementById('deleteChatModal');
    const closeDeleteModalBtn = document.getElementById('closeDeleteModalBtn');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

    // --- State Variables ---
    let currentUser = null;
    let userName = "User";
    let userAvatarSrc = "images/userblue.png";
    let latestReadingsData = []; 
    let isProcessing = false;
    let useHealthContext = true;
    let chatToDeleteId = null; // Stores ID currently marked for deletion
    
    // Cloud Chat History State
    let currentChatId = Date.now().toString();
    let currentChatMessages = []; 
    let allChats = {}; 
    let currentModel = 'fast'; 

    // ==========================================
    // 1. Initialization & Firebase Data
    // ==========================================
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            currentUser = user;
            loadUserProfile(user.uid);
            subscribeToGlucoseData(user.uid);
            subscribeToChatHistory(user.uid);
        } else {
            window.location.href = 'login.html';
        }
    });

    async function loadUserProfile(uid) {
        try {
            const userSnap = await getDoc(doc(db, "users", uid));
            if (userSnap.exists()) {
                const data = userSnap.data();
                userName = data.firstName || "User";
                userAvatarSrc = data.profileImage || "images/userblue.png";
            }
        } catch (error) { console.error(error); }
    }

    function subscribeToGlucoseData(uid) {
        const q = query(collection(db, "readings"), where("userId", "==", uid), orderBy("timestamp", "desc"), limit(10));
        onSnapshot(q, (snapshot) => {
            latestReadingsData = [];
            snapshot.forEach(doc => {
                const r = doc.data();
                latestReadingsData.push({ glucose: r.glucose, context: r.context || "Manual", time: r.time, date: r.date });
            });
        });
    }

    function subscribeToChatHistory(uid) {
        const chatRef = collection(db, "users", uid, "chatai");
        onSnapshot(chatRef, (snapshot) => {
            const loadedChats = {};
            snapshot.forEach(docSnap => {
                loadedChats[docSnap.id] = docSnap.data();
            });
            allChats = loadedChats;
            renderSidebarHistory(historySearch.value.trim());
        }, (error) => {
            console.error("Error loading chat history:", error);
        });
    }

    // ==========================================
    // 2. Custom UI Modals & Toasts
    // ==========================================
    function showCustomAlert(message, type = 'success') {
        const existingNotifications = document.querySelectorAll('.custom-notification');
        existingNotifications.forEach(n => n.remove());
        
        const notification = document.createElement('div');
        notification.className = `custom-notification ${type}`;
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <i class="ph ph-${type === 'success' ? 'check-circle' : 'warning-circle'}" style="font-size: 1.25rem;"></i>
                <span>${message}</span>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed; bottom: 20px; right: 20px;
            background: ${type === 'success' ? 'var(--success, #10b981)' : 'var(--danger, #ef4444)'}; color: white;
            padding: 1rem 1.5rem; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            z-index: 10000; max-width: 350px; 
            animation: alertSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
            font-size: 0.95rem; font-weight: 500;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'alertSlideOut 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards';
            setTimeout(() => { if (notification.parentNode) notification.parentNode.removeChild(notification); }, 400);
        }, 3000);
    }

    function closeDeleteModal() {
        if(deleteModal) deleteModal.classList.remove('active');
        chatToDeleteId = null;
    }

    if (closeDeleteModalBtn) closeDeleteModalBtn.addEventListener('click', closeDeleteModal);
    if (cancelDeleteBtn) cancelDeleteBtn.addEventListener('click', closeDeleteModal);
    if (deleteModal) deleteModal.addEventListener('click', (e) => { if (e.target === deleteModal) closeDeleteModal(); });

    // Handle Confirm Deletion
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', async () => {
            if (!chatToDeleteId) return;
            
            const originalText = confirmDeleteBtn.innerHTML;
            confirmDeleteBtn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Deleting...';
            confirmDeleteBtn.disabled = true;

            try {
                // Delete from cloud
                await deleteDoc(doc(db, "users", currentUser.uid, "chatai", chatToDeleteId));
                
                delete allChats[chatToDeleteId];

                if (chatToDeleteId === currentChatId) {
                    newChatBtn.click();
                } else {
                    renderSidebarHistory(historySearch.value.trim());
                }
                
                closeDeleteModal();
                showCustomAlert('Chat deleted successfully', 'success');
            } catch (err) {
                console.error("Delete failed", err);
                showCustomAlert('Failed to delete chat', 'error');
            } finally {
                confirmDeleteBtn.innerHTML = originalText;
                confirmDeleteBtn.disabled = false;
            }
        });
    }

    // ==========================================
    // 3. Form Event Listeners
    // ==========================================
    aiInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
        if(this.value.trim() === '') this.style.height = 'auto';
        aiSendBtn.disabled = this.value.trim() === '' || isProcessing;
    });

    aiInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!aiSendBtn.disabled) handleSend();
        }
    });

    aiSendBtn.addEventListener('click', () => {
        if (!aiSendBtn.disabled) handleSend();
    });

    quickPrompts.forEach(btn => {
        btn.addEventListener('click', () => {
            aiInput.value = btn.innerText;
            aiInput.style.height = 'auto';
            aiSendBtn.disabled = false;
            handleSend();
        });
    });

    contextToggle.addEventListener('click', () => {
        useHealthContext = !useHealthContext;
        contextToggle.classList.toggle('active', useHealthContext);
    });

    currentModelDisplay.addEventListener('click', (e) => {
        e.stopPropagation();
        modelDropdown.classList.toggle('show');
    });

    document.addEventListener('click', () => {
        modelDropdown.classList.remove('show');
    });

    modelOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            modelOptions.forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
            currentModel = opt.dataset.model;
            
            if(currentModel === 'fast') {
                currentModelDisplay.innerHTML = `STAi Fast <i class="ph ph-caret-down"></i>`;
            } else {
                currentModelDisplay.innerHTML = `<i class="fa-solid fa-microscope" style="color:var(--info);"></i> STAi Analyzer <i class="ph ph-caret-down"></i>`;
            }
        });
    });

    newChatBtn.addEventListener('click', () => {
        currentChatId = Date.now().toString(); 
        currentChatMessages = [];
        chatMessages.innerHTML = '';
        chatMessages.classList.remove('active');
        emptyStateHero.style.display = 'flex';
        document.getElementById('quickPrompts').style.display = 'flex';
        renderSidebarHistory(historySearch.value.trim());
    });

    historySearch.addEventListener('input', (e) => {
        renderSidebarHistory(e.target.value.trim());
    });

    // ==========================================
    // 4. Core Chat Logic
    // ==========================================
    async function handleSend() {
        const queryText = aiInput.value.trim();
        if (!queryText) return;

        if (currentChatMessages.length === 0) {
            emptyStateHero.style.display = 'none';
            document.getElementById('quickPrompts').style.display = 'none';
            chatMessages.classList.add('active');
            
            allChats[currentChatId] = {
                title: queryText.substring(0, 30) + (queryText.length > 30 ? '...' : ''),
                date: new Date().toISOString(),
                updatedAt: Date.now(),
                messages: []
            };
        }

        appendMessageUI(queryText, 'user');
        currentChatMessages.push({ role: 'user', content: queryText });
        saveHistory(); 
        
        aiInput.value = '';
        aiInput.style.height = 'auto';
        aiSendBtn.disabled = true;
        isProcessing = true;

        const typingId = appendTypingIndicator();

        try {
            const prompt = constructPrompt(queryText);
            const response = await puter.ai.chat(prompt);
            const answer = response?.message?.content || "I'm sorry, I couldn't process that right now.";

            removeTypingIndicator(typingId);
            appendMessageUI(answer, 'bot');
            
            currentChatMessages.push({ role: 'bot', content: answer });
            saveHistory(); 

        } catch (error) {
            console.error("STAi Error:", error);
            removeTypingIndicator(typingId);
            appendMessageUI("Network error: Unable to reach STAi servers.", 'bot');
        } finally {
            isProcessing = false;
            aiSendBtn.disabled = aiInput.value.trim() === '';
            scrollToBottom();
        }
    }

    function constructPrompt(userQuestion) {
        let dataString = "Health context is disabled or unavailable.";
        
        if (useHealthContext && latestReadingsData.length > 0) {
            const latest = latestReadingsData[0];
            dataString = `RECENT GLUCOSE DATA:\nMost Recent: ${latest.glucose} mg/dL (${latest.context} on ${latest.date} at ${latest.time}).\nPast 9 readings: ${latestReadingsData.slice(1).map(r => r.glucose).join(", ")}`;
        }

        let behavior = "You are STAi, a friendly and concise diabetes assistant. Keep answers brief, encouraging, and easy to read. Use bullet points.";
        if (currentModel === 'analyzer') {
            behavior = "You are STAi Analyzer, a clinical-grade data analysis AI. Provide deep, comprehensive, multi-paragraph analysis of the user's data. Look for trends, suggest scientific reasons for glucose spikes, and be highly detailed.";
        }

        return `
            ${behavior}
            RULES:
            1. If asked about health, use the "RECENT GLUCOSE DATA" provided below.
            2. Format strictly in Markdown.
            3. Always end medical advice with: "*I am an AI. Verify with your doctor.*"

            ${dataString}

            USER QUESTION: "${userQuestion}"
        `;
    }

    // ==========================================
    // 5. Cloud History Management 
    // ==========================================
    async function saveHistory() {
        if(currentChatMessages.length > 0 && currentUser) {
            
            if (!allChats[currentChatId]) {
                const firstMsg = currentChatMessages[0].content;
                allChats[currentChatId] = {
                    title: firstMsg.substring(0, 25) + (firstMsg.length > 25 ? '...' : ''),
                    date: new Date().toISOString(),
                    messages: []
                };
            }

            allChats[currentChatId].messages = currentChatMessages;
            allChats[currentChatId].updatedAt = Date.now();
            
            try {
                const chatDocRef = doc(db, "users", currentUser.uid, "chatai", currentChatId);
                await setDoc(chatDocRef, allChats[currentChatId], { merge: true });
            } catch (error) {
                console.error("Firebase save error:", error);
            }
        }
    }

    function renderSidebarHistory(searchTerm = "") {
        chatHistoryList.innerHTML = '';
        
        const sortedChats = Object.entries(allChats).sort((a, b) => {
            const timeA = a[1].updatedAt || (a[1].date ? new Date(a[1].date).getTime() : 0);
            const timeB = b[1].updatedAt || (b[1].date ? new Date(b[1].date).getTime() : 0);
            return (Number.isNaN(timeB) ? 0 : timeB) - (Number.isNaN(timeA) ? 0 : timeA);
        });

        sortedChats.forEach(([id, chat]) => {
            const title = chat.title || "New Conversation";
            
            if (searchTerm && !title.toLowerCase().includes(searchTerm.toLowerCase())) return;

            const el = document.createElement('div');
            el.className = `history-item ${id === currentChatId && currentChatMessages.length > 0 ? 'active' : ''}`;
            
            el.innerHTML = `
                <div style="display: flex; align-items: center; gap: 8px; flex: 1; overflow: hidden;">
                    <i class="ph ph-chat-teardrop-text"></i> 
                    <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${title}</span>
                </div>
            `;
            
            // Custom Delete Trigger
            const delBtn = document.createElement('i');
            delBtn.className = "ph ph-trash";
            // delBtn.style.opacity = "0";
            delBtn.style.cursor = "pointer";
            delBtn.style.transition = "0.2s";
            delBtn.title = "Delete Chat";

            // el.addEventListener('mouseenter', () => delBtn.style.opacity = '0.6');
            // el.addEventListener('mouseleave', () => delBtn.style.opacity = '0');
            delBtn.addEventListener('mouseenter', () => delBtn.style.color = 'var(--danger)');
            delBtn.addEventListener('mouseleave', () => delBtn.style.color = '');

            // OPEN CUSTOM MODAL INSTEAD OF NATIVE ALERT
            delBtn.addEventListener('click', (e) => {
                e.stopPropagation(); 
                chatToDeleteId = id; // Save the target ID globally
                deleteModal.classList.add('active'); // Trigger CSS modal
            });

            el.appendChild(delBtn);
            el.addEventListener('click', () => loadChat(id));
            chatHistoryList.appendChild(el);
        });
    }

    function loadChat(chatId) {
        const chat = allChats[chatId];
        if (!chat) return;

        currentChatId = chatId;
        currentChatMessages = chat.messages || [];
        
        emptyStateHero.style.display = 'none';
        document.getElementById('quickPrompts').style.display = 'none';
        chatMessages.classList.add('active');
        chatMessages.innerHTML = '';

        currentChatMessages.forEach(msg => {
            appendMessageUI(msg.content, msg.role);
        });

        renderSidebarHistory(historySearch.value.trim());
        scrollToBottom();
        
        if (window.innerWidth < 1024) {
            document.documentElement.classList.remove('sidebar-collapsed');
            document.getElementById('sidebar').classList.remove('mobile-open');
            document.getElementById('mobileOverlay').classList.remove('active');
        }
    }

    // ==========================================
    // 6. UI Render Helpers 
    // ==========================================
    function appendMessageUI(text, sender) {
        const row = document.createElement('div');
        row.className = `msg-row ${sender}`;

        let avatarHTML = '';
        if (sender === 'bot') {
            avatarHTML = `
                <div class="msg-avatar bot">
                    <div class="robot-avatar">
                        <div class="eye"></div>
                        <div class="eye"></div>
                    </div>
                </div>`;
        } else {
            avatarHTML = `<div class="msg-avatar user"><img src="${userAvatarSrc}" alt="User"></div>`;
        }

        const contentHTML = sender === 'bot' && typeof marked !== 'undefined' 
            ? marked.parse(text) 
            : text.replace(/</g, "&lt;").replace(/>/g, "&gt;");

        row.innerHTML = `
            ${avatarHTML}
            <div class="msg-content">
                ${sender === 'user' ? `<p>${contentHTML}</p>` : contentHTML}
            </div>
        `;

        chatMessages.appendChild(row);
        scrollToBottom();
    }

    function appendTypingIndicator() {
        const id = 'typing-' + Date.now();
        const row = document.createElement('div');
        row.className = 'msg-row bot';
        row.id = id;
        
        row.innerHTML = `
            <div class="msg-avatar bot">
                <div class="robot-avatar">
                    <div class="eye"></div>
                    <div class="eye"></div>
                </div>
            </div>
            <div class="msg-content" style="display: flex; align-items: center; padding-top: 2px;">
                <div class="loader-wrapper">
                    <span class="loader-letter">T</span>
                    <span class="loader-letter">y</span>
                    <span class="loader-letter">p</span>
                    <span class="loader-letter">i</span>
                    <span class="loader-letter">n</span>
                    <span class="loader-letter">g</span>
                    <div class="loader"></div>
                </div>
            </div>
        `;
        chatMessages.appendChild(row);
        return id;
    }

    function removeTypingIndicator(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    function scrollToBottom() {
        const scrollArea = document.getElementById('chatScrollArea');
        scrollArea.scrollTo({ top: scrollArea.scrollHeight, behavior: 'smooth' });
    }
});