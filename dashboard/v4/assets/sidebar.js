

// // Initialize sidebar state
// const sidebar = document.querySelector('.sidebar');
// const mainContent = document.querySelector('.main-content');
// const isSidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
// const isMobile = window.matchMedia('(max-width: 992px)').matches;

// if (isSidebarCollapsed && !isMobile) {
//     sidebar.classList.add('collapsed');
//     mainContent.classList.add('expanded');
// }

// // Sidebar functionality
// document.addEventListener('DOMContentLoaded', () => {
//     const hamburgerBtn = document.querySelector('.hamburger-btn');
//     const closeBtn = document.querySelector('.close-btn');
//     const toggleCollapse = document.querySelector('.toggle-collapse');
    
//     // Mobile menu toggle
//     hamburgerBtn.addEventListener('click', () => {
//         sidebar.classList.add('open');
//     });
    
//     closeBtn.addEventListener('click', () => {
//         sidebar.classList.remove('open');
//     });
    
//     // Desktop sidebar collapse toggle
//     toggleCollapse.addEventListener('click', () => {
//         sidebar.classList.toggle('collapsed');
//         mainContent.classList.toggle('expanded');
        
//         if (window.matchMedia('(min-width: 993px)').matches) {
//             localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
//         }
//     });
    
//     // Handle window resize
//     window.addEventListener('resize', () => {
//         const isMobileNow = window.matchMedia('(max-width: 992px)').matches;
        
//         if (isMobileNow) {
//             sidebar.classList.remove('collapsed', 'open');
//             mainContent.classList.remove('expanded');
//         } else {
//             if (localStorage.getItem('sidebarCollapsed') === 'true') {
//                 sidebar.classList.add('collapsed');
//                 mainContent.classList.add('expanded');
//             } else {
//                 sidebar.classList.remove('collapsed');
//                 mainContent.classList.remove('expanded');
//             }
//         }
//     });
    
//     // Close sidebar when clicking outside on mobile
//     document.addEventListener('click', (e) => {
//         if (window.matchMedia('(max-width: 992px)').matches) {
//             if (!sidebar.contains(e.target) && !hamburgerBtn.contains(e.target)) {
//                 sidebar.classList.remove('open');
//             }
//         }
//     });
// });

// --- SIDEBAR LOGIC ---

// Initialize sidebar state
const sidebar = document.querySelector('.sidebar');
const mainContent = document.querySelector('.main-content');
const isSidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
const isMobile = window.matchMedia('(max-width: 992px)').matches;

// Function to update the toggle icon based on sidebar state
function updateToggleIcon() {
    const toggleIcon = document.querySelector('.toggle-collapse i');
    if (toggleIcon) { // Ensure the icon element exists
        const isCollapsed = sidebar.classList.contains('collapsed');
        if (isCollapsed) {
            toggleIcon.classList.remove('fa-chevron-left');
            toggleIcon.classList.add('fa-chevron-right');
        } else {
            toggleIcon.classList.remove('fa-chevron-right');
            toggleIcon.classList.add('fa-chevron-left');
        }
    }
}

// Apply initial collapsed state from localStorage
if (isSidebarCollapsed && !isMobile) {
    sidebar.classList.add('collapsed');
    mainContent.classList.add('expanded');
}

// Sidebar functionality
document.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const closeBtn = document.querySelector('.close-btn');
    const toggleCollapse = document.querySelector('.toggle-collapse');

    // Set initial icon state for desktop view
    if (toggleCollapse) {
        updateToggleIcon();
    }
    
    // Mobile menu toggle
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', () => {
            sidebar.classList.add('open');
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            sidebar.classList.remove('open');
        });
    }
    
    // Desktop sidebar collapse toggle
    if (toggleCollapse) {
        toggleCollapse.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');
            
            if (window.matchMedia('(min-width: 993px)').matches) {
                localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
            }
            // Update icon after click
            updateToggleIcon(); 
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
            // Update icon on resize for desktop view
            updateToggleIcon();
        }
    });
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.matchMedia('(max-width: 992px)').matches && hamburgerBtn) {
            if (!sidebar.contains(e.target) && !hamburgerBtn.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        }
    });
});
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





// Switch to specific theme
themeManager.applyTheme('blue-dark');

// Toggle between light/dark variants
themeManager.toggleDarkMode();

// Get current theme info
const currentTheme = themeManager.getCurrentTheme();
const themeData = themeManager.getThemeData();

// Listen for theme changes
window.addEventListener('themeChanged', (event) => {
    console.log('Theme changed to:', event.detail.theme);
});