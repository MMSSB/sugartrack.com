import { auth, db } from "./firebase-init.js";
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    let distChartInstance = null;
    let contextChartInstance = null;

    auth.onAuthStateChanged((user) => {
        if (user) {
            loadAnalyticsData(user.uid);
        } else {
            window.location.href = 'login.html';
        }
    });

    async function loadAnalyticsData(uid) {
        try {
            // Get last 30 days of readings
            const now = new Date();
            const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
            
            const q = query(collection(db, "readings"), where("userId", "==", uid));
            const snapshot = await getDocs(q);
            
            const readings = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                const timestamp = data.timestamp?.toDate ? data.timestamp.toDate() : new Date(data.timestamp);
                if (timestamp >= thirtyDaysAgo) {
                    readings.push({ glucose: Number(data.glucose), context: data.context || 'Manual' });
                }
            });

            processAndRender(readings);

        } catch (error) {
            console.error("Error loading analytics:", error);
        }
    }

    function processAndRender(readings) {
        if (readings.length === 0) return;

        // 1. Time In Range Calculation (70 - 130 mg/dL)
        let low = 0, inRange = 0, high = 0;
        let sumFasting = 0, countFasting = 0;
        let sumPost = 0, countPost = 0;

        readings.forEach(r => {
            if (r.glucose < 70) low++;
            else if (r.glucose <= 130) inRange++;
            else high++;

            if (r.context === 'Fasting') { sumFasting += r.glucose; countFasting++; }
            if (r.context === 'Post-Meal') { sumPost += r.glucose; countPost++; }
        });

        const total = readings.length;
        const tirPercent = Math.round((inRange / total) * 100);
        document.getElementById('tirValue').innerHTML = `${tirPercent} <span style="font-size: 1rem; color: var(--text-secondary);">%</span>`;
        
        const tirSub = document.getElementById('tirSubtext');
        if (tirPercent >= 70) { tirSub.innerHTML = `<span style="color: var(--success);"><i class="fa-solid fa-check-circle"></i> Target Met</span>`; }
        else { tirSub.innerHTML = `<span style="color: var(--warning);"><i class="fa-solid fa-triangle-exclamation"></i> Below Target</span>`; }

        document.getElementById('avgFasting').innerHTML = countFasting > 0 ? `${Math.round(sumFasting/countFasting)} <span style="font-size: 1rem; color: var(--text-secondary);">mg/dL</span>` : '--';
        document.getElementById('avgPostMeal').innerHTML = countPost > 0 ? `${Math.round(sumPost/countPost)} <span style="font-size: 1rem; color: var(--text-secondary);">mg/dL</span>` : '--';

        renderCharts(low, inRange, high, sumFasting, countFasting, sumPost, countPost);
    }

    function renderCharts(low, inRange, high, sumFasting, countFasting, sumPost, countPost) {
        const rootStyles = getComputedStyle(document.documentElement);
        const colorSuccess = rootStyles.getPropertyValue('--success').trim() || '#10b981';
        const colorWarning = rootStyles.getPropertyValue('--warning').trim() || '#f59e0b';
        const colorDanger = rootStyles.getPropertyValue('--danger').trim() || '#ef4444';
        const colorInfo = rootStyles.getPropertyValue('--info').trim() || '#3b82f6';
        const textColor = rootStyles.getPropertyValue('--text-secondary').trim() || '#71717a';

        // Distribution Chart
        const ctxDist = document.getElementById('distributionChart').getContext('2d');
        if (distChartInstance) distChartInstance.destroy();
        distChartInstance = new Chart(ctxDist, {
            type: 'doughnut',
            data: {
                labels: ['Low (<70)', 'In Range (70-130)', 'High (>130)'],
                datasets: [{
                    data: [low, inRange, high],
                    backgroundColor: [colorWarning, colorSuccess, colorDanger],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom', labels: { color: textColor } } },
                cutout: '75%'
            }
        });

        // Context Bar Chart
        const avgFast = countFasting > 0 ? Math.round(sumFasting/countFasting) : 0;
        const avgPost = countPost > 0 ? Math.round(sumPost/countPost) : 0;

        const ctxContext = document.getElementById('contextChart').getContext('2d');
        if (contextChartInstance) contextChartInstance.destroy();
        contextChartInstance = new Chart(ctxContext, {
            type: 'bar',
            data: {
                labels: ['Fasting', 'Post-Meal'],
                datasets: [{
                    label: 'Avg Glucose (mg/dL)',
                    data: [avgFast, avgPost],
                    backgroundColor: [colorWarning, colorInfo],
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, grid: { color: 'rgba(113, 113, 122, 0.1)' }, ticks: { color: textColor } },
                    x: { grid: { display: false }, ticks: { color: textColor } }
                }
            }
        });
    }
});