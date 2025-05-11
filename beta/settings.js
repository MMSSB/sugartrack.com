// settings.js
const userWelcomeName = document.getElementById('userWelcomeName');
const currentDateTime = document.getElementById('currentDateTime');
const themeSelect = document.getElementById('themeSelect');
const newNameInput = document.getElementById('newName');
const changeNameButton = document.getElementById('changeNameButton');

// Update date and time
function updateDateTime() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    currentDateTime.textContent = now.toLocaleDateString('en-US', options);
}
// updateDateTime();
// setInterval(updateDateTime, 1000);

// Load saved name
// const savedName = localStorage.getItem('userName');
// if (savedName) {
//     userWelcomeName.textContent = savedName;
//     newNameInput.value = savedName;
// }
const savedName = localStorage.getItem('userName');
if (savedName) {
    welcomeScreen.style.display = 'none';
    appContainer.style.display = 'block';
    const firstName = localStorage.getItem('userFirstName') || savedName.split(' ')[0];
    userWelcomeName.textContent = firstName;
}
// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'system';
themeSelect.value = savedTheme;
applyTheme(savedTheme);

// Apply theme
function applyTheme(theme) {
    if (theme === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.body.classList.toggle('dark-theme', prefersDark);
    } else {
        document.body.classList.toggle('dark-theme', theme === 'dark');
    }
}

// Theme selection
themeSelect.addEventListener('change', () => {
    const theme = themeSelect.value;
    localStorage.setItem('theme', theme);
    applyTheme(theme);
});

// Change name
// changeNameButton.addEventListener('click', () => {
//     const newName = newNameInput.value.trim();
//     if (newName) {
//         localStorage.setItem('userName', newName);
//         userWelcomeName.textContent = newName;
//         alert('Name updated successfully!');
//     }
// });
// In the settings.js file, update the name change handler:
changeNameButton.addEventListener('click', () => {
    const newName = newNameInput.value.trim();
    if (newName) {
        localStorage.setItem('userName', newName);
        localStorage.setItem('userFirstName', newName.split(' ')[0]); // Store first name
        userWelcomeName.textContent = newName.split(' ')[0]; // Show only first name
        alert('Name updated successfully!');
    }
});

// System theme listener
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (themeSelect.value === 'system') {
        applyTheme('system');
    }
});



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


