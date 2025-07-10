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
// const savedName = localStorage.getItem('userName');
// if (savedName) {
//     welcomeScreen.style.display = 'none';
//     appContainer.style.display = 'block';
//     userWelcomeName.textContent = savedName;
// }

// Handle name submission
// nameForm.addEventListener('submit', (e) => {
//     e.preventDefault();
//     const name = userNameInput.value.trim();
//     if (name) {
//         localStorage.setItem('userName', name);
//         welcomeScreen.style.display = 'none';
//         appContainer.style.display = 'block';
//         userWelcomeName.textContent = name;
//     }
// });
// In script.js, modify the name handling parts:

// When setting the user name initially
nameForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = userNameInput.value.trim();
    if (name) {
        localStorage.setItem('userName', name);
        localStorage.setItem('userFirstName', name.split(' ')[0]); // Store first name
        welcomeScreen.style.display = 'none';
        appContainer.style.display = 'block';
        userWelcomeName.textContent = name.split(' ')[0]; // Show only first name

    }
});

// // When loading the saved name
// const savedName = localStorage.getItem('userName');
// if (savedName) {
//     welcomeScreen.style.display = 'none';
//     appContainer.style.display = 'block';
//     const firstName = localStorage.getItem('userFirstName') || savedName.split(' ')[0];
//     userWelcomeName.textContent = firstName;
// }
    // Load saved name
    const savedName = localStorage.getItem('userName');
    if (savedName) {
        if (welcomeScreen) welcomeScreen.style.display = 'none';
        if (appContainer) appContainer.style.display = 'block';
        
        const firstName = savedName.split(' ')[0];
        userWelcomeName.textContent = firstName;
        userFullNameDisplay.textContent = savedName; // Show full name
        newNameInput.value = savedName;
    }

// Load saved readings
let readings = JSON.parse(localStorage.getItem('glucoseReadings') || '[]');
updateReadingsList();

