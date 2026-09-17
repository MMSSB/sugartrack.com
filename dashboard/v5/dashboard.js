// // dashboard.js - Fixed to show correct recent readings and improved averages
// import { auth, db, collection, addDoc, query, where, orderBy, limit, onSnapshot, Timestamp } from "./firebase-init.js";

// // ========== CONFIGURATION ==========
// const RECENT_READINGS_TO_SHOW = 4; 
// // ===================================

// let allReadings = [];
// let currentUser = null;
// let unsubscribe = null;

// // Helper function to format time
// function formatTime12Hour(time) {
//     if (!time) return "";
//     const [hours, minutes] = time.split(':');
//     let period = 'AM';
//     let hours12 = parseInt(hours, 10);

//     if (hours12 >= 12) {
//         period = 'PM';
//         if (hours12 > 12) hours12 -= 12;
//     } else if (hours12 === 0) {
//         hours12 = 12;
//     }
//     return `${hours12}:${minutes} ${period}`;
// }

// // Status functions
// function getStatusClass(glucose) {
//     if (glucose < 70) return 'low';           
//     if (glucose >= 70 && glucose <= 130) return 'normal'; 
//     if (glucose > 130 && glucose <= 180) return 'mid';    
//     return 'high';                             
// }

// function getStatusText(glucose) {
//     if (glucose < 70) return 'Low';
//     if (glucose >= 70 && glucose <= 130) return 'In Range';
//     if (glucose > 130 && glucose <= 180) return 'High';
//     return 'Very High';
// }

// function getStatusColor(glucose) {
//     if (glucose < 70) return '#ef4444';      
//     if (glucose >= 70 && glucose <= 130) return '#10b981';  
//     if (glucose > 130 && glucose <= 180) return '#f59e0b';  
//     return '#dc2626';                        
// }

// // Calculate intelligent average based on time-weighted readings
// function calculateIntelligentAverage(readings, days = 7) {
//     if (!readings || readings.length === 0) return 0;
    
//     const now = new Date();
//     const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    
//     const relevantReadings = readings.filter(r => r.timestamp >= cutoffDate);
//     if (relevantReadings.length === 0) return 0;
    
//     const sortedReadings = [...relevantReadings].sort((a, b) => a.timestamp - b.timestamp);
    
//     let totalWeightedValue = 0;
//     let totalWeight = 0;
    
//     for (let i = 0; i < sortedReadings.length; i++) {
//         const current = sortedReadings[i];
//         const ageInHours = (now - current.timestamp) / (1000 * 60 * 60);
//         let weight = 1;
        
//         if (ageInHours < 24) weight = 1.5; 
//         else if (ageInHours < 72) weight = 1.2; 
//         else if (ageInHours < 168) weight = 1.0; 
//         else weight = 0.8; 
        
//         if (i > 0) {
//             const gapHours = (current.timestamp - sortedReadings[i-1].timestamp) / (1000 * 60 * 60);
//             if (gapHours > 12) weight *= 1.1; 
//         }
        
//         totalWeightedValue += current.glucose * weight;
//         totalWeight += weight;
//     }
    
//     return Math.round(totalWeightedValue / totalWeight);
// }

// // Calculate A1C
// function calculateA1C(avgGlucose) {
//     if (avgGlucose === 0) return '5.8';
//     const a1c = (avgGlucose + 46.7) / 28.7;
//     return a1c.toFixed(1);
// }

// function getTimeBasedGreeting() {
//     const hour = new Date().getHours();
//     if (hour < 12) return 'Good morning';
//     if (hour < 17) return 'Good afternoon';
//     return 'Good evening';
// }

// document.addEventListener("DOMContentLoaded", () => {
//     auth.onAuthStateChanged((user) => {
//         if (user) {
//             currentUser = user;
//             initDashboard(user);
//             loadUserInfo(user);
//         } else {
//             window.location.href = 'login.html';
//         }
//     });

//     setupModalListeners();
// });

// function loadUserInfo(user) {
//     db.collection('users').doc(user.uid).get().then((doc) => {
//         if (doc.exists) {
//             const userData = doc.data();
            
//             const welcomeEl = document.querySelector('.hero-section h1');
//             if (welcomeEl) {
//                 const firstName = userData.firstName || user.email.split('@')[0];
//                 const greeting = getTimeBasedGreeting();
//                 welcomeEl.textContent = `${greeting}, ${firstName} 👋`;
//             }
            
//             const dateEl = document.getElementById('currentDateDisplay');
//             if (dateEl) {
//                 const now = new Date();
//                 dateEl.textContent = now.toLocaleDateString('en-US', { 
//                     weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
//                 });
//             }
//         }
//     }).catch(error => console.error("Error loading user info:", error));
// }

// function initDashboard(user) {
//     if (unsubscribe) unsubscribe();

//     const readingsRef = collection(db, "readings");
//     const q = query(
//         readingsRef, 
//         where("userId", "==", user.uid),
//         orderBy("timestamp", "desc"),
//         limit(100) 
//     );

//     unsubscribe = onSnapshot(q, (snapshot) => {
//         const newReadings = [];
        
//         snapshot.forEach(doc => {
//             const data = doc.data();
//             let timestamp = new Date();
//             if (data.timestamp) timestamp = data.timestamp.toDate ? data.timestamp.toDate() : new Date(data.timestamp);
//             else if (data.created) timestamp = data.created.toDate ? data.created.toDate() : new Date(data.created);
            
//             newReadings.push({ 
//                 id: doc.id,
//                 glucose: data.glucose || data.value || 0,
//                 comment: data.comment || data.notes || data.context || '',
//                 date: data.date || timestamp.toISOString().split('T')[0],
//                 time: data.time || `${timestamp.getHours().toString().padStart(2,'0')}:${timestamp.getMinutes().toString().padStart(2,'0')}`,
//                 timestamp: timestamp,
//                 context: data.context || data.tag || 'Manual',
//                 ...data 
//             });
//         });
        
//         allReadings = newReadings;
//         updateDashboardUI(allReadings);
        
//     }, (error) => {
//         console.error("Error fetching data:", error);
//         if (allReadings.length > 0) updateDashboardUI(allReadings);
//     });
// }

// function updateDashboardUI(readings) {
//     if (!readings || readings.length === 0) {
//         updateStats([]);
//         updateRecentReadingsList([]);
//         updateChart([]);
//         return;
//     }
    
//     updateStats(readings);
//     updateRecentReadingsList(readings);
//     updateChart(readings);
// }

// function updateStats(readings) {
//     if (!readings || readings.length === 0) {
//         setStatValue('.stat-card:nth-child(1) .stat-val', '0', 'mg/dL');
//         setStatValue('.stat-card:nth-child(2) .stat-val', '0', 'mg/dL');
//         setStatValue('.stat-card:nth-child(3) .stat-val', '5.8', '%');
//         setStatValue('.stat-card:nth-child(4) .stat-val', '0');
//         document.querySelectorAll('.stat-change').forEach(el => el.innerHTML = '');
//         return;
//     }

//     const sortedReadings = [...readings].sort((a, b) => b.timestamp - a.timestamp);

//     // Last Reading
//     const last = sortedReadings[0];
//     const lastEl = document.querySelector('.stat-card:nth-child(2) .stat-val');
//     if(lastEl) {
//         lastEl.innerHTML = `${last.glucose} <span style="font-size: 1rem; color: var(--text-secondary); font-weight:400;">mg/dL</span>`;
        
//         const timeAgoEl = document.querySelector('.stat-card:nth-child(2) .stat-change');
//         if (timeAgoEl) {
//             const diffMins = Math.floor((new Date() - last.timestamp) / 60000);
//             let timeAgoText = '';
//             if (diffMins < 1) timeAgoText = 'Just now';
//             else if (diffMins < 60) timeAgoText = `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
//             else if (diffMins < 1440) timeAgoText = `${Math.floor(diffMins / 60)} hour${Math.floor(diffMins / 60) !== 1 ? 's' : ''} ago`;
//             else timeAgoText = `${Math.floor(diffMins / 1440)} day${Math.floor(diffMins / 1440) !== 1 ? 's' : ''} ago`;
            
//             const statusColor = getStatusColor(last.glucose);
//             timeAgoEl.innerHTML = `<span style="color: ${statusColor};">● ${getStatusText(last.glucose)}</span> • ${timeAgoText}`;
//         }
//     }

//     // Intelligent Average
//     const intelligentAvg = calculateIntelligentAverage(readings, 7);
//     const avgEl = document.querySelector('.stat-card:nth-child(1) .stat-val');
//     if(avgEl) avgEl.innerHTML = `${intelligentAvg} <span style="font-size: 1rem; color: var(--text-secondary); font-weight:400;">mg/dL</span>`;
    
//     // Trend Calculation
//     const now = new Date();
//     const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
//     const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    
//     const currentWeekReadings = readings.filter(r => r.timestamp >= oneWeekAgo);
//     const prevWeekReadings = readings.filter(r => r.timestamp >= twoWeeksAgo && r.timestamp < oneWeekAgo);
    
//     const trendEl = document.querySelector('.stat-card:nth-child(1) .stat-change');
//     if (currentWeekReadings.length > 0 && prevWeekReadings.length > 0) {
//         const currentAvg = calculateIntelligentAverage(readings, 7);
//         const prevAvg = calculateIntelligentAverage(readings.filter(r => r.timestamp < oneWeekAgo && r.timestamp >= twoWeeksAgo), 7);
        
//         const change = currentAvg - prevAvg;
//         const changePercent = prevAvg !== 0 ? Math.round((change / prevAvg) * 100) : 0;
        
//         if (trendEl) {
//             const changeClass = change < 0 ? 'positive' : (change > 0 ? 'negative' : 'neutral');
//             const arrow = change < 0 ? '↓' : (change > 0 ? '↑' : '→');
//             trendEl.innerHTML = `${arrow} ${Math.abs(changePercent)}% vs last week`;
//             trendEl.className = `stat-change ${changeClass}`;
//         }
//     } else {
//         if (trendEl) {
//             // FIX: Graceful UI indicator when not enough data for a trend exists
//             trendEl.innerHTML = readings.length > 0 
//                 ? '<span style="color: var(--text-secondary); font-size: 0.85rem;"><i class="ph ph-chart-line" style="margin-right: 4px;"></i> Building trend data...</span>' 
//                 : '';
//             trendEl.className = 'stat-change neutral'; 
//         }
//     }

