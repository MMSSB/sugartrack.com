// ai-insights.js

    const trendsMessage = document.getElementById('trendsMessage');

document.addEventListener('DOMContentLoaded', function() {
    
let readings = [];
let currentUser = null;
    // Initialize Firebase Auth listener
auth.onAuthStateChanged((user) => {
    if (user) {
        currentUser = user;
        document.getElementById('appContainer').style.display = 'flex';
        loadUserData(); // This will now trigger chart updates
            loadAiInsights();
            initWeeklyTrendsChart();
            setupAiChat();
        } else {
            window.location.href = 'login.html';
        }
    });
// Initialize Firebase Auth listener
auth.onAuthStateChanged((user) => {
    if (user) {
        currentUser = user;
        appContainer.style.display = 'flex';
        loadUserData();
    } else {
        window.location.href = 'login.html';
    }
});
function loadUserData() {
        // Load glucose readings with real-time updates
    window._unsubscribeReadings = db.collection('readings')
        .where('userId', '==', currentUser.uid)
        .orderBy('timestamp', 'desc')
        .onSnapshot((querySnapshot) => {
            readings = [];
            querySnapshot.forEach((doc) => {
                const reading = doc.data();
                readings.push({
                    id: doc.id,
                    date: reading.date,
                    time: reading.time,
                    glucose: reading.glucose,
                    comment: reading.comment || '',
                    timestamp: reading.timestamp ? reading.timestamp.toDate() : new Date()
                });
            });
            
            // Update the chart with the new data
            updateSuggestions(readings);
        }, (error) => {
            console.error("Error in real-time updates:", error);
        });
}

// Add this to your existing auth state listener


// Load user data from Firestore
function loadUserData() {
    // Set up logout button handler
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }

    // Load user's name
    db.collection('users').doc(currentUser.uid).get()
        .then((doc) => {
            if (doc.exists) {
                const userData = doc.data();
                const userWelcomeName = document.getElementById('userWelcomeName');
                if (userWelcomeName && userData.firstName) {
                    userWelcomeName.textContent = userData.firstName;
                }
            } else {
                return db.collection('users').doc(currentUser.uid).set({
                    firstName: 'User',
                    lastName: '',
                    email: currentUser.email,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            }
        })
        .catch((error) => {
            console.error('Error loading user data:', error);
        });

    // Load glucose readings with real-time updates
    window._unsubscribeReadings = db.collection('readings')
        .where('userId', '==', currentUser.uid)
        .orderBy('timestamp', 'desc')
        .onSnapshot((querySnapshot) => {
            readings = [];
            querySnapshot.forEach((doc) => {
                const reading = doc.data();
                readings.push({
                    id: doc.id,
                    date: reading.date,
                    time: reading.time,
                    glucose: reading.glucose,
                    comment: reading.comment || '',
                    timestamp: reading.timestamp ? reading.timestamp.toDate() : new Date()
                });
            });
            updateReadingsList();
        }, (error) => {
            console.error("Error in real-time updates:", error);
        });
}

// Handle logout
function handleLogout() {
    if (window._unsubscribeReadings) {
        window._unsubscribeReadings();
    }
    
    auth.signOut()
        .then(() => {
            window.location.href = 'login.html';
        })
        .catch((error) => {
            console.error('Logout error:', error);
        });
}
    function loadAiInsights() {
        // Simulate loading AI insights (in a real app, this would call your backend)
        setTimeout(() => {
            generatePatternInsight();
            generateMealInsight();
            generateSleepInsight();
            generateActivityInsight();
        }, 1500);
    }

    function generatePatternInsight() {
        const insights = [
            "Your glucose levels tend to spike between 8-10 AM. Consider adjusting your breakfast choices or timing.",
            "You maintain excellent glucose control during nighttime hours with minimal fluctuations.",
            "Weekend readings are consistently higher than weekdays. This may be related to dietary changes on weekends.",
            "Your glucose levels show a stable pattern with minimal variability, indicating good management."
        ];
        
        const randomInsight = insights[Math.floor(Math.random() * insights.length)];
        document.getElementById('patternInsight').innerHTML = `<p>${randomInsight}</p>`;
    }

    function generateMealInsight() {
        const insights = [
            "Your post-meal glucose spikes are highest after lunch. Consider reducing carbohydrate intake or increasing physical activity after this meal.",
            "Your breakfast choices seem to be working well, with minimal post-meal spikes.",
            "Evening meals show the most stable post-meal glucose responses. Keep up these good habits!",
            "Your glucose levels rise by an average of 45 mg/dL within 2 hours of meals. Aim to keep post-meal increases below 30 mg/dL."
        ];
        
        const randomInsight = insights[Math.floor(Math.random() * insights.length)];
        document.getElementById('mealInsight').innerHTML = `<p>${randomInsight}</p>`;
    }

    function generateSleepInsight() {
        const insights = [
            "Your glucose levels tend to drop slightly during sleep, which is a healthy pattern.",
            "On nights with less than 6 hours of sleep, your morning glucose is 15% higher on average.",
            "Your glucose stability during sleep is excellent, indicating good overnight management.",
            "Consider checking your glucose if you wake up during the night, as we've detected some variability during sleep."
        ];
        
        const randomInsight = insights[Math.floor(Math.random() * insights.length)];
        document.getElementById('sleepInsight').innerHTML = `<p>${randomInsight}</p>`;
    }

    function generateActivityInsight() {
        const insights = [
            "Days with more than 30 minutes of exercise show 20% lower glucose variability.",
            "Your glucose levels respond well to physical activity, with noticeable decreases during and after exercise.",
            "Even light activity like walking after meals helps reduce post-meal glucose spikes.",
            "Consider adding short activity breaks during sedentary periods to help maintain glucose stability."
        ];
        
        const randomInsight = insights[Math.floor(Math.random() * insights.length)];
        document.getElementById('activityInsight').innerHTML = `<p>${randomInsight}</p>`;
    }

    function initWeeklyTrendsChart() {
        const ctx = document.getElementById('weeklyTrendsChart').getContext('2d');
        
        // Sample data - in a real app, you would fetch this from your database
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const morningReadings = [120, 115, 125, 130, 118, 140, 135];
        const eveningReadings = [110, 105, 115, 120, 108, 130, 125];
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: days,
                datasets: [
                    {
                        label: 'Morning Average',
                        data: morningReadings,
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        tension: 0.3,
                        fill: true
                    },
                    {
                        label: 'Evening Average',
                        data: eveningReadings,
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        tension: 0.3,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: 'Glucose (mg/dL)'
                        }
                    }
                }
            }
        });
    }

    function setupAiChat() {
        const chatMessages = document.getElementById('aiChatMessages');
        const questionInput = document.getElementById('aiQuestionInput');
        const askButton = document.getElementById('askAiButton');
        
        askButton.addEventListener('click', sendQuestion);
        questionInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendQuestion();
        });
        
        function sendQuestion() {
            const question = questionInput.value.trim();
            if (!question) return;
            
            // Add user message to chat
            addMessage(question, 'user');
            questionInput.value = '';
            
            // Show typing indicator
            const typingIndicator = document.createElement('div');
            typingIndicator.className = 'ai-message ai-message-bot';
            typingIndicator.innerHTML = `
                <div class="ai-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="ai-text">
                    <div class="typing">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            `;
            chatMessages.appendChild(typingIndicator);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            // Simulate AI response after delay
            setTimeout(() => {
                // Remove typing indicator
                chatMessages.removeChild(typingIndicator);
                
                // Generate and add AI response
                const response = generateAiResponse(question);
                addMessage(response, 'bot');
            }, 1500);
        }
        
        function addMessage(text, sender) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `ai-message ai-message-${sender}`;
            
            messageDiv.innerHTML = `
                <div class="ai-avatar">
                    <i class="fas fa-${sender === 'bot' ? 'robot' : 'user'}"></i>
                </div>
                <div class="ai-text">
                    <p>${text}</p>
                </div>
            `;
            
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
        
        
        function generateAiResponse(question) {
            // In a real app, this would call your AI backend
            // For demo purposes, we'll use simple pattern matching
            
            const lowerQuestion = question.toLowerCase();
            
            if (lowerQuestion.includes('high') || lowerQuestion.includes('spike')) {
                return "When you notice high glucose readings, consider drinking more water, going for a short walk, and reviewing your recent food intake. Persistent highs may require medication adjustment - consult your healthcare provider.";
            } 
            else if (lowerQuestion.includes('low') || lowerQuestion.includes('hypo')) {
                return "For low glucose readings, follow the 15-15 rule: consume 15g of fast-acting carbs and check again in 15 minutes. Always carry glucose tablets or juice for emergencies.";
            }
            else if (lowerQuestion.includes('meal') || lowerQuestion.includes('eat') || lowerQuestion.includes('food')) {
                return "Your meal impacts vary, but generally complex carbs with protein and healthy fats lead to more stable post-meal glucose. Consider smaller, more frequent meals if you're seeing large spikes.";
            }
            else if (lowerQuestion.includes('exercise') || lowerQuestion.includes('activity')) {
                return "Physical activity typically lowers glucose levels, but intense exercise can sometimes cause temporary spikes. The best time to exercise is usually 1-2 hours after a meal when glucose begins to rise.";
            }
            else if (lowerQuestion.includes('trend') || lowerQuestion.includes('pattern')) {
                return "Your glucose trends show higher values in the morning (dawn phenomenon) and after lunch. Evening levels are most stable. Weekends show slightly higher averages than weekdays.";
            }
            else if (lowerQuestion.includes('sleep') || lowerQuestion.includes('night')) {
                return "Your overnight glucose patterns are generally stable. However, on nights with less than 6 hours sleep, morning readings average 15% higher. Aim for consistent sleep duration.";
            }
            else {
                const genericResponses = [
                    "Based on your glucose patterns, I recommend checking your levels more frequently before and after meals to better understand your body's responses.",
                    "Your data shows good overall control. The next step would be to focus on reducing post-meal spikes by adjusting meal composition or timing.",
                    "I've analyzed your glucose history and found that your management is effective. Let me know if you'd like specific recommendations for any particular aspect.",
                    "That's an interesting question about your glucose data. From what I see, your numbers are within target range 75% of the time, which is excellent!"
                ];
                return genericResponses[Math.floor(Math.random() * genericResponses.length)];
            }
        }
    }
});

