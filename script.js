// DOM Elements
const themeSwitch = document.getElementById('theme-switch');
const beginnerSwitch = document.getElementById('beginner-switch');
const searchInput = document.getElementById('search-input');
const filterButtons = document.querySelectorAll('.filter-btn');
const scrollTopBtn = document.getElementById('scroll-top');
const resourceCards = document.querySelectorAll('.resource-card');
const categorySections = document.querySelectorAll('.category-section');
const resultsCount = document.getElementById('results-count');

// Theme Toggle
function initThemeToggle() {
    // Check for saved theme preference or use preferred color scheme
    const savedTheme = localStorage.getItem('theme') || 
                      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    // Apply saved theme on page load
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        themeSwitch.checked = true;
    }

    // Theme toggle event listener
    themeSwitch.addEventListener('change', () => {
        if (themeSwitch.checked) {
            document.body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        }
        
        // Add animation to logo on theme change
        document.querySelector('.logo').style.animation = 'pulse 0.5s ease-in-out';
        setTimeout(() => {
            document.querySelector('.logo').style.animation = '';
        }, 500);
    });
}

// Search functionality
function initSearch() {
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        let visibleCards = 0;
        
        resourceCards.forEach(card => {
            const cardText = card.textContent.toLowerCase();
            const isVisible = cardText.includes(searchTerm);
            
            if (isVisible) {
                card.style.display = 'block';
                visibleCards++;
            } else {
                card.style.display = 'none';
            }
        });
        
        // Update section visibility based on visible cards
        categorySections.forEach(section => {
            const hasVisibleCards = Array.from(section.querySelectorAll('.resource-card')).some(card => card.style.display !== 'none');
            section.style.display = hasVisibleCards ? 'block' : 'none';
        });
        
        // Update results count
        updateResultsCount(visibleCards);
    });
}

// Filter functionality
function initFilters() {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // Update active button state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Reset search
            searchInput.value = '';
            
            let visibleCards = 0;
            
            // Show/hide sections based on filter
            if (filter === 'all') {
                categorySections.forEach(section => section.style.display = 'block');
                resourceCards.forEach(card => {
                    card.style.display = 'block';
                    visibleCards++;
                });
            } else {
                categorySections.forEach(section => {
                    const category = section.getAttribute('data-category');
                    if (category === filter) {
                        section.style.display = 'block';
                        // Show all cards in this section
                        section.querySelectorAll('.resource-card').forEach(card => {
                            card.style.display = 'block';
                            visibleCards++;
                        });
                    } else {
                        section.style.display = 'none';
                    }
                });
            }
            
            // Animate cards
            animateCards();
            
            // Update results count
            updateResultsCount(visibleCards);
        });
    });
}

// Update results count display
function updateResultsCount(count) {
    const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
    let filterText = activeFilter === 'all' ? 'all' : activeFilter.replace('-', ' ');
    
    // Special case for serverless to call it "cloud functions"
    if (filterText === 'serverless') {
        filterText = 'cloud functions';
    }
    
    resultsCount.textContent = `Showing ${count} ${filterText} resources`;
    
    // Add animation to results count
    resultsCount.style.animation = 'fadeIn 0.3s ease-in-out';
    setTimeout(() => {
        resultsCount.style.animation = '';
    }, 300);
}

// Scroll to top button and sticky info bar
function initScrollToTop() {
    const stickyInfoBar = document.getElementById('sticky-info-bar');
    let lastScrollPosition = 0;
    const scrollThreshold = 300;
    
    window.addEventListener('scroll', () => {
        const currentScrollPosition = window.pageYOffset;
        
        // Show scroll-to-top button
        if (currentScrollPosition > scrollThreshold) {
            scrollTopBtn.classList.add('visible');
            
            // Also show sticky info bar when scrolling down
            stickyInfoBar.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
            
            // Hide sticky info bar when near the top
            stickyInfoBar.classList.remove('visible');
        }
        
        lastScrollPosition = currentScrollPosition;
    });
    
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Animate cards entry
function animateCards() {
    resourceCards.forEach((card, index) => {
        if (!card.classList.contains('hidden')) {
            card.style.opacity = '0';
            card.style.setProperty('--animation-order', index % 4);
            
            setTimeout(() => {
                card.style.animation = 'fadeIn 0.5s ease-out forwards';
            }, 50 * (index % 4));
        }
    });
}

// Smooth scrolling for navigation links
function initSmoothScroll() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 20;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize animations for cards
function initCardAnimations() {
    resourceCards.forEach((card, index) => {
        card.style.setProperty('--animation-order', index % 4);
        card.style.opacity = '0';
        
        // Observer for animation on scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        card.style.animation = 'fadeIn 0.5s ease-out forwards';
                    }, 50 * (index % 4));
                    observer.unobserve(card);
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(card);
    });
}

