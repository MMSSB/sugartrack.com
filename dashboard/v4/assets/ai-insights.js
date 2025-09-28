// // ai-insights.js - Enhanced with real data analysis and AI integration

// document.addEventListener('DOMContentLoaded', function() {
//     let readings = [];
//     let currentUser = null;
//     let weeklyTrendsChart = null;
    
//     // Configuration for AI providers
//     const AI_CONFIG = {
//         gemini: {
//             apiKey: "AIzaSyB8Qad15exavycuh7jRWlsMwiSH6G9E4Gc", // You'll need to replace this with your actual API key
//             enabled: false
//         },
//         ollama: {
//             enabled: true,
//             baseUrl: "http://localhost:11434"
//         }
//     };
    
//     // Initialize Firebase Auth listener
//     auth.onAuthStateChanged((user) => {
//         if (user) {
//             currentUser = user;
//             document.getElementById('appContainer').style.display = 'flex';
//             loadUserData();
//             loadAiInsights();
//             setupAiChat();
//         } else {
//             window.location.href = 'login.html';
//         }
//     });

//     function loadUserData() {
//         // Set up logout button handler
//         const logoutButton = document.getElementById('logoutButton');
//         if (logoutButton) {
//             logoutButton.addEventListener('click', handleLogout);
//         }

//         // Load user's name
//         db.collection('users').doc(currentUser.uid).get()
//             .then((doc) => {
//                 if (doc.exists) {
//                     const userData = doc.data();
//                     const userWelcomeName = document.getElementById('userWelcomeName');
//                     if (userWelcomeName && userData.firstName) {
//                         userWelcomeName.textContent = userData.firstName;
//                     }
//                 }
//             })
//             .catch((error) => {
//                 console.error('Error loading user data:', error);
//             });

//         // Load glucose readings with real-time updates
//         window._unsubscribeReadings = db.collection('readings')
//             .where('userId', '==', currentUser.uid)
//             .orderBy('timestamp', 'desc')
//             .onSnapshot((querySnapshot) => {
//                 readings = [];
//                 querySnapshot.forEach((doc) => {
//                     const reading = doc.data();
//                     readings.push({
//                         id: doc.id,
//                         date: reading.date,
//                         time: reading.time,
//                         glucose: reading.glucose,
//                         comment: reading.comment || '',
//                         timestamp: reading.timestamp ? reading.timestamp.toDate() : new Date()
//                     });
//                 });
                
//                 // Update AI insights with real data
//                 if (readings.length > 0) {
//                     generatePatternInsight();
//                     generateMealInsight();
//                     generateSleepInsight();
//                     generateActivityInsight();
//                     initWeeklyTrendsChart();
//                 }
//             }, (error) => {
//                 console.error("Error in real-time updates:", error);
//             });
//     }

//     function handleLogout() {
//         if (window._unsubscribeReadings) {
//             window._unsubscribeReadings();
//         }
        
//         auth.signOut()
//             .then(() => {
//                 window.location.href = 'login.html';
//             })
//             .catch((error) => {
//                 console.error('Logout error:', error);
//             });
//     }

//     function loadAiInsights() {
//         // Show loading state
//         document.querySelectorAll('.ai-insight-content').forEach(el => {
//             if (el.innerHTML.includes('loading-spinner')) return;
//             el.innerHTML = `
//                 <div class="loading-spinner">
//                     <div class="spinner"></div>
//                     <p>Analyzing your data...</p>
//                 </div>
//             `;
//         });

//         // If we have readings, analyze them, otherwise keep loading state
//         if (readings.length > 0) {
//             generatePatternInsight();
//             generateMealInsight();
//             generateSleepInsight();
//             generateActivityInsight();
//             initWeeklyTrendsChart();
//         }
//     }

//     function analyzeGlucoseData() {
//         if (readings.length === 0) return null;
        
//         // Sort readings by timestamp
//         const sortedReadings = [...readings].sort((a, b) => a.timestamp - b.timestamp);
        
//         // Calculate basic statistics
//         const glucoseValues = sortedReadings.map(r => parseInt(r.glucose));
//         const averageGlucose = glucoseValues.reduce((a, b) => a + b, 0) / glucoseValues.length;
//         const minGlucose = Math.min(...glucoseValues);
//         const maxGlucose = Math.max(...glucoseValues);
        
