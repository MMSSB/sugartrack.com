// /* settings.js
//  * Handles Settings Page Logic: Loading, Saving, and UI Feedback
//  */

// document.addEventListener('DOMContentLoaded', () => {

//     // --- DOM ELEMENTS ---
//     const form = document.getElementById('settingsForm');
//     const saveBar = document.getElementById('saveBar');
//     const saveBtn = document.getElementById('saveBtn');
//     const discardBtn = document.getElementById('discardBtn');

//     // --- 1. CONFIGURATION: DEFAULTS ---
//     // We define default values in case LocalStorage is empty
//     const defaults = {
//         theme: 'system',
//         units: 'mg',
//         targetMin: 70,
//         targetMax: 180,
//         alertHigh: true,
//         alertLow: true,
//         reminderLog: false
//     };

//     // --- 2. LOAD SETTINGS (Initial State) ---
//     function loadSettings() {
//         // A. Load Theme
//         const currentTheme = localStorage.getItem('theme') || defaults.theme;
//         const themeRadio = form.querySelector(`input[name="theme"][value="${currentTheme}"]`);
//         if (themeRadio) themeRadio.checked = true;

//         // B. Load Units
//         const currentUnit = localStorage.getItem('settings_units') || defaults.units;
//         const unitRadio = form.querySelector(`input[name="units"][value="${currentUnit}"]`);
//         if (unitRadio) unitRadio.checked = true;

//         // C. Load Ranges
//         form.querySelector('input[name="targetMin"]').value = localStorage.getItem('settings_targetMin') || defaults.targetMin;
//         form.querySelector('input[name="targetMax"]').value = localStorage.getItem('settings_targetMax') || defaults.targetMax;

//         // D. Load Toggles (Checkboxes)
//         // Helper to get boolean from string or default
//         const getBool = (key, def) => {
//             const val = localStorage.getItem(key);
//             return val === null ? def : val === 'true';
//         };

//         form.querySelector('input[name="alertHigh"]').checked = getBool('settings_alertHigh', defaults.alertHigh);
//         form.querySelector('input[name="alertLow"]').checked = getBool('settings_alertLow', defaults.alertLow);
//         form.querySelector('input[name="reminderLog"]').checked = getBool('settings_reminderLog', defaults.reminderLog);
//     }

//     // Initialize Page
//     loadSettings();


//     // --- 3. CHANGE DETECTION ---
//     function markDirty() {
//         saveBar.classList.add('visible');
//     }

//     // Attach listeners to all inputs
//     const inputs = form.querySelectorAll('input, select, textarea');
//     inputs.forEach(input => {
        
//         // General Change Listener
//         input.addEventListener('change', (e) => {
//             markDirty();

//             // SPECIAL CASE: Instant Theme Preview
//             // If user clicks a theme radio, apply it immediately to see how it looks
//             if (e.target.name === 'theme') {
//                 if (window.setTheme) window.setTheme(e.target.value);
//             }
//         });

//         // For text/number inputs, detect typing too
//         input.addEventListener('input', markDirty);
//     });


//     // --- 4. SAVE LOGIC ---
//     saveBtn.addEventListener('click', () => {
//         // A. Save values to LocalStorage
        
//         // Theme
//         const selectedTheme = form.querySelector('input[name="theme"]:checked').value;
//         localStorage.setItem('theme', selectedTheme); // Main theme key

//         // Units
//         const selectedUnit = form.querySelector('input[name="units"]:checked').value;
//         localStorage.setItem('settings_units', selectedUnit);

//         // Ranges
//         localStorage.setItem('settings_targetMin', form.querySelector('input[name="targetMin"]').value);
//         localStorage.setItem('settings_targetMax', form.querySelector('input[name="targetMax"]').value);

