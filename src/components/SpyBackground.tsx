import React from 'react';

export const SpyBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-spy-900 via-spy-800 to-[#0d0d1a]" />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-40" />
      
      {/* Radial glow top-left */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-neon-purple/5 rounded-full blur-[120px]" />
      
      {/* Radial glow bottom-right */}
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-neon-blue/5 rounded-full blur-[100px]" />
      
      {/* Floating orbs */}
      <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-neon-purple/30 rounded-full animate-float" />
      <div className="absolute top-3/4 left-1/3 w-1.5 h-1.5 bg-neon-blue/20 rounded-full animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-neon-pink/20 rounded-full animate-float" style={{ animationDelay: '4s' }} />
      
      {/* Scan line */}
      <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-purple/10 to-transparent scanline" />
      
      {/* Corner decorations */}
      <svg className="absolute top-4 left-4 w-16 h-16 text-spy-500/20" viewBox="0 0 64 64" fill="none">
        <path d="M0 16V0h16" stroke="currentColor" strokeWidth="1" />
      </svg>
      <svg className="absolute top-4 right-4 w-16 h-16 text-spy-500/20" viewBox="0 0 64 64" fill="none">
        <path d="M64 16V0H48" stroke="currentColor" strokeWidth="1" />
      </svg>
      <svg className="absolute bottom-4 left-4 w-16 h-16 text-spy-500/20" viewBox="0 0 64 64" fill="none">
        <path d="M0 48v16h16" stroke="currentColor" strokeWidth="1" />
      </svg>
      <svg className="absolute bottom-4 right-4 w-16 h-16 text-spy-500/20" viewBox="0 0 64 64" fill="none">
        <path d="M64 48v16H48" stroke="currentColor" strokeWidth="1" />
      </svg>
    </div>
  );
};
