// Add this inside GalleryLightbox class or as a separate module
class GalleryManager {
  constructor() {
    this.filterButtons = document.querySelectorAll('.filter-btn');
    this.galleryItems = document.querySelectorAll('.gallery-item');
    this.lightbox = new GalleryLightbox(); // your existing class
    this.initFilters();
  }

  initFilters() {
    this.filterButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const filter = btn.dataset.filter;
        // update active button style
        this.filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.applyFilter(filter);
      });
    });
  }

  applyFilter(filter) {
    let visibleCount = 0;
    this.galleryItems.forEach(item => {
      const matches = filter === 'all' || item.dataset.category === filter;
      item.style.display = matches ? '' : 'none';
      if (matches) visibleCount++;
    });
    // Rebuild lightbox image list (only visible items)
    this.lightbox.updateImageList(
      Array.from(document.querySelectorAll('.gallery-item:not([style*="display: none"]) img'))
    );
  }
}

// Then modify GalleryLightbox to accept dynamic image list
class GalleryLightbox {
  constructor(imageList = null) {
    this.images = imageList || document.querySelectorAll('.gallery-grid img');
    // ... rest of constructor
  }

  updateImageList(newImages) {
    this.images = newImages;
    this.totalImages = this.images.length;
    if (this.totalCount) this.totalCount.textContent = this.totalImages;
    this.currentImageIndex = 0;
    if (this.isOpen) this.updateLightboxContent();
  }
  // ... rest of class
}