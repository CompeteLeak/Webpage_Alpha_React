import React, { useState, useRef } from 'react';

function TeamWheel() {
  const [players] = useState(['Alice', 'Bob', 'Charlie', 'Diana', 'Ethan', 'Fiona']);
  const [order, setOrder] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  const canvasRef = useRef(null);

  const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

  const drawWheel = (rot) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const size = canvas.width;
    const numSegments = players.length;
    const segmentAngle = (2 * Math.PI) / numSegments;

    ctx.clearRect(0, 0, size, size);
    ctx.save();
    ctx.translate(size / 2, size / 2);
    ctx.rotate(rot);

    // Draw wheel segments
    for (let i = 0; i < numSegments; i++) {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.fillStyle = colors[i % colors.length];
      ctx.arc(0, 0, size / 2, i * segmentAngle, (i + 1) * segmentAngle);
      ctx.fill();
      ctx.stroke();

      // Draw text
      ctx.save();
      ctx.fillStyle = 'white';
      ctx.rotate(i * segmentAngle + segmentAngle / 2);
      ctx.textAlign = 'right';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText(players[i], size / 2 - 10, 5);
      ctx.restore();
    }
    ctx.restore();

    // Draw pointer
    ctx.beginPath();
    ctx.moveTo(size / 2, size - 20); // tip toward wheel
    ctx.lineTo(size / 2 - 10, size); // bottom left
    ctx.lineTo(size / 2 + 10, size); // bottom right
    ctx.closePath();
    ctx.fillStyle = 'black';
    ctx.fill();
  };

  const spinWheel = () => {
    if (spinning) return;
    setSpinning(true);

    // Generate random order
    const shuffled = [...players].sort(() => Math.random() - 0.5);
    setOrder(shuffled);

    let spinTime = 0;
    let spinTimeTotal = Math.random() * 3000 + 3000; // 3–6 seconds
    let startRotation = rotation;
    let spinAngleStart = Math.random() * 10 + 10;

    const rotate = () => {
      spinTime += 30;
      if (spinTime >= spinTimeTotal) {
        setSpinning(false);
        return;
      }
      const spinAngle = spinAngleStart * Math.exp(-spinTime / spinTimeTotal);
      startRotation += spinAngle * (Math.PI / 180);
      setRotation(startRotation);
      drawWheel(startRotation);
      requestAnimationFrame(rotate);
    };

    rotate();
  };

  React.useEffect(() => {
    drawWheel(rotation);
  }, [players]);

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Team Wheel</h2>
      <canvas ref={canvasRef} width={300} height={300} style={{ border: '2px solid black' }} />
      <br />
      <button onClick={spinWheel} disabled={spinning}>
        {spinning ? 'Spinning...' : 'Spin'}
      </button>
      <h3>Random Order:</h3>
      <ol>
        {order.map((name, idx) => (
          <li key={idx}>{name}</li>
        ))}
      </ol>
    </div>
  );
}

export default TeamWheel;
