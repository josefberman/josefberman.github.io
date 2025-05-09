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
        neuronActive: 'rgba(255, 112, 67, 0.7)', // Orange for active neurons (more transparent)
        neuronInactive: '#455a64', // Secondary color for inactive neurons
        connectionActive: 'rgba(255, 112, 67, 0.3)', // Orange for active connections (more transparent)
        connectionInactive: 'rgba(69, 90, 100, 0.2)' // Secondary for inactive connections
    };
    
    // Neural network elements - organized in clusters
    let clusters = [];
    let connections = [];
    
    // Molecule elements
    let molecules = [];
    
    // Create a cluster of neurons
    function createCluster(centerX, centerY, radius, nodeCount) {
        let clusterNodes = [];
        
        // Create nodes within the cluster
        for (let i = 0; i < nodeCount; i++) {
            // Place nodes in a circular pattern around the center
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * radius * 0.8; // Keep within 80% of radius
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;
            
            clusterNodes.push({
                x: x,
                y: y,
                originalX: x, // Original position to maintain clustering
                originalY: y,
                radius: Math.random() * 2.5 + 1.5, // Slightly smaller nodes
                color: Math.random() > 0.3 ? colors.neuronInactive : colors.neuronActive,
                velX: (Math.random() - 0.5) * 0.1, // Even slower movement
                velY: (Math.random() - 0.5) * 0.1,
                pulseSpeed: Math.random() * 0.02 + 0.01,
                pulseDirection: Math.random() > 0.5 ? 1 : -1,
                pulseAmount: 0,
                activationTime: Math.random() * 1000
            });
        }
        
        // Create connections within this cluster - limited number
        const maxConnections = Math.min(15, Math.floor(nodeCount * 1.2)); // Limit total connections
        let connectionCount = 0;
        
        // Sort potential connections by distance
        const potentialConnections = [];
        for (let i = 0; i < clusterNodes.length; i++) {
            for (let j = i + 1; j < clusterNodes.length; j++) {
                const dx = clusterNodes[i].x - clusterNodes[j].x;
                const dy = clusterNodes[i].y - clusterNodes[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < radius * 0.7) { // Only connect nodes that are close
                    potentialConnections.push({
                        i: i,
                        j: j,
                        distance: distance
                    });
                }
            }
        }
        
        // Sort by distance and take only the closest connections
        potentialConnections.sort((a, b) => a.distance - b.distance);
        
        // Use only the closest connections up to the maximum limit
        for (let k = 0; k < Math.min(maxConnections, potentialConnections.length); k++) {
            const conn = potentialConnections[k];
            connections.push({
                fromCluster: clusters.length,
                fromNode: conn.i,
                toNode: conn.j,
                width: Math.random() * 0.8 + 0.3, // Thinner connections
                color: colors.connectionInactive,
                pulsePosition: 0,
                pulseActive: false,
                pulseSpeed: Math.random() * 0.01 + 0.001
            });
            connectionCount++;
        }
        
        // Return the complete cluster with a slow movement vector for the entire cluster
        return {
            centerX: centerX,
            centerY: centerY,
            radius: radius,
            nodes: clusterNodes,
            velX: (Math.random() - 0.5) * 0.05, // Very slow cluster movement
            velY: (Math.random() - 0.5) * 0.05,
            connectionCount: connectionCount
        };
    }
    
    // Initialize the neural network with clusters
    function initNetwork() {
        // Clear previous elements
        clusters = [];
        connections = [];
        molecules = [];
        
        // Create several neural clusters - fewer clusters with more spacing
        const clusterCount = Math.floor(canvas.width * canvas.height / 500000) + 3; // Fewer clusters
        
        // Calculate better positions to avoid overlap
        const positions = [];
        for (let i = 0; i < clusterCount; i++) {
            // Try to find a position that's not too close to existing clusters
            let attempts = 0;
            let validPosition = false;
            let centerX, centerY;
            
            while (!validPosition && attempts < 20) {
                centerX = Math.random() * (canvas.width * 0.8) + (canvas.width * 0.1); // Keep away from edges
                centerY = Math.random() * (canvas.height * 0.8) + (canvas.height * 0.1);
                
                validPosition = true;
                // Check distance to existing positions
                for (const pos of positions) {
                    const dx = centerX - pos.x;
                    const dy = centerY - pos.y;
                    const distance = Math.sqrt(dx*dx + dy*dy);
                    
                    // If too close to another cluster, reject this position
                    if (distance < 200) {
                        validPosition = false;
                        break;
                    }
                }
                
                attempts++;
            }
            
            if (validPosition) {
                positions.push({x: centerX, y: centerY});
            }
        }
        
        // Create clusters at the calculated positions
        for (const pos of positions) {
            const radius = Math.random() * 40 + 40; // 40-80px radius (smaller clusters)
            const nodeCount = Math.floor(Math.random() * 8) + 10; // 10-18 nodes per cluster (fewer nodes)
            
            clusters.push(createCluster(pos.x, pos.y, radius, nodeCount));
        }
        
        // Create molecule structures - fewer molecules
        const moleculeCount = Math.floor(canvas.width * canvas.height / 200000); // Even fewer molecules
        
        for (let i = 0; i < moleculeCount; i++) {
            // Create a more complex molecule structure
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            
            // More complex atom configurations
            const structure = createMoleculeStructure();
            
            molecules.push({
                x: x,
                y: y,
                velX: (Math.random() - 0.5) * 0.15, // Slower movement
                velY: (Math.random() - 0.5) * 0.15,
                atoms: structure.atoms,
                bonds: structure.bonds,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.001 // Rotation of the whole molecule
            });
        }
    }
    
    // Create a complex molecule structure
    function createMoleculeStructure() {
        const atoms = [];
        const bonds = [];
        
        // Random type of molecule
        const type = Math.floor(Math.random() * 3);
        
        if (type === 0) {
            // Hexagonal structure (like benzene)
            const atomCount = 6;
            const radius = 20;
            
            // Create atoms in a ring
            for (let i = 0; i < atomCount; i++) {
                const angle = (i / atomCount) * Math.PI * 2;
                atoms.push({
                    x: Math.cos(angle) * radius,
                    y: Math.sin(angle) * radius,
                    radius: Math.random() * 2 + 2.5,
                    color: Math.random() > 0.6 ? 'rgba(255, 112, 67, 0.6)' : colors.neuronInactive
                });
                
                // Connect each atom to the next one in the ring
                bonds.push({
                    from: i,
                    to: (i + 1) % atomCount,
                    double: i % 2 === 0 // Alternating double bonds for benzene
                });
            }
        } else if (type === 1) {
            // Branched structure (amino acid-like)
            // Central atom
            atoms.push({
                x: 0,
                y: 0,
                radius: 3.5,
                color: 'rgba(255, 112, 67, 0.6)'
            });
            
            // First level branches
            const branchCount = Math.floor(Math.random() * 2) + 3; // 3-4 branches
            for (let i = 0; i < branchCount; i++) {
                const angle = (i / branchCount) * Math.PI * 2;
                const distance = Math.random() * 5 + 15;
                
                atoms.push({
                    x: Math.cos(angle) * distance,
                    y: Math.sin(angle) * distance,
                    radius: Math.random() * 1.5 + 2,
                    color: i % 2 === 0 ? 'rgba(255, 112, 67, 0.6)' : colors.neuronInactive
                });
                
                // Connect to central atom
                bonds.push({
                    from: 0,
                    to: i + 1,
                    double: i === 1 // One double bond
                });
                
                // Second level branch on some atoms
                if (Math.random() > 0.5) {
                    const branchAngle = angle + (Math.random() - 0.5) * 0.5;
                    const branchDistance = distance + Math.random() * 5 + 12;
                    
                    atoms.push({
                        x: Math.cos(branchAngle) * branchDistance,
                        y: Math.sin(branchAngle) * branchDistance,
                        radius: Math.random() * 1.5 + 1.5,
                        color: Math.random() > 0.5 ? 'rgba(255, 112, 67, 0.6)' : colors.neuronInactive
                    });
                    
                    // Connect to parent atom
                    bonds.push({
                        from: i + 1,
                        to: atoms.length - 1,
                        double: Math.random() > 0.7
                    });
                }
            }
        } else {
            // Fused ring structure (like steroid)
            const firstRingCenter = { x: 0, y: 0 };
            const secondRingCenter = { x: 22, y: 0 };
            const ringRadius = 15;
            
            // First ring (6 atoms)
            for (let i = 0; i < 6; i++) {
                const angle = (i / 6) * Math.PI * 2;
                atoms.push({
                    x: firstRingCenter.x + Math.cos(angle) * ringRadius,
                    y: firstRingCenter.y + Math.sin(angle) * ringRadius,
                    radius: Math.random() * 1.5 + 2,
                    color: i % 3 === 0 ? 'rgba(255, 112, 67, 0.6)' : colors.neuronInactive
                });
                
                // Connect in ring
                bonds.push({
                    from: i,
                    to: (i + 1) % 6,
                    double: i === 2
                });
            }
            
            // Second ring (6 atoms)
            for (let i = 0; i < 6; i++) {
                const angle = (i / 6) * Math.PI * 2;
                // Skip positions where rings connect
                if (i !== 3 && i !== 0) {
                    atoms.push({
                        x: secondRingCenter.x + Math.cos(angle) * ringRadius,
                        y: secondRingCenter.y + Math.sin(angle) * ringRadius,
                        radius: Math.random() * 1.5 + 2,
                        color: i % 3 === 0 ? 'rgba(255, 112, 67, 0.6)' : colors.neuronInactive
                    });
                    
                    // Connect in ring with adjusted indices
                    const currentIndex = atoms.length - 1;
                    const nextIndex = i === 5 ? 6 : atoms.length; // Connect back to first atom of second ring
                    
                    if (nextIndex < atoms.length) {
                        bonds.push({
                            from: currentIndex,
                            to: nextIndex,
                            double: i === 1
                        });
                    }
                }
            }
            
            // Connect rings
            bonds.push({
                from: 0, // First atom of first ring
                to: 6,  // First atom of second ring
                double: false
            });
            
            bonds.push({
                from: 3, // Middle atom of first ring
                to: 9,  // Middle atom of second ring (adjusted index)
                double: false
            });
        }
        
        return { atoms, bonds };
    }
    
    // Draw a node (neuron)
    function drawNode(node) {
        ctx.beginPath();
        const radiusMod = 1 + node.pulseAmount * 0.3;
        ctx.arc(node.x, node.y, node.radius * radiusMod, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();
        
        // Glow effect for active neurons (more subtle)
        if (node.color === colors.neuronActive) {
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius * radiusMod * 1.5, 0, Math.PI * 2);
            const gradient = ctx.createRadialGradient(
                node.x, node.y, node.radius * radiusMod,
                node.x, node.y, node.radius * radiusMod * 1.5
            );
            gradient.addColorStop(0, 'rgba(255, 112, 67, 0.15)'); // More transparent
            gradient.addColorStop(1, 'rgba(255, 112, 67, 0)');
            ctx.fillStyle = gradient;
            ctx.fill();
        }
    }
    
    // Draw a connection between neurons
    function drawConnection(conn) {
        const from = clusters[conn.fromCluster].nodes[conn.fromNode];
        const to = clusters[conn.fromCluster].nodes[conn.toNode];
        
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
            ctx.fillStyle = 'rgba(255, 112, 67, 0.4)'; // More transparent pulse
            ctx.fill();
        }
    }
    
    // Draw a molecule structure
    function drawMolecule(molecule) {
        const cos = Math.cos(molecule.rotation);
        const sin = Math.sin(molecule.rotation);
        
        // Draw bonds
        molecule.bonds.forEach(bond => {
            const from = molecule.atoms[bond.from];
            const to = molecule.atoms[bond.to];
            
            const x1 = molecule.x + (from.x * cos - from.y * sin);
            const y1 = molecule.y + (from.x * sin + from.y * cos);
            
            const x2 = molecule.x + (to.x * cos - to.y * sin);
            const y2 = molecule.y + (to.x * sin + to.y * cos);
            
            // Draw bond line
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'; // More transparent bonds
            ctx.lineWidth = 1.2;
            ctx.stroke();
            
            // If double bond, draw second line
            if (bond.double) {
                const dx = x2 - x1;
                const dy = y2 - y1;
                const length = Math.sqrt(dx*dx + dy*dy);
                
                // Perpendicular direction
                const offsetX = -dy / length * 2;
                const offsetY = dx / length * 2;
                
                ctx.beginPath();
                ctx.moveTo(x1 + offsetX, y1 + offsetY);
                ctx.lineTo(x2 + offsetX, y2 + offsetY);
                ctx.stroke();
            }
        });
        
        // Draw atoms
        molecule.atoms.forEach(atom => {
            const x = molecule.x + (atom.x * cos - atom.y * sin);
            const y = molecule.y + (atom.x * sin + atom.y * cos);
            
            ctx.beginPath();
            ctx.arc(x, y, atom.radius, 0, Math.PI * 2);
            ctx.fillStyle = atom.color;
            ctx.fill();
        });
    }
    
    // Update neural network state
    function updateNetwork() {
        // Update clusters
        clusters.forEach(cluster => {
            // Move the whole cluster
            cluster.centerX += cluster.velX;
            cluster.centerY += cluster.velY;
            
            // Bounce cluster off edges
            if (cluster.centerX - cluster.radius < 0 || cluster.centerX + cluster.radius > canvas.width) {
                cluster.velX *= -1;
            }
            if (cluster.centerY - cluster.radius < 0 || cluster.centerY + cluster.radius > canvas.height) {
                cluster.velY *= -1;
            }
            
            // Update nodes within the cluster
            cluster.nodes.forEach(node => {
                // Update node position based on its velocity (small movement)
                node.x += node.velX;
                node.y += node.velY;
                
                // Calculate offset from original position (relative to cluster center)
                const offsetX = node.x - (node.originalX + (cluster.centerX - node.originalX));
                const offsetY = node.y - (node.originalY + (cluster.centerY - node.originalY));
                
                // Apply cohesive force to keep nodes near original positions relative to cluster
                node.x -= offsetX * 0.03; // Spring constant
                node.y -= offsetY * 0.03;
                
                // Pulse effect
                node.pulseAmount += node.pulseSpeed * node.pulseDirection;
                if (node.pulseAmount > 1 || node.pulseAmount < 0) {
                    node.pulseDirection *= -1;
                }
                
                // Randomly activate neurons
                node.activationTime--;
                if (node.activationTime <= 0) {
                    // Change color with proper transparency
                    node.color = node.color === colors.neuronActive ? 
                                 colors.neuronInactive : 
                                 colors.neuronActive;
                    node.activationTime = Math.random() * 500 + 500;
                    
                    // Activate connections from this node
                    connections.forEach(conn => {
                        if (conn.fromCluster === clusters.indexOf(cluster) && 
                            (conn.fromNode === cluster.nodes.indexOf(node) || conn.toNode === cluster.nodes.indexOf(node)) && 
                            Math.random() > 0.5) {
                            conn.pulseActive = true;
                            conn.pulsePosition = 0;
                            conn.color = colors.connectionActive;
                        }
                    });
                }
            });
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
            
            // Rotate the molecule
            molecule.rotation += molecule.rotationSpeed;
            
            // Bounce off the edges
            if (molecule.x < 0 || molecule.x > canvas.width) molecule.velX *= -1;
            if (molecule.y < 0 || molecule.y > canvas.height) molecule.velY *= -1;
        });
    }
    
    // Animation loop
    function animate() {
        // Clear canvas with a slightly transparent background for trail effect
        ctx.fillStyle = 'rgba(12, 30, 46, 0.15)'; // Slightly more opaque to clear old paths
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Update network state
        updateNetwork();
        
        // Draw connections
        connections.forEach(drawConnection);
        
        // Draw nodes
        clusters.forEach(cluster => {
            cluster.nodes.forEach(drawNode);
        });
        
        // Draw molecules
        molecules.forEach(drawMolecule);
        
        // Continue animation
        requestAnimationFrame(animate);
    }
    
    // Initialize and start animation
    initNetwork();
    animate();
} 