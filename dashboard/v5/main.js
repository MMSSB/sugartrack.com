        // (function() {
        //     // 1. Restore Theme immediately
        //     const savedTheme = localStorage.getItem('theme') || 'system';
        //     const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            
        //     if (savedTheme === 'dark' || (savedTheme === 'system' && systemDark)) {
        //         document.documentElement.setAttribute('data-theme', 'dark');
        //     } else {
        //         document.documentElement.setAttribute('data-theme', 'light');
        //     }

        //     // 2. Restore Sidebar State immediately
        //     // We use the HTML tag for the class to ensure it exists before body renders
        //     const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
        //     if (isCollapsed) {
        //         document.documentElement.classList.add('sidebar-collapsed');
        //     }
        // })();













        /* =========================================
   1. IMMEDIATE RESTORATION (Prevents Flicker/Flash)
   ========================================= */
// (function() {
//     // --- A. THEME ---
//     function getSystemTheme() {
//         return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
//     }

//     function applyThemeToDom(theme) {
//         const root = document.documentElement;
//         const effectiveTheme = theme === 'system' ? getSystemTheme() : theme;
//         root.setAttribute('data-theme', effectiveTheme);
        
//         // Update Icon immediately if it exists
//         const icon = document.getElementById('themeIcon');
//         if(icon) {
//             if(theme === 'system') icon.className = 'ph ph-desktop';
//             else icon.className = effectiveTheme === 'dark' ? 'ph ph-moon' : 'ph ph-sun';
//         }
//     }

//     const savedTheme = localStorage.getItem('theme') || 'system';
//     applyThemeToDom(savedTheme);

//     // --- B. SIDEBAR STATE (The Fix for "Fast Open/Close") ---
//     // We check this INSTANTLY so the browser knows to render it collapsed
//     // before showing it to you.
//     const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
//     if (isCollapsed) {
//         document.documentElement.classList.add('sidebar-collapsed');
//     }

//     // --- C. EXPOSE HELPERS ---
//     window.setTheme = function(theme) {
//         localStorage.setItem('theme', theme);
//         applyThemeToDom(theme);
//     };

//     // Listen for System Preference Changes
//     window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
//         if (localStorage.getItem('theme') === 'system') applyThemeToDom('system');
//     });
// })();


// /* =========================================
//    2. INTERACTIVE LOGIC (Runs when HTML is ready)
//    ========================================= */
// document.addEventListener('DOMContentLoaded', () => {
    
//     // --- GLOBAL VARS ---
//     const html = document.documentElement;
//     const mobileOverlay = document.getElementById('mobileOverlay');

//     // --- SIDEBAR: DESKTOP TOGGLE ---
//     const desktopBtn = document.getElementById('desktopCollapseBtn');
    
//     if (desktopBtn) {
//         desktopBtn.addEventListener('click', () => {
//             // Toggle Class
//             html.classList.toggle('sidebar-collapsed');
            
//             // Save State
//             const isNowCollapsed = html.classList.contains('sidebar-collapsed');
//             localStorage.setItem('sidebarCollapsed', isNowCollapsed);
            
//             // Trigger Resize (Fixes charts/grids breaking when sidebar moves)
//             setTimeout(() => {
//                 window.dispatchEvent(new Event('resize'));
//             }, 300);
//         });
//     }

//     // --- SIDEBAR: MOBILE TOGGLE ---
//     const mobileOpen = document.getElementById('mobileOpenBtn');
//     const mobileClose = document.getElementById('mobileCloseBtn');
//     const sidebar = document.getElementById('sidebar');

//     function toggleMobileMenu() {
//         if(sidebar) sidebar.classList.toggle('mobile-open');
//         if(mobileOverlay) mobileOverlay.classList.toggle('active');
//     }

//     if (mobileOpen) mobileOpen.addEventListener('click', toggleMobileMenu);
//     if (mobileClose) mobileClose.addEventListener('click', toggleMobileMenu);
//     if (mobileOverlay) mobileOverlay.addEventListener('click', toggleMobileMenu);


//     // --- DROPDOWNS (User & Theme) ---
//     function setupDropdown(triggerId, menuId) {
//         const trigger = document.getElementById(triggerId);
//         const menu = document.getElementById(menuId);
        
//         if (!trigger || !menu) return;

//         // trigger.addEventListener('click', (e) => {
//         //     e.stopPropagation();
            
//         //     // Close others
//         //     document.querySelectorAll('.dropdown-menu.show').forEach(d => {
//         //         if (d !== menu) d.classList.remove('show');
//         //     });
//         //     document.querySelectorAll('.user-trigger.active').forEach(t => {
//         //         if (t !== trigger) t.classList.remove('active');
//         //     });

//         //     // Toggle current
//         //     menu.classList.toggle('show');
//         //     trigger.classList.toggle('active');
//         // });

//         // Close when clicking outside
//         document.addEventListener('click', (e) => {
//             if (!menu.contains(e.target) && !trigger.contains(e.target)) {
//                 menu.classList.remove('show');
//                 trigger.classList.remove('active');
//             }
//         });
//     }

