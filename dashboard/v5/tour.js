// document.addEventListener('DOMContentLoaded', () => {
    
//     // --- DOM Elements ---
//     const dialog = document.getElementById('tourDialog');
//     const spotlight = document.getElementById('tourSpotlight');
//     const title = document.getElementById('tourTitle');
//     const text = document.getElementById('tourText');
//     const stepCurrent = document.getElementById('tourStepCurrent');
//     const stepTotal = document.getElementById('tourStepTotal');
//     const nextBtn = document.getElementById('tourNext');
//     const skipBtn = document.getElementById('tourSkip');

//     const fakeModal = document.getElementById('tourModal');
//     const viewDashboard = document.getElementById('viewDashboard');
//     const viewLogbook = document.getElementById('viewLogbook');
//     const navDash = document.getElementById('navDash');
//     const navLog = document.getElementById('navLog');
//     const pageTitle = document.getElementById('tourPageTitle');
//     const newReadingRow = document.getElementById('tourNewReading');

//     // --- The Tour Steps Engine ---
//     const steps = [
//         {
//             title: "Welcome to SugarTrack",
//             text: "Let's take a quick 30-second tour to show you exactly how to log your health data and view your records.",
//             target: null 
//         },
//         {
//             title: "Adding a Reading",
//             text: "This button is available on every screen. Whenever you check your glucose, take medication, or eat a meal, click here.",
//             target: "tourAddBtn"
//         },
//         {
//             title: "Log Your Data",
//             text: "Just type in your glucose number. SugarTrack automatically logs the exact date and time for you.",
//             target: "tourInputWrapper",
//             onEnter: () => {
//                 fakeModal.classList.add('active');
                
//                 // Simulate typing animation
//                 const input = document.getElementById('tourGlucoseInput');
//                 input.value = "";
//                 setTimeout(() => input.value = "1", 300);
//                 setTimeout(() => input.value = "11", 500);
//                 setTimeout(() => input.value = "112", 700);
//             }
//         },
//         {
//             title: "Save It",
//             text: "Once you've entered your data, hit save. It instantly syncs securely to your cloud database.",
//             target: "tourFooterWrapper"
//         },
//         {
//             title: "The Logbook",
//             text: "Your reading appears instantly in your Logbook! It is automatically color-coded so you know if you are in range.",
//             target: "tourNewReading",
//             onEnter: () => {
//                 fakeModal.classList.remove('active');
                
//                 // Switch Sidebar UI
//                 navDash.classList.remove('active');
//                 navLog.classList.add('active');
//                 pageTitle.textContent = "Logbook";
                
//                 // Hide Dashboard, Show Logbook
//                 viewDashboard.style.display = "none";
//                 viewLogbook.style.display = "block";
//                 newReadingRow.style.display = "flex";
//             }
//         },
//         {
//             title: "You're all set!",
//             text: "That's everything you need to know. Click Finish to head to your real dashboard and start tracking your health like a pro.",
//             target: null,
//             isLast: true
//         }
//     ];

//     let currentStep = 0;
//     stepTotal.textContent = steps.length;

//     // Show initial Dialog
//     setTimeout(() => { dialog.classList.add('active'); }, 200);

//     // --- Core Render & Collision Avoidance Logic ---
//     function renderStep() {
//         const step = steps[currentStep];
        
//         // Trigger onEnter logic
//         if (step.onEnter) step.onEnter();

//         // Update Text & Progress
//         title.textContent = step.title;
//         text.innerHTML = step.text;
//         stepCurrent.textContent = currentStep + 1;

//         // Update Buttons
//         if (step.isLast) {
//             nextBtn.innerHTML = "Finish Tour <i class='fa-solid fa-check'></i>";
//             skipBtn.style.display = "none";
//         } else {
//             nextBtn.innerHTML = currentStep === 0 ? "Start Tour <i class='fa-solid fa-arrow-right'></i>" : "Next <i class='fa-solid fa-arrow-right'></i>";
//             skipBtn.style.display = "flex";
//         }

//         // Handle Spotlight & Positioning
//         if (step.target) {
//             const targetEl = document.getElementById(step.target);
//             if (targetEl) {
                
//                 // Scroll target smoothly into view
//                 targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
//                 // Wait for scroll & modal animations to finish before calculating geometry
//                 setTimeout(() => {
//                     const rect = targetEl.getBoundingClientRect();
//                     const isMobile = window.innerWidth < 768;
//                     const padding = isMobile ? 4 : 10; 
                    
//                     // 1. Frame the spotlight exactly around the target
//                     spotlight.style.top = `${rect.top - padding}px`;
//                     spotlight.style.left = `${rect.left - padding}px`;
//                     spotlight.style.width = `${rect.width + padding*2}px`;
//                     spotlight.style.height = `${rect.height + padding*2}px`;
//                     spotlight.classList.add('active');
                    
//                     // 2. Measure actual Dialog Height dynamically to prevent collisions
//                     const dialogRect = dialog.getBoundingClientRect();
//                     const viewportH = window.innerHeight;
                    
