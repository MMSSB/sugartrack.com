// // Universal Tour Guide Script
// class TourGuide {
//     constructor(config) {
//         this.config = config;
//         this.currentStep = 0;
//         this.init();
//     }
    
//     init() {
//         // Create and append tour elements
//         this.createTourElements();
        
//         // Set CSS variables for colors
//         document.documentElement.style.setProperty('--tour-primary-color', this.config.settings.primaryColor);
//         document.documentElement.style.setProperty('--tour-accent-color', this.config.settings.accentColor);
        
//         // Add event listeners
//         this.addEventListeners();
//     }
    
//     createTourElements() {
//         // Create backdrop
//         this.backdrop = document.createElement('div');
//         this.backdrop.className = 'tour-backdrop';
//         this.backdrop.id = 'tourBackdrop';
        
//         // Create popup
//         this.popup = document.createElement('div');
//         this.popup.className = 'tour-popup';
//         this.popup.id = 'tourPopup';
//         this.popup.innerHTML = `
//             <button class="tour-close" id="closeTour">${this.config.text.closeButton}</button>
//             <h3 id="popupTitle"></h3>
//             <p id="popupContent"></p>
//             <div class="tour-nav">
//                 <button class="tour-btn" id="prevStep">${this.config.text.prevButton}</button>
//                 <span class="tour-progress" id="tourProgress"></span>
//                 <button class="tour-btn" id="nextStep">${this.config.text.nextButton}</button>
//             </div>
//         `;
        
//         // Create start button
//         this.startButton = document.createElement('button');
//         this.startButton.className = 'tour-start-btn';
//         this.startButton.id = 'tourStarter';
//         this.startButton.textContent = this.config.text.startButton;
//         this.startButton.title = 'Start Tour';
        
//         // Append elements to body
//         document.body.appendChild(this.backdrop);
//         document.body.appendChild(this.popup);
//         document.body.appendChild(this.startButton);
        
//         // Store references to elements
//         this.popupTitle = document.getElementById('popupTitle');
//         this.popupContent = document.getElementById('popupContent');
//         this.tourProgress = document.getElementById('tourProgress');
//         this.prevButton = document.getElementById('prevStep');
//         this.nextButton = document.getElementById('nextStep');
//         this.closeButton = document.getElementById('closeTour');
//     }
    
//     addEventListeners() {
//         // Start the tour
//         this.startButton.addEventListener('click', () => this.startTour());
        
//         // Navigate through steps
//         this.prevButton.addEventListener('click', () => this.goToPrevStep());
//         this.nextButton.addEventListener('click', () => this.goToNextStep());
        
//         // Close the tour
//         this.closeButton.addEventListener('click', () => this.closeTour());
        
//         // Close tour when clicking on backdrop
//         this.backdrop.addEventListener('click', () => {
//             if (this.config.settings.allowClose) {
//                 this.closeTour();
//             }
//         });
        
//         // Keyboard navigation
//         if (this.config.settings.keyboardNavigation) {
//             document.addEventListener('keydown', (e) => this.handleKeydown(e));
//         }
        
//         // Reposition popup on window resize
//         window.addEventListener('resize', () => {
//             if (this.backdrop.style.display === 'block') {
//                 this.positionPopup();
//             }
//         });
//     }
    
//     startTour() {
//         this.currentStep = 0;
//         this.showStep(this.currentStep);
//     }
    
//     showStep(stepIndex) {
//         const step = this.config.steps[stepIndex];
        
//         if (!step) {
//             console.error('Tour step not found at index:', stepIndex);
//             this.closeTour();
//             return;
//         }
        
//         // Highlight the element
//         const element = document.querySelector(step.element);
//         if (element) {
//             // Remove previous highlights
//             this.removeHighlights();
            
//             // Add highlight to current element
//             element.classList.add('tour-highlight');
            
//             // Scroll to the element if needed
//             if (this.config.settings.scrollToElement && step.scroll !== false) {
//                 this.scrollToElement(element);
//             }
            
//             // Position the popup
//             this.positionPopup(element, step.position);
            
//             // Update popup content
//             this.popupTitle.textContent = step.title;
//             this.popupContent.textContent = step.content;
//             this.tourProgress.textContent = this.config.settings.showProgress ? 
//                 `Step ${stepIndex + 1} of ${this.config.steps.length}` : '';
            
//             // Show backdrop and popup
//             this.backdrop.style.display = 'block';
//             this.popup.style.display = 'block';
            
//             // Update button states
//             this.prevButton.disabled = stepIndex === 0;
//             this.nextButton.textContent = stepIndex === this.config.steps.length - 1 ? 
//                 this.config.text.finishButton : this.config.text.nextButton;
            
//             // Call onShow callback if provided
//             if (typeof step.onShow === 'function') {
//                 step.onShow.call(this, element, step);
//             }
//         } else {
//             console.warn('Tour element not found:', step.element);
//             // Continue to next step if element doesn't exist
//             if (stepIndex < this.config.steps.length - 1) {
//                 this.currentStep++;
//                 setTimeout(() => this.showStep(this.currentStep), this.config.settings.animationDuration);
//             } else {
//                 this.closeTour();
//             }
//         }
//     }
    
//     positionPopup(element, position = 'auto') {
//         if (!element) return;
        
