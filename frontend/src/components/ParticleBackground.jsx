import React, { useEffect, useRef } from 'react';

const ParticleBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let nodes = [];
        let signals = [];
        let ambientParticles = [];

        // Interactive mouse state
        let mouse = { x: null, y: null, targetX: null, targetY: null };
        let lastMove = 0;

        const handleMouseMove = (e) => {
            const now = Date.now();
            if (now - lastMove > 10) { // Throttle mousemove for performance
                mouse.targetX = e.clientX;
                mouse.targetY = e.clientY;
                lastMove = now;
            }
        };

        const handleMouseLeave = () => {
            mouse.targetX = null;
            mouse.targetY = null;
        };

        window.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseleave', handleMouseLeave);

        const techLabels = [
            '[DECISION_CORE]', '[RAM_VERDICT]', '[CPU_BENCHMARK]', '[CAMERA_LOGIC]',
            '[BUDGET_NODE]', '[MATCH_CORE_98%]', '[VERDICT_CALC]', '[NEURAL_V5]',
            '[IC_109]', '[SPECS_PARSE]', '[MATCH_88%]', '[TECHBOY_AI]',
            '[BATTERY_RANK]', '[GPU_INDEX]', '[ANALYST_NET]', '[CORE_DECIDE]'
        ];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initNetwork();
        };

        // Initialize Neural Network Nodes & Ambient Particles
        const initNetwork = () => {
            nodes = [];
            signals = [];
            ambientParticles = [];
            const isMobile = window.innerWidth < 768;
            const nodeCount = isMobile ? 32 : 68;
            const ambientCount = isMobile ? 120 : 320;

            // 1. Initialize Network Nodes
            for (let i = 0; i < nodeCount; i++) {
                const z = Math.random() * 0.8 + 0.6;
                const radius = (Math.random() * 1.5 + 1) * (z * 0.8);
                const hasLabel = Math.random() > 0.82;
                const labelText = hasLabel ? techLabels[Math.floor(Math.random() * techLabels.length)] : '';

                nodes.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    baseX: 0,
                    baseY: 0,
                    vx: (Math.random() - 0.5) * 0.18 * (z * 0.8),
                    vy: (Math.random() - 0.5) * 0.18 * (z * 0.8),
                    offsetX: 0,
                    offsetY: 0,
                    radius: radius,
                    z: z,
                    color: Math.random() > 0.7 ? '#ffffff' : '#ff1f3d',
                    opacity: (Math.random() * 0.18 + 0.12) * (z * 0.8),
                    pulsePhase: Math.random() * Math.PI * 2,
                    pulseSpeed: Math.random() * 0.02 + 0.005,
                    labelText: labelText
                });
            }

            nodes.forEach(n => {
                n.baseX = n.x;
                n.baseY = n.y;
            });

            // 2. Initialize Ambient Dust Particles
            for (let i = 0; i < ambientCount; i++) {
                const z = Math.random() * 0.9 + 0.4;
                const radius = (Math.random() * 0.9 + 0.3) * z;

                ambientParticles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    baseX: 0,
                    baseY: 0,
                    vx: (Math.random() - 0.5) * 0.12 * z,
                    vy: (Math.random() - 0.5) * 0.12 * z,
                    offsetX: 0,
                    offsetY: 0,
                    radius: radius,
                    z: z,
                    color: Math.random() > 0.6 ? '#ffffff' : '#ff1f3d',
                    opacity: (Math.random() * 0.14 + 0.06) * z,
                    pulsePhase: Math.random() * Math.PI * 2,
                    pulseSpeed: Math.random() * 0.015 + 0.005
                });
            }

            ambientParticles.forEach(p => {
                p.baseX = p.x;
                p.baseY = p.y;
            });
        };

        window.addEventListener('resize', resize);
        resize();

        // Check distance helper
        const getDistance = (n1, n2) => {
            const dx = n1.x - n2.x;
            const dy = n1.y - n2.y;
            return Math.sqrt(dx * dx + dy * dy);
        };

        // Animation Loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw soft background glows (AI data nebula effect to make the background visible on all sections)
            ctx.globalCompositeOperation = 'screen';
            const gradient1 = ctx.createRadialGradient(canvas.width * 0.15, canvas.height * 0.25, 0, canvas.width * 0.15, canvas.height * 0.25, 360);
            gradient1.addColorStop(0, 'rgba(255, 31, 61, 0.065)');
            gradient1.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = gradient1;
            ctx.beginPath();
            ctx.arc(canvas.width * 0.15, canvas.height * 0.25, 360, 0, Math.PI * 2);
            ctx.fill();

            const gradient2 = ctx.createRadialGradient(canvas.width * 0.85, canvas.height * 0.7, 0, canvas.width * 0.85, canvas.height * 0.7, 440);
            gradient2.addColorStop(0, 'rgba(255, 31, 61, 0.045)');
            gradient2.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = gradient2;
            ctx.beginPath();
            ctx.arc(canvas.width * 0.85, canvas.height * 0.7, 440, 0, Math.PI * 2);
            ctx.fill();
            
            // Faint secondary glow in center-left for balanced layout contrast
            const gradient3 = ctx.createRadialGradient(canvas.width * 0.35, canvas.height * 0.75, 0, canvas.width * 0.35, canvas.height * 0.75, 280);
            gradient3.addColorStop(0, 'rgba(255, 255, 255, 0.025)');
            gradient3.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = gradient3;
            ctx.beginPath();
            ctx.arc(canvas.width * 0.35, canvas.height * 0.75, 280, 0, Math.PI * 2);
            ctx.fill();

            ctx.globalCompositeOperation = 'source-over';

            // Update and Draw Ambient Particles (Floating Dust Field)
            ambientParticles.forEach(part => {
                part.baseX += part.vx;
                part.baseY += part.vy;

                if (part.baseX < -10) part.baseX = canvas.width + 10;
                if (part.baseX > canvas.width + 10) part.baseX = -10;
                if (part.baseY < -10) part.baseY = canvas.height + 10;
                if (part.baseY > canvas.height + 10) part.baseY = -10;

                if (mouse.x !== null) {
                    const targetOffsetX = (mouse.x - canvas.width / 2) * (part.z - 1) * 0.04;
                    const targetOffsetY = (mouse.y - canvas.height / 2) * (part.z - 1) * 0.04;
                    part.offsetX += (targetOffsetX - part.offsetX) * 0.05;
                    part.offsetY += (targetOffsetY - part.offsetY) * 0.05;
                } else {
                    part.offsetX += (0 - part.offsetX) * 0.05;
                    part.offsetY += (0 - part.offsetY) * 0.05;
                }

                part.x = part.baseX + part.offsetX;
                part.y = part.baseY + part.offsetY;

                part.pulsePhase += part.pulseSpeed;
                const pulse = Math.sin(part.pulsePhase) * 0.03;
                const currentOpacity = Math.max(0.01, part.opacity + pulse);

                ctx.fillStyle = part.color === '#ffffff' 
                    ? `rgba(255, 255, 255, ${currentOpacity})`
                    : `rgba(255, 31, 61, ${currentOpacity})`;
                ctx.beginPath();
                ctx.arc(part.x, part.y, part.radius, 0, Math.PI * 2);
                ctx.fill();
            });

            // Interpolate mouse coordinates for buttery smooth parallax lag
            if (mouse.targetX !== null && mouse.targetY !== null) {
                if (mouse.x === null) {
                    mouse.x = mouse.targetX;
                    mouse.y = mouse.targetY;
                } else {
                    mouse.x += (mouse.targetX - mouse.x) * 0.05;
                    mouse.y += (mouse.targetY - mouse.y) * 0.05;
                }
            } else {
                mouse.x = null;
                mouse.y = null;
            }

            const maxDistance = 145;

            // 1. Update Positions (Drift + Parallax)
            nodes.forEach(node => {
                // Update ambient drift bases
                node.baseX += node.vx;
                node.baseY += node.vy;

                // Screen boundaries check
                if (node.baseX < -20) node.baseX = canvas.width + 20;
                if (node.baseX > canvas.width + 20) node.baseX = -20;
                if (node.baseY < -20) node.baseY = canvas.height + 20;
                if (node.baseY > canvas.height + 20) node.baseY = -20;

                // Target parallax offsets
                if (mouse.x !== null) {
                    const targetOffsetX = (mouse.x - canvas.width / 2) * (node.z - 1) * 0.06;
                    const targetOffsetY = (mouse.y - canvas.height / 2) * (node.z - 1) * 0.06;
                    node.offsetX += (targetOffsetX - node.offsetX) * 0.06;
                    node.offsetY += (targetOffsetY - node.offsetY) * 0.06;
                } else {
                    node.offsetX += (0 - node.offsetX) * 0.06;
                    node.offsetY += (0 - node.offsetY) * 0.06;
                }

                // Final coordinates
                node.x = node.baseX + node.offsetX;
                node.y = node.baseY + node.offsetY;

                // Pulse phase update
                node.pulsePhase += node.pulseSpeed;
            });

            // 2. Draw Connection Lines (Thin and Minimal)
            ctx.lineWidth = 0.45;
            for (let i = 0; i < nodes.length; i++) {
                const n1 = nodes[i];
                for (let j = i + 1; j < nodes.length; j++) {
                    const n2 = nodes[j];
                    const dist = getDistance(n1, n2);
                    if (dist < maxDistance) {
                        const alpha = (1 - dist / maxDistance) * 0.14 * (n1.z * n2.z * 0.65);
                        ctx.strokeStyle = n1.color === '#ffffff' && n2.color === '#ffffff' 
                            ? `rgba(255, 255, 255, ${alpha})`
                            : `rgba(255, 31, 61, ${alpha})`;
                        ctx.beginPath();
                        ctx.moveTo(n1.x, n1.y);
                        ctx.lineTo(n2.x, n2.y);
                        ctx.stroke();

                        // Occasional signal pulse spawn along valid paths
                        if (signals.length < 18 && Math.random() < 0.00035) {
                            // Check if a signal on this connection already exists
                            const signalExists = signals.some(s => 
                                (s.from === n1 && s.to === n2) || (s.from === n2 && s.to === n1)
                            );
                            if (!signalExists) {
                                signals.push({
                                    from: n1,
                                    to: n2,
                                    progress: 0,
                                    speed: Math.random() * 0.007 + 0.004,
                                    color: Math.random() > 0.3 ? '#ff1f3d' : '#ffffff'
                                });
                            }
                        }
                    }
                }
            }

            // 3. Draw Cursor Connections (Faint interactive highlight)
            if (mouse.x !== null) {
                const cursorRange = 170;
                nodes.forEach(node => {
                    const dx = mouse.x - node.x;
                    const dy = mouse.y - node.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < cursorRange) {
                        const alpha = (1 - dist / cursorRange) * 0.14 * node.z;
                        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
                        ctx.beginPath();
                        ctx.moveTo(mouse.x, mouse.y);
                        ctx.lineTo(node.x, node.y);
                        ctx.stroke();

                        // Temporarily raise opacity of interactive nodes
                        node.interactiveGlow = (1 - dist / cursorRange) * 0.28;
                    } else {
                        node.interactiveGlow = 0;
                    }
                });
            }

            // 4. Update and Draw Signal Pulses
            signals.forEach((sig, index) => {
                sig.progress += sig.speed;
                if (sig.progress >= 1) {
                    signals.splice(index, 1);
                    return;
                }

                // Coordinate interpolation
                const px = sig.from.x + (sig.to.x - sig.from.x) * sig.progress;
                const py = sig.from.y + (sig.to.y - sig.from.y) * sig.progress;

                // Scale size and opacity based on depth
                const avgDepth = (sig.from.z + sig.to.z) / 2;
                const sigSize = 1.35 * avgDepth;
                const sigAlpha = 0.5 * avgDepth;

                ctx.fillStyle = sig.color;
                ctx.shadowColor = sig.color === '#ffffff' ? '#ffffff' : '#ff1f3d';
                ctx.shadowBlur = 6;
                ctx.beginPath();
                ctx.arc(px, py, sigSize, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0; // Reset shadow for performance
            });

            // 5. Draw Nodes & Text Labels
            nodes.forEach(node => {
                const pulse = Math.sin(node.pulsePhase) * 0.04;
                const currentOpacity = Math.max(0.02, node.opacity + pulse + (node.interactiveGlow || 0));
                
                ctx.fillStyle = node.color === '#ffffff' 
                    ? `rgba(255, 255, 255, ${currentOpacity})`
                    : `rgba(255, 31, 61, ${currentOpacity})`;

                // Nodes
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
                ctx.fill();

                // Faint Specs Text Labels
                if (node.labelText) {
                    ctx.font = '8px "Plus Jakarta Sans", monospace';
                    ctx.fillStyle = node.color === '#ffffff'
                        ? `rgba(255, 255, 255, ${currentOpacity * 0.45})`
                        : `rgba(255, 31, 61, ${currentOpacity * 0.45})`;
                    ctx.fillText(node.labelText, node.x + 8, node.y + 3);
                }
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return <canvas ref={canvasRef} className="particle-canvas-global" style={{ willChange: 'transform' }} />;
};

export default ParticleBackground;
