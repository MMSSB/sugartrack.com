/* accent.js - Global Accent Color Manager
 * Include this in <head> AFTER main.js
 */

(function() {
    // --- 1. CONFIGURATION: Add your elements here ---
    // Copy classes from your old file and add them to these lists.
    const config = {
        // Elements that should have their BACKGROUND color changed
        backgrounds: [
            '.logo-box',                // The "ST" Logo box
            '.btn-primary',             // Main buttons
            '.btn-save',                // Save button in settings
            '.add-reading-btn',         // Dashboard "Add Reading"
            // '.icon-box',                // Settings icons
            '.section-icon',            // Settings section icons
            '.profile-banner',            // Settings section icons
            'input:checked + .slider',  // Toggle switches
            '.nav-link.active::before', // Sidebar active strip
            // '.user-trigger:hover',      // User menu hover
            '.badge',                   // Any badges
            '.save-bar #saveBtn',        // Floating save button
            '.stai-promo-card'        
        ],

        // Elements that should have their TEXT color changed
        texts: [
            '.nav-link.active i',       // Active sidebar icon
            '.nav-link.active span',    // Active sidebar text
            '.link',                    // Text links
            // '.btn-outline',             // Outline buttons text
            '.unit-opt input:checked + .opt-label' // Selected radio text
        ],

        // Elements that should have their BORDER color changed
        borders: [
            '.btn-primary',
            '.btn-save',
            '.add-reading-btn',
            'input:checked + .slider',
            '.unit-opt input:checked + .opt-label'
        ]
    };

    // --- 2. LOGIC: Do not edit below unless you know JS ---
    
    // Helper to calculate hover color (slightly darker/lighter)
    function adjustBrightness(col, amt) {
        let usePound = false;
        if (col[0] === "#") { col = col.slice(1); usePound = true; }
        let num = parseInt(col, 16);
        let r = (num >> 16) + amt;
        if (r > 255) r = 255; else if (r < 0) r = 0;
        let b = ((num >> 8) & 0x00FF) + amt;
        if (b > 255) b = 255; else if (b < 0) b = 0;
        let g = (num & 0x0000FF) + amt;
        if (g > 255) g = 255; else if (g < 0) g = 0;
        return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
    }

    // Main Apply Function
    window.applyAccent = function(color) {
        if(!color) return;
        
        // Save to storage
        localStorage.setItem('accent_color', color);

        // 1. Update CSS Variables (for general use)
        document.documentElement.style.setProperty('--info', color);
        
        // 2. Generate Custom CSS
        let css = '';
        const hoverColor = adjustBrightness(color, -20); // Darker for hover

        // Backgrounds
        if(config.backgrounds.length) {
            css += `${config.backgrounds.join(', ')} { background-color: ${color} !important; }\n`;
            // Add simplified hover for buttons
            css += `${config.backgrounds.map(s => s + ':hover').join(', ')} { background-color: ${hoverColor} !important; }\n`;
        }

        // Texts
        if(config.texts.length) {
            css += `${config.texts.join(', ')} { color: ${color} !important; }\n`;
        }

        // Borders
        if(config.borders.length) {
            css += `${config.borders.join(', ')} { border-color: ${color} !important; }\n`;
        }

        // 3. Inject Style Tag
        let styleTag = document.getElementById('accent-custom-style');
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'accent-custom-style';
            document.head.appendChild(styleTag);
        }
        styleTag.innerHTML = css;
    };

    // --- 3. INIT: Load saved color immediately ---
    const saved = localStorage.getItem('accent_color') || '#3b82f6';
    window.applyAccent(saved);

})();