//     // Readings Today
//     const today = new Date().toISOString().split('T')[0];
//     const todayReadings = readings.filter(r => r.date === today).length;
//     const todayEl = document.querySelector('.stat-card:nth-child(4) .stat-val');
//     if (todayEl) {
//         todayEl.textContent = todayReadings;
//         const recEl = document.querySelector('.stat-card:nth-child(4) .stat-change');
//         if (recEl) {
//             if (todayReadings === 0) recEl.innerHTML = '<span style="color: #ef4444;"><i class="fa-solid fa-triangle-exclamation" style="color: #ef4444;"></i> No readings yet today</span>';
//             else if (todayReadings < 4) recEl.innerHTML = `<span style="color: #f59e0b;"><i class="fa-solid fa-chart-column" style="color: #f59e0b;"></i> ${4 - todayReadings} more recommended today</span>`;
//             else if (todayReadings >= 6) recEl.innerHTML = '<span style="color: #10b981;"><i class="fa-solid fa-square-check" style="color: #10b981;"></i> Great job! Target reached</span>';
//             else recEl.innerHTML = `<span>${6 - todayReadings} more to reach target</span>`;
//         }
//     }
//     // if (todayEl) {
//     //     todayEl.textContent = todayReadings;
//     //     const recEl = document.querySelector('.stat-card:nth-child(4) .stat-change');
//     //     if (recEl) {
//     //         if (todayReadings === 0) recEl.innerHTML = '<span style="color: #ef4444;">⚠️ No readings yet today</span>';
//     //         else if (todayReadings < 4) recEl.innerHTML = `<span style="color: #f59e0b;">📊 ${4 - todayReadings} more recommended today</span>`;
//     //         else if (todayReadings >= 6) recEl.innerHTML = '<span style="color: #10b981;">✅ Great job! Target reached</span>';
//     //         else recEl.innerHTML = `<span>${6 - todayReadings} more to reach target</span>`;
//     //     }
//     // }

//     // A1C estimate
//     const avgGlucose = calculateIntelligentAverage(readings, 30); 
//     const estimatedA1C = calculateA1C(avgGlucose);
//     const a1cEl = document.querySelector('.stat-card:nth-child(3) .stat-val');
//     if (a1cEl) {
//         a1cEl.innerHTML = `${estimatedA1C} <span style="font-size: 1rem; color: var(--text-secondary); font-weight:400;">%</span>`;
//         const a1cStatusEl = document.querySelector('.stat-card:nth-child(3) .stat-change');
//         if (a1cStatusEl) {
//             const a1cNum = parseFloat(estimatedA1C);
//             if (a1cNum < 5.7) a1cStatusEl.innerHTML = '<span style="color: #10b981;">● Normal</span>';
//             else if (a1cNum < 6.5) a1cStatusEl.innerHTML = '<span style="color: #f59e0b;">● Prediabetes</span>';
//             else a1cStatusEl.innerHTML = '<span style="color: #ef4444;">● Diabetes Range</span>';
//         }
//     }
// }

// function setStatValue(selector, value, unit = '') {
//     const el = document.querySelector(selector);
//     if (el) {
//         if (unit) el.innerHTML = `${value} <span style="font-size: 1rem; color: var(--text-secondary); font-weight:400;">${unit}</span>`;
//         else el.textContent = value;
//     }
// }

// function updateRecentReadingsList(readings) {
//     const listContainer = document.querySelector('.readings-list');
//     if (!listContainer) return;

//     const header = listContainer.querySelector('.reading-header');
//     listContainer.innerHTML = '';
//     if (header) listContainer.appendChild(header);

//     if (!readings || readings.length === 0) {
//         listContainer.innerHTML += `<div class="reading-item">
//             <div style="width:100%; text-align:center; padding:2rem; color:var(--text-secondary);">
//             <i class="ph ph-drop-half" style="font-size: 2rem; margin-bottom: 0.5rem; display: block;"></i>
//             No readings yet. Click "Add Reading" to get started!</div></div>`;
//         return;
//     }

//     const sortedReadings = [...readings].sort((a, b) => b.timestamp - a.timestamp);
//     const recentReadings = sortedReadings.slice(0, RECENT_READINGS_TO_SHOW);

//     recentReadings.forEach((r, index) => {
//         const timeStr = formatTime12Hour(r.time);
//         const today = new Date().toISOString().split('T')[0];
//         const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        
//         let dateStr = '';
//         if (r.date === today) dateStr = 'Today';
//         else if (r.date === yesterday) dateStr = 'Yesterday';
//         else {
//             const diffDays = Math.floor((new Date() - new Date(r.date)) / (1000 * 60 * 60 * 24));
//             dateStr = diffDays < 7 ? new Date(r.date).toLocaleDateString('en-US', { weekday: 'long' }) : new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
//         }
        
//         let colorClass = getStatusClass(r.glucose);
//         const item = document.createElement('div');
//         item.className = 'reading-item';
//         item.style.animation = `fadeIn 0.3s ease forwards ${index * 0.05}s`;
//         item.style.opacity = '0';
        
//         item.innerHTML = `
//             <div class="r-val ${colorClass}">${r.glucose}</div>
//             <div class="r-info">
//                 <span class="r-time">${timeStr}</span>
//                 <span class="r-date">${dateStr}</span>
//             </div>
//             <div class="r-tag" style="background: ${getStatusColor(r.glucose)}20; color: ${getStatusColor(r.glucose)};">
//                 <i class="ph ph-${r.context === 'Fasting' ? 'sun' : (r.context === 'Post-Meal' ? 'fork-knife' : 'moon-stars')}" style="margin-right: 4px;"></i>
//                 ${r.context || 'Manual'}
//             </div>
//         `;
//         listContainer.appendChild(item);
//     });
    
//     if (readings.length > RECENT_READINGS_TO_SHOW) {
//         listContainer.innerHTML += `
//             <div class="reading-item view-all">
//                 <div style="width:100%; text-align:center; padding:0.75rem; color:var(--info); cursor:pointer; font-weight: 500;" onclick="window.location.href='readings.html'">
//                     View all ${readings.length} readings <i class="ph ph-arrow-right"></i>
//                 </div>
//             </div>`;
//     }
// }

// function updateChart(readings) {
//     if (!readings || readings.length === 0) {
//         if (window.leadsChart) {
//             window.leadsChart.data.labels = [];
//             window.leadsChart.data.datasets[0].data = [];
//             window.leadsChart.update();
//         }
//         return;
//     }
    
//     const sortedReadings = [...readings].sort((a, b) => a.timestamp - b.timestamp);
//     const chartData = sortedReadings.slice(-14);
    
//     const labels = chartData.map(r => {
//         const d = r.timestamp;
//         const isToday = d.toDateString() === new Date().toDateString();
//         return isToday ? formatTime12Hour(r.time).replace(' ', '\n') : `${d.getMonth()+1}/${d.getDate()}\n${formatTime12Hour(r.time).split(' ')[1] || ''}`;
//     });
    
//     const dataPoints = chartData.map(r => r.glucose);
    
//     if (window.leadsChart) {
//         window.leadsChart.data.labels = labels;
//         window.leadsChart.data.datasets[0].data = dataPoints;
//         window.leadsChart.data.datasets[0].borderColor = '#3b82f6';
//         window.leadsChart.data.datasets[0].backgroundColor = (context) => {
//             const chart = context.chart;
//             const {ctx, chartArea} = chart;
//             if (!chartArea) return null;
//             const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
//             gradient.addColorStop(0, '#3b82f6');
//             gradient.addColorStop(1, '#8b5cf6');
//             return gradient;
//         };
        
//         window.leadsChart.options.plugins = window.leadsChart.options.plugins || {};
//         window.leadsChart.options.plugins.annotation = {
//             annotations: {
//                 targetLow: { type: 'line', yMin: 70, yMax: 70, borderColor: '#10b981', borderWidth: 1, borderDash: [5, 5], label: { content: 'Target Range', enabled: true, position: 'end' } },
//                 targetHigh: { type: 'line', yMin: 130, yMax: 130, borderColor: '#10b981', borderWidth: 1, borderDash: [5, 5] }
//             }
//         };
//         window.leadsChart.update();
//     }
// }

// const style = document.createElement('style');
// style.textContent = `
//     @keyframes fadeIn {
//         from { opacity: 0; transform: translateY(10px); }
//         to { opacity: 1; transform: translateY(0); }
//     }
//     .reading-item { transition: all 0.2s ease; }
//     .reading-item:hover { background: var(--bg-hover); transform: translateX(5px); }
//     .stat-change.positive { color: #10b981; }
//     .stat-change.negative { color: #ef4444; }
//     .stat-change.neutral { color: var(--text-secondary); }
//     .r-val.low { color: #ef4444; }
//     .r-val.normal { color: #10b981; }
//     .r-val.mid { color: #f59e0b; }
//     .r-val.high { color: #dc2626; }
// `;
// document.head.appendChild(style);

// function setupModalListeners() {
//     const addBtn = document.getElementById('addReadingBtn');
//     const modal = document.getElementById('readingModal');
//     const closeBtn = document.getElementById('closeModalBtn');
//     const cancelBtn = document.getElementById('cancelBtn');
//     const addForm = document.getElementById('addReadingForm');
    
//     if (addBtn) {
//         addBtn.addEventListener('click', () => {
//             const now = new Date();
//             const dateInput = document.getElementById('inputDate');
//             const timeInput = document.getElementById('inputTime');
//             if (dateInput) dateInput.value = now.toISOString().split('T')[0];
//             if (timeInput) timeInput.value = now.toTimeString().slice(0, 5);
//             modal.classList.add('active');
//             document.body.style.overflow = 'hidden';
//         });
//     }
    
//     function closeModal() {
//         modal.classList.remove('active');
//         document.body.style.overflow = '';
//     }
    
//     if (closeBtn) closeBtn.addEventListener('click', closeModal);
//     if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
//     if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    
//     if (addForm) {
//         addForm.addEventListener('submit', async (e) => {
//             e.preventDefault();
//             if (!currentUser) return;
            
//             const dateVal = document.getElementById('inputDate').value;
//             const timeVal = document.getElementById('inputTime').value;
//             const glucoseVal = parseInt(document.getElementById('inputGlucose').value);
//             const notes = document.querySelector('textarea')?.value || '';
            
//             if (!glucoseVal || glucoseVal < 1 || glucoseVal > 600) {
//                 alert('Please enter a valid glucose level (1-600 mg/dL)');
//                 return;
//             }
            
//             const submitBtn = addForm.querySelector('button[type="submit"]');
//             const originalText = submitBtn.textContent;
//             submitBtn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Saving...';
//             submitBtn.disabled = true;
            
//             try {
//                 const dateTimeString = `${dateVal}T${timeVal}`;
//                 const timestamp = new Date(dateTimeString);
//                 const hour = parseInt(timeVal.split(':')[0]);
//                 let context = 'Manual';
//                 if (hour < 8) context = 'Fasting';
//                 else if (hour >= 11 && hour <= 14) context = 'Post-Meal';
//                 else if (hour >= 17 && hour <= 20) context = 'Post-Meal';
//                 else if (hour >= 21 || hour <= 5) context = 'Bedtime';
//                 else context = 'Pre-Meal';
                
//                 await addDoc(collection(db, "readings"), {
//                     userId: currentUser.uid,
//                     glucose: glucoseVal,
//                     comment: notes,
//                     date: dateVal,
//                     time: timeVal,
//                     timestamp: Timestamp.fromDate(timestamp),
//                     created: Timestamp.now(),
//                     context: context
//                 });
                
//                 closeModal();
//                 addForm.reset();
//                 showNotification('Reading added successfully!', 'success');
                
//             } catch (error) {
//                 console.error("Error adding reading:", error);
//                 showNotification('Error saving reading. Please try again.', 'error');
//             } finally {
//                 submitBtn.innerHTML = originalText;
//                 submitBtn.disabled = false;
//             }
//         });
//     }
// }

