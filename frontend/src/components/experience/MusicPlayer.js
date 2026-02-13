import React, { useEffect, useRef, useState } from 'react';
import { Howl } from 'howler';
import { Music, Pause, Play, Volume2, VolumeX } from 'lucide-react';

export default function MusicPlayer({ musicUrl }) {
  const soundRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);

  useEffect(() => {
    if (!musicUrl) return;

    soundRef.current = new Howl({
      src: [musicUrl],
      loop: true,
      volume: 0.4,
      html5: true,
    });

    return () => {
      soundRef.current?.unload();
    };
  }, [musicUrl]);

  const togglePlay = () => {
    if (!soundRef.current) return;
    if (playing) {
      soundRef.current.pause();
      setPlaying(false);
    } else {
      soundRef.current.play();
      setPlaying(true);
      setShowPrompt(false);
    }
  };

  const toggleMute = () => {
    if (!soundRef.current) return;
    soundRef.current.mute(!muted);
    setMuted(!muted);
  };

  if (!musicUrl) return null;

  return (
    <>
      {/* Autoplay prompt */}
      {showPrompt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm cursor-pointer"
          onClick={togglePlay}
        >
          <div className="glass-card p-8 text-center animate-pulse">
            <Music className="w-10 h-10 mx-auto mb-3 text-[#ff2d55]" />
            <p className="font-dancing text-lg text-[#f4e0e0]">Tap to feel the music 🎵</p>
          </div>
        </div>
      )}

      {/* Floating control */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
        <button
          onClick={toggleMute}
          className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-[#c9a0a0] hover:text-[#ff2d55] transition-colors"
        >
          {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
        <button
          onClick={togglePlay}
          className="w-12 h-12 rounded-full glass-card glow-red flex items-center justify-center text-[#ff2d55] hover:scale-110 transition-transform"
        >
          {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
        </button>
      </div>
    </>
  );
}