//         // Toggles
//         localStorage.setItem('settings_alertHigh', form.querySelector('input[name="alertHigh"]').checked);
//         localStorage.setItem('settings_alertLow', form.querySelector('input[name="alertLow"]').checked);
//         localStorage.setItem('settings_reminderLog', form.querySelector('input[name="reminderLog"]').checked);


//         // B. UI Feedback (Animation)
//         const originalText = saveBtn.textContent;
//         saveBtn.textContent = "Saving...";
//         saveBtn.style.pointerEvents = "none"; // Prevent double click

//         setTimeout(() => {
//             // Success State
//             saveBtn.textContent = "Saved!";
//             saveBtn.style.backgroundColor = "#10b981"; // Success Green
//             saveBtn.style.borderColor = "#10b981";
//             saveBtn.style.color = "white";

//             // Hide Bar after delay
//             setTimeout(() => {
//                 saveBar.classList.remove('visible');
                
//                 // Reset Button style for next time
//                 setTimeout(() => {
//                     saveBtn.textContent = originalText;
//                     saveBtn.style.backgroundColor = "";
//                     saveBtn.style.borderColor = "";
//                     saveBtn.style.color = "";
//                     saveBtn.style.pointerEvents = "auto";
//                 }, 300);
//             }, 800);
//         }, 600);
//     });


//     // --- 5. DISCARD LOGIC ---
//     discardBtn.addEventListener('click', () => {
//         // A. Hide Bar
//         saveBar.classList.remove('visible');
        
//         // B. Revert Form to last saved state
//         loadSettings();

//         // C. Revert Theme (Important!)
//         // If user previewed "Dark" but clicked discard, we must go back to what was saved.
//         const storedTheme = localStorage.getItem('theme') || 'system';
//         if (window.setTheme) window.setTheme(storedTheme);
//     });

// });





/* settings.js - Universal Settings Handler */

