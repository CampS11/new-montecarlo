// images.js - Simple Image Replacement
const IMAGES = {
  // HERO SLIDES
  hero1: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
  hero2: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
  hero3: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
  
  // ROOMS
  standardRoom: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  deluxeRoom: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  executiveSuite: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  
  // ABOUT
  aboutHistory: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  aboutOwner: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  
  // GALLERY (6 images)
  gallery: [
    'https://images.unsplash.com/photo-1568495248636-6432b97bd949?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1508166466924-7c6c56df18f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1523805009345-7448845a9e53?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  ]
};

// Auto-replace function
function replaceAllImages() {
  // Replace hero images
  document.querySelectorAll('.hero-image').forEach((img, index) => {
    if (index === 0) img.style.backgroundImage = `url('${IMAGES.hero1}')`;
    if (index === 1) img.style.backgroundImage = `url('${IMAGES.hero2}')`;
    if (index === 2) img.style.backgroundImage = `url('${IMAGES.hero3}')`;
  });
  
  // Replace room images
  document.querySelectorAll('img[src*="standard-room"]').forEach(img => {
    img.src = IMAGES.standardRoom;
  });
  
  // Add to each HTML file before </body>
  // <script src="js/images.js"></script>
  // <script>replaceAllImages();</script>
}