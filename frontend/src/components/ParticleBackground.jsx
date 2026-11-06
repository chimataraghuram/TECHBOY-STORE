import React, { useMemo, useState, useEffect } from 'react';
import Particles, { ParticlesProvider } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const initParticlesEngine = async (engine) => {
    await loadSlim(engine);
};

const ParticleBackground = () => {
    const [isScrolling, setIsScrolling] = useState(false);

    useEffect(() => {
        let scrollTimer = null;
        const handleScroll = () => {
            if (!isScrolling) setIsScrolling(true);
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(() => {
                setIsScrolling(false);
            }, 150);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(scrollTimer);
        };
    }, [isScrolling]);

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
        fpsLimit: 40,
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
                enable: !isScrolling,
                outModes: {
                    default: "out",
                },
                random: true,
                speed: 0.25,
                straight: false,
            },
            number: {
                density: {
                    enable: true,
                    width: 900,
                    height: 900,
                },
                value: 12,
            },
            opacity: {
                value: 0.15,
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
    }), [isScrolling]);

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
