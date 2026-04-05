import { useState, useRef, useEffect, useCallback } from 'react';

const ALL_PLAYERS = ['Alice', 'Bob', 'Charlie', 'Diana', 'Ethan', 'Fiona'];
const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

function TeamWheel() {
  const [remaining, setRemaining] = useState([...ALL_PLAYERS]);
  const [selectedOrder, setSelectedOrder] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [lastPicked, setLastPicked] = useState(null);

  const canvasRef = useRef(null);
  const rotationRef = useRef(0);

  const drawWheel = useCallback((rot, names) => {
    const canvas = canvasRef.current;
    if (!canvas || names.length === 0) return;
    const ctx = canvas.getContext('2d');
    const size = canvas.width;
    const numSegments = names.length;
    const segmentAngle = (2 * Math.PI) / numSegments;

    ctx.clearRect(0, 0, size, size);
    ctx.save();
    ctx.translate(size / 2, size / 2);
    ctx.rotate(rot);

    for (let i = 0; i < numSegments; i++) {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.fillStyle = COLORS[i % COLORS.length];
      ctx.arc(0, 0, size / 2, i * segmentAngle, (i + 1) * segmentAngle);
      ctx.fill();
      ctx.stroke();

      ctx.save();
      ctx.fillStyle = 'white';
      ctx.rotate(i * segmentAngle + segmentAngle / 2);
      ctx.textAlign = 'right';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText(names[i], size / 2 - 10, 5);
      ctx.restore();
    }
    ctx.restore();

    // Pointer at bottom, tip pointing up into wheel
    ctx.beginPath();
    ctx.moveTo(size / 2, size - 20);
    ctx.lineTo(size / 2 - 10, size);
    ctx.lineTo(size / 2 + 10, size);
    ctx.closePath();
    ctx.fillStyle = 'black';
    ctx.fill();
  }, []);

  useEffect(() => {
    drawWheel(rotationRef.current, remaining);
  }, [remaining, drawWheel]);

  const getWinner = (finalRot, names) => {
    const segmentAngle = (2 * Math.PI) / names.length;
    // Pointer sits at π/2 (straight down) in canvas coordinate space
    const pointerAngle = Math.PI / 2;
    const relative = ((pointerAngle - finalRot) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
    return names[Math.floor(relative / segmentAngle) % names.length];
  };

  const spinWheel = () => {
    if (spinning || remaining.length === 0) return;
    setSpinning(true);
    setLastPicked(null);

    const spinTimeTotal = Math.random() * 3000 + 3000;
    const spinAngleStart = Math.random() * 10 + 10;
    const startTime = performance.now();
    // Capture remaining at spin start — stable reference for this spin's closure
    const names = [...remaining];
    let currentRot = rotationRef.current;

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
            // All players picked — reset after a short pause
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

      const spinAngle = spinAngleStart * Math.exp(-spinTime / spinTimeTotal);
      currentRot += spinAngle * (Math.PI / 180);
      rotationRef.current = currentRot;
      drawWheel(currentRot, names);
      requestAnimationFrame(rotate);
    };

    requestAnimationFrame(rotate);
  };

  const allSelected = remaining.length === 0;

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Team Wheel</h2>
      <canvas ref={canvasRef} width={300} height={300} style={{ border: '2px solid black' }} />
      <br />
      <button onClick={spinWheel} disabled={spinning || allSelected}>
        {spinning ? 'Spinning...' : allSelected ? 'Resetting...' : 'Spin'}
      </button>
      {lastPicked && <h3>Selected: {lastPicked}</h3>}
      {selectedOrder.length > 0 && (
        <>
          <h4>Selection Order:</h4>
          <ol>
            {selectedOrder.map((name, idx) => (
              <li key={idx}>{name}</li>
            ))}
          </ol>
        </>
      )}
    </div>
  );
}

export default TeamWheel;











// # TeamWheel Component

// **Created:** 2026-04-05

// ---

// ## What is it?

// TeamWheel is an interactive spinning wheel used to randomly select names from a group, one at a time. Each spin physically lands the pointer on a segment of the wheel, and that person is chosen. Once selected, their name is removed from the wheel so they cannot be picked again — the remaining segments grow to fill the space.

// This continues until every name in the group has been selected once, at which point the wheel automatically resets and the process can begin again. The order of selection is logged below the wheel as you go.

// It is useful for fairly and visibly selecting the order of turns, team assignments, or any situation where you want a transparent random selection from a group.

// ---

// ## Project Stack

// | Package | Version |
// |---|---|
// | React | ^19.1.0 |
// | React DOM | ^19.1.0 |
// | React Router DOM | ^6.30.1 |
// | Vite | ^6.3.5 |
// | @vitejs/plugin-react | ^4.4.1 |

// Node.js is required to run the project. The wheel is rendered using the browser's built-in HTML Canvas API — no charting or animation libraries are needed.

// ---

// ## Getting Started

// **1. Install dependencies**

// ```bash
// npm install
// ```

// **2. Start the development server**

// ```bash
// npm run dev
// ```

// The app will be available at `http://localhost:5173` by default.

// **3. Build for production**

// ```bash
// npm run build
// ```

// **4. Preview the production build locally**

// ```bash
// npm run preview
// ```

// ---

// ## Using the Component

// Import and drop `TeamWheel` into any page:

// ```jsx
// import TeamWheel from './TeamWheel';

// function App() {
//   return <TeamWheel />;
// }
// ```

// To change the names on the wheel, edit the `ALL_PLAYERS` constant at the top of [TeamWheel.jsx](./TeamWheel.jsx):

// ```js
// const ALL_PLAYERS = ['Alice', 'Bob', 'Charlie', 'Diana', 'Ethan', 'Fiona'];
// ```

// ---

// ## How the Selection Works

// The winner is not chosen in advance. The wheel spins with a randomised duration and deceleration. When it stops, the angle of the final resting position is used to calculate which segment sits under the pointer — that is the selected name. This means the result is genuinely determined by where the wheel lands, not by a behind-the-scenes random draw.