//     // setupDropdown('userMenuBtn', 'userDropdown');
//     // setupDropdown('themeBtn', 'themeMenu');


//     // --- OPTIONAL: CHART.JS RESIZE HELPER ---
//     // If you have charts, this helper ensures they redraw correctly
//     // when theme changes.
//     window.renderChart = function() {
//         // This checks if a render function exists in your page-specific logic
//         // If not, it does nothing, preventing errors.
//         if (typeof window.drawPageChart === 'function') {
//             window.drawPageChart(); 
//         }
//     };
// });

















/* main.js - Global Theme & Sidebar State
 * Load this in <head> to prevent flashing
 */

(function() {
    // --- 1. THEME ENGINE ---
    function getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function applyThemeToDom(theme) {
        const root = document.documentElement;
        const effectiveTheme = theme === 'system' ? getSystemTheme() : theme;
        
        root.setAttribute('data-theme', effectiveTheme);
        
        // Safely update icon only if it exists (prevents errors on pages without the icon)
        const icon = document.getElementById('themeIcon');
        if (icon) {
            if (theme === 'system') icon.className = 'ph ph-desktop';
            else icon.className = effectiveTheme === 'dark' ? 'ph ph-moon' : 'ph ph-sun';
        }
    }

    // Expose Global Function
    window.setTheme = function(theme) {
        localStorage.setItem('theme', theme);
        applyThemeToDom(theme);
        
        // Safely close menu only if it exists
        const menu = document.getElementById('themeMenu');
        if (menu) menu.classList.remove('show');
        
        // Redraw charts if function exists
        if (typeof window.renderChart === 'function') window.renderChart();
    };

    // Init Theme
    const savedTheme = localStorage.getItem('theme') || 'system';
    applyThemeToDom(savedTheme);

    // Listen for System Changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (localStorage.getItem('theme') === 'system') applyThemeToDom('system');
    });

    // --- 2. SIDEBAR STATE ---
    // Restore collapsed state immediately
    const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    if (isCollapsed) {
        document.documentElement.classList.add('sidebar-collapsed');
    }
})();



// document.addEventListener('contextmenu', (e) => e.preventDefault());
// document.onkeydown = function (e) {
//     // Disable F12
//     if (event.keyCode == 123) {
//         return false;
//     }
//     // Disable Ctrl+Shift+I, J, C
//     if (e.ctrlKey && e.shiftKey && (e.keyCode == 'I'.charCodeAt(0) || e.keyCode == 'J'.charCodeAt(0) || e.keyCode == 'C'.charCodeAt(0))) {
//         return false;
//     }
//     // Disable Ctrl+U
//     if (e.ctrlKey && (e.keyCode == 'U'.charCodeAt(0))) {
//         return false;
//     }
// }










//     function updateClock() {
//     let date = new Date();
//     let hh = date.getHours();
//     let mm = date.getMinutes();
//     let ss = date.getSeconds();
//     let session = "AM";

//     if (hh === 0) {
//         hh = 12;
//     }
//     if (hh > 12) {
//         hh = hh - 12;
//         session = "PM";
//     }

//     // Add leading zeros if the number is less than 10
//     hh = (hh < 10) ? "0" + hh : hh;
//     mm = (mm < 10) ? "0" + mm : mm;
//     ss = (ss < 10) ? "0" + ss : ss;

//     // Update HTML elements with the time
//     document.getElementById("hour").innerText = hh;
//     document.getElementById("minutes").innerText = mm;
//     document.getElementById("seconds").innerText = ss;
//     document.getElementById("ampm").innerText = session;

//     // Call the function again after 1000ms (1 second)
//     setTimeout(updateClock, 1000);
// }

// // Initial call to start the clock
// updateClock();







// ==========================================
// AUTO-TRANSLATION & RTL ENGINE
// ==========================================

