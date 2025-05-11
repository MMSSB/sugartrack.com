const apiUrl = 'https://sheetdb.io/api/v1/xtik0ar4mud6k';

// DOM Elements
const appContainer = document.getElementById('appContainer');
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
const logoutButton = document.getElementById('logoutButton');

// Initialize jsPDF
window.jsPDF = window.jspdf.jsPDF;

// Set default date and time
const now = new Date();
dateInput.value = now.toISOString().split('T')[0];
timeInput.value = now.toTimeString().slice(0, 5);

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
    currentDateTime.textContent = now.toLocaleDateString('en-US', options);
}

// Update date and time
updateDateTime();
setInterval(updateDateTime, 1000);

// Check for authentication
const user = JSON.parse(sessionStorage.getItem('user'));
if (!user) {
    window.location.href = 'login.html';
} else {
    appContainer.style.display = 'block';
    userWelcomeName.textContent = user.name;
}

// Load readings from SheetDB
let readings = [];
async function loadReadings() {
    try {
        const response = await fetch(`${apiUrl}/search?email=${encodeURIComponent(user.email)}`);
        if (response.ok) {
            const users = await response.json();
            if (users.length > 0) {
                readings = users[0].glucoseReadings || [];
                updateReadingsList();
            }
        } else {
            console.error('Failed to load readings:', response.statusText);
            alert('Failed to load readings. Please try again.');
        }
    } catch (error) {
        console.error('Error loading readings:', error);
        alert('Error loading readings. Please try again.');
    }
}
loadReadings();

// Add new reading
addReadingButton.addEventListener('click', async () => {
    const date = dateInput.value;
    const time = timeInput.value;
    const glucose = parseFloat(glucoseInput.value);
    const comment = commentInput.value.trim();

    if (date && time && glucose) {
        readings.push({ date, time, glucose, comment });
        try {
            const response = await fetch(`${apiUrl}/search?email=${encodeURIComponent(user.email)}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data: { glucoseReadings: readings } })
            });
            if (response.ok) {
                updateReadingsList();
                glucoseInput.value = '';
                commentInput.value = '';
                if (readings.length >= 2) {
                    trendsMessage.textContent = 'Tracking your glucose trends over time';
                }
            } else {
                console.error('Failed to save reading:', response.statusText);
                alert('Failed to save reading. Please try again.');
                readings.pop(); // Revert local change
            }
        } catch (error) {
            console.error('Error saving reading:', error);
            alert('Error saving reading. Please try again.');
            readings.pop(); // Revert local change
        }
    }
});

// Update readings list
function updateReadingsList() {
    readingsList.innerHTML = '';
    readingsCount.textContent = `${readings.length} Readings`;

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

    // Add event listeners for menu buttons
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

    // Edit and delete buttons
    document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', async (e) => {
            const index = e.target.getAttribute('data-index');
            const reading = readings[index];
            dateInput.value = reading.date;
            timeInput.value = reading.time;
            glucoseInput.value = reading.glucose;
            commentInput.value = reading.comment || '';

            readings.splice(index, 1);
            try {
                const response = await fetch(`${apiUrl}/search?email=${encodeURIComponent(user.email)}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ data: { glucoseReadings: readings } })
                });
                if (response.ok) {
                    updateReadingsList();
                } else {
                    console.error('Failed to update reading:', response.statusText);
                    alert('Failed to update reading. Please try again.');
                    readings.splice(index, 0, reading); // Revert
                }
            } catch (error) {
                console.error('Error updating reading:', error);
                alert('Error updating reading. Please try again.');
                readings.splice(index, 0, reading); // Revert
            }
        });
    });

    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', async (e) => {
            const index = e.target.getAttribute('data-index');
            const reading = readings[index];
            readings.splice(index, 1);
            try {
                const response = await fetch(`${apiUrl}/search?email=${encodeURIComponent(user.email)}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ data: { glucoseReadings: readings } })
                });
                if (response.ok) {
                    updateReadingsList();
                    if (readings.length < 2) {
                        trendsMessage.textContent = 'Add at least two readings to see your trends';
                    }
                } else {
                    console.error('Failed to delete reading:', response.statusText);
                    alert('Failed to delete reading. Please try again.');
                    readings.splice(index, 0, reading); // Revert
                }
            } catch (error) {
                console.error('Error deleting reading:', error);
                alert('Error deleting reading. Please try again.');
                readings.splice(index, 0, reading); // Revert
            }
        });
    });
}

// Reset all data
resetButton.addEventListener('click', async () => {
    if (confirm('Are you sure you want to reset all readings? This cannot be undone.')) {
        readings = [];
        try {
            const response = await fetch(`${apiUrl}/search?email=${encodeURIComponent(user.email)}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data: { glucoseReadings: readings } })
            });
            if (response.ok) {
                updateReadingsList();
                trendsMessage.textContent = 'Add at least two readings to see your trends';
            } else {
                console.error('Failed to reset readings:', response.statusText);
                alert('Failed to reset readings. Please try again.');
            }
        } catch (error) {
            console.error('Error resetting readings:', error);
            alert('Error resetting readings. Please try again.');
        }
    }
});

