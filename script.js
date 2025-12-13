// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const logoLink = document.querySelector('.logo-link');
const sections = document.querySelectorAll('section');
const hero = document.querySelector('.hero');

// Initialize first section as active
if (sections.length > 0) {
    sections[0].classList.add('active');
}

// Page Transition Function
function showSection(sectionId) {
    sections.forEach(section => {
        section.classList.remove('active');
        section.style.display = 'none';
    });
    
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';
        // Scroll to top of page
        window.scrollTo(0, 0);
        setTimeout(() => {
            targetSection.classList.add('active');
        }, 10);
    }
}

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.style.animation = 'none';
    setTimeout(() => {
        hamburger.style.animation = '';
    }, 10);
});

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            const sectionId = href.slice(1);
            
            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Show section with transition
            showSection(sectionId);
            
            // Close mobile menu
            navMenu.classList.remove('active');
        }
    });
});

// Handle logo click to go to home
if (logoLink) {
    logoLink.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Update active nav link
        navLinks.forEach(l => l.classList.remove('active'));
        document.querySelector('a[href="#home"]').classList.add('active');
        
        // Show home section with transition
        showSection('home');
        
        // Close mobile menu
        navMenu.classList.remove('active');
    });
}

// Handle CTA button
const ctaButton = document.querySelector('.cta-button');
if (ctaButton) {
    ctaButton.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = ctaButton.getAttribute('href').slice(1);
        
        // Update active nav link
        navLinks.forEach(l => l.classList.remove('active'));
        document.querySelector(`a[href="#${sectionId}"]`).classList.add('active');
        
        // Show section with transition
        showSection(sectionId);
    });
}

// Gallery Filter Functionality
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        galleryItems.forEach(item => {
            if (filter === 'all') {
                item.classList.remove('hidden');
            } else {
                const category = item.getAttribute('data-category');
                if (category === filter) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            }
        });
    });
});



// Form Submission - Let Formspree handle it naturally
// The form will submit to Formspree with method="POST" and action attribute

// Image Modal Functionality
const modal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const modalDetails = document.getElementById('modalDetails');
const modalCardFlip = document.getElementById('modalCardFlip');
const modalCardInner = document.querySelector('.modal-card-inner');
const modalClose = document.querySelector('.modal-close');
const zoomInBtn = document.getElementById('zoomIn');
const zoomOutBtn = document.getElementById('zoomOut');
const zoomResetBtn = document.getElementById('zoomReset');
const zoomLevel = document.getElementById('zoomLevel');
const prevImageBtn = document.getElementById('prevImage');
const nextImageBtn = document.getElementById('nextImage');

let currentZoom = 100;
let currentImageIndex = 0;
const visibleGalleryItems = Array.from(galleryItems).filter(item => {
    return item.style.display !== 'none';
});

function getVisibleItems() {
    return Array.from(galleryItems).filter(item => {
        return item.style.display !== 'none';
    });
}

galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        const visibleItems = getVisibleItems();
        currentImageIndex = visibleItems.indexOf(item);
        openModalWithItem(item);
    });
});

function openModalWithItem(item) {
    const img = item.querySelector('img');
    const title = item.getAttribute('data-title');
    const description = item.getAttribute('data-description');
    const details = item.getAttribute('data-details');
    
    modalImage.src = img.src;
    modalImage.alt = title;
    modalTitle.textContent = title;
    modalDescription.textContent = description;
    modalDetails.textContent = details || 'More details coming soon...';
    
    // Reset flip
    modalCardInner.classList.remove('flipped');
    
    currentZoom = 100;
    resetZoom();
    modal.classList.add('show');
}

// Flip card functionality
modalCardFlip.addEventListener('click', () => {
    modalCardInner.classList.toggle('flipped');
});

function navigateImage(direction) {
    const visibleItems = getVisibleItems();
    
    if (direction === 'next') {
        currentImageIndex = (currentImageIndex + 1) % visibleItems.length;
    } else if (direction === 'prev') {
        currentImageIndex = (currentImageIndex - 1 + visibleItems.length) % visibleItems.length;
    }
    
    openModalWithItem(visibleItems[currentImageIndex]);
}

function updateZoom() {
    const scale = currentZoom / 100;
    modalImage.style.transform = `scale(${scale})`;
    zoomLevel.textContent = `${currentZoom}%`;
    
    // Disable zoom out at 100%
    zoomOutBtn.disabled = currentZoom <= 100;
    // Disable zoom in at 150%
    zoomInBtn.disabled = currentZoom >= 150;
}

function resetZoom() {
    currentZoom = 100;
    updateZoom();
    modalImage.classList.remove('zoomed');
}

