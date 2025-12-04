import React from 'react';
import { ExternalLink, CheckCircle, Award } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const CourseraWidget = ({ profileUrl, certificates = [] }) => {
  const { t } = useLanguage();

  if (!certificates.length) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-px bg-[#0056D2] flex-grow opacity-50"></div>
        <span className="text-[#0056D2] font-mono text-sm font-bold">COURSERA CREDENTIALS</span>
        <div className="h-px bg-[#0056D2] flex-grow opacity-50"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {certificates.map((cert, index) => (
          <a 
            key={index}
            href={cert.link || profileUrl}
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative bg-dark-800 border border-[#0056D2]/30 p-3 flex items-start gap-3 hover:border-[#0056D2] hover:bg-[#0056D2]/5 transition-all duration-300 overflow-hidden"
          >
            {/* Corner Accents */}
            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#0056D2] opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#0056D2] opacity-0 group-hover:opacity-100 transition-opacity"></div>

            {/* Certificate Image - Thumbnail Style */}
            {cert.image && (
              <div className="w-24 h-16 flex-shrink-0 overflow-hidden border border-gray-800 group-hover:border-[#0056D2]/50 transition-colors">
                <img 
                  src={cert.image} 
                  alt={cert.name} 
                  className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500"
                />
              </div>
            )}

            <div className="flex-grow min-w-0">
              <h4 className="text-white font-mono font-bold text-sm leading-tight group-hover:text-[#0056D2] transition-colors truncate pr-4">
                {cert.name}
              </h4>
              <div className="flex flex-col gap-1 mt-1 text-xs font-mono text-gray-400">
                <div className="flex items-center gap-2">
                  <span className="text-[#0056D2]">{cert.organization}</span>
                  <span>•</span>
                  <span>{cert.courses_count}</span>
                </div>
                <span>{cert.date}</span>
                
                {/* Description - Visible on Hover or always visible but truncated */}
                {cert.description && (
                  <p className="text-gray-500 line-clamp-2 mt-1 group-hover:text-gray-300 transition-colors">
                    {cert.description}
                  </p>
                )}

                <span className="flex items-center gap-1 text-[#0056D2] opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                  <CheckCircle className="w-3 h-3" /> {t.profile.verified || "VERIFIED"}
                </span>
              </div>
            </div>

            <ExternalLink className="w-3 h-3 text-[#0056D2] opacity-30 group-hover:opacity-100 transition-opacity absolute top-2 right-2" />
          </a>
        ))}
      </div>
    </div>
  );
};

export default CourseraWidget;
