// analytics.js
document.addEventListener('DOMContentLoaded', function() {
    // Global variables
    let readings = [];
    let currentUser = null;
    let chartInstances = {
        trendsChart: null,
        dailyPatternsChart: null,
        dayOfWeekChart: null,
        distributionChart: null,
        pieChart: null
    };
    
    // Initialize Firebase Auth listener
    auth.onAuthStateChanged((user) => {
        if (user) {
            currentUser = user;
            document.getElementById('appContainer').style.display = 'flex';
            loadUserData();
            setupAnalytics();
        } else {
            window.location.href = 'login.html';
        }
    });

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
                updateAnalytics(30); // Initialize with last 30 days
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

    // Set up analytics controls
    function setupAnalytics() {
        const timePeriodSelect = document.getElementById('timePeriodSelect');
        const customDateRange = document.getElementById('customDateRange');
        
        // Set default dates for custom range
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 30);
        
        document.getElementById('startDate').valueAsDate = startDate;
        document.getElementById('endDate').valueAsDate = endDate;
        
        timePeriodSelect.addEventListener('change', function() {
            if (this.value === 'custom') {
                customDateRange.classList.remove('hidden');
            } else {
                customDateRange.classList.add('hidden');
                updateAnalytics(parseInt(this.value));
            }
        });
        
        document.getElementById('applyDateRange').addEventListener('click', function() {
            const startDate = document.getElementById('startDate').value;
            const endDate = document.getElementById('endDate').value;
            
            if (startDate && endDate) {
                updateAnalytics('custom', startDate, endDate);
            } else {
                alert('Please select both start and end dates');
            }
        });
    }

    // Main analytics update function
    function updateAnalytics(days, startDate, endDate) {
        if (!readings || readings.length === 0) {
            console.log("No readings data available");
            showLoadingState();
            return;
        }
        
        // Filter readings based on time period
        let filteredReadings = filterReadingsByDate(days, startDate, endDate);
        
        if (filteredReadings.length === 0) {
            showNoDataState();
            return;
        }
        
        // Calculate metrics
        calculateMetrics(filteredReadings);
        
        // Update charts
        updateTrendsChart(filteredReadings);
        updateDailyPatternsChart(filteredReadings);
        updateDayOfWeekChart(filteredReadings);
        updateDistributionChart(filteredReadings);
        updatePieChart(filteredReadings);
    }

    // Filter readings by date range
    function filterReadingsByDate(days, startDate, endDate) {
        if (typeof days === 'number') {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - days);
            return readings.filter(r => new Date(r.timestamp) >= cutoffDate);
        } else if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            end.setHours(23, 59, 59); // Include entire end day
            return readings.filter(r => {
                const readingDate = new Date(r.timestamp);
                return readingDate >= start && readingDate <= end;
            });
        }
        return readings;
    }

    // Show loading state
    function showLoadingState() {
        document.querySelectorAll('.metric-value').forEach(el => {
            el.textContent = '--';
        });
        document.querySelectorAll('.metric-trend').forEach(el => {
            el.innerHTML = '';
        });
    }

    // Show no data state
    function showNoDataState() {
        document.querySelectorAll('.metric-value').forEach(el => {
            el.textContent = 'No data';
        });
        document.querySelectorAll('.metric-trend').forEach(el => {
            el.innerHTML = '';
        });
        
        // Clear all charts
        Object.values(chartInstances).forEach(chart => {
            if (chart) {
                chart.destroy();
            }
        });
    }

    // Calculate and display metrics
    function calculateMetrics(readings) {
        const glucoseValues = readings.map(r => r.glucose);
        const avgGlucose = Math.round(glucoseValues.reduce((a, b) => a + b, 0) / glucoseValues.length);
        
        // Calculate time in range (70-180 mg/dL)
        const inRangeCount = readings.filter(r => r.glucose >= 70 && r.glucose <= 180).length;
        const timeInRange = Math.round((inRangeCount / readings.length) * 100);
        
        // Calculate high readings (>180 mg/dL)
        const highCount = readings.filter(r => r.glucose > 180).length;
        const highReadings = Math.round((highCount / readings.length) * 100);
        
        // Calculate low readings (<70 mg/dL)
        const lowCount = readings.filter(r => r.glucose < 70).length;
        const lowReadings = Math.round((lowCount / readings.length) * 100);
        
        // Update metrics display
        document.getElementById('avgGlucose').textContent = `${avgGlucose} mg/dL`;
        document.getElementById('timeInRange').textContent = `${timeInRange}%`;
        document.getElementById('highReadings').textContent = `${highReadings}%`;
        document.getElementById('lowReadings').textContent = `${lowReadings}%`;
        
        // Update trend indicators (simplified - in a real app you'd compare with previous period)
        updateTrendIndicator('avgTrend', 'neutral');
        updateTrendIndicator('rangeTrend', 'up');
        updateTrendIndicator('highTrend', 'down');
        updateTrendIndicator('lowTrend', 'neutral');
    }

    // Update trend indicator
    function updateTrendIndicator(elementId, direction) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        element.className = `metric-trend ${direction}`;
        element.innerHTML = direction === 'up' ? 
            '<i class="fas fa-arrow-up"></i> 5% from last period' :
            direction === 'down' ? 
            '<i class="fas fa-arrow-down"></i> 2% from last period' :
            'No change from last period';
    }

    // Update trends chart
    function updateTrendsChart(readings) {
        const ctx = document.getElementById('trendsChart').getContext('2d');
        
        // Group readings by date and calculate averages
        const readingsByDate = {};
        readings.forEach(reading => {
            const dateStr = reading.timestamp.toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
            if (!readingsByDate[dateStr]) {
                readingsByDate[dateStr] = { sum: 0, count: 0 };
            }
            readingsByDate[dateStr].sum += reading.glucose;
            readingsByDate[dateStr].count++;
        });
        
        const labels = Object.keys(readingsByDate).sort((a, b) => new Date(a) - new Date(b));
        const data = labels.map(date => Math.round(readingsByDate[date].sum / readingsByDate[date].count));
        
        // Destroy previous chart if it exists
        if (chartInstances.trendsChart) {
            chartInstances.trendsChart.destroy();
        }
        
        chartInstances.trendsChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Daily Average Glucose',
                    data: data,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.3,
                    fill: true,
                    pointRadius: 3,
                    pointHoverRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                return `${context.parsed.y} mg/dL`;
                            }
                        }
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

    // Update daily patterns chart
    function updateDailyPatternsChart(readings) {
        const ctx = document.getElementById('dailyPatternsChart').getContext('2d');
        
        // Group readings by hour
        const readingsByHour = Array(24).fill().map(() => []);
        readings.forEach(reading => {
            const hour = new Date(reading.timestamp).getHours();
            readingsByHour[hour].push(reading.glucose);
        });
        
        const hours = Array.from({length: 24}, (_, i) => 
            i === 0 ? '12 AM' : 
            i < 12 ? `${i} AM` : 
            i === 12 ? '12 PM' : 
            `${i-12} PM`);
        
        const avgByHour = readingsByHour.map(hourReadings => 
            hourReadings.length ? 
            Math.round(hourReadings.reduce((a, b) => a + b, 0) / hourReadings.length) : 
            0);
        
        // Destroy previous chart if it exists
        if (chartInstances.dailyPatternsChart) {
            chartInstances.dailyPatternsChart.destroy();
        }
        
        chartInstances.dailyPatternsChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: hours,
                datasets: [{
                    label: 'Average Glucose by Hour',
                    data: avgByHour,
                    backgroundColor: '#3b82f6',
                    borderColor: '#2563eb',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.parsed.y} mg/dL`;
                            }
                        }
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

    // Update day of week chart
    function updateDayOfWeekChart(readings) {
        const ctx = document.getElementById('dayOfWeekChart').getContext('2d');
        
        // Group readings by day of week (0=Sunday, 6=Saturday)
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const readingsByDay = Array(7).fill().map(() => []);
        
        readings.forEach(reading => {
            const day = new Date(reading.timestamp).getDay();
            readingsByDay[day].push(reading.glucose);
        });
        
        const avgByDay = readingsByDay.map(dayReadings => 
            dayReadings.length ? 
            Math.round(dayReadings.reduce((a, b) => a + b, 0) / dayReadings.length) : 
            0);
        
        // Destroy previous chart if it exists
        if (chartInstances.dayOfWeekChart) {
            chartInstances.dayOfWeekChart.destroy();
        }
        
        chartInstances.dayOfWeekChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: days,
                datasets: [{
                    label: 'Average Glucose by Day',
                    data: avgByDay,
                    backgroundColor: '#10b981',
                    borderColor: '#059669',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.parsed.y} mg/dL`;
                            }
                        }
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

    // Update distribution chart
    function updateDistributionChart(readings) {
        const ctx = document.getElementById('distributionChart').getContext('2d');
        
        // Define glucose ranges
        const ranges = ['<70', '70-120', '121-180', '181-250', '>250'];
        const counts = [
            readings.filter(r => r.glucose < 70).length,
            readings.filter(r => r.glucose >= 70 && r.glucose <= 120).length,
            readings.filter(r => r.glucose > 120 && r.glucose <= 180).length,
            readings.filter(r => r.glucose > 180 && r.glucose <= 250).length,
            readings.filter(r => r.glucose > 250).length
        ];
        
        // Destroy previous chart if it exists
        if (chartInstances.distributionChart) {
            chartInstances.distributionChart.destroy();
        }
        
        chartInstances.distributionChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ranges,
                datasets: [{
                    label: 'Readings by Range',
                    data: counts,
                    backgroundColor: [
                        '#ef4444', // Red for low
                        '#10b981', // Green for in range
                        '#3b82f6', // Blue for slightly high
                        '#f59e0b', // Orange for high
                        '#ef4444'  // Red for very high
                    ],
                    borderColor: [
                        '#dc2626',
                        '#059669',
                        '#2563eb',
                        '#d97706',
                        '#dc2626'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.parsed.y} readings (${Math.round((context.parsed.y / readings.length) * 100)}%)`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Readings'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Glucose Range (mg/dL)'
                        }
                    }
                }
            }
        });
    }

    // Update pie chart
    function updatePieChart(readings) {
        const ctx = document.getElementById('pieChart').getContext('2d');
        
        // Calculate percentages
        const inRange = readings.filter(r => r.glucose >= 70 && r.glucose <= 180).length;
        const belowRange = readings.filter(r => r.glucose < 70).length;
        const aboveRange = readings.filter(r => r.glucose > 180).length;
        const total = readings.length;
        
        const data = {
            labels: ['In Range (70-180)', 'Below Range (<70)', 'Above Range (>180)'],
            datasets: [{
                data: [
                    Math.round((inRange / total) * 100),
                    Math.round((belowRange / total) * 100),
                    Math.round((aboveRange / total) * 100)
                ],
                backgroundColor: [
                    '#10b981', // Green for in range
                    '#ef4444', // Red for low
                    '#f59e0b'  // Orange for high
                ],
                borderColor: [
                    '#059669',
                    '#dc2626',
                    '#d97706'
                ],
                borderWidth: 1
            }]
        };
        
        // Destroy previous chart if it exists
        if (chartInstances.pieChart) {
            chartInstances.pieChart.destroy();
        }
        
        chartInstances.pieChart = new Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.raw}%`;
                            }
                        }
                    }
                },
                cutout: '70%'
            }
        });
    }

    // Set up export buttons
    // document.getElementById('exportPdfReport').addEventListener('click', exportPdfReport);
    // document.getElementById('exportImageReport').addEventListener('click', exportImageReport);
    // document.getElementById('exportDataReport').addEventListener('click', exportDataReport);

    // // Export as PDF
    // function exportPdfReport() {
    //     const { jsPDF } = window.jspdf;
    //     const doc = new jsPDF();
        
    //     // Add title
    //     doc.setFontSize(18);
    //     doc.text('Glucose Analytics Report', 10, 15);
        
    //     // Add user info
    //     doc.setFontSize(12);
    //     const userName = document.getElementById('userWelcomeName').textContent || 'User';
    //     const date = new Date().toLocaleDateString();
    //     doc.text(`Report for: ${userName}`, 10, 25);
    //     doc.text(`Report generated on: ${date}`, 10, 35);
        
    //     // Add metrics
    //     doc.setFontSize(14);
    //     doc.text('Key Metrics:', 10, 45);
    //     doc.setFontSize(12);
    //     doc.text(`Average Glucose: ${document.getElementById('avgGlucose').textContent}`, 15, 55);
    //     doc.text(`Time in Range: ${document.getElementById('timeInRange').textContent}`, 15, 65);
    //     doc.text(`High Readings: ${document.getElementById('highReadings').textContent}`, 15, 75);
    //     doc.text(`Low Readings: ${document.getElementById('lowReadings').textContent}`, 15, 85);
        
    //     // Add a page for charts (in a real app you would add actual charts)
    //     doc.addPage();
    //     doc.text('Glucose Trends and Analysis', 10, 15);
    //     doc.text('(Charts would be rendered here in a full implementation)', 10, 25);
        
    //     // Save the PDF
    //     doc.save('glucose_analytics_report.pdf');
    // }

    // Export as image
    // function exportImageReport() {
    //     const analyticsDashboard = document.querySelector('.main-content');
        
    //     html2canvas(analyticsDashboard, {
    //         scale: 2, // Higher quality
    //         logging: false,
    //         useCORS: true,
    //         allowTaint: true
    //     }).then(canvas => {
    //         const link = document.createElement('a');
    //         link.download = 'glucose_analytics.png';
    //         link.href = canvas.toDataURL('image/png');
    //         link.click();
    //     });
    // }

