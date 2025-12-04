import React from 'react';

const GlitchText = ({ text, className = '' }) => {
  return (
    <div className={`relative inline-block ${className}`}>
      <span className="relative z-10">{text}</span>
      <span 
        className="absolute top-0 left-0 -ml-0.5 translate-x-[2px] text-neon-red opacity-70 mix-blend-screen animate-glitch"
        aria-hidden="true"
      >
        {text}
      </span>
      <span 
        className="absolute top-0 left-0 -ml-0.5 -translate-x-[2px] text-neon-blue opacity-70 mix-blend-screen animate-glitch animation-delay-200"
        aria-hidden="true"
      >
        {text}
      </span>
    </div>
  );
};

export default GlitchText;