// function showNotification(message, type = 'success') {
//     const existingNotifications = document.querySelectorAll('.custom-notification');
//     existingNotifications.forEach(notification => notification.remove());
    
//     const notification = document.createElement('div');
//     notification.className = `custom-notification ${type}`;
//     notification.innerHTML = `<div class="notification-content"><i class="ph ph-${type === 'success' ? 'check-circle' : 'warning-circle'}"></i><span>${message}</span></div>`;
    
//     notification.style.cssText = `
//         position: fixed; bottom: 20px; right: 20px;
//         background: ${type === 'success' ? '#10b981' : '#ef4444'}; color: white;
//         padding: 1rem 1.5rem; border-radius: 0.75rem; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
//         z-index: 10000; max-width: 300px; animation: slideIn 0.3s ease;
//     `;
    
//     document.body.appendChild(notification);
    
//     setTimeout(() => {
//         notification.style.animation = 'slideOut 0.3s ease';
//         setTimeout(() => { if (notification.parentNode) notification.parentNode.removeChild(notification); }, 300);
//     }, 3000);
// }

// window.addEventListener('beforeunload', () => { if (unsubscribe) unsubscribe(); });
























// // dashboard.js 
// import { auth, db, collection, addDoc, query, where, orderBy, limit, onSnapshot, Timestamp } from "./firebase-init.js";
// import { getSmartGreeting } from "./greetings.js"; // Import the new module

// const RECENT_READINGS_TO_SHOW = 4; 

// let allReadings = [];
// let currentUser = null;
// let unsubscribe = null;

// function formatTime12Hour(time) {
//     if (!time) return "";
//     const [hours, minutes] = time.split(':');
//     let period = 'AM';
//     let hours12 = parseInt(hours, 10);
//     if (hours12 >= 12) {
//         period = 'PM';
//         if (hours12 > 12) hours12 -= 12;
//     } else if (hours12 === 0) {
//         hours12 = 12;
//     }
//     return `${hours12}:${minutes} ${period}`;
// }

// function getStatusClass(glucose) {
//     if (glucose < 70) return 'low';           
//     if (glucose >= 70 && glucose <= 130) return 'normal'; 
//     if (glucose > 130 && glucose <= 180) return 'mid';    
//     return 'high';                             
// }

// function getStatusText(glucose) {
//     if (glucose < 70) return 'Low';
//     if (glucose >= 70 && glucose <= 130) return 'In Range';
//     if (glucose > 130 && glucose <= 180) return 'High';
//     return 'Very High';
// }

// function getStatusColor(glucose) {
//     if (glucose < 70) return '#ef4444';      
//     if (glucose >= 70 && glucose <= 130) return '#10b981';  
//     if (glucose > 130 && glucose <= 180) return '#f59e0b';  
//     return '#dc2626';                        
// }

// function calculateIntelligentAverage(readings, days = 7) {
//     if (!readings || readings.length === 0) return 0;
    
//     const now = new Date();
//     const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
//     const relevantReadings = readings.filter(r => r.timestamp >= cutoffDate);
//     if (relevantReadings.length === 0) return 0;
    
//     const sortedReadings = [...relevantReadings].sort((a, b) => a.timestamp - b.timestamp);
//     let totalWeightedValue = 0;
//     let totalWeight = 0;
    
//     for (let i = 0; i < sortedReadings.length; i++) {
//         const current = sortedReadings[i];
//         const ageInHours = (now - current.timestamp) / (1000 * 60 * 60);
//         let weight = 1;
        
//         if (ageInHours < 24) weight = 1.5; 
//         else if (ageInHours < 72) weight = 1.2; 
//         else if (ageInHours < 168) weight = 1.0; 
//         else weight = 0.8; 
        
//         if (i > 0) {
//             const gapHours = (current.timestamp - sortedReadings[i-1].timestamp) / (1000 * 60 * 60);
//             if (gapHours > 12) weight *= 1.1; 
//         }
        
//         totalWeightedValue += current.glucose * weight;
//         totalWeight += weight;
//     }
//     return Math.round(totalWeightedValue / totalWeight);
// }

// function calculateA1C(avgGlucose) {
//     if (avgGlucose === 0) return '5.8';
//     const a1c = (avgGlucose + 46.7) / 28.7;
//     return a1c.toFixed(1);
// }

// document.addEventListener("DOMContentLoaded", () => {
//     auth.onAuthStateChanged((user) => {
//         if (user) {
//             currentUser = user;
//             initDashboard(user);
//             loadUserInfo(user);
//         } else {
//             window.location.href = 'login.html';
//         }
//     });
//     setupModalListeners();
// });

// // function loadUserInfo(user) {
// //     db.collection('users').doc(user.uid).get().then((doc) => {
// //         if (doc.exists) {
// //             const userData = doc.data();
// //             const welcomeEl = document.querySelector('.hero-section h1');
// //             if (welcomeEl) {
// //                 const firstName = userData.firstName || user.email.split('@')[0];
// //                 // Use the new global greetings engine
// //                 welcomeEl.textContent = getSmartGreeting(firstName);
// //             }
            
// //             const dateEl = document.getElementById('currentDateDisplay');
// //             if (dateEl) {
// //                 const now = new Date();
// //                 dateEl.textContent = now.toLocaleDateString('en-US', { 
// //                     weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
// //                 });
// //             }
// //         }
// //     }).catch(error => console.error("Error loading user info:", error));
// // }
// function loadUserInfo(user) {
//     db.collection('users').doc(user.uid).get().then((doc) => {
//         if (doc.exists) {
//             const userData = doc.data();
//             const welcomeEl = document.querySelector('.hero-section h1');
//             if (welcomeEl) {
//                 const firstName = userData.firstName || user.email.split('@')[0];
//                 // Pass the date of birth into the greeting engine here too!
//                 welcomeEl.textContent = getSmartGreeting(firstName, userData.dateOfBirth);
//             }
            
//             const dateEl = document.getElementById('currentDateDisplay');
//             if (dateEl) {
//                 const now = new Date();
//                 dateEl.textContent = now.toLocaleDateString('en-US', { 
//                     weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
//                 });
//             }
//         }
//     }).catch(error => console.error("Error loading user info:", error));
// }
// function initDashboard(user) {
//     if (unsubscribe) unsubscribe();

//     const readingsRef = collection(db, "readings");
//     const q = query(
//         readingsRef, 
//         where("userId", "==", user.uid),
//         orderBy("timestamp", "desc"),
//         limit(100) 
//     );

//     unsubscribe = onSnapshot(q, (snapshot) => {
//         const newReadings = [];
        
//         snapshot.forEach(doc => {
//             const data = doc.data();
//             let timestamp = new Date();
//             if (data.timestamp) timestamp = data.timestamp.toDate ? data.timestamp.toDate() : new Date(data.timestamp);
//             else if (data.created) timestamp = data.created.toDate ? data.created.toDate() : new Date(data.created);
            
//             newReadings.push({ 
//                 id: doc.id,
//                 glucose: data.glucose || data.value || 0,
//                 comment: data.comment || data.notes || data.context || '',
//                 date: data.date || timestamp.toISOString().split('T')[0],
//                 time: data.time || `${timestamp.getHours().toString().padStart(2,'0')}:${timestamp.getMinutes().toString().padStart(2,'0')}`,
//                 timestamp: timestamp,
//                 context: data.context || data.tag || 'Manual',
//                 ...data 
//             });
//         });
        
//         allReadings = newReadings;
//         updateDashboardUI(allReadings);
        
//     }, (error) => {
//         console.error("Error fetching data:", error);
//         if (allReadings.length > 0) updateDashboardUI(allReadings);
//     });
// }

// function updateDashboardUI(readings) {
//     if (!readings || readings.length === 0) {
//         updateStats([]);
//         updateRecentReadingsList([]);
//         updateChart([]);
//         return;
//     }
//     updateStats(readings);
//     updateRecentReadingsList(readings);
//     updateChart(readings);
// }

// function updateStats(readings) {
//     if (!readings || readings.length === 0) {
//         setStatValue('.stat-card:nth-child(1) .stat-val', '0', 'mg/dL');
//         setStatValue('.stat-card:nth-child(2) .stat-val', '0', 'mg/dL');
//         setStatValue('.stat-card:nth-child(3) .stat-val', '5.8', '%');
//         setStatValue('.stat-card:nth-child(4) .stat-val', '0');
//         document.querySelectorAll('.stat-change').forEach(el => el.innerHTML = '');
//         return;
//     }

//     const sortedReadings = [...readings].sort((a, b) => b.timestamp - a.timestamp);

//     const last = sortedReadings[0];
//     const lastEl = document.querySelector('.stat-card:nth-child(2) .stat-val');
//     if(lastEl) {
//         lastEl.innerHTML = `${last.glucose} <span style="font-size: 1rem; color: var(--text-secondary); font-weight:400;">mg/dL</span>`;
        
//         const timeAgoEl = document.querySelector('.stat-card:nth-child(2) .stat-change');
//         if (timeAgoEl) {
//             const diffMins = Math.floor((new Date() - last.timestamp) / 60000);
//             let timeAgoText = '';
//             if (diffMins < 1) timeAgoText = 'Just now';
//             else if (diffMins < 60) timeAgoText = `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
//             else if (diffMins < 1440) timeAgoText = `${Math.floor(diffMins / 60)} hour${Math.floor(diffMins / 60) !== 1 ? 's' : ''} ago`;
//             else timeAgoText = `${Math.floor(diffMins / 1440)} day${Math.floor(diffMins / 1440) !== 1 ? 's' : ''} ago`;
            
//             const statusColor = getStatusColor(last.glucose);
//             timeAgoEl.innerHTML = `<span style="color: ${statusColor};">● ${getStatusText(last.glucose)}</span> • ${timeAgoText}`;
//         }
//     }

//     const intelligentAvg = calculateIntelligentAverage(readings, 7);
//     const avgEl = document.querySelector('.stat-card:nth-child(1) .stat-val');
//     if(avgEl) avgEl.innerHTML = `${intelligentAvg} <span style="font-size: 1rem; color: var(--text-secondary); font-weight:400;">mg/dL</span>`;
    
//     const now = new Date();
//     const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
//     const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    
//     const currentWeekReadings = readings.filter(r => r.timestamp >= oneWeekAgo);
//     const prevWeekReadings = readings.filter(r => r.timestamp >= twoWeeksAgo && r.timestamp < oneWeekAgo);
    
//     const trendEl = document.querySelector('.stat-card:nth-child(1) .stat-change');
//     if (currentWeekReadings.length > 0 && prevWeekReadings.length > 0) {
//         const currentAvg = calculateIntelligentAverage(readings, 7);
//         const prevAvg = calculateIntelligentAverage(readings.filter(r => r.timestamp < oneWeekAgo && r.timestamp >= twoWeeksAgo), 7);
        
//         const change = currentAvg - prevAvg;
//         const changePercent = prevAvg !== 0 ? Math.round((change / prevAvg) * 100) : 0;
        
