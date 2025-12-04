import React from 'react';

const NeonButton = ({ children, onClick, className = '', variant = 'primary' }) => {
  const baseStyles = "relative px-6 py-3 font-mono font-bold uppercase tracking-wider transition-all duration-300 border-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black group overflow-hidden";
  
  const variants = {
    primary: "border-neon-green text-neon-green hover:bg-neon-green hover:text-black shadow-[0_0_10px_rgba(57,255,20,0.5)] hover:shadow-[0_0_20px_rgba(57,255,20,0.8)]",
    secondary: "border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-black shadow-[0_0_10px_rgba(0,255,255,0.5)] hover:shadow-[0_0_20px_rgba(0,255,255,0.8)]",
    danger: "border-neon-red text-neon-red hover:bg-neon-red hover:text-black shadow-[0_0_10px_rgba(255,7,58,0.5)] hover:shadow-[0_0_20px_rgba(255,7,58,0.8)]",
  };

  return (
    <button 
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 h-full w-full scale-0 rounded-sm transition-all duration-300 group-hover:scale-100 group-hover:bg-current opacity-10"></div>
    </button>
  );
};

export default NeonButton;
