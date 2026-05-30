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
        fpsLimit: 120,
        interactivity: {
            detectsOn: "window",
            events: {
                onClick: {
                    enable: true,
                    mode: "push",
                },
                onHover: {
                    enable: true,
                    mode: "repulse",
                },
            },
            modes: {
                push: {
                    quantity: 4,
                },
                repulse: {
                    distance: 120,
                    duration: 0.4,
                },
            },
        },
        particles: {
            color: {
                value: ["#ff1f3d", "#ffffff"],
            },
            links: {
                color: "#ff1f3d",
                distance: 150,
                enable: false,
                opacity: 0.15,
                width: 1,
            },
            move: {
                direction: "none",
                enable: true,
                outModes: {
                    default: "bounce",
                },
                random: true,
                speed: 0.8,
                straight: false,
            },
            number: {
                density: {
                    enable: true,
                    width: 800,
                    height: 800,
                },
                value: 45,
            },
            opacity: {
                value: 0.4,
                animation: {
                    enable: true,
                    speed: 1,
                    sync: false,
                },
            },
            shape: {
                type: "circle",
            },
            size: {
                value: { min: 1, max: 3 },
                animation: {
                    enable: true,
                    speed: 2,
                    sync: false,
                },
            },
        },
        detectRetina: true,
    }), []);

    return (
        <ParticlesProvider init={async (engine) => await loadSlim(engine)}>
            <Particles
                id="tsparticles"
                options={options}
                className="particle-canvas-global"
            />
        </ParticlesProvider>
    );
};

export default ParticleBackground;
