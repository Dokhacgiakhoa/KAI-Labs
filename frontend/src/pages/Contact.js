import React, { useState } from 'react';
import TerminalInput from '../components/TerminalInput';
import NeonButton from '../components/NeonButton';
import { Github, Linkedin, Mail, Send, Shield } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState('IDLE'); // IDLE, SENDING, SENT
  const { t } = useLanguage();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('SENDING');
    // Simulate API call
    setTimeout(() => {
      setStatus('SENT');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('IDLE'), 3000);
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4 py-24 min-h-screen flex flex-col justify-center">
      <div className="max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Contact Form */}
        <div>
          <h2 className="text-3xl font-mono font-bold text-white mb-2">
            <span className="text-neon-green">{'>'}</span> {t.contact.title}
          </h2>
          <p className="text-gray-400 font-mono mb-8">{t.contact.subtitle}</p>
          
          <form onSubmit={handleSubmit} className="space-y-2">
            <TerminalInput 
              id="name" 
              label={t.contact.name_label} 
              placeholder={t.contact.name_placeholder} 
              value={formData.name}
              onChange={handleChange}
            />
            <TerminalInput 
              id="email" 
              label={t.contact.email_label} 
              type="email" 
              placeholder={t.contact.email_placeholder} 
              value={formData.email}
              onChange={handleChange}
            />
            
            <div className="mb-8 font-mono">
              <label htmlFor="message" className="block text-neon-green mb-2 text-sm">
                {'>'} {t.contact.message_label}
              </label>
              <textarea
                id="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                placeholder={t.contact.message_placeholder}
                className="w-full bg-dark-900 border border-neon-green/30 rounded-none p-4 text-neon-blue placeholder-neon-blue/30 focus:border-neon-green focus:ring-1 focus:ring-neon-green focus:outline-none transition-all shadow-[0_0_5px_rgba(57,255,20,0.1)] focus:shadow-[0_0_15px_rgba(57,255,20,0.3)]"
              ></textarea>
            </div>

            <NeonButton className="w-full flex justify-center items-center gap-2">
              {status === 'SENDING' ? t.contact.submit_sending : status === 'SENT' ? t.contact.submit_sent : (
                <>
                  {t.contact.submit_idle} <Send className="w-4 h-4" />
                </>
              )}
            </NeonButton>
          </form>
        </div>

        {/* Encrypted Access Points */}
        <div className="flex flex-col justify-center space-y-8">
          <div className="bg-dark-800 border border-gray-800 p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Shield className="w-32 h-32 text-neon-green" />
            </div>
            
            <h3 className="text-xl font-mono font-bold text-white mb-6">{t.contact.access_points}</h3>
            
            <div className="space-y-4">
              <a href="/" className="flex items-center gap-4 p-4 border border-gray-700 hover:border-neon-blue hover:bg-neon-blue/5 transition-all group">
                <Github className="w-6 h-6 text-gray-400 group-hover:text-neon-blue" />
                <div>
                  <div className="text-white font-mono font-bold">GITHUB_UPLINK</div>
                  <div className="text-xs text-gray-500 font-mono">Repo Access: GRANTED</div>
                </div>
              </a>
              
              <a href="/" className="flex items-center gap-4 p-4 border border-gray-700 hover:border-neon-blue hover:bg-neon-blue/5 transition-all group">
                <Linkedin className="w-6 h-6 text-gray-400 group-hover:text-neon-blue" />
                <div>
                  <div className="text-white font-mono font-bold">LINKEDIN_SIGNAL</div>
                  <div className="text-xs text-gray-500 font-mono">Professional Network: SECURE</div>
                </div>
              </a>
              
              <a href="/" className="flex items-center gap-4 p-4 border border-gray-700 hover:border-neon-blue hover:bg-neon-blue/5 transition-all group">
                <Mail className="w-6 h-6 text-gray-400 group-hover:text-neon-blue" />
                <div>
                  <div className="text-white font-mono font-bold">DIRECT_FEED</div>
                  <div className="text-xs text-gray-500 font-mono">Latency: 12ms</div>
                </div>
              </a>
            </div>
          </div>
          
          <div className="font-mono text-xs text-gray-600 text-center whitespace-pre-line">
            {t.contact.footer_text}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;
