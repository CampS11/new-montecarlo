/**
 * Monte Carlo Guesthouse - Form Validation
 * Comprehensive client-side form validation
 */

(function() {
    'use strict';

    const Validation = {
        patterns: {
            email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            phone: /^(081\d{7}|\+26481\d{7})$/,
            name: /^[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF\s\-']{2,50}$/,
            date: /^\d{4}-\d{2}-\d{2}$/
        },
        
        messages: {
            required: 'This field is required',
            email: 'Please enter a valid email address',
            phone: 'Please enter a valid phone number',
            name: 'Please enter a valid name (2-50 characters)',
            date: 'Please enter a valid date',
            futureDate: 'Date cannot be in the past',
            checkinBeforeCheckout: 'Check-in must be before check-out',
            minGuests: 'Minimum 1 guest required',
            maxGuests: 'Maximum 4 guests allowed',
            terms: 'You must accept the terms and conditions'
        }
    };

    class FormValidator {
        constructor(form) {
            this.form = form;
            this.fields = this.form.querySelectorAll('input, select, textarea');
            this.isValid = true;
            
            this.init();
        }
        
        init() {
            // Remove HTML5 validation bubbles
            this.form.setAttribute('novalidate', '');
            
            // Add real-time validation
            this.addRealTimeValidation();
            
            // Add form submission handler
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
        
        addRealTimeValidation() {
            this.fields.forEach(field => {
                // Validate on blur
                field.addEventListener('blur', () => {
                    this.validateField(field);
                });
                
                // Validate on input (with debounce)
                field.addEventListener('input', debounce(() => {
                    if (field.value.trim()) {
                        this.validateField(field);
                    }
                }, 300));
                
                // Clear errors on focus
                field.addEventListener('focus', () => {
                    this.clearFieldError(field);
                });
            });
            
            // Special handling for date fields
            const checkin = this.form.querySelector('#checkin');
            const checkout = this.form.querySelector('#checkout');
            
            if (checkin && checkout) {
                checkin.addEventListener('change', () => {
                    this.validateDateRange(checkin, checkout);
                });
                
                checkout.addEventListener('change', () => {
                    this.validateDateRange(checkin, checkout);
                });
            }
        }
        
        handleSubmit(e) {
            e.preventDefault();
            
            this.isValid = true;
            this.clearAllErrors();
            
            // Validate all fields
            this.fields.forEach(field => {
                if (!this.validateField(field)) {
                    this.isValid = false;
                }
            });
            
            // Validate date range if applicable
            const checkin = this.form.querySelector('#checkin');
            const checkout = this.form.querySelector('#checkout');
            if (checkin && checkout && !this.validateDateRange(checkin, checkout)) {
                this.isValid = false;
            }
            
            // Validate terms agreement
            const terms = this.form.querySelector('#terms');
            if (terms && !terms.checked) {
                this.showError(terms, Validation.messages.terms);
                this.isValid = false;
            }
            
            if (this.isValid) {
                this.submitForm();
            } else {
                this.focusFirstError();
                this.announceErrors();
            }
        }
        
        validateField(field) {
            const value = field.value.trim();
            const type = field.type || field.tagName.toLowerCase();
            const name = field.name || field.id;
            const isRequired = field.hasAttribute('required');
            
            // Clear previous errors
            this.clearFieldError(field);
            
            // Check required field
            if (isRequired && !value) {
                this.showError(field, Validation.messages.required);
                return false;
            }
            
            // Skip further validation if field is empty and not required
            if (!value && !isRequired) {
                return true;
            }
            
            // Type-specific validation
            switch (type) {
                case 'email':
                    if (!Validation.patterns.email.test(value)) {
                        this.showError(field, Validation.messages.email);
                        return false;
                    }
                    break;
                    
                case 'tel':
                    const phoneNumber = value.replace(/[\s\-\(\)]/g, '');
                    if (!Validation.patterns.phone.test(phoneNumber)) {
                        this.showError(field, Validation.messages.phone);
                        return false;
                    }
                    break;
                    
                case 'text':
                    if (name.includes('name') && !Validation.patterns.name.test(value)) {
                        this.showError(field, Validation.messages.name);
                        return false;
                    }
                    break;
                    
                case 'date':
                    if (!Validation.patterns.date.test(value)) {
                        this.showError(field, Validation.messages.date);
                        return false;
                    }
                    
                    // Check if date is in the past
                    if (!this.isFutureDate(value)) {
                        this.showError(field, Validation.messages.futureDate);
                        return false;
                    }
                    break;
                    
                case 'select-one':
                    if (value === '' && isRequired) {
                        this.showError(field, Validation.messages.required);
                        return false;
                    }
                    break;
            }
            
            // Custom validation for specific fields
            switch (name) {
                case 'guests':
                    const guests = parseInt(value);
                    if (guests < 1) {
                        this.showError(field, Validation.messages.minGuests);
                        return false;
                    }
                    if (guests > 4) {
                        this.showError(field, Validation.messages.maxGuests);
                        return false;
                    }
                    break;
            }
            
            // Mark field as valid
            this.markFieldValid(field);
            return true;
        }
        
        validateDateRange(checkin, checkout) {
            if (!checkin.value || !checkout.value) {
                return true; // Let individual field validation handle empty dates
            }
            
            const checkinDate = new Date(checkin.value);
            const checkoutDate = new Date(checkout.value);
            
            if (checkinDate >= checkoutDate) {
                this.showError(checkout, Validation.messages.checkinBeforeCheckout);
                return false;
            }
            
            // Clear errors if validation passes
            this.clearFieldError(checkin);
            this.clearFieldError(checkout);
            this.markFieldValid(checkin);
            this.markFieldValid(checkout);
            
            return true;
        }
        
        isFutureDate(dateString) {
            const date = new Date(dateString);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return date >= today;
        }
        
        showError(field, message) {
            field.classList.add('invalid');
            field.classList.remove('valid');
            
            // Create or update error message
            let errorElement = field.nextElementSibling;
            if (!errorElement || !errorElement.classList.contains('error-message')) {
                errorElement = document.createElement('div');
                errorElement.className = 'error-message';
                errorElement.setAttribute('role', 'alert');
                errorElement.setAttribute('aria-live', 'polite');
                field.parentNode.insertBefore(errorElement, field.nextSibling);
            }
            
            errorElement.textContent = message;
            
            // Add ARIA attributes to field
            field.setAttribute('aria-invalid', 'true');
            field.setAttribute('aria-describedby', `error-${field.id}`);
            errorElement.id = `error-${field.id}`;
        }
        
        clearFieldError(field) {
            field.classList.remove('invalid');
            field.classList.remove('valid');
            field.removeAttribute('aria-invalid');
            field.removeAttribute('aria-describedby');
            
            const errorElement = field.nextElementSibling;
            if (errorElement && errorElement.classList.contains('error-message')) {
                errorElement.remove();
            }
        }
        
        markFieldValid(field) {
            field.classList.remove('invalid');
            field.classList.add('valid');
            field.removeAttribute('aria-invalid');
            
            // Remove error message if it exists
            const errorElement = field.nextElementSibling;
            if (errorElement && errorElement.classList.contains('error-message')) {
                errorElement.remove();
            }
        }
        
        clearAllErrors() {
            this.fields.forEach(field => {
                this.clearFieldError(field);
            });
        }
        
        focusFirstError() {
            const firstInvalid = this.form.querySelector('.invalid');
            if (firstInvalid) {
                firstInvalid.focus();
            }
        }
        
        announceErrors() {
            const errorCount = this.form.querySelectorAll('.invalid').length;
            if (errorCount > 0) {
                const announcement = document.createElement('div');
                announcement.className = 'sr-only';
                announcement.setAttribute('role', 'alert');
                announcement.setAttribute('aria-live', 'assertive');
                announcement.textContent = `Form submission failed. Please correct the ${errorCount} error${errorCount > 1 ? 's' : ''} in the form.`;
                
                document.body.appendChild(announcement);
                
                // Remove announcement after screen reader reads it
                setTimeout(() => announcement.remove(), 3000);
            }
        }
        
        submitForm() {
            // Show loading state
            const submitButton = this.form.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.classList.add('loading');
                submitButton.disabled = true;
            }
            
            // In production, this would be an AJAX request to the server
            // For now, simulate API call
            setTimeout(() => {
                // Reset form
                this.form.reset();
                
                // Show success message
                this.showSuccess();
                
                // Reset button state
                if (submitButton) {
                    submitButton.classList.remove('loading');
                    submitButton.disabled = false;
                }
            }, 1500);
        }
        
        showSuccess() {
            // Find the appropriate success modal
            let modal;
            if (this.form.id === 'booking-form') {
                modal = document.querySelector('.confirmation-modal');
            } else if (this.form.id === 'contact-form') {
                modal = document.querySelector('.contact-modal');
            } else {
                // Fallback to alert
                alert('Thank you! Your submission has been received.');
                return;
            }
            
            if (modal) {
                modal.classList.add('active');
                modal.setAttribute('aria-hidden', 'false');
                
                // Generate booking reference if applicable
                if (this.form.id === 'booking-form') {
                    const reference = `MCG-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
                    const referenceElement = modal.querySelector('#reference-number');
                    if (referenceElement) {
                        referenceElement.textContent = reference;
                    }
                }
                
                // Focus the close button
                const closeButton = modal.querySelector('button');
                if (closeButton) {
                    closeButton.focus();
                    
                    // Handle modal close
                    const closeModal = () => {
                        modal.classList.remove('active');
                        modal.setAttribute('aria-hidden', 'true');
                    };
                    
                    closeButton.addEventListener('click', closeModal);
                    
                    // Close on escape
                    document.addEventListener('keydown', (e) => {
                        if (e.key === 'Escape' && modal.classList.contains('active')) {
                            closeModal();
                        }
                    });
                    
                    // Close on background click
                    modal.addEventListener('click', (e) => {
                        if (e.target === modal) {
                            closeModal();
                        }
                    });
                }
            }
        }
        
        destroy() {
            this.form.removeEventListener('submit', (e) => this.handleSubmit(e));
            this.fields.forEach(field => {
                field.removeEventListener('blur', () => this.validateField(field));
                field.removeEventListener('input', debounce(() => {
                    if (field.value.trim()) {
                        this.validateField(field);
                    }
                }, 300));
                field.removeEventListener('focus', () => this.clearFieldError(field));
            });
        }
    }
    
    // Utility function
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
    
    // Initialize all forms on the page
    document.addEventListener('DOMContentLoaded', () => {
        const forms = document.querySelectorAll('form[novalidate]');
        const validators = [];
        
        forms.forEach(form => {
            validators.push(new FormValidator(form));
        });
        
        // Make validators available globally if needed
        window.MonteCarloValidators = validators;
    });

})();