//         // Categorize readings by time of day
//         const morningReadings = sortedReadings.filter(r => {
//             const hour = new Date(r.timestamp).getHours();
//             return hour >= 6 && hour < 12;
//         });
        
//         const afternoonReadings = sortedReadings.filter(r => {
//             const hour = new Date(r.timestamp).getHours();
//             return hour >= 12 && hour < 18;
//         });
        
//         const eveningReadings = sortedReadings.filter(r => {
//             const hour = new Date(r.timestamp).getHours();
//             return hour >= 18 && hour < 24;
//         });
        
//         const nightReadings = sortedReadings.filter(r => {
//             const hour = new Date(r.timestamp).getHours();
//             return hour >= 0 && hour < 6;
//         });
        
//         // Calculate averages by time period
//         const calculateAverage = (readings) => {
//             if (readings.length === 0) return 0;
//             return readings.reduce((sum, r) => sum + parseInt(r.glucose), 0) / readings.length;
//         };
        
//         return {
//             averageGlucose,
//             minGlucose,
//             maxGlucose,
//             totalReadings: readings.length,
//             morningAverage: calculateAverage(morningReadings),
//             afternoonAverage: calculateAverage(afternoonReadings),
//             eveningAverage: calculateAverage(eveningReadings),
//             nightAverage: calculateAverage(nightReadings),
//             readingsByHour: groupReadingsByHour(sortedReadings),
//             readingsByDay: groupReadingsByDay(sortedReadings),
//             variability: calculateGlucoseVariability(glucoseValues)
//         };
//     }

//     function groupReadingsByHour(readings) {
//         const hours = {};
//         readings.forEach(reading => {
//             const hour = new Date(reading.timestamp).getHours();
//             if (!hours[hour]) hours[hour] = [];
//             hours[hour].push(parseInt(reading.glucose));
//         });
        
//         // Calculate averages per hour
//         const result = {};
//         for (const [hour, values] of Object.entries(hours)) {
//             result[hour] = values.reduce((a, b) => a + b, 0) / values.length;
//         }
        
//         return result;
//     }

//     function groupReadingsByDay(readings) {
//         const days = {};
//         readings.forEach(reading => {
//             const day = new Date(reading.timestamp).toLocaleDateString('en-US', { weekday: 'long' });
//             if (!days[day]) days[day] = [];
//             days[day].push(parseInt(reading.glucose));
//         });
        
//         // Calculate averages per day
//         const result = {};
//         for (const [day, values] of Object.entries(days)) {
//             result[day] = values.reduce((a, b) => a + b, 0) / values.length;
//         }
        
//         return result;
//     }

//     function calculateGlucoseVariability(glucoseValues) {
//         if (glucoseValues.length < 2) return 0;
        
//         const average = glucoseValues.reduce((a, b) => a + b, 0) / glucoseValues.length;
//         const squareDiffs = glucoseValues.map(value => Math.pow(value - average, 2));
//         const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / squareDiffs.length;
//         return Math.sqrt(avgSquareDiff);
//     }

//     function generatePatternInsight() {
//         const analysis = analyzeGlucoseData();
//         if (!analysis) return;
        
//         let insight = "";
        
//         // Identify highest time of day
//         const timeAverages = {
//             "Morning": analysis.morningAverage,
//             "Afternoon": analysis.afternoonAverage,
//             "Evening": analysis.eveningAverage,
//             "Night": analysis.nightAverage
//         };
        
//         const highestTime = Object.entries(timeAverages).reduce((a, b) => a[1] > b[1] ? a : b)[0];
//         const lowestTime = Object.entries(timeAverages).reduce((a, b) => a[1] < b[1] ? a : b)[0];
        
//         if (analysis.variability > 30) {
//             insight = `Your glucose shows high variability (${analysis.variability.toFixed(1)} mg/dL), which indicates inconsistent control. `;
//         } else if (analysis.variability > 20) {
//             insight = `Your glucose shows moderate variability (${analysis.variability.toFixed(1)} mg/dL). `;
//         } else {
//             insight = `Your glucose shows good stability with low variability (${analysis.variability.toFixed(1)} mg/dL). `;
//         }
        
//         insight += `Your highest readings tend to occur in the ${highestTime.toLowerCase()} (average: ${timeAverages[highestTime].toFixed(0)} mg/dL), while your lowest are at ${lowestTime.toLowerCase()} (average: ${timeAverages[lowestTime].toFixed(0)} mg/dL).`;
        
