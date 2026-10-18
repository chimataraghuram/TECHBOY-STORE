import React, { useState, Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useTexture, RoundedBox, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Zap, Eye, RotateCw } from 'lucide-react';

// Hologram ring effect beneath the device
const HoloRings = () => {
    const ringRef = useRef();
    useFrame((state) => {
        if (ringRef.current) {
            ringRef.current.rotation.z = state.clock.elapsedTime * 0.35;
        }
    });

    return (
        <group position={[0, -3.2, 0]} rotation={[-Math.PI / 2.3, 0, 0]}>
            <mesh ref={ringRef}>
                <ringGeometry args={[2.0, 2.06, 64]} />
                <meshBasicMaterial color="#00ffff" transparent opacity={0.65} side={THREE.DoubleSide} />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 4]}>
                <ringGeometry args={[2.5, 2.54, 64]} />
                <meshBasicMaterial color="#ff1f3d" transparent opacity={0.4} side={THREE.DoubleSide} />
            </mesh>
            <mesh>
                <circleGeometry args={[2.8, 48]} />
                <meshBasicMaterial color="#00ffff" transparent opacity={0.06} side={THREE.DoubleSide} />
            </mesh>
        </group>
    );
};

// 3D Phone Model with realistic materials & laser hologram beam
const PhoneModel = ({ imageUrl, isHolographic }) => {
    const baseTexture = useTexture(imageUrl);
    const texture = baseTexture.clone();
    texture.colorSpace = THREE.SRGBColorSpace;
    const meshRef = useRef();
    const holoWireRef = useRef();

    useFrame((state) => {
        const t = state.clock.elapsedTime;
        if (meshRef.current) {
            // Gentle sci-fi levitation
            meshRef.current.position.y = Math.sin(t * 1.6) * 0.12;
            meshRef.current.rotation.y = Math.sin(t * 0.7) * 0.25;
            meshRef.current.rotation.x = Math.sin(t * 0.5) * 0.04;
        }
        if (holoWireRef.current && isHolographic) {
            holoWireRef.current.material.opacity = 0.55 + Math.sin(t * 4.0) * 0.2;
        }
    });

    return (
        <group ref={meshRef}>
            {/* Phone Body Chassis */}
            <RoundedBox args={[2.85, 5.85, 0.28]} radius={0.22} smoothness={8}>
                {isHolographic ? (
                    <meshStandardMaterial 
                        color="#051c24" 
                        roughness={0.2} 
                        metalness={0.9} 
                        emissive="#00e5ff" 
                        emissiveIntensity={0.35} 
                    />
                ) : (
                    <meshStandardMaterial 
                        color="#121217" 
                        roughness={0.15} 
                        metalness={0.95} 
                    />
                )}
            </RoundedBox>

            {/* Glowing Laser Wireframe overlay in Hologram mode */}
            {isHolographic && (
                <group ref={holoWireRef}>
                    <RoundedBox args={[2.87, 5.87, 0.30]} radius={0.22} smoothness={4}>
                        <meshBasicMaterial 
                            color="#00ffff" 
                            wireframe 
                            transparent 
                            opacity={0.65} 
                        />
                    </RoundedBox>
                </group>
            )}

            {/* Front Glass Screen with Product Texture */}
            <mesh position={[0, 0, 0.145]}>
                <planeGeometry args={[2.68, 5.68]} />
                {isHolographic ? (
                    <meshBasicMaterial 
                        map={texture} 
                        transparent 
                        opacity={0.88} 
                    />
                ) : (
                    <meshStandardMaterial 
                        map={texture} 
                        roughness={0.1} 
                        metalness={0.2} 
                    />
                )}
            </mesh>

            {/* Holographic scanning laser beam line */}
            {isHolographic && (
                <mesh position={[0, 0, 0.152]}>
                    <planeGeometry args={[2.7, 0.05]} />
                    <meshBasicMaterial color="#00ffff" transparent opacity={0.85} />
                </mesh>
            )}

            {/* Realistic Camera Bump & Triple Lenses on the rear */}
            <group position={[-0.65, 1.95, -0.16]}>
                <RoundedBox args={[1.1, 1.15, 0.08]} radius={0.18} smoothness={6}>
                    <meshStandardMaterial 
                        color={isHolographic ? "#00e5ff" : "#0d0d12"} 
                        roughness={0.25} 
                        metalness={0.9} 
                        emissive={isHolographic ? "#00ffff" : "#000000"}
                        emissiveIntensity={isHolographic ? 0.4 : 0}
                    />
                </RoundedBox>
                {/* Triple camera lens rings */}
                {[[-0.24, 0.25], [-0.24, -0.25], [0.26, 0.0]].map(([lx, ly], idx) => (
                    <mesh key={idx} position={[lx, ly, -0.05]}>
                        <cylinderGeometry args={[0.18, 0.18, 0.04, 32]} rotation={[Math.PI / 2, 0, 0]} />
                        <meshStandardMaterial color="#050508" metalness={0.95} roughness={0.1} />
                    </mesh>
                ))}
            </group>
        </group>
    );
};