//                     // Reset centering transforms
//                     dialog.style.left = '50%';
//                     dialog.style.transform = 'translateX(-50%)';

//                     // 3. Smart Collision Engine
//                     const spaceAbove = rect.top;
//                     const spaceBelow = viewportH - rect.bottom;

//                     if (isMobile) {
//                         // On Mobile: Firmly dock to extreme top or bottom to avoid blocking center screen
//                         if (spaceAbove > spaceBelow && spaceAbove > (dialogRect.height + 20)) {
//                             // Target is low, dock dialog safely at the top
//                             dialog.style.bottom = 'auto';
//                             dialog.style.top = '20px';
//                         } else {
//                             // Target is high, dock dialog safely at the bottom
//                             dialog.style.top = 'auto';
//                             dialog.style.bottom = '20px';
//                         }
//                     } else {
//                         // On Desktop: Float beautifully near the element
//                         if (spaceBelow > (dialogRect.height + 30)) {
//                             // Plenty of space below the target
//                             dialog.style.bottom = 'auto';
//                             dialog.style.top = `${rect.bottom + 20}px`;
//                         } else if (spaceAbove > (dialogRect.height + 30)) {
//                             // Plenty of space above the target
//                             dialog.style.bottom = 'auto';
//                             dialog.style.top = `${rect.top - dialogRect.height - 20}px`;
//                         } else {
//                             // Fallback if window is incredibly small: dock to edges
//                             if (spaceAbove > spaceBelow) {
//                                  dialog.style.bottom = 'auto';
//                                  dialog.style.top = '20px';
//                             } else {
//                                  dialog.style.top = 'auto';
//                                  dialog.style.bottom = '20px';
//                             }
//                         }
//                     }
//                 }, 350); // Delay matches CSS scroll/modal speeds
//             }
//         } else {
//             // No target -> Hide spotlight and center dialog gracefully
//             spotlight.classList.remove('active');
            
//             setTimeout(() => {
//                 dialog.style.bottom = 'auto';
//                 dialog.style.top = `50%`;
//                 dialog.style.left = `50%`;
//                 dialog.style.transform = `translate(-50%, -50%)`;
//             }, 100);
//         }
//     }

//     // --- Event Listeners ---
//     nextBtn.addEventListener('click', () => {
//         if (currentStep < steps.length - 1) {
//             currentStep++;
//             renderStep();
//         } else {
//             // Finish Tour
//             window.location.href = "dashboard.html";
//         }
//     });

//     skipBtn.addEventListener('click', () => {
//         window.location.href = "dashboard.html";
//     });

//     // Re-calculate spotlight position if screen rotates/resizes
//     window.addEventListener('resize', () => {
//         if (steps[currentStep].target) {
//             renderStep();
//         }
//     });

//     // Initialize
//     renderStep();
// });
