zoomResetBtn.addEventListener('click', () => {
    resetZoom();
});

prevImageBtn.addEventListener('click', () => {
    navigateImage('prev');
});

nextImageBtn.addEventListener('click', () => {
    navigateImage('next');
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (modal.classList.contains('show')) {
        if (e.key === 'ArrowLeft') {
            navigateImage('prev');
        } else if (e.key === 'ArrowRight') {
            navigateImage('next');
        } else if (e.key === 'Escape') {
            modal.classList.remove('show');
        } else if (e.key === '+' || e.key === '=') {
            // Zoom in
            if (currentZoom < 150) {
                currentZoom += 10;
                updateZoom();
                if (currentZoom > 100) {
                    modalImage.classList.add('zoomed');
                }
            }
        } else if (e.key === '-' || e.key === '_') {
            // Zoom out
            if (currentZoom > 100) {
                currentZoom -= 10;
                updateZoom();
                if (currentZoom === 100) {
                    modalImage.classList.remove('zoomed');
                }
            }
        } else if (e.key === '0') {
            // Reset zoom
            resetZoom();
        }
    }
});

// Close modal with escape key
// Close modal
modalClose.addEventListener('click', () => {
    modal.classList.remove('show');
});

// Close modal when clicking outside the image
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('show');
    }
});

// Mouse wheel zoom
modal.addEventListener('wheel', (e) => {
    if (modal.classList.contains('show') && e.target === modalImage) {
        e.preventDefault();
        
        if (e.deltaY < 0) {
            // Scroll up - zoom in
            if (currentZoom < 150) {
                currentZoom += 10;
                updateZoom();
                if (currentZoom > 100) {
                    modalImage.classList.add('zoomed');
                }
            }
        } else {
            // Scroll down - zoom out
            if (currentZoom > 100) {
                currentZoom -= 10;
                updateZoom();
                if (currentZoom === 100) {
                    modalImage.classList.remove('zoomed');
                }
            }
        }
    }
}, { passive: false });

// Intersection Observer for fade-in animation
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe gallery items with animation
galleryItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(item);
});

// Observe other elements for fade-in
const aboutContent = document.querySelector('.about-content');
const contactContent = document.querySelector('.contact-content');
const exhibitionItems = document.querySelectorAll('.exhibition-item');

if (aboutContent) {
    aboutContent.style.opacity = '0';
    aboutContent.style.transform = 'translateY(30px)';
    aboutContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(aboutContent);
}

if (contactContent) {
    contactContent.style.opacity = '0';
    contactContent.style.transform = 'translateY(30px)';
    contactContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(contactContent);
}

exhibitionItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-30px)';
    item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(item);
});

// Add smooth page transitions
window.addEventListener('load', () => {
    document.body.style.animation = 'fadeIn 0.5s ease-out';
});

// Handle form submission success
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('status') === 'success') {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        const successMsg = document.createElement('div');
        successMsg.style.cssText = 'background-color: #4CAF50; color: white; padding: 15px; border-radius: 5px; margin-bottom: 20px; text-align: center; font-weight: bold;';
        successMsg.textContent = 'Message sent successfully! Thank you for contacting us.';
        contactForm.parentNode.insertBefore(successMsg, contactForm);
        
        // Clear form
        contactForm.reset();
        
        // Remove success message after 5 seconds
        setTimeout(() => {
            successMsg.remove();
            window.history.replaceState({}, document.title, window.location.pathname + '#contact');
        }, 5000);
    }
}

// Slideshow for Hero Background
const heroImages = [
    'images/portrait_of_tendekai.jpg',
    'images/portrait_of_russell.jpg'
];

let heroImageIndex = 0;

function rotateHeroImage() {
    heroImageIndex = (heroImageIndex + 1) % heroImages.length;
    hero.style.backgroundImage = `url('${heroImages[heroImageIndex]}')`;
}

// Change image every 6 seconds
if (hero) {
    setInterval(rotateHeroImage, 6000);
}

// Parallax Effect on Hero Section (disabled for compatibility)
// Parallax can be re-enabled if needed
/*
window.addEventListener('scroll', () => {
    if (hero) {
        const scrollY = window.scrollY;
        hero.style.backgroundPosition = `center ${scrollY * 0.5}px`;
    }
});
*/

// Scroll Reveal Animation for Gallery Items
const revealObserverOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            entry.target.style.animationDelay = `${index * 0.1}s`;
            entry.target.classList.add('scroll-reveal');
            revealObserver.unobserve(entry.target);
        }
    });
}, revealObserverOptions);

// Observe all gallery items
galleryItems.forEach(item => {
    revealObserver.observe(item);
});