const ThreeDViewer = ({ imageUrl }) => {
    const [isHolographic, setIsHolographic] = useState(false);

    return (
        <div className="relative w-full h-full select-none overflow-hidden rounded-xl bg-[radial-gradient(ellipse_at_center,#0d0f1a_0%,#05060a_100%)]">
            <Canvas camera={{ position: [0, 0, 7.8], fov: 46 }}>
                {/* Lighting setup */}
                <ambientLight intensity={isHolographic ? 1.2 : 0.75} />
                <directionalLight position={[6, 8, 5]} intensity={isHolographic ? 1.4 : 1.8} color={isHolographic ? '#00e5ff' : '#ffffff'} />
                <directionalLight position={[-6, -6, -4]} intensity={0.6} color={isHolographic ? '#ff1f3d' : '#8888ff'} />
                <pointLight position={[0, -2.5, 2]} intensity={isHolographic ? 2.5 : 0.8} color={isHolographic ? '#00ffff' : '#ff1f3d'} />

                <Suspense fallback={
                    <Html center>
                        <div className="flex items-center gap-2 text-[11px] font-bold text-gray-300 bg-black/60 px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-md whitespace-nowrap">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                            Loading 3D...
                        </div>
                    </Html>
                }>
                    <PhoneModel imageUrl={imageUrl} isHolographic={isHolographic} />
                    {isHolographic && <HoloRings />}
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

            {/* Top Right: Sleek Minimal Hint Pill */}
            <div className="absolute top-2.5 right-2.5 z-20 pointer-events-none flex items-center gap-1.5 rounded-full bg-black/65 border border-white/10 px-2.5 py-1 text-[10px] font-semibold text-gray-300 backdrop-blur-md shadow-lg">
                <RotateCw size={10} className="text-red-400 animate-spin" style={{ animationDuration: '6s' }} />
                <span>360° Interactive</span>
            </div>

            {/* Bottom: Modern Hologram Toggle Pill */}
            <div className="absolute bottom-2.5 inset-x-0 z-20 flex justify-center pointer-events-auto px-3">
                <button 
                    onClick={(e) => { 
                        e.stopPropagation(); 
                        setIsHolographic(!isHolographic); 
                    }}
                    aria-label="Toggle Hologram Mode"
                    className={`group/holo relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider backdrop-blur-md transition-all duration-300 active:scale-95 shadow-lg border ${
                        isHolographic
                            ? 'bg-[#00ffff]/15 border-[#00ffff] text-[#00ffff] shadow-[0_0_18px_rgba(0,255,255,0.45)]'
                            : 'bg-black/75 border-white/15 text-gray-200 hover:border-red-500/50 hover:text-white hover:bg-black/90'
                    }`}
                >
                    <Zap size={12} className={isHolographic ? 'text-[#00ffff] fill-[#00ffff]' : 'text-red-500'} />
                    <span>{isHolographic ? 'Hologram Active' : 'Hologram Mode'}</span>
                </button>
            </div>
        </div>
    );
};

export default ThreeDViewer;
