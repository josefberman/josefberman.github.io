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
    
    // Initialize modern particle animation
    initParticleAnimation();
});

// Modern Particle Animation
function initParticleAnimation() {
    const canvas = document.getElementById('swarmCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const parent = canvas.parentElement;
    
    // Set canvas size to match parent
    const resizeCanvas = () => {
        const rect = parent.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
    };
    
    resizeCanvas();
    
    // Particles array
    const particles = [];
    const particleCount = 100;
    
    // Mouse position for interactivity
    const mouse = {
        x: null,
        y: null,
        radius: 150
    };
    
    // Capture mouse position
    window.addEventListener('mousemove', (event) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = event.x - rect.left;
        mouse.y = event.y - rect.top;
    });
    
    // Hide mouse coordinates when leaving canvas
    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });
    
    // Enhanced Particle class
    class Particle {
        constructor() {
            // Position
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            
            // Size - varied sizes for more organic look
            this.size = Math.random() * 5 + 1;
            
            // Base position to return to
            this.baseX = this.x;
            this.baseY = this.y;
            
            // Movement properties
            this.density = Math.random() * 30 + 1;
            this.speed = Math.random() * 0.5 + 0.2;
            
            // Color - using vibrant orange tones
            this.color = this.getRandomColor();
            
            // Add slight random movement
            this.directionX = Math.random() * 2 - 1;
            this.directionY = Math.random() * 2 - 1;
            
            // Opacity for a more dynamic look
            this.opacity = Math.random() * 0.5 + 0.3;
            
            // Connection line width
            this.lineWidth = Math.random() * 2 + 0.1;
        }
        
        getRandomColor() {
            // Vibrant color palette with orange focus
            const colors = [
                'rgba(255, 112, 67, 0.8)',  // Primary orange
                'rgba(255, 171, 145, 0.6)', // Light orange
                'rgba(230, 74, 25, 0.7)',   // Dark orange
                'rgba(255, 87, 34, 0.65)',  // Deep orange
                'rgba(255, 138, 101, 0.7)'  // Medium orange
            ];
            
            return colors[Math.floor(Math.random() * colors.length)];
        }
        
        // Draw the particle
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.fill();
            ctx.globalAlpha = 1;
        }
        
        // Draw connections between particles
        drawConnections() {
            particles.forEach(particle => {
                const dx = this.x - particle.x;
                const dy = this.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Only draw connections within a certain distance
                if (distance < 150) {
                    // Calculate opacity based on distance (closer = more opaque)
                    const opacity = 1 - (distance / 150);
                    
                    ctx.beginPath();
                    ctx.strokeStyle = this.color;
                    ctx.globalAlpha = opacity * 0.2; // Subtle connections
                    ctx.lineWidth = this.lineWidth;
                    ctx.moveTo(this.x, this.y);
                    ctx.lineTo(particle.x, particle.y);
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                }
            });
        }
        
        // Update particle position and draw
        update() {
            // Mouse interaction
            if (mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouse.radius) {
                    // Calculate force and direction
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    
                    // Strength of the push/pull decreases with distance
                    const force = (mouse.radius - distance) / mouse.radius;
                    
                    // Movement based on force and direction
                    const directionX = forceDirectionX * force * this.density * 0.6;
                    const directionY = forceDirectionY * force * this.density * 0.6;
                    
                    // Move particle towards mouse
                    this.x += directionX;
                    this.y += directionY;
                } else {
                    // Autonomous movement when away from mouse
                    this.x += this.directionX * this.speed;
                    this.y += this.directionY * this.speed;
                    
                    // Gradually return to base position
                    if (this.x !== this.baseX) {
                        const dxBase = this.baseX - this.x;
                        this.x += dxBase * 0.01;
                    }
                    
                    if (this.y !== this.baseY) {
                        const dyBase = this.baseY - this.y;
                        this.y += dyBase * 0.01;
                    }
                }
            } else {
                // Default movement when mouse is not over canvas
                this.x += this.directionX * this.speed * 0.5;
                this.y += this.directionY * this.speed * 0.5;
                
                // Slightly change direction randomly for more natural movement
                this.directionX += (Math.random() * 0.4 - 0.2);
                this.directionY += (Math.random() * 0.4 - 0.2);
                
                // Dampen direction changes to prevent extreme movements
                this.directionX *= 0.99;
                this.directionY *= 0.99;
                
                // Gradually return to base position
                if (this.x !== this.baseX) {
                    const dxBase = this.baseX - this.x;
                    this.x += dxBase * 0.01;
                }
                
                if (this.y !== this.baseY) {
                    const dyBase = this.baseY - this.y;
                    this.y += dyBase * 0.01;
                }
            }
            
            // Bounce off edges
            if (this.x < 0 || this.x > canvas.width) {
                this.directionX *= -1;
            }
            
            if (this.y < 0 || this.y > canvas.height) {
                this.directionY *= -1;
            }
            
            // Keep within canvas boundaries
            this.x = Math.max(0, Math.min(canvas.width, this.x));
            this.y = Math.max(0, Math.min(canvas.height, this.y));
            
            // Draw connections and the particle
            this.drawConnections();
            this.draw();
        }
    }
    
    // Initialize particles
    function init() {
        particles.length = 0;
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Background gradient for depth
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, 'rgba(7, 22, 36, 0)');
        gradient.addColorStop(1, 'rgba(12, 30, 46, 0.1)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Update all particles
        particles.forEach(particle => {
            particle.update();
        });
        
        requestAnimationFrame(animate);
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        resizeCanvas();
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
        const fadeElements = document.querySelectorAll('.section');
        
        // Add fade-in class to all sections
        fadeElements.forEach(el => {
            el.classList.add('fade-in');
        });
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add visible class to fade in the element
                    entry.target.classList.add('visible');
                    // Unobserve after animation is done
                    observer.unobserve(entry.target);
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px' // Adjust when elements become visible
        });
        
        // Observe all fade elements
        fadeElements.forEach(el => {
            observer.observe(el);
        });
        
        // Also apply to project cards for staggered animation
        const projectCards = document.querySelectorAll('.project-card, .blog-card, .publication-item');
        projectCards.forEach((card, index) => {
            card.style.transitionDelay = `${index * 0.1}s`;
            card.classList.add('fade-in');
            observer.observe(card);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        document.querySelectorAll('.section, .project-card, .blog-card, .publication-item').forEach(el => {
            el.classList.add('visible');
        });
    }
}); 