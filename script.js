document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    // Initialize menu state
    function initMenu() {
        if (window.innerWidth < 769) {
            navLinks.style.display = 'none';
            navLinks.classList.remove('active', 'show');
        } else {
            navLinks.style.display = 'flex';
            navLinks.classList.remove('active', 'show');
        }
    }
    
    // Toggle menu function
    function toggleMenu() {
        menuToggle.classList.toggle('active');
        
        if (navLinks.classList.contains('active')) {
            // Close menu with animation
            navLinks.classList.remove('show');
            setTimeout(() => {
                navLinks.style.display = 'none';
                navLinks.classList.remove('active');
            }, 300);
        } else {
            // Open menu with animation
            navLinks.style.display = 'flex';
            // Add index to each link for staggered animation
            document.querySelectorAll('.nav-links a').forEach((link, index) => {
                link.style.setProperty('--i', index);
            });
            // Force reflow to enable animation
            void navLinks.offsetWidth;
            navLinks.classList.add('active', 'show');
        }
    }
    
    // Initialize menu
    initMenu();
    
    // Menu toggle click event
    menuToggle.addEventListener('click', toggleMenu);
    
    // Close menu when clicking on a link (mobile only)
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth < 769) {
                toggleMenu();
            }
        });
    });
    
    // Handle window resize
    window.addEventListener('resize', initMenu);
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add shadow to navbar on scroll
    window.addEventListener('scroll', function() {
        const nav = document.querySelector('nav');
        if (window.scrollY > 10) {
            nav.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        } else {
            nav.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        }
    });
    
    // Animation on scroll for cards
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.feature-card, .pricing-card');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Set initial state for animated elements
    document.querySelectorAll('.feature-card, .pricing-card').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on load
});