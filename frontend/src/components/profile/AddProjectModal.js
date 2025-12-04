import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, FolderGit2 } from 'lucide-react';

const AddProjectModal = ({ isOpen, onClose, agentId, onUpdate, initialData = null }) => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [role, setRole] = useState('Member');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/projects');
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    if (isOpen) fetchProjects();
  }, [isOpen]);

  useEffect(() => {
    if (initialData) {
      // Try to find project by projectId or name
      const projId = initialData.projectId || (projects.find(p => p.name === initialData.name)?.id) || '';
      setSelectedProject(projId);
      setRole(initialData.role || 'Member');
    } else {
      setSelectedProject('');
      setRole('Member');
    }
  }, [initialData, isOpen, projects]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProject && !initialData) return;

    setLoading(true);
    
    try {
      if (initialData && initialData.id) {
        // Edit Mode
        const updateData = {
           role: role
        };
        const projectData = projects.find(p => p.id === selectedProject);
        if (projectData) {
            updateData.name = projectData.name;
            updateData.projectId = projectData.id;
        }

        await axios.put(`http://localhost:5001/api/profile/${agentId}/item/${initialData.id}`, updateData);
      } else {
        // Add Mode
        const projectData = projects.find(p => p.id === selectedProject);
        const newProject = {
          type: 'project',
          projectId: projectData.id, // Use projectId for reference
          name: projectData.name,
          role: role,
          date: new Date().toISOString().split('T')[0]
        };
        // Do NOT send 'id', let backend generate UUID
        
        await axios.put(`http://localhost:5001/api/profile/${agentId}`, {
          history: newProject
        });
      }
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error saving project:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-dark-900 border border-neon-green/30 rounded-lg w-full max-w-md relative shadow-[0_0_30px_rgba(0,255,0,0.1)]">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">
          <X className="w-6 h-6" />
        </button>

        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <FolderGit2 className="w-6 h-6 text-neon-green" />
            {initialData ? "EDIT PROJECT" : "ADD PROJECT"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs text-gray-500 mb-2 tracking-widest">SELECT PROJECT</label>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="w-full bg-black border border-gray-800 rounded py-3 px-4 text-white focus:border-neon-green focus:outline-none"
              >
                <option value="">SELECT A PROJECT</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} ({p.type})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-2 tracking-widest">YOUR ROLE</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-black border border-gray-800 rounded py-3 px-4 text-white focus:border-neon-green focus:outline-none"
              >
                <option value="Member">Member</option>
                <option value="Developer">Developer</option>
                <option value="Designer">Designer</option>
                <option value="Leader">Leader / Manager</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading || (!selectedProject && !initialData)}
              className="w-full bg-neon-green/10 border border-neon-green text-neon-green py-3 rounded font-bold hover:bg-neon-green hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "PROCESSING..." : (initialData ? "UPDATE PROJECT" : "ADD PROJECT")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProjectModal;
