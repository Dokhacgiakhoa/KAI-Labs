import React from 'react';
import StatCard from './StatCard';
import { useLanguage } from '../../context/LanguageContext';

const AttributeSection = ({ title, stats }) => {
  const { t } = useLanguage();

  return (
    <section>
      <h2 className="text-xl font-mono font-bold text-white mb-6 flex items-center gap-2">
        <span className="text-neon-blue">{'>'}</span> {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </div>
    </section>
  );
};

export default AttributeSection;
