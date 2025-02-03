import React, { useEffect, useRef, useState } from 'react';
import { PatternEngine } from '../core/ascii/engine/PatternEngine';
import { EngineStats } from '../core/ascii/engine/types';

const ASCIIDemo: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<PatternEngine | null>(null);
  const [stats, setStats] = useState<EngineStats>({
    fps: 0,
    activePatterns: 0,
    memoryUsage: 0,
    gpuMemory: 0,
    lastFrameTime: 0
  });

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize the pattern engine
    const engine = new PatternEngine(canvasRef.current, {
      useWebGL2: true,
      debug: true,
      optimizationLevel: 2
    });
    engineRef.current = engine;

    // Generate some example patterns
    try {
      // Background pattern
      const bgPattern = engine.generatePattern(80, 24, 1, 1);
      engine.addPattern(bgPattern, {
        duration: 2000,
        repeat: -1,
        yoyo: true
      });

      // Interactive border pattern
      const borderPattern = engine.generatePattern(80, 3, 3, 4);
      engine.addPattern(borderPattern, {
        duration: 1000,
        repeat: -1
      }, {
        mouseMove: true,
        transform: (position) => ({
          content: borderPattern.frames[0].content.map(line =>
            line.split('').map((char, i) => {
              const distance = Math.abs(i - Math.floor(position.x / 10));
              return distance < 3 ? '█' : char;
            }).join('')
          ),
          duration: 100
        })
      });

      // Start the engine
      engine.start();

      // Update stats periodically
      const statsInterval = setInterval(() => {
        setStats(engine.getStats());
      }, 1000);

      return () => {
        clearInterval(statsInterval);
        engine.cleanup();
      };
    } catch (error) {
      console.error('Failed to initialize ASCII demo:', error);
    }
  }, []);

  return (
    <div className="ascii-demo">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{
          width: '100%',
          height: '100%',
          background: 'transparent'
        }}
      />
      <style jsx>{`
        .ascii-demo {
          position: absolute;
          inset: 0;
          opacity: 0.15;
          pointer-events: none;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default ASCIIDemo; 