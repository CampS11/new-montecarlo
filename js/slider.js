/**
 * Monte Carlo Guesthouse - Hero Slider
 * Production-ready image slider/carousel
 */

(function() {
    'use strict';

    class HeroSlider {
        constructor() {
            this.slider = document.querySelector('.hero-slider');
            if (!this.slider) return;
            
            this.slides = this.slider.querySelectorAll('.hero-slide');
            this.dots = this.slider.querySelectorAll('.dot');
            this.prevBtn = this.slider.querySelector('.slider-prev');
            this.nextBtn = this.slider.querySelector('.slider-next');
            
            this.currentIndex = 0;
            this.totalSlides = this.slides.length;
            this.autoSlideInterval = null;
            this.autoSlideDelay = 5000; // 5 seconds
            this.isAnimating = false;
            this.animationDuration = 600; // Match CSS transition
            
            this.init();
        }
        
        init() {
            console.log('Hero Slider - Initializing');
            
            // Set initial state
            this.updateSlider();
            
            // Start autoplay
            this.startAutoSlide();
            
            // Add event listeners
            this.addEventListeners();
            
            // Preload images for better performance
            this.preloadImages();
        }
        
        addEventListeners() {
            // Previous/Next buttons
            if (this.prevBtn) {
                this.prevBtn.addEventListener('click', () => this.prevSlide());
            }
            
            if (this.nextBtn) {
                this.nextBtn.addEventListener('click', () => this.nextSlide());
            }
            
            // Dot navigation
            this.dots.forEach((dot, index) => {
                dot.addEventListener('click', () => this.goToSlide(index));
            });
            
            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') this.prevSlide();
                if (e.key === 'ArrowRight') this.nextSlide();
                if (e.key === 'Home') this.goToSlide(0);
                if (e.key === 'End') this.goToSlide(this.totalSlides - 1);
            });
            
            // Pause autoplay on hover
            this.slider.addEventListener('mouseenter', () => this.pauseAutoSlide());
            this.slider.addEventListener('mouseleave', () => this.startAutoSlide());
            
            // Pause autoplay when tab is not visible
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    this.pauseAutoSlide();
                } else {
                    this.startAutoSlide();
                }
            });
            
            // Touch/swipe support for mobile
            this.addTouchSupport();
        }
        
        addTouchSupport() {
            let touchStartX = 0;
            let touchEndX = 0;
            const minSwipeDistance = 50;
            
            this.slider.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
                this.pauseAutoSlide();
            }, { passive: true });
            
            this.slider.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                const distance = touchStartX - touchEndX;
                
                if (Math.abs(distance) > minSwipeDistance) {
                    if (distance > 0) {
                        this.nextSlide();
                    } else {
                        this.prevSlide();
                    }
                }
                
                this.startAutoSlide();
            }, { passive: true });
        }
        
        prevSlide() {
            if (this.isAnimating) return;
            
            this.currentIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
            this.updateSlider();
            this.resetAutoSlide();
        }
        
        nextSlide() {
            if (this.isAnimating) return;
            
            this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
            this.updateSlider();
            this.resetAutoSlide();
        }
        
        goToSlide(index) {
            if (this.isAnimating || index === this.currentIndex || index < 0 || index >= this.totalSlides) {
                return;
            }
            
            this.currentIndex = index;
            this.updateSlider();
            this.resetAutoSlide();
        }
        
        updateSlider() {
            this.isAnimating = true;
            
            // Update slides
            this.slides.forEach((slide, index) => {
                const isActive = index === this.currentIndex;
                slide.classList.toggle('active', isActive);
                slide.setAttribute('aria-hidden', !isActive);
                
                // Update ARIA live region for screen readers
                if (isActive) {
                    const title = slide.querySelector('.hero-title')?.textContent || '';
                    const subtitle = slide.querySelector('.hero-subtitle')?.textContent || '';
                    
                    this.updateLiveRegion(title, subtitle);
                }
            });
            
            // Update dots
            this.dots.forEach((dot, index) => {
                const isActive = index === this.currentIndex;
                dot.classList.toggle('active', isActive);
                dot.setAttribute('aria-selected', isActive);
                dot.setAttribute('tabindex', isActive ? '0' : '-1');
            });
            
            // Update slider ARIA label
            this.slider.setAttribute('aria-label', `Slide ${this.currentIndex + 1} of ${this.totalSlides}`);
            
            // Reset animation flag
            setTimeout(() => {
                this.isAnimating = false;
            }, this.animationDuration);
        }
        
        updateLiveRegion(title, subtitle) {
            let liveRegion = this.slider.querySelector('.slider-live-region');
            if (!liveRegion) {
                liveRegion = document.createElement('div');
                liveRegion.className = 'sr-only';
                liveRegion.setAttribute('aria-live', 'polite');
                liveRegion.setAttribute('aria-atomic', 'true');
                this.slider.appendChild(liveRegion);
            }
            
            liveRegion.textContent = `${title}. ${subtitle}`;
        }
        
        startAutoSlide() {
            if (this.autoSlideInterval) {
                clearInterval(this.autoSlideInterval);
            }
            
            this.autoSlideInterval = setInterval(() => {
                this.nextSlide();
            }, this.autoSlideDelay);
        }
        
        pauseAutoSlide() {
            if (this.autoSlideInterval) {
                clearInterval(this.autoSlideInterval);
                this.autoSlideInterval = null;
            }
        }
        
        resetAutoSlide() {
            this.pauseAutoSlide();
            this.startAutoSlide();
        }
        
        preloadImages() {
            // Preload next and previous slides for smoother transitions
            const preloadIndexes = [
                (this.currentIndex + 1) % this.totalSlides,
                (this.currentIndex - 1 + this.totalSlides) % this.totalSlides
            ];
            
            preloadIndexes.forEach(index => {
                const slide = this.slides[index];
                const bgImage = slide.querySelector('.hero-image').style.backgroundImage;
                const imageUrl = bgImage.replace(/url\(['"]?(.*?)['"]?\)/, '$1');
                
                if (imageUrl) {
                    const img = new Image();
                    img.src = imageUrl;
                }
            });
        }
        
        destroy() {
            this.pauseAutoSlide();
            
            // Remove event listeners
            if (this.prevBtn) {
                this.prevBtn.removeEventListener('click', () => this.prevSlide());
            }
            
            if (this.nextBtn) {
                this.nextBtn.removeEventListener('click', () => this.nextSlide());
            }
            
            this.dots.forEach((dot, index) => {
                dot.removeEventListener('click', () => this.goToSlide(index));
            });
            
            document.removeEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') this.prevSlide();
                if (e.key === 'ArrowRight') this.nextSlide();
            });
        }
    }
    
    // Initialize slider when DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
        const slider = new HeroSlider();
        
        // Make slider available globally if needed
        window.MonteCarloSlider = slider;
    });

})();