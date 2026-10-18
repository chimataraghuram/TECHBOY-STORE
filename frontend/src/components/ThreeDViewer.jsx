import React, { useState, Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, RoundedBox, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Zap, RotateCw } from 'lucide-react';

/* Procedural high-res front smartphone screen */
const createPhoneScreenTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');

    // Deep OLED dark gradient wallpaper
    const bg = ctx.createLinearGradient(0, 0, 512, 1080);
    bg.addColorStop(0, '#0a0a14');
    bg.addColorStop(0.35, '#050508');
    bg.addColorStop(0.7, '#14030a');
    bg.addColorStop(1, '#020204');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 512, 1080);

    // Glowing futuristic neon ribbon ribbons
    ctx.globalCompositeOperation = 'lighter';
    const drawGlowRibbon = (cx, cy, r, color) => {
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0, color);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
    };
    drawGlowRibbon(160, 260, 240, 'rgba(255,31,61,0.5)');
    drawGlowRibbon(380, 580, 280, 'rgba(0,180,255,0.4)');
    drawGlowRibbon(200, 880, 220, 'rgba(168,85,247,0.35)');

    // Curved neon halo
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(360, 420, 190, 0, Math.PI * 2);
    ctx.stroke();

    ctx.globalCompositeOperation = 'source-over';

    // Dynamic Island / Camera punch-hole pill at the top
    ctx.fillStyle = '#000000';
    if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(196, 42, 120, 34, 17);
        ctx.fill();
    } else {
        ctx.fillRect(196, 42, 120, 34);
    }
    // Tiny camera lens glint
    ctx.fillStyle = '#0a1a2e';
    ctx.beginPath();
    ctx.arc(295, 59, 7, 0, Math.PI * 2);
    ctx.fill();

    // Lock screen clock
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.font = '700 114px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText(`${pad(now.getHours())}:${pad(now.getMinutes())}`, 256, 320);

    ctx.font = '600 28px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    const day = now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
    ctx.fillText(day, 256, 370);

    // Bottom home bar line
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(196, 1020, 120, 10, 5);
        ctx.fill();
    } else {
        ctx.fillRect(196, 1020, 120, 10);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
};

// Holographic particle emitter & projector pedestal
const HologramProjector = () => {
    const ring1 = useRef();
    const ring2 = useRef();

    useFrame((state) => {
        const t = state.clock.elapsedTime;
        if (ring1.current) ring1.current.rotation.z = t * 0.6;
        if (ring2.current) ring2.current.rotation.z = -t * 0.4;
    });

    return (
        <group position={[0, -2.6, 0]} rotation={[-Math.PI / 2.2, 0, 0]}>
            {/* Outer Cyan Laser Ring */}
            <mesh ref={ring1}>
                <ringGeometry args={[1.8, 1.88, 64]} />
                <meshBasicMaterial color="#00ffff" transparent opacity={0.75} side={THREE.DoubleSide} />
            </mesh>
            {/* Inner Red Laser Ring */}
            <mesh ref={ring2}>
                <ringGeometry args={[1.4, 1.46, 48]} />
                <meshBasicMaterial color="#ff1f3d" transparent opacity={0.65} side={THREE.DoubleSide} />
            </mesh>
            {/* Center Glowing Disc */}
            <mesh>
                <circleGeometry args={[1.35, 32]} />
                <meshBasicMaterial color="#00ffff" transparent opacity={0.08} side={THREE.DoubleSide} />
            </mesh>
            {/* Vertical Hologram Beacon Beam Cone */}
            <mesh position={[0, 0, 1.8]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[1.5, 0.4, 3.6, 32, 1, true]} />
                <meshBasicMaterial 
                    color="#00ffff" 
                    transparent 
                    opacity={0.07} 
                    side={THREE.DoubleSide} 
                    blending={THREE.AdditiveBlending}
                />
            </mesh>
        </group>
    );
};

