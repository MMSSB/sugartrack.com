// stai-suggest.js - Enhanced AI Engine

(function initSTAiAutomatic() {

    // ── Core AI Logic Engine ──────────────────────────────────────────────────
    function getSTAiAnalysis(readings, avgGlucose, hoursSinceLast) {
        let message = '';
        let mood = 'happy'; // Default mood

        const lastReading = Number(readings[0].glucose);
        
        // Check if the latest reading is actually from today
        const lastTime = readings[0].timestamp instanceof Date ? readings[0].timestamp.getTime() : new Date(readings[0].date || Date.now()).getTime();
        const isToday = new Date(lastTime).toDateString() === new Date().toDateString();
        
        let glucoseDiff = 0;
        let hoursBetween = 0;
        if (readings.length > 1) {
            const prevReading = Number(readings[1].glucose);
            glucoseDiff = lastReading - prevReading;
            
            const timeA = readings[0].timestamp instanceof Date ? readings[0].timestamp.getTime() : new Date(readings[0].date).getTime();
            const timeB = readings[1].timestamp instanceof Date ? readings[1].timestamp.getTime() : new Date(readings[1].date).getTime();
            hoursBetween = (timeA - timeB) / (1000 * 60 * 60);
        }

        // 1. INACTIVITY CHECKS (Now uses Neutral Blue Mood)
        if (!isToday || hoursSinceLast > 24) {
            return { message: `I miss you! You haven't logged any readings today. Please check your sugar so I can help you stay on track.`, mood: 'neutral' };
        } else if (hoursSinceLast > 12) {
            return { message: `It's been a while since your last reading (${Math.floor(hoursSinceLast)} hours). Let's do a quick check-in!`, mood: 'neutral' };
        }

        // 2. CRITICAL ALERTS
        if (lastReading < 54) {
            return { message: `Critical low alert! ${lastReading} mg/dL is dangerous. Please consume 15g of fast-acting carbs (juice/candy) immediately!`, mood: 'danger' };
        } else if (lastReading > 300) {
            return { message: `Alert: Your glucose is very high (${lastReading} mg/dL). Please drink plenty of water, check for ketones, and take correction insulin if prescribed.`, mood: 'danger' };
        }

        // 3. TREND ALERTS
        if (hoursBetween > 0 && hoursBetween <= 4) {
            if (glucoseDiff <= -40 && lastReading < 100) {
                return { message: `Careful! Your glucose dropped rapidly by ${Math.abs(glucoseDiff)} points down to ${lastReading}. Keep a snack nearby just in case.`, mood: 'warning' };
            }
            if (glucoseDiff >= 50 && lastReading > 180) {
                return { message: `Your sugar spiked quickly by ${glucoseDiff} points up to ${lastReading}. A quick 15-minute walk can help blunt this spike!`, mood: 'warning' };
            }
        }

        // 4. STANDARD RANGES
        if (lastReading < 70) {
            message = `You are running low (${lastReading} mg/dL). Please eat a small snack with carbs and protein to stabilize.`;
            mood = 'danger';
        } else if (lastReading > 250) {
            message = `You're running quite high (${lastReading} mg/dL). Make sure to hydrate and avoid carb-heavy foods for your next meal.`;
            mood = 'danger';
        } else if (lastReading > 180) {
            message = `A bit elevated at ${lastReading} mg/dL. If you just ate, this might be normal. If not, consider a light activity!`;
            mood = 'warning';
        } else if (lastReading >= 80 && lastReading <= 110) {
            message = `Absolutely flawless! ${lastReading} mg/dL is a unicorn reading 🦄. Whatever you are doing right now, it's working perfectly!`;
            mood = 'excellent'; 
        } else if (lastReading >= 70 && lastReading <= 140) {
            message = `Looking great! ${lastReading} mg/dL is solidly in your target range. Keep up the excellent work!`;
            mood = 'happy';
        } else {
            message = `I've noted your reading of ${lastReading} mg/dL. I'll keep analyzing your trends as you log more data.`;
            mood = 'happy';
        }

        return { message, mood };
    }

    // ── Apply Tamagotchi Moods to UI ──────────────────────────────────────────
    function applyMood(mood) {
        const insightCard   = document.getElementById('staiInsightCard');
        const robotAvatars  = document.querySelectorAll('.robot-avatar');

        if (insightCard) {
            insightCard.className = 'stai-promo-card'; 
        }
        robotAvatars.forEach(r => {
            r.classList.remove('stai-warning', 'stai-danger', 'stai-happy', 'stai-excellent', 'stai-neutral');
        });

        if (mood === 'warning') {
            if (insightCard) insightCard.classList.add('stai-mood-warning');
            robotAvatars.forEach(r => r.classList.add('stai-warning'));
        } else if (mood === 'danger') {
            if (insightCard) insightCard.classList.add('stai-mood-danger');
            robotAvatars.forEach(r => r.classList.add('stai-danger'));
        } else if (mood === 'excellent') {
            if (insightCard) insightCard.classList.add('stai-mood-excellent');
            robotAvatars.forEach(r => r.classList.add('stai-excellent'));
        } else if (mood === 'neutral') {
            if (insightCard) insightCard.classList.add('stai-mood-neutral');
            robotAvatars.forEach(r => r.classList.add('stai-neutral'));
        } else {
            if (insightCard) insightCard.classList.add('stai-mood-happy');
            robotAvatars.forEach(r => r.classList.add('stai-happy'));
        }
    }

    // ── Public Connection to Dashboard Data ───────────────────────────────────
    window.updateStaiInsights = function(readings, avgGlucose) {
        const insightTextEl = document.getElementById('staiInsightText');
        if (!insightTextEl) return;

        // If NO readings exist at all, default to blue neutral!
        if (!readings || readings.length === 0) {
            insightTextEl.innerHTML = '<strong>STAi:</strong> Hi! I am STAi, your personal AI assistant. Add your first reading so I can start analyzing your data automatically!';
            applyMood('neutral');
            return;
        }

        try {
            const sortedReadings = [...readings].sort((a, b) => {
                const tA = a.timestamp instanceof Date ? a.timestamp.getTime() : new Date(a.date || Date.now()).getTime();
                const tB = b.timestamp instanceof Date ? b.timestamp.getTime() : new Date(b.date || Date.now()).getTime();
                return tB - tA;
            });

            const lastTime = sortedReadings[0].timestamp instanceof Date
                ? sortedReadings[0].timestamp.getTime()
                : new Date(sortedReadings[0].date || Date.now()).getTime();
            
            const hoursSinceLast = (Date.now() - lastTime) / (1000 * 60 * 60);

            const { message, mood } = getSTAiAnalysis(sortedReadings, avgGlucose, hoursSinceLast);
            
            insightTextEl.innerHTML = `<strong>STAi:</strong> ${message}`;
            applyMood(mood);

        } catch (error) {
            console.error("STAi Analysis Error:", error);
            insightTextEl.innerHTML = '<strong>STAi:</strong> I am connected and watching your data. Log a new reading to update my analysis!';
        }
    };

    document.addEventListener('DOMContentLoaded', () => {
        const insightTextEl = document.getElementById('staiInsightText');
        if (insightTextEl && insightTextEl.textContent.trim().includes('Analyzing')) {
             insightTextEl.innerHTML = '<strong>STAi:</strong> Reading your latest dashboard data...';
        }
    });

})();