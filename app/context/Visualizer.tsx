import React, { useEffect, useRef } from "react";

const Visualizer = ({ microphone }: { microphone: MediaRecorder }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContext = new ((window as any).AudioContext || (window as any).webkitAudioContext)();
  const analyser = audioContext.createAnalyser();
  const dataArray = new Uint8Array(analyser.frequencyBinCount);

  useEffect(() => {
    const source = audioContext.createMediaStreamSource(microphone.stream);
    source.connect(analyser);

    draw();

  }, []);

  const draw = (): void => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    canvas.style.width = "100%";
    canvas.style.height = "150px";
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const context = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    requestAnimationFrame(draw);

    analyser.getByteFrequencyData(dataArray);

    if (!context) return;

    // Removed the background clearing for transparency

    const barWidth = 2;
    let x = 0;

    for (const value of dataArray) {
      const barHeight = (value / 255) * (height / 2); // Adjust bar height to fit better

      // Simulate bars expanding both upwards and downwards
      const y = (height - barHeight) / 2;

      const barColor = 'black';
      context.fillStyle = barColor;

      // Draw the bars symmetrically from the center up and down
      context.fillRect(x, y, barWidth, barHeight);
      x += barWidth + 2;
    }
  };

  return <canvas ref={canvasRef} width={window.innerWidth} style={{ background: 'transparent' }}></canvas>;
};

export default Visualizer;
