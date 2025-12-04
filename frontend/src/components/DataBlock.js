import React from 'react';
import { Shield, Cpu, Globe } from 'lucide-react';

const DataBlock = ({ title, status, description, techStack = [], category = 'WEB', isPrivate = false, image }) => {
  const getIcon = () => {
    switch(category) {
      case 'SECURITY': return <Shield className="w-6 h-6 text-neon-red" />;
      case 'AI': return <Cpu className="w-6 h-6 text-neon-blue" />;
      default: return <Globe className="w-6 h-6 text-neon-green" />;
    }
  };

  return (
    <div className={`group relative bg-dark-800 border border-gray-800 transition-all duration-300 overflow-hidden flex flex-col h-full ${isPrivate ? 'hover:border-neon-red' : 'hover:border-neon-green'}`}>
      {/* Corner Accents */}
      <div className={`absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 ${isPrivate ? 'border-neon-red' : 'border-neon-green'}`}></div>
      <div className={`absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 ${isPrivate ? 'border-neon-red' : 'border-neon-green'}`}></div>
      <div className={`absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 ${isPrivate ? 'border-neon-red' : 'border-neon-green'}`}></div>
      <div className={`absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 ${isPrivate ? 'border-neon-red' : 'border-neon-green'}`}></div>

      {image && (
        <div className="h-48 w-full overflow-hidden relative border-b border-gray-800">
          <div className={`absolute inset-0 bg-neon-green/10 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity z-10 ${isPrivate ? 'bg-neon-red/10' : ''}`}></div>
          <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 filter grayscale group-hover:grayscale-0" />
        </div>
      )}

      <div className="p-6 flex flex-col flex-grow">

      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          {getIcon()}
          <h3 className={`font-mono font-bold text-xl text-white transition-colors ${isPrivate ? 'group-hover:text-neon-red' : 'group-hover:text-neon-green'}`}>{title}</h3>
        </div>
        <span className={`text-xs font-mono px-2 py-1 border ${isPrivate ? 'border-neon-red text-neon-red' : 'border-neon-green text-neon-green'}`}>
          {status}
        </span>
      </div>

      <p className="text-gray-400 font-mono text-sm mb-6 line-clamp-3 group-hover:text-gray-300 transition-colors">
        {description}
      </p>

      <div className="flex flex-wrap gap-2 mt-auto">
        {techStack.map((tech, index) => (
          <span key={index} className="text-xs font-mono text-neon-blue bg-neon-blue/10 px-2 py-1 rounded">
            {tech}
          </span>
        ))}
      </div>
      </div>
      
      {/* Scanline effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-green/5 to-transparent translate-y-[-100%] group-hover:animate-scan pointer-events-none"></div>
    </div>
  );
};

export default DataBlock;