// Add new reading
addReadingButton.addEventListener('click', () => {
    const date = dateInput.value;
    const time = timeInput.value;
    const glucose = parseFloat(glucoseInput.value);
    const comment = commentInput.value.trim();

    if (date && time && glucose) {
        readings.push({ date, time, glucose, comment });
        localStorage.setItem('glucoseReadings', JSON.stringify(readings));
        updateReadingsList();
        glucoseInput.value = '';
        commentInput.value = '';

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

// Customizable variables for export image
const EXPORT_IMAGE_CONFIG = {
    width: 800,              // Canvas width in pixels
    heightPerRow: 30,        // Height per data row in pixels
    // logoPath: 'images/sugar.ico', // Path to your logo image (replace with your logo file)
    logoWidth: 50,           // Logo width in pixels
    logoHeight: 50,          // Logo height in pixels
    websiteName: '', // Website name
    websiteUrl: '', // Website URL
    fontSizeTitle: 24,       // Font size for title
    fontSizeText: 16,        // Font size for data
    margin: 30,              // Margin around content
    textColor: '#000000',    // Text color (hex)
    backgroundColor: '#FFFFFF' // Background color (hex)
};

exportImageButton.addEventListener('click', async () => {
    const userName = localStorage.getItem('userName');
    const sortedReadings = readings.slice().reverse(); // Match original behavior (latest first)
    const { width, heightPerRow, logoPath, logoWidth, logoHeight, websiteName, websiteUrl, fontSizeTitle, fontSizeText, margin, textColor, backgroundColor } = EXPORT_IMAGE_CONFIG;

    // Calculate canvas height based on data rows
    const height = margin * 2 + logoHeight + heightPerRow * (sortedReadings.length + 3); // Logo, title, headers, data rows
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // Fill background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // Draw logo
    // const logo = new Image();
    // logo.src = logoPath;
    // await new Promise(resolve => {
    //     logo.onload = resolve;
    //     logo.onerror = () => {
    //         console.error('Logo failed to load. Skipping logo.');
    //         resolve();
    //     };
    // });
    // ctx.drawImage(logo, margin, margin, logoWidth, logoHeight);

    // Draw title
    ctx.fillStyle = textColor;
    ctx.font = `${fontSizeTitle}px Arial`;
    ctx.fillText(`Diabetes Tracker Data - ${userName}`, margin + logoWidth + 10, margin + logoHeight / 2 + fontSizeTitle / 2);

    // Draw website name and URL
    ctx.font = `${fontSizeText}px Arial`;
    ctx.fillText(websiteName, margin + logoWidth + 10, margin + logoHeight + fontSizeText);
    ctx.fillText(websiteUrl, margin + logoWidth + 10, margin + logoHeight + fontSizeText * 2);

    // Draw table headers
    const headers = ['Date', 'Time', 'Glucose ', 'Comment'];
    const columnWidths = [150, 100, 100, width - 400]; // Adjust these widths as needed
    let yPosition = margin + logoHeight + heightPerRow;
    ctx.font = `${fontSizeText}px Arial`;
    headers.forEach((header, index) => {
        ctx.fillText(header, margin + columnWidths.slice(0, index).reduce((a, b) => a + b, 0), yPosition);
    });
    yPosition += heightPerRow;

    // Draw table data
    sortedReadings.forEach(reading => {
        const formattedTime = formatTime12Hour(reading.time);
        const rowData = [reading.date, formattedTime, `${reading.glucose} mg/dL`,  reading.comment || ''];
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

// // Export as Image
// exportImageButton.addEventListener('click', async () => {
//     const { element } = prepareExportContent();
//     element.style.display = 'block';
//     const canvas = await html2canvas(element);
//     element.style.display = 'none';

//     const image = canvas.toDataURL('image/png');
//     const link = document.createElement('a');
//     link.href = image;
//     link.download = `glucose-readings-${new Date().toISOString().split('T')[0]}.png`;
//     link.click();
// });

// Export as PDF
// exportPDFButton.addEventListener('click', async () => {
//     const { element } = prepareExportContent();
//     element.style.display = 'block';
//     const canvas = await html2canvas(element);
//     element.style.display = 'none';

//     const imgData = canvas.toDataURL('image/png');
//     const pdf = new jsPDF({
//         orientation: 'portrait',
//         unit: 'mm',
//         format: 'a4'
//     });

//     pdf.setTextColor(0, 0, 0);

//     const imgProps = pdf.getImageProperties(imgData);
//     const pdfWidth = pdf.internal.pageSize.getWidth();
//     const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

//     pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
//     pdf.save(`glucose-readings-${new Date().toISOString().split('T')[0]}.pdf`);
// });


// Export as PDF
exportPDFButton.addEventListener('click', () => {
    // Prepare export content
    const { element } = prepareExportContent();
    const userName = localStorage.getItem('userName');
    const readings = JSON.parse(localStorage.getItem('glucoseReadings') || '[]');

    // Initialize jsPDF with A4 dimensions
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });
    const websiteName = 'SugarTrack.com'; // Website name
    const websiteLinkText = 'Visit our website'; // Display text for the link
    const weblink = 'https://mmssb.github.io/sugartrack.com';
    const websiteURL = 'https://mmssb.github.io/sugartrack.com'; // Actual website URL
    pdf.setFontSize(25);
    pdf.text(websiteName, 5, 20);
    pdf.setFontSize(10);
    pdf.text(weblink, 5, 25);
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 255);

    pdf.textWithLink(websiteLinkText, 5, 30, { url: websiteURL });
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(14);


    // Set font styles
    pdf.setFont('helvetica');
    pdf.setFontSize(12);

    // Define A4 dimensions in millimeters
    const pageWidth = pdf.internal.pageSize.getWidth(); // 210mm
    const pageHeight = pdf.internal.pageSize.getHeight(); // 297mm

    // Add title
    pdf.text(`Diabetes Tracker Data - ${userName}`, 10, 35);

    // Table headers
    const headers = ['Date', 'Time', 'Glucose (mg/dL)', 'Comment'];
    const columnWidths = [50, 30, 40, 60]; // Adjust widths as needed
    const headerHeight = 10;

    // Start position for the table
    let yPosition = 45;

    // Draw table headers
    headers.forEach((header, index) => {
        pdf.text(header, 10 + columnWidths.slice(0, index).reduce((a, b) => a + b, 0), yPosition);
    });
    yPosition += headerHeight;

    // Add table rows
    readings.forEach((reading, rowIndex) => {
        const formattedTime = formatTime12Hour(reading.time); // Convert time to 12-hour format
        const rowData = [reading.date, formattedTime, reading.glucose.toString(), reading.comment || ''];

        // Check if there's enough space for the next row
        if (yPosition + headerHeight > pageHeight) {
            pdf.addPage(); // Add a new page
            yPosition = 20; // Reset position for the new page

            // Redraw table headers on the new page
            headers.forEach((header, index) => {
                pdf.text(header, 10 + columnWidths.slice(0, index).reduce((a, b) => a + b, 0), yPosition);
            });
            yPosition += headerHeight;
        }

        // Draw table row
        rowData.forEach((cell, colIndex) => {
            pdf.text(cell, 10 + columnWidths.slice(0, colIndex).reduce((a, b) => a + b, 0), yPosition);
        });
        yPosition += headerHeight;
    });

    // Save the PDF
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

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `Data.diab`;
    link.click();

    URL.revokeObjectURL(url);
});

// Import button functionality
importButton.addEventListener('click', () => {
    console.log('Import button clicked'); // Debugging line
    fileInput.click(); // Trigger the file input
});

// Handle file upload
fileInput.addEventListener('change', (e) => {
    console.log('File selected'); // Debugging line
    const file = e.target.files[0];
    if (file && file.name.endsWith('.diab')) {
        const reader = new FileReader();
        reader.onload = (event) => {
            console.log('File read successfully'); // Debugging line
            try {
                const data = JSON.parse(event.target.result);
                console.log('Parsed data:', data); // Debugging line

                if (data.userName && Array.isArray(data.glucoseReadings)) {
                    console.log('Data is valid'); // Debugging line
                    localStorage.setItem('userName', data.userName);
                    localStorage.setItem('glucoseReadings', JSON.stringify(data.glucoseReadings));

                    readings = data.glucoseReadings;
                    updateReadingsList();

                    if (readings.length >= 2) {
                        trendsMessage.textContent = 'Tracking your glucose trends over time';
                    } else {
                        trendsMessage.textContent = 'Add at least two readings to see your trends';
                    }
                } else {
                    console.error('Invalid data format in the file.');
                    alert('Invalid data format in the file.');
                }
            } catch (error) {
                console.error('Error parsing the file:', error);
                alert('Error parsing the file. Please ensure the file is valid.');
            }
        };
        reader.readAsText(file);
    } else {
        console.error('Invalid file format. Please upload a valid .diab file.');
        alert('Invalid file format. Please upload a valid .diab file.');
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

// // Theme switching functionality (add to any .js file)
// document.addEventListener('DOMContentLoaded', () => {
//     // Function to apply the theme
//     function applyTheme(theme) {
//         if (theme === 'system') {
//             const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
//             document.body.classList.toggle('dark-theme', prefersDark);
//         } else {
//             document.body.classList.toggle('dark-theme', theme === 'dark');
//         }
//     }

//     // Load saved theme or default to 'system'
//     const savedTheme = localStorage.getItem('theme') || 'system';
//     applyTheme(savedTheme);

//     // If a theme select element exists on the page, set it up
//     const themeSelect = document.getElementById('themeSelect');
//     if (themeSelect) {
//         themeSelect.value = savedTheme;
//         themeSelect.addEventListener('change', () => {
//             const selectedTheme = themeSelect.value;
//             localStorage.setItem('theme', selectedTheme);
//             applyTheme(selectedTheme);
//         });
//     }

//     // Listen for system theme changes (for 'system' setting)
//     window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
//         if (localStorage.getItem('theme') === 'system' || !localStorage.getItem('theme')) {
//             applyTheme('system');
//         }
//     });
// });


// Sidebar functionality remains unchanged
document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.sidebar');
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const closeBtn = document.querySelector('.close-btn');
    const toggleCollapse = document.querySelector('.toggle-collapse');
    const mainContent = document.querySelector('.main-content');
    
    // Load sidebar state from localStorage
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
    toggleCollapse.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('expanded');
        
        // Save state to localStorage
        if (window.matchMedia('(min-width: 993px)').matches) {
            localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        const isMobileNow = window.matchMedia('(max-width: 992px)').matches;
        
        if (isMobileNow) {
            sidebar.classList.remove('collapsed', 'open');
            mainContent.classList.remove('expanded');
        } else {
            // Restore desktop state
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