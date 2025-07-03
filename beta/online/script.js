// script.js (updated for Firebase)
// Initialize jsPDF
window.jsPDF = window.jspdf.jsPDF;

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
const logoutButton = document.createElement('button'); // We'll add this dynamically

// Set default date and time
const now = new Date();
dateInput.value = now.toISOString().split('T')[0];
timeInput.value = now.toTimeString().slice(0, 5);

// Initialize variables
let readings = [];
let currentUser = null;

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

// Initialize Firebase Auth listener
auth.onAuthStateChanged((user) => {
    if (user) {
        currentUser = user;
        appContainer.style.display = 'flex';  // Show app when authenticated
        loadUserData();
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
                        console.log('User name set:', userData.firstName);
                    }
                } else {
                    // Create user document if it doesn't exist
                    return db.collection('users').doc(currentUser.uid).set({
                        firstName: 'User',
                        lastName: '',
                        email: currentUser.email,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    }).then(() => {
                        const userWelcomeName = document.getElementById('userWelcomeName');
                        if (userWelcomeName) {
                            userWelcomeName.textContent = 'User';
                        }
                    });
                }
            })
            .catch((error) => {
                console.error('Error loading user data:', error);
                const userWelcomeName = document.getElementById('userWelcomeName');
                if (userWelcomeName) {
                    userWelcomeName.textContent = 'User';
                }
            });
    
    console.log('Loading user data for:', currentUser.uid);
    
    // Load glucose readings with real-time updates
    console.log('Setting up real-time listener for user:', currentUser.uid);
    const unsubscribe = db.collection('readings')
        .where('userId', '==', currentUser.uid)
        .orderBy('timestamp', 'desc')
        .onSnapshot((querySnapshot) => {
            console.log('Received snapshot with', querySnapshot.size, 'readings');
            readings = [];
            querySnapshot.forEach((doc) => {
                const reading = doc.data();
                console.log('Reading data:', { id: doc.id, ...reading });
                readings.push({
                    id: doc.id,
                    date: reading.date,
                    time: reading.time,
                    glucose: reading.glucose,
                    comment: reading.comment || '',
                    timestamp: reading.timestamp ? reading.timestamp.toDate() : new Date()
                });
            });
            console.log('Updated readings array:', readings);
            updateReadingsList();
        }, (error) => {
            console.error("Error in real-time updates:", error);
            if (error.code === 'permission-denied') {
                alert('Access denied. Please sign out and sign in again.');
            } else {
                alert('Error loading readings: ' + error.message);
            }
        });

    // Store unsubscribe function
    window._unsubscribeReadings = unsubscribe;
}

// Handle logout
function handleLogout() {
    // Unsubscribe from real-time updates
    if (window._unsubscribeReadings) {
        window._unsubscribeReadings();
    }
    
    auth.signOut()
        .then(() => {
            console.log('User logged out successfully');
            window.location.href = 'login.html';
        })
        .catch((error) => {
            console.error('Logout error:', error);
            alert('Error logging out. Please try again.');
        });
}

// Add new reading
addReadingButton.addEventListener('click', () => {
    const date = dateInput.value;
    const time = timeInput.value;
    const glucose = parseFloat(glucoseInput.value);
    const comment = commentInput.value.trim();

    if (!date || !time || !glucose) {
        alert('Please fill in all required fields (date, time, and glucose reading)');
        return;
    }

    if (!currentUser) {
        alert('Please sign in to add readings');
        return;
    }

    console.log('Adding new reading:', { date, time, glucose, comment });

    const newReading = {
        userId: currentUser.uid,
        date,
        time,
        glucose,
        comment,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };

    // Disable add button while saving
    addReadingButton.disabled = true;
    addReadingButton.textContent = 'Adding...';

    db.collection('readings').add(newReading)
        .then((docRef) => {
            console.log('Reading added with ID:', docRef.id);
            glucoseInput.value = '';
            commentInput.value = '';
            alert('Reading added successfully!');
        })
        .catch((error) => {
            console.error('Error adding reading:', error);
            if (error.code === 'permission-denied') {
                alert('Access denied. Please sign out and sign in again.');
            } else {
                alert('Error adding reading: ' + error.message);
            }
        })
        .finally(() => {
            addReadingButton.disabled = false;
            addReadingButton.textContent = 'Add';
        });
});

