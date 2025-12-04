import React, { useState, useEffect } from 'react';
import ProgressBar from '../components/ProgressBar';
import { Award, CheckCircle, ExternalLink, Dumbbell, Brain, Wind, Shield, Heart, MessageSquare, Plus, Camera, Briefcase, FolderGit2, Trash2, Edit2 } from 'lucide-react';
import AttributeSection from '../components/profile/AttributeSection';
import AddActivityModal from '../components/profile/AddActivityModal';
import EditAvatarModal from '../components/profile/EditAvatarModal';
import AddExperienceModal from '../components/profile/AddExperienceModal';
import AddProjectModal from '../components/profile/AddProjectModal';
import AddAchievementModal from '../components/profile/AddAchievementModal';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Profile = () => {
  const { t } = useLanguage();
  const { id } = useParams();
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal States
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isExpModalOpen, setIsExpModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isAchModalOpen, setIsAchModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const fetchData = async () => {
    try {
      const endpoint = id ? `http://localhost:5001/api/profile/${id}` : 'http://localhost:5001/api/profile';
      const response = await axios.get(endpoint);
      setProfileData(response.data);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleDelete = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await axios.delete(`http://localhost:5001/api/profile/${profileData.id}/item/${itemId}`);
      fetchData();
    } catch (err) {
      console.error("Error deleting item:", err);
      alert("Failed to delete item.");
    }
  };

  const handleEdit = (item, type) => {
    setEditingItem(item);
    if (type === 'experience') setIsExpModalOpen(true);
    else if (type === 'project') setIsProjectModalOpen(true);
    else if (type === 'achievement') setIsAchModalOpen(true);
  };

  const closeModals = () => {
    setIsActivityModalOpen(false);
    setIsAvatarModalOpen(false);
    setIsExpModalOpen(false);
    setIsProjectModalOpen(false);
    setIsAchModalOpen(false);
    setEditingItem(null);
  };

  if (loading) return <div className="min-h-screen bg-black text-neon-blue font-mono flex items-center justify-center">INITIALIZING SYSTEM...</div>;
  if (error) return <div className="min-h-screen bg-black text-red-500 font-mono flex items-center justify-center">SYSTEM ERROR: {error}</div>;
  if (!profileData) return <div className="min-h-screen bg-black text-red-500 font-mono flex items-center justify-center">ACCESS DENIED. AGENT NOT FOUND.</div>;

    const { stats, skills, achievements, age, rank, jobStatus, history, level, current_xp, next_level_xp } = profileData;

  // Map backend stats to UI structure
  const physicalStats = [
    { id: 'str', icon: Dumbbell, color: 'text-neon-red', ...stats.str },
    { id: 'vit', icon: Heart, color: 'text-red-500', ...stats.vit },
    { id: 'agi', icon: Wind, color: 'text-neon-green', ...stats.agi },
  ];

  const psychologicalStats = [
    { id: 'int', icon: Brain, color: 'text-neon-blue', ...stats.int },
    { id: 'chr', icon: MessageSquare, color: 'text-purple-400', ...stats.chr },
    { id: 'sta', icon: Shield, color: 'text-yellow-400', ...stats.sta },
  ];

  // Calculate XP Percentage
  const xpPercentage = Math.min(100, Math.floor((current_xp / next_level_xp) * 100));

  return (
    <div className="min-h-screen bg-black text-gray-300 font-mono selection:bg-neon-blue selection:text-black">
      {/* Modals */}
      <AddActivityModal isOpen={isActivityModalOpen} onClose={closeModals} agentId={profileData.id} onUpdate={fetchData} />
      <EditAvatarModal isOpen={isAvatarModalOpen} onClose={closeModals} agentId={profileData.id} onUpdate={fetchData} />
      <AddExperienceModal isOpen={isExpModalOpen} onClose={closeModals} agentId={profileData.id} onUpdate={fetchData} initialData={editingItem} />
      <AddProjectModal isOpen={isProjectModalOpen} onClose={closeModals} agentId={profileData.id} onUpdate={fetchData} initialData={editingItem} />
      <AddAchievementModal isOpen={isAchModalOpen} onClose={closeModals} agentId={profileData.id} onUpdate={fetchData} initialData={editingItem} />

      <div className="max-w-7xl mx-auto px-4 pt-32 pb-12">
        
        {/* Header / Identity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Identity */}
          <div className="lg:col-span-4 space-y-8">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-dark-900 border border-gray-800 p-6 rounded-lg">
                <div className="aspect-square overflow-hidden rounded-lg mb-6 border-2 border-gray-800 group-hover:border-neon-blue transition-colors relative">
                  <img 
                    src={profileData.avatar || "/Vnonymus.jpg"} 
                    alt="Profile Avatar" 
                    className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                  {user && (
                    <button 
                      onClick={() => setIsAvatarModalOpen(true)}
                      className="absolute bottom-2 right-2 bg-black/80 p-2 rounded-full text-neon-green hover:bg-neon-green hover:text-black transition-all"
                    >
                      <Camera className="w-5 h-5" />
                    </button>
                  )}
                </div>
                
                <h1 className="text-4xl font-bold text-white mb-2 tracking-tighter">{profileData.codename}</h1>
                <div className="flex items-center gap-2 text-neon-blue mb-6">
                  <span className="w-2 h-2 bg-neon-blue rounded-full animate-pulse"></span>
                  <span className="text-sm tracking-widest">{profileData.role}</span>
                </div>

                <div className="space-y-4 text-sm border-t border-gray-800 pt-6">
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t.profile.location_label}</span>
                    <span className={jobStatus === 'open' ? "text-neon-green animate-pulse font-bold" : "text-red-500"}>
                      {t.profile.location_value}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">{t.profile.clearance_label}</span>
                    <div className="flex items-center gap-2">
                       <span className={`font-bold ${rank.color} text-lg`}>{rank.tier}</span>
                       <span className="text-white font-bold">{rank.title}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">{t.profile.level}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-white">{level}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">AGENT POINT (AP)</span>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-neon-blue">{profileData.agent_point?.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  {/* XP Progress Bar */}
                  <div className="mt-2">
                    <ProgressBar 
                      label={`${t.profile.xp || "XP"} (${current_xp} / ${next_level_xp})`} 
                      percentage={xpPercentage} 
                      color="neon-blue" 
                    />
                  </div>
                </div>

                {/* Action Buttons (Only for logged in users) */}
                {user && (
                  <div className="flex flex-col gap-3 mt-6">
                    <button 
                      onClick={() => setIsActivityModalOpen(true)}
                      className="w-full bg-neon-green/10 border border-neon-green text-neon-green py-3 rounded font-bold hover:bg-neon-green hover:text-black transition-all flex items-center justify-center gap-2 tracking-wider"
                    >
                      <Plus className="w-5 h-5" /> {t.profile.actions.add_activity}
                    </button>
                    
                    <button 
                      onClick={() => setIsExpModalOpen(true)}
                      className="w-full bg-neon-green/10 border border-neon-green text-neon-green py-3 rounded font-bold hover:bg-neon-green hover:text-black transition-all flex items-center justify-center gap-2 tracking-wider"
                    >
                      <Plus className="w-5 h-5" /> {t.profile.actions.add_experience}
                    </button>

                    <button 
                      onClick={() => setIsProjectModalOpen(true)}
                      className="w-full bg-neon-green/10 border border-neon-green text-neon-green py-3 rounded font-bold hover:bg-neon-green hover:text-black transition-all flex items-center justify-center gap-2 tracking-wider"
                    >
                      <Plus className="w-5 h-5" /> {t.profile.actions.add_project}
                    </button>

                    <button 
                      onClick={() => setIsAchModalOpen(true)}
                      className="w-full bg-neon-green/10 border border-neon-green text-neon-green py-3 rounded font-bold hover:bg-neon-green hover:text-black transition-all flex items-center justify-center gap-2 tracking-wider"
                    >
                      <Plus className="w-5 h-5" /> {t.profile.actions.add_achievement}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Stats & Data */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Stats Grid */}
            <div className="flex flex-col gap-8">
              <AttributeSection title={t.profile.physical_attributes} stats={physicalStats} />
              <AttributeSection title={t.profile.psychological_attributes} stats={psychologicalStats} />
            </div>

            {/* History & Achievements List */}
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-white border-b border-gray-800 pb-4">{t.profile.achievements_title} / HISTORY</h2>
              
              <div className="space-y-4">
                {/* Render Achievements */}
                {achievements.map((item, index) => (
                  <div key={item.id || index} className="bg-dark-900 border border-gray-800 p-4 rounded-lg flex items-start gap-4 group hover:border-neon-blue transition-colors">
                    <div className="p-3 bg-black rounded border border-gray-800 text-neon-blue">
                      {item.image ? <img src={item.image} alt="Proof" className="w-8 h-8 object-cover rounded" /> : <Award className="w-8 h-8" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-white text-lg">{item.title || item.name}</h3>
                        {user && item.id && (
                             <div className="flex items-center gap-1">
                               <button onClick={() => handleEdit(item, 'achievement')} className="text-gray-600 hover:text-neon-blue p-1"><Edit2 className="w-4 h-4" /></button>
                               <button onClick={() => handleDelete(item.id)} className="text-gray-600 hover:text-red-500 p-1"><Trash2 className="w-4 h-4" /></button>
                             </div>
                        )}
                      </div>
                      
                      {/* Bonuses on new line */}
                      {item.bonuses && item.bonuses.length > 0 && (
                        <div className="flex flex-wrap gap-2 my-2">
                           {item.bonuses.map((b, i) => (
                             <span key={i} className="text-xs font-bold text-neon-green bg-neon-green/10 px-2 py-1 rounded border border-neon-green/20">{b}</span>
                           ))}
                        </div>
                      )}

                      <p className="text-sm text-gray-500">{item.organization || item.date}</p>
                      <p className="text-gray-400 mt-2 text-sm">{item.description}</p>
                    </div>
                  </div>
                ))}

                {/* Render History (Projects, Exp) */}
                {history.filter(h => h.type === 'experience' || h.type === 'project').map((item, index) => (
                  <div key={item.id || index} className="bg-dark-900 border border-gray-800 p-4 rounded-lg flex items-start gap-4 group hover:border-neon-green transition-colors">
                    <div className="p-3 bg-black rounded border border-gray-800 text-neon-green">
                      {item.type === 'experience' ? <Briefcase className="w-8 h-8" /> : <FolderGit2 className="w-8 h-8" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-white text-lg">{item.company || item.name}</h3>
                        {user && item.id && (
                             <div className="flex items-center gap-1">
                               <button onClick={() => handleEdit(item, item.type)} className="text-gray-600 hover:text-neon-green p-1"><Edit2 className="w-4 h-4" /></button>
                               <button onClick={() => handleDelete(item.id)} className="text-gray-600 hover:text-red-500 p-1"><Trash2 className="w-4 h-4" /></button>
                             </div>
                        )}
                      </div>

                      {/* Bonuses on new line */}
                      {item.bonuses && item.bonuses.length > 0 && (
                        <div className="flex flex-wrap gap-2 my-2">
                           {item.bonuses.map((b, i) => (
                             <span key={i} className="text-xs font-bold text-neon-green bg-neon-green/10 px-2 py-1 rounded border border-neon-green/20">{b}</span>
                           ))}
                        </div>
                      )}

                      <p className="text-sm text-gray-500">{item.position || item.role} | {item.startDate || item.date} {item.endDate ? `- ${item.endDate}` : ''}</p>
                      <p className="text-gray-400 mt-2 text-sm">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* GitHub Stats */}
            <section>
              <h2 className="text-xl font-mono font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-neon-blue">{'>'}</span> {t.profile.github_stats}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <img 
                  src={`https://github-profile-summary-cards.vercel.app/api/cards/profile-details?username=${profileData.codename}&theme=algolia&utcOffset=7`} 
                  alt="GitHub Profile Details" 
                  className="w-full rounded-lg border border-gray-800 hover:border-neon-blue transition-colors"
                />
                <img 
                  src={`https://github-profile-summary-cards.vercel.app/api/cards/productive-time?username=${profileData.codename}&theme=algolia&utcOffset=7`} 
                  alt="GitHub Productive Time" 
                  className="w-full rounded-lg border border-gray-800 hover:border-neon-blue transition-colors"
                />
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
