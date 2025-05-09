/* 
 * Neural Network and Molecule Animation
 * For Josef Berman's Portfolio Hero Section
 */

document.addEventListener('DOMContentLoaded', () => {
    initNeuralAnimation();
});

function initNeuralAnimation() {
    const canvas = document.getElementById('neuralCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas size to match parent
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = canvas.parentElement.offsetHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Colors from the theme
    const colors = {
        background: '#0c1e2e', // Dark blue background
        neuronActive: '#ff7043', // Orange for active neurons
        neuronInactive: '#455a64', // Secondary color for inactive neurons
        connectionActive: 'rgba(255, 112, 67, 0.5)', // Orange for active connections
        connectionInactive: 'rgba(69, 90, 100, 0.2)' // Secondary for inactive connections
    };
    
    // Neural network elements
    let nodes = [];
    let connections = [];
    
    // Molecule elements
    let molecules = [];
    
    // Initialize the neural network
    function initNetwork() {
        // Clear previous elements
        nodes = [];
        connections = [];
        molecules = [];
        
        // Create neurons - more densely packed
        const nodeCount = Math.floor(canvas.width * canvas.height / 15000);
        
        for (let i = 0; i < nodeCount; i++) {
            nodes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 3 + 2,
                color: Math.random() > 0.3 ? colors.neuronInactive : colors.neuronActive,
                velX: (Math.random() - 0.5) * 0.3,
                velY: (Math.random() - 0.5) * 0.3,
                pulseSpeed: Math.random() * 0.02 + 0.01,
                pulseDirection: Math.random() > 0.5 ? 1 : -1,
                pulseAmount: 0,
                activationTime: Math.random() * 1000
            });
        }
        
        // Create connections between neurons that are close enough
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    connections.push({
                        from: i,
                        to: j,
                        width: Math.random() * 1.5 + 0.5,
                        color: colors.connectionInactive,
                        pulsePosition: 0,
                        pulseActive: false,
                        pulseSpeed: Math.random() * 0.01 + 0.001,
                        distance: distance
                    });
                }
            }
        }
        
        // Create molecule structures
        const moleculeCount = Math.floor(canvas.width * canvas.height / 100000);
        
        for (let i = 0; i < moleculeCount; i++) {
            // Create a central "atom" with orbiting "electrons"
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const atomCount = Math.floor(Math.random() * 3) + 2;
            const radius = Math.random() * 15 + 10;
            
            molecules.push({
                x: x,
                y: y,
                velX: (Math.random() - 0.5) * 0.2,
                velY: (Math.random() - 0.5) * 0.2,
                radius: radius,
                color: Math.random() > 0.5 ? colors.neuronActive : colors.neuronInactive,
                atoms: Array(atomCount).fill().map(() => ({
                    distance: Math.random() * 20 + 15,
                    angle: Math.random() * Math.PI * 2,
                    speed: (Math.random() * 0.02 + 0.01) * (Math.random() > 0.5 ? 1 : -1),
                    radius: Math.random() * 2 + 2,
                    color: Math.random() > 0.5 ? colors.neuronActive : colors.neuronInactive
                }))
            });
        }
    }
    
    // Draw a node (neuron)
    function drawNode(node) {
        ctx.beginPath();
        const radiusMod = 1 + node.pulseAmount * 0.3;
        ctx.arc(node.x, node.y, node.radius * radiusMod, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();
        
        // Glow effect for active neurons
        if (node.color === colors.neuronActive) {
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius * radiusMod * 1.5, 0, Math.PI * 2);
            const gradient = ctx.createRadialGradient(
                node.x, node.y, node.radius * radiusMod,
                node.x, node.y, node.radius * radiusMod * 1.5
            );
            gradient.addColorStop(0, 'rgba(255, 112, 67, 0.3)');
            gradient.addColorStop(1, 'rgba(255, 112, 67, 0)');
            ctx.fillStyle = gradient;
            ctx.fill();
        }
    }
    
    // Draw a connection between neurons
    function drawConnection(conn) {
        const from = nodes[conn.from];
        const to = nodes[conn.to];
        
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.strokeStyle = conn.color;
        ctx.lineWidth = conn.width;
        ctx.stroke();
        
        // Draw pulse along the connection if active
        if (conn.pulseActive) {
            const xPos = from.x + (to.x - from.x) * conn.pulsePosition;
            const yPos = from.y + (to.y - from.y) * conn.pulsePosition;
            
            ctx.beginPath();
            ctx.arc(xPos, yPos, conn.width * 2, 0, Math.PI * 2);
            ctx.fillStyle = colors.neuronActive;
            ctx.fill();
        }
    }
    
    // Draw a molecule structure
    function drawMolecule(molecule) {
        // Draw bonds between atoms
        for (let i = 0; i < molecule.atoms.length; i++) {
            const atom = molecule.atoms[i];
            const x = molecule.x + Math.cos(atom.angle) * atom.distance;
            const y = molecule.y + Math.sin(atom.angle) * atom.distance;
            
            // Draw bond
            ctx.beginPath();
            ctx.moveTo(molecule.x, molecule.y);
            ctx.lineTo(x, y);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.lineWidth = 1;
            ctx.stroke();
            
            // Draw atom
            ctx.beginPath();
            ctx.arc(x, y, atom.radius, 0, Math.PI * 2);
            ctx.fillStyle = atom.color;
            ctx.fill();
        }
        
        // Draw central atom
        ctx.beginPath();
        ctx.arc(molecule.x, molecule.y, molecule.radius / 3, 0, Math.PI * 2);
        ctx.fillStyle = molecule.color;
        ctx.fill();
    }
    
    // Update neural network state
    function updateNetwork() {
        // Update nodes
        nodes.forEach(node => {
            // Move the node
            node.x += node.velX;
            node.y += node.velY;
            
            // Bounce off the edges
            if (node.x < 0 || node.x > canvas.width) node.velX *= -1;
            if (node.y < 0 || node.y > canvas.height) node.velY *= -1;
            
            // Pulse effect
            node.pulseAmount += node.pulseSpeed * node.pulseDirection;
            if (node.pulseAmount > 1 || node.pulseAmount < 0) {
                node.pulseDirection *= -1;
            }
            
            // Randomly activate neurons
            node.activationTime--;
            if (node.activationTime <= 0) {
                node.color = node.color === colors.neuronActive ? colors.neuronInactive : colors.neuronActive;
                node.activationTime = Math.random() * 500 + 500;
                
                // Activate connections from this node
                connections.forEach(conn => {
                    if ((conn.from === nodes.indexOf(node) || conn.to === nodes.indexOf(node)) && 
                        Math.random() > 0.5) {
                        conn.pulseActive = true;
                        conn.pulsePosition = 0;
                        conn.color = colors.connectionActive;
                    }
                });
            }
        });
        
        // Update connections
        connections.forEach(conn => {
            // Update pulse position
            if (conn.pulseActive) {
                conn.pulsePosition += conn.pulseSpeed;
                if (conn.pulsePosition >= 1) {
                    conn.pulseActive = false;
                    conn.pulsePosition = 0;
                    conn.color = colors.connectionInactive;
                }
            }
        });
        
        // Update molecules
        molecules.forEach(molecule => {
            // Move the molecule
            molecule.x += molecule.velX;
            molecule.y += molecule.velY;
            
            // Bounce off the edges
            if (molecule.x < 0 || molecule.x > canvas.width) molecule.velX *= -1;
            if (molecule.y < 0 || molecule.y > canvas.height) molecule.velY *= -1;
            
            // Rotate atoms around the center
            molecule.atoms.forEach(atom => {
                atom.angle += atom.speed;
                if (atom.angle > Math.PI * 2) atom.angle -= Math.PI * 2;
                if (atom.angle < 0) atom.angle += Math.PI * 2;
            });
        });
    }
    
    // Animation loop
    function animate() {
        // Clear canvas with a slightly transparent background for trail effect
        ctx.fillStyle = 'rgba(12, 30, 46, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Update network state
        updateNetwork();
        
        // Draw connections
        connections.forEach(drawConnection);
        
        // Draw nodes
        nodes.forEach(drawNode);
        
        // Draw molecules
        molecules.forEach(drawMolecule);
        
        // Continue animation
        requestAnimationFrame(animate);
    }
    
    // Initialize and start animation
    initNetwork();
    animate();
} 