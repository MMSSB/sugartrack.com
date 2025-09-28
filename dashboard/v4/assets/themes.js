// themes.js - Complete theme management system
class ThemeManager {
    constructor() {
        this.themes = {
            // System themes
            'system-light': { name: 'System Light', type: 'system', base: 'light' },
            'system-dark': { name: 'System Dark', type: 'system', base: 'dark' },
            
            // Blue themes
            'blue-light': { 
                name: 'Blue Light', 
                type: 'light',
                colors: {
                    primary: '#1e40af',
                    primary-light: '#3b82f6',
                    secondary: '#60a5fa',
                    text: '#1e3a8a',
                    text-light: '#3b82f6',
                    text-muted: '#6b7280',
                    background: '#dbeafe',
                    background-alt: '#eff6ff',
                    card-bg: '#ffffff',
                    card-bg-message: '#f3f4f6',
                    card-bg-read: 'rgba(192, 192, 192, 0.822)',
                    border: '#bfdbfe',
                    actives: '#008cff69',
                    actives-light: '#77c2ff69',
                    danger: '#dc2626',
                    success: '#059669',
                    warning: '#d97706',
                    info: '#0ea5e9'
                }
            },
            'blue-dark': { 
                name: 'Blue Dark', 
                type: 'dark',
                colors: {
                    primary: '#60a5fa',
                    primary-light: '#93c5fd',
                    secondary: '#3b82f6',
                    text: '#f0f9ff',
                    text-light: '#bfdbfe',
                    text-muted: '#9ca3af',
                    background: '#0f172a',
                    background-alt: '#1e293b',
                    card-bg: '#1e293b',
                    card-bg-message: '#334155',
                    card-bg-read: 'rgba(51, 65, 85, 0.822)',
                    border: '#334155',
                    actives: '#3b82f669',
                    actives-light: '#60a5fa69',
                    danger: '#f87171',
                    success: '#34d399',
                    warning: '#fbbf24',
                    info: '#38bdf8'
                }
            },
            
            // Green themes
            'green-light': { 
                name: 'Green Light', 
                type: 'light',
                colors: {
                    primary: '#059669',
                    primary-light: '#10b981',
                    secondary: '#34d399',
                    text: '#065f46',
                    text-light: '#059669',
                    text-muted: '#6b7280',
                    background: '#d1fae5',
                    background-alt: '#ecfdf5',
                    card-bg: '#ffffff',
                    card-bg-message: '#f3f4f6',
                    card-bg-read: 'rgba(192, 192, 192, 0.822)',
                    border: '#a7f3d0',
                    actives: '#10b98169',
                    actives-light: '#34d39969',
                    danger: '#dc2626',
                    success: '#059669',
                    warning: '#d97706',
                    info: '#0ea5e9'
                }
            },
            'green-dark': { 
                name: 'Green Dark', 
                type: 'dark',
                colors: {
                    primary: '#10b981',
                    primary-light: '#34d399',
                    secondary: '#059669',
                    text: '#f0fdf4',
                    text-light: '#bbf7d0',
                    text-muted: '#9ca3af',
                    background: '#052e16',
                    background-alt: '#14532d',
                    card-bg: '#14532d',
                    card-bg-message: '#166534',
                    card-bg-read: 'rgba(22, 101, 52, 0.822)',
                    border: '#166534',
                    actives: '#10b98169',
                    actives-light: '#34d39969',
                    danger: '#f87171',
                    success: '#34d399',
                    warning: '#fbbf24',
                    info: '#38bdf8'
                }
            },
            
            // Purple themes
            'purple-light': { 
                name: 'Purple Light', 
                type: 'light',
                colors: {
                    primary: '#7c3aed',
                    primary-light: '#8b5cf6',
                    secondary: '#a78bfa',
                    text: '#5b21b6',
                    text-light: '#7c3aed',
                    text-muted: '#6b7280',
                    background: '#f3e8ff',
                    background-alt: '#faf5ff',
                    card-bg: '#ffffff',
                    card-bg-message: '#f3f4f6',
                    card-bg-read: 'rgba(192, 192, 192, 0.822)',
                    border: '#ddd6fe',
                    actives: '#8b5cf669',
                    actives-light: '#a78bfa69',
                    danger: '#dc2626',
                    success: '#059669',
                    warning: '#d97706',
                    info: '#0ea5e9'
                }
            },
            'purple-dark': { 
                name: 'Purple Dark', 
                type: 'dark',
                colors: {
                    primary: '#8b5cf6',
                    primary-light: '#a78bfa',
                    secondary: '#7c3aed',
                    text: '#faf5ff',
                    text-light: '#ddd6fe',
                    text-muted: '#9ca3af',
                    background: '#1e1b4b',
                    background-alt: '#2e1e5b',
                    card-bg: '#2e1e5b',
                    card-bg-message: '#3b1e6b',
                    card-bg-read: 'rgba(59, 30, 107, 0.822)',
                    border: '#3b1e6b',
                    actives: '#8b5cf669',
                    actives-light: '#a78bfa69',
                    danger: '#f87171',
                    success: '#34d399',
                    warning: '#fbbf24',
                    info: '#38bdf8'
                }
            },
            
            // Orange themes
            'orange-light': { 
                name: 'Orange Light', 
                type: 'light',
                colors: {
                    primary: '#ea580c',
                    primary-light: '#f97316',
                    secondary: '#fdba74',
                    text: '#9a3412',
                    text-light: '#ea580c',
                    text-muted: '#6b7280',
                    background: '#ffedd5',
                    background-alt: '#fff7ed',
                    card-bg: '#ffffff',
                    card-bg-message: '#f3f4f6',
                    card-bg-read: 'rgba(192, 192, 192, 0.822)',
                    border: '#fdba74',
                    actives: '#f9731669',
                    actives-light: '#fdba7469',
                    danger: '#dc2626',
                    success: '#059669',
                    warning: '#ea580c',
                    info: '#0ea5e9'
                }
            },
            'orange-dark': { 
                name: 'Orange Dark', 
                type: 'dark',
                colors: {
                    primary: '#f97316',
                    primary-light: '#fdba74',
                    secondary: '#ea580c',
                    text: '#fff7ed',
                    text-light: '#fed7aa',
                    text-muted: '#9ca3af',
                    background: '#431407',
                    background-alt: '#7c2d12',
                    card-bg: '#7c2d12',
                    card-bg-message: '#9a3412',
                    card-bg-read: 'rgba(154, 52, 18, 0.822)',
                    border: '#9a3412',
                    actives: '#f9731669',
                    actives-light: '#fdba7469',
                    danger: '#f87171',
                    success: '#34d399',
                    warning: '#fbbf24',
                    info: '#38bdf8'
                }
            },
            
            // Pink themes
            'pink-light': { 
                name: 'Pink Light', 
                type: 'light',
                colors: {
                    primary: '#db2777',
                    primary-light: '#ec4899',
                    secondary: '#f9a8d4',
                    text: '#be185d',
                    text-light: '#db2777',
                    text-muted: '#6b7280',
                    background: '#fce7f3',
                    background-alt: '#fdf2f8',
                    card-bg: '#ffffff',
                    card-bg-message: '#f3f4f6',
                    card-bg-read: 'rgba(192, 192, 192, 0.822)',
                    border: '#fbcfe8',
                    actives: '#ec489969',
                    actives-light: '#f9a8d469',
                    danger: '#dc2626',
                    success: '#059669',
                    warning: '#d97706',
                    info: '#0ea5e9'
                }
            },
            'pink-dark': { 
                name: 'Pink Dark', 
                type: 'dark',
                colors: {
                    primary: '#ec4899',
                    primary-light: '#f9a8d4',
                    secondary: '#db2777',
                    text: '#fdf2f8',
                    text-light: '#fbcfe8',
                    text-muted: '#9ca3af',
                    background: '#500724',
                    background-alt: '#831843',
                    card-bg: '#831843',
                    card-bg-message: '#9d174d',
                    card-bg-read: 'rgba(157, 23, 77, 0.822)',
                    border: '#9d174d',
                    actives: '#ec489969',
                    actives-light: '#f9a8d469',
                    danger: '#f87171',
                    success: '#34d399',
                    warning: '#fbbf24',
                    info: '#38bdf8'
                }
            },
            
            // Red themes
            'red-light': { 
                name: 'Red Light', 
                type: 'light',
                colors: {
                    primary: '#dc2626',
                    primary-light: '#ef4444',
                    secondary: '#f87171',
                    text: '#7f1d1d',
                    text-light: '#dc2626',
                    text-muted: '#6b7280',
                    background: '#fef2f2',
                    background-alt: '#fef2f2',
                    card-bg: '#ffffff',
                    card-bg-message: '#f3f4f6',
                    card-bg-read: 'rgba(192, 192, 192, 0.822)',
                    border: '#fecaca',
                    actives: '#ef444469',
                    actives-light: '#f8717169',
                    danger: '#dc2626',
                    success: '#059669',
                    warning: '#d97706',
                    info: '#0ea5e9'
                }
            },
            'red-dark': { 
                name: 'Red Dark', 
                type: 'dark',
                colors: {
                    primary: '#ef4444',
                    primary-light: '#f87171',
                    secondary: '#dc2626',
                    text: '#fef2f2',
                    text-light: '#fecaca',
                    text-muted: '#9ca3af',
                    background: '#450a0a',
                    background-alt: '#7f1d1d',
                    card-bg: '#7f1d1d',
                    card-bg-message: '#991b1b',
                    card-bg-read: 'rgba(153, 27, 27, 0.822)',
                    border: '#991b1b',
                    actives: '#ef444469',
                    actives-light: '#f8717169',
                    danger: '#f87171',
                    success: '#34d399',
                    warning: '#fbbf24',
                    info: '#38bdf8'
                }
            },
            
            // Teal themes
            'teal-light': { 
                name: 'Teal Light', 
                type: 'light',
                colors: {
                    primary: '#0d9488',
                    primary-light: '#14b8a6',
                    secondary: '#2dd4bf',
                    text: '#134e4a',
                    text-light: '#0d9488',
                    text-muted: '#6b7280',
                    background: '#ccfbf1',
                    background-alt: '#f0fdfa',
                    card-bg: '#ffffff',
                    card-bg-message: '#f3f4f6',
                    card-bg-read: 'rgba(192, 192, 192, 0.822)',
                    border: '#99f6e4',
                    actives: '#14b8a669',
                    actives-light: '#2dd4bf69',
                    danger: '#dc2626',
                    success: '#059669',
                    warning: '#d97706',
                    info: '#0ea5e9'
                }
            },
            'teal-dark': { 
                name: 'Teal Dark', 
                type: 'dark',
                colors: {
                    primary: '#14b8a6',
                    primary-light: '#2dd4bf',
                    secondary: '#0d9488',
                    text: '#f0fdfa',
                    text-light: '#ccfbf1',
                    text-muted: '#9ca3af',
                    background: '#042f2e',
                    background-alt: '#134e4a',
                    card-bg: '#134e4a',
                    card-bg-message: '#0f766e',
                    card-bg-read: 'rgba(15, 118, 110, 0.822)',
                    border: '#0f766e',
                    actives: '#14b8a669',
                    actives-light: '#2dd4bf69',
                    danger: '#f87171',
                    success: '#34d399',
                    warning: '#fbbf24',
                    info: '#38bdf8'
                }
            }
        };
        
        this.currentTheme = 'system-light';
        this.init();
    }
    
