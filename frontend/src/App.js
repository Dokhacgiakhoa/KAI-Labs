import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Menu, X, Terminal, User, Cpu, Radio, LogOut, LogIn } from 'lucide-react';
import Home from './pages/Home';
import AgentList from './pages/AgentList';
import Profile from './pages/Profile';
import Laboratories from './pages/Laboratories';
import Contact from './pages/Contact';
import Login from './pages/Login';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t.nav.labs, path: '/laboratories', icon: Cpu },
    { name: t.nav.profile, path: '/profile', icon: User },
    { name: t.nav.contact, path: '/contact', icon: Radio },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
      scrolled ? 'bg-black/80 backdrop-blur-md border-neon-green/30 py-2' : 'bg-transparent border-transparent py-6'
    }`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-neon-green/10 p-2 rounded border border-neon-green/30 group-hover:bg-neon-green/20 transition-colors">
            <Terminal className="w-6 h-6 text-neon-green" />
          </div>
          <span className="font-mono font-bold text-xl tracking-tighter text-white group-hover:text-neon-green transition-colors">
            KAI_LABS
          </span>
        </Link>

        <div className="flex items-center gap-8">
          {/* Desktop Menu - Hidden on Home */}
          {location.pathname !== '/' && (
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path || (link.path === '/profile' && location.pathname.startsWith('/profile'));
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`font-mono text-sm tracking-widest transition-all relative group flex items-center gap-2 ${
                      isActive
                        ? 'text-neon-green font-bold' 
                        : 'text-white hover:text-neon-green'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="relative z-10">
                      {isActive && '> '}
                      {link.name}
                    </span>
                    {isActive && (
                      <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-neon-green shadow-[0_0_10px_#39ff14]"></span>
                    )}
                  </Link>
                );
              })}

              {/* Auth Link */}
              {user ? (
                 <button
                    onClick={logout}
                    className="font-mono text-sm tracking-widest transition-all relative group flex items-center gap-2 text-neon-red hover:font-bold"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="relative z-10">{t.nav.logout}</span>
                  </button>
              ) : (
                <Link
                    to="/login"
                    className="font-mono text-sm tracking-widest transition-all relative group flex items-center gap-2 text-white hover:text-neon-green"
                  >
                    <LogIn className="w-4 h-4" />
                    <span className="relative z-10">LOGIN</span>
                  </Link>
              )}
            </div>
          )}
          
          {/* Language Switcher - Always Visible */}
          <button 
            onClick={toggleLanguage}
            className="font-mono text-xs border border-neon-blue text-neon-blue px-2 py-1 hover:bg-neon-blue hover:text-black transition-all"
          >
            [{language.toUpperCase()}]
          </button>

          {/* Mobile Menu Button - Hidden on Home */}
          {location.pathname !== '/' && (
            <button 
              className="md:hidden text-neon-green"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X /> : <Menu />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && location.pathname !== '/' && (
        <div className="md:hidden absolute top-full left-0 w-full bg-black/95 border-b border-neon-green/30 backdrop-blur-xl p-4 flex flex-col gap-4">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path || (link.path === '/profile' && location.pathname.startsWith('/profile'));
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`font-mono text-lg py-2 border-l-2 pl-4 transition-all flex items-center gap-3 ${
                  isActive
                    ? 'border-neon-green text-neon-green bg-neon-green/5 font-bold' 
                    : 'border-transparent text-white hover:text-neon-green'
                }`}
              >
                <Icon className="w-5 h-5" />
                {link.name}
              </Link>
            );
          })}
           {/* Mobile Auth Link */}
           {user ? (
                 <button
                    onClick={() => { logout(); setIsOpen(false); }}
                    className="font-mono text-lg py-2 border-l-2 pl-4 transition-all flex items-center gap-3 border-transparent text-neon-red hover:font-bold"
                  >
                    <LogOut className="w-5 h-5" />
                    {t.nav.logout}
                  </button>
              ) : (
                <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="font-mono text-lg py-2 border-l-2 pl-4 transition-all flex items-center gap-3 border-transparent text-white hover:text-neon-green"
                  >
                    <LogIn className="w-5 h-5" />
                    LOGIN
                  </Link>
              )}
        </div>
      )}
    </nav>
  );
};

function AppContent() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-neon-green selection:text-black overflow-x-hidden">
      {/* Background Grid Effect */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(0,255,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[length:50px_50px] pointer-events-none z-0"></div>
      
      {/* Vignette */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none z-0"></div>

      <Navigation />
      
      <main className="relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={
            <PrivateRoute>
              <AgentList />
            </PrivateRoute>
          } />
          <Route path="/profile/:id" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />
          <Route path="/laboratories" element={<Laboratories />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>

      <footer className="relative z-10 border-t border-gray-900 py-8 mt-20 bg-black">
        <div className="container mx-auto px-4 text-center">
          <p className="font-mono text-xs text-gray-600">
            © 2024 KAI LABS. ALL RIGHTS RESERVED. <br/>
            SYSTEM VERSION 2.0.4 | SECURE CONNECTION
          </p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
