// // suggest.js
// // AI-based Suggestions and Bar Chart for Glucose Readings

// // Function to generate bar chart
// function renderGlucoseBarChart(readings) {
//     const container = document.getElementById('trendsChart');
//     container.innerHTML = '<canvas id="glucoseChart" style="max-height: 300px"></canvas>';

//     const labels = readings.map(r => `${r.date}\n${r.time}`);
//     const data = readings.map(r => r.glucose);
//     const bgColors = data.map(val => {
//         if (val >= 180) return 'rgba(239, 68, 68, 0.8)';      // High - Red
//         if (val >= 130) return 'rgba(251, 191, 36, 0.8)';     // Medium - Orange
//         return 'rgba(16, 185, 129, 0.8)';                     // Good - Green
//     });

//     new Chart(document.getElementById('glucoseChart'), {
//         type: 'bar',
//         data: {
//             labels,
//             datasets: [{
//                 label: 'Glucose (mg/dL)',
//                 data,
//                 backgroundColor: bgColors,
//                 borderRadius: 20,
//                 borderSkipped: false,
//             }]
//         },
//         options: {
//             responsive: true,
//             plugins: {
//                 legend: { display: false },
//                 tooltip: {
//                     callbacks: {
//                         label: context => `${context.parsed.y} mg/dL`
//                     }
//                 }
//             },
//             scales: {
//                 y: {
//                     beginAtZero: true,
//                     title: { display: true, text: 'mg/dL' }
//                 },
//                 x: {
//                     ticks: {
//                         autoSkip: true,
//                         maxRotation: 0,
//                         minRotation: 0
//                     }
//                 }
//             }
//         }
//     });
// }

// // Function to analyze readings and return suggestion
// function getAISuggestion(readings) {
//     if (readings.length < 2) return 'Add at least two readings for suggestions.';
//     const values = readings.map(r => r.glucose);
//     const avg = values.reduce((a, b) => a + b, 0) / values.length;

//     if (avg >= 180) return '⚠️ Your average glucose is high. Consider consulting your doctor and reviewing your diet.';
//     if (avg >= 130) return '⚠️ Glucose levels are in the medium range. Try to maintain a balanced lifestyle and monitor closely.';
//     return '✅ Good control! Keep maintaining a healthy lifestyle.';
// }

// // Public function to be used from main script
// function updateSuggestions(readings) {
//     renderGlucoseBarChart(readings);
//     const message = getAISuggestion(readings);
//     const messageEl = document.getElementById('trendsMessage');
//     if (messageEl) messageEl.textContent = message;
// }
// suggest.js
// AI-based Suggestions and Bar Chart for Glucose Readings


// best code

function renderGlucoseBarChart(readings) {
    const container = document.getElementById('trendsChart');
    // container.innerHTML = `
    //     <canvas id="glucoseChart" style="max-height: 300px;"></canvas>
    //     <div id="aiSuggestions" class="content-card" style="margin-top: 1rem; border-radius: 1.25rem; padding: 1rem; background: var(--card-bg); box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
    //         <h3 style="margin-bottom: 0.75rem; color: var(--primary);">AI Health Suggestions</h3>
    //         <ul id="suggestionList" style="list-style: disc; padding-left: 1.5rem; color: var(--text-light);"></ul>
    //     </div>
    // `;

    const labels = readings.map(r => `${r.date}\n${r.time}`);
    const data = readings.map(r => r.glucose);
    const bgColors = data.map(val => {
        if (val >= 180) return 'rgba(239, 68, 68, 0.8)';
        if (val >= 130) return 'rgba(251, 191, 36, 0.8)';
        return 'rgba(16, 185, 129, 0.8)';
    });

    new Chart(document.getElementById('glucoseChart'), {
        // type: 'line', 
        type:'bar',
        data: {
            labels,
            datasets: [{
                label: 'Glucose (mg/dL)',
                data,
                backgroundColor: bgColors,
                borderRadius: 20,
                bottomRight: 20,
                borderSkipped: false,
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: context => `${context.parsed.y} mg/dL`
                    }
                }
            },
            scales: {
                y: {
                            // stacked: true,

                    beginAtZero: true,
                    title: { display: true, text: 'mg/dL' }
                },
                x: {
                    ticks: {
                        autoSkip: true,
                        maxRotation: 0,
                        minRotation: 0
                    }
                }
            }
        }
    });
}


