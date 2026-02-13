import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import CountdownTimer from './CountdownTimer';
import { Heart } from 'lucide-react';

export default function IntroSection({ settings }) {
  const [showContent, setShowContent] = useState(false);
  const [titleText, setTitleText] = useState('');
  const [subtitleVisible, setSubtitleVisible] = useState(false);
  
  const title = settings?.intro_title || 'Our Love Story';
  const subtitle = settings?.intro_subtitle || 'Every moment with you is magic...';

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!showContent) return;
    let i = 0;
    const typewriter = setInterval(() => {
      if (i < title.length) {
        setTitleText(prev => prev + title[i]);
        i++;
      } else {
        clearInterval(typewriter);
        setTimeout(() => setSubtitleVisible(true), 500);
      }
    }, 80);
    return () => clearInterval(typewriter);
  }, [showContent, title]);

  return (
    <section
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at center, #1a0a10 0%, #0a0a0a 70%)' }}
    >
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              fontSize: `${8 + Math.random() * 14}px`,
              animation: `fall ${10 + Math.random() * 15}s linear infinite`,
              animationDelay: `${Math.random() * 15}s`,
              color: ['#8b0000', '#c41e3a', '#e75480'][Math.floor(Math.random() * 3)],
            }}
          >
            🌹
          </div>
        ))}
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={`sparkle-${i}`}
            className="absolute w-1 h-1 rounded-full bg-white"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `sparkle ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Center content */}
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        {showContent && (
          <>
            {/* Animated Heart */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
              className="mb-8"
            >
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Heart
                  className="w-20 h-20 md:w-28 md:h-28 mx-auto text-[#ff2d55]"
                  fill="#ff2d55"
                  style={{ filter: 'drop-shadow(0 0 30px rgba(255,45,85,0.6))' }}
                />
              </motion.div>
            </motion.div>

            {/* Title */}
            <h1
              className="font-great-vibes text-[#f4e0e0] mb-4"
              style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', minHeight: '1.2em' }}
            >
              {titleText}
              <span className="animate-pulse">|</span>
            </h1>

            {/* Subtitle */}
            {subtitleVisible && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="font-cormorant text-[#c9a0a0] text-lg md:text-2xl mb-12 max-w-2xl mx-auto"
              >
                {subtitle}
              </motion.p>
            )}

            {/* Couple Names */}
            {subtitleVisible && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mb-12"
              >
                <p className="font-great-vibes text-3xl md:text-5xl text-[#ff2d55] mb-8">
                  {settings?.couple_names || 'You & Your Love'}
                </p>
              </motion.div>
            )}

            {/* Countdown */}
            {subtitleVisible && settings?.relationship_start_date && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <p className="font-dancing text-[#c9a0a0] text-sm md:text-lg mb-4">
                  Together for
                </p>
                <CountdownTimer startDate={settings.relationship_start_date} />
                <p className="font-dancing text-[#c9a0a0] text-xs md:text-sm mt-4 italic">
                  And counting every second with you...
                </p>
              </motion.div>
            )}

            {/* Scroll hint */}
            {subtitleVisible && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
              >
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-[#c9a0a0] text-sm font-dancing"
                >
                  Scroll to explore our memories ↓
                </motion.div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
