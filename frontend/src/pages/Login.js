import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User, Terminal } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(username, password);
    if (result.success) {
      navigate('/profile');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono flex items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[length:30px_30px] pointer-events-none"></div>
      
      <div className="w-full max-w-md p-8 bg-dark-900 border border-gray-800 rounded-lg relative z-10 shadow-[0_0_50px_rgba(0,255,0,0.1)]">
        <div className="flex justify-center mb-8">
          <div className="bg-neon-green/10 p-4 rounded-full border border-neon-green/30">
            <Lock className="w-8 h-8 text-neon-green" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center mb-8 tracking-widest text-neon-green">SYSTEM ACCESS</h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs text-gray-500 mb-2 tracking-widest">IDENTITY</label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-gray-600" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black border border-gray-800 rounded py-3 pl-10 pr-4 text-white focus:border-neon-green focus:outline-none transition-colors"
                placeholder="USERNAME"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-2 tracking-widest">PASSPHRASE</label>
            <div className="relative">
              <Terminal className="absolute left-3 top-3 w-5 h-5 text-gray-600" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-gray-800 rounded py-3 pl-10 pr-4 text-white focus:border-neon-green focus:outline-none transition-colors"
                placeholder="PASSWORD"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-neon-green/10 border border-neon-green text-neon-green py-3 rounded font-bold hover:bg-neon-green hover:text-black transition-all duration-300 tracking-widest"
          >
            AUTHENTICATE
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