//         if (trendEl) {
//             const changeClass = change < 0 ? 'positive' : (change > 0 ? 'negative' : 'neutral');
//             const arrow = change < 0 ? '↓' : (change > 0 ? '↑' : '→');
//             trendEl.innerHTML = `${arrow} ${Math.abs(changePercent)}% vs last week`;
//             trendEl.className = `stat-change ${changeClass}`;
//         }
//     } else {
//         if (trendEl) {
//             trendEl.innerHTML = readings.length > 0 
//                 ? '<span style="color: var(--text-secondary); font-size: 0.85rem;"><i class="ph ph-chart-line" style="margin-right: 4px;"></i> Building trend data...</span>' 
//                 : '';
//             trendEl.className = 'stat-change neutral'; 
//         }
//     }

//     const today = new Date().toISOString().split('T')[0];
//     const todayReadings = readings.filter(r => r.date === today).length;
//     const todayEl = document.querySelector('.stat-card:nth-child(4) .stat-val');
//     if (todayEl) {
//         todayEl.textContent = todayReadings;
//         const recEl = document.querySelector('.stat-card:nth-child(4) .stat-change');
//         if (recEl) {
//             if (todayReadings === 0) recEl.innerHTML = '<span style="color: #ef4444;"><i class="fa-solid fa-triangle-exclamation" style="color: #ef4444;"></i> No readings yet today</span>';
//             else if (todayReadings < 4) recEl.innerHTML = `<span style="color: #f59e0b;"><i class="fa-solid fa-chart-column" style="color: #f59e0b;"></i> ${4 - todayReadings} more recommended today</span>`;
//             else if (todayReadings >= 6) recEl.innerHTML = '<span style="color: #10b981;"><i class="fa-solid fa-square-check" style="color: #10b981;"></i> Great job! Target reached</span>';
//             else recEl.innerHTML = `<span>${6 - todayReadings} more to reach target</span>`;
//         }
//     }

//     const avgGlucose = calculateIntelligentAverage(readings, 30); 
//     const estimatedA1C = calculateA1C(avgGlucose);
//     const a1cEl = document.querySelector('.stat-card:nth-child(3) .stat-val');
//     if (a1cEl) {
//         a1cEl.innerHTML = `${estimatedA1C} <span style="font-size: 1rem; color: var(--text-secondary); font-weight:400;">%</span>`;
//         const a1cStatusEl = document.querySelector('.stat-card:nth-child(3) .stat-change');
//         if (a1cStatusEl) {
//             const a1cNum = parseFloat(estimatedA1C);
//             if (a1cNum < 5.7) a1cStatusEl.innerHTML = '<span style="color: #10b981;">● Normal</span>';
//             else if (a1cNum < 6.5) a1cStatusEl.innerHTML = '<span style="color: #f59e0b;">● Prediabetes</span>';
//             else a1cStatusEl.innerHTML = '<span style="color: #ef4444;">● Diabetes Range</span>';
//         }
//     }
// }

// function setStatValue(selector, value, unit = '') {
//     const el = document.querySelector(selector);
//     if (el) {
//         if (unit) el.innerHTML = `${value} <span style="font-size: 1rem; color: var(--text-secondary); font-weight:400;">${unit}</span>`;
//         else el.textContent = value;
//     }
// }

// function updateRecentReadingsList(readings) {
//     const listContainer = document.querySelector('.readings-list');
//     if (!listContainer) return;

//     const header = listContainer.querySelector('.reading-header');
//     listContainer.innerHTML = '';
//     if (header) listContainer.appendChild(header);

//     if (!readings || readings.length === 0) {
//         listContainer.innerHTML += `<div class="reading-item">
//             <div style="width:100%; text-align:center; padding:2rem; color:var(--text-secondary);">
//             <i class="ph ph-drop-half" style="font-size: 2rem; margin-bottom: 0.5rem; display: block;"></i>
//             No readings yet. Click "Add Reading" to get started!</div></div>`;
//         return;
//     }

//     const sortedReadings = [...readings].sort((a, b) => b.timestamp - a.timestamp);
//     const recentReadings = sortedReadings.slice(0, RECENT_READINGS_TO_SHOW);

//     recentReadings.forEach((r, index) => {
//         const timeStr = formatTime12Hour(r.time);
//         const today = new Date().toISOString().split('T')[0];
//         const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        
//         let dateStr = '';
//         if (r.date === today) dateStr = 'Today';
//         else if (r.date === yesterday) dateStr = 'Yesterday';
//         else {
//             const diffDays = Math.floor((new Date() - new Date(r.date)) / (1000 * 60 * 60 * 24));
//             dateStr = diffDays < 7 ? new Date(r.date).toLocaleDateString('en-US', { weekday: 'long' }) : new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
//         }
        
//         let colorClass = getStatusClass(r.glucose);
//         const item = document.createElement('div');
//         item.className = 'reading-item';
//         item.style.animation = `fadeIn 0.3s ease forwards ${index * 0.05}s`;
//         item.style.opacity = '0';
        
//         item.innerHTML = `
//             <div class="r-val ${colorClass}">${r.glucose}</div>
//             <div class="r-info">
//                 <span class="r-time">${timeStr}</span>
//                 <span class="r-date">${dateStr}</span>
//             </div>
//             <div class="r-tag" style="background: ${getStatusColor(r.glucose)}20; color: ${getStatusColor(r.glucose)};">
//                 <i class="ph ph-${r.context === 'Fasting' ? 'sun' : (r.context === 'Post-Meal' ? 'fork-knife' : 'moon-stars')}" style="margin-right: 4px;"></i>
//                 ${r.context || 'Manual'}
//             </div>
//         `;
//         listContainer.appendChild(item);
//     });
    
//     if (readings.length > RECENT_READINGS_TO_SHOW) {
//         listContainer.innerHTML += `
//             <div class="reading-item view-all">
//                 <div style="width:100%; text-align:center; padding:0.75rem; color:var(--info); cursor:pointer; font-weight: 500;" onclick="window.location.href='readings.html'">
//                     View all ${readings.length} readings <i class="ph ph-arrow-right"></i>
//                 </div>
//             </div>`;
//     }
// }

// function updateChart(readings) {
//     if (!readings || readings.length === 0) {
//         if (window.leadsChart) {
//             window.leadsChart.data.labels = [];
//             window.leadsChart.data.datasets[0].data = [];
//             window.leadsChart.update();
//         }
//         return;
//     }
    
//     const sortedReadings = [...readings].sort((a, b) => a.timestamp - b.timestamp);
//     const chartData = sortedReadings.slice(-14);
    
//     const labels = chartData.map(r => {
//         const d = r.timestamp;
//         const isToday = d.toDateString() === new Date().toDateString();
//         return isToday ? formatTime12Hour(r.time).replace(' ', '\n') : `${d.getMonth()+1}/${d.getDate()}\n${formatTime12Hour(r.time).split(' ')[1] || ''}`;
//     });
    
//     const dataPoints = chartData.map(r => r.glucose);
    
//     if (window.leadsChart) {
//         window.leadsChart.data.labels = labels;
//         window.leadsChart.data.datasets[0].data = dataPoints;
//         window.leadsChart.data.datasets[0].borderColor = '#3b82f6';
//         window.leadsChart.data.datasets[0].backgroundColor = (context) => {
//             const chart = context.chart;
//             const {ctx, chartArea} = chart;
//             if (!chartArea) return null;
//             const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
//             gradient.addColorStop(0, '#3b82f6');
//             gradient.addColorStop(1, '#8b5cf6');
//             return gradient;
//         };
        
//         window.leadsChart.options.plugins = window.leadsChart.options.plugins || {};
//         window.leadsChart.options.plugins.annotation = {
//             annotations: {
//                 targetLow: { type: 'line', yMin: 70, yMax: 70, borderColor: '#10b981', borderWidth: 1, borderDash: [5, 5], label: { content: 'Target Range', enabled: true, position: 'end' } },
//                 targetHigh: { type: 'line', yMin: 130, yMax: 130, borderColor: '#10b981', borderWidth: 1, borderDash: [5, 5] }
//             }
//         };
//         window.leadsChart.update();
//     }
// }

// const style = document.createElement('style');
// style.textContent = `
//     @keyframes fadeIn {
//         from { opacity: 0; transform: translateY(10px); }
//         to { opacity: 1; transform: translateY(0); }
//     }
//     .reading-item { transition: all 0.2s ease; }
//     .reading-item:hover { background: var(--bg-hover); transform: translateX(5px); }
//     .stat-change.positive { color: #10b981; }
//     .stat-change.negative { color: #ef4444; }
//     .stat-change.neutral { color: var(--text-secondary); }
//     .r-val.low { color: #ef4444; }
//     .r-val.normal { color: #10b981; }
//     .r-val.mid { color: #f59e0b; }
//     .r-val.high { color: #dc2626; }
// `;
// document.head.appendChild(style);

// function setupModalListeners() {
//     const addBtn = document.getElementById('addReadingBtn');
//     const modal = document.getElementById('readingModal');
//     const closeBtn = document.getElementById('closeModalBtn');
//     const cancelBtn = document.getElementById('cancelBtn');
//     const addForm = document.getElementById('addReadingForm');
    
//     if (addBtn) {
//         addBtn.addEventListener('click', () => {
//             const now = new Date();
//             const dateInput = document.getElementById('inputDate');
//             const timeInput = document.getElementById('inputTime');
//             if (dateInput) dateInput.value = now.toISOString().split('T')[0];
//             if (timeInput) timeInput.value = now.toTimeString().slice(0, 5);
//             modal.classList.add('active');
//             document.body.style.overflow = 'hidden';
//         });
//     }
    
//     function closeModal() {
//         modal.classList.remove('active');
//         document.body.style.overflow = '';
//     }
    
//     if (closeBtn) closeBtn.addEventListener('click', closeModal);
//     if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
//     if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    
//     if (addForm) {
//         addForm.addEventListener('submit', async (e) => {
//             e.preventDefault();
//             if (!currentUser) return;
            
//             const dateVal = document.getElementById('inputDate').value;
//             const timeVal = document.getElementById('inputTime').value;
//             const glucoseVal = parseInt(document.getElementById('inputGlucose').value);
//             const notes = document.querySelector('textarea')?.value || '';
            
//             if (!glucoseVal || glucoseVal < 1 || glucoseVal > 600) {
//                 alert('Please enter a valid glucose level (1-600 mg/dL)');
//                 return;
//             }
            
//             const submitBtn = addForm.querySelector('button[type="submit"]');
//             const originalText = submitBtn.textContent;
//             submitBtn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Saving...';
//             submitBtn.disabled = true;
            
//             try {
//                 const dateTimeString = `${dateVal}T${timeVal}`;
//                 const timestamp = new Date(dateTimeString);
//                 // const hour = parseInt(timeVal.split(':')[0]);
//                 // let context = 'Manual';
//                 // if (hour < 8) context = 'Fasting';
//                 // else if (hour >= 11 && hour <= 14) context = 'Post-Meal';
//                 // else if (hour >= 17 && hour <= 20) context = 'Post-Meal';
//                 // else if (hour >= 21 || hour <= 5) context = 'Bedtime';
//                 // else context = 'Pre-Meal';
//                 // Get the selected context from the radio buttons
//                 const selectedContextNode = document.querySelector('input[name="context"]:checked');
//                 let context = 'Manual';
                