document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('settingsForm');
    const saveBar = document.getElementById('saveBar');
    const saveBtn = document.getElementById('saveBtn');
    const discardBtn = document.getElementById('discardBtn');

    if(!form) return; // Exit if not on a settings page

    // --- DEFAULTS ---
    const defaults = {
        theme: 'system',
        accentColor: '#3b82f6',
        units: 'mg',
        targetMin: 70,
        targetMax: 180,
        alertHigh: true,
        alertLow: true
    };

    // --- 1. LOAD SETTINGS ---
    function loadSettings() {
        // Theme (Appearance)
        const currentTheme = localStorage.getItem('theme') || defaults.theme;
        const themeRadio = form.querySelector(`input[name="theme"][value="${currentTheme}"]`);
        if (themeRadio) themeRadio.checked = true;

        // Accent Color (Appearance)
        const currentAccent = localStorage.getItem('accent_color') || defaults.accentColor;
        const accentRadio = form.querySelector(`input[name="accentColor"][value="${currentAccent}"]`);
        if (accentRadio) accentRadio.checked = true;

        // Units (General)
        const currentUnit = localStorage.getItem('settings_units') || defaults.units;
        const unitRadio = form.querySelector(`input[name="units"][value="${currentUnit}"]`);
        if (unitRadio) unitRadio.checked = true;

        // Ranges (General)
        const tMin = form.querySelector('input[name="targetMin"]');
        const tMax = form.querySelector('input[name="targetMax"]');
        if(tMin) tMin.value = localStorage.getItem('settings_targetMin') || defaults.targetMin;
        if(tMax) tMax.value = localStorage.getItem('settings_targetMax') || defaults.targetMax;

        // Toggles (General)
        const alertH = form.querySelector('input[name="alertHigh"]');
        const alertL = form.querySelector('input[name="alertLow"]');
        if(alertH) alertH.checked = localStorage.getItem('settings_alertHigh') === 'true';
        if(alertL) alertL.checked = localStorage.getItem('settings_alertLow') === 'true';
    }

    loadSettings();

    // --- 2. DETECT CHANGES ---
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        // Show bar on any change
        input.addEventListener('change', () => saveBar.classList.add('visible'));
        input.addEventListener('input', () => saveBar.classList.add('visible'));
    });

    // --- 3. SAVE LOGIC ---
    saveBtn.addEventListener('click', () => {
        
        // A. Theme Logic
        const themeInput = form.querySelector('input[name="theme"]:checked');
        if(themeInput && window.setTheme) {
            window.setTheme(themeInput.value);
        }

        // B. Accent Color Logic
        const accentInput = form.querySelector('input[name="accentColor"]:checked');
        if(accentInput) {
            localStorage.setItem('accent_color', accentInput.value);
            // Apply it immediately (Example logic, requires CSS variable support)
            // If your CSS uses --info or similar for main buttons:
            document.documentElement.style.setProperty('--info', accentInput.value);
            document.documentElement.style.setProperty('--text-primary', accentInput.value); 
            // Note: Adjust the property above based on your exact style.css needs
        }

        // C. General Settings
        const unitInput = form.querySelector('input[name="units"]:checked');
        if(unitInput) localStorage.setItem('settings_units', unitInput.value);

        const tMin = form.querySelector('input[name="targetMin"]');
        const tMax = form.querySelector('input[name="targetMax"]');
        if(tMin) localStorage.setItem('settings_targetMin', tMin.value);
        if(tMax) localStorage.setItem('settings_targetMax', tMax.value);

        const alertH = form.querySelector('input[name="alertHigh"]');
        if(alertH) localStorage.setItem('settings_alertHigh', alertH.checked);
        const alertL = form.querySelector('input[name="alertLow"]');
        if(alertL) localStorage.setItem('settings_alertLow', alertL.checked);

        // D. Feedback
        const originalText = saveBtn.textContent;
        saveBtn.textContent = "Saved!";
        saveBtn.style.backgroundColor = "#10b981"; // Green
        
        setTimeout(() => {
            saveBar.classList.remove('visible'); // Hide
            setTimeout(() => {
                saveBtn.textContent = originalText;
                saveBtn.style.backgroundColor = ""; // Reset
            }, 300);
        }, 800);
    });

    // --- 4. DISCARD LOGIC ---
    discardBtn.addEventListener('click', () => {
        saveBar.classList.remove('visible'); // Hide
        loadSettings(); // Reset form to saved state
        
        // Revert any simulated preview if you added one (currently none)
    });
});


// /* settings.js - Universal Settings Handler */

// document.addEventListener('DOMContentLoaded', () => {

//     const form = document.getElementById('settingsForm');
//     const saveBar = document.getElementById('saveBar');
//     const saveBtn = document.getElementById('saveBtn');
//     const discardBtn = document.getElementById('discardBtn');

//     if(!form) return; // Exit if not on a settings page

//     // --- DEFAULTS ---
//     const defaults = {
//         theme: 'system',
//         units: 'mg',
//         targetMin: 70,
//         targetMax: 180,
//         alertHigh: true,
//         alertLow: true
//     };

//     // --- 1. LOAD SETTINGS ---
//     function loadSettings() {
//         // Theme (Appearance Page)
//         const currentTheme = localStorage.getItem('theme') || defaults.theme;
//         const themeRadio = form.querySelector(`input[name="theme"][value="${currentTheme}"]`);
//         if (themeRadio) themeRadio.checked = true;

//         // Units (General Page)
//         const currentUnit = localStorage.getItem('settings_units') || defaults.units;
//         const unitRadio = form.querySelector(`input[name="units"][value="${currentUnit}"]`);
//         if (unitRadio) unitRadio.checked = true;

//         // Ranges (General Page)
//         const tMin = form.querySelector('input[name="targetMin"]');
//         const tMax = form.querySelector('input[name="targetMax"]');
//         if(tMin) tMin.value = localStorage.getItem('settings_targetMin') || defaults.targetMin;
//         if(tMax) tMax.value = localStorage.getItem('settings_targetMax') || defaults.targetMax;

