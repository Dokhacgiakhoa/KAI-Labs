import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Briefcase } from 'lucide-react';

const AddExperienceModal = ({ isOpen, onClose, agentId, onUpdate, initialData = null }) => {
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    description: '',
    skills: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        company: initialData.company || '',
        position: initialData.position || '',
        startDate: initialData.startDate || '',
        endDate: initialData.endDate || '',
        description: initialData.description || '',
        skills: initialData.skills || ''
      });
    } else {
      setFormData({
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        description: '',
        skills: ''
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (initialData && initialData.id) {
        // Edit Mode
        await axios.put(`http://localhost:5001/api/profile/${agentId}/item/${initialData.id}`, formData);
      } else {
        // Add Mode
        const newExperience = {
          type: 'experience',
          ...formData
        };
        await axios.put(`http://localhost:5001/api/profile/${agentId}`, {
          history: newExperience
        });
      }
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error saving experience:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-dark-900 border border-neon-green/30 rounded-lg w-full max-w-lg relative shadow-[0_0_30px_rgba(0,255,0,0.1)]">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">
          <X className="w-6 h-6" />
        </button>

        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-neon-green" />
            {initialData ? "EDIT EXPERIENCE" : "ADD EXPERIENCE"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1 tracking-widest">COMPANY</label>
                <input
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                  className="w-full bg-black border border-gray-800 rounded py-2 px-3 text-white focus:border-neon-green focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1 tracking-widest">POSITION</label>
                <input
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  required
                  className="w-full bg-black border border-gray-800 rounded py-2 px-3 text-white focus:border-neon-green focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1 tracking-widest">START DATE</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="w-full bg-black border border-gray-800 rounded py-2 px-3 text-white focus:border-neon-green focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1 tracking-widest">END DATE (LEAVE EMPTY IF CURRENT)</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full bg-black border border-gray-800 rounded py-2 px-3 text-white focus:border-neon-green focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1 tracking-widest">DESCRIPTION</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full bg-black border border-gray-800 rounded py-2 px-3 text-white focus:border-neon-green focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1 tracking-widest">SKILLS USED (COMMA SEPARATED)</label>
              <input
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="React, Python, Leadership..."
                className="w-full bg-black border border-gray-800 rounded py-2 px-3 text-white focus:border-neon-green focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-neon-green/10 border border-neon-green text-neon-green py-3 rounded font-bold hover:bg-neon-green hover:text-black transition-all"
            >
              {loading ? "PROCESSING..." : (initialData ? "UPDATE EXPERIENCE" : "ADD EXPERIENCE")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddExperienceModal;