// 3D Realistic Smartphone Geometry with accurate Titanium Rails, Glass Screen, and Rear Triple Camera Island
const RealisticPhone = ({ isHolographic }) => {
    const group = useRef();
    const screenTex = useMemo(createPhoneScreenTexture, []);
    const holoWireRef = useRef();

    useFrame((state) => {
        const t = state.clock.elapsedTime;
        if (group.current) {
            // Smooth levitation float
            group.current.position.y = Math.sin(t * 1.5) * 0.1;
        }
        if (holoWireRef.current && isHolographic) {
            holoWireRef.current.material.opacity = 0.5 + Math.sin(t * 3.5) * 0.2;
        }
    });

    return (
        <group ref={group}>
            {/* Phone Dimensions: 2.3 width x 4.8 height x 0.26 depth */}
            {/* 1. Titanium Frame Chassis */}
            <RoundedBox args={[2.3, 4.8, 0.24]} radius={0.34} smoothness={8}>
                {isHolographic ? (
                    <meshStandardMaterial 
                        color="#03161c" 
                        metalness={0.95} 
                        roughness={0.2} 
                        emissive="#00e5ff" 
                        emissiveIntensity={0.3} 
                    />
                ) : (
                    <meshPhysicalMaterial
                        color="#1c1c22"
                        metalness={0.92}
                        roughness={0.22}
                        clearcoat={1}
                        clearcoatRoughness={0.15}
                    />
                )}
            </RoundedBox>

            {/* Hologram wireframe overlay */}
            {isHolographic && (
                <group ref={holoWireRef}>
                    <RoundedBox args={[2.32, 4.82, 0.26]} radius={0.34} smoothness={4}>
                        <meshBasicMaterial color="#00ffff" wireframe transparent opacity={0.6} />
                    </RoundedBox>
                </group>
            )}

            {/* 2. Front Screen Panel */}
            <mesh position={[0, 0, 0.122]}>
                <planeGeometry args={[2.14, 4.62]} />
                {isHolographic ? (
                    <meshBasicMaterial map={screenTex} transparent opacity={0.88} />
                ) : (
                    <meshStandardMaterial map={screenTex} roughness={0.1} metalness={0.1} />
                )}
            </mesh>

            {/* 3. Front Glass Reflection Layer */}
            {!isHolographic && (
                <mesh position={[0, 0, 0.124]}>
                    <planeGeometry args={[2.14, 4.62]} />
                    <meshPhysicalMaterial 
                        transparent 
                        opacity={0.18} 
                        roughness={0.05} 
                        metalness={0.3} 
                        color="#ffffff" 
                        depthWrite={false}
                    />
                </mesh>
            )}

            {/* 4. Rear Glass Back Cover */}
            <mesh position={[0, 0, -0.122]} rotation={[0, Math.PI, 0]}>
                <planeGeometry args={[2.14, 4.62]} />
                <meshPhysicalMaterial
                    color={isHolographic ? "#002028" : "#14141a"}
                    roughness={0.15}
                    metalness={0.7}
                    clearcoat={1}
                />
            </mesh>

            {/* 5. Minimal Apple/Brand Logo on the back */}
            {!isHolographic && (
                <mesh position={[0, 0, -0.124]} rotation={[0, Math.PI, 0]}>
                    <circleGeometry args={[0.22, 32]} />
                    <meshStandardMaterial color="#2d2d38" roughness={0.1} metalness={0.9} />
                </mesh>
            )}

            {/* 6. Realistic Rear Camera Island (Top-Left) */}
            <group position={[-0.52, 1.62, -0.14]}>
                {/* Rounded Camera Plateau */}
                <RoundedBox args={[0.95, 0.98, 0.08]} radius={0.18} smoothness={6}>
                    <meshPhysicalMaterial 
                        color={isHolographic ? "#00ffff" : "#0e0e14"} 
                        roughness={0.2} 
                        metalness={0.9} 
                        clearcoat={1}
                    />
                </RoundedBox>

                {/* Triple Pro Camera Lenses */}
                {[
                    [-0.24, 0.24],
                    [-0.24, -0.24],
                    [0.22, 0.0]
                ].map(([lx, ly], idx) => (
                    <group key={idx} position={[lx, ly, -0.05]}>
                        {/* Outer Titanium Ring */}
                        <mesh rotation={[Math.PI / 2, 0, 0]}>
                            <cylinderGeometry args={[0.16, 0.16, 0.05, 32]} />
                            <meshStandardMaterial color="#2a2a35" metalness={0.95} roughness={0.2} />
                        </mesh>
                        {/* Sapphire Glass Lens Eye */}
                        <mesh position={[0, 0, -0.027]} rotation={[Math.PI / 2, 0, 0]}>
                            <cylinderGeometry args={[0.12, 0.12, 0.02, 32]} />
                            <meshPhysicalMaterial color="#020308" roughness={0.05} metalness={0.98} />
                        </mesh>
                    </group>
                ))}

                {/* LiDAR sensor and True Tone Flash dots */}
                <mesh position={[0.22, 0.32, -0.045]}>
                    <circleGeometry args={[0.06, 16]} />
                    <meshBasicMaterial color="#ffeedd" />
                </mesh>
                <mesh position={[0.22, -0.32, -0.045]}>
                    <circleGeometry args={[0.05, 16]} />
                    <meshBasicMaterial color="#000000" />
                </mesh>
            </group>

            {/* 7. Side Buttons (Action button, Volume rocker, Power button) */}
            <RoundedBox args={[0.04, 0.45, 0.08]} radius={0.02} smoothness={3} position={[-1.17, 1.15, 0]}>
                <meshStandardMaterial color="#26262e" metalness={0.9} roughness={0.3} />
            </RoundedBox>
            <RoundedBox args={[0.04, 0.28, 0.08]} radius={0.02} smoothness={3} position={[-1.17, 1.6, 0]}>
                <meshStandardMaterial color="#26262e" metalness={0.9} roughness={0.3} />
            </RoundedBox>
            <RoundedBox args={[0.04, 0.6, 0.08]} radius={0.02} smoothness={3} position={[1.17, 1.1, 0]}>
                <meshStandardMaterial color="#26262e" metalness={0.9} roughness={0.3} />
            </RoundedBox>
        </group>
    );
};

