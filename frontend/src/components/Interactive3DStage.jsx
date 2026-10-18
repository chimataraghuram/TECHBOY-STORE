import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Eye, RotateCw, Sparkles, Layers } from 'lucide-react';

/**
 * Interactive 360° Perspective Hologram Stage
 * Uses smooth mouse/touch parallax physics, dynamic multi-axis tilt, specular light glint,
 * and holographic scanlines & hologram projection rings.
 */
const Interactive3DStage = ({ imageUrl, productName = 'Smartphone' }) => {
    const stageRef = useRef(null);
    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isHologram, setIsHologram] = useState(false);
    const [autoSpin, setAutoSpin] = useState(true);

    // Auto-levitation and gentle breathing animation when idle
    useEffect(() => {
        let frameId;
        let startTime = Date.now();

        const loop = () => {
            if (autoSpin && !isHovered) {
                const elapsed = (Date.now() - startTime) / 1000;
                // Gentle floating sine motion
                const angleY = Math.sin(elapsed * 0.9) * 16;
                const angleX = Math.cos(elapsed * 0.7) * 7;
                setRotateY(angleY);
                setRotateX(angleX);
            }
            frameId = requestAnimationFrame(loop);
        };

        frameId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(frameId);
    }, [autoSpin, isHovered]);

    // Mouse and Touch Move handlers for 360° interactive tilting
    const handlePointerMove = useCallback((e) => {
        if (!stageRef.current) return;
        const rect = stageRef.current.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
        const clientY = e.clientY || (e.touches && e.touches[0]?.clientY) || 0;

        // Calculate normalized coordinate (-1 to 1)
        const x = (clientX - rect.left) / rect.width - 0.5;
        const y = (clientY - rect.top) / rect.height - 0.5;

        // Smooth physics damping
        setRotateY(x * 42); // +/- 21 degrees yaw
        setRotateX(-y * 28); // +/- 14 degrees pitch
    }, []);

    const handlePointerDown = () => {
        setAutoSpin(false);
    };

    const handlePointerLeave = () => {
        setIsHovered(false);
        setAutoSpin(true);
    };

    return (
        <div 
            ref={stageRef}
            onMouseEnter={() => { setIsHovered(true); setAutoSpin(false); }}
            onMouseMove={handlePointerMove}
            onMouseDown={handlePointerDown}
            onTouchStart={() => { setIsHovered(true); setAutoSpin(false); }}
            onTouchMove={handlePointerMove}
            onMouseLeave={handlePointerLeave}
            onTouchEnd={handlePointerLeave}
            className="relative w-full h-full select-none overflow-hidden rounded-2xl flex items-center justify-center cursor-grab active:cursor-grabbing bg-gradient-to-b from-[#101018] via-[#08080e] to-[#040407]"
            style={{ perspective: '1100px' }}
        >
            {/* Ambient Spotlight & Stage Glow */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden" aria-hidden="true">
                {/* Back Glowing Radial Halo */}
                <div 
                    className="w-56 h-56 rounded-full blur-2xl transition-all duration-700" 
                    style={{
                        background: isHologram
                            ? 'radial-gradient(circle, rgba(0, 255, 255, 0.35), transparent 70%)'
                            : 'radial-gradient(circle, rgba(255, 31, 61, 0.25), transparent 70%)'
                    }}
                />
                {/* Bottom Shadow Plate */}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/95 to-transparent" />
            </div>

            {/* Hologram Projector Pedestal Rings at bottom */}
            {isHologram && (
                <div className="absolute bottom-5 inset-x-0 flex items-center justify-center pointer-events-none z-10">
                    <div className="relative w-44 h-14 flex items-center justify-center">
                        {/* Outer Cyan Ring */}
                        <div 
                            className="absolute inset-0 rounded-full border border-cyan-400/60 animate-spin"
                            style={{ 
                                animationDuration: '8s',
                                transform: 'rotateX(75deg)',
                                boxShadow: '0 0 25px rgba(0, 255, 255, 0.4), inset 0 0 15px rgba(0, 255, 255, 0.3)'
                            }}
                        />
                        {/* Inner Red Laser Ring */}
                        <div 
                            className="absolute inset-3 rounded-full border border-red-500/50 animate-spin"
                            style={{ 
                                animationDuration: '5s',
                                animationDirection: 'reverse',
                                transform: 'rotateX(75deg)'
                            }}
                        />
                        {/* Laser Projection Beam Cone */}
                        <div 
                            className="absolute bottom-6 w-32 h-44 bg-gradient-to-t from-cyan-400/20 via-cyan-400/5 to-transparent blur-sm pointer-events-none"
                            style={{ clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)' }}
                        />
                    </div>
                </div>
            )}

            {/* 3D Levitating Device Stage Container */}
            <div 
                className="relative z-20 flex items-center justify-center transition-transform duration-100 ease-out will-change-transform"
                style={{
                    transform: `rotateY(${rotateY}deg) rotateX(${rotateX}deg) translateZ(20px)`,
                    transformStyle: 'preserve-3d'
                }}
            >
                {/* 3D Realistic Phone Shadow underneath */}
                <div 
                    className="absolute -bottom-8 w-44 h-10 rounded-full bg-black/85 blur-md pointer-events-none transition-transform duration-150"
                    style={{
                        transform: `scale(${1 - Math.abs(rotateX) * 0.01}) translateY(${rotateX * 0.5}px)`
                    }}
                />

                {/* Primary High-Resolution Phone Cutout */}
                <div className="relative">
                    <img
                        src={imageUrl}
                        alt={productName}
                        draggable={false}
                        className={`relative z-20 max-h-[220px] sm:max-h-[240px] md:max-h-[260px] w-auto object-contain transition-all duration-300 pointer-events-none ${
                            isHologram ? 'brightness-110 contrast-125' : ''
                        }`}
                        style={{
                            filter: isHologram
                                ? 'drop-shadow(0 0 16px rgba(0, 255, 255, 0.75)) drop-shadow(0 20px 30px rgba(0, 0, 0, 0.9)) hue-rotate(170deg)'
                                : 'drop-shadow(0 20px 32px rgba(0, 0, 0, 0.92))'
                        }}
                    />

                    {/* Specular Light Reflection Glint that tracks viewing angle */}
                    <div 
                        className="absolute inset-0 z-30 pointer-events-none rounded-2xl overflow-hidden opacity-40 mix-blend-overlay transition-opacity duration-300"
                        style={{
                            background: `linear-gradient(${120 + rotateY * 2}deg, transparent 20%, rgba(255, 255, 255, 0.8) 50%, transparent 80%)`
                        }}
                    />

                    {/* Holographic Laser Scanline when in hologram mode */}
                    {isHologram && (
                        <div 
                            className="absolute inset-0 z-40 pointer-events-none overflow-hidden rounded-2xl opacity-60"
                            style={{
                                background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0, 255, 255, 0.25) 4px, transparent 6px)'
                            }}
                        >
                            {/* Horizontal moving laser line */}
                            <div className="w-full h-1 bg-cyan-300 shadow-[0_0_12px_#00ffff] animate-pulse" />
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom: Hologram Mode Toggle Pill */}
            <div className="absolute bottom-3 inset-x-0 z-30 flex justify-center pointer-events-auto px-3">
                <button 
                    onClick={(e) => { 
                        e.stopPropagation(); 
                        setIsHologram(!isHologram); 
                    }}
                    aria-label="Toggle Hologram Mode"
                    className={`group/holo flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10.5px] font-black uppercase tracking-wider backdrop-blur-md transition-all duration-300 active:scale-95 shadow-xl border ${
                        isHologram
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_20px_rgba(0,255,255,0.45)]'
                            : 'bg-black/85 border-white/15 text-white hover:border-red-500/50 hover:bg-black/95'
                    }`}
                >
                    <Sparkles size={12} className={isHologram ? 'text-cyan-300 fill-cyan-300' : 'text-red-500'} />
                    <span>{isHologram ? 'HOLOGRAM ACTIVE' : 'HOLOGRAM MODE'}</span>
                </button>
            </div>
        </div>
    );
};

export default Interactive3DStage;
