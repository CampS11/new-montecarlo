(function() {
    // --- SCROLL REVEAL (fade-up) ---
    const fadeElements = document.querySelectorAll('.fade-up');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -30px 0px" });
    fadeElements.forEach(el => observer.observe(el));

    // manually reveal cards that are already visible on load (just in case)
    if (fadeElements.length) {
        fadeElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 80) {
                el.classList.add('revealed');
                observer.unobserve(el);
            }
        });
    }

    // --- FORM HANDLING (simulate submission) ---
    const formContainer = document.getElementById('formContainer');
    const contactForm = document.getElementById('contactForm');
    const successDiv = document.getElementById('successMessage');
    const resetBtn = document.getElementById('resetFormBtn');
    const submitBtn = document.getElementById('submitBtn');

    function showSuccessAndResetForm() {
        // hide form, show success
        if (contactForm) contactForm.style.display = 'none';
        if (successDiv) successDiv.classList.remove('hidden');
        // clear form fields after success (optional but better UX)
        if (contactForm) {
            const inputs = contactForm.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                if (input.type !== 'submit' && input.type !== 'button') {
                    input.value = '';
                }
            });
            // special reset for select default
            const subjectSelect = document.getElementById('subjectSelect');
            if (subjectSelect) subjectSelect.value = '';
        }
    }

    function resetToForm() {
        if (contactForm) contactForm.style.display = 'block';
        if (successDiv) successDiv.classList.add('hidden');
        // optionally no extra clear because we already cleared on submit, but ensure consistency
    }

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Basic HTML5 validation already active, but extra check
            const name = document.getElementById('fullName')?.value.trim();
            const email = document.getElementById('emailAddr')?.value.trim();
            const subject = document.getElementById('subjectSelect')?.value;
            const message = document.getElementById('messageText')?.value.trim();
            if (!name || !email || !subject || !message) {
                // let browser validation handle or small alert
                if (!name) document.getElementById('fullName')?.focus();
                else if (!email) document.getElementById('emailAddr')?.focus();
                else if (!subject) document.getElementById('subjectSelect')?.focus();
                else if (!message) document.getElementById('messageText')?.focus();
                return;
            }
            if (!email.includes('@')) {
                alert('Please enter a valid email address.');
                return;
            }
            // disable button to avoid double submission
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-pulse"></i> Sending...';
            }
            // simulate network delay (1 sec like original)
            setTimeout(() => {
                showSuccessAndResetForm();
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
                }
            }, 1000);
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            resetToForm();
            // re-clear fields just to be safe (already cleared earlier but ensure)
            if (contactForm) {
                const allInputs = contactForm.querySelectorAll('input, textarea, select');
                allInputs.forEach(field => {
                    if (field.type !== 'submit' && field.type !== 'button') {
                        if (field.tagName === 'SELECT') field.value = '';
                        else field.value = '';
                    }
                });
            }
        });
    }

    // ensure form is visible initially, success hidden
    if (contactForm) contactForm.style.display = 'block';
    if (successDiv) successDiv.classList.add('hidden');

    // --- SMOOTH SCROLL for "View on Map" link ---
    const mapLink = document.querySelector('a[href="#map"]');
    if (mapLink) {
        mapLink.addEventListener('click', function(e) {
            e.preventDefault();
            const mapSection = document.getElementById('map');
            if (mapSection) {
                mapSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    // Staggered animation delay for cards (enhance visual)
    const cards = document.querySelectorAll('.grid .fade-up');
    if (cards.length) {
        cards.forEach((card, idx) => {
            card.style.transitionDelay = `${idx * 0.08}s`;
        });
    }

    // small hover interactions for info card links
    const infoLinks = document.querySelectorAll('.bg-white a.text-amber-600');
    infoLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.transform = 'translateX(2px)';
        });
        link.addEventListener('mouseleave', () => {
            link.style.transform = 'translateX(0)';
        });
    });
})();