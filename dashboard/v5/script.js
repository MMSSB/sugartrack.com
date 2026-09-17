

// document.addEventListener('DOMContentLoaded', () => {
    
//     // --- 1. Global Elements ---
//     const html = document.documentElement;
//     const mobileOverlay = document.getElementById('mobileOverlay');
    
//     // --- 2. Sidebar Toggles ---
    
//     // // Desktop Toggle: Collapses sidebar width
//     // const desktopBtn = document.getElementById('desktopCollapseBtn');
    
//     // if (desktopBtn) {
//     //     desktopBtn.addEventListener('click', () => {
//     //         html.classList.toggle('sidebar-collapsed');
//     //         localStorage.setItem('sidebarCollapsed', html.classList.contains('sidebar-collapsed'));
            
//     //         // Trigger a resize for chart after transition
//     //         setTimeout(() => {
//     //             window.dispatchEvent(new Event('resize'));
//     //         }, 350);
//     //     });
//     // }

//     // Mobile Toggle: Slides sidebar in/out
//     const mobileOpen = document.getElementById('mobileOpenBtn');
//     const mobileClose = document.getElementById('mobileCloseBtn');
//     const sidebar = document.getElementById('sidebar');

//     function toggleMobileMenu() {
//         sidebar.classList.toggle('mobile-open');
//         mobileOverlay.classList.toggle('active');
//     }

//     if (mobileOpen) mobileOpen.addEventListener('click', toggleMobileMenu);
//     if (mobileClose) mobileClose.addEventListener('click', toggleMobileMenu);
//     if (mobileOverlay) mobileOverlay.addEventListener('click', toggleMobileMenu);

//     // --- 3. Dropdown Logic (Fixed) ---
//     function setupDropdown(triggerId, menuId) {
//         const trigger = document.getElementById(triggerId);
//         const menu = document.getElementById(menuId);
        
//         if (!trigger || !menu) return;

//         trigger.addEventListener('click', (e) => {
//             e.stopPropagation();
            
//             // Close other dropdowns
//             document.querySelectorAll('.dropdown-menu').forEach(d => {
//                 if (d !== menu) d.classList.remove('show');
//             });
//             document.querySelectorAll('.user-trigger').forEach(t => {
//                 if (t !== trigger) t.classList.remove('active');
//             });

//             // Toggle current
//             menu.classList.toggle('show');
//             trigger.classList.toggle('active');
//         });

//         // Close when clicking outside
//         document.addEventListener('click', (e) => {
//             if (!menu.contains(e.target) && !trigger.contains(e.target)) {
//                 menu.classList.remove('show');
//                 trigger.classList.remove('active');
//             }
//         });
//     }

//     setupDropdown('userMenuBtn', 'userDropdown');
//     setupDropdown('themeBtn', 'themeMenu');

//     // --- 4. Submenu Logic ---
//     const subTriggers = document.querySelectorAll('.submenu-trigger');
//     subTriggers.forEach(btn => {
//         btn.addEventListener('click', (e) => {
//             if (html.classList.contains('sidebar-collapsed') && window.innerWidth > 1024) {
//                 html.classList.remove('sidebar-collapsed');
//                 localStorage.setItem('sidebarCollapsed', 'false');
//             }
//             const group = btn.parentElement;
//             group.classList.toggle('open');
//         });
//     });

//     // --- 5. Theme Logic ---
//     const systemQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
//     function applyTheme(theme) {
//         let isDark = false;
//         if (theme === 'system') {
//             isDark = systemQuery.matches;
//             document.getElementById('themeIcon').className = 'ph ph-desktop';
//         } else {
//             isDark = theme === 'dark';
//             document.getElementById('themeIcon').className = isDark ? 'ph ph-moon' : 'ph ph-sun';
//         }

//         if (isDark) {
//             html.setAttribute('data-theme', 'dark');
//         } else {
//             html.setAttribute('data-theme', 'light');
//         }
//         renderChart();
//     }

//     window.setTheme = (theme) => {
//         localStorage.setItem('theme', theme);
//         applyTheme(theme);
//         document.getElementById('themeMenu').classList.remove('show');
//     };

//     systemQuery.addEventListener('change', () => {
//         if (localStorage.getItem('theme') === 'system') applyTheme('system');
//     });

//     const savedTheme = localStorage.getItem('theme') || 'system';
//     if (savedTheme === 'system') {
//         document.getElementById('themeIcon').className = 'ph ph-desktop';
//     } else {
//         document.getElementById('themeIcon').className = savedTheme === 'dark' ? 'ph ph-moon' : 'ph ph-sun';
//     }
    
//     // --- 6. Chart.js Logic ---
//     let leadsChart = null;

//     function renderChart() {
//         const ctx = document.getElementById('leadsChart');
//         if (!ctx) return;