const ThreeDViewer = () => {
    const [isHolographic, setIsHolographic] = useState(false);

    return (
        <div className="relative w-full h-full select-none overflow-hidden rounded-2xl bg-[radial-gradient(ellipse_at_center,#0d0f1a_0%,#040508_100%)]">
            <Canvas camera={{ position: [0, 0, 6.8], fov: 45 }}>
                {/* Ambient & Studio Directional Lights */}
                <ambientLight intensity={isHolographic ? 1.0 : 0.6} />
                <directionalLight position={[4, 6, 5]} intensity={isHolographic ? 1.4 : 1.8} color={isHolographic ? '#00e5ff' : '#ffffff'} />
                <directionalLight position={[-5, -4, 4]} intensity={0.5} color={isHolographic ? '#ff1f3d' : '#8899ff'} />
                <pointLight position={[0, -2.4, 2]} intensity={isHolographic ? 2.8 : 0.6} color={isHolographic ? '#00ffff' : '#ff1f3d'} />

                <Suspense fallback={
                    <Html center>
                        <div className="flex items-center gap-2 text-[11px] font-bold text-gray-300 bg-black/60 px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-md whitespace-nowrap">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                            Loading 3D Engine...
                        </div>
                    </Html>
                }>
                    <RealisticPhone isHolographic={isHolographic} />
                    {isHolographic && <HologramProjector />}
                </Suspense>

                <OrbitControls 
                    enableZoom={true} 
                    enablePan={false} 
                    maxPolarAngle={Math.PI / 1.4} 
                    minPolarAngle={Math.PI / 3.4}
                    autoRotate={true}
                    autoRotateSpeed={isHolographic ? 2.0 : 1.2}
                    dampingFactor={0.08}
                />
            </Canvas>

            {/* Bottom: Modern Hologram Toggle Pill */}
            <div className="absolute bottom-3 inset-x-0 z-20 flex justify-center pointer-events-auto px-3">
                <button 
                    onClick={(e) => { 
                        e.stopPropagation(); 
                        setIsHolographic(!isHolographic); 
                    }}
                    aria-label="Toggle Hologram Mode"
                    className={`group/holo relative flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider backdrop-blur-md transition-all duration-300 active:scale-95 shadow-xl border ${
                        isHolographic
                            ? 'bg-[#00ffff]/20 border-[#00ffff] text-[#00ffff] shadow-[0_0_22px_rgba(0,255,255,0.5)]'
                            : 'bg-black/85 border-white/15 text-white hover:border-red-500/50 hover:bg-black'
                    }`}
                >
                    <Zap size={13} className={isHolographic ? 'text-[#00ffff] fill-[#00ffff]' : 'text-red-500 fill-red-500'} />
                    <span>{isHolographic ? 'HOLOGRAM ACTIVE' : 'HOLOGRAM MODE'}</span>
                </button>
            </div>
        </div>
    );
};

export default ThreeDViewer;
