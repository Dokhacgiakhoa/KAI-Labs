import React from 'react';

const ProgressBar = ({ label, percentage, color = 'neon-green' }) => {
  const getColorClass = () => {
    switch(color) {
      case 'neon-blue': return 'bg-neon-blue shadow-[0_0_10px_#00ffff]';
      case 'neon-red': return 'bg-neon-red shadow-[0_0_10px_#ff073a]';
      default: return 'bg-neon-green shadow-[0_0_10px_#39ff14]';
    }
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1 font-mono text-sm">
        <span className="text-white">{label}</span>
        <span className={`text-${color}`}>{percentage}%</span>
      </div>
      <div className="w-full bg-dark-900 h-2 border border-gray-800 relative overflow-hidden">
        <div 
          className={`h-full transition-all duration-1000 ease-out ${getColorClass()}`}
          style={{ width: `${percentage}%` }}
        ></div>
        {/* Grid lines overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNCIgaGVpZ2h0PSI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0xIDF2MmgyVjF6IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuNSIvPjwvc3ZnPg==')] opacity-50"></div>
      </div>
    </div>
  );
};

export default ProgressBar;
