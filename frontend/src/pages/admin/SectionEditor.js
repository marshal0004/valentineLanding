import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SinglePhotoUploader, MultiPhotoUploader } from '@/components/admin/PhotoUploader';
import * as api from '@/utils/api';
import { ANIMATION_STYLES } from '@/utils/constants';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function SectionEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [section, setSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [order, setOrder] = useState(1);
  const [sectionType, setSectionType] = useState('memory');
  const [animationStyle, setAnimationStyle] = useState(ANIMATION_STYLES[0]);

  useEffect(() => {
    loadSection();
  }, [id]);

  const loadSection = async () => {
    try {
      const data = await api.getSection(id);
      setSection(data);
      setTitle(data.title || '');
      setCaption(data.caption || '');
      setOrder(data.order || 1);
      setSectionType(data.section_type || 'memory');
      setAnimationStyle(data.animation_style || ANIMATION_STYLES[0]);
    } catch (err) {
      toast.error('Failed to load section');
      navigate('/admin');
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.updateSection(id, {
        title,
        caption,
        order,
        section_type: sectionType,
        animation_style: animationStyle,
      });
      await loadSection();
      toast.success('Saved!');
    } catch (err) {
      toast.error('Failed to save: ' + err.message);
    }
    setSaving(false);
  };

  const handleBackgroundUpload = async (file) => {
    setUploading(true);
    try {
      await api.uploadBackground(id, file);
      await loadSection();
      toast.success('Background uploaded!');
    } catch (err) {
      toast.error('Upload failed: ' + err.message);
    }
    setUploading(false);
  };

  const handleOverlayUpload = async (files) => {
    setUploading(true);
    try {
      await api.uploadOverlayPhotos(id, files);
      await loadSection();
      toast.success('Photos uploaded!');
    } catch (err) {
      toast.error('Upload failed: ' + err.message);
    }
    setUploading(false);
  };

  const handleOverlayRemove = async (index) => {
    try {
      await api.deleteOverlayPhoto(id, index);
      await loadSection();
      toast.success('Photo deleted!');
    } catch (err) {
      toast.error('Delete failed: ' + err.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this section permanently?')) return;
    try {
      await api.deleteSection(id);
      navigate('/admin');
      toast.success('Section deleted!');
    } catch (err) {
      toast.error('Delete failed: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-[#c9a0a0]">Loading...</div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate('/admin')}
          className="flex items-center gap-2 text-[#c9a0a0] hover:text-[#f4e0e0] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>
        <div className="flex gap-3">
          <button onClick={handleDelete} className="admin-btn-outline flex items-center gap-2 text-red-400 border-red-400/30 hover:bg-red-400/10">
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
          <button onClick={handleSave} className="admin-btn flex items-center gap-2" disabled={saving}>
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <h1 className="font-great-vibes text-3xl text-[#f4e0e0] mb-6">Edit Section</h1>

      <div className="space-y-6">
        {/* Section Type & Order */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-[#c9a0a0] mb-2 font-dancing">Type</label>
            <select
              value={sectionType}
              onChange={e => setSectionType(e.target.value)}
              className="admin-input"
            >
              <option value="intro">Intro</option>
              <option value="memory">Memory</option>
              <option value="final">Final</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-[#c9a0a0] mb-2 font-dancing">Order</label>
            <input
              type="number"
              value={order}
              onChange={e => setOrder(parseInt(e.target.value) || 1)}
              min={0}
              max={20}
              className="admin-input"
            />
          </div>
          <div>
            <label className="block text-sm text-[#c9a0a0] mb-2 font-dancing">Animation</label>
            <select
              value={animationStyle}
              onChange={e => setAnimationStyle(e.target.value)}
              className="admin-input"
            >
              {ANIMATION_STYLES.map(style => (
                <option key={style} value={style}>{style}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm text-[#c9a0a0] mb-2 font-dancing">Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Enter section title..."
            className="admin-input text-xl font-great-vibes"
          />
        </div>

        {/* Caption */}
        <div>
          <label className="block text-sm text-[#c9a0a0] mb-2 font-dancing">Caption</label>
          <textarea
            value={caption}
            onChange={e => setCaption(e.target.value)}
            placeholder="Write a romantic caption..."
            rows={3}
            className="admin-input resize-none"
          />
        </div>

        {/* Background Photo */}
        <SinglePhotoUploader
          currentPhoto={section?.background_photo}
          onUpload={handleBackgroundUpload}
          label="Background Photo"
        />

        {/* Overlay Photos */}
        <MultiPhotoUploader
          photos={section?.overlay_photos || []}
          onUpload={handleOverlayUpload}
          onRemove={handleOverlayRemove}
          maxPhotos={4}
        />

        {uploading && (
          <div className="text-center py-3 text-[#ff2d55] font-dancing animate-pulse">
            Uploading...
          </div>
        )}
      </div>
    </div>
  );
}
