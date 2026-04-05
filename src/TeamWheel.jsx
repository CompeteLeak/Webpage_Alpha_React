import { useState, useRef, useEffect, useCallback } from 'react';

// ── Config ────────────────────────────────────────────────────────────────────

const ALL_PLAYERS = ['Alice', 'Bob', 'Charlie', 'Diana', 'Ethan', 'Fiona'];

// Dark fill + neon accent per segment — each segment glows its own colour
const SEGMENTS = [
  { fill: '#03111a', accent: '#00f0ff' },  // cyan
  { fill: '#100318', accent: '#bf5fff' },  // violet
  { fill: '#1a0308', accent: '#ff5f7e' },  // magenta
  { fill: '#031a0d', accent: '#00ffaa' },  // mint
  { fill: '#1a0e03', accent: '#ffbf00' },  // amber
  { fill: '#03081a', accent: '#5f9fff' },  // blue
];

// ── Inline styles (Fibonacci proportions throughout) ─────────────────────────
// Scale used (px): 3 5 8 13 21 34 55    Line-height: 1.618 (φ)

const S = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '34px 21px',
    fontFamily: "'Orbitron', sans-serif",
    color: '#d1d1d1',
    minHeight: '100%',
  },
  title: {
    fontSize: '21px',
    color: '#00f0ff',
    textShadow: '0 0 8px #00f0ffaa, 0 0 21px #00f0ff44',
    letterSpacing: '5px',
    margin: '0 0 34px',
    textTransform: 'uppercase',
  },
  canvasWrap: {
    position: 'relative',
    width: '360px',
    height: '360px',
  },
  resetBtn: {
    position: 'absolute',
    top: '0',
    right: '0',
    padding: '5px 13px',
    background: 'transparent',
    border: '1px solid rgba(255,95,126,0.5)',
    color: 'rgba(255,95,126,0.8)',
    fontFamily: "'Orbitron', sans-serif",
    fontSize: '11px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  resetBtnHover: {
    background: 'rgba(255,95,126,0.1)',
    borderColor: '#ff5f7e',
    color: '#ff5f7e',
    boxShadow: '0 0 8px rgba(255,95,126,0.4)',
  },
  canvas: {
    display: 'block',
    border: '1px solid rgba(0,240,255,0.3)',
    boxShadow: '0 0 21px rgba(0,240,255,0.15), 0 0 55px rgba(0,240,255,0.05)',
  },
  btn: {
    marginTop: '21px',
    padding: '8px 34px',
    background: 'transparent',
    border: '1px solid rgba(0,240,255,0.6)',
    color: '#00f0ff',
    fontFamily: "'Orbitron', sans-serif",
    fontSize: '13px',
    letterSpacing: '3px',
    textTransform: 'uppercase',
    cursor: 'pointer',
    boxShadow: '0 0 8px rgba(0,240,255,0.2)',
    transition: 'all 0.3s ease',
  },
  btnHover: {
    background: 'rgba(0,240,255,0.08)',
    boxShadow: '0 0 13px rgba(0,240,255,0.4)',
    borderColor: '#00f0ff',
  },
  btnDisabled: {
    opacity: 0.35,
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
  selected: {
    marginTop: '21px',
    fontSize: '21px',
    color: '#00f0ff',
    textShadow: '0 0 13px #00f0ffcc, 0 0 34px #00f0ff55',
    letterSpacing: '3px',
    textTransform: 'uppercase',
  },
  orderWrap: {
    marginTop: '21px',
    width: '100%',
    maxWidth: '360px',
  },
  orderTitle: {
    fontSize: '13px',
    color: 'rgba(0,240,255,0.6)',
    letterSpacing: '5px',
    textTransform: 'uppercase',
    margin: '0 0 8px',
  },
  orderList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  orderItem: (i) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '13px',
    padding: '5px 13px',
    fontSize: '13px',
    color: 'rgba(209,209,209,0.7)',
    letterSpacing: '2px',
    borderLeft: `2px solid ${SEGMENTS[i % SEGMENTS.length].accent}66`,
    transition: 'border-color 0.3s ease',
  }),
  orderIndex: (i) => ({
    color: SEGMENTS[i % SEGMENTS.length].accent,
    fontSize: '11px',
    opacity: 0.8,
    minWidth: '13px',
  }),
};

// ── Component ─────────────────────────────────────────────────────────────────