    init() {
        this.loadTheme();
        this.renderThemeOptions();
        this.setupEventListeners();
        this.setupSystemThemeListener();
    }
    
    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'system-light';
        this.applyTheme(savedTheme);
        
        // Update theme select
        const themeSelect = document.getElementById('themeSelect');
        if (themeSelect) {
            themeSelect.value = savedTheme;
        }
    }
    
    applyTheme(themeKey) {
        const body = document.body;
        this.currentTheme = themeKey;
        
        // Remove all theme classes
        body.classList.remove('light-theme', 'dark-theme');
        body.removeAttribute('data-theme');
        
        // Handle system themes
        if (themeKey.startsWith('system-')) {
            const base = themeKey.split('-')[1];
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            
            if (base === 'light') {
                body.classList.add('light-theme');
                this.applyColorVariables(this.getDefaultLightColors());
            } else if (base === 'dark') {
                body.classList.add('dark-theme');
                this.applyColorVariables(this.getDefaultDarkColors());
            }
            
            // Apply system preference for contrast
            if (prefersDark && base === 'light') {
                body.classList.add('dark-theme');
            } else if (!prefersDark && base === 'dark') {
                body.classList.add('light-theme');
            }
        } else {
            // Apply specific theme
            const theme = this.themes[themeKey];
            if (theme) {
                body.setAttribute('data-theme', themeKey);
                body.classList.add(theme.type === 'dark' ? 'dark-theme' : 'light-theme');
                this.applyColorVariables(theme.colors);
            }
        }
        
        // Update active theme in options
        this.updateActiveThemeOption(themeKey);
        
        // Save to localStorage
        localStorage.setItem('theme', themeKey);
        
        // Dispatch theme change event
        window.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { theme: themeKey, themeData: this.themes[themeKey] }
        }));
    }
    
    applyColorVariables(colors) {
        const root = document.documentElement;
        
        if (!colors) {
            // Reset to default CSS variables
            Object.keys(this.getDefaultLightColors()).forEach(key => {
                root.style.setProperty(`--${key}`, '');
            });
            return;
        }
        
        // Apply all color variables
        Object.keys(colors).forEach(key => {
            root.style.setProperty(`--${key}`, colors[key]);
        });
    }
    
    getDefaultLightColors() {
        return {
            'primary': '#3b82f6',
            'primary-light': '#60a5fa',
            'text': '#1f2937',
            'text-light': '#6b7280',
            'background': '#f3f4f6',
            'card-bg': '#ffffff',
            'border': '#e5e7eb',
            'danger': '#ef4444',
            'success': '#10b981',
            'warning': '#f59e0b'
        };
    }
    
    getDefaultDarkColors() {
        return {
            'primary': '#3b82f6',
            'primary-light': '#60a5fa',
            'text': '#f3f4f6',
            'text-light': '#9ca3af',
            'background': '#111827',
            'card-bg': '#1f2937',
            'border': '#374151',
            'danger': '#ef4444',
            'success': '#10b981',
            'warning': '#f59e0b'
        };
    }
    
    renderThemeOptions() {
        const themeOptionsContainer = document.getElementById('themeOptions');
        if (!themeOptionsContainer) return;
        
        themeOptionsContainer.innerHTML = '';
        
        // Group themes by color family
        const themeGroups = this.groupThemesByColor();
        
        Object.keys(themeGroups).forEach(colorFamily => {
            const group = themeGroups[colorFamily];
            const groupElement = document.createElement('div');
            groupElement.className = 'theme-group';
            
            const groupTitle = document.createElement('h4');
            groupTitle.className = 'theme-group-title';
            groupTitle.textContent = this.formatColorFamilyName(colorFamily);
            groupElement.appendChild(groupTitle);
            
            const groupOptions = document.createElement('div');
            groupOptions.className = 'theme-group-options';
            
            group.forEach(themeKey => {
                const theme = this.themes[themeKey];
                const themeOption = this.createThemeOption(themeKey, theme);
                groupOptions.appendChild(themeOption);
            });
            
            groupElement.appendChild(groupOptions);
            themeOptionsContainer.appendChild(groupElement);
        });
        
        // Set initial active theme
        this.updateActiveThemeOption(this.currentTheme);
    }
    
    groupThemesByColor() {
        const groups = {};
        
        Object.keys(this.themes).forEach(themeKey => {
            if (themeKey.startsWith('system-')) {
                if (!groups.system) groups.system = [];
                groups.system.push(themeKey);
            } else {
                const colorFamily = themeKey.split('-')[0];
                if (!groups[colorFamily]) groups[colorFamily] = [];
                groups[colorFamily].push(themeKey);
            }
        });
        
        return groups;
    }
    
    formatColorFamilyName(family) {
        if (family === 'system') return 'System Themes';
        return family.charAt(0).toUpperCase() + family.slice(1) + ' Themes';
    }
    
    createThemeOption(themeKey, theme) {
        const themeOption = document.createElement('div');
        themeOption.className = 'theme-option';
        themeOption.dataset.theme = themeKey;
        themeOption.title = theme.name;
        
        const isDark = theme.type === 'dark';
        
        themeOption.innerHTML = `
            <div class="theme-preview ${isDark ? 'dark' : 'light'}">
                <div class="theme-preview-primary" style="background-color: ${theme.colors?.primary || '#3b82f6'}"></div>
                <div class="theme-preview-bg" style="background-color: ${theme.colors?.background || '#f3f4f6'}"></div>
                <div class="theme-preview-card" style="background-color: ${theme.colors?.['card-bg'] || '#ffffff'}"></div>
                <div class="theme-preview-accent" style="background-color: ${theme.colors?.success || '#10b981'}"></div>
            </div>
            <div class="theme-info">
                <span class="theme-name">${theme.name}</span>
                <span class="theme-type">${isDark ? 'Dark' : 'Light'}</span>
            </div>
        `;
        
        return themeOption;
    }
    
    updateActiveThemeOption(themeKey) {
        // Remove active class from all options
        document.querySelectorAll('.theme-option').forEach(option => {
            option.classList.remove('active');
        });
        
        // Add active class to current theme
        const activeOption = document.querySelector(`.theme-option[data-theme="${themeKey}"]`);
        if (activeOption) {
            activeOption.classList.add('active');
        }
        
        // Update select dropdown
        const themeSelect = document.getElementById('themeSelect');
        if (themeSelect) {
            themeSelect.value = themeKey;
        }
    }
    
    setupEventListeners() {
        // Theme select dropdown
        const themeSelect = document.getElementById('themeSelect');
        if (themeSelect) {
            themeSelect.addEventListener('change', (e) => {
                this.applyTheme(e.target.value);
            });
        }
        
        // Theme option clicks
        document.addEventListener('click', (e) => {
            const themeOption = e.target.closest('.theme-option');
            if (themeOption) {
                const themeName = themeOption.dataset.theme;
                this.applyTheme(themeName);
            }
        });
    }
    
    setupSystemThemeListener() {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (this.currentTheme.startsWith('system-')) {
                this.applyTheme(this.currentTheme);
            }
        });
    }
    
    // Public methods
    getCurrentTheme() {
        return this.currentTheme;
    }
    
    getThemeData(themeKey = null) {
        return this.themes[themeKey || this.currentTheme];
    }
    
    addTheme(themeKey, themeData) {
        this.themes[themeKey] = themeData;
        this.renderThemeOptions();
    }
    
    // Quick theme switching
    toggleDarkMode() {
        if (this.currentTheme.endsWith('-light')) {
            const darkTheme = this.currentTheme.replace('-light', '-dark');
            if (this.themes[darkTheme]) {
                this.applyTheme(darkTheme);
            }
        } else if (this.currentTheme.endsWith('-dark')) {
            const lightTheme = this.currentTheme.replace('-dark', '-light');
            if (this.themes[lightTheme]) {
                this.applyTheme(lightTheme);
            }
        }
    }
}

// Initialize theme manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
    
    // Add global theme toggle shortcut (Ctrl+Shift+T)
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'T') {
            e.preventDefault();
            window.themeManager.toggleDarkMode();
        }
    });
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManager;
}