//                 if (selectedContextNode) {
//                     const val = selectedContextNode.value;
//                     if (val === 'fasting') context = 'Fasting';
//                     else if (val === 'pre-meal') context = 'Pre-Meal';
//                     else if (val === 'post-meal') context = 'Post-Meal';
//                     else if (val === 'bedtime') context = 'Bedtime';
//                     else if (val === 'Manual') context = 'Manual';
//                 }
//                 await addDoc(collection(db, "readings"), {
//                     userId: currentUser.uid,
//                     glucose: glucoseVal,
//                     comment: notes,
//                     date: dateVal,
//                     time: timeVal,
//                     timestamp: Timestamp.fromDate(timestamp),
//                     created: Timestamp.now(),
//                     context: context
//                 });
                
//                 closeModal();
//                 addForm.reset();
//                 showNotification('Reading added successfully!', 'success');
                
//             } catch (error) {
//                 console.error("Error adding reading:", error);
//                 showNotification('Error saving reading. Please try again.', 'error');
//             } finally {
//                 submitBtn.innerHTML = originalText;
//                 submitBtn.disabled = false;
//             }
//         });
//     }
// }

// function showNotification(message, type = 'success') {
//     const existingNotifications = document.querySelectorAll('.custom-notification');
//     existingNotifications.forEach(notification => notification.remove());
    
//     const notification = document.createElement('div');
//     notification.className = `custom-notification ${type}`;
//     notification.innerHTML = `<div class="notification-content"><i class="ph ph-${type === 'success' ? 'check-circle' : 'warning-circle'}"></i><span>${message}</span></div>`;
    
//     notification.style.cssText = `
//         position: fixed; bottom: 20px; right: 20px;
//         background: ${type === 'success' ? '#10b981' : '#ef4444'}; color: white;
//         padding: 1rem 1.5rem; border-radius: 0.75rem; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
//         z-index: 10000; max-width: 300px; animation: slideIn 0.3s ease;
//     `;
    
//     document.body.appendChild(notification);
    
//     setTimeout(() => {
//         notification.style.animation = 'slideOut 0.3s ease';
//         setTimeout(() => { if (notification.parentNode) notification.parentNode.removeChild(notification); }, 300);
//     }, 3000);
// }

// window.addEventListener('beforeunload', () => { if (unsubscribe) unsubscribe(); });






























// import { auth, db, collection, addDoc, query, where, orderBy, limit, onSnapshot, Timestamp } from "./firebase-init.js";
// import { getSmartGreeting } from "./greetings.js";

// const RECENT_READINGS_TO_SHOW = 4; 

// let allReadings = [];
// let currentUser = null;
// let unsubscribe = null;

// function formatTime12Hour(time) {
//     if (!time) return "";
//     const [hours, minutes] = time.split(':');
//     let period = 'AM';
//     let hours12 = parseInt(hours, 10);
//     if (hours12 >= 12) {
//         period = 'PM';
//         if (hours12 > 12) hours12 -= 12;
//     } else if (hours12 === 0) {
//         hours12 = 12;
//     }
//     return `${hours12}:${minutes} ${period}`;
// }

// function getStatusClass(glucose) {
//     if (glucose < 70) return 'low';           
//     if (glucose >= 70 && glucose <= 130) return 'normal'; 
//     if (glucose > 130 && glucose <= 180) return 'mid';    
//     return 'high';                             
// }

// function getStatusText(glucose) {
//     if (glucose < 70) return 'Low';
//     if (glucose >= 70 && glucose <= 130) return 'In Range';
//     if (glucose > 130 && glucose <= 180) return 'High';
//     return 'Very High';
// }

// function getStatusColor(glucose) {
//     if (glucose < 70) return '#ef4444';      
//     if (glucose >= 70 && glucose <= 130) return '#10b981';  
//     if (glucose > 130 && glucose <= 180) return '#f59e0b';  
//     return '#dc2626';                        
// }

// // FIXED: Reliable Average Calculation
// function calculateIntelligentAverage(readings, days = null) {
//     if (!readings || readings.length === 0) return 0;
    
//     let relevantReadings = readings;
    
//     // Filter by days if requested
//     if (days) {
//         const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
//         const filtered = readings.filter(r => r.timestamp >= cutoffDate);
        
//         // Fallback: If no readings exist in the timeframe, use all readings so we don't show 0!
//         if (filtered.length > 0) {
//             relevantReadings = filtered;
//         }
//     }
    
//     let total = 0;
//     let count = 0;
    
//     relevantReadings.forEach(r => {
//         const val = Number(r.glucose);
//         if (!isNaN(val) && val > 0) {
//             total += val;
//             count++;
//         }
//     });
    
//     return count === 0 ? 0 : Math.round(total / count);
// }

// function calculateA1C(avgGlucose) {
//     if (avgGlucose === 0) return '5.8';
//     const a1c = (avgGlucose + 46.7) / 28.7;
//     return a1c.toFixed(1);
// }

// document.addEventListener("DOMContentLoaded", () => {
//     auth.onAuthStateChanged((user) => {
//         if (user) {
//             currentUser = user;
//             initDashboard(user);
//             loadUserInfo(user);
//         } else {
//             window.location.href = 'login.html';
//         }
//     });
//     setupModalListeners();
// });

// function loadUserInfo(user) {
//     db.collection('users').doc(user.uid).get().then((doc) => {
//         if (doc.exists) {
//             const userData = doc.data();
//             const welcomeEl = document.querySelector('.hero-section h1');
//             if (welcomeEl) {
//                 const firstName = userData.firstName || user.email.split('@')[0];
//                 welcomeEl.textContent = getSmartGreeting(firstName, userData.dateOfBirth);
//             }
            
//             const dateEl = document.getElementById('currentDateDisplay');
//             if (dateEl) {
//                 const now = new Date();
//                 dateEl.textContent = now.toLocaleDateString('en-US', { 
//                     weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
//                 });
//             }
//         }
//     }).catch(error => console.error("Error loading user info:", error));
// }

// function initDashboard(user) {
//     if (unsubscribe) unsubscribe();

//     const readingsRef = collection(db, "readings");
//     const q = query(
//         readingsRef, 
//         where("userId", "==", user.uid),
//         orderBy("timestamp", "desc"),
//         limit(100) 
//     );

//     unsubscribe = onSnapshot(q, (snapshot) => {
//         const newReadings = [];
        
//         snapshot.forEach(doc => {
//             const data = doc.data();
//             let timestamp = new Date();
//             if (data.timestamp) timestamp = data.timestamp.toDate ? data.timestamp.toDate() : new Date(data.timestamp);
//             else if (data.created) timestamp = data.created.toDate ? data.created.toDate() : new Date(data.created);
            
//             newReadings.push({ 
//                 id: doc.id,
//                 glucose: data.glucose || data.value || 0,
//                 comment: data.comment || data.notes || data.context || '',
//                 date: data.date || timestamp.toISOString().split('T')[0],
//                 time: data.time || `${timestamp.getHours().toString().padStart(2,'0')}:${timestamp.getMinutes().toString().padStart(2,'0')}`,
//                 timestamp: timestamp,
//                 context: data.context || data.tag || 'Manual',
//                 ...data 
//             });
//         });
        
//         allReadings = newReadings;
//         updateDashboardUI(allReadings);
        
//     }, (error) => {
//         console.error("Error fetching data:", error);
//         if (allReadings.length > 0) updateDashboardUI(allReadings);
//     });
// }

// function updateDashboardUI(readings) {
//     if (!readings || readings.length === 0) {
//         updateStats([]);
//         updateRecentReadingsList([]);
//         updateChart([]);
//         return;
//     }
//     updateStats(readings);
//     updateRecentReadingsList(readings);
//     updateChart(readings);
// }

// function updateStats(readings) {
//     if (!readings || readings.length === 0) {
//         setStatValue('.stat-card:nth-child(1) .stat-val', '0', 'mg/dL');
//         setStatValue('.stat-card:nth-child(2) .stat-val', '0', 'mg/dL');
//         setStatValue('.stat-card:nth-child(3) .stat-val', '5.8', '%');
//         setStatValue('.stat-card:nth-child(4) .stat-val', '0');
//         document.querySelectorAll('.stat-change').forEach(el => el.innerHTML = '');
//         return;
//     }

//     const sortedReadings = [...readings].sort((a, b) => b.timestamp - a.timestamp);

//     // 1. Last Reading Card
//     const last = sortedReadings[0];
//     const lastEl = document.querySelector('.stat-card:nth-child(2) .stat-val');
//     if(lastEl) {
//         lastEl.innerHTML = `${last.glucose} <span style="font-size: 1rem; color: var(--text-secondary); font-weight:400;">mg/dL</span>`;
        
//         const timeAgoEl = document.querySelector('.stat-card:nth-child(2) .stat-change');
//         if (timeAgoEl) {
//             const diffMins = Math.floor((new Date() - last.timestamp) / 60000);
//             let timeAgoText = '';
//             if (diffMins < 1) timeAgoText = 'Just now';
//             else if (diffMins < 60) timeAgoText = `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
//             else if (diffMins < 1440) timeAgoText = `${Math.floor(diffMins / 60)} hour${Math.floor(diffMins / 60) !== 1 ? 's' : ''} ago`;
//             else timeAgoText = `${Math.floor(diffMins / 1440)} day${Math.floor(diffMins / 1440) !== 1 ? 's' : ''} ago`;
            
//             const statusColor = getStatusColor(last.glucose);
//             timeAgoEl.innerHTML = `<span style="color: ${statusColor};">● ${getStatusText(last.glucose)}</span> • ${timeAgoText}`;
//         }
//     }

//     // 2. Average Glucose Card
//     const intelligentAvg = calculateIntelligentAverage(readings, 7);
//     const avgEl = document.querySelector('.stat-card:nth-child(1) .stat-val');
//     if(avgEl) avgEl.innerHTML = `${intelligentAvg} <span style="font-size: 1rem; color: var(--text-secondary); font-weight:400;">mg/dL</span>`;
    
//     // Trend Calculation (Fixed logic)
//     const now = new Date();
//     const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
//     const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    
//     const currentWeekReadings = readings.filter(r => r.timestamp >= oneWeekAgo);
//     const prevWeekReadings = readings.filter(r => r.timestamp >= twoWeeksAgo && r.timestamp < oneWeekAgo);
    
//     const trendEl = document.querySelector('.stat-card:nth-child(1) .stat-change');
//     if (currentWeekReadings.length > 0 && prevWeekReadings.length > 0) {
//         // Pass null so it doesn't double-filter the already filtered array!
//         const currentAvg = calculateIntelligentAverage(currentWeekReadings, null); 
//         const prevAvg = calculateIntelligentAverage(prevWeekReadings, null);
        
//         const change = currentAvg - prevAvg;
//         const changePercent = prevAvg !== 0 ? Math.round((change / prevAvg) * 100) : 0;
        
