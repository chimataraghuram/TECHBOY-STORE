import React, { useMemo } from 'react';
import Particles, { ParticlesProvider } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const ParticleBackground = () => {
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
        fpsLimit: 60,
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
                speed: 0.3,
                straight: false,
            },
            number: {
                density: {
                    enable: true,
                    width: 800,
                    height: 800,
                },
                value: 15,
            },
            opacity: {
                value: 0.15,
                animation: {
                    enable: true,
                    speed: 0.5,
                    sync: false,
                },
            },
            shape: {
                type: "circle",
            },
            size: {
                value: { min: 1, max: 2 },
            },
        },
        detectRetina: true,
    }), []);

    return (
        <ParticlesProvider init={async (engine) => await loadSlim(engine)}>
            <Particles
                id="tsparticles"
                options={options}
                className="particle-canvas-global pointer-events-none"
            />
        </ParticlesProvider>
    );
};

export default ParticleBackground;
