// Initialize jsPDF
window.jsPDF = window.jspdf.jsPDF;

// DOM Elements
const welcomeScreen = document.getElementById('welcomeScreen');
const appContainer = document.getElementById('appContainer');
const nameForm = document.getElementById('nameForm');
const userNameInput = document.getElementById('userName');
const currentDateTime = document.getElementById('currentDateTime');
const readingsCount = document.getElementById('readingsCount');
const dateInput = document.getElementById('date');
const timeInput = document.getElementById('time');
const glucoseInput = document.getElementById('glucose');
const commentInput = document.getElementById('comment');
const addReadingButton = document.getElementById('addReading');
const readingsList = document.getElementById('readingsList');
const resetButton = document.getElementById('resetButton');
const exportImageButton = document.getElementById('exportImage');
const exportPDFButton = document.getElementById('exportPDF');
const exportContent = document.getElementById('exportContent');
const exportTitle = document.getElementById('exportTitle');
const trendsMessage = document.getElementById('trendsMessage');
const saveButton = document.getElementById('saveButton');
const importButton = document.getElementById('importButton');
const fileInput = document.getElementById('fileInput');
const userWelcomeName = document.getElementById('userWelcomeName');

// Set default date and time
function setDefaultDateTime() {
    const now = new Date();
    dateInput.value = now.toISOString().split('T')[0];
    timeInput.value = now.toTimeString().slice(0, 5);
}

// Initialize the app
function initApp() {
    setDefaultDateTime();
    updateDateTime();
    
    // Load saved name
    const savedName = localStorage.getItem('userName');
    if (savedName) {
        if (welcomeScreen) welcomeScreen.style.display = 'none';
        if (appContainer) appContainer.style.display = 'block';
        
        const firstName = savedName.split(' ')[0];
        if (userWelcomeName) userWelcomeName.textContent = firstName;
    }
    
    // Load saved readings
    let readings = JSON.parse(localStorage.getItem('glucoseReadings') || '[]');
    updateReadingsList();
}

// Function to update the current date and time
function updateDateTime() {
    const now = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    if (currentDateTime) {
        currentDateTime.textContent = now.toLocaleDateString('en-US', options);
    }
}

// Handle name submission
if (nameForm) {
    nameForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = userNameInput.value.trim();
        if (name) {
            localStorage.setItem('userName', name);
            if (welcomeScreen) welcomeScreen.style.display = 'none';
            if (appContainer) appContainer.style.display = 'block';
            
            const firstName = name.split(' ')[0];
            if (userWelcomeName) userWelcomeName.textContent = firstName;
        }
    });
}

// Load saved readings
let readings = JSON.parse(localStorage.getItem('glucoseReadings') || '[]');
updateReadingsList();

// Add new reading
if (addReadingButton) {
    addReadingButton.addEventListener('click', () => {
        const date = dateInput.value;
        const time = timeInput.value;
        const glucose = parseFloat(glucoseInput.value);
        const comment = commentInput.value.trim();

        if (date && time && !isNaN(glucose)) {
            readings.push({ date, time, glucose, comment });
            localStorage.setItem('glucoseReadings', JSON.stringify(readings));
            updateReadingsList();
            glucoseInput.value = '';
            commentInput.value = '';
            setDefaultDateTime();

            // Update trends message
            if (readings.length >= 2 && trendsMessage) {
                trendsMessage.textContent = 'Tracking your glucose trends over time';
            }
        }
    });
}

