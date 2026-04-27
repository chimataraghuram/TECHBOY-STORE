import { useEffect, useRef, useState } from 'react';

/* ── Scroll Progress Bar ── */
export const ScrollProgressBar = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const update = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
        };
        window.addEventListener('scroll', update, { passive: true });
        return () => window.removeEventListener('scroll', update);
    }, []);

    return (
        <div className="scroll-progress-track">
            <div className="scroll-progress-bar" style={{ width: `${progress}%` }} />
        </div>
    );
};

/* ── Count-Up Number ── */
export const CountUp = ({ end, duration = 1800, suffix = '' }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const started = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !started.current) {
                started.current = true;
                const startTime = performance.now();
                const animate = (now) => {
                    const elapsed = now - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
                    setCount(Math.floor(eased * end));
                    if (progress < 1) requestAnimationFrame(animate);
                };
                requestAnimationFrame(animate);
            }
        }, { threshold: 0.5 });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [end, duration]);

    return <span ref={ref}>{count}{suffix}</span>;
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
