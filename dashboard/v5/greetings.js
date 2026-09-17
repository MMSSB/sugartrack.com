// // greetings.js

// export function getSmartGreeting(name) {
//     const firstName = name || "User";
    
//     // Check settings (Defaults to true and 'time' if user hasn't set them yet)
//     const isEnabled = localStorage.getItem('smart_greeting_enabled') !== 'false'; 
//     const style = localStorage.getItem('smart_greeting_style') || 'time';

//     // If disabled, just show the standard Hello
//     if (!isEnabled) {
//         return `Hello, ${firstName} 👋`;
//     }

//     // Option 1: Time of Day
//     if (style === 'time') {
//         const hour = new Date().getHours();
//         if (hour < 12) return `Good morning, ${firstName} 🌅`;
//         if (hour < 17) return `Good afternoon, ${firstName} ☀️`;
//         return `Good evening, ${firstName} 🌙`;
//     } 
//     // Option 2: Friendly Random Greetings
//     else {
//         const quotes = [
//             `Happy to see you, ${firstName} ✨`,
//             `Welcome back, ${firstName} 🙌`,
//             `Ready to track, ${firstName}? 🎯`,
//             `Looking good, ${firstName} 🚀`,
//             `Great to have you here, ${firstName} 🌟`
//         ];
//         // Pick a random friendly quote
//         const randomIndex = Math.floor(Math.random() * quotes.length);
//         return quotes[randomIndex];
//     }
// }














// greetings.js

export function getSmartGreeting(name, dobString) {
    const firstName = name || "User";

    // 1. Birthday Check (Highest Priority - Always celebrate!)
    if (dobString) {
        const today = new Date();
        // HTML Date inputs save as "YYYY-MM-DD"
        const [year, month, day] = dobString.split('-');
        
        if (parseInt(month) === today.getMonth() + 1 && parseInt(day) === today.getDate()) {
            return `Happy Birthday, ${firstName}! 🎂🎉`;
        }
    }
    
    // 2. Check Settings (Defaults to true and 'time')
    const isEnabled = localStorage.getItem('smart_greeting_enabled') !== 'false'; 
    const style = localStorage.getItem('smart_greeting_style') || 'time';

    // 3. If Disabled, return standard greeting
    if (!isEnabled) {
        return `Hello, ${firstName} 👋`;
    }

    // 4. Option 1: Time of Day
    if (style === 'time') {
        const hour = new Date().getHours();
        if (hour < 12) return `Good morning, ${firstName} 🌅`;
        if (hour < 17) return `Good afternoon, ${firstName} ☀️`;
        return `Good evening, ${firstName} 🌙`;
    } 
    // 5. Option 2: Friendly Random
    else {
        const quotes = [
            `Happy to see you, ${firstName} ✨`,
            `Welcome back, ${firstName} 🙌`,
            `Ready to track, ${firstName}? 🎯`,
            `Looking good, ${firstName} 🚀`,
            `Great to have you here, ${firstName} 🌟`
        ];
        const randomIndex = Math.floor(Math.random() * quotes.length);
        return quotes[randomIndex];
    }
}