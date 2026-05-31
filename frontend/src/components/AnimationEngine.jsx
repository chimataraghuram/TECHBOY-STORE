import { useEffect, useRef, useState } from 'react';
import { m, useScroll, useSpring } from 'framer-motion';

/* ── Scroll Progress Bar ── */
export const ScrollProgressBar = () => {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <div className="scroll-progress-track">
            <m.div 
                className="scroll-progress-bar" 
                style={{ scaleX, transformOrigin: '0%' }} 
            />
        </div>
    );
};

/* ── Count-Up Number ── */
export const CountUp = ({ end, duration = 1200, prefix = '', suffix = '', decimals = 0 }) => {
    const [count, setCount] = useState(end); // Default to final value for robustness
    const ref = useRef(null);
    const started = useRef(false);

    useEffect(() => {
        setCount(0); // Start at 0 on mount
        started.current = false;

        let rafId;
        let fallbackTimeout;

        const startAnimation = () => {
            if (started.current) return;
            started.current = true;
            if (fallbackTimeout) clearTimeout(fallbackTimeout);

            const startTime = performance.now();
            const animate = (now) => {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
                const val = eased * end;
                setCount(decimals > 0 ? parseFloat(val.toFixed(decimals)) : Math.floor(val));
                if (progress < 1) {
                    rafId = requestAnimationFrame(animate);
                }
            };
            rafId = requestAnimationFrame(animate);
        };

        // Fallback safety timeout: if observer hasn't fired in 1200ms, start animation anyway
        fallbackTimeout = setTimeout(() => {
            if (!started.current) {
                startAnimation();
            }
        }, 1200);

        if (!window.IntersectionObserver) {
            startAnimation();
            return;
        }

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                startAnimation();
                observer.disconnect();
            }
        }, { threshold: 0.05 });

        if (ref.current) observer.observe(ref.current);

        return () => {
            if (rafId) cancelAnimationFrame(rafId);
            if (fallbackTimeout) clearTimeout(fallbackTimeout);
            observer.disconnect();
        };
    }, [end, duration, decimals]);

    const formatValue = (v) => {
        if (decimals > 0) return v.toFixed(decimals);
        return v.toLocaleString('en-IN');
    };

    return <span ref={ref}>{prefix}{formatValue(count)}{suffix}</span>;
};

/* ── Glowing Cursor Trail (desktop only) ── */
export const CursorTrail = () => {
    const trailRef = useRef([]);
    const mousePos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if (window.matchMedia('(pointer: coarse)').matches) return; // skip on mobile

        const DOT_COUNT = 8;
        const dots = Array.from({ length: DOT_COUNT }, (_, i) => {
            const el = document.createElement('div');
            el.className = 'cursor-trail-dot';
            el.style.opacity = String(1 - i * 0.1);
            el.style.transform = `scale(${1 - i * 0.1})`;
            document.body.appendChild(el);
            return { el, x: 0, y: 0 };
        });
        trailRef.current = dots;

        const onMouseMove = (e) => {
            mousePos.current = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener('mousemove', onMouseMove);

        let rafId;
        const animate = () => {
            let { x, y } = mousePos.current;
            dots.forEach((dot, i) => {
                dot.x += (x - dot.x) * (0.35 - i * 0.03);
                dot.y += (y - dot.y) * (0.35 - i * 0.03);
                dot.el.style.left = `${dot.x}px`;
                dot.el.style.top = `${dot.y}px`;
                x = dot.x;
                y = dot.y;
            });
            rafId = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            cancelAnimationFrame(rafId);
            dots.forEach(d => d.el.remove());
        };
    }, []);

    return null;
};

/* ── Stats Strip with count-up ── */
export const StatsStrip = () => {
    const stats = [
        { value: 54, suffix: '+', label: 'Phones Reviewed' },
        { value: 6, suffix: ' Ranges', label: 'Budget Categories' },
        { value: 100, suffix: '%', label: 'Expert Verified' },
        { value: 3, suffix: ' Platforms', label: 'Buy Link Sources' },
    ];

    return (
        <div className="stats-strip glass-card">
            {stats.map((s, i) => (
                <div key={i} className="stat-item">
                    <span className="stat-number">
                        <CountUp end={s.value} suffix={s.suffix} />
                    </span>
                    <span className="stat-label">{s.label}</span>
                </div>
            ))}
        </div>
    );
};
