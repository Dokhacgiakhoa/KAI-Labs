import React from 'react';
// Re-triggering build
import GlitchText from '../components/GlitchText';
import NeonButton from '../components/NeonButton';
import { useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

const HackingButton = ({ text }) => {
  const [status, setStatus] = useState('idle'); // idle, hacking, access, completed
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleClick = () => {
    if (status !== 'idle') return;
    const clickAudio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'); // Mechanical mouse click
    clickAudio.play().catch(e => console.log("Audio play failed:", e));
    setStatus('hacking');
  };

  useEffect(() => {
    // Processing sound (Mechanical Keyboard for now, acts as data crunching)
    const processingAudio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
    const accessAudio = new Audio('https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3');
    
    if (status === 'hacking') {
      let currentProgress = 0;
      let interval;
      
      // Delay 1 second before starting
      const startHackingTimeout = setTimeout(() => {
        interval = setInterval(() => {
          if (currentProgress < 100) {
            // Random increment for "hacking" feel
            const increment = Math.floor(Math.random() * 5) + 1;
            currentProgress = Math.min(currentProgress + increment, 100);
            setProgress(currentProgress);
            
            // Play sound occasionally or on increment
            if (currentProgress % 5 === 0) {
               const sound = processingAudio.cloneNode(true);
               sound.volume = 0.3;
               sound.play().catch(() => {}); 
            }
          } else {
            clearInterval(interval);
            setStatus('access');
          }
        }, 50);
      }, 1000);
      
      return () => {
        clearTimeout(startHackingTimeout);
        if (interval) clearInterval(interval);
      };
    } else if (status === 'access') {
      accessAudio.play().catch(e => console.log("Audio play failed:", e));
      
      const timeout = setTimeout(() => {
        setStatus('completed');
        navigate('/laboratories');
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [status, navigate]);

  if (status === 'idle') {
    return (
      <NeonButton onClick={handleClick}>
        {text}
      </NeonButton>
    );
  }

  return (
    <div className="font-mono font-bold text-2xl relative w-96">
      {status === 'hacking' && (
        <div className="space-y-3">
          <div className="flex justify-between text-neon-green text-sm">
            <span className="animate-pulse">HACKING SYSTEM...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-4 bg-gray-800 border border-gray-700 relative overflow-hidden">
            <div 
              className="h-full bg-neon-green shadow-[0_0_10px_#39ff14] transition-all duration-75 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
      
      {status === 'access' && (
        <div className="text-neon-green animate-pulse border border-neon-green px-4 py-2 bg-neon-green/10 text-center">
          {t.home.access_complete}
        </div>
      )}

      {status === 'completed' && (
        <div className="text-neon-blue animate-pulse text-center">
          REDIRECTING...
        </div>
      )}
    </div>
  );
};

const Home = () => {
  const { t } = useLanguage();

  return (
    <div className="h-screen overflow-hidden relative">
      {/* Hero Section */}
      <section className="h-full flex flex-col justify-center items-center text-center relative">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
        >
          <source src="/Giao_Diện_Hacking_Điện_Ảnh_Cao_Cấp.mp4" type="video/mp4" />
        </video>
        
        <div className="z-10 space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold font-mono tracking-tighter mb-4">
            <GlitchText text={t.home.hero_title} />
          </h1>
          <p className="text-neon-blue font-mono text-xl tracking-widest animate-pulse">
            {t.home.hero_subtext}
          </p>
          
          <div className="mt-12 h-16 flex justify-center items-center">
            <HackingButton text={t.home.cta} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