// Prepare export content
function prepareExportContent() {
    const userName = user.name;
    exportTitle.textContent = `Diabetes Tracker Data - ${userName}`;

    const table = exportContent.querySelector('table tbody');
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

    exportContent.style.display = 'block';
    const result = { element: exportContent };
    exportContent.style.display = 'none';
    return result;
}

// Export as Image
exportImageButton.addEventListener('click', async () => {
    const userName = user.name;
    const sortedReadings = readings.slice().reverse();
    const { width, heightPerRow, logoWidth, logoHeight, websiteName, websiteUrl, fontSizeTitle, fontSizeText, margin, textColor, backgroundColor } = {
        width: 800,
        heightPerRow: 30,
        logoWidth: 50,
        logoHeight: 50,
        websiteName: 'SugarTrack',
        websiteUrl: 'https://mmssb.github.io/sugartrack.com',
        fontSizeTitle: 24,
        fontSizeText: 16,
        margin: 30,
        textColor: '#000000',
        backgroundColor: '#FFFFFF'
    };

    const height = margin * 2 + logoHeight + heightPerRow * (sortedReadings.length + 3);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = textColor;
    ctx.font = `${fontSizeTitle}px Arial`;
    ctx.fillText(`Diabetes Tracker Data - ${userName}`, margin + logoWidth + 10, margin + logoHeight / 2 + fontSizeTitle / 2);

    ctx.font = `${fontSizeText}px Arial`;
    ctx.fillText(websiteName, margin + logoWidth + 10, margin + logoHeight + fontSizeText);
    ctx.fillText(websiteUrl, margin + logoWidth + 10, margin + logoHeight + fontSizeText * 2);

    const headers = ['Date', 'Time', 'Glucose ', 'Comment'];
    const columnWidths = [150, 100, 100, width - 400];
    let yPosition = margin + logoHeight + heightPerRow;
    ctx.font = `${fontSizeText}px Arial`;
    headers.forEach((header, index) => {
        ctx.fillText(header, margin + columnWidths.slice(0, index).reduce((a, b) => a + b, 0), yPosition);
    });
    yPosition += heightPerRow;

    sortedReadings.forEach(reading => {
        const formattedTime = formatTime12Hour(reading.time);
        const rowData = [reading.date, formattedTime, `${reading.glucose} mg/dL`, reading.comment || ''];
        rowData.forEach((cell, index) => {
            ctx.fillText(cell, margin + columnWidths.slice(0, index).reduce((a, b) => a + b, 0), yPosition);
        });
        yPosition += heightPerRow;
    });

    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = `glucose-readings-${new Date().toISOString().split('T')[0]}.png`;
    link.click();
});

