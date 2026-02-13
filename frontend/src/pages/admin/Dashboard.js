import React, { useEffect, useState } from 'react';
import SectionCard from '@/components/admin/SectionCard';
import useStore from '@/stores/useStore';
import * as api from '@/utils/api';
import { Plus, RefreshCw } from 'lucide-react';
import { ANIMATION_STYLES } from '@/utils/constants';
import { toast } from 'sonner';

export default function Dashboard() {
  const { sections, fetchSections, sectionsLoading } = useStore();
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  const handleCreate = async () => {
    setCreating(true);
    try {
      const newOrder = sections.length > 0 ? Math.max(...sections.map(s => s.order)) + 1 : 1;
      const animIndex = Math.min(newOrder - 1, ANIMATION_STYLES.length - 1);
      await api.createSection({
        section_type: 'memory',
        order: newOrder,
        title: `New Memory ${newOrder}`,
        caption: 'Write a caption...',
        animation_style: ANIMATION_STYLES[animIndex] || ANIMATION_STYLES[0],
      });
      await fetchSections();
      toast.success('Section created!');
    } catch (err) {
      toast.error('Failed to create section: ' + err.message);
    }
    setCreating(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this section? This cannot be undone.')) return;
    try {
      await api.deleteSection(id);
      await fetchSections();
      toast.success('Section deleted!');
    } catch (err) {
      toast.error('Failed to delete: ' + err.message);
    }
  };

  const handleReorder = async (sectionId, direction) => {
    const sorted = [...sections].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex(s => s.id === sectionId);
    if (idx < 0) return;
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;

    try {
      const orderA = sorted[idx].order;
      const orderB = sorted[swapIdx].order;
      await api.updateSection(sorted[idx].id, { order: orderB });
      await api.updateSection(sorted[swapIdx].id, { order: orderA });
      await fetchSections();
      toast.success('Section reordered!');
    } catch (err) {
      toast.error('Failed to reorder: ' + err.message);
    }
  };

  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-great-vibes text-4xl text-[#f4e0e0]">Sections</h1>
          <p className="text-sm text-[#c9a0a0] mt-1 font-cormorant">
            Manage your love story sections
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => fetchSections()}
            className="admin-btn-outline flex items-center gap-2"
            disabled={sectionsLoading}
          >
            <RefreshCw className={`w-4 h-4 ${sectionsLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={handleCreate}
            className="admin-btn flex items-center gap-2"
            disabled={creating}
          >
            <Plus className="w-4 h-4" />
            Add Section
          </button>
        </div>
      </div>

      {/* Section List */}
      {sectionsLoading && sections.length === 0 ? (
        <div className="text-center py-20 text-[#c9a0a0]">
          <RefreshCw className="w-8 h-8 mx-auto mb-3 animate-spin" />
          Loading sections...
        </div>
      ) : sortedSections.length === 0 ? (
        <div className="text-center py-20 glass-card">
          <p className="text-[#c9a0a0] text-lg mb-4">No sections yet</p>
          <button onClick={handleCreate} className="admin-btn">
            Create Your First Section
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {sortedSections.map((section, idx) => (
            <SectionCard
              key={section.id}
              section={section}
              onDelete={handleDelete}
              onMoveUp={() => handleReorder(section.id, 'up')}
              onMoveDown={() => handleReorder(section.id, 'down')}
              isFirst={idx === 0}
              isLast={idx === sortedSections.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