// Update readings list
function updateReadingsList() {
    if (!readingsList) return;
    
    readingsList.innerHTML = '';
    if (readingsCount) {
        readingsCount.textContent = `${readings.length} ${readings.length === 1 ? 'Reading' : 'Readings'}`;
    }

    if (readings.length === 0) {
        readingsList.innerHTML = '<div class="reading-item">No readings yet. Add your first reading above.</div>';
        return;
    }

    readings.slice().reverse().forEach((reading, index) => {
        const readingDate = new Date(`${reading.date}T${reading.time}`);
        const formattedDate = readingDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const readingItem = document.createElement('div');
        readingItem.className = 'reading-item';
        readingItem.innerHTML = `
            <div class="reading-value">${reading.glucose} mg/dL</div>
            <div class="reading-date">${formattedDate}</div>
            ${reading.comment ? `<div class="reading-comment">${reading.comment}</div>` : ''}
            <div class="reading-actions">
                <button class="menu-button">⋮</button>
                <div class="dropdown-menu">
                    <button class="edit-button" data-index="${readings.length - 1 - index}">Edit</button>
                    <button class="delete-button" data-index="${readings.length - 1 - index}">Delete</button>
                </div>
            </div>
        `;
        readingsList.appendChild(readingItem);
    });

    // Add event listeners for the "three dots" menu
    document.querySelectorAll('.menu-button').forEach(button => {
        button.addEventListener('click', (e) => {
            document.querySelectorAll('.reading-actions').forEach(actions => {
                if (actions !== e.target.closest('.reading-actions')) {
                    actions.classList.remove('active');
                }
            });

            const actions = e.target.closest('.reading-actions');
            actions.classList.toggle('active');
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.reading-actions')) {
            document.querySelectorAll('.reading-actions').forEach(actions => {
                actions.classList.remove('active');
            });
        }
    });

    // Add event listeners for edit and delete buttons
    document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            const reading = readings[index];
            dateInput.value = reading.date;
            timeInput.value = reading.time;
            glucoseInput.value = reading.glucose;
            commentInput.value = reading.comment || '';

            readings.splice(index, 1);
            localStorage.setItem('glucoseReadings', JSON.stringify(readings));
            updateReadingsList();
        });
    });

    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            readings.splice(index, 1);
            localStorage.setItem('glucoseReadings', JSON.stringify(readings));
            updateReadingsList();

            if (readings.length < 2 && trendsMessage) {
                trendsMessage.textContent = 'Add at least two readings to see your trends';
            }
        });
    });
}

// Reset all data
if (resetButton) {
    resetButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all readings? This cannot be undone.')) {
            readings = [];
            localStorage.setItem('glucoseReadings', JSON.stringify(readings));
            updateReadingsList();
            if (trendsMessage) {
                trendsMessage.textContent = 'Add at least two readings to see your trends';
            }
        }
    });
}

// Prepare export content
function prepareExportContent() {
    if (!exportContent || !exportTitle) return { element: null };
    
    const userName = localStorage.getItem('userName') || 'User';
    exportTitle.textContent = `Diabetes Tracker Data - ${userName}`;

    const table = exportContent.querySelector('table tbody');
    if (table) {
        table.innerHTML = '';

        readings.forEach(reading => {
            const row = document.createElement('tr');
            const formattedTime = formatTime12Hour(reading.time);
            row.innerHTML = `
                <td>${reading.date}</td>
                <td>${formattedTime}</td>
                <td>${reading.glucose}</td>
                <td>${reading.comment || ''}</td>
            `;
            table.appendChild(row);
        });
    }

    exportContent.style.display = 'block';
    const result = { element: exportContent };
    exportContent.style.display = 'none';
    return result;
}