document.addEventListener('DOMContentLoaded', () => {
    
    // --- DOM Elements ---
    const dialog = document.getElementById('tourDialog');
    const spotlight = document.getElementById('tourSpotlight');
    const title = document.getElementById('tourTitle');
    const text = document.getElementById('tourText');
    const stepCurrent = document.getElementById('tourStepCurrent');
    const stepTotal = document.getElementById('tourStepTotal');
    const nextBtn = document.getElementById('tourNext');
    const skipBtn = document.getElementById('tourSkip');

    const fakeModal = document.getElementById('tourModal');
    const viewDashboard = document.getElementById('viewDashboard');
    const viewLogbook = document.getElementById('viewLogbook');
    const navDash = document.getElementById('navDash');
    const navLog = document.getElementById('navLog');
    const pageTitle = document.getElementById('tourPageTitle');
    const newReadingRow = document.getElementById('tourNewReading');

    // --- The Tour Steps Engine ---
    const steps = [
        {
            title: "Welcome to SugarTrack",
            text: "Let's take a quick 30-second tour to show you exactly how to log your health data and view your records.",
            target: null 
        },
        {
            title: "Adding a Reading",
            text: "This button is available on every screen. Whenever you check your glucose, take medication, or eat a meal, click here.",
            target: "tourAddBtn"
        },
        {
            title: "Log Your Data",
            text: "Just type in your glucose number. SugarTrack automatically logs the exact date and time for you.",
            target: "tourInputWrapper",
            onEnter: () => {
                fakeModal.classList.add('active');
                
                // Simulate typing animation
                const input = document.getElementById('tourGlucoseInput');
                input.value = "";
                setTimeout(() => input.value = "1", 300);
                setTimeout(() => input.value = "11", 500);
                setTimeout(() => input.value = "112", 700);
            }
        },
        {
            title: "Save It",
            text: "Once you've entered your data, hit save. It instantly syncs securely to your cloud database.",
            target: "tourFooterWrapper"
        },
        {
            title: "The Logbook",
            text: "Your reading appears instantly in your Logbook! It is automatically color-coded so you know if you are in range.",
            target: "tourNewReading",
            onEnter: () => {
                fakeModal.classList.remove('active');
                
                // Switch Sidebar UI
                navDash.classList.remove('active');
                navLog.classList.add('active');
                pageTitle.textContent = "Logbook";
                
                // Hide Dashboard, Show Logbook
                viewDashboard.style.display = "none";
                viewLogbook.style.display = "block";
                newReadingRow.style.display = "flex";
            }
        },
        {
            title: "You're all set!",
            text: "That's everything you need to know. Click Finish to head to your real dashboard and start tracking your health like a pro.",
            target: null,
            isLast: true
        }
    ];

    let currentStep = 0;
    stepTotal.textContent = steps.length;

    // Show initial Dialog
    setTimeout(() => { dialog.classList.add('active'); }, 200);

    // --- Core Render & Collision Avoidance Logic ---
    function renderStep() {
        const step = steps[currentStep];
        
        // Trigger onEnter logic
        if (step.onEnter) step.onEnter();

        // Update Text & Progress
        title.textContent = step.title;
        text.innerHTML = step.text;
        stepCurrent.textContent = currentStep + 1;

        // Update Buttons
        if (step.isLast) {
            nextBtn.innerHTML = "Finish Tour <i class='fa-solid fa-check'></i>";
            skipBtn.style.display = "none";
        } else {
            nextBtn.innerHTML = currentStep === 0 ? "Start Tour <i class='fa-solid fa-arrow-right'></i>" : "Next <i class='fa-solid fa-arrow-right'></i>";
            skipBtn.style.display = "flex";
        }

        // Handle Spotlight & Positioning
        if (step.target) {
            const targetEl = document.getElementById(step.target);
            if (targetEl) {
                
                // Scroll target smoothly into view
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Wait for scroll & modal animations to finish before calculating geometry
                setTimeout(() => {
                    const rect = targetEl.getBoundingClientRect();
                    const isMobile = window.innerWidth < 768;
                    const padding = isMobile ? 4 : 10; 
                    
                    // 1. Frame the spotlight exactly around the target
                    spotlight.style.top = `${rect.top - padding}px`;
                    spotlight.style.left = `${rect.left - padding}px`;
                    spotlight.style.width = `${rect.width + padding*2}px`;
                    spotlight.style.height = `${rect.height + padding*2}px`;
                    spotlight.classList.add('active');
                    
                    // 2. Measure actual Dialog Height dynamically to prevent collisions
                    const dialogRect = dialog.getBoundingClientRect();
                    const viewportH = window.innerHeight;
                    
                    // Reset centering transforms
                    dialog.style.left = '50%';
                    dialog.style.transform = 'translateX(-50%)';

                    // 3. Smart Collision Engine
                    const spaceAbove = rect.top;
                    const spaceBelow = viewportH - rect.bottom;

                    if (isMobile) {
                        // On Mobile: Firmly dock to extreme top or bottom to avoid blocking center screen
                        if (spaceAbove > spaceBelow && spaceAbove > (dialogRect.height + 20)) {
                            // Target is low, dock dialog safely at the top
                            dialog.style.bottom = 'auto';
                            dialog.style.top = '20px';
                        } else {
                            // Target is high, dock dialog safely at the bottom
                            dialog.style.top = 'auto';
                            dialog.style.bottom = '20px';
                        }
                    } else {
                        // On Desktop: Float beautifully near the element
                        if (spaceBelow > (dialogRect.height + 30)) {
                            // Plenty of space below the target
                            dialog.style.bottom = 'auto';
                            dialog.style.top = `${rect.bottom + 20}px`;
                        } else if (spaceAbove > (dialogRect.height + 30)) {
                            // Plenty of space above the target
                            dialog.style.bottom = 'auto';
                            dialog.style.top = `${rect.top - dialogRect.height - 20}px`;
                        } else {
                            // Fallback if window is incredibly small: dock to edges
                            if (spaceAbove > spaceBelow) {
                                 dialog.style.bottom = 'auto';
                                 dialog.style.top = '20px';
                            } else {
                                 dialog.style.top = 'auto';
                                 dialog.style.bottom = '20px';
                            }
                        }
                    }
                }, 350); // Delay matches CSS scroll/modal speeds
            }
        } else {
            // No target -> Hide spotlight and center dialog gracefully
            spotlight.classList.remove('active');
            
            setTimeout(() => {
                dialog.style.bottom = 'auto';
                dialog.style.top = `50%`;
                dialog.style.left = `50%`;
                dialog.style.transform = `translate(-50%, -50%)`;
            }, 100);
        }
    }

    // --- Event Listeners ---
    nextBtn.addEventListener('click', () => {
        if (currentStep < steps.length - 1) {
            currentStep++;
            renderStep();
        } else {
            // Finish Tour - USING REPLACE() TO FIX BACK BUTTON
            window.location.replace("dashboard.html");
        }
    });

    skipBtn.addEventListener('click', () => {
        // USING REPLACE() TO FIX BACK BUTTON
        window.location.replace("dashboard.html");
    });

    // Re-calculate spotlight position if screen rotates/resizes
    window.addEventListener('resize', () => {
        if (steps[currentStep].target) {
            renderStep();
        }
    });

    // Initialize
    renderStep();
});