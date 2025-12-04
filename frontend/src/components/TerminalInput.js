import React from 'react';

const TerminalInput = ({ label, type = 'text', value, onChange, placeholder, id }) => {
  return (
    <div className="mb-6 font-mono">
      <label htmlFor={id} className="block text-neon-green mb-2 text-sm">
        {'>'} {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neon-green opacity-50">$</span>
        <input
          type={type}
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-dark-900 border border-neon-green/30 rounded-none py-3 pl-8 pr-4 text-neon-blue placeholder-neon-blue/30 focus:border-neon-green focus:ring-1 focus:ring-neon-green focus:outline-none transition-all shadow-[0_0_5px_rgba(57,255,20,0.1)] focus:shadow-[0_0_15px_rgba(57,255,20,0.3)]"
        />
      </div>
    </div>
  );
};

export default TerminalInput;