// Export as Image
if (exportImageButton) {
    exportImageButton.addEventListener('click', async () => {
        const userName = localStorage.getItem('userName') || 'User';
        const sortedReadings = readings.slice().reverse();
        
        const config = {
            width: 800,
            heightPerRow: 30,
            logoWidth: 50,
            logoHeight: 50,
            fontSizeTitle: 24,
            fontSizeText: 16,
            margin: 30,
            textColor: '#000000',
            backgroundColor: '#FFFFFF'
        };

        const { width, heightPerRow, logoWidth, logoHeight, fontSizeTitle, fontSizeText, margin, textColor, backgroundColor } = config;

        // Calculate canvas height
        const height = margin * 2 + logoHeight + heightPerRow * (sortedReadings.length + 3);
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // Fill background
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);

        // Draw title
        ctx.fillStyle = textColor;
        ctx.font = `bold ${fontSizeTitle}px Arial`;
        ctx.fillText(`Diabetes Tracker Data - ${userName}`, margin, margin + fontSizeTitle);

        // Draw table headers
        const headers = ['Date', 'Time', 'Glucose (mg/dL)', 'Comment'];
        const columnWidths = [150, 100, 100, width - 400];
        let yPosition = margin + logoHeight + heightPerRow;
        ctx.font = `bold ${fontSizeText}px Arial`;
        headers.forEach((header, index) => {
            ctx.fillText(header, margin + columnWidths.slice(0, index).reduce((a, b) => a + b, 0), yPosition);
        });
        yPosition += heightPerRow;

        // Draw table data
        ctx.font = `${fontSizeText}px Arial`;
        sortedReadings.forEach(reading => {
            const formattedTime = formatTime12Hour(reading.time);
            const rowData = [reading.date, formattedTime, `${reading.glucose} mg/dL`, reading.comment || ''];
            rowData.forEach((cell, index) => {
                ctx.fillText(cell, margin + columnWidths.slice(0, index).reduce((a, b) => a + b, 0), yPosition);
            });
            yPosition += heightPerRow;
        });

        // Export canvas as image
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = `glucose-readings-${new Date().toISOString().split('T')[0]}.png`;
        link.click();
    });
}

// Export as PDF
if (exportPDFButton) {
    exportPDFButton.addEventListener('click', () => {
        const userName = localStorage.getItem('userName') || 'User';
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        // Website info
        const websiteName = 'SugarTrack.com';
        const websiteLinkText = 'Visit our website';
        const websiteURL = 'https://mmssb.github.io/sugartrack.com';
        
        pdf.setFontSize(25);
        pdf.text(websiteName, 5, 20);
        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 255);
        pdf.textWithLink(websiteLinkText, 5, 30, { url: websiteURL });
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(14);

        // Title
        pdf.text(`Diabetes Tracker Data - ${userName}`, 10, 45);

        // Table headers
        const headers = ['Date', 'Time', 'Glucose (mg/dL)', 'Comment'];
        const columnWidths = [50, 30, 40, 60];
        const headerHeight = 10;
        let yPosition = 55;

        // Draw headers
        pdf.setFont('helvetica', 'bold');
        headers.forEach((header, index) => {
            pdf.text(header, 10 + columnWidths.slice(0, index).reduce((a, b) => a + b, 0), yPosition);
        });
        yPosition += headerHeight;

        // Draw data rows
        pdf.setFont('helvetica', 'normal');
        readings.forEach(reading => {
            const formattedTime = formatTime12Hour(reading.time);
            const rowData = [reading.date, formattedTime, reading.glucose.toString(), reading.comment || ''];

            // Check for page break
            if (yPosition + headerHeight > pdf.internal.pageSize.getHeight() - 20) {
                pdf.addPage();
                yPosition = 20;
                
                // Redraw headers on new page
                pdf.setFont('helvetica', 'bold');
                headers.forEach((header, index) => {
                    pdf.text(header, 10 + columnWidths.slice(0, index).reduce((a, b) => a + b, 0), yPosition);
                });
                yPosition += headerHeight;
                pdf.setFont('helvetica', 'normal');
            }

            // Draw row
            rowData.forEach((cell, colIndex) => {
                pdf.text(cell, 10 + columnWidths.slice(0, colIndex).reduce((a, b) => a + b, 0), yPosition);
            });
            yPosition += headerHeight;
        });

        // Save PDF
        pdf.save(`glucose-readings-${new Date().toISOString().split('T')[0]}.pdf`);
    });
}

