import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const StatCard = ({ id, icon: Icon, color, value, base, bonus, breakdown }) => {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);

  return (
    <div 
      className="bg-dark-800 border border-gray-800 p-4 relative group/stat hover:border-neon-blue transition-all cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <Icon className={`w-5 h-5 ${color}`} />
          <span className={`font-mono font-bold text-lg ${color}`}>{t.profile.stats[id]}</span>
          <div className="relative group/tooltip ml-1">
            <Info className="w-5 h-5 text-gray-500 hover:text-white font-bold" strokeWidth={3} />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-gray-900 border border-gray-700 p-2 text-xs text-gray-300 rounded shadow-xl opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-10">
              {t.profile.stats[`${id}_desc`]}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col items-end">
        <span className="font-mono text-3xl font-bold text-white">
          {value}{id === 'vit' ? '%' : ''}
        </span>
        <span className="font-mono text-sm text-neon-green">
          {base} <span className="text-gray-500">+</span> {bonus}
        </span>
      </div>

      {/* Dropdown Details */}
      <div className={`mt-4 border-t border-gray-800 pt-2 overflow-hidden transition-all duration-300 ${expanded ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="space-y-1">
          {breakdown.map((item, idx) => {
            // Try to find translation in history or breakdown, fallback to label itself
            console.log("Translating:", item.label, "Found:", t.profile.breakdown?.[item.label]);
            const translatedLabel = t.profile.history[item.label] || t.profile.breakdown?.[item.label] || item.label;
            
            return (
              <div key={idx} className="flex justify-between text-xs font-mono text-gray-400">
                <span>{translatedLabel}</span>
                <span className="text-neon-green">
                  {item.value > 0 ? '+' : ''}{item.value}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
