import React, { useState } from 'react';
import DataBlock from '../components/DataBlock';
import { Terminal, Database, Shield, Cpu, Code, Server } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Laboratories = () => {
  const [filter, setFilter] = useState('ALL');
  const { t } = useLanguage();

  const tools = {
    frontend: [
      { name: "React", icon: <Code className="w-6 h-6" /> },
      { name: "Tailwind", icon: <Terminal className="w-6 h-6" /> },
      { name: "Figma", icon: <Cpu className="w-6 h-6" /> },
    ],
    backend: [
      { name: "Node.js", icon: <Server className="w-6 h-6" /> },
      { name: "Python", icon: <Terminal className="w-6 h-6" /> },
      { name: "Docker", icon: <Shield className="w-6 h-6" /> },
    ],
    database: [
      { name: "PostgreSQL", icon: <Database className="w-6 h-6" /> },
      { name: "MongoDB", icon: <Database className="w-6 h-6" /> },
      { name: "Redis", icon: <Database className="w-6 h-6" /> },
    ]
  };

  const projects = [
    {
      title: "PROJECT: NEURAL_NET",
      status: t.common.open_project,
      description: "Advanced neural network architecture for autonomous decision making in hostile environments.",
      techStack: ["Python", "TensorFlow", "FastAPI", "Docker", "K8s"],
      category: "AI",
      isPrivate: false,
      image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop"
    },
    {
      title: "PROJECT: CYPHER_VAULT",
      status: t.common.private_project,
      description: "Quantum-resistant encryption protocol for secure data transmission across unsecured networks.",
      techStack: ["Rust", "WebAssembly", "React", "Tokio", "AES-256"],
      category: "SECURITY",
      isPrivate: true,
      image: "https://images.unsplash.com/photo-1558494949-efc0257bb3af?q=80&w=1000&auto=format&fit=crop"
    },
    {
      title: "PROJECT: KHOA_HOC_TAM_LINH",
      status: t.common.deployed,
      description: "Spiritual Science - Exploring the intersection of consciousness and digital reality.",
      techStack: ["Next.js", "Tailwind", "Sanity CMS"],
      category: "WEB",
      isPrivate: false,
      image: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=1000&auto=format&fit=crop"
    },
    {
      title: "PROJECT: TOUR_VIET_UC",
      status: t.common.deployed,
      description: "Vietnam-Australia Business Tour - Premium connection platform for entrepreneurs.",
      techStack: ["React", "Node.js", "MongoDB"],
      category: "WEB",
      isPrivate: false,
      image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=1000&auto=format&fit=crop"
    },
    {
      title: "PROJECT: MOC_VN",
      status: t.common.deployed,
      description: "Moc.vn - Exclusive platform for antique trading and live auctions.",
      techStack: ["Vue.js", "Socket.io", "Firebase"],
      category: "WEB",
      isPrivate: false,
      image: "https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?q=80&w=1000&auto=format&fit=crop"
    },
    {
      title: "PROJECT: SENTINEL",
      status: t.common.private_project,
      description: "Automated intrusion detection system using behavioral analysis algorithms.",
      techStack: ["Python", "Scikit-Learn", "Kafka", "ElasticSearch", "AWS"],
      category: "SECURITY",
      isPrivate: true,
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1000&auto=format&fit=crop"
    }
  ];

  const filteredProjects = filter === 'ALL' ? projects : projects.filter(p => p.category === filter);

  const filterLabels = {
    ALL: t.labs.filters.all,
    WEB: t.labs.filters.web,
    AI: t.labs.filters.ai,
    SECURITY: t.labs.filters.security
  };

  return (
    <div className="container mx-auto px-4 py-24 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: AI Protocol System (Tools) */}
        <div className="lg:col-span-3 space-y-8">
          <h3 className="text-xl font-mono font-bold text-white flex items-center gap-2 mb-6">
            <Cpu className="text-neon-green" /> {t.labs.system_tools}
          </h3>
          
          <div className="space-y-6">
            {/* Front End */}
            <div>
              <h4 className="text-neon-blue font-mono text-sm font-bold mb-3 border-b border-neon-blue/30 pb-1 inline-block">
                {t.labs.frontend}
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {tools.frontend.map((tool, index) => (
                  <div key={index} className="bg-dark-800 border border-gray-800 p-3 flex flex-col items-center justify-center gap-2 hover:border-neon-green transition-colors group cursor-default">
                    <div className="text-gray-400 group-hover:text-neon-green transition-colors">
                      {tool.icon}
                    </div>
                    <span className="text-xs font-mono text-gray-300">{tool.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Back End */}
            <div>
              <h4 className="text-neon-blue font-mono text-sm font-bold mb-3 border-b border-neon-blue/30 pb-1 inline-block">
                {t.labs.backend}
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {tools.backend.map((tool, index) => (
                  <div key={index} className="bg-dark-800 border border-gray-800 p-3 flex flex-col items-center justify-center gap-2 hover:border-neon-green transition-colors group cursor-default">
                    <div className="text-gray-400 group-hover:text-neon-green transition-colors">
                      {tool.icon}
                    </div>
                    <span className="text-xs font-mono text-gray-300">{tool.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Database */}
            <div>
              <h4 className="text-neon-blue font-mono text-sm font-bold mb-3 border-b border-neon-blue/30 pb-1 inline-block">
                {t.labs.database}
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {tools.database.map((tool, index) => (
                  <div key={index} className="bg-dark-800 border border-gray-800 p-3 flex flex-col items-center justify-center gap-2 hover:border-neon-green transition-colors group cursor-default">
                    <div className="text-gray-400 group-hover:text-neon-green transition-colors">
                      {tool.icon}
                    </div>
                    <span className="text-xs font-mono text-gray-300">{tool.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 p-4 border border-neon-blue/30 bg-neon-blue/5">
            <h4 className="text-neon-blue font-mono text-sm font-bold mb-2">{t.labs.system_status}</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono text-gray-400">
                <span>{t.labs.uptime}</span>
                <span className="text-white">99.99%</span>
              </div>
              <div className="flex justify-between text-xs font-mono text-gray-400">
                <span>{t.labs.memory}</span>
                <span className="text-white">64TB / 128TB</span>
              </div>
              <div className="flex justify-between text-xs font-mono text-gray-400">
                <span>{t.labs.threat_level}</span>
                <span className="text-neon-green">{t.labs.threat_low}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Decrypted Case Files (Projects) */}
        <div className="lg:col-span-9">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h2 className="text-3xl font-mono font-bold text-white">
              <span className="text-neon-green">{'>'}</span> {t.labs.title}
            </h2>
            
            {/* Mega Dropdown / Filter */}
            <div className="flex flex-wrap gap-2">
              {['ALL', 'WEB', 'AI', 'SECURITY'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2 font-mono text-sm border transition-all ${
                    filter === cat 
                      ? 'border-neon-green bg-neon-green/10 text-neon-green' 
                      : 'border-gray-800 text-gray-500 hover:border-gray-600'
                  }`}
                >
                  {filterLabels[cat]}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProjects.map((project, index) => (
              <DataBlock key={index} {...project} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Laboratories;
