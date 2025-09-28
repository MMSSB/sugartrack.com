// ================================
// ai-insights.js (drop-in replacement)
// ================================
auth.onAuthStateChanged((user) => {
    if (user) {
        // Load user data from Firestore
        db.collection('users').doc(user.uid).get()
            .then((doc) => {
                if (doc.exists) {
                    const userData = doc.data();
                    
                    // Update profile image
                    const profileImage = document.getElementById('currentProfileImage');
                    if (profileImage) {
                        profileImage.src = userData.profileImage || 'images/user.png';
                    }
                    
                    // Update name display
                    const userNameDisplay = document.getElementById('userNameDisplay');
                    if (userNameDisplay) {
                        const fullName = [userData.firstName, userData.lastName].filter(Boolean).join(' ');
                        userNameDisplay.textContent = fullName || user.email.split('@')[0];
                    }
                    
                    // Update email display
                    const userEmailDisplay = document.getElementById('UserEmailDisplay');
                    if (userEmailDisplay) {
                        userEmailDisplay.textContent = user.email;
                    }
                }
            })
            .catch((error) => {
                console.error('Error loading user data:', error);
            });
    }
});

(function(){
    // ---- Firebase handles (Compat SDK is already loaded in your HTML) ----
    const auth = firebase.auth();
    const db = firebase.firestore();

    // ---- UI refs ----
    const appContainer = document.getElementById('appContainer');
    const logoutButton = document.getElementById('logoutButton');
    const mobileLogoutButton = document.getElementById('mobileLogoutButton');
    const userWelcomeName = document.getElementById('userWelcomeName');

    const patternEl = document.getElementById('patternInsight');
    const mealEl = document.getElementById('mealInsight');
    const sleepEl = document.getElementById('sleepInsight');
    const activityEl = document.getElementById('activityInsight');

    const chatMessages = document.getElementById('aiChatMessages');
    const questionInput = document.getElementById('aiQuestionInput');
    const askButton = document.getElementById('askAiButton');

    const trendsCanvas = document.getElementById('weeklyTrendsChart');

    let currentUser = null;
    let readings = []; // {glucose:number, timestamp:Date, date, time, comment}
    let trendsChart = null;
    let conversationHistory = [];

    // =========================
    // Auth & bootstrap
    // =========================
    auth.onAuthStateChanged(async (user) => {
        if (!user) {
            window.location.href = 'login.html';
            return;
        }
        currentUser = user;
        if (appContainer) appContainer.style.display = 'flex';

        if (logoutButton) logoutButton.addEventListener('click', safeLogout);
        if (mobileLogoutButton) mobileLogoutButton.addEventListener('click', safeLogout);
        
        // Load conversation history
        loadConversationHistory();

        // Load user profile display name
        try {
            const snap = await db.collection('users').doc(currentUser.uid).get();
            if (snap.exists && userWelcomeName) {
                const data = snap.data() || {};
                if (data.firstName) userWelcomeName.textContent = data.firstName;
            }
        } catch (e) { console.warn('User profile load error', e); }

        // Subscribe to readings
        subscribeToReadings();

        // Chat handlers
        if (askButton) askButton.addEventListener('click', () => handleAsk());
        if (questionInput) questionInput.addEventListener('keypress', (e)=>{ if(e.key==='Enter') handleAsk(); });
        
        // Add clear conversation button
        addClearConversationButton();
    });

    function safeLogout(){
        if (window._unsubscribeReadings) window._unsubscribeReadings();
        auth.signOut().then(()=> window.location.href = 'login.html');
    }

    // =========================
    // Firestore -> readings + analytics
    // =========================
    function subscribeToReadings(){
        window._unsubscribeReadings = db.collection('readings')
            .where('userId','==', currentUser.uid)
            .orderBy('timestamp','desc')
            .onSnapshot((qs)=>{
                readings = [];
                qs.forEach((doc)=>{
                    const r = doc.data();
                    readings.push({
                        id: doc.id,
                        date: r.date,
                        time: r.time,
                        glucose: Number(r.glucose),
                        comment: r.comment || '',
                        timestamp: r.timestamp ? r.timestamp.toDate() : new Date()
                    });
                });

                // Recompute insights + chart
                renderInsights(readings);
                renderWeeklyTrends(readings);
            },(err)=> console.error('Realtime error', err));
    }

    function renderInsights(rows){
        const s = summarizeReadings(rows);
        // Quick cards (non-AI):
        if (patternEl) patternEl.innerHTML = `<p>Time-in-Range (70–180): <b>${s.tirPct.toFixed(0)}%</b>. Average: <b>${s.avg.toFixed(0)}</b> mg/dL. Peaks most common around <b>${s.topHourLabel}</b>. Variability (SD): <b>${s.sd.toFixed(0)}</b>.</p>`;
        if (mealEl) mealEl.innerHTML = `<p>Post-meal change (≈2h): <b>${s.postMealDelta.toFixed(0)}</b> mg/dL. Largest bumps after <b>${s.postMealHotspot}</b>.</p>`;
        if (sleepEl) sleepEl.innerHTML = `<p>Night 00:00–06:00 avg: <b>${s.nightAvg.toFixed(0)}</b>. Morning 06:00–09:00 avg: <b>${s.morningAvg.toFixed(0)}</b>.</p>`;
        if (activityEl) activityEl.innerHTML = `<p>Weekday avg: <b>${s.weekdayAvg.toFixed(0)}</b> vs Weekend avg: <b>${s.weekendAvg.toFixed(0)}</b>. Spikes/day: <b>${s.spikesPerDay.toFixed(1)}</b>.</p>`;
    }

    function summarizeReadings(rows){
        if (!rows.length) {
            return {
                count:0, avg:0, sd:0, tirPct:0, topHourLabel:'—',
                postMealDelta:0, postMealHotspot:'—', nightAvg:0, morningAvg:0,
                weekdayAvg:0, weekendAvg:0, spikesPerDay:0, hourly: {}
            };
        }
        const values = rows.map(r=>r.glucose).filter(n=>!isNaN(n));
        const avg = values.reduce((a,b)=>a+b,0)/values.length;
        const sd = Math.sqrt(values.reduce((a,b)=>a+(b-avg)*(b-avg),0)/values.length);
        const tir = values.filter(v=>v>=70 && v<=180).length / values.length * 100;

        // Hourly bucket
        const hourly = {}; // {0..23: [values]}
        rows.forEach(r=>{
            const h = (r.timestamp||new Date()).getHours();
            (hourly[h] ||= []).push(r.glucose);
        });
        const topHour = Object.keys(hourly).sort((a,b)=> avgArr(hourly[b]) - avgArr(hourly[a]))[0];

        // Simple post-meal heuristic: readings with comment containing 'meal', 'breakfast', 'lunch', 'dinner'
        const mealRows = rows.filter(r=>/meal|breakfast|lunch|dinner|iftar|suhoor/i.test(r.comment||''));
        let postMealDelta = 0; let hotspot = 'breakfast';
        if (mealRows.length){
            const pairs = [];
            mealRows.forEach(m=>{
                const t0 = m.timestamp;
                const later = rows.find(r=> Math.abs((r.timestamp - t0)/(1000*60*60)) >= 1.5 && Math.abs((r.timestamp - t0)/(1000*60*60)) <= 2.5);
                if (later) pairs.push(later.glucose - m.glucose);
            });
            if (pairs.length) postMealDelta = avgArr(pairs);
            // hotspot by keyword frequency
            const counts = {breakfast:0,lunch:0,dinner:0};
            mealRows.forEach(m=>{
                const c=(m.comment||'').toLowerCase();
                if (c.includes('breakfast')) counts.breakfast++;
                else if (c.includes('lunch')) counts.lunch++;
                else if (c.includes('dinner')||c.includes('iftar')) counts.dinner++;
            });
            hotspot = Object.keys(counts).sort((a,b)=>counts[b]-counts[a])[0]||hotspot;
        }

        const night = rows.filter(r=>{const h=r.timestamp.getHours(); return h<6;}).map(r=>r.glucose);
        const morning = rows.filter(r=>{const h=r.timestamp.getHours(); return h>=6 && h<9;}).map(r=>r.glucose);

        const weekday = rows.filter(r=>{const d=r.timestamp.getDay(); return d!==5 && d!==6;}).map(r=>r.glucose); // Fri/Sat as weekend (Egypt)
        const weekend = rows.filter(r=>{const d=r.timestamp.getDay(); return d===5 || d===6;}).map(r=>r.glucose);

        // crude spike count (>180)
        const spikes = rows.filter(r=>r.glucose>180).length;
        const daysSpan = Math.max(1, Math.ceil((rows[0].timestamp - rows[rows.length-1].timestamp)/(1000*60*60*24)));

        return {
            count: rows.length,
            avg,
            sd,
            tirPct: tir,
            hourly,
            topHourLabel: topHour===undefined ? '—' : `${String(topHour).padStart(2,'0')}:00`,
            postMealDelta,
            postMealHotspot: hotspot,
            nightAvg: avgArr(night)||0,
            morningAvg: avgArr(morning)||0,
            weekdayAvg: avgArr(weekday)||0,
            weekendAvg: avgArr(weekend)||0,
            spikesPerDay: spikes / daysSpan
        };
    }

    function avgArr(a){ if(!a || !a.length) return 0; return a.reduce((x,y)=>x+y,0)/a.length; }

    // =========================
    // Chart.js weekly trends from real readings
    // =========================
    function renderWeeklyTrends(rows){
        if (!trendsCanvas) return;

        const labels = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
        const morning = new Array(7).fill(null).map(()=>[]);
        const evening = new Array(7).fill(null).map(()=>[]);
        rows.forEach(r=>{
            const d = r.timestamp.getDay();
            const h = r.timestamp.getHours();
            if (h<12) morning[d].push(r.glucose); else evening[d].push(r.glucose);
        });
        const morningAvg = morning.map(avgArr);
        const eveningAvg = evening.map(avgArr);

        if (trendsChart) trendsChart.destroy();
        trendsChart = new Chart(trendsCanvas.getContext('2d'),{
            type:'line',
            data:{
                labels,
                datasets:[
                    {label:'Morning Average', data: morningAvg, tension:0.3, fill:true},
                    {label:'Evening Average', data: eveningAvg, tension:0.3, fill:true},
                ]
            },
            options:{
                responsive:true,
                maintainAspectRatio:false,
                interaction:{mode:'index', intersect:false},
                plugins:{ legend:{ position:'top' } },
                scales:{ y:{ title:{ display:true, text:'Glucose (mg/dL)'} } }
            }
        });
    }

    // =========================
    // AI chat with conversation history
    // =========================
    async function handleAsk(){
        const q = (questionInput?.value||'').trim();
        if (!q) return;
        
        // Add user message to chat and history
        addMessage(q, 'user');
        conversationHistory.push({ role: 'user', content: q });
        questionInput.value='';

        const typing = addTyping();

        try {
            // Get user's name from Firestore
            const userName = await getUserName();
            
            const s = summarizeReadings(readings);
            
            // Check if the question might benefit from web search
            const needsWebSearch = checkIfNeedsWebSearch(q);
            
            let webResults = '';
            if (needsWebSearch) {
                webResults = await performWebSearch(q);
            }
            
            const prompt = buildPrompt(q, s, userName, webResults, conversationHistory);
            const mode = (window.AI_CONFIG?.MODE||'gemini').toLowerCase();
            let answer = '';
            if (mode==='gemini') answer = await callGemini(prompt, conversationHistory);
            else answer = await callOllama(prompt, conversationHistory);
            
            // Add AI response to history
            conversationHistory.push({ role: 'assistant', content: answer });
            
            removeTyping(typing);
            addMessage(answer||"Sorry, I couldn't generate a response.", 'bot');
            
            // Save conversation history to localStorage
            saveConversationHistory();
        } catch (e){
            console.error(e);
            removeTyping(typing);
            addMessage('I hit an error generating an answer. Please try again.', 'bot');
        }
    }

    function buildPrompt(userQuestion, summary, userName, webResults = '', history = []) {
        const medIntent = /medicin|medicine|drug|pill|tablet|insulin|metformin|sulfonylurea|glp|sglt|dpp|ozempic|semaglutide|tirzepatide|jardiance|metformin/i.test(userQuestion);
        const summaryText = `DATA SUMMARY\n- User Name: ${userName}\n- Count: ${summary.count}\n- Time-in-Range: ${summary.tirPct.toFixed(0)}% (70–180 mg/dL)\n- Avg: ${summary.avg.toFixed(0)}, SD: ${summary.sd.toFixed(0)}\n- Peak hour: ${summary.topHourLabel}\n- Post-meal Δ: ${summary.postMealDelta.toFixed(0)} (hotspot: ${summary.postMealHotspot})\n- Night avg: ${summary.nightAvg.toFixed(0)}, Morning avg: ${summary.morningAvg.toFixed(0)}\n- Weekday vs Weekend avg: ${summary.weekdayAvg.toFixed(0)} / ${summary.weekendAvg.toFixed(0)}\n`;

        // Add conversation history to context
        let historyContext = '';
        if (history.length > 0) {
            historyContext = '\n\nCONVERSATION HISTORY:\n';
            history.forEach(msg => {
                historyContext += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
            });
        }

        let task = '';
        
        if (webResults) {
            task = `The user is asking a question that might benefit from current information. Below are web search results. Use these to provide an up-to-date answer while still incorporating their personal data where relevant:\n\n${webResults}\n\n${historyContext}\n\nPlease provide a helpful response based on both the user's data and the search results. Include a brief disclaimer if discussing medical information.`;
        } else if (medIntent) {
            task = `The user is asking about a medicine. Provide:
- What it is typically used for in diabetes care (if applicable)
- Pros (benefits)
- Cons / common side effects
- General warnings/contraindications
- A one-line friendly disclaimer to consult their clinician.
Avoid dosing or individualized advice.${historyContext}`;
        } else {
            task = `Analyze the user's question using the data summary. Mention concrete numbers and suggestions (hydration, walking, meal composition), but DO NOT give medical advice. Include a brief disclaimer.${historyContext}`;
        }

        return `${window.AI_CONFIG?.SYSTEM_PROMPT || ''}\n\n${summaryText}\nUser question: ${userQuestion}\n\n${task}`;
    }

    async function callGemini(prompt, history){
        const key = window.AI_CONFIG?.GEMINI_API_KEY;
        const model = window.AI_CONFIG?.GEMINI_MODEL || 'gemini-1.5-flash';
        if (!key) return 'Gemini API key is missing in ai-config.js.';

        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`;
        
        // Prepare conversation history for Gemini
        const contents = [];
        
        // Add system prompt first
        contents.push({
            role: 'user',
            parts: [{ text: window.AI_CONFIG?.SYSTEM_PROMPT || '' }]
        });
        
        // Add conversation history
        history.forEach(msg => {
            contents.push({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }]
            });
        });
        
        // Add current prompt
        contents.push({
            role: 'user',
            parts: [{ text: prompt }]
        });

        const body = {
            contents: contents,
            safetySettings: [
                {category:'HARM_CATEGORY_DANGEROUS_CONTENT', threshold:'BLOCK_NONE'},
            ],
        };
        
        const res = await fetch(url, {
            method:'POST',
            headers:{ 'Content-Type':'application/json' },
            body: JSON.stringify(body)
        });
        
        if (!res.ok) throw new Error('Gemini HTTP '+res.status);
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        return text.trim();
    }

    async function callOllama(prompt, history){
        const host = window.AI_CONFIG?.OLLAMA?.HOST || 'http://localhost:11434';
        const model = window.AI_CONFIG?.OLLAMA?.MODEL || 'qwen2.5-coder:3b';
        const url = host.replace(/\/$/, '') + '/api/chat';
        
        // Prepare conversation history for Ollama
        const messages = [];
        
        // Add system prompt
        messages.push({ role: 'system', content: window.AI_CONFIG?.SYSTEM_PROMPT || '' });
        
        // Add conversation history
        history.forEach(msg => {
            messages.push({
                role: msg.role === 'user' ? 'user' : 'assistant',
                content: msg.content
            });
        });
        
        // Add current prompt
        messages.push({ role: 'user', content: prompt });

        const body = {
            model,
            messages: messages,
            stream: false
        };
        
        const res = await fetch(url, {
            method:'POST', 
            headers:{'Content-Type':'application/json'}, 
            body: JSON.stringify(body)
        });
        
        if (!res.ok) throw new Error('Ollama HTTP '+res.status);
        const data = await res.json();
        const text = data?.message?.content || '';
        return text.trim();
    }

    // Save and load conversation history
    function saveConversationHistory() {
        try {
            localStorage.setItem('aiConversationHistory', JSON.stringify(conversationHistory));
        } catch (e) {
            console.error('Failed to save conversation history:', e);
        }
    }



    
    function loadConversationHistory() {
        try {
            const savedHistory = localStorage.getItem('aiConversationHistory');
            if (savedHistory) {
                conversationHistory = JSON.parse(savedHistory);
                
                // Render the conversation history in the chat
                renderConversationHistory();
            }
        } catch (e) {
            console.error('Failed to load conversation history:', e);
        }
    }

    function renderConversationHistory() {
        if (!chatMessages) return;
        
        // Clear current messages
        chatMessages.innerHTML = '';
        
        // Render all messages from history
        conversationHistory.forEach(msg => {
            addMessage(msg.content, msg.role === 'user' ? 'user' : 'bot');
        });
    }

    function clearConversationHistory() {
        conversationHistory = [];
        saveConversationHistory();
        if (chatMessages) {
            chatMessages.innerHTML = '';
        }
    }

    function addClearConversationButton() {
        // Check if button already exists
        if (document.querySelector('.clear-conversation-btn')) return;
        
        const clearBtn = document.createElement('button');
        clearBtn.textContent = 'Clear Conversation';
        clearBtn.className = 'clear-conversation-btn';
        // clearBtn.style.margin = '10px';
        // clearBtn.style.padding = '5px 10px';
        clearBtn.style.borderRadius = '.8rem';
        // clearBtn.style.border = '1px solid #ccc';
        clearBtn.style.background = '--text';
        clearBtn.style.cursor = 'pointer';
        
        clearBtn.addEventListener('click', () => {
            clearConversationHistory();
        });
        
        // Add the button near the chat input
        const chatContainer = document.querySelector('.hi');
        // const chatContainer = document.querySelector('.ai-chat-container');
        if (chatContainer) {
            chatContainer.insertBefore(clearBtn, chatContainer.firstChild);
        }
    }

    function checkIfNeedsWebSearch(question) {
        const lowerQuestion = question.toLowerCase();
        
        // Questions that likely need current information
        const searchKeywords = [
            'latest', 'recent', 'new', 'update', 'current', '2023', '2024', '2025',
            'news', 'research', 'study', 'findings', 'discovery', 'breakthrough',
            'fda approval', 'clinical trial', 'medical guidelines', 'treatment guidelines'
        ];
        
        // Medical topics that change frequently
        const medicalTopics = [
            'medication', 'drug', 'treatment', 'therapy', 'guidelines', 'recommendations',
            'dietary advice', 'nutrition advice', 'exercise recommendations'
        ];
        
        // Check if question contains any search keywords or medical topics
        const hasSearchKeyword = searchKeywords.some(keyword => lowerQuestion.includes(keyword));
        const hasMedicalTopic = medicalTopics.some(topic => lowerQuestion.includes(topic));
        
        return hasSearchKeyword || hasMedicalTopic;
    }

    async function performWebSearch(query) {
        try {
            // Use a CORS proxy to avoid cross-origin issues
            const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
            const searchUrl = `https://www.googleapis.com/customsearch/v1?key=YOUR_GOOGLE_SEARCH_API_KEY&cx=YOUR_SEARCH_ENGINE_ID&q=${encodeURIComponent(query + ' diabetes site:.gov OR site:.org OR site:.edu')}`;
            
            const response = await fetch(proxyUrl + searchUrl, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            
            if (!response.ok) {
                throw new Error('Search API error: ' + response.status);
            }
            
            const data = await response.json();
            
            if (data.items && data.items.length > 0) {
                // Extract and format the top 3 results
                let results = 'Web search results:\n';
                data.items.slice(0, 3).forEach((item, index) => {
                    results += `${index + 1}. ${item.title}\n   ${item.snippet}\n   URL: ${item.link}\n\n`;
                });
                return results;
            }
            
            return 'No relevant web search results found.';
        } catch (error) {
            console.error('Web search error:', error);
            return 'Unable to fetch web search results at this time.';
        }
    }

    // Function to get user name from Firestore
    async function getUserName() {
        try {
            const userDoc = await db.collection('users').doc(currentUser.uid).get();
            if (userDoc.exists) {
                const userData = userDoc.data();
                return userData.firstName || 'User';
            }
            return 'User';
        } catch (error) {
            console.error('Error getting user name:', error);
            return 'User';
        }
    }

    // =========================
    // Chat UI helpers
    // =========================
    function addMessage(text, who){
        const bubble = document.createElement('div');
        bubble.className = `ai-message ai-message-${who==='bot'?'bot':'user'}`;

        if (who === 'bot') {
            bubble.innerHTML = `
                <div class="ai-avatar">
                    <div class="message-avatar">
                        <div class="robot-avatar">
                            <div class="eye"></div>
                            <div class="eye"></div>
                        </div>
                    </div>
                </div>
                <div class="ai-text"><p>${escapeHtml(text)}</p></div>
            `;
        } else {
            // Get the user's profile image from Firestore
            db.collection('users').doc(currentUser.uid).get()
                .then((doc) => {
                    if (doc.exists) {
                        const userData = doc.data();
                        const profileImage = userData.profileImage || 'images/user.png';
                        
                        bubble.innerHTML = `
                            <div class="ai-avatar">
                                <img src="${profileImage}" alt="User Profile" class="user-chat-avatar">
                            </div>
                            <div class="ai-text"><p>${escapeHtml(text)}</p></div>
                        `;
                    } else {
                        // Fallback if user data doesn't exist
                        bubble.innerHTML = `
                            <div class="ai-avatar">
                                <img src="images/user.png" alt="User Profile" class="user-chat-avatar">
                            </div>
                            <div class="ai-text"><p>${escapeHtml(text)}</p></div>
                        `;
                    }
                    
                    chatMessages.appendChild(bubble);
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                })
                .catch((error) => {
                    console.error('Error loading user data:', error);
                    // Fallback to default avatar
                    bubble.innerHTML = `
                        <div class="ai-avatar">
                            <img src="images/user.png" alt="User Profile" class="user-chat-avatar">
                        </div>
                        <div class="ai-text"><p>${escapeHtml(text)}</p></div>
                    `;
                    chatMessages.appendChild(bubble);
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                });
                
            return; // Return early since we're handling the append in the promise
        }

        chatMessages.appendChild(bubble);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function addTyping(){
        const el = document.createElement('div');
        el.className = 'ai-message ai-message-bot';
        el.innerHTML = `
            <div class="loader-wrapper">
                <span class="loader-letter">T</span>
                <span class="loader-letter">y</span>
                <span class="loader-letter">p</span>
                <span class="loader-letter">i</span>
                <span class="loader-letter">n</span>
                <span class="loader-letter">g</span>
                <div class="loader"></div>
            </div>
        `;
        chatMessages.appendChild(el);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return el;
    }

    function removeTyping(el){ if (el && el.parentNode) el.parentNode.removeChild(el); }

    function escapeHtml(str){
        return String(str).replace(/[&<>"']/g, s=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[s]));
    }
})();



