import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Plus, Zap, Award, BookOpen, Dumbbell } from 'lucide-react';

const AddActivityModal = ({ isOpen, onClose, agentId, onUpdate }) => {
  const [rules, setRules] = useState({});
  const [selectedType, setSelectedType] = useState('');
  const [customName, setCustomName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/activity-rules');
        setRules(response.data);
      } catch (error) {
        console.error("Error fetching rules:", error);
      }
    };
    if (isOpen) fetchRules();
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedType) return;

    setLoading(true);
    const rule = rules[selectedType];
    
    const newActivity = {
      id: selectedType,
      name: customName || rule.label,
      type: rule.type,
      date: new Date().toISOString().split('T')[0]
    };

    try {
      await axios.put(`http://localhost:5001/api/profile/${agentId}`, {
        history: newActivity
      });
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error adding activity:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const selectedRule = rules[selectedType];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-dark-900 border border-neon-green/30 rounded-lg w-full max-w-md relative shadow-[0_0_30px_rgba(0,255,0,0.1)]">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">
          <X className="w-6 h-6" />
        </button>

        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Plus className="w-6 h-6 text-neon-green" />
            LOG NEW ACTIVITY
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs text-gray-500 mb-2 tracking-widest">ACTIVITY TYPE</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-black border border-gray-800 rounded py-3 px-4 text-white focus:border-neon-green focus:outline-none"
              >
                <option value="">SELECT TYPE</option>
                {Object.entries(rules).map(([key, rule]) => (
                  <option key={key} value={key}>{rule.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-2 tracking-widest">CUSTOM NAME (OPTIONAL)</label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder={selectedRule?.label || "Project Name / Event Title"}
                className="w-full bg-black border border-gray-800 rounded py-3 px-4 text-white focus:border-neon-green focus:outline-none"
              />
            </div>

            {selectedRule && (
              <div className="bg-dark-800 p-4 rounded border border-gray-800">
                <h4 className="text-xs text-gray-500 mb-3 tracking-widest">ESTIMATED STAT BONUSES</h4>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(selectedRule).map(([key, value]) => {
                    if (['label', 'type'].includes(key)) return null;
                    return (
                      <div key={key} className="flex items-center justify-between text-sm">
                        <span className="text-gray-400 uppercase">{key}</span>
                        <span className="text-neon-green font-bold">+{value}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !selectedType}
              className="w-full bg-neon-green/10 border border-neon-green text-neon-green py-3 rounded font-bold hover:bg-neon-green hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "PROCESSING..." : "CONFIRM UPLOAD"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddActivityModal;
