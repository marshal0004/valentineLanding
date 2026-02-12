import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const PETAL_COLORS = ['#8b0000', '#c41e3a', '#e75480', '#ff2d55', '#a0153e'];
const HEART_COLORS = ['#ff2d55', '#c41e3a', '#e75480'];

function Petal({ index, total }) {
  const style = useMemo(() => {
    const left = Math.random() * 100;
    const size = 8 + Math.random() * 14;
    const duration = 8 + Math.random() * 12;
    const delay = Math.random() * duration;
    const color = PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)];
    const drift = -50 + Math.random() * 100;
    return {
      position: 'fixed',
      left: `${left}%`,
      top: '-20px',
      width: `${size}px`,
      height: `${size * 0.7}px`,
      background: color,
      borderRadius: '50% 0 50% 50%',
      opacity: 0.5 + Math.random() * 0.3,
      zIndex: 2,
      pointerEvents: 'none',
      animation: `petalFallCustom${index} ${duration}s linear ${delay}s infinite`,
      filter: `blur(${Math.random() > 0.7 ? 1 : 0}px)`,
      boxShadow: `0 0 ${size / 2}px ${color}40`,
      transform: `rotate(${Math.random() * 360}deg)`,
    };
  }, [index]);

  const keyframes = useMemo(() => {
    const drift = -60 + Math.random() * 120;
    return `
      @keyframes petalFallCustom${index} {
        0% { transform: translateY(-5vh) translateX(0px) rotate(0deg); opacity: 0; }
        5% { opacity: 0.6; }
        50% { translateX: ${drift / 2}px; }
        95% { opacity: 0.5; }
        100% { transform: translateY(105vh) translateX(${drift}px) rotate(${360 + Math.random() * 360}deg); opacity: 0; }
      }
    `;
  }, [index]);

  return (
    <>
      <style>{keyframes}</style>
      <div style={style} />
    </>
  );
}

function FloatingHeart({ index }) {
  const style = useMemo(() => {
    const left = Math.random() * 100;
    const size = 10 + Math.random() * 16;
    const duration = 12 + Math.random() * 10;
    const delay = Math.random() * duration;
    const color = HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)];
    return {
      position: 'fixed',
      left: `${left}%`,
      bottom: '-30px',
      width: `${size}px`,
      height: `${size}px`,
      zIndex: 2,
      pointerEvents: 'none',
      animation: `heartFloatCustom${index} ${duration}s linear ${delay}s infinite`,
      opacity: 0,
    };
  }, [index]);

  const keyframes = useMemo(() => {
    const sway = -30 + Math.random() * 60;
    return `
      @keyframes heartFloatCustom${index} {
        0% { transform: translateY(0) translateX(0px) scale(0.5); opacity: 0; }
        5% { opacity: 0.4; }
        50% { transform: translateY(-50vh) translateX(${sway}px) scale(0.8); }
        95% { opacity: 0.3; }
        100% { transform: translateY(-110vh) translateX(${sway * 1.5}px) scale(1); opacity: 0; }
      }
    `;
  }, [index]);

  const color = HEART_COLORS[index % HEART_COLORS.length];

  return (
    <>
      <style>{keyframes}</style>
      <div style={style}>
        <svg viewBox="0 0 24 24" fill={color} style={{ filter: `drop-shadow(0 0 6px ${color}60)`, width: '100%', height: '100%' }}>
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>
    </>
  );
}

export default function ParticleSystem() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const petalCount = isMobile ? 20 : 45;
  const heartCount = isMobile ? 8 : 15;

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 2 }} data-testid="particle-system">
      {Array.from({ length: petalCount }).map((_, i) => (
        <Petal key={`petal-${i}`} index={i} total={petalCount} />
      ))}
      {Array.from({ length: heartCount }).map((_, i) => (
        <FloatingHeart key={`heart-${i}`} index={i} />
      ))}
    </div>
  );
}