//         const rect = element.getBoundingClientRect();
//         const popupRect = this.popup.getBoundingClientRect();
//         const viewportWidth = window.innerWidth;
//         const viewportHeight = window.innerHeight;
        
//         // Reset popup position
//         this.popup.style.top = '';
//         this.popup.style.bottom = '';
//         this.popup.style.left = '';
//         this.popup.style.right = '';
        
//         // Determine best position if auto
//         if (position === 'auto') {
//             position = this.calculateBestPosition(rect, popupRect, viewportWidth, viewportHeight);
//         }
        
//         // Position the popup
//         switch(position) {
//             case 'top':
//                 this.popup.style.bottom = (viewportHeight - rect.top + 10) + 'px';
//                 break;
//             case 'bottom':
//                 this.popup.style.top = (rect.bottom + 10) + 'px';
//                 break;
//             case 'left':
//                 this.popup.style.right = (viewportWidth - rect.left + 10) + 'px';
//                 this.popup.style.top = (rect.top + (rect.height - popupRect.height) / 2) + 'px';
//                 break;
//             case 'right':
//                 this.popup.style.left = (rect.right + 10) + 'px';
//                 this.popup.style.top = (rect.top + (rect.height - popupRect.height) / 2) + 'px';
//                 break;
//             default:
//                 this.popup.style.top = (rect.bottom + 10) + 'px';
//         }
        
//         // Center horizontally for top/bottom positions
//         if (position === 'top' || position === 'bottom') {
//             const left = Math.max(10, rect.left + (rect.width - popupRect.width) / 2);
//             this.popup.style.left = left + 'px';
            
//             // Ensure popup stays within viewport
//             if (left + popupRect.width > viewportWidth - 10) {
//                 this.popup.style.left = (viewportWidth - popupRect.width - 10) + 'px';
//             }
//         }
        
//         // Adjust for vertical positioning to ensure popup is visible
//         const popupTop = parseInt(this.popup.style.top) || 0;
//         if (popupTop + popupRect.height > viewportHeight - 10) {
//             this.popup.style.top = (viewportHeight - popupRect.height - 10) + 'px';
//         }
//     }
    
//     calculateBestPosition(elementRect, popupRect, viewportWidth, viewportHeight) {
//         const positions = ['bottom', 'top', 'right', 'left'];
        
//         for (const position of positions) {
//             let fits = true;
            
//             switch(position) {
//                 case 'bottom':
//                     fits = elementRect.bottom + popupRect.height + 10 <= viewportHeight;
//                     break;
//                 case 'top':
//                     fits = elementRect.top - popupRect.height - 10 >= 0;
//                     break;
//                 case 'right':
//                     fits = elementRect.right + popupRect.width + 10 <= viewportWidth;
//                     break;
//                 case 'left':
//                     fits = elementRect.left - popupRect.width - 10 >= 0;
//                     break;
//             }
            
//             if (fits) return position;
//         }
        
//         // Default to bottom if no position fits perfectly
//         return 'bottom';
//     }
    
//     scrollToElement(element) {
//         const elementRect = element.getBoundingClientRect();
//         const absoluteElementTop = elementRect.top + window.pageYOffset;
//         const middle = absoluteElementTop - (window.innerHeight / 2) + (elementRect.height / 2);
//         window.scrollTo({
//             top: middle,
//             behavior: 'smooth'
//         });
//     }
    
//     goToPrevStep() {
//         if (this.currentStep > 0) {
//             // Call onHide callback if provided
//             const currentStepConfig = this.config.steps[this.currentStep];
//             if (typeof currentStepConfig.onHide === 'function') {
//                 const element = document.querySelector(currentStepConfig.element);
//                 if (element) {
//                     currentStepConfig.onHide.call(this, element, currentStepConfig);
//                 }
//             }
            
//             this.currentStep--;
//             this.showStep(this.currentStep);
//         }
//     }
    
//     goToNextStep() {
//         if (this.currentStep < this.config.steps.length - 1) {
//             // Call onHide callback if provided
//             const currentStepConfig = this.config.steps[this.currentStep];
//             if (typeof currentStepConfig.onHide === 'function') {
//                 const element = document.querySelector(currentStepConfig.element);
//                 if (element) {
//                     currentStepConfig.onHide.call(this, element, currentStepConfig);
//                 }
//             }
            
//             this.currentStep++;
//             this.showStep(this.currentStep);
//         } else {
//             this.closeTour();
//         }
//     }
    
//     closeTour() {
//         // Remove highlights
//         this.removeHighlights();
        
//         // Hide tour elements
//         this.backdrop.style.display = 'none';
//         this.popup.style.display = 'none';
//     }
    
//     removeHighlights() {
//         const highlightedElements = document.querySelectorAll('.tour-highlight');
//         highlightedElements.forEach(el => {
//             el.classList.remove('tour-highlight');
//         });
//     }
    
//     handleKeydown(e) {
//         if (this.backdrop.style.display !== 'block') return;
        
//         switch(e.key) {
//             case 'Escape':
//                 if (this.config.settings.allowClose) {
//                     this.closeTour();
//                 }
//                 break;
//             case 'ArrowLeft':
//                 this.goToPrevStep();
//                 break;
//             case 'ArrowRight':
//                 this.goToNextStep();
//                 break;
//         }
//     }
// }

// // Initialize tour when DOM is loaded
// document.addEventListener('DOMContentLoaded', function() {
//     window.tourGuide = new TourGuide(tourConfig);
// });