//         document.getElementById('patternInsight').innerHTML = `<p>${insight}</p>`;
//     }

//     function generateMealInsight() {
//         const analysis = analyzeGlucoseData();
//         if (!analysis) return;
        
//         // Assuming meals are around standard times
//         const postBreakfastSpike = analysis.readingsByHour[10] || analysis.readingsByHour[9] || 0;
//         const postLunchSpike = analysis.readingsByHour[14] || analysis.readingsByHour[15] || 0;
//         const postDinnerSpike = analysis.readingsByHour[20] || analysis.readingsByHour[19] || 0;
        
//         let insight = "";
        
//         if (postBreakfastSpike > 180) {
//             insight = `Your post-breakfast glucose levels are quite high (average: ${postBreakfastSpike.toFixed(0)} mg/dL). Consider reducing carbohydrate intake at breakfast or adjusting medication. `;
//         } else if (postBreakfastSpike > 140) {
//             insight = `Your post-breakfast glucose levels are moderately elevated (average: ${postBreakfastSpike.toFixed(0)} mg/dL). You might benefit from a walk after breakfast. `;
//         }
        
//         if (postLunchSpike > 180) {
//             insight += `Lunch appears to cause significant spikes (average: ${postLunchSpike.toFixed(0)} mg/dL). Consider reviewing your lunch choices. `;
//         }
        
//         if (postDinnerSpike > 180) {
//             insight += `Dinner results in high glucose levels (average: ${postDinnerSpike.toFixed(0)} mg/dL). Try eating earlier or reducing portion sizes.`;
//         }
        
//         if (!insight) {
//             insight = "Your post-meal glucose responses are generally within target ranges. Keep up the good dietary habits!";
//         }
        
//         document.getElementById('mealInsight').innerHTML = `<p>${insight}</p>`;
//     }

//     function generateSleepInsight() {
//         const analysis = analyzeGlucoseData();
//         if (!analysis) return;
        
//         const nightValues = Object.entries(analysis.readingsByHour)
//             .filter(([hour]) => hour >= 0 && hour < 6)
//             .map(([_, value]) => value);
        
//         const nightAverage = nightValues.length > 0 ? 
//             nightValues.reduce((a, b) => a + b, 0) / nightValues.length : 0;
            
//         let insight = "";
        
//         if (nightAverage > 140) {
//             insight = `Your nighttime glucose levels are elevated (average: ${nightAverage.toFixed(0)} mg/dL), which may indicate the need for medication adjustment. `;
//         } else if (nightAverage > 120) {
//             insight = `Your nighttime glucose levels are slightly elevated (average: ${nightAverage.toFixed(0)} mg/dL). `;
//         } else {
//             insight = `Your nighttime glucose control is excellent (average: ${nightAverage.toFixed(0)} mg/dL). `;
//         }
        
//         // Check for dawn phenomenon (rising glucose in early morning)
//         const earlyMorningReadings = Object.entries(analysis.readingsByHour)
//             .filter(([hour]) => hour >= 4 && hour < 8)
//             .sort(([hourA], [hourB]) => hourA - hourB);
            
//         if (earlyMorningReadings.length >= 2) {
//             const firstReading = earlyMorningReadings[0][1];
//             const lastReading = earlyMorningReadings[earlyMorningReadings.length - 1][1];
            
//             if (lastReading - firstReading > 20) {
//                 insight += "You appear to experience the dawn phenomenon (rising glucose in early morning).";
//             }
//         }
        
//         document.getElementById('sleepInsight').innerHTML = `<p>${insight}</p>`;
//     }

//     function generateActivityInsight() {
//         const analysis = analyzeGlucoseData();
//         if (!analysis) return;
        
//         // This is a simplified analysis - in a real app, you'd integrate with activity data
//         let insight = "Based on your glucose patterns, ";
        
//         // Look for patterns that might suggest activity effects
//         const weekdayAverages = {};
//         const weekendAverages = {};
        
//         for (const [day, average] of Object.entries(analysis.readingsByDay)) {
//             if (['Saturday', 'Sunday'].includes(day)) {
//                 weekendAverages[day] = average;
//             } else {
//                 weekdayAverages[day] = average;
//             }
//         }
        