// Export as PDF
exportPDFButton.addEventListener('click', () => {
    const userName = user.name;
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });
    const websiteName = 'SugarTrack';
    const websiteLinkText = 'Visit our website';
    const websiteURL = 'https://mmssb.github.io/sugartrack.com';
    pdf.setFontSize(25);
    pdf.text(websiteName, 5, 20);
    pdf.setFontSize(10);
    pdf.text(websiteURL, 5, 25);
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 255);
    pdf.textWithLink(websiteLinkText, 5, 30, { url: websiteURL });
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(14);

    pdf.setFont('helvetica');
    pdf.setFontSize(12);

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    pdf.text(`Diabetes Tracker Data - ${userName}`, 10, 35);

    const headers = ['Date', 'Time', 'Glucose (mg/dL)', 'Comment'];
    const columnWidths = [50, 30, 40, 60];
    const headerHeight = 10;

    let yPosition = 45;
    headers.forEach((header, index) => {
        pdf.text(header, 10 + columnWidths.slice(0, index).reduce((a, b) => a + b, 0), yPosition);
    });
    yPosition += headerHeight;

    readings.forEach((reading) => {
        const formattedTime = formatTime12Hour(reading.time);
        const rowData = [reading.date, formattedTime, reading.glucose.toString(), reading.comment || ''];

        if (yPosition + headerHeight > pageHeight) {
            pdf.addPage();
            yPosition = 20;
            headers.forEach((header, index) => {
                pdf.text(header, 10 + columnWidths.slice(0, index).reduce((a, b) => a + b, 0), yPosition);
            });
            yPosition += headerHeight;
        }

        rowData.forEach((cell, colIndex) => {
            pdf.text(cell, 10 + columnWidths.slice(0, colIndex).reduce((a, b) => a + b, 0), yPosition);
        });
        yPosition += headerHeight;
    });

    pdf.save(`glucose-readings-${new Date().toISOString().split('T')[0]}.pdf`);
});

// Save user data as .diab file
saveButton.addEventListener('click', () => {
    const data = {
        userName: user.name,
        glucoseReadings: readings,
        exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Data.diab`;
    link.click();
    URL.revokeObjectURL(url);
});

// Import button functionality
importButton.addEventListener('click', () => {
    fileInput.click();
});

// Handle file upload
fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file && file.name.endsWith('.diab')) {
        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const data = JSON.parse(event.target.result);
                if (data.userName && Array.isArray(data.glucoseReadings)) {
                    readings = data.glucoseReadings;
                    try {
                        const response = await fetch(`${apiUrl}/search?email=${encodeURIComponent(user.email)}`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ data: { glucoseReadings: readings } })
                        });
                        if (response.ok) {
                            updateReadingsList();
                            if (readings.length >= 2) {
                                trendsMessage.textContent = 'Tracking your glucose trends over time';
                            } else {
                                trendsMessage.textContent = 'Add at least two readings to see your trends';
                            }
                        } else {
                            console.error('Failed to import readings:', response.statusText);
                            alert('Failed to import readings. Please try again.');
                        }
                    } catch (error) {
                        console.error('Error importing readings:', error);
                        alert('Error importing readings. Please try again.');
                    }
                } else {
                    alert('Invalid data format in the file.');
                }
            } catch (error) {
                alert('Error parsing the file. Please ensure the file is valid.');
            }
        };
        reader.readAsText(file);
    } else {
        alert('Invalid file format. Please upload a valid .diab file.');
    }
});

// Logout functionality
if (logoutButton) {
    logoutButton.addEventListener('click', () => {
        sessionStorage.removeItem('user');
        window.location.href = 'login.html';
    });
}

// Helper function for 12-hour time format
function formatTime12Hour(time) {
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

// Theme switching functionality
document.addEventListener('DOMContentLoaded', () => {
    function applyTheme(theme) {
        if (theme === 'system') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.body.classList.toggle('dark-theme', prefersDark);
        } else {
            document.body.classList.toggle('dark-theme', theme === 'dark');
        }
    }

    const savedTheme = localStorage.getItem('theme') || 'system';
    applyTheme(savedTheme);

    const themeSelect = document.getElementById('themeSelect');
    if (themeSelect) {
        themeSelect.value = savedTheme;
        themeSelect.addEventListener('change', () => {
            const selectedTheme = themeSelect.value;
            localStorage.setItem('theme', selectedTheme);
            applyTheme(selectedTheme);
        });
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (localStorage.getItem('theme') === 'system' || !localStorage.getItem('theme')) {
            applyTheme('system');
        }
    });
});