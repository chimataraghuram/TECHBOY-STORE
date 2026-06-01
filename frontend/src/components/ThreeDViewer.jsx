import React, { useState, Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, OrbitControls, useTexture, RoundedBox, Html } from '@react-three/drei';
import * as THREE from 'three';

const PhoneModel = ({ imageUrl, isHolographic }) => {
    // Load the product image as a texture
    const baseTexture = useTexture(imageUrl);
    const texture = baseTexture.clone();
    texture.colorSpace = THREE.SRGBColorSpace;
    const meshRef = useRef();

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
            meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.15;
        }
    });

    const chassisMaterial = isHolographic
        ? <meshStandardMaterial color="#00ffcc" wireframe emissive="#00ffcc" emissiveIntensity={0.8} transparent opacity={0.6} />
        : <meshStandardMaterial color="#1a1a1a" roughness={0.1} metalness={0.9} />;
        
    const screenMaterial = isHolographic
        ? <meshBasicMaterial map={texture} transparent opacity={0.75} />
        : <meshStandardMaterial map={texture} roughness={0.2} metalness={0.5} />;

    return (
        <group ref={meshRef}>
            {/* Chassis */}
            <RoundedBox args={[3, 6, 0.3]} radius={0.2} smoothness={4}>
                {chassisMaterial}
            </RoundedBox>
            
            {/* Screen */}
            <mesh position={[0, 0, 0.151]}>
                <planeGeometry args={[2.8, 5.8]} />
                {screenMaterial}
            </mesh>

            {/* Back Glow (if holographic) */}
            {isHolographic && (
                <mesh position={[0, 0, -0.151]}>
                    <planeGeometry args={[2.8, 5.8]} />
                    <meshBasicMaterial color="#00ffcc" transparent opacity={0.2} />
                </mesh>
            )}
            
            {/* Camera bump placeholder */}
            {!isHolographic && (
                <RoundedBox position={[-0.7, 2.2, -0.18]} args={[1.2, 1.2, 0.1]} radius={0.2} smoothness={4}>
                    <meshStandardMaterial color="#0a0a0a" roughness={0.4} metalness={0.9} />
                </RoundedBox>
            )}
        </group>
    );
};

const ThreeDViewer = ({ imageUrl }) => {
    const [isHolographic, setIsHolographic] = useState(false);

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative', borderRadius: '16px', overflow: 'hidden' }}>
            <Canvas camera={{ position: [0, 0, 7.5], fov: 50 }}>
                <ambientLight intensity={isHolographic ? 1.5 : 0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1.5} />
                <directionalLight position={[-10, -10, -5]} intensity={0.5} />
                
                <Suspense fallback={<Html center><div className="loading-dots" style={{color: 'white'}}>Loading 3D...</div></Html>}>
                    <PhoneModel imageUrl={imageUrl} isHolographic={isHolographic} />
                    {!isHolographic && <Environment preset="city" />}
                </Suspense>
                
                <OrbitControls 
                    enableZoom={true} 
                    enablePan={false} 
                    maxPolarAngle={Math.PI / 1.5} 
                    minPolarAngle={Math.PI / 3}
                    autoRotate={true}
                    autoRotateSpeed={1.5}
                />
            </Canvas>
            
            <button 
                onClick={(e) => { e.stopPropagation(); setIsHolographic(!isHolographic); }}
                className="jelly-btn mini"
                style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 10,
                    background: isHolographic ? 'rgba(0, 255, 204, 0.15)' : 'rgba(255,255,255,0.05)',
                    border: isHolographic ? '1px solid #00ffcc' : '1px solid rgba(255,255,255,0.1)',
                    color: isHolographic ? '#00ffcc' : 'white',
                    backdropFilter: 'blur(8px)',
                    whiteSpace: 'nowrap'
                }}
            >
                {isHolographic ? 'Disable Hologram' : 'Enable Hologram'}
            </button>
            <div style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                pointerEvents: 'none',
                background: 'rgba(0,0,0,0.5)',
                padding: '4px 8px',
                borderRadius: '8px',
                fontSize: '10px',
                color: 'rgba(255,255,255,0.6)'
            }}>
                Drag to rotate &bull; Scroll to zoom
            </div>
        </div>
    );
};

export default ThreeDViewer;
