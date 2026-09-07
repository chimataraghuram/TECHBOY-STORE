import React, { Suspense, useMemo, useRef, useState, useEffect, Component } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

/* Procedural lock-screen texture — zero network requests, always resolves */
const createScreenTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');

    const bg = ctx.createLinearGradient(0, 0, 512, 1080);
    bg.addColorStop(0, '#12030a');
    bg.addColorStop(0.45, '#0a0a12');
    bg.addColorStop(1, '#2a0410');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 512, 1080);

    // Red aurora glows
    ctx.globalCompositeOperation = 'lighter';
    const drawGlow = (x, y, r, color) => {
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, color);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.fillRect(x - r, y - r, r * 2, r * 2);
    };
    drawGlow(140, 200, 260, 'rgba(255,32,56,0.55)');
    drawGlow(420, 760, 300, 'rgba(255,80,120,0.35)');
    drawGlow(60, 950, 220, 'rgba(120,0,40,0.5)');

    // Light ring
    ctx.strokeStyle = 'rgba(255,255,255,0.10)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(380, 330, 170, 0, Math.PI * 2);
    ctx.stroke();

    ctx.globalCompositeOperation = 'source-over';

    // Lock screen clock
    const pad = (n) => String(n).padStart(2, '0');
    const now = new Date();
    ctx.fillStyle = 'rgba(255,255,255,0.96)';
    ctx.textAlign = 'center';
    ctx.font = '700 118px "Plus Jakarta Sans", Inter, sans-serif';
    ctx.fillText(`${pad(now.getHours())}:${pad(now.getMinutes())}`, 256, 400);
    ctx.font = '600 30px "Plus Jakarta Sans", Inter, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.66)';
    const day = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
    ctx.fillText(day, 256, 452);

    // Bottom pill
    ctx.fillStyle = 'rgba(255,255,255,0.14)';
    if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(196, 990, 120, 34, 17);
        ctx.fill();
    } else {
        ctx.fillRect(196, 990, 120, 34);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
};

const Phone3D = () => {
    const group = useRef();
    const screenTex = useMemo(createScreenTexture, []);

    useFrame((state) => {
        const t = state.clock.elapsedTime;
        if (!group.current) return;
        // Gentle levitation
        group.current.position.y = Math.sin(t * 0.9) * 0.12;
        // Mouse parallax
        const targetX = Math.sin(t * 0.4) * 0.08 + state.pointer.y * -0.12;
        const targetY = -0.55 + state.pointer.x * 0.35;
        group.current.rotation.x += (targetX - group.current.rotation.x) * 0.05;
        group.current.rotation.y += (targetY - group.current.rotation.y) * 0.05;
    });

    return (
        <group ref={group} rotation={[0, -0.55, 0]} position={[0, -0.1, 0]}>
            {/* Frame */}
            <RoundedBox args={[2.62, 5.4, 0.3]} radius={0.42} smoothness={6}>
                <meshPhysicalMaterial
                    color="#16161c"
                    metalness={0.95}
                    roughness={0.28}
                    clearcoat={1}
                    clearcoatRoughness={0.2}
                />
            </RoundedBox>

            {/* Screen */}
            <mesh position={[0, 0, 0.152]}>
                <planeGeometry args={[2.42, 5.2]} />
                <meshBasicMaterial map={screenTex} toneMapped={false} />
            </mesh>
            {/* Screen glass reflection */}
            <mesh position={[0, 0, 0.155]} rotation={[0, 0, 0]}>
                <planeGeometry args={[2.42, 5.2]} />
                <meshPhysicalMaterial
                    transparent
                    opacity={0.14}
                    roughness={0.05}
                    metalness={0.4}
                    color="#ff5468"
                    depthWrite={false}
                />
            </mesh>

            {/* Camera island */}
            <RoundedBox args={[1.15, 1.15, 0.14]} radius={0.22} smoothness={5} position={[-0.62, 2.02, -0.2]}>
                <meshPhysicalMaterial color="#0c0c10" metalness={0.9} roughness={0.35} clearcoat={1} />
            </RoundedBox>
            {[[-0.94, 2.33], [-0.3, 2.33], [-0.62, 1.71]].map(([x, y], i) => (
                <mesh key={i} position={[x, y, -0.26]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.21, 0.21, 0.08, 32]} />
                    <meshPhysicalMaterial color="#05060a" metalness={1} roughness={0.12} clearcoat={1} />
                </mesh>
            ))}

            {/* Side buttons */}
            <RoundedBox args={[0.06, 0.55, 0.1]} radius={0.03} smoothness={3} position={[1.34, 1.2, 0]}>
                <meshStandardMaterial color="#26262e" metalness={0.9} roughness={0.4} />
            </RoundedBox>
            <RoundedBox args={[0.06, 0.3, 0.1]} radius={0.03} smoothness={3} position={[-1.34, 1.5, 0]}>
                <meshStandardMaterial color="#26262e" metalness={0.9} roughness={0.4} />
            </RoundedBox>
        </group>
    );
};

class Hero3DBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { failed: false };
    }
    static getDerivedStateFromError() {
        return { failed: true };
    }
    render() {
        return this.state.failed ? null : this.props.children;
    }
}

const HeroPhone3D = ({ className = '' }) => {
    const [inView, setInView] = useState(false);
    const [supported, setSupported] = useState(true);
    const holderRef = useRef(null);

    useEffect(() => {
        try {
            const testCanvas = document.createElement('canvas');
            const gl = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl');
            if (!gl) {
                setSupported(false);
                return;
            }
        } catch {
            setSupported(false);
            return;
        }

        const el = holderRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => setInView(entry.isIntersecting),
            { threshold: 0.05 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    if (!supported) return null;

    return (
        <div ref={holderRef} className={`pointer-events-auto ${className}`}>
            {inView && (
                <Hero3DBoundary>
                    <Suspense fallback={null}>
                        <Canvas
                            dpr={[1, 1.75]}
                            camera={{ position: [0, 0, 6.4], fov: 42 }}
                            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
                            style={{ background: 'transparent' }}
                        >
                            <ambientLight intensity={0.55} />
                            <directionalLight position={[4, 5, 6]} intensity={1.4} color="#ffffff" />
                            <directionalLight position={[-6, -2, 4]} intensity={0.5} color="#ffd7dd" />
                            <pointLight position={[-4, 2, -4]} intensity={26} color="#ff2038" distance={14} />
                            <pointLight position={[4, -3, -3]} intensity={14} color="#ff5f7e" distance={12} />
                            <spotLight position={[0, 6, 4]} angle={0.5} penumbra={1} intensity={1.6} color="#ffffff" />
                            <Phone3D />
                        </Canvas>
                    </Suspense>
                </Hero3DBoundary>
            )}
        </div>
    );
};

export default HeroPhone3D;
