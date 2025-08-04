// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Fade in animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Add fade-in class to elements and observe them
    const animateElements = document.querySelectorAll('.activity-card, .plan-card, .material-category, .objective-card, .safety-card, .section-title');
    
    animateElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Mobile menu toggle (if needed in future)
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // Add background to navbar on scroll
        if (currentScrollY > 100) {
            navbar.style.background = 'rgba(102, 126, 234, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.background = 'transparent';
            navbar.style.backdropFilter = 'none';
        }
        
        lastScrollY = currentScrollY;
    });

    // Interactive hover effects for activity cards
    const activityCards = document.querySelectorAll('.activity-card');
    
    activityCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Progress indicator for learning objectives
    const objectiveCards = document.querySelectorAll('.objective-card');
    
    objectiveCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        
        card.addEventListener('click', function() {
            // Toggle expanded state
            this.classList.toggle('expanded');
            
            // Add visual feedback
            this.style.borderTopColor = this.classList.contains('expanded') ? '#52c41a' : '#667eea';
        });
    });

    // Safety alerts interaction
    const safetyItems = document.querySelectorAll('.safety-list li');
    
    safetyItems.forEach(item => {
        item.addEventListener('click', function() {
            this.style.backgroundColor = '#fff2e8';
            this.style.borderLeft = '4px solid #fa8c16';
            
            setTimeout(() => {
                this.style.backgroundColor = '';
                this.style.borderLeft = '';
            }, 2000);
        });
    });

    // Material list interaction
    const materialItems = document.querySelectorAll('.material-list li');
    
    materialItems.forEach(item => {
        item.addEventListener('click', function() {
            // Add checkmark animation
            const originalText = this.textContent;
            this.textContent = '✓ ' + originalText;
            this.style.color = '#52c41a';
            this.style.fontWeight = '600';
            
            setTimeout(() => {
                this.textContent = originalText;
                this.style.color = '';
                this.style.fontWeight = '';
            }, 1500);
        });
    });

    // Dynamic content loading simulation
    function simulateContentLoading() {
        const cards = document.querySelectorAll('.activity-card, .plan-card');
        
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }

    // Activity timer simulation
    function startActivityTimer(activityElement, duration) {
        const timeElement = activityElement.querySelector('.activity-time');
        if (!timeElement) return;
        
        let remainingTime = duration;
        const originalText = timeElement.textContent;
        
        const timer = setInterval(() => {
            if (remainingTime <= 0) {
                clearInterval(timer);
                timeElement.textContent = '✓ เสร็จสิ้น';
                timeElement.style.backgroundColor = '#f6ffed';
                timeElement.style.color = '#52c41a';
                return;
            }
            
            const hours = Math.floor(remainingTime / 60);
            const minutes = remainingTime % 60;
            timeElement.textContent = `⏰ เหลือ ${hours}:${minutes.toString().padStart(2, '0')}`;
            remainingTime--;
        }, 60000); // Update every minute (for demo, using shorter interval)
        
        // For demo purposes, complete after 5 seconds
        setTimeout(() => {
            clearInterval(timer);
            timeElement.textContent = originalText;
        }, 5000);
    }

    // Assessment level indicator
    const assessmentLevels = document.querySelectorAll('.level, .score-range');
    
    assessmentLevels.forEach(level => {
        level.addEventListener('click', function() {
            // Highlight selected level
            assessmentLevels.forEach(l => l.classList.remove('selected'));
            this.classList.add('selected');
            
            // Add selection styling
            this.style.transform = 'scale(1.05)';
            this.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
            
            setTimeout(() => {
                this.style.transform = '';
                this.style.boxShadow = '';
            }, 300);
        });
    });

    // Footer year update
    const currentYear = new Date().getFullYear();
    const footerYear = document.querySelector('.footer-bottom p');
    if (footerYear && footerYear.textContent.includes('2024')) {
        footerYear.textContent = footerYear.textContent.replace('2024', currentYear);
    }

    // Search functionality (basic implementation)
    function addSearchFunctionality() {
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'ค้นหากิจกรรม...';
        searchInput.className = 'search-input';
        searchInput.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 10px;
            border: 2px solid #667eea;
            border-radius: 25px;
            background: rgba(255,255,255,0.9);
            backdrop-filter: blur(10px);
            z-index: 1000;
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(searchInput);
        
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const searchableElements = document.querySelectorAll('.activity-card, .material-list li');
            
            searchableElements.forEach(element => {
                const text = element.textContent.toLowerCase();
                if (text.includes(searchTerm) || searchTerm === '') {
                    element.style.display = '';
                    element.style.opacity = '1';
                } else {
                    element.style.opacity = '0.3';
                }
            });
        });
    }

    // Initialize search functionality
    addSearchFunctionality();

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Press 'S' to focus search
        if (e.key === 's' || e.key === 'S') {
            e.preventDefault();
            const searchInput = document.querySelector('.search-input');
            if (searchInput) {
                searchInput.focus();
            }
        }
        
        // Press 'Escape' to clear search
        if (e.key === 'Escape') {
            const searchInput = document.querySelector('.search-input');
            if (searchInput) {
                searchInput.value = '';
                searchInput.dispatchEvent(new Event('input'));
            }
        }
    });

    // Print functionality
    function addPrintButton() {
        const printButton = document.createElement('button');
        printButton.innerHTML = '<i class="fas fa-print"></i> พิมพ์';
        printButton.className = 'print-button';
        printButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 15px 20px;
            background: linear-gradient(45deg, #667eea, #764ba2);
            color: white;
            border: none;
            border-radius: 50px;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 1000;
            transition: all 0.3s ease;
            font-family: 'Kanit', sans-serif;
            font-weight: 500;
        `;
        
        printButton.addEventListener('click', () => {
            window.print();
        });
        
        printButton.addEventListener('mouseenter', () => {
            printButton.style.transform = 'translateY(-3px)';
            printButton.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
        });
        
        printButton.addEventListener('mouseleave', () => {
            printButton.style.transform = '';
            printButton.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
        });
        
        document.body.appendChild(printButton);
    }

    // Initialize print functionality
    addPrintButton();

    // Performance monitoring
    const perfObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (entry.entryType === 'navigation') {
                console.log('Page load time:', entry.loadEventEnd - entry.loadEventStart, 'ms');
            }
        }
    });
    
    if ('PerformanceObserver' in window) {
        perfObserver.observe({ entryTypes: ['navigation'] });
    }

    console.log('🔌 Electric Circuit Teaching Platform Loaded Successfully!');
    console.log('⚡ Ready for interactive learning experience');
});