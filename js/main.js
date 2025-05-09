/* 
 * Josef Berman - Data Scientist Portfolio
 * Main JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    // Variables
    const themeToggle = document.querySelector('.theme-toggle');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');
    const header = document.querySelector('header');
    
    // Theme Toggle
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        updateThemeIcon();
        
        // Save preference to localStorage
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        updateThemeIcon();
    }
    
    // Update theme icon based on current theme
    function updateThemeIcon() {
        const icon = themeToggle.querySelector('i');
        if (document.body.classList.contains('dark-mode')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }
    
    // Mobile Menu Toggle
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        
        // Toggle between hamburger and X icon
        const icon = mobileMenuBtn.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // Close mobile menu when a link is clicked
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
            
            // Reset icon
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
            
            // Set active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
        });
    });
    
    // Header scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Calculate header height dynamically
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Update active nav link on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');
        const headerHeight = header.offsetHeight;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });
    
    // Initialize swarm animation
    initSwarmAnimation();
});

// Swarm Animation
function initSwarmAnimation() {
    const canvas = document.getElementById('swarmCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const parentRect = canvas.parentElement.getBoundingClientRect();
    
    // Set canvas dimensions to match parent
    canvas.width = parentRect.width;
    canvas.height = parentRect.height || 400;
    
    // Particles array
    const particles = [];
    const particleCount = 80;
    
    // Mouse position
    let mouse = {
        x: null,
        y: null,
        radius: 100
    };
    
    // Capture mouse position
    window.addEventListener('mousemove', (event) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = event.x - rect.left;
        mouse.y = event.y - rect.top;
    });
    
    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 4 + 1; // Slightly larger particles
            this.baseX = this.x;
            this.baseY = this.y;
            this.density = Math.random() * 20 + 5;
            this.color = getRandomColor();
            this.speed = 0.3;
            this.angle = Math.random() * 2 * Math.PI; // Random direction
            this.velocity = {
                x: Math.cos(this.angle) * this.speed,
                y: Math.sin(this.angle) * this.speed
            };
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            
            // Draw connections with nearby particles
            for (let i = 0; i < particles.length; i++) {
                const dx = this.x - particles[i].x;
                const dy = this.y - particles[i].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) { // Increased connection distance
                    ctx.beginPath();
                    ctx.strokeStyle = this.color;
                    ctx.globalAlpha = 0.2 - (distance / 600); // More subtle connections
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(this.x, this.y);
                    ctx.lineTo(particles[i].x, particles[i].y);
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                }
            }
        }
        
        update() {
            // Mouse interaction
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouse.radius) {
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const force = (mouse.radius - distance) / mouse.radius;
                
                const directionX = forceDirectionX * force * this.density;
                const directionY = forceDirectionY * force * this.density;
                
                this.x += directionX * 0.3; // Attraction instead of repulsion
                this.y += directionY * 0.3;
            } else {
                // Natural movement
                this.x += this.velocity.x;
                this.y += this.velocity.y;
                
                // Slightly change direction randomly
                this.velocity.x += (Math.random() - 0.5) * 0.05;
                this.velocity.y += (Math.random() - 0.5) * 0.05;
                
                // Dampen velocity to prevent extreme speeds
                this.velocity.x *= 0.98;
                this.velocity.y *= 0.98;
            }
            
            // Keep within canvas with bounce effect
            if (this.x <= 0 || this.x >= canvas.width) {
                this.velocity.x = -this.velocity.x;
            }
            if (this.y <= 0 || this.y >= canvas.height) {
                this.velocity.y = -this.velocity.y;
            }
            
            this.draw();
        }
    }
    
    // Initialize particles
    function init() {
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
        }
        
        requestAnimationFrame(animate);
    }
    
    // Random color generator - Using orange shades to match the theme
    function getRandomColor() {
        const orangeShades = [
            'rgba(255, 112, 67, 0.8)',  // Primary orange
            'rgba(255, 171, 145, 0.6)', // Light orange
            'rgba(230, 74, 25, 0.7)',   // Dark orange
            'rgba(255, 112, 67, 0.5)'   // Semi-transparent orange
        ];
        
        return orangeShades[Math.floor(Math.random() * orangeShades.length)];
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        const parentRect = canvas.parentElement.getBoundingClientRect();
        canvas.width = parentRect.width;
        canvas.height = parentRect.height || 400;
        
        // Reset particles
        particles.length = 0;
        init();
    });
    
    // Start animation
    init();
    animate();
}

// Add scroll reveal animations
window.addEventListener('load', () => {
    // Check if IntersectionObserver is supported
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        // Observe elements with fade-in class
        const fadeElements = document.querySelectorAll('.section');
        fadeElements.forEach(el => {
            el.classList.add('fade-in');
            observer.observe(el);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        document.querySelectorAll('.section').forEach(el => {
            el.classList.add('visible');
        });
    }
}); 