// Save user data
if (saveButton) {
    saveButton.addEventListener('click', () => {
        const userName = localStorage.getItem('userName') || 'User';
        const glucoseReadings = JSON.parse(localStorage.getItem('glucoseReadings')) || [];

        const data = {
            userName,
            glucoseReadings,
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `glucose-data-${new Date().toISOString().split('T')[0]}.diab`;
        link.click();

        URL.revokeObjectURL(url);
    });
}

// Import data
if (importButton && fileInput) {
    importButton.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && file.name.endsWith('.diab')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    if (data.userName && Array.isArray(data.glucoseReadings)) {
                        localStorage.setItem('userName', data.userName);
                        localStorage.setItem('glucoseReadings', JSON.stringify(data.glucoseReadings));

                        readings = data.glucoseReadings;
                        updateReadingsList();

                        if (userWelcomeName) {
                            const firstName = data.userName.split(' ')[0];
                            userWelcomeName.textContent = firstName;
                        }

                        if (trendsMessage) {
                            trendsMessage.textContent = readings.length >= 2 ? 
                                'Tracking your glucose trends over time' : 
                                'Add at least two readings to see your trends';
                        }
                    } else {
                        alert('Invalid data format in the file.');
                    }
                } catch (error) {
                    console.error('Error parsing file:', error);
                    alert('Error parsing the file. Please ensure the file is valid.');
                }
            };
            reader.readAsText(file);
        } else {
            alert('Invalid file format. Please upload a valid .diab file.');
        }
    });
}

// Helper function to convert 24-hour time to 12-hour time with AM/PM
function formatTime12Hour(time) {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    let period = 'AM';
    let hours12 = parseInt(hours, 10);

    if (hours12 >= 12) {
        period = 'PM';
        if (hours12 > 12) {
            hours12 -= 12;
        }
    } else if (hours12 === 0) {
        hours12 = 12;
    }

    return `${hours12}:${minutes} ${period}`;
}

// Sidebar functionality
document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.sidebar');
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const closeBtn = document.querySelector('.close-btn');
    const toggleCollapse = document.querySelector('.toggle-collapse');
    const mainContent = document.querySelector('.main-content');
    
    if (!sidebar || !hamburgerBtn || !closeBtn || !mainContent) return;
    
    // Load sidebar state
    const isSidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    const isMobile = window.matchMedia('(max-width: 992px)').matches;
    
    if (isSidebarCollapsed && !isMobile) {
        sidebar.classList.add('collapsed');
        mainContent.classList.add('expanded');
    }
    
    // Hamburger button (mobile)
    hamburgerBtn.addEventListener('click', () => {
        sidebar.classList.add('open');
    });
    
    // Close button (mobile)
    closeBtn.addEventListener('click', () => {
        sidebar.classList.remove('open');
    });
    
    // Toggle collapse (desktop)
    if (toggleCollapse) {
        toggleCollapse.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');
            
            if (window.matchMedia('(min-width: 993px)').matches) {
                localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
            }
        });
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        const isMobileNow = window.matchMedia('(max-width: 992px)').matches;
        
        if (isMobileNow) {
            sidebar.classList.remove('collapsed', 'open');
            mainContent.classList.remove('expanded');
        } else {
            if (localStorage.getItem('sidebarCollapsed') === 'true') {
                sidebar.classList.add('collapsed');
                mainContent.classList.add('expanded');
            } else {
                sidebar.classList.remove('collapsed');
                mainContent.classList.remove('expanded');
            }
        }
    });
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.matchMedia('(max-width: 992px)').matches) {
            if (!sidebar.contains(e.target) && !hamburgerBtn.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        }
    });
});

// Initialize date/time update interval
setInterval(updateDateTime, 1000);

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);

// Theme switching functionality (add to any .js file)
document.addEventListener('DOMContentLoaded', () => {
    // Function to apply the theme
    function applyTheme(theme) {
        if (theme === 'system') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.body.classList.toggle('dark-theme', prefersDark);
        } else {
            document.body.classList.toggle('dark-theme', theme === 'dark');
        }
    }

    // Load saved theme or default to 'system'
    const savedTheme = localStorage.getItem('theme') || 'system';
    applyTheme(savedTheme);

    // If a theme select element exists on the page, set it up
    const themeSelect = document.getElementById('themeSelect');
    if (themeSelect) {
        themeSelect.value = savedTheme;
        themeSelect.addEventListener('change', () => {
            const selectedTheme = themeSelect.value;
            localStorage.setItem('theme', selectedTheme);
            applyTheme(selectedTheme);
        });
    }

    // Listen for system theme changes (for 'system' setting)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (localStorage.getItem('theme') === 'system' || !localStorage.getItem('theme')) {
            applyTheme('system');
        }
    });
});