// Interactive card hover effects
function initCardInteractivity() {
    resourceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// Track initial count of visible resources
function initResultsCount() {
    updateResultsCount(resourceCards.length);
}

// Add interactive elements to card links
function initCardLinks() {
    document.querySelectorAll('.card-footer a').forEach(link => {
        link.addEventListener('click', (e) => {
            // Get the link href but don't prevent default - this allows normal behavior
            const href = link.getAttribute('href');
            
            // Just open in new tab without animation or preventing default
            window.open(href, '_blank');
            
            // Important: prevent the default as the last step to avoid issues
            e.preventDefault();
        });
    });
}

// Initialize beginner mode
function initBeginnerMode() {
    // Check for saved beginner mode preference
    const savedBeginnerMode = localStorage.getItem('beginnerMode') === 'true';
    
    // Apply saved beginner mode on page load
    if (savedBeginnerMode) {
        document.body.classList.add('beginner-mode');
        beginnerSwitch.checked = true;
        // Setup toggles immediately if info mode is enabled on load
        setupExplanationToggles();
    }
    
    // Beginner mode toggle event listener
    beginnerSwitch.addEventListener('change', () => {
        if (beginnerSwitch.checked) {
            document.body.classList.add('beginner-mode');
            localStorage.setItem('beginnerMode', 'true');
            
            // Setup toggles
            setupExplanationToggles();
            
            // Animate explanations toggles with staggered delay
            document.querySelectorAll('.explanation-toggle').forEach((toggle, index) => {
                toggle.style.animation = 'fadeIn 0.3s ease-out forwards';
                toggle.style.animationDelay = `${0.05 * index}s`;
            });
        } else {
            document.body.classList.remove('beginner-mode');
            localStorage.setItem('beginnerMode', 'false');
            
            // Close all explanation contents when turning off detailed info mode
            document.querySelectorAll('.explanation-content.active').forEach(content => {
                content.classList.remove('active');
            });
            document.querySelectorAll('.explanation-toggle.active').forEach(toggle => {
                toggle.classList.remove('active');
            });
        }
    });
}

// Setup click handlers for explanation toggles
function setupExplanationToggles() {
    // First remove any existing event listeners to prevent duplicates
    document.querySelectorAll('.explanation-toggle').forEach(toggle => {
        const newToggle = toggle.cloneNode(true);
        toggle.parentNode.replaceChild(newToggle, toggle);
    });
    
    // Then add fresh event listeners
    document.querySelectorAll('.explanation-toggle').forEach(toggle => {
        toggle.addEventListener('click', function() {
            const content = this.nextElementSibling;
            
            // Toggle active state
            this.classList.toggle('active');
            content.classList.toggle('active');
            
            // If opening this explanation, close others in the same card
            if (this.classList.contains('active')) {
                const parentCard = this.closest('.resource-card');
                if (parentCard) {
                    parentCard.querySelectorAll('.explanation-toggle').forEach(otherToggle => {
                        if (otherToggle !== this && otherToggle.classList.contains('active')) {
                            otherToggle.classList.remove('active');
                            otherToggle.nextElementSibling.classList.remove('active');
                        }
                    });
                }
            }
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initBeginnerMode();
    setupExplanationToggles(); // Call once at startup to ensure toggles are ready
    initSearch();
    initFilters();
    initScrollToTop();
    initSmoothScroll();
    initCardAnimations();
    initCardInteractivity();
    initResultsCount();
    initCardLinks();
    
    // Add animation delay to each section
    categorySections.forEach((section, index) => {
        section.style.animationDelay = `${0.1 * (index + 1)}s`;
    });
    
    // Logo click to reset
    document.querySelector('.logo').addEventListener('click', () => {
        // Reset filter
        document.querySelector('.filter-btn[data-filter="all"]').click();
        
        // Scroll to top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});