//         const weekdayAvg = Object.values(weekdayAverages).reduce((a, b) => a + b, 0) / Math.max(1, Object.values(weekdayAverages).length);
//         const weekendAvg = Object.values(weekendAverages).reduce((a, b) => a + b, 0) / Math.max(1, Object.values(weekendAverages).length);
        
//         if (weekdayAvg < weekendAvg && (weekendAvg - weekdayAvg) > 10) {
//             insight += `your glucose levels are ${(weekendAvg - weekdayAvg).toFixed(0)} mg/dL higher on weekends, which may relate to different activity patterns or dietary choices.`;
//         } else if (weekdayAvg > weekendAvg && (weekdayAvg - weekendAvg) > 10) {
//             insight += `your glucose levels are ${(weekdayAvg - weekendAvg).toFixed(0)} mg/dL lower on weekends, suggesting weekend activities may be beneficial.`;
//         } else {
//             insight += "your activity patterns appear consistent throughout the week with minimal impact on glucose levels.";
//         }
        
//         document.getElementById('activityInsight').innerHTML = `<p>${insight}</p>`;
//     }

//     function initWeeklyTrendsChart() {
//         const ctx = document.getElementById('weeklyTrendsChart').getContext('2d');
//         const analysis = analyzeGlucoseData();
        
//         if (!analysis || Object.keys(analysis.readingsByDay).length === 0) {
//             document.getElementById('weeklyTrendsChart').closest('.content-card').style.display = 'none';
//             return;
//         }
        
//         const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
//         const averages = daysOfWeek.map(day => analysis.readingsByDay[day] || 0);
        
//         // Destroy previous chart if it exists
//         if (weeklyTrendsChart) {
//             weeklyTrendsChart.destroy();
//         }
        
//         weeklyTrendsChart = new Chart(ctx, {
//             type: 'line',
//             data: {
//                 labels: daysOfWeek.map(day => day.substring(0, 3)),
//                 datasets: [{
//                     label: 'Average Glucose (mg/dL)',
//                     data: averages,
//                     borderColor: '#3b82f6',
//                     backgroundColor: 'rgba(59, 130, 246, 0.1)',
//                     tension: 0.3,
//                     fill: true
//                 }]
//             },
//             options: {
//                 responsive: true,
//                 maintainAspectRatio: false,
//                 plugins: {
//                     legend: {
//                         position: 'top',
//                     },
//                     tooltip: {
//                         mode: 'index',
//                         intersect: false,
//                         callbacks: {
//                             label: function(context) {
//                                 return `Glucose: ${context.raw.toFixed(0)} mg/dL`;
//                             }
//                         }
//                     }
//                 },
//                 scales: {
//                     y: {
//                         beginAtZero: false,
//                         title: {
//                             display: true,
//                             text: 'Glucose (mg/dL)'
//                         },
//                         suggestedMin: Math.max(0, Math.min(...averages) - 20),
//                         suggestedMax: Math.max(...averages) + 20
//                     }
//                 }
//             }
//         });
//     }

//     function setupAiChat() {
//         const chatMessages = document.querySelector('.ai-chat-messages');
//         const questionInput = document.querySelector('.ai-chat-input input');
//         const askButton = document.querySelector('.ai-chat-input button');
        
//         askButton.addEventListener('click', sendQuestion);
//         questionInput.addEventListener('keypress', (e) => {
//             if (e.key === 'Enter') sendQuestion();
//         });
        
//         async function sendQuestion() {
//             const question = questionInput.value.trim();
//             if (!question) return;
            
//             // Add user message to chat
//             addMessage(question, 'user');
//             questionInput.value = '';
            
//             // Show typing indicator
//             const typingIndicator = document.createElement('div');
//             typingIndicator.className = 'ai-message ai-message-bot';
//             typingIndicator.innerHTML = `
//                 <div class="ai-avatar">
//                     <i class="fas fa-robot"></i>
//                 </div>
//                 <div class="ai-text">
//                     <div class="typing">
//                         <span></span>
//                         <span></span>
//                         <span></span>
//                     </div>
//                 </div>
//             `;
//             chatMessages.appendChild(typingIndicator);
//             chatMessages.scrollTop = chatMessages.scrollHeight;
            
//             try {
//                 // Get AI response
//                 const response = await getAiResponse(question);
                
