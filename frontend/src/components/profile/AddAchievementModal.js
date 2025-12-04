import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Award, Upload } from 'lucide-react';

const AddAchievementModal = ({ isOpen, onClose, agentId, onUpdate, initialData = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    description: ''
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        date: initialData.date || '',
        description: initialData.description || ''
      });
      if (initialData.image) {
        setPreview(initialData.image);
      }
    } else {
      setFormData({
        title: '',
        date: '',
        description: ''
      });
      setPreview(null);
      setFile(null);
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let imageUrl = initialData ? initialData.image : '';
    if (file) {
      const uploadData = new FormData();
      uploadData.append('file', file);
      try {
        const uploadResponse = await axios.post('http://localhost:5001/api/upload', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        imageUrl = uploadResponse.data.url;
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }

    try {
      if (initialData && initialData.id) {
        // Edit Mode
        const updateData = {
          ...formData,
          image: imageUrl
        };
        await axios.put(`http://localhost:5001/api/profile/${agentId}/item/${initialData.id}`, updateData);
      } else {
        // Add Mode
        const newAchievement = {
          ...formData,
          image: imageUrl
        };
        await axios.put(`http://localhost:5001/api/profile/${agentId}`, {
          achievements: newAchievement
        });
      }
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error saving achievement:", error);
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
            <Award className="w-6 h-6 text-neon-green" />
            {initialData ? "EDIT ACHIEVEMENT" : "ADD ACHIEVEMENT"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1 tracking-widest">TITLE</label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full bg-black border border-gray-800 rounded py-2 px-3 text-white focus:border-neon-green focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1 tracking-widest">DATE</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full bg-black border border-gray-800 rounded py-2 px-3 text-white focus:border-neon-green focus:outline-none"
              />
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
              <label className="block text-xs text-gray-500 mb-1 tracking-widest">PROOF IMAGE (OPTIONAL)</label>
              <div className="flex items-center gap-4">
                <div className="relative overflow-hidden bg-black border border-gray-800 rounded w-full py-2 px-3 flex items-center justify-center cursor-pointer hover:border-neon-green">
                  <input 
                    type="file" 
                    onChange={handleFileChange} 
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <span className="text-sm text-gray-400 flex items-center gap-2">
                    <Upload className="w-4 h-4" /> {file ? "Change File" : "Upload Image"}
                  </span>
                </div>
                {preview && (
                  <img src={preview} alt="Preview" className="w-12 h-12 object-cover rounded border border-gray-700" />
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-neon-green/10 border border-neon-green text-neon-green py-3 rounded font-bold hover:bg-neon-green hover:text-black transition-all"
            >
              {loading ? "PROCESSING..." : (initialData ? "UPDATE ACHIEVEMENT" : "ADD ACHIEVEMENT")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddAchievementModal;