//         // Toggles (General Page)
//         const alertH = form.querySelector('input[name="alertHigh"]');
//         const alertL = form.querySelector('input[name="alertLow"]');
//         if(alertH) alertH.checked = localStorage.getItem('settings_alertHigh') === 'true';
//         if(alertL) alertL.checked = localStorage.getItem('settings_alertLow') === 'true';
//     }

//     loadSettings();

//     // --- 2. DETECT CHANGES ---
//     const inputs = form.querySelectorAll('input, select');
//     inputs.forEach(input => {
//         input.addEventListener('change', () => saveBar.style.transform = "translateX(-50%) translateY(0)");
//         input.addEventListener('input', () => saveBar.style.transform = "translateX(-50%) translateY(0)");
//     });

//     // --- 3. SAVE LOGIC ---
//     saveBtn.addEventListener('click', () => {
        
//         // Save Theme (if present)
//         const themeInput = form.querySelector('input[name="theme"]:checked');
//         if(themeInput && window.setTheme) window.setTheme(themeInput.value);

//         // Save Units (if present)
//         const unitInput = form.querySelector('input[name="units"]:checked');
//         if(unitInput) localStorage.setItem('settings_units', unitInput.value);

//         // Save Ranges (if present)
//         const tMin = form.querySelector('input[name="targetMin"]');
//         const tMax = form.querySelector('input[name="targetMax"]');
//         if(tMin) localStorage.setItem('settings_targetMin', tMin.value);
//         if(tMax) localStorage.setItem('settings_targetMax', tMax.value);

//         // Save Toggles (if present)
//         const alertH = form.querySelector('input[name="alertHigh"]');
//         if(alertH) localStorage.setItem('settings_alertHigh', alertH.checked);
//         const alertL = form.querySelector('input[name="alertLow"]');
//         if(alertL) localStorage.setItem('settings_alertLow', alertL.checked);

//         // UI Feedback
//         const originalText = saveBtn.textContent;
//         saveBtn.textContent = "Saved!";
//         saveBtn.style.background = "#10b981"; // Green
        
//         setTimeout(() => {
//             saveBar.style.transform = "translateX(-50%) translateY(150%)"; // Hide
//             setTimeout(() => {
//                 saveBtn.textContent = originalText;
//                 saveBtn.style.background = ""; // Reset
//             }, 300);
//         }, 800);
//     });

//     // --- 4. DISCARD LOGIC ---
//     discardBtn.addEventListener('click', () => {
//         saveBar.style.transform = "translateX(-50%) translateY(150%)"; // Hide
//         loadSettings(); // Reset form
//     });
// });










// /* settings.js
//  * Handles Settings Page Logic: Loading, Saving, and UI Feedback
//  */

// document.addEventListener('DOMContentLoaded', () => {

//     // --- DOM ELEMENTS ---
//     const form = document.getElementById('settingsForm');
//     const saveBar = document.getElementById('saveBar');
//     const saveBtn = document.getElementById('saveBtn');
//     const discardBtn = document.getElementById('discardBtn');

//     // --- 1. CONFIGURATION: DEFAULTS ---
//     const defaults = {
//         theme: 'system',
//         units: 'mg',
//         targetMin: 70,
//         targetMax: 180,
//         alertHigh: true,
//         alertLow: true,
//         reminderLog: false
//     };

//     // --- 2. LOAD SETTINGS (Initial State) ---
//     function loadSettings() {
//         // A. Load Theme
//         const currentTheme = localStorage.getItem('theme') || defaults.theme;
//         const themeRadio = form.querySelector(`input[name="theme"][value="${currentTheme}"]`);
//         if (themeRadio) themeRadio.checked = true;

//         // B. Load Units
//         const currentUnit = localStorage.getItem('settings_units') || defaults.units;
//         const unitRadio = form.querySelector(`input[name="units"][value="${currentUnit}"]`);
//         if (unitRadio) unitRadio.checked = true;