function TeamWheel() {
  const [remaining,     setRemaining]     = useState([...ALL_PLAYERS]);
  const [selectedOrder, setSelectedOrder] = useState([]);
  const [spinning,      setSpinning]      = useState(false);
  const [lastPicked,    setLastPicked]    = useState(null);
  const [btnHover,      setBtnHover]      = useState(false);
  const [resetHover,    setResetHover]    = useState(false);

  const canvasRef   = useRef(null);
  const rotationRef = useRef(0);

  const drawWheel = useCallback((rot, names) => {
    const canvas = canvasRef.current;
    if (!canvas || names.length === 0) return;
    const ctx    = canvas.getContext('2d');
    const size   = canvas.width;
    const radius = size / 2 - 4; // slight inset so outer ring is visible
    const num    = names.length;
    const arc    = (2 * Math.PI) / num;

    ctx.clearRect(0, 0, size, size);
    ctx.save();
    ctx.translate(size / 2, size / 2);
    ctx.rotate(rot);

    // ── Segments ──
    for (let i = 0; i < num; i++) {
      const seg = SEGMENTS[i % SEGMENTS.length];

      // Fill
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, i * arc, (i + 1) * arc);
      ctx.fillStyle = seg.fill;
      ctx.fill();

      // Glowing border
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, i * arc, (i + 1) * arc);
      ctx.closePath();
      ctx.strokeStyle = seg.accent + '55';
      ctx.lineWidth   = 1;
      ctx.shadowColor = seg.accent;
      ctx.shadowBlur  = 8;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Label
      ctx.save();
      ctx.rotate(i * arc + arc / 2);
      ctx.textAlign    = 'right';
      ctx.font         = "bold 12px 'Orbitron', sans-serif";
      ctx.fillStyle    = seg.accent;
      ctx.shadowColor  = seg.accent;
      ctx.shadowBlur   = 6;
      ctx.fillText(names[i], radius - 10, 4);
      ctx.shadowBlur = 0;
      ctx.restore();
    }

    // ── Outer ring glow ──
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0,240,255,0.35)';
    ctx.lineWidth   = 1.5;
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur  = 13;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // ── Centre dot ──
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fillStyle   = '#00f0ff';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur  = 13;
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.restore();

    // ── Pointer (outside rotation) ──
    const cx = size / 2;
    ctx.beginPath();
    ctx.moveTo(cx,      size - 22); // tip
    ctx.lineTo(cx - 9,  size - 4);
    ctx.lineTo(cx + 9,  size - 4);
    ctx.closePath();
    ctx.fillStyle   = '#00f0ff';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur  = 13;
    ctx.fill();

    // pointer base bar
    ctx.beginPath();
    ctx.moveTo(cx - 11, size - 2);
    ctx.lineTo(cx + 11, size - 2);
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth   = 2;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }, []);

  useEffect(() => {
    drawWheel(rotationRef.current, remaining);
  }, [remaining, drawWheel]);

  const getWinner = (finalRot, names) => {
    const segmentAngle = (2 * Math.PI) / names.length;
    const pointerAngle = Math.PI / 2;
    const relative = ((pointerAngle - finalRot) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
    return names[Math.floor(relative / segmentAngle) % names.length];
  };

  const spinWheel = () => {
    if (spinning || remaining.length === 0) return;
    setSpinning(true);
    setLastPicked(null);

    const spinTimeTotal  = Math.random() * 3000 + 3000;
    const spinAngleStart = Math.random() * 10 + 10;
    const startTime      = performance.now();
    const names          = [...remaining];
    let currentRot       = rotationRef.current;

    const rotate = (now) => {
      const spinTime = now - startTime;

      if (spinTime >= spinTimeTotal) {
        rotationRef.current = currentRot;
        const winner = getWinner(currentRot, names);
        setLastPicked(winner);
        setSelectedOrder(prev => [...prev, winner]);
        setSpinning(false);
        setRemaining(prev => {
          const next = prev.filter(n => n !== winner);
          if (next.length === 0) {
            setTimeout(() => {
              rotationRef.current = 0;
              setRemaining([...ALL_PLAYERS]);
              setSelectedOrder([]);
              setLastPicked(null);
            }, 2500);
          }
          return next;
        });
        return;
      }

      const spinAngle  = spinAngleStart * Math.exp(-spinTime / spinTimeTotal);
      currentRot      += spinAngle * (Math.PI / 180);
      rotationRef.current = currentRot;
      drawWheel(currentRot, names);
      requestAnimationFrame(rotate);
    };

    requestAnimationFrame(rotate);
  };

  const allSelected = remaining.length === 0;

  const resetWheel = () => {
    rotationRef.current = 0;
    setRemaining([...ALL_PLAYERS]);
    setSelectedOrder([]);
    setLastPicked(null);
  };

  const btnStyle = {
    ...S.btn,
    ...(btnHover && !spinning && !allSelected ? S.btnHover   : {}),
    ...(spinning || allSelected               ? S.btnDisabled : {}),
  };

  return (
    <div style={S.container}>
      <h2 style={S.title}>Team Wheel</h2>

      <div style={S.canvasWrap}>
        <canvas ref={canvasRef} width={360} height={360} style={S.canvas} />
        <button
          onClick={resetWheel}
          disabled={spinning}
          style={{ ...S.resetBtn, ...(resetHover && !spinning ? S.resetBtnHover : {}) }}
          onMouseEnter={() => setResetHover(true)}
          onMouseLeave={() => setResetHover(false)}
        >
          Reset
        </button>
      </div>

      <button
        onClick={spinWheel}
        disabled={spinning || allSelected}
        style={btnStyle}
        onMouseEnter={() => setBtnHover(true)}
        onMouseLeave={() => setBtnHover(false)}
      >
        {spinning ? 'Spinning...' : allSelected ? 'Resetting...' : 'Spin'}
      </button>

      {lastPicked && (
        <p style={S.selected}>{lastPicked}</p>
      )}

      {selectedOrder.length > 0 && (
        <div style={S.orderWrap}>
          <p style={S.orderTitle}>Selection order</p>
          <ol style={S.orderList}>
            {selectedOrder.map((name, i) => (
              <li key={i} style={S.orderItem(i)}>
                <span style={S.orderIndex(i)}>{i + 1}</span>
                {name}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

export default TeamWheel;