//                 // Remove typing indicator
//                 chatMessages.removeChild(typingIndicator);
                
//                 // Add AI response
//                 addMessage(response, 'bot');
//             } catch (error) {
//                 console.error('Error getting AI response:', error);
                
//                 // Remove typing indicator
//                 chatMessages.removeChild(typingIndicator);
                
//                 // Show error message
//                 addMessage("I'm sorry, I'm having trouble connecting to the AI service. Please try again later.", 'bot');
//             }
//         }
        
//         function addMessage(text, sender) {
//             const messageDiv = document.createElement('div');
//             messageDiv.className = `ai-message ai-message-${sender}`;
            
//             messageDiv.innerHTML = `
//                 <div class="ai-avatar">
//                     <i class="fas fa-${sender === 'bot' ? 'robot' : 'user'}"></i>
//                 </div>
//                 <div class="ai-text">
//                     <p>${text}</p>
//                 </div>
//             `;
            
//             chatMessages.appendChild(messageDiv);
//             chatMessages.scrollTop = chatMessages.scrollHeight;
//         }
        
//         async function getAiResponse(question) {
//             // Prepare context with user's data
//             const analysis = analyzeGlucoseData();
//             let context = "";
            
//             if (analysis) {
//                 context = `The user is a diabetes patient with the following glucose patterns:
//                 - Average glucose: ${analysis.averageGlucose.toFixed(0)} mg/dL
//                 - Glucose range: ${analysis.minGlucose} - ${analysis.maxGlucose} mg/dL
//                 - Highest readings typically in: ${Object.entries(analysis.readingsByHour).reduce((a, b) => a[1] > b[1] ? a : b)[0]}:00 hour
//                 - Variability: ${analysis.variability.toFixed(1)} mg/dL
//                 `;
//             }
            
//             // Try Gemini first if enabled, otherwise use Ollama or fallback
//             if (AI_CONFIG.gemini.enabled) {
//                 return await getGeminiResponse(question, context);
//             } else if (AI_CONFIG.ollama.enabled) {
//                 return await getOllamaResponse(question, context);
//             } else {
//                 return getFallbackResponse(question);
//             }
//         }
        
//         async function getGeminiResponse(question, context) {
//             try {
//                 // This is a simplified implementation - you'll need to use the actual Gemini API
//                 const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${AI_CONFIG.gemini.apiKey}`, {
//                 // const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${AI_CONFIG.gemini.apiKey}`, {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify({
//                         contents: [{
//                             parts: [{
//                                 text: `You are a diabetes specialist AI assistant. ${context} 
//                                 Please respond to this question: ${question}
//                                 Provide helpful, accurate information about diabetes management. 
//                                 If asked about medications, discuss both benefits and potential side effects.
//                                 Always include appropriate warnings about consulting healthcare providers.`
//                             }]
//                         }]
//                     })
//                 });
                
//                 const data = await response.json();
//                 return data.candidates[0].content.parts[0].text;
//             } catch (error) {
//                 console.error('Gemini API error:', error);
//                 throw error;
//             }
//         }
        
//         async function getOllamaResponse(question, context) {
//             try {
//                 const response = await fetch(`${AI_CONFIG.ollama.baseUrl}/api/generate`, {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify({
//                         model: 'llama2', // or another model you have installed
//                         prompt: `You are a diabetes specialist AI assistant. ${context} 
//                         Please respond to this question: ${question}
//                         Provide helpful, accurate information about diabetes management.`,
//                         stream: false
//                     })
//                 });
                
//                 const data = await response.json();
//                 return data.response;
//             } catch (error) {
//                 console.error('Ollama API error:', error);
//                 throw error;
//             }
//         }
        
//         function getFallbackResponse(question) {
//             // Simple rule-based responses as fallback
//             const lowerQuestion = question.toLowerCase();
            