//         if (trendEl) {
//             const changeClass = change < 0 ? 'positive' : (change > 0 ? 'negative' : 'neutral');
//             const arrow = change < 0 ? '↓' : (change > 0 ? '↑' : '→');
//             trendEl.innerHTML = `${arrow} ${Math.abs(changePercent)}% vs last week`;
//             trendEl.className = `stat-change ${changeClass}`;
//         }
//     } else {
//         if (trendEl) {
//             trendEl.innerHTML = readings.length > 0 
//                 ? '<span style="color: var(--text-secondary); font-size: 0.85rem;"><i class="ph ph-chart-line" style="margin-right: 4px;"></i> Building trend data...</span>' 
//                 : '';
//             trendEl.className = 'stat-change neutral'; 
//         }
//     }

//     // 3. Readings Today Card
//     const today = new Date().toISOString().split('T')[0];
//     const todayReadings = readings.filter(r => r.date === today).length;
//     const todayEl = document.querySelector('.stat-card:nth-child(4) .stat-val');
//     if (todayEl) {
//         todayEl.textContent = todayReadings;
//         const recEl = document.querySelector('.stat-card:nth-child(4) .stat-change');
//         if (recEl) {
//             if (todayReadings === 0) recEl.innerHTML = '<span style="color: #ef4444;"><i class="fa-solid fa-triangle-exclamation" style="color: #ef4444;"></i> No readings yet today</span>';
//             else if (todayReadings < 4) recEl.innerHTML = `<span style="color: #f59e0b;"><i class="fa-solid fa-chart-column" style="color: #f59e0b;"></i> ${4 - todayReadings} more recommended today</span>`;
//             else if (todayReadings >= 6) recEl.innerHTML = '<span style="color: #10b981;"><i class="fa-solid fa-square-check" style="color: #10b981;"></i> Great job! Target reached</span>';
//             else recEl.innerHTML = `<span>${6 - todayReadings} more to reach target</span>`;
//         }
//     }

//     // 4. A1C Estimate Card
//     const a1cAvgGlucose = calculateIntelligentAverage(readings, 30); 
//     const estimatedA1C = calculateA1C(a1cAvgGlucose);
//     const a1cEl = document.querySelector('.stat-card:nth-child(3) .stat-val');
//     if (a1cEl) {
//         a1cEl.innerHTML = `${estimatedA1C} <span style="font-size: 1rem; color: var(--text-secondary); font-weight:400;">%</span>`;
//         const a1cStatusEl = document.querySelector('.stat-card:nth-child(3) .stat-change');
//         if (a1cStatusEl) {
//             const a1cNum = parseFloat(estimatedA1C);
//             if (a1cNum < 5.7) a1cStatusEl.innerHTML = '<span style="color: #10b981;">● Normal</span>';
//             else if (a1cNum < 6.5) a1cStatusEl.innerHTML = '<span style="color: #f59e0b;">● Prediabetes</span>';
//             else a1cStatusEl.innerHTML = '<span style="color: #ef4444;">● Diabetes Range</span>';
//         }
//     }
// }

// function setStatValue(selector, value, unit = '') {
//     const el = document.querySelector(selector);
//     if (el) {
//         if (unit) el.innerHTML = `${value} <span style="font-size: 1rem; color: var(--text-secondary); font-weight:400;">${unit}</span>`;
//         else el.textContent = value;
//     }
// }

// function updateRecentReadingsList(readings) {
//     const listContainer = document.querySelector('.readings-list');
//     if (!listContainer) return;

//     const header = listContainer.querySelector('.reading-header');
//     listContainer.innerHTML = '';
//     if (header) listContainer.appendChild(header);

//     if (!readings || readings.length === 0) {
//         listContainer.innerHTML += `<div class="reading-item">
//             <div style="width:100%; text-align:center; padding:2rem; color:var(--text-secondary);">
//             <i class="ph ph-drop-half" style="font-size: 2rem; margin-bottom: 0.5rem; display: block;"></i>
//             No readings yet. Click "Add Reading" to get started!</div></div>`;
//         return;
//     }

//     const sortedReadings = [...readings].sort((a, b) => b.timestamp - a.timestamp);
//     const recentReadings = sortedReadings.slice(0, RECENT_READINGS_TO_SHOW);

//     recentReadings.forEach((r, index) => {
//         const timeStr = formatTime12Hour(r.time);
//         const today = new Date().toISOString().split('T')[0];
//         const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        
//         let dateStr = '';
//         if (r.date === today) dateStr = 'Today';
//         else if (r.date === yesterday) dateStr = 'Yesterday';
//         else {
//             const diffDays = Math.floor((new Date() - new Date(r.date)) / (1000 * 60 * 60 * 24));
//             dateStr = diffDays < 7 ? new Date(r.date).toLocaleDateString('en-US', { weekday: 'long' }) : new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
//         }
        
//         let colorClass = getStatusClass(r.glucose);
//         const item = document.createElement('div');
//         item.className = 'reading-item';
//         item.style.animation = `fadeIn 0.3s ease forwards ${index * 0.05}s`;
//         item.style.opacity = '0';
        
//         item.innerHTML = `
//             <div class="r-val ${colorClass}">${r.glucose}</div>
//             <div class="r-info">
//                 <span class="r-time">${timeStr}</span>
//                 <span class="r-date">${dateStr}</span>
//             </div>
//             <div class="r-tag" style="background: ${getStatusColor(r.glucose)}20; color: ${getStatusColor(r.glucose)};">
//                 <i class="ph ph-${r.context === 'Fasting' ? 'sun' : (r.context === 'Post-Meal' ? 'fork-knife' : 'moon-stars')}" style="margin-right: 4px;"></i>
//                 ${r.context || 'Manual'}
//             </div>
//         `;
//         listContainer.appendChild(item);
//     });
    
//     if (readings.length > RECENT_READINGS_TO_SHOW) {
//         listContainer.innerHTML += `
//             <div class="reading-item view-all">
//                 <div style="width:100%; text-align:center; padding:0.75rem; color:var(--info); cursor:pointer; font-weight: 500;" onclick="window.location.href='readings.html'">
//                     View all ${readings.length} readings <i class="ph ph-arrow-right"></i>
//                 </div>
//             </div>`;
//     }
// }

// function updateChart(readings) {
//     if (!readings || readings.length === 0) {
//         if (window.leadsChart) {
//             window.leadsChart.data.labels = [];
//             window.leadsChart.data.datasets[0].data = [];
//             window.leadsChart.update();
//         }
//         return;
//     }
    
//     const sortedReadings = [...readings].sort((a, b) => a.timestamp - b.timestamp);
//     const chartData = sortedReadings.slice(-14);
    
//     const labels = chartData.map(r => {
//         const d = r.timestamp;
//         const isToday = d.toDateString() === new Date().toDateString();
//         return isToday ? formatTime12Hour(r.time).replace(' ', '\n') : `${d.getMonth()+1}/${d.getDate()}\n${formatTime12Hour(r.time).split(' ')[1] || ''}`;
//     });
    
//     const dataPoints = chartData.map(r => r.glucose);
    
//     if (window.leadsChart) {
//         window.leadsChart.data.labels = labels;
//         window.leadsChart.data.datasets[0].data = dataPoints;
//         window.leadsChart.data.datasets[0].borderColor = '#3b82f6';
//         window.leadsChart.data.datasets[0].backgroundColor = (context) => {
//             const chart = context.chart;
//             const {ctx, chartArea} = chart;
//             if (!chartArea) return null;
//             const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
//             gradient.addColorStop(0, '#3b82f6');
//             gradient.addColorStop(1, '#8b5cf6');
//             return gradient;
//         };
        
//         window.leadsChart.options.plugins = window.leadsChart.options.plugins || {};
//         window.leadsChart.options.plugins.annotation = {
//             annotations: {
//                 targetLow: { type: 'line', yMin: 70, yMax: 70, borderColor: '#10b981', borderWidth: 1, borderDash: [5, 5], label: { content: 'Target Range', enabled: true, position: 'end' } },
//                 targetHigh: { type: 'line', yMin: 130, yMax: 130, borderColor: '#10b981', borderWidth: 1, borderDash: [5, 5] }
//             }
//         };
//         window.leadsChart.update();
//     }
// }

// const style = document.createElement('style');
// style.textContent = `
//     @keyframes fadeIn {
//         from { opacity: 0; transform: translateY(10px); }
//         to { opacity: 1; transform: translateY(0); }
//     }
//     .reading-item { transition: all 0.2s ease; }
//     .reading-item:hover { background: var(--bg-hover); transform: translateX(5px); }
//     .stat-change.positive { color: #10b981; }
//     .stat-change.negative { color: #ef4444; }
//     .stat-change.neutral { color: var(--text-secondary); }
//     .r-val.low { color: #ef4444; }
//     .r-val.normal { color: #10b981; }
//     .r-val.mid { color: #f59e0b; }
//     .r-val.high { color: #dc2626; }
// `;
// document.head.appendChild(style);

// function setupModalListeners() {
//     const addBtn = document.getElementById('addReadingBtn');
//     const modal = document.getElementById('readingModal');
//     const closeBtn = document.getElementById('closeModalBtn');
//     const cancelBtn = document.getElementById('cancelBtn');
//     const addForm = document.getElementById('addReadingForm');
    
//     if (addBtn) {
//         addBtn.addEventListener('click', () => {
//             const now = new Date();
//             const dateInput = document.getElementById('inputDate');
//             const timeInput = document.getElementById('inputTime');
//             if (dateInput) dateInput.value = now.toISOString().split('T')[0];
//             if (timeInput) timeInput.value = now.toTimeString().slice(0, 5);
//             modal.classList.add('active');
//             document.body.style.overflow = 'hidden';
//         });
//     }
    
//     function closeModal() {
//         modal.classList.remove('active');
//         document.body.style.overflow = '';
//     }
    
//     if (closeBtn) closeBtn.addEventListener('click', closeModal);
//     if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
//     if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    
//     if (addForm) {
//         addForm.addEventListener('submit', async (e) => {
//             e.preventDefault();
//             if (!currentUser) return;
            
//             const dateVal = document.getElementById('inputDate').value;
//             const timeVal = document.getElementById('inputTime').value;
//             const glucoseVal = parseInt(document.getElementById('inputGlucose').value);
//             const notes = document.querySelector('textarea')?.value || '';
            
//             if (!glucoseVal || glucoseVal < 1 || glucoseVal > 600) {
//                 alert('Please enter a valid glucose level (1-600 mg/dL)');
//                 return;
//             }
            
//             const submitBtn = addForm.querySelector('button[type="submit"]');
//             const originalText = submitBtn.textContent;
//             submitBtn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Saving...';
//             submitBtn.disabled = true;
            
//             try {
//                 const dateTimeString = `${dateVal}T${timeVal}`;
//                 const timestamp = new Date(dateTimeString);
                
//                 const selectedContextNode = document.querySelector('input[name="context"]:checked');
//                 let context = 'Manual';
                
//                 if (selectedContextNode) {
//                     const val = selectedContextNode.value;
//                     if (val === 'fasting') context = 'Fasting';
//                     else if (val === 'pre-meal') context = 'Pre-Meal';
//                     else if (val === 'post-meal') context = 'Post-Meal';
//                     else if (val === 'bedtime') context = 'Bedtime';
//                     else if (val === 'manual') context = 'Manual';
//                     else if (val === '') context = '';
//                 }
                