// 

// Enhanced export functions for analytics.js

// Export as PDF with charts
function exportPdfReport() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    // Get user data
    const userName = document.getElementById('userWelcomeName').textContent || 'User';
    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Add header
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text('Glucose Analytics Report', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Generated for: ${userName}`, 14, 30);
    doc.text(`Date: ${currentDate}`, 14, 36);
    
    // Add metrics section
    doc.setFontSize(14);
    doc.text('Key Metrics', 14, 46);
    doc.setFontSize(12);
    doc.text(`Average Glucose: ${document.getElementById('avgGlucose').textContent}`, 20, 54);
    doc.text(`Time in Range: ${document.getElementById('timeInRange').textContent}`, 20, 62);
    doc.text(`High Readings: ${document.getElementById('highReadings').textContent}`, 20, 70);
    doc.text(`Low Readings: ${document.getElementById('lowReadings').textContent}`, 20, 78);

    // Convert charts to images and add to PDF
    const addChartToPdf = (chartId, title, yPosition) => {
        return new Promise((resolve) => {
            const canvas = document.getElementById(chartId);
            if (!canvas) return resolve();
            
            const canvasImage = canvas.toDataURL('image/png', 1.0);
            const imgWidth = 180; // mm
            const imgHeight = canvas.height * imgWidth / canvas.width;
            
            doc.addPage();
            doc.setFontSize(14);
            doc.text(title, 105, 20, { align: 'center' });
            doc.addImage(canvasImage, 'PNG', 15, 30, imgWidth, imgHeight);
            resolve();
        });
    };

    // Add all charts sequentially
    Promise.all([
        addChartToPdf('trendsChart', 'Glucose Trends Over Time', 100),
        addChartToPdf('dailyPatternsChart', 'Daily Patterns', 100),
        addChartToPdf('dayOfWeekChart', 'Day of Week Analysis', 100),
        addChartToPdf('distributionChart', 'Glucose Distribution', 100),
        addChartToPdf('pieChart', 'Glucose Range Distribution', 100)
    ]).then(() => {
        // Add footer
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(10);
            doc.setTextColor(150);
            doc.text('Page ' + i + ' of ' + pageCount, 105, 287, { align: 'center' });
            doc.text('Generated by SugarTrack', 105, 292, { align: 'center' });
        }

        // Save the PDF
        doc.save(`glucose_analytics_${currentDate.replace(/\s+/g, '_')}.pdf`);
    });
}

// Export as high-quality image
function exportImageReport() {
    // Get the entire analytics dashboard content
    const element = document.querySelector('.main-content');
    
    // Set options for higher quality
    const options = {
        scale: 2, // Higher scale for better quality
        logging: false,
        useCORS: true,
        scrollX: 0,
        scrollY: -window.scrollY,
        windowWidth: document.documentElement.scrollWidth,
        windowHeight: document.documentElement.scrollHeight
    };

    html2canvas(element, options).then(canvas => {
        // Create download link
        const link = document.createElement('a');
        link.download = `glucose_analytics_${new Date().toISOString().split('T')[0]}.png`;
        
        // For higher quality, convert to JPEG with quality setting
        const quality = 0.95; // 95% quality
        link.href = canvas.toDataURL('image/jpeg', quality);
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}

// Export data as properly formatted Excel/CSV
function exportDataReport() {
    if (!readings || readings.length === 0) {
        alert('No data available to export');
        return;
    }

    // Format dates properly for Excel
    const formatDateForExcel = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).replace(/\//g, '-'); // Use hyphens instead of slashes
    };

    // Create CSV content
    let csv = 'Date,Time,Glucose (mg/dL),Comment\n';
    
    readings.forEach(reading => {
        const formattedDate = formatDateForExcel(reading.date);
        const formattedTime = reading.time.includes('M') ? reading.time : 
            formatTime12Hour(reading.time); // Convert 24h to 12h if needed
        
        // Escape commas and quotes in comments
        const escapedComment = reading.comment ? 
            `"${reading.comment.replace(/"/g, '""')}"` : '';
        
        csv += `${formattedDate},${formattedTime},${reading.glucose},${escapedComment}\n`;
    });

    // Create download link
    const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `glucose_data_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
}

// Helper function to format time as 12-hour (if needed)
function formatTime12Hour(time) {
    if (time.includes('M')) return time; // Already in 12-hour format
    
    const [hours, minutes] = time.split(':');
    const period = +hours >= 12 ? 'PM' : 'AM';
    const hours12 = +hours % 12 || 12;
    
    return `${hours12}:${minutes} ${period}`;
}
});