//         const isDark = html.getAttribute('data-theme') === 'dark';
//         const gridColor = isDark ? '#27272a' : '#e4e4e7';
//         const textColor = isDark ? '#a1a1aa' : '#71717a';
//         const tooltipBg = isDark ? '#18181b' : '#ffffff';
//         const tooltipText = isDark ? '#ffffff' : '#09090b';

//         if (leadsChart) leadsChart.destroy();

//         const ctx2d = ctx.getContext('2d');
//         const gradient = ctx2d.createLinearGradient(0, 0, 0, 300);
        
//         if (isDark) {
//             gradient.addColorStop(0, 'rgba(59, 130, 246, 0.4)'); 
//             gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
//         } else {
//             gradient.addColorStop(0, 'rgba(59, 130, 246, 0.2)'); 
//             gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
//         }

//         leadsChart = new Chart(ctx2d, {
//             type: 'line',
//             data: {
//                 labels: ['Jan 1', 'Jan 5', 'Jan 10', 'Jan 15', 'Jan 20', 'Jan 25', 'Jan 30'],
//                 datasets: [{
//                     label: 'Glucose Level',
//                     data: [110, 105, 130, 95, 115, 140, 118],
//                     borderColor: '#3b82f6',
//                     backgroundColor: gradient,
//                     tension: 0.4,
//                     fill: true,
//                     pointRadius: 0,
//                     pointHoverRadius: 6,
//                     borderWidth: 2
//                 }]
//             },
//             options: {
//                 responsive: true,
//                 maintainAspectRatio: false,
//                 plugins: {
//                     legend: { display: false },
//                     tooltip: {
//                         mode: 'index',
//                         intersect: false,
//                         backgroundColor: tooltipBg,
//                         titleColor: tooltipText,
//                         bodyColor: textColor,
//                         borderColor: gridColor,
//                         borderWidth: 1,
//                         padding: 10,
//                         cornerRadius: 8,
//                         titleFont: { size: 13, weight: 600 },
//                         bodyFont: { size: 12 }
//                     }
//                 },
//                 scales: {
//                     x: {
//                         grid: { display: false },
//                         ticks: { color: textColor, font: {size: 11} }
//                     },
//                     y: {
//                         grid: { color: gridColor, borderDash: [4, 4] },
//                         border: { display: false },
//                         ticks: { color: textColor, font: {size: 11}, maxTicksLimit: 5 }
//                     }
//                 },
//                 interaction: {
//                     mode: 'nearest',
//                     axis: 'x',
//                     intersect: false
//                 },
//                 animation: { duration: 750 }
//             }
//         });
//     }
//     renderChart();

//     // --- 7. Modal & Date Logic ---
//     const dateDisplay = document.getElementById('currentDateDisplay');
//     if(dateDisplay) {
//         const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
//         dateDisplay.textContent = new Date().toLocaleDateString('en-US', options);
//     }

//     const modal = document.getElementById('readingModal');
//     const openBtn = document.getElementById('addReadingBtn');
//     const closeBtn = document.getElementById('closeModalBtn');
//     const cancelBtn = document.getElementById('cancelBtn');
//     const dateInput = document.getElementById('inputDate');
//     const timeInput = document.getElementById('inputTime');
//     const modalContainer = document.querySelector('.modal-container');
    
//     function setDefaults() {
//         const now = new Date();
//         if(dateInput) dateInput.valueAsDate = now;
//         if(timeInput) timeInput.value = now.toTimeString().substring(0,5);
//     }

//     function openModal() {
//         setDefaults();
//         modal.classList.add('active');
//         document.body.style.overflow = 'hidden'; 
//     }

//     function closeModal() {
//         modal.classList.remove('active');
//         document.body.style.overflow = '';
//         if(modalContainer) modalContainer.style.transform = ''; // Reset drag
//     }

//     if(openBtn) openBtn.addEventListener('click', openModal);
//     if(closeBtn) closeBtn.addEventListener('click', closeModal);
//     if(cancelBtn) cancelBtn.addEventListener('click', closeModal);
    
//     modal.addEventListener('click', (e) => {
//         if (e.target === modal) closeModal();
//     });

//     // Form Submit Simulation
//     const form = document.getElementById('addReadingForm');
//     if(form) {
//         form.addEventListener('submit', (e) => {
//             e.preventDefault();
//             const btn = form.querySelector('button[type="submit"]');
//             const originalText = btn.textContent;
//             btn.textContent = "Saved!";
//             btn.style.background = "var(--success)";
            
//             setTimeout(() => {
//                 closeModal();
//                 btn.textContent = originalText;
//                 btn.style.background = ""; 
//                 form.reset();
//             }, 800);
//         });
//     }