// Update readings list
function updateReadingsList() {
    console.log('Updating readings list with', readings.length, 'readings');
    readingsList.innerHTML = '';
    readingsCount.textContent = `${readings.length} Readings`;
    updateSuggestions(readings);


    if (readings.length === 0) {
        console.log('No readings found');
        readingsList.innerHTML = '<div class="reading-item">No readings yet. Add your first reading above.</div>';
        return;
    }

    console.log('Rendering readings list');

    readings.forEach((reading, index) => {
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
                    <button class="edit-button" data-id="${reading.id}">Edit</button>
                    <button class="delete-button" data-id="${reading.id}">Delete</button>
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

    // Edit button handler
    document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const readingId = e.target.getAttribute('data-id');
            const reading = readings.find(r => r.id === readingId);
            
            if (reading) {
                dateInput.value = reading.date;
                timeInput.value = reading.time;
                glucoseInput.value = reading.glucose;
                commentInput.value = reading.comment || '';
                
                // Remove the reading
                db.collection('readings').doc(readingId).delete()
                    .catch((error) => {
                        console.error('Error removing reading:', error);
                        alert('Error removing reading. Please try again.');
                    });
            }
        });
    });

    // Delete button handler
    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const readingId = e.target.getAttribute('data-id');
            
            if (confirm('Are you sure you want to delete this reading?')) {
                db.collection('readings').doc(readingId).delete()
                    .catch((error) => {
                        console.error('Error deleting reading:', error);
                        alert('Error deleting reading. Please try again.');
                    });
            }
        });
    });

    // Update trends message based on readings length
    if (readings.length >= 2) {
        trendsMessage.textContent = 'Tracking your glucose trends over time';
    } else {
        trendsMessage.textContent = 'Add at least two readings to see your trends';
    }
}

