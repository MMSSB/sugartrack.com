const CONFIG = {
    maxHistoryItems: 4
};

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. WELCOME SCREEN ---
    const welcomeScreen = document.getElementById('welcomeScreen');
    const welcomeForm = document.getElementById('welcomeForm');
    const nameInput = document.getElementById('nameInput');
    const displayUserName = document.getElementById('displayUserName');

    const savedName = localStorage.getItem('userName');
    if (!savedName) {
        document.documentElement.classList.remove('has-user');
    } else {
        displayUserName.textContent = savedName.split(' ')[0];
    }

    welcomeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const fullName = nameInput.value.trim();
        if (fullName) {
            const firstName = fullName.split(' ')[0];
            localStorage.setItem('userName', firstName);
            displayUserName.textContent = firstName;
            document.documentElement.classList.add('has-user');
        }
    });









// --- STANDALONE THEME ICON DROPDOWN (Animated & Active State) ---
    const themeIconBtn = document.getElementById('themeIconBtn');
    const themeIconMenu = document.getElementById('themeIconMenu');
    const currentThemeIcon = document.getElementById('currentThemeIcon');
    const themeMenuOpts = document.querySelectorAll('.theme-menu-opt');

    if (themeIconBtn && themeIconMenu && currentThemeIcon) {
        // Toggle Dropdown with CSS Class for Animation
        themeIconBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            themeIconMenu.classList.toggle('show');
        });

        // Close dropdown when clicking anywhere else
        document.addEventListener('click', (e) => {
            if (!themeIconBtn.contains(e.target) && !themeIconMenu.contains(e.target)) {
                themeIconMenu.classList.remove('show');
            }
        });

        // Function to dynamically update icon AND active menu state
        const updateThemeUI = (theme) => {
            // Update main button icon
            currentThemeIcon.className = ''; 
            if (theme === 'light') {
                currentThemeIcon.classList.add('ph', 'ph-sun');
            } else if (theme === 'dark') {
                currentThemeIcon.classList.add('ph', 'ph-moon');
            } else {
                currentThemeIcon.classList.add('ph', 'ph-desktop'); // System Default
            }

            // Update active color in dropdown list
            themeMenuOpts.forEach(opt => {
                if (opt.getAttribute('data-theme-val') === theme) {
                    opt.classList.add('active');
                } else {
                    opt.classList.remove('active');
                }
            });
        };

        // 1. Initialize icon and active color on page load
        const initTheme = localStorage.getItem('theme') || 'system';
        updateThemeUI(initTheme);

        // 2. Handle dropdown option clicks
        themeMenuOpts.forEach(opt => {
            opt.addEventListener('click', (e) => {
                e.preventDefault();
                const selectedTheme = opt.getAttribute('data-theme-val');
                
                // Set local storage and apply body attribute
                localStorage.setItem('theme', selectedTheme);
                const isDark = selectedTheme === 'dark' || (selectedTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
                document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
                
                // Update active charts if applicable
                if (typeof updateChart === 'function') updateChart();
                
                // Update UI (icon & active color) and trigger close animation
                updateThemeUI(selectedTheme);
                themeIconMenu.classList.remove('show');
            });
        });
    }







    
    // --- 2. STATE & DOM ELEMENTS ---
    let readings = JSON.parse(localStorage.getItem('glucoseReadings')) || [
        { date: "2026-09-17", time: "08:00", glucose: 110, comment: "Fasting" },
        { date: "2026-09-17", time: "12:00", glucose: 145, comment: "Post Lunch" },
        { date: "2026-09-17", time: "18:00", glucose: 95, comment: "Pre Dinner" }
    ];
    let chartInstance = null;

    const sidebarToggle = document.getElementById('sidebarToggle');
    const themeButtons = document.querySelectorAll('.theme-btn');
    const themeOptions = document.querySelectorAll('.theme-option'); 

    const valCurrent = document.getElementById('valCurrent');
    const valRange = document.getElementById('valRange');
    const valAvg = document.getElementById('valAvg');
    const valVar = document.getElementById('valVar');
    const historyList = document.getElementById('historyList');
    const insightsContainer = document.getElementById('insightsContainer');
    const refreshBtn = document.getElementById('refreshBtn');

    // --- 3. MOBILE MENU DROPDOWNS ---
    const mobileThemeMenuBtn = document.getElementById('mobileThemeMenuBtn');
    const mobileThemeSubmenu = document.getElementById('mobileThemeSubmenu');
    
    if (mobileThemeMenuBtn && mobileThemeSubmenu) {
        mobileThemeMenuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const isHidden = mobileThemeSubmenu.style.display === 'none';
            mobileThemeSubmenu.style.display = isHidden ? 'flex' : 'none';
            mobileThemeMenuBtn.querySelector('.ph-caret-down').style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
        });
    }

    // --- 4. THEME MANAGEMENT ---
    const applyThemeActiveStates = (theme) => {
        themeButtons.forEach(btn => {
            if (btn.getAttribute('data-theme-val') === theme) btn.classList.add('active');
            else btn.classList.remove('active');
        });
        themeOptions.forEach(opt => {
            if (opt.getAttribute('data-theme-val') === theme) opt.classList.add('active');
            else opt.classList.remove('active');
        });
    };

    const currentSavedTheme = localStorage.getItem('theme') || 'system';
    applyThemeActiveStates(currentSavedTheme);

    const applyThemeChange = (newTheme) => {
        localStorage.setItem('theme', newTheme);
        const isDark = newTheme === 'dark' || (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        applyThemeActiveStates(newTheme);
        if (chartInstance) updateChart();
    };

    themeButtons.forEach(btn => {
        btn.addEventListener('click', () => applyThemeChange(btn.getAttribute('data-theme-val')));
    });

    themeOptions.forEach(opt => {
        opt.addEventListener('click', (e) => {
            e.preventDefault();
            applyThemeChange(opt.getAttribute('data-theme-val'));
        });
    });

    // --- 5. SIDEBAR (DESKTOP) ---
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            const html = document.documentElement;
            html.classList.toggle('sidebar-collapsed');
            localStorage.setItem('sidebarCollapsed', html.classList.contains('sidebar-collapsed'));
            setTimeout(() => { if (chartInstance) chartInstance.resize(); }, 310);
        });
    }

    // --- 6. DATA PROCESSING & CHART ---
    const formatTime12Hour = (time) => {
        let [h, m] = time.split(':');
        h = parseInt(h, 10);
        const ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12 || 12;
        return `${h}:${m} ${ampm}`;
    };

    const getGlucoseStatus = (val) => {
        if (val < 70) return { text: 'Low' };
        if (val > 180) return { text: 'High' };
        return { text: 'Normal' };
    };

    const updateChart = () => {
        const canvas = document.getElementById('mainChart');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const isMobile = window.innerWidth <= 768;
        
        const gridColor = isDark ? '#27272a' : '#e5e7eb';
        const textColor = isDark ? '#a1a1aa' : '#6b7280';
        
        const maxPoints = isMobile ? 8 : 15;
        const chartData = readings.slice(-maxPoints);
        const labels = chartData.map(r => formatTime12Hour(r.time));
        const dataValues = chartData.map(r => r.glucose);

        const pointColors = dataValues.map(val => {
            if (val > 180) return '#eab308'; 
            if (val < 70) return '#ef4444';  
            return '#0ea5e9';                
        });

        let gradient = ctx.createLinearGradient(0, 0, 0, 220);
        gradient.addColorStop(0, 'rgba(14, 165, 233, 0.22)');
        gradient.addColorStop(1, 'rgba(14, 165, 233, 0)');

        if (chartInstance) chartInstance.destroy();

        chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    data: dataValues,
                    borderColor: '#0ea5e9',
                    borderWidth: isMobile ? 2.5 : 3,
                    backgroundColor: gradient,
                    fill: true,
                    tension: 0.35,
                    pointBackgroundColor: pointColors,
                    pointBorderColor: isDark ? '#18181b' : '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: isMobile ? 3.5 : 4,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: isDark ? '#18181b' : '#ffffff',
                        titleColor: isDark ? '#f4f4f5' : '#111827',
                        bodyColor: textColor,
                        borderColor: gridColor,
                        borderWidth: 1,
                        padding: 10,
                        displayColors: false,
                        callbacks: { label: (context) => `${context.raw} mg/dL` }
                    }
                }
            }
        });
    };

    const generateInsights = (tir, current) => {
        insightsContainer.innerHTML = '';
        let insights = [];
        if (tir >= 70) insights.push({ icon: 'ph-check-circle', color: '#16a34a', title: 'On Track', text: `Great! Your time in range is ${tir}%. Keep up the good work.` });
        else insights.push({ icon: 'ph-warning-circle', color: '#eab308', title: 'Attention Needed', text: `Your time in range is ${tir}%. Try adjusting meals.` });

        if (current > 180) insights.push({ icon: 'ph-trend-up', color: '#ef4444', title: 'High Glucose', text: `Latest reading is high. Stay hydrated and consider a light walk.` });
        else if (current < 70) insights.push({ icon: 'ph-trend-down', color: '#ef4444', title: 'Low Glucose', text: `Latest reading is low! Consume 15g of fast-acting carbs.` });
        else insights.push({ icon: 'ph-smiley', color: '#0ea5e9', title: 'Perfect Range', text: `Your latest reading is safely in target.` });

        insights.forEach(ins => {
            const div = document.createElement('div');
            div.className = 'insight-item';
            div.innerHTML = `<div class="insight-icon" style="background: ${ins.color}20; color: ${ins.color};"><i class="ph ${ins.icon}"></i></div><div class="insight-content"><h4>${ins.title}</h4><p>${ins.text}</p></div>`;
            insightsContainer.appendChild(div);
        });
    };

    const updateDashboard = () => {
        if (readings.length === 0) {
            valCurrent.innerHTML = '--'; valAvg.innerHTML = '--'; valRange.textContent = '--'; valVar.textContent = '--';
            historyList.innerHTML = '<div style="padding: 12px; text-align: center; color: var(--text-muted); font-size: 13px;">No readings logged yet.</div>';
            updateChart();
            return;
        }

        readings.sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));
        const latest = readings[readings.length - 1];
        valCurrent.innerHTML = `${latest.glucose}`;

        const sum = readings.reduce((acc, curr) => acc + curr.glucose, 0);
        const avg = Math.round(sum / readings.length);
        valAvg.innerHTML = `${avg}`;

        const inRangeCount = readings.filter(r => r.glucose >= 70 && r.glucose <= 180).length;
        const rangePercent = Math.round((inRangeCount / readings.length) * 100);
        valRange.textContent = `${rangePercent}`;

        if (readings.length > 1) {
            const variance = readings.reduce((acc, curr) => acc + Math.pow(curr.glucose - avg, 2), 0) / readings.length;
            valVar.textContent = Math.round((Math.sqrt(variance) / avg) * 100);
        } else {
            valVar.textContent = '--';
        }

        historyList.innerHTML = '';
        const reversedReadings = [...readings].reverse();
        const limitedReadings = reversedReadings.slice(0, CONFIG.maxHistoryItems);
        
        limitedReadings.forEach((reading, index) => {
            const status = getGlucoseStatus(reading.glucose);
            const dateObj = new Date(reading.date);
            const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const originalIndex = readings.length - 1 - index;

            const item = document.createElement('div');
            item.className = 'history-item';
            
            let statusClass = 'status-good-bg', statusTextColor = 'var(--status-good-text)';
            if (status.text === 'High') { statusClass = 'status-warn-bg'; statusTextColor = 'var(--status-warn-text)'; }
            if (status.text === 'Low') { statusClass = 'status-bad-bg'; statusTextColor = 'var(--status-bad-text)'; }

            item.innerHTML = `
                <div class="hist-left">
                    <div class="hist-val">${reading.glucose} mg/dL <span class="status-badge" style="background: var(--${statusClass}); color: ${statusTextColor};">${status.text}</span></div>
                    <div class="hist-time">${dateStr}, ${formatTime12Hour(reading.time)}</div>
                    ${reading.comment ? `<div class="hist-note">"${reading.comment}"</div>` : ''}
                </div>
                <button class="delete-btn" onclick="deleteReading(${originalIndex})" title="Delete Entry"><i class="ph ph-trash"></i></button>
            `;
            historyList.appendChild(item);
        });

        generateInsights(rangePercent, latest.glucose);
        updateChart();
    };

    window.deleteReading = function(idx) {
        readings.splice(idx, 1);
        localStorage.setItem('glucoseReadings', JSON.stringify(readings));
        updateDashboard();
    };

    updateDashboard();

    // --- 7. STABLE SINGLE-STOP BOTTOM SHEETS ---
    function initBottomSheet(overlayId, openBtnIds, closeBtnId) {
        const overlay = document.getElementById(overlayId);
        if (!overlay) return;
        const sheet = overlay.querySelector('.bottom-sheet');
        const closeBtn = document.getElementById(closeBtnId);
        
        let startY = 0, currentY = 0, isDragging = false;
        
        const openSheet = (e) => { 
            if(e) e.preventDefault(); 
            overlay.classList.add('active'); 
            sheet.style.transform = `translateY(0)`; 
        };
        const closeSheet = () => { 
            overlay.classList.remove('active'); 
            setTimeout(() => {
                sheet.style.transform = ''; 
            }, 300);
        };

        openBtnIds.forEach(id => {
            const btn = document.getElementById(id);
            if(btn) btn.addEventListener('click', openSheet);
        });

        if (closeBtn) closeBtn.addEventListener('click', closeSheet);
        overlay.addEventListener('click', (e) => { if(e.target === overlay) closeSheet(); });

        sheet.addEventListener('touchstart', (e) => {
            // Only allow dragging from the top handle or header to prevent scroll conflicts
            if (window.innerWidth <= 768 && (e.target.closest('.drag-handle-wrapper') || e.target.closest('.sheet-header'))) {
                startY = e.touches[0].clientY;
                isDragging = true;
                sheet.style.transition = 'none'; // Instant follow finger
            }
        }, {passive: true});

        sheet.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentY = e.touches[0].clientY;
            const diff = currentY - startY;
            
            // Only allow pulling downwards
            if (diff > 0) { 
                window.requestAnimationFrame(() => {
                    sheet.style.transform = `translateY(${diff}px)`;
                });
            }
        }, {passive: true});

        sheet.addEventListener('touchend', () => {
            if (!isDragging) return;
            isDragging = false;
            
            sheet.style.transition = 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)'; 
            const diff = currentY - startY;

            // Stable threshold to close
            if (diff > 80) {
                closeSheet();
            } else {
                // Snap back to top if not pulled down enough
                sheet.style.transform = 'translateY(0)';
            }
        });

        return { open: openSheet, close: closeSheet };
    }

    const logSheetCtrl = initBottomSheet('logSheetOverlay', ['openLogBtn', 'mobileLogBtn'], 'closeLogBtn');
    initBottomSheet('menuSheetOverlay', ['openMobileMenuBtn'], 'closeMobileMenuBtn');

    // --- 8. LOG FORM ACTIONS ---
    const setLogTime = () => {
        const now = new Date();
        const localDate = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
        document.getElementById('logDate').value = localDate;
        document.getElementById('logTime').value = now.toTimeString().slice(0, 5);
    };

    document.getElementById('openLogBtn').addEventListener('click', setLogTime);
    document.getElementById('mobileLogBtn').addEventListener('click', setLogTime);

    document.getElementById('logForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const newReading = {
            date: document.getElementById('logDate').value,
            time: document.getElementById('logTime').value,
            glucose: parseInt(document.getElementById('logGlucose').value, 10),
            comment: document.getElementById('logNotes').value.trim()
        };
        readings.push(newReading);
        localStorage.setItem('glucoseReadings', JSON.stringify(readings));
        
        logSheetCtrl.close();
        document.getElementById('logForm').reset();
        updateDashboard();
        
        const timeSpan = document.getElementById('lastUpdateTime');
        if (timeSpan) timeSpan.textContent = 'Just now';
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => { if (chartInstance) updateChart(); }, 150);
    });

    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            if (icon) icon.classList.add('ph-spinner', 'fa-spin'); 
            setTimeout(() => {
                updateDashboard();
                if (icon) icon.classList.remove('ph-spinner', 'fa-spin');
                const timeSpan = document.getElementById('lastUpdateTime');
                if (timeSpan) timeSpan.textContent = 'Just now';
            }, 400);
        });
    }
});










