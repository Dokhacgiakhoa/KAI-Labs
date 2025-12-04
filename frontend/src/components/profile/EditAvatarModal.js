import React, { useState } from 'react';
import axios from 'axios';
import { X, Upload, Camera } from 'lucide-react';

const EditAvatarModal = ({ isOpen, onClose, agentId, onUpdate }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      // 1. Upload Image
      const uploadResponse = await axios.post('http://localhost:5001/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const imageUrl = uploadResponse.data.url;

      // 2. Update Profile
      await axios.put(`http://localhost:5001/api/profile/${agentId}`, {
        avatar: imageUrl
      });

      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error updating avatar:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-dark-900 border border-neon-green/30 rounded-lg w-full max-w-sm relative shadow-[0_0_30px_rgba(0,255,0,0.1)]">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">
          <X className="w-6 h-6" />
        </button>

        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Camera className="w-6 h-6 text-neon-green" />
            UPDATE AVATAR
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-700 rounded-lg p-8 hover:border-neon-green transition-colors cursor-pointer relative">
              <input 
                type="file" 
                onChange={handleFileChange} 
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              {preview ? (
                <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded-full border-2 border-neon-green" />
              ) : (
                <div className="text-center">
                  <Upload className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                  <span className="text-gray-400 text-sm">CLICK TO UPLOAD</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !file}
              className="w-full bg-neon-green/10 border border-neon-green text-neon-green py-3 rounded font-bold hover:bg-neon-green hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "UPLOADING..." : "SAVE NEW AVATAR"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditAvatarModal;