// Reset all data
resetButton.addEventListener('click', () => {
    if (!currentUser) {
        alert('Please sign in to reset readings');
        return;
    }

    if (confirm('Are you sure you want to reset all readings? This cannot be undone.')) {
        // Delete all readings for this user
        const batch = db.batch();
        const readingsRef = db.collection('readings').where('userId', '==', currentUser.uid);
        
        readingsRef.get()
            .then((querySnapshot) => {
                if (querySnapshot.empty) {
                    alert('No readings to reset.');
                    return;
                }

                querySnapshot.forEach((doc) => {
                    batch.delete(doc.ref);
                });
                return batch.commit();
            })
            .then(() => {
                // No need to manually update readings array or UI
                // onSnapshot will handle that automatically
                alert('All readings have been reset successfully.');
            })
            .catch((error) => {
                console.error('Error resetting readings:', error);
                alert('Error resetting readings. Please try again.');
            });
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
    const columnWidths = [150, 100, 100, width - 100]; // Adjust these widths as needed
    let yPosition = margin + logoHeight + heightPerRow;
    // ctx.font = `${fontSizeText}px Arial`;
    ctx.font = `bold ${fontSizeText}px Arial`;
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

// Export as PDF
exportPDFButton.addEventListener('click', () => {
    // Initialize jsPDF with A4 dimensions
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    // Website information
    const websiteName = 'SugarTrack.com';
    const weblink = 'https://mmssb.github.io/sugartrack.com';
    const websiteLinkText = 'Visit our website';
    const websiteURL = 'https://mmssb.github.io/sugartrack.com';

    // Add website header
    pdf.setFontSize(25);
    pdf.text(websiteName, 5, 20);
    pdf.setFontSize(10);
    pdf.text(weblink, 5, 25);
    pdf.setTextColor(0, 0, 255);
    pdf.textWithLink(websiteLinkText, 5, 30, { url: websiteURL });

    // Reset text color and set font styles
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(14);
    pdf.setFont('helvetica');

    // Get user data from Firestore
    db.collection('users').doc(currentUser.uid).get()
        .then((doc) => {
            const userData = doc.exists ? doc.data() : { firstName: 'User' };
            const userName = userData.firstName;

            // Add title with user name
            pdf.text(`Diabetes Tracker Data - ${userName}`, 10, 35);

            // Table setup
            const headers = ['Date', 'Time', 'Glucose (mg/dL)', 'Comment'];
            const columnWidths = [50, 30, 40, 60];
            const headerHeight = 10;
            let yPosition = 45;

            // Draw table headers
            headers.forEach((header, index) => {
                pdf.text(header, 10 + columnWidths.slice(0, index).reduce((a, b) => a + b, 0), yPosition);
            });
            yPosition += headerHeight;

            // Add table rows
            readings.forEach((reading) => {
                const formattedTime = formatTime12Hour(reading.time);
                const rowData = [
                    reading.date,
                    formattedTime,
                    reading.glucose.toString(),
                    reading.comment || ''
                ];

                // Check if new page is needed
                if (yPosition + headerHeight > pdf.internal.pageSize.getHeight()) {
                    pdf.addPage();
                    yPosition = 20;

                    // Redraw headers on new page
                    headers.forEach((header, index) => {
                        pdf.text(header, 10 + columnWidths.slice(0, index).reduce((a, b) => a + b, 0), yPosition);
                    });
                    yPosition += headerHeight;
                }

                // Draw row data
                rowData.forEach((cell, colIndex) => {
                    pdf.text(cell, 10 + columnWidths.slice(0, colIndex).reduce((a, b) => a + b, 0), yPosition);
                });
                yPosition += headerHeight;
            });

            // Save the PDF
            pdf.save(`glucose-readings-${new Date().toISOString().split('T')[0]}.pdf`);
        })
        .catch((error) => {
            console.error('Error generating PDF:', error);
            alert('Error generating PDF. Please try again.');
        });
});

// Save user data as a .diab file
saveButton.addEventListener('click', () => {
    const data = {
        readings,
        exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `SugarTrack_Data_${new Date().toISOString().split('T')[0]}.diab`;
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
    if (file && (file.name.endsWith('.diab') || file.type === 'application/json')) {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                
                if (data.readings && Array.isArray(data.readings)) {
                    // Add each reading to Firestore
                    const batch = db.batch();
                    const readingsRef = db.collection('readings');
                    
                    data.readings.forEach(reading => {
                        const newReadingRef = readingsRef.doc();
                        batch.set(newReadingRef, {
                            userId: currentUser.uid,
                            date: reading.date,
                            time: reading.time,
                            glucose: reading.glucose,
                            comment: reading.comment || '',
                            timestamp: firebase.firestore.FieldValue.serverTimestamp()
                        });
                    });
                    
                    batch.commit().then(() => {
                        alert(`${data.readings.length} readings imported successfully!`);
                        loadUserData(); // Refresh the readings list
                    });
                } else {
                    alert('Invalid data format in the file.');
                }
            } catch (error) {
                console.error('Error parsing the file:', error);
                alert('Error parsing the file. Please ensure the file is valid.');
            }
        };
        reader.readAsText(file);
    } else {
        alert('Invalid file format. Please upload a valid .diab or JSON file.');
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

// Theme switching functionality
function applyTheme(theme) {
    if (theme === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.body.classList.toggle('dark-theme', prefersDark);
    } else {
        document.body.classList.toggle('dark-theme', theme === 'dark');
    }
}

// Apply theme immediately
const savedTheme = localStorage.getItem('theme') || 'system';
applyTheme(savedTheme);

// Set up theme switching after DOM loads
document.addEventListener('DOMContentLoaded', () => {
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

// Initialize sidebar state
const sidebar = document.querySelector('.sidebar');
const mainContent = document.querySelector('.main-content');
const isSidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
const isMobile = window.matchMedia('(max-width: 992px)').matches;

if (isSidebarCollapsed && !isMobile) {
    sidebar.classList.add('collapsed');
    mainContent.classList.add('expanded');
}

// Sidebar functionality
document.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const closeBtn = document.querySelector('.close-btn');
    const toggleCollapse = document.querySelector('.toggle-collapse');
    
    // Mobile menu toggle
    hamburgerBtn.addEventListener('click', () => {
        sidebar.classList.add('open');
    });
    
    closeBtn.addEventListener('click', () => {
        sidebar.classList.remove('open');
    });
    
    // Desktop sidebar collapse toggle
    toggleCollapse.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('expanded');
        
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
