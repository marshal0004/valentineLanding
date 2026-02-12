import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Lock } from 'lucide-react';
import { verifyPassword } from '@/utils/api';
import ParticleSystem from '@/components/3d/ParticleSystem';

export default function PasswordGate() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [shake, setShake] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = sessionStorage.getItem('valentine_auth');
    if (auth === 'true') navigate('/experience');
  }, [navigate]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!password.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await verifyPassword(password);
      if (res.success) {
        setSuccess(true);
        sessionStorage.setItem('valentine_auth', 'true');
        setTimeout(() => navigate('/experience'), 1500);
      } else {
        setShake(true);
        setError("That's not it, try again...");
        setTimeout(() => { setShake(false); setError(''); }, 2500);
      }
    } catch {
      setShake(true);
      setError('Something went wrong...');
      setTimeout(() => { setShake(false); setError(''); }, 2500);
    }
    setLoading(false);
  }, [password, navigate]);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: 'radial-gradient(ellipse at center, #1a0a10 0%, #0a0a0a 70%)' }}>
      <ParticleSystem />
      
      <AnimatePresence>
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: 'radial-gradient(circle, rgba(255,45,85,0.3) 0%, #0a0a0a 70%)' }}
          >
            <motion.div
              animate={{ scale: [1, 1.5, 0], rotate: [0, 0, 180] }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
            >
              <Heart className="w-32 h-32 text-[#ff2d55] fill-[#ff2d55]" />
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="gate"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className={`relative z-10 w-full max-w-md mx-4 ${shake ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}
          >
            <div className="glass-card p-10 text-center" data-testid="password-gate-card">
              {/* Animated Heart */}
              <motion.div
                animate={{ y: [0, -8, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="mb-6 inline-block"
              >
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ background: 'rgba(255, 45, 85, 0.15)', boxShadow: '0 0 30px rgba(255, 45, 85, 0.3)' }}>
                  <Heart className="w-8 h-8 text-[#ff2d55] fill-[#ff2d55]" />
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="font-great-vibes text-4xl md:text-5xl text-[#f4e0e0] mb-3"
              >
                This is for someone special...
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 1 }}
                className="font-dancing text-lg text-[#b0a0a0] mb-8"
              >
                Enter our special code to continue
              </motion.p>

              <form onSubmit={handleSubmit} data-testid="password-form">
                <div className="relative mb-6">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#ff2d55]/50" />
                  <input
                    data-testid="password-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password..."
                    className="glass-input w-full pl-12 text-center text-xl tracking-widest"
                    autoFocus
                  />
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="font-dancing text-[#ff2d55] mb-4"
                      data-testid="password-error"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={loading}
                  className="glow-btn w-full disabled:opacity-50"
                  data-testid="password-submit-btn"
                >
                  {loading ? '...' : 'Open My Heart'}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
}
