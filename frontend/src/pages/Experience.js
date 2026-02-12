import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getSections, getSettings, getUploadUrl } from '@/utils/api';
import IntroSection from '@/components/experience/IntroSection';
import MemorySection from '@/components/experience/MemorySection';
import FinalSection from '@/components/experience/FinalSection';
import MusicPlayer from '@/components/experience/MusicPlayer';
import ParticleSystem from '@/components/3d/ParticleSystem';

export default function Experience() {
  const [sections, setSections] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = sessionStorage.getItem('valentine_auth');
    if (auth !== 'true') {
      navigate('/');
      return;
    }
    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      const [sectionsData, settingsData] = await Promise.all([
        getSections(),
        getSettings(),
      ]);
      setSections(sectionsData);
      setSettings(settingsData);
    } catch (err) {
      console.error('Failed to load data:', err);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0a' }}>
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="font-great-vibes text-3xl text-[#ff2d55]"
        >
          Loading our story...
        </motion.div>
      </div>
    );
  }

  const introSection = sections.find(s => s.section_type === 'intro');
  const memorySections = sections.filter(s => s.section_type === 'memory').sort((a, b) => a.order - b.order);
  const finalSection = sections.find(s => s.section_type === 'final');

  return (
    <div className="relative" style={{ background: '#0a0a0a' }} data-testid="experience-page">
      <ParticleSystem />
      
      {/* Music Player */}
      {settings?.background_music_file && (
        <MusicPlayer musicUrl={getUploadUrl(settings.background_music_file)} />
      )}

      {/* Intro Section */}
      {introSection && settings && (
        <IntroSection section={introSection} settings={settings} />
      )}

      {/* Memory Sections */}
      {memorySections.map((section, index) => (
        <MemorySection key={section.id} section={section} index={index} />
      ))}

      {/* Final Section */}
      {finalSection && settings && (
        <FinalSection section={finalSection} settings={settings} />
      )}

      {/* Footer */}
      <div className="py-12 text-center" style={{ background: 'linear-gradient(to top, #0a0a0a, transparent)' }}>
        <p className="font-dancing text-[#b0a0a0] text-lg">
          Made with all my love, for you
        </p>
      </div>
    </div>
  );
}