//         // C. Load Ranges
//         const tMin = form.querySelector('input[name="targetMin"]');
//         const tMax = form.querySelector('input[name="targetMax"]');
//         if(tMin) tMin.value = localStorage.getItem('settings_targetMin') || defaults.targetMin;
//         if(tMax) tMax.value = localStorage.getItem('settings_targetMax') || defaults.targetMax;

//         // D. Load Toggles
//         const getBool = (key, def) => {
//             const val = localStorage.getItem(key);
//             return val === null ? def : val === 'true';
//         };

//         const alertH = form.querySelector('input[name="alertHigh"]');
//         const alertL = form.querySelector('input[name="alertLow"]');
//         const remind = form.querySelector('input[name="reminderLog"]');

//         if(alertH) alertH.checked = getBool('settings_alertHigh', defaults.alertHigh);
//         if(alertL) alertL.checked = getBool('settings_alertLow', defaults.alertLow);
//         if(remind) remind.checked = getBool('settings_reminderLog', defaults.reminderLog);
//     }

//     // Initialize Page
//     loadSettings();


//     // --- 3. CHANGE DETECTION ---
//     function markDirty() {
//         saveBar.classList.add('visible');
//     }

//     const inputs = form.querySelectorAll('input, select, textarea');
//     inputs.forEach(input => {
//         // Detect changes to show Save Bar
//         input.addEventListener('change', markDirty);
//         input.addEventListener('input', markDirty);
//     });


//     // --- 4. SAVE LOGIC ---
//     saveBtn.addEventListener('click', () => {
        
//         // A. Apply & Save Theme (ONLY HERE)
//         const selectedTheme = form.querySelector('input[name="theme"]:checked').value;
//         if (window.setTheme) {
//             window.setTheme(selectedTheme); // This saves to localStorage AND updates the screen
//         }

//         // B. Save Other Settings
//         const selectedUnit = form.querySelector('input[name="units"]:checked').value;
//         localStorage.setItem('settings_units', selectedUnit);

//         const tMin = form.querySelector('input[name="targetMin"]');
//         const tMax = form.querySelector('input[name="targetMax"]');
//         if(tMin) localStorage.setItem('settings_targetMin', tMin.value);
//         if(tMax) localStorage.setItem('settings_targetMax', tMax.value);

//         const alertH = form.querySelector('input[name="alertHigh"]');
//         const alertL = form.querySelector('input[name="alertLow"]');
//         const remind = form.querySelector('input[name="reminderLog"]');
        
//         if(alertH) localStorage.setItem('settings_alertHigh', alertH.checked);
//         if(alertL) localStorage.setItem('settings_alertLow', alertL.checked);
//         if(remind) localStorage.setItem('settings_reminderLog', remind.checked);


//         // C. UI Feedback (Animation)
//         const originalText = saveBtn.textContent;
//         saveBtn.textContent = "Saving...";
//         saveBtn.style.pointerEvents = "none";

//         setTimeout(() => {
//             saveBtn.textContent = "Saved!";
//             saveBtn.style.backgroundColor = "#10b981"; // Success Green
//             saveBtn.style.borderColor = "#10b981";
//             saveBtn.style.color = "white";

//             setTimeout(() => {
//                 saveBar.classList.remove('visible');
                
//                 setTimeout(() => {
//                     saveBtn.textContent = originalText;
//                     saveBtn.style.backgroundColor = "";
//                     saveBtn.style.borderColor = "";
//                     saveBtn.style.color = "";
//                     saveBtn.style.pointerEvents = "auto";
//                 }, 300);
//             }, 800);
//         }, 600);
//     });


//     // --- 5. DISCARD LOGIC ---
//     discardBtn.addEventListener('click', () => {
//         saveBar.classList.remove('visible');
//         loadSettings(); // Reverts radio buttons to what is currently saved
//     });

// });