// function renderGlucoseBarChart(readings) {
//     const container = document.getElementById('trendsChart');
//     container.innerHTML = `
//         <canvas id="glucoseChart" style="max-height: 300px;"></canvas>
//         <div id="aiSuggestions" class="content-card" style="margin-top: 1rem; border-radius: 1.25rem; padding: 1rem; background: var(--card-bg); box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
//             <h3 style="margin-bottom: 0.75rem; color: var(--primary);">AI Health Suggestions</h3>
//             <ul id="suggestionList" style="list-style: disc; padding-left: 1.5rem; color: var(--text-light);"></ul>
//         </div>
//     `;

//     // Example data: Assume three categories with progress (0-100%)
//     const datasets = [
//         { label: 'High', value: readings.length > 0 ? (readings.filter(r => r.glucose >= 180).length / readings.length * 100) : 0, color: 'rgba(239, 68, 68, 0.8)' },
//         { label: 'Medium', value: readings.length > 0 ? (readings.filter(r => r.glucose >= 130 && r.glucose < 180).length / readings.length * 100) : 0, color: 'rgba(16, 185, 129, 0.8)' },
//         { label: 'Low', value: readings.length > 0 ? (readings.filter(r => r.glucose < 130).length / readings.length * 100) : 0, color: 'rgba(59, 130, 246, 0.8)' }
//     ];

//     new Chart(document.getElementById('glucoseChart'), {
//         type: 'doughnut',
//         data: {
//             datasets: datasets.map((d, index) => ({
//                 data: [d.value, 100 - d.value],
//                 backgroundColor: [d.color, 'rgba(0, 0, 0, 0)'], // Transparent for the rest
//                 borderWidth: 0,
//                 borderRadius: 20,
//                 weight: 1 + (2 - index) * 0.5, // Adjust thickness (outer ring thicker)
//                 cutout: '70%' // Create space for inner rings

//             }))
//         },
//         options: {
//             responsive: true,
//             circumference: 360,
//             rotation: -90,
//             plugins: {
//                 legend: { display: false },
//                 tooltip: {
//                     enabled: false
//                 }
//             },
//             maintainAspectRatio: false
//         }
//     });
// }

function getAISuggestions(readings) {
    const suggestions = [];

    if (readings.length < 2) {
        suggestions.push('Add at least two readings to get personalized advice.');
        return suggestions;
    }

    const values = readings.map(r => r.glucose);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const highReadings = values.filter(v => v >= 180).length;
    const mediumReadings = values.filter(v => v >= 130 && v < 180).length;
    const lowReadings = values.filter(v => v < 70).length;

    suggestions.push(`Your average glucose is ${avg.toFixed(1)} mg/dL.`);

    if (avg >= 180) {
        suggestions.push('⚠️ Your average glucose is in the high range. Please consult your doctor.');
        suggestions.push('❗ Reduce sugar intake and avoid processed carbs.');
        suggestions.push('🧘‍♀️ Include at least 30 minutes of physical activity daily.');
    } else if (avg >= 130) {
        suggestions.push('⚠️ Your average glucose is slightly elevated. Try to monitor your meals and avoid overeating.');
        suggestions.push('🍽️ Consider smaller, more frequent meals.');
    } else {
        suggestions.push('✅ Your glucose control looks good. Keep it up!');
        suggestions.push('🥗 Continue maintaining a balanced diet and hydration.');
    }

    if (lowReadings > 0) {
        suggestions.push('⚠️ Some readings are too low. Consider carrying a quick source of glucose.');
    }

    suggestions.push('📊 Try to maintain your readings between 80 and 130 mg/dL for best results.');
    suggestions.push('🕒 Check glucose regularly at the same time each day to spot patterns.');
    suggestions.push('🛌 Avoid eating heavy meals before bed.');

    return suggestions;
}

function updateSuggestions(readings) {
    renderGlucoseBarChart(readings);
    const suggestionList = document.getElementById('suggestionList');
    if (!suggestionList) return;

    const suggestions = getAISuggestions(readings);
    suggestionList.innerHTML = '';
    suggestions.forEach(s => {
        const li = document.createElement('li');
        li.textContent = s;
        suggestionList.appendChild(li);
    });
}