const arDictionary = {
    "Dashboard": "لوحة القيادة",
    "Readings": "القراءات",
    "Search Ai": "البحث الذكي",
    "Inbox": "صندوق الوارد",
    "Analytics": "التحليلات",
    "Reports": "التقارير",
    "Ask STAi": "اسأل STAi",
    "General Settings": "الإعدادات العامة",
    "Settings": "الإعدادات",
    "Log out": "تسجيل خروج",
    "Profile": "الملف الشخصي",
    "General": "عام",
    "My Profile": "ملفي الشخصي",
    "Appearance": "المظهر",
    "Privacy & Security": "الخصوصية والأمان",
    "About": "حول",
    "User": "المستخدم",
    "Add Reading": "إضافة قراءة",
    
    // Dashboard Stats
    "Avg. Glucose (7d)": "متوسط السكر (7 أيام)",
    "Last Reading": "آخر قراءة",
    "Est. A1C": "تراكمي تقديري",
    "Readings Today": "قراءات اليوم",
    "In Range": "في النطاق",
    "Target: 6/day": "الهدف: 6/يوم",
    "Glucose Trends": "اتجاهات الجلوكوز",
    "Recent Readings": "القراءات الأخيرة",
    "Level": "المستوى",
    "Time": "الوقت",
    "Context": "السياق",
    
    // General Settings Page
    "Regional & Formatting": "المنطقة والتنسيق",
    "Language": "اللغة",
    "Time Format": "تنسيق الوقت",
    "First Day of Week": "أول أيام الأسبوع",
    "Tracking Preferences": "تفضيلات التتبع",
    "Glucose Units": "وحدات القياس",
    "Default Log Context": "السياق الافتراضي",
    "Target Range": "النطاق المستهدف",
    "Smart Features": "الميزات الذكية",
    "STAi Assistant Integration": "دمج مساعد STAi",
    "Weekly Summary Reports": "تقارير أسبوعية",
    "Unsaved changes": "تغييرات غير محفوظة",
    "Discard": "إلغاء",
    "Save Changes": "حفظ التغييرات",
    "Manage your account preferences and app configuration.": "إدارة تفضيلات حسابك وتكوين التطبيق.",
    "Language & Time formatting": "     اللغة و الوقت.",   
    "Personal details and avatar": "     التفاصيل الشخصية والصورة الرمزية.",   
    "Theme mode and accent colors": "     وضع السمة والألوان المميزة.",   
    "Password and data management": "     إدارة كلمة المرور والبيانات.",   
        "Choose your preferred language and how time is displayed.": "اختر لغتك المفضلة وكيفية عرض الوقت.", 

    
    // STAi Banner
    "Meet STAi": "STAi تعرف على",
    "Try STAi Now": "STAi جرب الآن",
    "Your personal diabetes assistant is here. Ask questions, analyze your glucose trends, and get smart recommendations instantly.": "مساعدك الشخصي للسكري هنا. اطرح الأسئلة، حلل بياناتك، واحصل على توصيات ذكية فوراً."
};

document.addEventListener('DOMContentLoaded', () => {
    const currentLang = localStorage.getItem('app_lang') || 'en';
    
    // Apply the Arabic Translation if selected
    if (currentLang === 'ar') {
        // Flips the HTML layout
        // document.documentElement.dir = 'rtl';
        document.documentElement.lang = 'ar';
        
        // Scans all text on the page and replaces it safely
        const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while (node = walk.nextNode()) {
            const text = node.nodeValue.trim();
            if (arDictionary[text]) {
                node.nodeValue = node.nodeValue.replace(text, arDictionary[text]);
            }
        }
    }
});



// // ==========================================
// // AUTO-TRANSLATION & RTL ENGINE
// // ==========================================

// // 1. Your Translation Dictionary
// // Add any exact English phrases here and their Arabic translation.
// const arDictionary = {
//     "Dashboard": "لوحة القيادة",
//     "Readings": "القراءات",
//     "Search Ai": "البحث الذكي",
//     "Inbox": "صندوق الوارد",
//     "Analytics": "التحليلات",
//     "Reports": "التقارير",
//     "Ask STAi": "اسأل STAi",
//     "General Settings": "الإعدادات العامة",
//     "Settings": "الإعدادات",
//     "Log out": "تسجيل خروج",
//     "Profile": "الملف الشخصي",
//     "General": "عام",
//     "My Profile": "ملفي الشخصي",
//     "Appearance": "المظهر",
//     "Privacy & Security": "الخصوصية والأمان",
//     "About": "حول",
//     "User": "المستخدم",
//     "Meet STAi": "قابل STAi",
//     // "Good Morning": "صباح الخير",
//     // "Good evening": "مساء الخير",
//     "Add Reading": "إضافة قراءة"
//     // Just keep adding words here as you find them!
// };

// document.addEventListener('DOMContentLoaded', () => {
//     // Get saved language or default to English
//     const currentLang = localStorage.getItem('app_lang') || 'en';
    
//     // 2. Hook up the dropdown in general.html
//     const langSelect = document.querySelector('select[name="language"]');
//     if (langSelect) {
//         langSelect.value = currentLang;
//         langSelect.addEventListener('change', (e) => {
//             localStorage.setItem('app_lang', e.target.value);
//             // When language changes, reload the page to apply it everywhere
//             window.location.reload(); 
//         });
//     }

//     // 3. Apply the Arabic Translation if selected
//     if (currentLang === 'ar') {
//         // Tell the browser this is an Arabic page (Flips layout automatically)
//         // document.documentElement.dir = 'rtl';
//         document.documentElement.lang = 'ar';
        
//         // Smart Text Replacement (Scans the page and replaces words without breaking icons/HTML)
//         const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
//         let node;
//         while (node = walk.nextNode()) {
//             const text = node.nodeValue.trim();
//             // Check if exact match exists in our dictionary above
//             if (arDictionary[text]) {
//                 node.nodeValue = node.nodeValue.replace(text, arDictionary[text]);
//             }
//         }
//     }
// });