//             if (lowerQuestion.includes('metformin')) {
//                 return "Metformin is a common first-line medication for type 2 diabetes. It works by reducing glucose production in the liver and improving insulin sensitivity. Common side effects include gastrointestinal issues like nausea and diarrhea, which often improve over time. Rare but serious side effects include lactic acidosis. Always take as prescribed and discuss any concerns with your doctor.";
//             }
//             else if (lowerQuestion.includes('insulin')) {
//                 return "Insulin is a hormone that helps glucose enter cells for energy. People with diabetes may need insulin therapy when other medications aren't enough. There are different types: rapid-acting, short-acting, intermediate-acting, and long-acting. Side effects can include hypoglycemia (low blood sugar), weight gain, and injection site reactions. It's crucial to follow your dosing instructions carefully and monitor your glucose levels regularly.";
//             }
//             else if (lowerQuestion.includes('high') || lowerQuestion.includes('hyperglycemia')) {
//                 return "Hyperglycemia (high blood sugar) occurs when your body doesn't have enough insulin or can't use insulin properly. Symptoms include increased thirst, frequent urination, fatigue, and blurred vision. To lower high glucose, stay hydrated, exercise if appropriate, and take medication as prescribed. If consistently high, consult your healthcare provider about adjusting your treatment plan.";
//             }
//             else if (lowerQuestion.includes('low') || lowerQuestion.includes('hypoglycemia')) {
//                 return "Hypoglycemia (low blood sugar) occurs when glucose drops too low, often below 70 mg/dL. Symptoms include shaking, sweating, dizziness, confusion, and hunger. Treat with 15-20g of fast-acting carbs (glucose tablets, juice, regular soda) and recheck in 15 minutes. If taking medications that can cause lows, always carry a fast-acting sugar source with you.";
//             }
//             else if (lowerQuestion.includes('diet') || lowerQuestion.includes('food') || lowerQuestion.includes('eat')) {
//                 return "A diabetes-friendly diet focuses on balanced meals with controlled carbohydrates, lean proteins, healthy fats, and plenty of non-starchy vegetables. Consider working with a dietitian to create a personalized meal plan. Generally, aim for consistent carb intake at meals, choose high-fiber foods, and limit added sugars and processed foods.";
//             }
//             else if (lowerQuestion.includes('exercise') || lowerQuestion.includes('activity')) {
//                 return "Exercise helps lower blood glucose and improves insulin sensitivity. Aim for at least 150 minutes of moderate-intensity exercise per week. Always check your glucose before exercising. If it's below 100 mg/dL, have a small snack. If above 250 mg/dL and you have type 1 diabetes, check for ketones. Avoid exercise if ketones are present.";
//             }
//             else {
//                 return "I'm a diabetes assistant focused on helping you manage your condition. For personalized medical advice, please consult your healthcare provider. You can ask me about medications, diet, exercise, or interpreting your glucose patterns.";
//             }
//         }
//     }
// });








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
  // AI chat (Gemini or Ollama)
  // =========================
//   async function handleAsk(){
//     const q = (questionInput?.value||'').trim();
//     if (!q) return;
//     addMessage(q, 'user');
//     questionInput.value='';

//     const typing = addTyping();

//     try {
//       const s = summarizeReadings(readings);
//       const prompt = buildPrompt(q, s);
//       const mode = (window.AI_CONFIG?.MODE||'gemini').toLowerCase();
//       let answer = '';
//       if (mode==='gemini') answer = await callGemini(prompt);
//       else answer = await callOllama(prompt);
//       removeTyping(typing);
//       addMessage(answer||"Sorry, I couldn't generate a response.", 'bot');
//     } catch (e){
//       console.error(e);
//       removeTyping(typing);
//       addMessage('I hit an error generating an answer. Please try again.', 'bot');
//     }
//   }
async function handleAsk(){
    const q = (questionInput?.value||'').trim();
    if (!q) return;
    addMessage(q, 'user');
    questionInput.value='';

    const typing = addTyping();

    try {
        // Get user's name from Firestore
        const userName = await getUserName();
        
        const s = summarizeReadings(readings);
        const prompt = buildPrompt(q, s, userName);
        const mode = (window.AI_CONFIG?.MODE||'gemini').toLowerCase();
        let answer = '';
        if (mode==='gemini') answer = await callGemini(prompt);
        else answer = await callOllama(prompt);
        removeTyping(typing);
        addMessage(answer||"Sorry, I couldn't generate a response.", 'bot');
    } catch (e){
        console.error(e);
        removeTyping(typing);
        addMessage('I hit an error generating an answer. Please try again.', 'bot');
    }
}
//   function buildPrompt(userQuestion, summary){
//     const medIntent = /medicin|medicine|drug|pill|tablet|insulin|metformin|sulfonylurea|glp|sglt|dpp|ozempic|semaglutide|tirzepatide|jardiance|metformin/i.test(userQuestion);
//     const summaryText = `DATA SUMMARY\n- Count: ${summary.count}\n- Time-in-Range: ${summary.tirPct.toFixed(0)}% (70–180 mg/dL)\n- Avg: ${summary.avg.toFixed(0)}, SD: ${summary.sd.toFixed(0)}\n- Peak hour: ${summary.topHourLabel}\n- Post-meal Δ: ${summary.postMealDelta.toFixed(0)} (hotspot: ${summary.postMealHotspot})\n- Night avg: ${summary.nightAvg.toFixed(0)}, Morning avg: ${summary.morningAvg.toFixed(0)}\n- Weekday vs Weekend avg: ${summary.weekdayAvg.toFixed(0)} / ${summary.weekendAvg.toFixed(0)}\n`;

