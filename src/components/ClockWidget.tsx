import React, { useState, useEffect } from 'react';

export const ClockWidget: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12;

  const secondDeg = seconds * 6;
  const minuteDeg = minutes * 6 + seconds * 0.1;
  const hourDeg = hours * 30 + minutes * 0.5;

  return (
    <div className="relative w-28 h-28 mx-auto">
      {/* Clock face */}
      <div className="absolute inset-0 rounded-full border border-spy-500/30 bg-spy-800/30 backdrop-blur-sm">
        {/* Hour markers */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-2 bg-spy-300/40 left-1/2 -translate-x-1/2"
            style={{
              transform: `rotate(${i * 30}deg)`,
              transformOrigin: '50% 56px',
              top: '4px',
            }}
          />
        ))}
        
        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-neon-purple rounded-full -translate-x-1/2 -translate-y-1/2 z-10 shadow-lg shadow-neon-purple/50" />
        
        {/* Hour hand */}
        <div
          className="absolute bottom-1/2 left-1/2 w-0.5 h-6 bg-spy-100 rounded-full origin-bottom -translate-x-1/2"
          style={{ transform: `rotate(${hourDeg}deg)` }}
        />
        
        {/* Minute hand */}
        <div
          className="absolute bottom-1/2 left-1/2 w-[1.5px] h-8 bg-spy-200 rounded-full origin-bottom -translate-x-1/2"
          style={{ transform: `rotate(${minuteDeg}deg)` }}
        />
        
        {/* Second hand */}
        <div
          className="absolute bottom-1/2 left-1/2 w-px h-10 bg-neon-purple rounded-full origin-bottom -translate-x-1/2 transition-transform"
          style={{ transform: `rotate(${secondDeg}deg)` }}
        />
      </div>
      
      {/* Outer glow ring */}
      <div className="absolute -inset-1 rounded-full border border-neon-purple/10 animate-pulse-slow" />
    </div>
  );
};
