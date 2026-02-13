import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { getUploadUrl } from '@/utils/api';

export default function MemorySection({ section }) {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true });
  const [photoIndex, setPhotoIndex] = useState(0);
  
  const bgUrl = getUploadUrl(section.background_photo);
  const photos = (section.overlay_photos || []).map(p => getUploadUrl(p)).filter(Boolean);

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  useEffect(() => {
    if (photos.length > 1) {
      const interval = setInterval(() => {
        setPhotoIndex(prev => (prev + 1) % photos.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [photos.length]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <section
      ref={ref}
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background: bgUrl
          ? `linear-gradient(rgba(10, 10, 10, 0.75), rgba(10, 10, 10, 0.75)), url(${bgUrl})`
          : 'radial-gradient(ellipse at center, #1a0a10 0%, #0a0a0a 70%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="absolute opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float-up ${15 + Math.random() * 20}s linear infinite`,
              animationDelay: `${Math.random() * 10}s`,
              fontSize: `${10 + Math.random() * 10}px`,
            }}
          >
            💕
          </div>
        ))}
      </div>

      <motion.div
        className="relative z-10 text-center px-6 max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        {/* Title */}
        <motion.h2
          variants={itemVariants}
          className="font-great-vibes text-[#f4e0e0] mb-6"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
        >
          {section.title}
        </motion.h2>

        {/* Photos Gallery */}
        {photos.length > 0 && (
          <motion.div variants={itemVariants} className="mb-8">
            <div className="relative w-full max-w-4xl mx-auto">
              {/* Photo Display based on animation style */}
              {section.animation_style === 'Floating Polaroids' && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  {photos.map((photo, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 50, rotate: Math.random() * 10 - 5 }}
                      animate={inView ? {
                        opacity: 1,
                        y: 0,
                        rotate: Math.random() * 6 - 3,
                        transition: { delay: idx * 0.2 },
                      } : {}}
                      whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }}
                      className="glass-card p-3 shadow-2xl cursor-pointer"
                      style={{
                        background: 'rgba(244, 224, 224, 0.95)',
                      }}
                    >
                      <img
                        src={photo}
                        alt=""
                        className="w-full aspect-square object-cover mb-2"
                      />
                      <div className="h-6 border-t border-[rgba(196,30,58,0.2)]" />
                    </motion.div>
                  ))}
                </div>
              )}

              {section.animation_style === '3D Carousel' && (
                <div className="relative h-80 md:h-96 flex items-center justify-center">
                  {photos.map((photo, idx) => {
                    const angle = (idx / photos.length) * Math.PI * 2;
                    const radius = 180;
                    const x = Math.cos(angle) * radius;
                    const z = Math.sin(angle) * radius;
                    const rotateY = (angle * 180) / Math.PI;

                    return (
                      <motion.div
                        key={idx}
                        className="absolute w-56 h-72 glass-card p-2 cursor-pointer"
                        style={{
                          transform: `translateX(${x}px) translateZ(${z}px) rotateY(${rotateY}deg)`,
                          transformStyle: 'preserve-3d',
                        }}
                        whileHover={{ scale: 1.1 }}
                      >
                        <img src={photo} alt="" className="w-full h-full object-cover rounded" />
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {(section.animation_style === 'Scattered Desk' ||
                section.animation_style === 'Glowing Film Strip' ||
                section.animation_style === 'Photo Cube' ||
                section.animation_style === 'Floating Bubbles' ||
                section.animation_style === 'Vinyl Records' ||
                section.animation_style === 'Gallery Wall') && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                  {photos.map((photo, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.8, rotate: Math.random() * 20 - 10 }}
                      animate={inView ? {
                        opacity: 1,
                        scale: 1,
                        rotate: Math.random() * 8 - 4,
                        transition: { delay: idx * 0.15 },
                      } : {}}
                      whileHover={{ scale: 1.08, rotate: 0, zIndex: 10 }}
                      className="glass-card p-2 shadow-xl overflow-hidden cursor-pointer"
                    >
                      <img
                        src={photo}
                        alt=""
                        className="w-full aspect-square object-cover rounded"
                        style={{
                          boxShadow: section.animation_style === 'Glowing Film Strip'
                            ? '0 0 20px rgba(255,45,85,0.4)'
                            : undefined,
                        }}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Caption */}
        <motion.p
          variants={itemVariants}
          className="font-cormorant text-[#c9a0a0] text-lg md:text-2xl max-w-3xl mx-auto leading-relaxed italic"
        >
          {section.caption}
        </motion.p>
      </motion.div>
    </section>
  );
}
