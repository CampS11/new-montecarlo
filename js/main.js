/**
 * Monte Carlo Guesthouse - Main JavaScript File
 * FAANG-level production code with best practices
 */

// IIFE to avoid polluting global namespace
(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        debounceDelay: 300,
        scrollOffset: 100,
        autoSlideInterval: 5000,
        formResetDelay: 3000
    };

    // State management
    const State = {
        isMobileMenuOpen: false,
        currentSlide: 0,
        totalSlides: 0,
        isScrolling: false,
        lastScrollTop: 0
    };

    // DOM Elements cache
    const DOM = {
        body: document.body,
        header: document.querySelector('.main-header'),
        menuToggle: document.querySelector('.menu-toggle'),
        navMenu: document.querySelector('.nav-menu'),
        currentYear: document.getElementById('current-year'),
        skipLink: document.querySelector('.skip-link')
    };

    // Initialize application
    function init() {
        console.log('Monte Carlo Guesthouse - Initializing');
        
        // Set current year in footer
        if (DOM.currentYear) {
            DOM.currentYear.textContent = new Date().getFullYear();
        }
        
        // Initialize modules
        initMobileMenu();
        initSmoothScroll();
        initHeaderScroll();
        initAnimations();
        initFormValidation();
        initGallery();
        initBooking();
        
        // Add event listeners
        addEventListeners();
        
        // Performance monitoring
        monitorPerformance();
        
        console.log('Application initialized successfully');
    }

    // Mobile Menu Functionality
    function initMobileMenu() {
        if (!DOM.menuToggle || !DOM.navMenu) return;
        
        const toggleMenu = () => {
            State.isMobileMenuOpen = !State.isMobileMenuOpen;
            DOM.menuToggle.classList.toggle('active', State.isMobileMenuOpen);
            DOM.navMenu.classList.toggle('active', State.isMobileMenuOpen);
            DOM.menuToggle.setAttribute('aria-expanded', State.isMobileMenuOpen);
            
            // Trap focus when menu is open
            if (State.isMobileMenuOpen) {
                trapFocus(DOM.navMenu);
            }
        };
        
        const closeMenu = () => {
            if (State.isMobileMenuOpen) {
                State.isMobileMenuOpen = false;
                DOM.menuToggle.classList.remove('active');
                DOM.navMenu.classList.remove('active');
                DOM.menuToggle.setAttribute('aria-expanded', 'false');
            }
        };
        
        DOM.menuToggle.addEventListener('click', toggleMenu);
        
        // Close menu when clicking outside or on a link
        document.addEventListener('click', (e) => {
            if (State.isMobileMenuOpen && 
                !DOM.navMenu.contains(e.target) && 
                !DOM.menuToggle.contains(e.target)) {
                closeMenu();
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && State.isMobileMenuOpen) {
                closeMenu();
                DOM.menuToggle.focus();
            }
        });
        
        // Close menu on link click
        const navLinks = DOM.navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }

    // Smooth Scroll
    function initSmoothScroll() {
        // Use native smooth scroll if available
        if ('scrollBehavior' in document.documentElement.style) {
            return;
        }
        
        // Polyfill for smooth scroll
        const smoothScroll = (target, duration = 1000) => {
            const targetPosition = target.getBoundingClientRect().top;
            const startPosition = window.pageYOffset;
            const distance = targetPosition - CONFIG.scrollOffset;
            let startTime = null;
            
            const animation = (currentTime) => {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
                window.scrollTo(0, run);
                if (timeElapsed < duration) requestAnimationFrame(animation);
            };
            
            // Easing function
            const easeInOutQuad = (t, b, c, d) => {
                t /= d / 2;
                if (t < 1) return c / 2 * t * t + b;
                t--;
                return -c / 2 * (t * (t - 2) - 1) + b;
            };
            
            requestAnimationFrame(animation);
        };
        
        // Apply to all anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    smoothScroll(target);
                }
            });
        });
    }

    // Header Scroll Effect
    function initHeaderScroll() {
        if (!DOM.header) return;
        
        let ticking = false;
        
        const updateHeader = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 100) {
                DOM.header.classList.add('scrolled');
                
                // Hide header on scroll down, show on scroll up
                if (scrollTop > State.lastScrollTop && scrollTop > 200) {
                    DOM.header.style.transform = 'translateY(-100%)';
                } else {
                    DOM.header.style.transform = 'translateY(0)';
                }
            } else {
                DOM.header.classList.remove('scrolled');
                DOM.header.style.transform = 'translateY(0)';
            }
            
            State.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
            ticking = false;
        };
        
        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(updateHeader);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    // Animations
    function initAnimations() {
        // Intersection Observer for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '50px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe elements with animation classes
        document.querySelectorAll('.fade-in, .slide-up, .slide-left, .slide-right').forEach(el => {
            observer.observe(el);
        });
        
        // Add CSS for animations
        const style = document.createElement('style');
        style.textContent = `
            .fade-in { opacity: 0; transition: opacity 0.6s ease; }
            .fade-in.animate-in { opacity: 1; }
            
            .slide-up { opacity: 0; transform: translateY(30px); transition: opacity 0.6s ease, transform 0.6s ease; }
            .slide-up.animate-in { opacity: 1; transform: translateY(0); }
            
            .slide-left { opacity: 0; transform: translateX(-30px); transition: opacity 0.6s ease, transform 0.6s ease; }
            .slide-left.animate-in { opacity: 1; transform: translateX(0); }
            
            .slide-right { opacity: 0; transform: translateX(30px); transition: opacity 0.6s ease, transform 0.6s ease; }
            .slide-right.animate-in { opacity: 1; transform: translateX(0); }
        `;
        document.head.appendChild(style);
    }

    // Form Validation
    function initFormValidation() {
        const forms = document.querySelectorAll('form[novalidate]');
        
        forms.forEach(form => {
            // Remove novalidate attribute for progressive enhancement
            form.removeAttribute('novalidate');
            
            form.addEventListener('submit', (e) => {
                if (!validateForm(form)) {
                    e.preventDefault();
                    showFormErrors(form);
                    return false;
                }
                
                // Form is valid - show success state
                showFormSuccess(form);
                e.preventDefault(); // Remove in production when backend is connected
            });
            
            // Real-time validation
            form.querySelectorAll('input, select, textarea').forEach(input => {
                input.addEventListener('blur', () => validateField(input));
                input.addEventListener('input', debounce(() => validateField(input), 500));
            });
        });
    }

    function validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    function validateField(field) {
        const value = field.value.trim();
        const isRequired = field.hasAttribute('required');
        const type = field.type;
        const name = field.name || field.id;
        
        // Clear previous errors
        clearFieldError(field);
        
        // Check required fields
        if (isRequired && !value) {
            showFieldError(field, 'This field is required');
            return false;
        }
        
        // Type-specific validation
        switch (type) {
            case 'email':
                if (value && !isValidEmail(value)) {
                    showFieldError(field, 'Please enter a valid email address');
                    return false;
                }
                break;
                
            case 'tel':
                if (value && !isValidPhone(value)) {
                    showFieldError(field, 'Please enter a valid phone number');
                    return false;
                }
                break;
                
            case 'date':
                if (value && !isValidDate(value)) {
                    showFieldError(field, 'Please enter a valid date');
                    return false;
                }
                break;
        }
        
        // Custom validation based on field name
        switch (name) {
            case 'checkin':
            case 'checkout':
                if (value && !isFutureDate(value)) {
                    showFieldError(field, 'Date cannot be in the past');
                    return false;
                }
                break;
        }
        
        // Add success state
        if (value) {
            field.classList.add('valid');
        }
        
        return true;
    }

    function showFieldError(field, message) {
        field.classList.add('invalid');
        field.classList.remove('valid');
        
        let errorElement = field.nextElementSibling;
        if (!errorElement || !errorElement.classList.contains('error-message')) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            field.parentNode.insertBefore(errorElement, field.nextSibling);
        }
        
        errorElement.textContent = message;
        errorElement.setAttribute('role', 'alert');
        errorElement.setAttribute('aria-live', 'assertive');
    }

    function clearFieldError(field) {
        field.classList.remove('invalid');
        field.classList.remove('valid');
        
        const errorElement = field.nextElementSibling;
        if (errorElement && errorElement.classList.contains('error-message')) {
            errorElement.remove();
        }
    }

    function showFormErrors(form) {
        const firstInvalid = form.querySelector('.invalid');
        if (firstInvalid) {
            firstInvalid.focus();
            
            // Announce error to screen readers
            const announcement = document.createElement('div');
            announcement.setAttribute('role', 'alert');
            announcement.setAttribute('aria-live', 'assertive');
            announcement.className = 'sr-only';
            announcement.textContent = 'Please correct the errors in the form';
            document.body.appendChild(announcement);
            
            setTimeout(() => announcement.remove(), 3000);
        }
    }

    function showFormSuccess(form) {
        // In production, this would submit to the server
        // For now, show success modal
        
        const modal = document.querySelector('.confirmation-modal, .contact-modal');
        if (modal) {
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            
            const closeBtn = modal.querySelector('#close-modal, #contact-close-modal');
            if (closeBtn) {
                closeBtn.focus();
                
                closeBtn.addEventListener('click', () => {
                    modal.classList.remove('active');
                    modal.setAttribute('aria-hidden', 'true');
                    form.reset();
                });
            }
            
            // Close on escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modal.classList.contains('active')) {
                    modal.classList.remove('active');
                    modal.setAttribute('aria-hidden', 'true');
                }
            });
            
            // Close on background click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                    modal.setAttribute('aria-hidden', 'true');
                }
            });
        } else {
            // Fallback: show alert and reset form
            alert('Thank you! Your message has been sent.');
            setTimeout(() => form.reset(), CONFIG.formResetDelay);
        }
    }

    // Validation helper functions
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function isValidPhone(phone) {
        const re = /^(081\d{7}|\+26481\d{7})$/;
        return re.test(phone.replace(/[\s\-\(\)]/g, ''));
    }

    function isValidDate(dateString) {
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date);
    }

    function isFutureDate(dateString) {
        const date = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date >= today;
    }

    // Gallery functionality
    function initGallery() {
        const gallery = document.querySelector('.gallery-grid');
        if (!gallery) return;
        
        // Filter functionality
        const filterButtons = document.querySelectorAll('.filter-btn');
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Filter items
                const filter = button.dataset.filter;
                
                galleryItems.forEach(item => {
                    if (filter === 'all' || item.dataset.category === filter) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 10);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
        
        // Load more functionality
        const loadMoreBtn = document.getElementById('load-more');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                // Simulate loading more items
                loadMoreBtn.classList.add('loading');
                loadMoreBtn.disabled = true;
                
                setTimeout(() => {
                    // In production, this would fetch more items from server
                    // For now, we'll just show a message
                    loadMoreBtn.textContent = 'All photos loaded';
                    loadMoreBtn.disabled = true;
                    loadMoreBtn.classList.remove('loading');
                }, 1000);
            });
        }
    }

    // Booking functionality
    function initBooking() {
        const bookingForm = document.getElementById('booking-form');
        if (!bookingForm) return;
        
        // Update booking summary in real-time
        const updateSummary = debounce(() => {
            const checkin = document.getElementById('checkin').value;
            const checkout = document.getElementById('checkout').value;
            const roomType = document.getElementById('room-type').value;
            const guests = document.getElementById('guests').value;
            
            // Update summary elements
            if (checkin) {
                document.getElementById('summary-checkin').textContent = formatDate(checkin);
            }
            if (checkout) {
                document.getElementById('summary-checkout').textContent = formatDate(checkout);
            }
        if (roomType) {
                const roomName = document.getElementById('room-type').options[document.getElementById('room-type').selectedIndex].text;
                document.getElementById('summary-room').textContent = roomName;
                document.getElementById('summary-rate').textContent = "Prices vary - contact us for today's rate.";
            }
            if (guests) {
                document.getElementById('summary-guests').textContent = `${guests} Guest${guests > 1 ? 's' : ''}`;
            }
            
            // Calculate nights and total
            if (checkin && checkout) {
                const nights = calculateNights(checkin, checkout);
                document.getElementById('summary-nights').textContent = `${nights} Night${nights > 1 ? 's' : ''}`;
                document.getElementById('summary-nights-count').textContent = nights;
                
                if (roomType) {
                    document.getElementById('summary-total').textContent = 'Contact us for a tailored quote.';
                }
            }
        }, 300);
        
        // Add event listeners for summary updates
        bookingForm.querySelectorAll('#checkin, #checkout, #room-type, #guests').forEach(input => {
            input.addEventListener('change', updateSummary);
            input.addEventListener('input', updateSummary);
        });
        
        // Room type navigation on rooms page
        const roomTypeButtons = document.querySelectorAll('.room-type-btn');
        const roomDetails = document.querySelectorAll('.room-detail');
        
        roomTypeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const roomId = button.dataset.room;
                
                // Update active button
                roomTypeButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Show corresponding room detail
                roomDetails.forEach(detail => {
                    detail.classList.remove('active');
                    if (detail.id === roomId) {
                        detail.classList.add('active');
                        
                        // Scroll to room section
                        detail.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                });
            });
        });
        
        // Room image thumbnails
        const thumbButtons = document.querySelectorAll('.thumb-btn');
        thumbButtons.forEach(button => {
            button.addEventListener('click', () => {
                const imgSrc = button.dataset.img;
                const roomId = button.closest('.room-detail').id;
                const mainImg = document.getElementById(`${roomId}-main`);
                
                if (mainImg && imgSrc) {
                    // Update active thumbnail
                    thumbButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                    
                    // Update main image
                    mainImg.src = imgSrc;
                    mainImg.alt = button.querySelector('img').alt;
                }
            });
        });
    }

    // Helper functions
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    function trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        if (!firstFocusable || !lastFocusable) {
            return;
        }

        if (element.dataset.focusTrapBound !== 'true') {
            element.addEventListener('keydown', (e) => {
                if (e.key !== 'Tab') return;

                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        lastFocusable.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        firstFocusable.focus();
                        e.preventDefault();
                    }
                }
            });

            element.dataset.focusTrapBound = 'true';
        }

        firstFocusable.focus();
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    function calculateNights(checkin, checkout) {
        const start = new Date(checkin);
        const end = new Date(checkout);
        const diff = end.getTime() - start.getTime();
        return Math.ceil(diff / (1000 * 3600 * 24));
    }

    // Performance monitoring
    function monitorPerformance() {
        if ('performance' in window) {
            const timing = performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            
            if (loadTime < 3000) {
                console.log(`Page loaded in ${loadTime}ms - Excellent performance`);
            } else if (loadTime < 5000) {
                console.log(`Page loaded in ${loadTime}ms - Good performance`);
            } else {
                console.warn(`Page loaded in ${loadTime}ms - Consider optimization`);
            }
        }
        
        // Monitor largest contentful paint
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    console.log('LCP:', entry);
                }
            });
            
            observer.observe({ entryTypes: ['largest-contentful-paint'] });
        }
    }

    // Add event listeners
    function addEventListeners() {
        // Skip link focus
        if (DOM.skipLink) {
            DOM.skipLink.addEventListener('click', (e) => {
                const target = document.querySelector(DOM.skipLink.getAttribute('href'));
                if (target) {
                    e.preventDefault();
                    target.setAttribute('tabindex', '-1');
                    target.focus();
                    setTimeout(() => target.removeAttribute('tabindex'), 1000);
                }
            });
        }
        
        // Prevent empty anchor links from scrolling
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href="#"]')) {
                e.preventDefault();
            }
        });
        
        // Add loading state to buttons on click
        document.addEventListener('click', (e) => {
            if (e.target.matches('.btn') || e.target.closest('.btn')) {
                const btn = e.target.matches('.btn') ? e.target : e.target.closest('.btn');
                if (btn.type === 'submit') {
                    btn.classList.add('loading');
                    setTimeout(() => btn.classList.remove('loading'), 2000);
                }
            }
        });
        
        // Handle video play button
        const videoPlayBtn = document.querySelector('.video-play-btn');
        if (videoPlayBtn) {
            videoPlayBtn.addEventListener('click', () => {
                // In production, this would play a video
                // For now, we'll show a message
                alert('Virtual tour video would play here. In production, this would embed a 360-degree video tour.');
            });
        }
        
        // FAQ accordion
        const faqQuestions = document.querySelectorAll('.faq-question');
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                const answer = question.nextElementSibling;
                
                // Toggle state
                question.setAttribute('aria-expanded', !isExpanded);
                answer.setAttribute('aria-hidden', isExpanded);
                
                // Close other FAQs
                if (!isExpanded) {
                    faqQuestions.forEach(otherQuestion => {
                        if (otherQuestion !== question && otherQuestion.getAttribute('aria-expanded') === 'true') {
                            otherQuestion.setAttribute('aria-expanded', 'false');
                            otherQuestion.nextElementSibling.setAttribute('aria-hidden', 'true');
                        }
                    });
                }
            });
        });
        
        // Services tabs
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabPanes = document.querySelectorAll('.tab-pane');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.dataset.tab;
                
                // Update active button
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Show corresponding tab
                tabPanes.forEach(pane => {
                    pane.classList.remove('active');
                    if (pane.id === tabId) {
                        pane.classList.add('active');
                    }
                });
            });
        });
    }

    // Initialize when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export public API if needed
    window.MonteCarloGuesthouse = window.MonteCarloGuesthouse || {
        init: init,
        validateForm: validateForm,
        showFormSuccess: showFormSuccess
    };

})();
