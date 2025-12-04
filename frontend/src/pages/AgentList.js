import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Shield, Zap, Terminal } from 'lucide-react';
import axios from 'axios';

const AgentList = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/agents');
        setAgents(response.data);
      } catch (error) {
        console.error("Error fetching agents:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAgents();
  }, []);

  if (loading) return <div className="min-h-screen bg-black text-neon-green flex items-center justify-center font-mono">INITIALIZING UPLINK...</div>;

  return (
    <div className="min-h-screen bg-black text-gray-300 font-mono selection:bg-neon-blue selection:text-black">
      <div className="max-w-7xl mx-auto px-4 pt-32 pb-12">
        
        <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
          <Terminal className="w-8 h-8 text-neon-green" />
          <span className="tracking-widest">ACTIVE AGENTS</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <Link to={`/profile/${agent.id}`} key={agent.id} className="group relative bg-dark-800 border border-gray-800 hover:border-neon-green transition-all duration-300 overflow-hidden rounded-lg">
              {/* Hover Effect Background */}
              <div className="absolute inset-0 bg-neon-green/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="p-6 relative z-10 flex flex-col items-center text-center">
                {/* Avatar */}
                <div className="w-24 h-24 rounded-full border-2 border-neon-blue mb-4 overflow-hidden group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(0,255,255,0.3)]">
                  <img src={agent.avatar} alt={agent.name} className="w-full h-full object-cover" />
                </div>

                {/* Info */}
                <h2 className="text-xl font-bold text-white mb-1 group-hover:text-neon-green transition-colors">{agent.codename}</h2>
                <p className="text-sm text-gray-500 mb-4">{agent.role}</p>

                {/* Rank Badge */}
                <div className="flex items-center gap-2 bg-black/50 px-3 py-1 rounded border border-gray-700">
                  <Shield className="w-4 h-4 text-neon-purple" />
                  <span className="text-xs font-bold text-neon-purple">{agent.rank}</span>
                </div>
              </div>

              {/* Decorative Corner */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-neon-green/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgentList;
