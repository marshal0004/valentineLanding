import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Mail } from 'lucide-react';
import CountdownTimer from './CountdownTimer';

export default function FinalSection({ settings }) {
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [letterVisible, setLetterVisible] = useState(false);

  const handleEnvelopeClick = () => {
    if (!envelopeOpen) {
      setEnvelopeOpen(true);
      setTimeout(() => setLetterVisible(true), 800);
    }
  };

  return (
    <section
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at center, #1a0a10 0%, #0a0a0a 70%)' }}
    >
      {/* Celebration particles */}
      {envelopeOpen && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-[#ff2d55] opacity-70"
              style={{
                left: '50%',
                top: '50%',
                fontSize: `${8 + Math.random() * 12}px`,
                animation: `explode-${Math.floor(Math.random() * 8)} ${1 + Math.random() * 2}s ease-out forwards`,
                animationDelay: `${Math.random() * 0.5}s`,
              }}
            >
              {['💕', '❤️', '💖', '💗', '🌹', '✨'][Math.floor(Math.random() * 6)]}
            </div>
          ))}
        </div>
      )}

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {!letterVisible ? (
          <>
            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="font-great-vibes text-[#f4e0e0] mb-8"
              style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)' }}
            >
              My Heart Is Yours, Forever 💝
            </motion.h2>

            {/* Envelope */}
            <motion.div
              className="relative w-64 h-64 mx-auto mb-8 cursor-pointer"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              onClick={handleEnvelopeClick}
            >
              <motion.div
                className="absolute inset-0 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,45,85,0.2), rgba(196,30,58,0.2))',
                  border: '2px solid rgba(255,45,85,0.3)',
                  boxShadow: envelopeOpen
                    ? '0 0 40px rgba(255,45,85,0.6), 0 0 80px rgba(255,45,85,0.3)'
                    : '0 0 20px rgba(255,45,85,0.3)',
                }}
                animate={!envelopeOpen ? {
                  scale: [1, 1.05, 1],
                  boxShadow: [
                    '0 0 20px rgba(255,45,85,0.3)',
                    '0 0 30px rgba(255,45,85,0.5)',
                    '0 0 20px rgba(255,45,85,0.3)',
                  ],
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {!envelopeOpen ? (
                  <Mail className="w-24 h-24 text-[#ff2d55]" />
                ) : (
                  <motion.div
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.5, 0] }}
                    transition={{ duration: 0.8 }}
                  >
                    <Heart className="w-24 h-24 text-[#ff2d55]" fill="#ff2d55" />
                  </motion.div>
                )}
              </motion.div>

              {/* Wax seal */}
              {!envelopeOpen && (
                <motion.div
                  className="absolute bottom-8 right-8 w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    background: '#c41e3a',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                >
                  <Heart className="w-6 h-6 text-[#f4e0e0]" fill="#f4e0e0" />
                </motion.div>
              )}
            </motion.div>

            {!envelopeOpen && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="font-dancing text-[#c9a0a0] text-lg mb-8 animate-pulse"
              >
                Click to open my heart...
              </motion.p>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="glass-card p-8 md:p-12 max-w-2xl mx-auto"
          >
            <h3 className="font-great-vibes text-3xl md:text-5xl text-[#ff2d55] mb-6">
              My Dearest Love ❤️
            </h3>
            <div className="font-cormorant text-[#f4e0e0] text-lg md:text-xl leading-relaxed whitespace-pre-wrap text-left mb-8">
              {settings?.love_letter_text ||
                "From the very first moment, you've been my everything. Every second with you is a blessing I treasure forever. I love you more than words could ever express. Forever yours... ❤️"}
            </div>
            
            {settings?.relationship_start_date && (
              <div className="mt-8 pt-8 border-t border-[rgba(255,45,85,0.2)]">
                <p className="font-dancing text-[#c9a0a0] text-sm mb-4">
                  And counting every second with you...
                </p>
                <CountdownTimer startDate={settings.relationship_start_date} />
              </div>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-8"
            >
              <Heart className="w-12 h-12 mx-auto text-[#ff2d55]" fill="#ff2d55" />
            </motion.div>
          </motion.div>
        )}

        {/* Caption */}
        {!letterVisible && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="font-cormorant text-[#c9a0a0] text-lg md:text-xl italic max-w-2xl mx-auto"
          >
            Every love story is beautiful, but ours is my favorite...
          </motion.p>
        )}
      </div>

      <style jsx>{`
        @keyframes explode-0 {
          to {
            transform: translate(-100px, -150px) rotate(45deg);
            opacity: 0;
          }
        }
        @keyframes explode-1 {
          to {
            transform: translate(100px, -150px) rotate(-45deg);
            opacity: 0;
          }
        }
        @keyframes explode-2 {
          to {
            transform: translate(-150px, -50px) rotate(90deg);
            opacity: 0;
          }
        }
        @keyframes explode-3 {
          to {
            transform: translate(150px, -50px) rotate(-90deg);
            opacity: 0;
          }
        }
        @keyframes explode-4 {
          to {
            transform: translate(-120px, 100px) rotate(135deg);
            opacity: 0;
          }
        }
        @keyframes explode-5 {
          to {
            transform: translate(120px, 100px) rotate(-135deg);
            opacity: 0;
          }
        }
        @keyframes explode-6 {
          to {
            transform: translate(0, -180px) rotate(180deg);
            opacity: 0;
          }
        }
        @keyframes explode-7 {
          to {
            transform: translate(0, 120px) rotate(-180deg);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
}
