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

// Update the date and time immediately and every second
updateDateTime();
setInterval(updateDateTime, 1000);

// Check for existing user
const savedName = localStorage.getItem('userName');
if (savedName) {
    welcomeScreen.style.display = 'none';
    appContainer.style.display = 'block';
}

// Handle name submission
nameForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = userNameInput.value.trim();
    if (name) {
        localStorage.setItem('userName', name);
        welcomeScreen.style.display = 'none';
        appContainer.style.display = 'block';
    }
});

// Load saved readings
let readings = JSON.parse(localStorage.getItem('glucoseReadings') || '[]');
updateReadingsList();

// Add new reading
addReadingButton.addEventListener('click', () => {
    const date = dateInput.value;
    const time = timeInput.value;
    const glucose = parseFloat(glucoseInput.value);

    if (date && time && glucose) {
        readings.push({ date, time, glucose });
        localStorage.setItem('glucoseReadings', JSON.stringify(readings));
        updateReadingsList();
        glucoseInput.value = '';

        // Update trends message
        if (readings.length >= 2) {
            trendsMessage.textContent = 'Tracking your glucose trends over time';
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

            if (readings.length < 2) {
                trendsMessage.textContent = 'Add at least two readings to see your trends';
            }
        });
    });
}

// Reset all data
resetButton.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all readings? This cannot be undone.')) {
        readings = [];
        localStorage.setItem('glucoseReadings', JSON.stringify(readings));
        updateReadingsList();
        trendsMessage.textContent = 'Add at least two readings to see your trends';
    }
});

// Prepare export content
function prepareExportContent() {
    const userName = localStorage.getItem('userName');
    exportTitle.textContent = `Diabetes Tracker Data - ${userName}`;

    const table = exportContent.querySelector('table tbody');
    table.innerHTML = '';

    readings.forEach(reading => {
        const row = document.createElement('tr');
        const formattedTime = formatTime12Hour(reading.time); // Convert time to 12-hour format
        row.innerHTML = `
            <td>${reading.date}</td>
            <td>${formattedTime}</td> <!-- Use 12-hour format -->
            <td>${reading.glucose}</td>
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
    const { element } = prepareExportContent();
    element.style.display = 'block';
    const canvas = await html2canvas(element);
    element.style.display = 'none';

    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = `glucose-readings-${new Date().toISOString().split('T')[0]}.png`;
    link.click();
});

// Export as PDF
exportPDFButton.addEventListener('click', async () => {
    const { element } = prepareExportContent();
    element.style.display = 'block';
    const canvas = await html2canvas(element);
    element.style.display = 'none';

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    pdf.setTextColor(0, 0, 0);

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`glucose-readings-${new Date().toISOString().split('T')[0]}.pdf`);
});

// Save user data as a .diab file
saveButton.addEventListener('click', () => {
    const userName = localStorage.getItem('userName');
    const glucoseReadings = JSON.parse(localStorage.getItem('glucoseReadings') || '[]');

    const data = {
        userName,
        glucoseReadings,
        exportDate: new Date().toISOString()
    };

    // const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    // link.download = `diabetes_data_${new Date().toISOString().split('T')[0]}.diab`;
    link.download = `Data.diab`;
    link.click();

    URL.revokeObjectURL(url);
});

// Import button functionality
importButton.addEventListener('click', () => {
    fileInput.click();
});

// Handle file upload
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

                    if (readings.length >= 2) {
                        trendsMessage.textContent = 'Tracking your glucose trends over time';
                    } else {
                        trendsMessage.textContent = 'Add at least two readings to see your trends';
                    }
                }
            } catch (error) {
                console.error('Error parsing the file:', error);
            }
        };
        reader.readAsText(file);
    } else {
        console.error('Invalid file format. Please upload a valid .diab file.');
    }
});

// Helper function to convert 24-hour time to 12-hour time with AM/PM
function formatTime12Hour(time) {
    const [hours, minutes] = time.split(':');
    let period = 'AM';
    let hours12 = parseInt(hours, 10);

    if (hours12 >= 12) {
        period = 'PM';
        if (hours12 > 12) {
            hours12 -= 12;
        }
    } else if (hours12 === 0) {
        hours12 = 12; // Midnight (12 AM)
    }

    return `${hours12}:${minutes} ${period}`;
}