//     // --- 8. MOBILE DRAG-TO-CLOSE LOGIC (FINAL) ---
//     const modalBody = document.querySelector('.modal-body');
//     let startY = 0;
//     let currentY = 0;
//     let isDragging = false;
//     let isHeaderDrag = false;

//     const isMobile = () => window.innerWidth <= 768;

//     if (modalContainer) {
        
//         // 1. TOUCH START
//         modalContainer.addEventListener('touchstart', (e) => {
//             if (!isMobile()) return;

//             const target = e.target;
//             const isHeader = target.closest('.modal-header') || target.closest('.mobile-handle');
//             const isAtTop = modalBody ? modalBody.scrollTop <= 0 : true;

//             // We only care if:
//             // A) User grabs the header/handle (Always drag)
//             // B) User grabs the body AND it is scrolled to the very top (Conditional drag)
//             if (isHeader || isAtTop) {
//                 startY = e.touches[0].clientY;
//                 isDragging = false;
//                 isHeaderDrag = !!isHeader; // Remember if we started on header
//             } else {
//                 startY = 0;
//             }
//         }, { passive: true });

//         // 2. TOUCH MOVE
//         modalContainer.addEventListener('touchmove', (e) => {
//             if (!isMobile() || startY === 0) return;

//             currentY = e.touches[0].clientY;
//             const delta = currentY - startY;

//             // Only drag if we are pulling DOWN (delta > 0)
//             if (delta > 0) {
                
//                 // If we didn't start on the header, we must check scroll position again
//                 // to make sure user isn't just scrolling up normally
//                 if (!isHeaderDrag && modalBody && modalBody.scrollTop > 0) {
//                     return; // Allow normal scrolling
//                 }

//                 // If we are here, we are dragging the sheet down
//                 if (e.cancelable) e.preventDefault(); // STOP browser scrolling

//                 if (!isDragging) {
//                     isDragging = true;
//                     modalContainer.classList.add('is-dragging'); // Disable transition
//                 }

//                 // Resistance effect (0.8) makes it feel heavier
//                 modalContainer.style.transform = `translateY(${delta}px)`;
//             }
//         }, { passive: false }); // passive: false is REQUIRED for preventDefault

//         // 3. TOUCH END
//         modalContainer.addEventListener('touchend', (e) => {
//             if (!isDragging) return;

//             isDragging = false;
//             modalContainer.classList.remove('is-dragging'); // Re-enable transition

//             const delta = currentY - startY;
//             const threshold = 150; // Drag distance to close

//             if (delta > threshold) {
//                 closeModal(); // Close it
//                 // We leave the transform for a split second so it doesn't snap back before disappearing
//                 setTimeout(() => { modalContainer.style.transform = ''; }, 300);
//             } else {
//                 modalContainer.style.transform = ''; // Snap back up
//             }
//             startY = 0;
//         });
//     }

// });































document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. GLOBAL VARS ---
    const html = document.documentElement;
    const mobileOverlay = document.getElementById('mobileOverlay');
    
    // --- 2. SIDEBAR TOGGLES ---
    const desktopBtn = document.getElementById('desktopCollapseBtn');
    if (desktopBtn) {
        desktopBtn.addEventListener('click', () => {
            html.classList.toggle('sidebar-collapsed');
            localStorage.setItem('sidebarCollapsed', html.classList.contains('sidebar-collapsed'));
            setTimeout(() => { window.dispatchEvent(new Event('resize')); }, 350);
        });
    }

    const mobileOpen = document.getElementById('mobileOpenBtn');
    const mobileClose = document.getElementById('mobileCloseBtn');
    const sidebar = document.getElementById('sidebar');

    function toggleMobileMenu() {
        if(sidebar) sidebar.classList.toggle('mobile-open');
        if(mobileOverlay) mobileOverlay.classList.toggle('active');
    }

    if (mobileOpen) mobileOpen.addEventListener('click', toggleMobileMenu);
    if (mobileClose) mobileClose.addEventListener('click', toggleMobileMenu);
    if (mobileOverlay) mobileOverlay.addEventListener('click', toggleMobileMenu);

    // --- 3. DROPDOWN LOGIC ---
    function setupDropdown(triggerId, menuId) {
        const trigger = document.getElementById(triggerId);
        const menu = document.getElementById(menuId);
        if (!trigger || !menu) return;

        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            document.querySelectorAll('.dropdown-menu.show').forEach(d => {
                if (d !== menu) d.classList.remove('show');
            });
            document.querySelectorAll('.user-trigger.active').forEach(t => {
                if (t !== trigger) t.classList.remove('active');
            });
            menu.classList.toggle('show');
            trigger.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!menu.contains(e.target) && !trigger.contains(e.target)) {
                menu.classList.remove('show');
                trigger.classList.remove('active');
            }
        });
    }
