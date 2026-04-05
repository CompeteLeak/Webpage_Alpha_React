import { useEffect, useRef } from 'react';
import './About.css';

const PHI = 1.6180339887;
const GOLDEN_ANGLE = 2 * Math.PI / (PHI * PHI); // ~137.5° — how nature arranges seeds
const SPIRAL_B = Math.log(PHI) / (Math.PI / 2);  // golden spiral growth rate

const TRAITS = [
  { label: 'Street-smart adaptability', desc: 'Reads a room, a threat, or a person instantly. Never caught flat-footed.' },
  { label: 'Tech-savvy precision',       desc: 'Understands and leverages modern tools, systems, and digital ops to gain the upper hand.' },
  { label: 'High-stakes finesse',        desc: 'Can defuse or manipulate social tension with calm, charm, or quiet intimidation.' },
  { label: 'Strong moral compass',       desc: 'Never betrays values or allies. Ruthless with enemies, loyal to the code.' },
  { label: 'Clean, modern style',        desc: 'Moves between corporate, street, and covert spaces without compromising presence.' },
];

// Fibonacci animation delays: 0.3, 0.5, 0.8, 1.3, 2.1
const TRAIT_DELAYS = [0.3, 0.5, 0.8, 1.3, 2.1];

function About() {
  const canvasRef = useRef(null);
  const frameRef  = useRef(null);
  const rotRef    = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      if (!W || !H) { frameRef.current = requestAnimationFrame(draw); return; }

      ctx.clearRect(0, 0, W, H);

      const cx   = W / 2;
      const cy   = H / 2;
      const maxR = Math.min(W, H) * 0.46;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotRef.current);

      // ── 1. Sunflower dot field (Fibonacci golden angle pattern) ──────────
      // 233 dots (Fibonacci number) placed at golden angle increments —
      // the same geometry found in sunflowers, pinecones, and nautilus shells
      const N = 233;
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur  = 6;
      for (let n = 0; n < N; n++) {
        const angle = n * GOLDEN_ANGLE;
        const r     = maxR * Math.sqrt(n) / Math.sqrt(N);
        const x     = r * Math.cos(angle);
        const y     = r * Math.sin(angle);
        const t     = n / N;
        const alpha = 0.1 + 0.35 * t;
        const size  = 0.6 + 1.6 * t;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 240, 255, ${alpha})`;
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      // ── 2. Golden spiral ─────────────────────────────────────────────────
      const turns = 4;
      const steps = 600;

      const traceSpiral = () => {
        ctx.beginPath();
        for (let i = 0; i <= steps; i++) {
          const theta = (i / steps) * turns * 2 * Math.PI;
          const r     = maxR * Math.exp(SPIRAL_B * (theta - turns * 2 * Math.PI));
          const x     = r * Math.cos(theta);
          const y     = r * Math.sin(theta);
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
      };

      // outer glow pass
      traceSpiral();
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
      ctx.lineWidth   = 8;
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur  = 24;
      ctx.stroke();

      // sharp inner pass
      traceSpiral();
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.65)';
      ctx.lineWidth   = 1.5;
      ctx.shadowBlur  = 6;
      ctx.stroke();

      ctx.shadowBlur = 0;
      ctx.restore();

      // very slow rotation — one full turn roughly every 35 minutes at 60fps
      rotRef.current  += 0.0003;
      frameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="about-container">
      <canvas ref={canvasRef} className="about-spiral" />

      <div className="about-content">

        <header className="about-header">
          <span className="about-eyebrow">AGENT PROFILE</span>
          <h1 className="about-name">L0ewki</h1>
          <p className="about-archetype">
            Urban operative — elite finesse, grounded morals, tactical mastery
          </p>
        </header>

        <p className="about-bio">
          A modern fusion of James Bond's composure, Eggsy's street-bred brilliance,
          and Sterling Archer's improvisational edge — built with real-world practicality.
        </p>

        <ul className="about-traits">
          {TRAITS.map((trait, i) => (
            <li
              key={i}
              className="about-trait"
              style={{ animationDelay: `${TRAIT_DELAYS[i]}s` }}
            >
              <span className="trait-label">{trait.label}</span>
              <span className="trait-desc">{trait.desc}</span>
            </li>
          ))}
        </ul>

        <footer className="about-sign-off">
          <p>He doesn't shout. He doesn't chase clout.</p>
          <p className="about-sign-off--lit">He just wins — quietly and efficiently.</p>
        </footer>

      </div>
    </div>
  );
}

export default About;
