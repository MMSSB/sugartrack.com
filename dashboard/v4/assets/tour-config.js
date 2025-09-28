// // Tour Configuration - Easy to customize
// const tourConfig = {
//     // General settings
//     settings: {
//         primaryColor: '#6e8efb',    // Primary color for buttons and highlights
//         accentColor: '#a777e3',     // Accent color for hover effects
//         allowClose: true,           // Allow users to close the tour
//         showProgress: true,         // Show progress indicator
//         keyboardNavigation: true,   // Enable keyboard navigation (arrows, escape)
//         scrollToElement: true,      // Scroll to elements when they're highlighted
//         scrollPadding: 20,          // Padding when scrolling to elements
//         animationDuration: 300,     // Animation duration in milliseconds
//     },
    
//     // Text customization
//     text: {
//         nextButton: 'Next',
//         prevButton: 'Previous',
//         finishButton: 'Finish',
//         closeButton: '×',
//         startButton: '?'
//     },
    
//     // Tour steps - Add your steps here
//     steps: [
//         {
//             element: 'header',           // CSS selector for the element to highlight
//             title: 'Welcome Header',     // Title for the popup
//             content: 'This is the header section where we introduce our website and its main purpose.', // Content for the popup
//             position: 'bottom',          // Position of the popup (top, bottom, left, right, auto)
//             scroll: true,                // Whether to scroll to this element
//             onShow: null,                // Optional callback when step is shown
//             onHide: null                 // Optional callback when step is hidden
//         },
//         {
//             element: '.nav-menu',
//             title: 'Main Navigation',
//             content: 'Use this menu to navigate through different sections of our website.',
//             position: 'bottom'
//         },
//         {
//             element: '#main-feature',
//             title: 'Key Feature',
//             content: 'This is our most important feature that helps you accomplish your goals.',
//             position: 'top'
//         },
//         {
//             element: '.contact-form',
//             title: 'Contact Us',
//             content: 'Fill out this form to get in touch with our team for any questions or support.',
//             position: 'left'
//         },
//         {
//             element: '.footer',
//             title: 'Additional Information',
//             content: 'Check our footer for links to important pages, policies, and social media.',
//             position: 'top'
//         }
//     ]
// };





















    // Tour Guide Script - Add this to your JS
    document.addEventListener('DOMContentLoaded', function() {
        // Tour configuration - EDIT THIS FOR YOUR WEBSITE
        const tourSteps = [
            {
                element: 'head', // CSS selector for the element to highlight
                title: 'Welcome User 😊', // Title for the popup
                content: 'Welcome to SugarTrack Dashboard.', // Content for the popup
                position: 'bottom' // Position of the popup (top, bottom, left, right)
            },
            {
                element: '#date', // Example: navigation menu
                title: 'Date input📅',
                content: 'Use this input to add date of gulocose readings or it add it automatic.',
                position: 'bottom'
            },
            {
                element: '#time', // Example: navigation menu
                title: 'Time input🕗',
                content: 'Use this input to add time of gulocose readings or it add it automatic.',
                position: 'bottom'
            },
            {
                element: '.reading-input', // Example: main feature
                title: 'Input Readings',
                content: 'Use this input to add number of gulocose.',
                position: 'bottom'
            },
            {
                element: '#comment', // Example: contact form
                title: 'Comment',
                content: 'Use this optional input to add Comment for gulocose readings.',
                position: 'bottom'
            },

            {
                element: '.readings-list', // Example: contact form
                title: 'Reading Lists',
                content: 'After you add the reading data it will show the data in this list',
                position: 'bottom'
            },

                        {
                element: 'head', // CSS selector for the element to highlight
                title: 'Finished Now Enjoy 😉 ', // Title for the popup
                content: '', // Content for the popup
                position: 'bottom' // Position of the popup (top, bottom, left, right)
            }

            // {
            //     element: '#time', // Example: footer
            //     title: 'Additional Information',
            //     content: 'Check our footer for links to important pages, policies, and social media.',
            //     position: 'bottom'
            // }
        ];
        
        // Tour variables
        let currentStep = 0;
        const backdrop = document.getElementById('tourBackdrop');
        const popup = document.getElementById('tourPopup');
        const popupTitle = document.getElementById('popupTitle');
        const popupContent = document.getElementById('popupContent');
        const tourProgress = document.getElementById('tourProgress');
        // const prevButton = document.getElementById('prevStep');
        const nextButton = document.getElementById('nextStep');
        const closeButton = document.getElementById('closeTour');
        const startButton = document.getElementById('tourStarter');
        
        // Start the tour
        startButton.addEventListener('click', startTour);
        
        // Navigate through steps
        // prevButton.addEventListener('click', goToPrevStep);
        nextButton.addEventListener('click', goToNextStep);
        
        // Close the tour
        closeButton.addEventListener('click', closeTour);
        
        function startTour() {
            currentStep = 0;
            showStep(currentStep);
        }
        
        function showStep(stepIndex) {
            const step = tourSteps[stepIndex];
            
            // Highlight the element
            const element = document.querySelector(step.element);
            if (element) {
                // Remove previous highlights
                const previousHighlights = document.querySelectorAll('.tour-highlight');
                previousHighlights.forEach(el => {
                    el.classList.remove('tour-highlight');
                });
                
                // Add highlight to current element
                element.classList.add('tour-highlight');
                
                // Scroll to the element if needed
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Position the popup
                positionPopup(element, step.position);
            } else {
                console.warn('Tour element not found:', step.element);
                // Continue to next step if element doesn't exist
                if (stepIndex < tourSteps.length - 1) {
                    currentStep++;
                    showStep(currentStep);
                    return;
                } else {
                    closeTour();
                    return;
                }
            }
            
            // Update popup content
            popupTitle.textContent = step.title;
            popupContent.textContent = step.content;
            tourProgress.textContent = `Step ${stepIndex + 1} of ${tourSteps.length}`;
            
            // Show backdrop and popup
            backdrop.style.display = 'block';
            popup.style.display = 'block';
            
            // Update button states
            prevButton.disabled = stepIndex === 0;
            nextButton.textContent = stepIndex === tourSteps.length - 1 ? 'Finish' : 'Next';
        }
        
        function positionPopup(element, position) {
            const rect = element.getBoundingClientRect();
            
            // Reset popup position
            popup.style.top = '';
            popup.style.bottom = '';
            popup.style.left = '';
            popup.style.right = '';
            
            switch(position) {
                case 'top':
                    popup.style.bottom = (window.innerHeight - rect.top + 20) + 'px';
                    break;
                case 'bottom':
                    popup.style.top = (rect.bottom + 20) + 'px';
                    break;
                case 'left':
                    popup.style.right = (window.innerWidth - rect.left + 20) + 'px';
                    popup.style.top = (rect.top + (rect.height - popup.offsetHeight) / 2) + 'px';
                    break;
                case 'right':
                    popup.style.left = (rect.right + 20) + 'px';
                    popup.style.top = (rect.top + (rect.height - popup.offsetHeight) / 2) + 'px';
                    break;
                default:
                    popup.style.top = (rect.bottom + 20) + 'px';
            }
            
            // Center horizontally for top/bottom positions
            if (position === 'top' || position === 'bottom') {
                popup.style.left = Math.max(20, rect.left + (rect.width - popup.offsetWidth) / 2) + 'px';
                
                // Ensure popup stays within viewport
                if (parseInt(popup.style.left) + popup.offsetWidth > window.innerWidth - 20) {
                    popup.style.left = (window.innerWidth - popup.offsetWidth - 20) + 'px';
                }
            }
            
            // Adjust for vertical positioning to ensure popup is visible
            if (parseInt(popup.style.top) + popup.offsetHeight > window.innerHeight - 20) {
                popup.style.top = (window.innerHeight - popup.offsetHeight - 20) + 'px';
            }
        }
        
        function goToPrevStep() {
            if (currentStep > 0) {
                currentStep--;
                showStep(currentStep);
            }
        }
        
        function goToNextStep() {
            if (currentStep < tourSteps.length - 1) {
                currentStep++;
                showStep(currentStep);
            } else {
                closeTour();
            }
        }
        
        function closeTour() {
            // Remove highlights
            const highlightedElements = document.querySelectorAll('.tour-highlight');
            highlightedElements.forEach(el => {
                el.classList.remove('tour-highlight');
            });
            
            // Hide tour elements
            backdrop.style.display = 'none';
            popup.style.display = 'none';
        }
        
        // Close tour when clicking on backdrop
        backdrop.addEventListener('click', closeTour);
        
        // Close tour with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && backdrop.style.display === 'block') {
                closeTour();
            }
        });
        
        // Reposition popup on window resize
        window.addEventListener('resize', function() {
            if (backdrop.style.display === 'block') {
                const step = tourSteps[currentStep];
                const element = document.querySelector(step.element);
                if (element) {
                    positionPopup(element, step.position);
                }
            }
        });
    });