//     const task = medIntent ? `The user is asking about a medicine. Provide:
// - What it is typically used for in diabetes care (if applicable)
// - Pros (benefits)
// - Cons / common side effects
// - General warnings/contraindications
// - A one-line friendly disclaimer to consult their clinician.
// Avoid dosing or individualized advice.` : `Analyze their question using the data summary. Mention concrete numbers and suggestions (hydration, walking, meal composition), but DO NOT give medical advice. Include a brief disclaimer.`;

//     return `${window.AI_CONFIG?.SYSTEM_PROMPT || ''}\n\n${summaryText}\nUser question: ${userQuestion}\n\nTask: ${task}`;
//   }
function buildPrompt(userQuestion, summary, userName) {
    const medIntent = /medicin|medicine|drug|pill|tablet|insulin|metformin|sulfonylurea|glp|sglt|dpp|ozempic|semaglutide|tirzepatide|jardiance|metformin/i.test(userQuestion);
    const summaryText = `DATA SUMMARY\n- User Name: ${userName}\n- Count: ${summary.count}\n- Time-in-Range: ${summary.tirPct.toFixed(0)}% (70–180 mg/dL)\n- Avg: ${summary.avg.toFixed(0)}, SD: ${summary.sd.toFixed(0)}\n- Peak hour: ${summary.topHourLabel}\n- Post-meal Δ: ${summary.postMealDelta.toFixed(0)} (hotspot: ${summary.postMealHotspot})\n- Night avg: ${summary.nightAvg.toFixed(0)}, Morning avg: ${summary.morningAvg.toFixed(0)}\n- Weekday vs Weekend avg: ${summary.weekdayAvg.toFixed(0)} / ${summary.weekendAvg.toFixed(0)}\n`;

    // const task = medIntent ? `The user ${userName} is asking about a medicine. Provide:
    const task = medIntent ? `The user  is asking about a medicine. Provide:
- What it is typically used for in diabetes care (if applicable)
- Pros (benefits)
- Cons / common side effects
- General warnings/contraindications
- A one-line friendly disclaimer to consult their clinician.
Avoid dosing or individualized advice.` : `Analyze ${userName}'s question using the data summary. Mention concrete numbers and suggestions (hydration, walking, meal composition), but DO NOT give medical advice. Include a brief disclaimer.`;

    return `${window.AI_CONFIG?.SYSTEM_PROMPT || ''}\n\n${summaryText}\nUser question: ${userQuestion}\n\nTask: ${task}`;
}
  async function callGemini(prompt){
    const key = window.AI_CONFIG?.GEMINI_API_KEY;
    const model = window.AI_CONFIG?.GEMINI_MODEL || 'gemini-1.5-flash';
    if (!key) return 'Gemini API key is missing in ai-config.js.';

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`;
    const body = {
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
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

  async function callOllama(prompt){
    const host = window.AI_CONFIG?.OLLAMA?.HOST || 'http://localhost:11434';
    const model = window.AI_CONFIG?.OLLAMA?.MODEL || 'qwen2.5-coder:3b';
    const url = host.replace(/\/$/, '') + '/api/chat';
    const body = {
      model,
      messages: [
        { role:'system', content: window.AI_CONFIG?.SYSTEM_PROMPT || '' },
        { role:'user', content: prompt }
      ],
      stream: false
    };
    const res = await fetch(url, {
      method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error('Ollama HTTP '+res.status);
    const data = await res.json();
    const text = data?.message?.content || '';
    return text.trim();
  }

  // =========================
  // Chat UI helpers
  // =========================
//   function addMessage(text, who){
//     const bubble = document.createElement('div');
//     bubble.className = `ai-message ai-message-${who==='bot'?'bot':'user'}`;
//     bubble.innerHTML = `
//       <div class="ai-avatar"><i class="fas fa-${who==='bot'?'robot':'user'}"></i></div>
//       <div class="ai-text"><p>${escapeHtml(text)}</p></div>
//     `;
//     chatMessages.appendChild(bubble);
//     chatMessages.scrollTop = chatMessages.scrollHeight;
//   }
// function addMessage(text, who){
//   const bubble = document.createElement('div');
//   bubble.className = `ai-message ai-message-${who==='bot'?'bot':'user'}`;

//   if (who === 'bot') {
//     bubble.innerHTML = `
//       <div class="ai-avatar">
//         <i class="ri-brain-2-fill"></i>
//       </div>
//       <div class="ai-text"><p>${escapeHtml(text)}</p></div>
//     `;
//   } else {
//     bubble.innerHTML = `
//       <div class="ai-avatar">
//                             <img id="currentProfileImage" src="" alt="Current Profile Image" class="profile-image">

//       </div>
//       <div class="ai-text"><p>${escapeHtml(text)}</p></div>
//     `;
//   }

//   chatMessages.appendChild(bubble);
//   chatMessages.scrollTop = chatMessages.scrollHeight;
// }
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
  // if (who === 'bot') {
  //   bubble.innerHTML = `
  //     <div class="ai-avatar">
  //                                           <div class="robot-avatar">
  //                                       <div class="eye"></div>
  //                                       <div class="eye"></div>
  //                                   </div>
  //     </div>
  //     <div class="ai-text"><p>${escapeHtml(text)}</p></div>
  //   `;
  // } else {
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
// function addMessage(text, who){
//   const bubble = document.createElement('div');
//   bubble.className = `ai-message ai-message-${who==='bot'?'bot':'user'}`;

//   if (who === 'bot') {
//     bubble.innerHTML = `
//       <div class="ai-avatar">
//         <i class="ri-brain-2-fill"></i>
//       </div>
//       <div class="ai-text"><p>${escapeHtml(text)}</p></div>
//     `;
//   } else {
//     // Get user data from Firestore for the profile image
//     db.collection('users').doc(currentUser.uid).get()
//       .then((doc) => {
//         if (doc.exists) {
//           const userData = doc.data();
//           const profileImage = userData.profileImage || 'images/user.png';
          
//           bubble.innerHTML = `
//             <div class="ai-avatar">
//               <img src="${profileImage}" alt="User Profile" class="user-chat-avatar">
//             </div>
//             <div class="ai-text"><p>${escapeHtml(text)}</p></div>
//           `;
          
//           chatMessages.appendChild(bubble);
//           chatMessages.scrollTop = chatMessages.scrollHeight;
//         }
//       })
//       .catch((error) => {
//         console.error('Error loading user data:', error);
//         // Fallback to default avatar
//         bubble.innerHTML = `
//           <div class="ai-avatar">
//             <img src="images/user.png" alt="User Profile" class="user-chat-avatar">
//           </div>
//           <div class="ai-text"><p>${escapeHtml(text)}</p></div>
//         `;
//         chatMessages.appendChild(bubble);
//         chatMessages.scrollTop = chatMessages.scrollHeight;
//       });
      
//     return; // Return early since we're handling the append in the promise
//   }

//   chatMessages.appendChild(bubble);
//   chatMessages.scrollTop = chatMessages.scrollHeight;
// }
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
  <!-- <span class="loader-letter">t</span>
  <span class="loader-letter">i</span>
  <span class="loader-letter">n</span>
  <span class="loader-letter">g</span> -->

  <div class="loader"></div>
</div>
    `;
    // el.innerHTML = `
    //   <div class="ai-avatar"><i class="fas fa-robot"></i></div>
    //   <div class="ai-text"><em>typing…</em></div>
    // `;
    chatMessages.appendChild(el);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return el;
  }
  function removeTyping(el){ if (el && el.parentNode) el.parentNode.removeChild(el); }

  function escapeHtml(str){
    return String(str).replace(/[&<>"']/g, s=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[s]));
  }
})();
