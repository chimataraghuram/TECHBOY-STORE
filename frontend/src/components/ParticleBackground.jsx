import React, { useMemo, useRef, useEffect } from 'react';
import Particles, { ParticlesProvider } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const initParticlesEngine = async (engine) => {
    await loadSlim(engine);
};

const ParticleBackground = () => {
    // Use a ref so scroll events never trigger React re-renders / options recomputation
    const particlesRef = useRef(null);

    useEffect(() => {
        let scrollTimer = null;
        const handleScroll = () => {
            // Pause particles during scroll by directly toggling playback on the container
            // without touching React state at all
            const canvas = document.querySelector('#tsparticles canvas');
            if (canvas) canvas.style.opacity = '0';
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(() => {
                if (canvas) canvas.style.opacity = '1';
            }, 200);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(scrollTimer);
        };
    }, []);

    // options is now completely stable — no isScrolling dep that triggers re-init
    const options = useMemo(() => ({
        fullScreen: { 
            enable: true, 
            zIndex: 1 
        }, 
        background: {
            color: {
                value: "transparent",
            },
        },
        fpsLimit: 30,
        interactivity: {
            events: {
                onClick: { enable: false },
                onHover: { enable: false },
            },
        },
        particles: {
            color: {
                value: ["#ff2a2a", "#ffffff"],
            },
            links: {
                enable: false,
            },
            move: {
                direction: "none",
                enable: true,
                outModes: {
                    default: "out",
                },
                random: true,
                speed: 0.2,
                straight: false,
            },
            number: {
                density: {
                    enable: true,
                    width: 1200,
                    height: 1200,
                },
                value: 10,
            },
            opacity: {
                value: 0.12,
                animation: {
                    enable: false,
                },
            },
            shape: {
                type: "circle",
            },
            size: {
                value: { min: 1, max: 2 },
            },
        },
        detectRetina: false,
    }), []);

    return (
        <ParticlesProvider init={initParticlesEngine}>
            <Particles
                id="tsparticles"
                options={options}
                className="particle-canvas-global pointer-events-none"
            />
        </ParticlesProvider>
    );
};

export default ParticleBackground;
