/* 
 * VANTA.NET Animation
 * For Josef Berman's Portfolio Hero Section
 */

document.addEventListener('DOMContentLoaded', () => {
    initVantaBackground();
});

function initVantaBackground() {
    const heroElement = document.querySelector('.neural-background');
    if (!heroElement) return;
    
    // Remove canvas if it exists (cleanup from previous animation)
    const oldCanvas = document.getElementById('neuralCanvas');
    if (oldCanvas) {
        oldCanvas.remove();
    }
    
    // Initialize VANTA.NET effect with clean, modern settings
    VANTA.NET({
        el: heroElement,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0xff7043, // Orange color
        backgroundColor: 0x0c1e2e, // Dark blue background
        points: 8.00, // More points for a finer network
        maxDistance: 18.00, // Shorter connections for cleaner look
        spacing: 16.00, // More spacing for elegance
        showDots: false, // Hide dots for cleaner lines only
        speed: 0.5, // Slower, more subtle movement
        lineWidth: 0.5, // Thinner lines for a more modern feel
    });
} 