// Link the mobile bottom nav Add button to the existing modal logic
const mobileAddBtn = document.getElementById('mobileAddReadingBtn');
const readingModal = document.getElementById('readingModal');

if (mobileAddBtn && readingModal) {
    mobileAddBtn.addEventListener('click', () => {
        readingModal.classList.add('active');
    });
}
    setupDropdown('userMenuBtn', 'userDropdown');
    setupDropdown('themeBtn', 'themeMenu');

    // --- 4. CHART.JS LOGIC ---
    // We expose this so main.js can call it when theme changes
    window.renderChart = function() {
        const ctx = document.getElementById('leadsChart');
        if (!ctx) return;

        const isDark = html.getAttribute('data-theme') === 'dark';
        const gridColor = isDark ? '#27272a' : '#e4e4e7';
        const textColor = isDark ? '#a1a1aa' : '#71717a';
        const tooltipBg = isDark ? '#18181b' : '#ffffff';
        const tooltipText = isDark ? '#ffffff' : '#09090b';

        // Destroy previous instance
        if (window.myLeadsChart) window.myLeadsChart.destroy();

        const ctx2d = ctx.getContext('2d');
        const gradient = ctx2d.createLinearGradient(0, 0, 0, 300);
        
        if (isDark) {
            gradient.addColorStop(0, 'rgba(59, 130, 246, 0.4)'); 
            gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
        } else {
            gradient.addColorStop(0, 'rgba(59, 130, 246, 0.2)'); 
            gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
        }

        window.myLeadsChart = new Chart(ctx2d, {
            type: 'line',
            data: {
                labels: ['Jan 1', 'Jan 5', 'Jan 10', 'Jan 15', 'Jan 20', 'Jan 25', 'Jan 30'],
                datasets: [{
                    label: 'Glucose Level',
                    data: [110, 105, 130, 95, 115, 140, 118],
                    borderColor: '#3b82f6',
                    backgroundColor: gradient,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: tooltipBg,
                        titleColor: tooltipText,
                        bodyColor: textColor,
                        borderColor: gridColor,
                        borderWidth: 1,
                        padding: 10,
                        cornerRadius: 8,
                        titleFont: { size: 13, weight: 600 },
                        bodyFont: { size: 12 }
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { color: textColor, font: {size: 11} }
                    },
                    y: {
                        grid: { color: gridColor, borderDash: [4, 4] },
                        border: { display: false },
                        ticks: { color: textColor, font: {size: 11}, maxTicksLimit: 5 }
                    }
                },
                interaction: { mode: 'nearest', axis: 'x', intersect: false },
                animation: { duration: 750 }
            }
        });
    };

    // Initial render
    if(typeof Chart !== 'undefined') renderChart();

    // --- 5. MODAL & DATE LOGIC ---
    const dateDisplay = document.getElementById('currentDateDisplay');
    if(dateDisplay) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateDisplay.textContent = new Date().toLocaleDateString('en-US', options);
    }

    const modal = document.getElementById('readingModal');
    const openBtn = document.getElementById('addReadingBtn');
    const closeBtn = document.getElementById('closeModalBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const modalContainer = document.querySelector('.modal-container');
    
    function openModal() {
        if(!modal) return;
        const now = new Date();
        const dInput = document.getElementById('inputDate');
        const tInput = document.getElementById('inputTime');
        if(dInput) dInput.valueAsDate = now;
        if(tInput) tInput.value = now.toTimeString().substring(0,5);

        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; 
    }

    function closeModal() {
        if(!modal) return;
        modal.classList.remove('active');
        document.body.style.overflow = '';
        if(modalContainer) modalContainer.style.transform = ''; 
    }

    if(openBtn) openBtn.addEventListener('click', openModal);
    if(closeBtn) closeBtn.addEventListener('click', closeModal);
    if(cancelBtn) cancelBtn.addEventListener('click', closeModal);
    if(modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    // --- 6. MOBILE DRAG TO CLOSE ---
    if (modalContainer) {
        let startY = 0;
        let isDragging = false;
        
        modalContainer.addEventListener('touchstart', (e) => {
            if (window.innerWidth > 768) return;
            const target = e.target;
            const isHeader = target.closest('.modal-header') || target.closest('.mobile-handle');
            if (isHeader) {
                startY = e.touches[0].clientY;
                isDragging = true;
            }
        }, { passive: true });

        modalContainer.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const currentY = e.touches[0].clientY;
            const delta = currentY - startY;
            if (delta > 0) {
                if (e.cancelable) e.preventDefault();
                modalContainer.style.transform = `translateY(${delta}px)`;
            }
        }, { passive: false });

        modalContainer.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            isDragging = false;
            const currentY = e.changedTouches[0].clientY;
            const delta = currentY - startY;
            if (delta > 150) closeModal();
            else modalContainer.style.transform = '';
        });
    }
});