//                 await addDoc(collection(db, "readings"), {
//                     userId: currentUser.uid,
//                     glucose: glucoseVal,
//                     comment: notes,
//                     date: dateVal,
//                     time: timeVal,
//                     timestamp: Timestamp.fromDate(timestamp),
//                     created: Timestamp.now(),
//                     context: context
//                 });
                
//                 closeModal();
//                 addForm.reset();
//                 showNotification('Reading added successfully!', 'success');
                
//             } catch (error) {
//                 console.error("Error adding reading:", error);
//                 showNotification('Error saving reading. Please try again.', 'error');
//             } finally {
//                 submitBtn.innerHTML = originalText;
//                 submitBtn.disabled = false;
//             }
//         });
//     }
// }

// function showNotification(message, type = 'success') {
//     const existingNotifications = document.querySelectorAll('.custom-notification');
//     existingNotifications.forEach(notification => notification.remove());
    
//     const notification = document.createElement('div');
//     notification.className = `custom-notification ${type}`;
//     notification.innerHTML = `<div class="notification-content"><i class="ph ph-${type === 'success' ? 'check-circle' : 'warning-circle'}"></i><span>${message}</span></div>`;
    
//     notification.style.cssText = `
//         position: fixed; bottom: 20px; right: 20px;
//         background: ${type === 'success' ? '#10b981' : '#ef4444'}; color: white;
//         padding: 1rem 1.5rem; border-radius: 0.75rem; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
//         z-index: 10000; max-width: 300px; animation: slideIn 0.3s ease;
//     `;
    
//     document.body.appendChild(notification);
    
//     setTimeout(() => {
//         notification.style.animation = 'slideOut 0.3s ease';
//         setTimeout(() => { if (notification.parentNode) notification.parentNode.removeChild(notification); }, 300);
//     }, 3000);
// }

// window.addEventListener('beforeunload', () => { if (unsubscribe) unsubscribe(); });













































import { auth, db, collection, addDoc, query, where, orderBy, limit, onSnapshot, Timestamp } from "./firebase-init.js";
import { getSmartGreeting } from "./greetings.js";

const RECENT_READINGS_TO_SHOW = 4; 

let allReadings = [];
let currentUser = null;
let unsubscribe = null;

function formatTime12Hour(time) {
    if (!time) return "";
    const [hours, minutes] = time.split(':');
    let period = 'AM';
    let hours12 = parseInt(hours, 10);
    if (hours12 >= 12) {
        period = 'PM';
        if (hours12 > 12) hours12 -= 12;
    } else if (hours12 === 0) {
        hours12 = 12;
    }
    return `${hours12}:${minutes} ${period}`;
}

function getStatusClass(glucose) {
    if (glucose < 70) return 'low';           
    if (glucose >= 70 && glucose <= 130) return 'normal'; 
    if (glucose > 130 && glucose <= 180) return 'mid';    
    return 'high';                             
}

function getStatusText(glucose) {
    if (glucose < 70) return 'Low';
    if (glucose >= 70 && glucose <= 130) return 'In Range';
    if (glucose > 130 && glucose <= 180) return 'High';
    return 'Very High';
}

function getStatusColor(glucose) {
    if (glucose < 70) return '#ef4444';      
    if (glucose >= 70 && glucose <= 130) return '#10b981';  
    if (glucose > 130 && glucose <= 180) return '#f59e0b';  
    return '#dc2626';                        
}

// Reliable Average Calculation
function calculateIntelligentAverage(readings, days = null) {
    if (!readings || readings.length === 0) return 0;
    
    let relevantReadings = readings;
    
    // Filter by days if requested
    if (days) {
        const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        const filtered = readings.filter(r => r.timestamp >= cutoffDate);
        
        // Fallback: If no readings exist in the timeframe, use all readings so we don't show 0
        if (filtered.length > 0) {
            relevantReadings = filtered;
        }
    }
    
    let total = 0;
    let count = 0;
    
    relevantReadings.forEach(r => {
        const val = Number(r.glucose);
        if (!isNaN(val) && val > 0) {
            total += val;
            count++;
        }
    });
    
    return count === 0 ? 0 : Math.round(total / count);
}

function calculateA1C(avgGlucose) {
    if (avgGlucose === 0) return '5.8';
    const a1c = (avgGlucose + 46.7) / 28.7;
    return a1c.toFixed(1);
}

document.addEventListener("DOMContentLoaded", () => {
    auth.onAuthStateChanged((user) => {
        if (user) {
            currentUser = user;
            initDashboard(user);
            loadUserInfo(user);
        } else {
            window.location.href = 'login.html';
        }
    });
    setupModalListeners();
});

function loadUserInfo(user) {
    db.collection('users').doc(user.uid).get().then((doc) => {
        if (doc.exists) {
            const userData = doc.data();
            const welcomeEl = document.querySelector('.hero-section h1');
            if (welcomeEl) {
                const firstName = userData.firstName || user.email.split('@')[0];
                welcomeEl.textContent = getSmartGreeting(firstName, userData.dateOfBirth);
            }
            
            const dateEl = document.getElementById('currentDateDisplay');
            if (dateEl) {
                const now = new Date();
                dateEl.textContent = now.toLocaleDateString('en-US', { 
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                });
            }
        }
    }).catch(error => console.error("Error loading user info:", error));
}

function initDashboard(user) {
    if (unsubscribe) unsubscribe();

    const readingsRef = collection(db, "readings");
    const q = query(
        readingsRef, 
        where("userId", "==", user.uid),
        orderBy("timestamp", "desc"),
        limit(100) 
    );

    unsubscribe = onSnapshot(q, (snapshot) => {
        const newReadings = [];
        
        snapshot.forEach(doc => {
            const data = doc.data();
            let timestamp = new Date();
            if (data.timestamp) timestamp = data.timestamp.toDate ? data.timestamp.toDate() : new Date(data.timestamp);
            else if (data.created) timestamp = data.created.toDate ? data.created.toDate() : new Date(data.created);
            
            newReadings.push({ 
                id: doc.id,
                glucose: data.glucose || data.value || 0,
                comment: data.comment || data.notes || data.context || '',
                date: data.date || timestamp.toISOString().split('T')[0],
                time: data.time || `${timestamp.getHours().toString().padStart(2,'0')}:${timestamp.getMinutes().toString().padStart(2,'0')}`,
                timestamp: timestamp,
                context: data.context || data.tag || 'Manual',
                ...data 
            });
        });
        
        allReadings = newReadings;
        updateDashboardUI(allReadings);
        
    }, (error) => {
        console.error("Error fetching data:", error);
        if (allReadings.length > 0) updateDashboardUI(allReadings);
    });
}

function updateDashboardUI(readings) {
    if (!readings || readings.length === 0) {
        updateStats([]);
        updateRecentReadingsList([]);
        updateChart([]);
        // Trigger STAi with empty data
        if (window.updateStaiInsights) window.updateStaiInsights([], 0);
        return;
    }
    
    updateStats(readings);
    updateRecentReadingsList(readings);
    updateChart(readings);

    // Trigger STAi Insights with fresh data
    if (window.updateStaiInsights) {
        const avgGlucose = calculateIntelligentAverage(readings, 7);
        window.updateStaiInsights(readings, avgGlucose);
    }
}

