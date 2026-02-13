import React, { useEffect, useState, useRef } from 'react';
import useStore from '@/stores/useStore';
import * as api from '@/utils/api';
import { getUploadUrl } from '@/utils/api';
import { Save, Upload, Play, Pause } from 'lucide-react';
import { toast } from 'sonner';

export default function Settings() {
  const { settings, fetchSettings } = useStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [musicUploading, setMusicUploading] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const audioRef = useRef(null);

  // Form state
  const [coupleNames, setCoupleNames] = useState('');
  const [startDate, setStartDate] = useState('');
  const [password, setPassword] = useState('');
  const [loveLetter, setLoveLetter] = useState('');
  const [introTitle, setIntroTitle] = useState('');
  const [introSubtitle, setIntroSubtitle] = useState('');
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await api.getSettings();
      setCoupleNames(data.couple_names || '');
      setStartDate(data.relationship_start_date ? data.relationship_start_date.slice(0, 10) : '');
      setPassword(data.password || '');
      setLoveLetter(data.love_letter_text || '');
      setIntroTitle(data.intro_title || '');
      setIntroSubtitle(data.intro_subtitle || '');
      setIsPublished(data.is_published || false);
      await fetchSettings();
    } catch (err) {
      console.error('Failed to load settings', err);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.updateSettings({
        couple_names: coupleNames,
        relationship_start_date: startDate ? new Date(startDate).toISOString() : null,
        password: password,
        love_letter_text: loveLetter,
        intro_title: introTitle,
        intro_subtitle: introSubtitle,
        is_published: isPublished,
      });
      await fetchSettings();
      toast.success('Settings saved!');
    } catch (err) {
      toast.error('Failed to save: ' + err.message);
    }
    setSaving(false);
  };

  const handleMusicUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMusicUploading(true);
    try {
      await api.uploadMusic(file);
      await fetchSettings();
      toast.success('Music uploaded!');
    } catch (err) {
      toast.error('Upload failed: ' + err.message);
    }
    setMusicUploading(false);
  };

  const toggleAudioPreview = () => {
    if (!audioRef.current) return;
    if (audioPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setAudioPlaying(!audioPlaying);
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-[#c9a0a0]">Loading settings...</div>
    );
  }

  const musicUrl = settings?.background_music_file ? getUploadUrl(settings.background_music_file) : null;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-great-vibes text-4xl text-[#f4e0e0]">Settings</h1>
          <p className="text-sm text-[#c9a0a0] mt-1 font-cormorant">Global page configuration</p>
        </div>
        <button onClick={handleSave} className="admin-btn flex items-center gap-2" disabled={saving}>
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      <div className="space-y-6">
        {/* Couple Names */}
        <div>
          <label className="block text-sm text-[#c9a0a0] mb-2 font-dancing">Couple Names</label>
          <input
            type="text"
            value={coupleNames}
            onChange={e => setCoupleNames(e.target.value)}
            placeholder="e.g., Ayush & Priya"
            className="admin-input font-great-vibes text-xl"
          />
        </div>

        {/* Relationship Start Date */}
        <div>
          <label className="block text-sm text-[#c9a0a0] mb-2 font-dancing">Relationship Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="admin-input"
          />
          <p className="text-xs text-[rgba(201,160,160,0.5)] mt-1">Used for countdown timer</p>
        </div>

        {/* Access Password */}
        <div>
          <label className="block text-sm text-[#c9a0a0] mb-2 font-dancing">Access Password</label>
          <input
            type="text"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="e.g., 143 or 14022024"
            className="admin-input"
          />
          <p className="text-xs text-[rgba(201,160,160,0.5)] mt-1">She enters this to view the page</p>
        </div>

        {/* Intro Title & Subtitle */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm text-[#c9a0a0] mb-2 font-dancing">Intro Title</label>
            <input
              type="text"
              value={introTitle}
              onChange={e => setIntroTitle(e.target.value)}
              placeholder="Our Love Story"
              className="admin-input font-great-vibes text-xl"
            />
          </div>
          <div>
            <label className="block text-sm text-[#c9a0a0] mb-2 font-dancing">Intro Subtitle</label>
            <input
              type="text"
              value={introSubtitle}
              onChange={e => setIntroSubtitle(e.target.value)}
              placeholder="Every moment with you is magic..."
              className="admin-input"
            />
          </div>
        </div>

        {/* Background Music */}
        <div className="glass-card p-5">
          <label className="block text-sm text-[#c9a0a0] mb-3 font-dancing">Background Music</label>
          <div className="flex items-center gap-4">
            <label className="admin-btn-outline flex items-center gap-2 cursor-pointer">
              <Upload className="w-4 h-4" />
              {musicUploading ? 'Uploading...' : 'Upload MP3'}
              <input
                type="file"
                accept=".mp3,audio/mpeg"
                onChange={handleMusicUpload}
                className="hidden"
              />
            </label>
            {musicUrl && (
              <>
                <button
                  onClick={toggleAudioPreview}
                  className="p-2 rounded-full bg-[rgba(255,45,85,0.15)] text-[#ff2d55] hover:bg-[rgba(255,45,85,0.25)] transition-all"
                >
                  {audioPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
                <span className="text-xs text-[#c9a0a0]">Music uploaded ✓</span>
                <audio ref={audioRef} src={musicUrl} onEnded={() => setAudioPlaying(false)} />
              </>
            )}
          </div>
        </div>

        {/* Love Letter */}
        <div>
          <label className="block text-sm text-[#c9a0a0] mb-2 font-dancing">Love Letter</label>
          <textarea
            value={loveLetter}
            onChange={e => setLoveLetter(e.target.value)}
            placeholder="Write your love letter here... This appears in the final section inside a hidden envelope."
            rows={8}
            className="admin-input resize-none leading-relaxed"
          />
        </div>

        {/* Published Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPublished(!isPublished)}
            className={`w-12 h-6 rounded-full transition-all relative ${isPublished ? 'bg-[#ff2d55]' : 'bg-[rgba(255,45,85,0.2)]'}`}
          >
            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${isPublished ? 'left-7' : 'left-1'}`} />
          </button>
          <span className="text-sm text-[#c9a0a0]">
            {isPublished ? 'Published (public page accessible)' : 'Unpublished (public page hidden)'}
          </span>
        </div>
      </div>
    </div>
  );
}