function updateStats(readings) {
    if (!readings || readings.length === 0) {
        setStatValue('.stat-card:nth-child(1) .stat-val', '0', 'mg/dL');
        setStatValue('.stat-card:nth-child(2) .stat-val', '0', 'mg/dL');
        setStatValue('.stat-card:nth-child(3) .stat-val', '5.8', '%');
        setStatValue('.stat-card:nth-child(4) .stat-val', '0');
        document.querySelectorAll('.stat-change').forEach(el => el.innerHTML = '');
        return;
    }

    const sortedReadings = [...readings].sort((a, b) => b.timestamp - a.timestamp);

    // 1. Last Reading Card
    const last = sortedReadings[0];
    const lastEl = document.querySelector('.stat-card:nth-child(2) .stat-val');
    if(lastEl) {
        lastEl.innerHTML = `${last.glucose} <span style="font-size: 1rem; color: var(--text-secondary); font-weight:400;">mg/dL</span>`;
        
        const timeAgoEl = document.querySelector('.stat-card:nth-child(2) .stat-change');
        if (timeAgoEl) {
            const diffMins = Math.floor((new Date() - last.timestamp) / 60000);
            let timeAgoText = '';
            if (diffMins < 1) timeAgoText = 'Just now';
            else if (diffMins < 60) timeAgoText = `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
            else if (diffMins < 1440) timeAgoText = `${Math.floor(diffMins / 60)} hour${Math.floor(diffMins / 60) !== 1 ? 's' : ''} ago`;
            else timeAgoText = `${Math.floor(diffMins / 1440)} day${Math.floor(diffMins / 1440) !== 1 ? 's' : ''} ago`;
            
            const statusColor = getStatusColor(last.glucose);
            timeAgoEl.innerHTML = `<span style="color: ${statusColor};">● ${getStatusText(last.glucose)}</span> • ${timeAgoText}`;
        }
    }

    // 2. Average Glucose Card
    const intelligentAvg = calculateIntelligentAverage(readings, 7);
    const avgEl = document.querySelector('.stat-card:nth-child(1) .stat-val');
    if(avgEl) avgEl.innerHTML = `${intelligentAvg} <span style="font-size: 1rem; color: var(--text-secondary); font-weight:400;">mg/dL</span>`;
    
    // Trend Calculation
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    
    const currentWeekReadings = readings.filter(r => r.timestamp >= oneWeekAgo);
    const prevWeekReadings = readings.filter(r => r.timestamp >= twoWeeksAgo && r.timestamp < oneWeekAgo);
    
    const trendEl = document.querySelector('.stat-card:nth-child(1) .stat-change');
    if (currentWeekReadings.length > 0 && prevWeekReadings.length > 0) {
        const currentAvg = calculateIntelligentAverage(currentWeekReadings, null); 
        const prevAvg = calculateIntelligentAverage(prevWeekReadings, null);
        
        const change = currentAvg - prevAvg;
        const changePercent = prevAvg !== 0 ? Math.round((change / prevAvg) * 100) : 0;
        
        if (trendEl) {
            const changeClass = change < 0 ? 'positive' : (change > 0 ? 'negative' : 'neutral');
            const arrow = change < 0 ? '↓' : (change > 0 ? '↑' : '→');
            trendEl.innerHTML = `${arrow} ${Math.abs(changePercent)}% vs last week`;
            trendEl.className = `stat-change ${changeClass}`;
        }
    } else {
        if (trendEl) {
            trendEl.innerHTML = readings.length > 0 
                ? '<span style="color: var(--text-secondary); font-size: 0.85rem;"><i class="ph ph-chart-line" style="margin-right: 4px;"></i> Building trend data...</span>' 
                : '';
            trendEl.className = 'stat-change neutral'; 
        }
    }

    // 3. Readings Today Card
    const today = new Date().toISOString().split('T')[0];
    const todayReadings = readings.filter(r => r.date === today).length;
    const todayEl = document.querySelector('.stat-card:nth-child(4) .stat-val');
    if (todayEl) {
        todayEl.textContent = todayReadings;
        const recEl = document.querySelector('.stat-card:nth-child(4) .stat-change');
        if (recEl) {
            if (todayReadings === 0) recEl.innerHTML = '<span style="color: #ef4444;"><i class="fa-solid fa-triangle-exclamation" style="color: #ef4444;"></i> No readings yet today</span>';
            else if (todayReadings < 4) recEl.innerHTML = `<span style="color: #f59e0b;"><i class="fa-solid fa-chart-column" style="color: #f59e0b;"></i> ${4 - todayReadings} more recommended today</span>`;
            else if (todayReadings >= 6) recEl.innerHTML = '<span style="color: #10b981;"><i class="fa-solid fa-square-check" style="color: #10b981;"></i> Great job! Target reached</span>';
            else recEl.innerHTML = `<span>${6 - todayReadings} more to reach target</span>`;
        }
    }

    // 4. A1C Estimate Card
    const a1cAvgGlucose = calculateIntelligentAverage(readings, 30); 
    const estimatedA1C = calculateA1C(a1cAvgGlucose);
    const a1cEl = document.querySelector('.stat-card:nth-child(3) .stat-val');
    if (a1cEl) {
        a1cEl.innerHTML = `${estimatedA1C} <span style="font-size: 1rem; color: var(--text-secondary); font-weight:400;">%</span>`;
        const a1cStatusEl = document.querySelector('.stat-card:nth-child(3) .stat-change');
        if (a1cStatusEl) {
            const a1cNum = parseFloat(estimatedA1C);
            if (a1cNum < 5.7) a1cStatusEl.innerHTML = '<span style="color: #10b981;">● Normal</span>';
            else if (a1cNum < 6.5) a1cStatusEl.innerHTML = '<span style="color: #f59e0b;">● Prediabetes</span>';
            else a1cStatusEl.innerHTML = '<span style="color: #ef4444;">● Diabetes Range</span>';
        }
    }
}

function setStatValue(selector, value, unit = '') {
    const el = document.querySelector(selector);
    if (el) {
        if (unit) el.innerHTML = `${value} <span style="font-size: 1rem; color: var(--text-secondary); font-weight:400;">${unit}</span>`;
        else el.textContent = value;
    }
}

function updateRecentReadingsList(readings) {
    const listContainer = document.querySelector('.readings-list');
    if (!listContainer) return;

    const header = listContainer.querySelector('.reading-header');
    listContainer.innerHTML = '';
    if (header) listContainer.appendChild(header);

    if (!readings || readings.length === 0) {
        listContainer.innerHTML += `<div class="reading-item">
            <div style="width:100%; text-align:center; padding:2rem; color:var(--text-secondary);">
            <i class="ph ph-drop-half" style="font-size: 2rem; margin-bottom: 0.5rem; display: block;"></i>
            No readings yet. Click "Add Reading" to get started!</div></div>`;
        return;
    }

    const sortedReadings = [...readings].sort((a, b) => b.timestamp - a.timestamp);
    const recentReadings = sortedReadings.slice(0, RECENT_READINGS_TO_SHOW);

    recentReadings.forEach((r, index) => {
        const timeStr = formatTime12Hour(r.time);
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        
        let dateStr = '';
        if (r.date === today) dateStr = 'Today';
        else if (r.date === yesterday) dateStr = 'Yesterday';
        else {
            const diffDays = Math.floor((new Date() - new Date(r.date)) / (1000 * 60 * 60 * 24));
            dateStr = diffDays < 7 ? new Date(r.date).toLocaleDateString('en-US', { weekday: 'long' }) : new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
        
        let colorClass = getStatusClass(r.glucose);
        const item = document.createElement('div');
        item.className = 'reading-item';
        item.style.animation = `fadeIn 0.3s ease forwards ${index * 0.05}s`;
        item.style.opacity = '0';
        
        item.innerHTML = `
            <div class="r-val ${colorClass}">${r.glucose}</div>
            <div class="r-info">
                <span class="r-time">${timeStr}</span>
                <span class="r-date">${dateStr}</span>
            </div>
            <div class="r-tag" style="background: ${getStatusColor(r.glucose)}20; color: ${getStatusColor(r.glucose)};">
                <i class="ph ph-${r.context === 'Fasting' ? 'sun' : (r.context === 'Post-Meal' ? 'fork-knife' : 'moon-stars')}" style="margin-right: 4px;"></i>
                ${r.context || 'Manual'}
            </div>
        `;
        listContainer.appendChild(item);
    });
    
    if (readings.length > RECENT_READINGS_TO_SHOW) {
        listContainer.innerHTML += `
            <div class="reading-item view-all">
                <div style="width:100%; text-align:center; padding:0.75rem; color:var(--info); cursor:pointer; font-weight: 500;" onclick="window.location.href='readings.html'">
                    View all ${readings.length} readings <i class="ph ph-arrow-right"></i>
                </div>
            </div>`;
    }
}

// Fixed Chart.js Integration
function updateChart(readings) {
    const ctx = document.getElementById('leadsChart');
    if (!ctx) return; 

    let labels = [];
    let dataPoints = [];

    // Process real Firebase data
    if (readings && readings.length > 0) {
        const sortedReadings = [...readings].sort((a, b) => {
            const timeA = a.timestamp instanceof Date ? a.timestamp.getTime() : new Date(a.date || Date.now()).getTime();
            const timeB = b.timestamp instanceof Date ? b.timestamp.getTime() : new Date(b.date || Date.now()).getTime();
            return timeA - timeB; 
        });
        
        const chartData = sortedReadings.slice(-14);
        
        labels = chartData.map(r => {
            const d = r.timestamp instanceof Date ? r.timestamp : new Date(r.date || Date.now());
            const isToday = d.toDateString() === new Date().toDateString();
            return isToday ? formatTime12Hour(r.time).replace(' ', '\n') : `${d.getMonth()+1}/${d.getDate()}\n${formatTime12Hour(r.time).split(' ')[1] || ''}`;
        });
        
        // Force conversion to numbers
        dataPoints = chartData.map(r => Number(r.glucose));
    }

    // Find any existing/dummy chart and destroy it completely
    const existingChart = Chart.getChart(ctx);
    if (existingChart) {
        existingChart.destroy();
    }
    if (window.leadsChart instanceof Chart) {
        window.leadsChart.destroy();
    }

    // Draw the new chart with real data
    window.leadsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Glucose (mg/dL)',
                data: dataPoints,
                borderColor: '#3b82f6',
                backgroundColor: (context) => {
                    const chart = context.chart;
                    const {ctx: chartCtx, chartArea} = chart;
                    if (!chartArea) return null;
                    const gradient = chartCtx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.4)');
                    gradient.addColorStop(1, 'rgba(139, 92, 246, 0.0)');
                    return gradient;
                },
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#ffffff',
                pointBorderColor: '#3b82f6',
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                annotation: {
                    annotations: {
                        targetLow: { type: 'line', yMin: 70, yMax: 70, borderColor: '#10b981', borderWidth: 1, borderDash: [5, 5] },
                        targetHigh: { type: 'line', yMin: 140, yMax: 140, borderColor: '#f59e0b', borderWidth: 1, borderDash: [5, 5] }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    suggestedMin: 50,
                    suggestedMax: 200,
                    grid: { color: 'rgba(0, 0, 0, 0.05)' }
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });
}

const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .reading-item { transition: all 0.2s ease; }
    .reading-item:hover { background: var(--bg-hover); transform: translateX(5px); }
    .stat-change.positive { color: #10b981; }
    .stat-change.negative { color: #ef4444; }
    .stat-change.neutral { color: var(--text-secondary); }
    .r-val.low { color: #ef4444; }
    .r-val.normal { color: #10b981; }
    .r-val.mid { color: #f59e0b; }
    .r-val.high { color: #dc2626; }
`;
document.head.appendChild(style);

function setupModalListeners() {
    const addBtn = document.getElementById('addReadingBtn');
    const mobileAddBtn = document.getElementById('mobileAddReadingBtn'); // Wired up mobile btn
    const modal = document.getElementById('readingModal');
    const closeBtn = document.getElementById('closeModalBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const addForm = document.getElementById('addReadingForm');
    
    // Function to handle opening the modal securely
    function openModal(e) {
        if (e) e.preventDefault();
        const now = new Date();
        const dateInput = document.getElementById('inputDate');
        const timeInput = document.getElementById('inputTime');
        
        // CRITICAL TIMEZONE FIX: Uses local timezone, prevents "yesterday" bug
        const localDate = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
        
        if (dateInput) dateInput.value = localDate;
        if (timeInput) timeInput.value = now.toTimeString().slice(0, 5);
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    if (addBtn) addBtn.addEventListener('click', openModal);
    if (mobileAddBtn) mobileAddBtn.addEventListener('click', openModal);
    
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    
    if (addForm) {
        addForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!currentUser) return;
            
            const dateVal = document.getElementById('inputDate').value;
            const timeVal = document.getElementById('inputTime').value;
            const glucoseVal = parseInt(document.getElementById('inputGlucose').value);
            const notes = document.querySelector('textarea')?.value || '';
            
            if (!glucoseVal || glucoseVal < 1 || glucoseVal > 600) {
                alert('Please enter a valid glucose level (1-600 mg/dL)');
                return;
            }
            
            const submitBtn = addForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Saving...';
            submitBtn.disabled = true;
            
            try {
                const dateTimeString = `${dateVal}T${timeVal}`;
                const timestamp = new Date(dateTimeString);
                
                const selectedContextNode = document.querySelector('input[name="context"]:checked');
                let context = 'Manual';
                
                if (selectedContextNode) {
                    const val = selectedContextNode.value;
                    if (val === 'fasting') context = 'Fasting';
                    else if (val === 'pre-meal') context = 'Pre-Meal';
                    else if (val === 'post-meal') context = 'Post-Meal';
                    else if (val === 'bedtime') context = 'Bedtime';
                    else if (val === 'manual') context = 'Manual';
                    else if (val === '') context = '';
                }
                
                await addDoc(collection(db, "readings"), {
                    userId: currentUser.uid,
                    glucose: glucoseVal,
                    comment: notes,
                    date: dateVal,
                    time: timeVal,
                    timestamp: Timestamp.fromDate(timestamp),
                    created: Timestamp.now(),
                    context: context
                });
                
                closeModal();
                addForm.reset();
                showNotification('Reading added successfully!', 'success');
                
            } catch (error) {
                console.error("Error adding reading:", error);
                showNotification('Error saving reading. Please try again.', 'error');
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
}

function showNotification(message, type = 'success') {
    const existingNotifications = document.querySelectorAll('.custom-notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `custom-notification ${type}`;
    notification.innerHTML = `<div class="notification-content"><i class="ph ph-${type === 'success' ? 'check-circle' : 'warning-circle'}"></i><span>${message}</span></div>`;
    
    notification.style.cssText = `
        position: fixed; bottom: 20px; right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'}; color: white;
        padding: 1rem 1.5rem; border-radius: 0.75rem; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000; max-width: 300px; animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => { if (notification.parentNode) notification.parentNode.removeChild(notification); }, 300);
    }, 3000);
}

window.addEventListener('beforeunload', () => { if (unsubscribe) unsubscribe(); });