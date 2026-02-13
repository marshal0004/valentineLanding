import React from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, GripVertical, Image } from 'lucide-react';
import { getUploadUrl } from '@/utils/api';

export default function SectionCard({ section, onDelete, onMoveUp, onMoveDown, isFirst, isLast }) {
  const bgUrl = getUploadUrl(section.background_photo);
  const photoCount = section.overlay_photos ? section.overlay_photos.length : 0;

  return (
    <div className="glass-card flex items-stretch overflow-hidden group transition-all hover:border-[rgba(255,45,85,0.4)]">
      {/* Drag Handle */}
      <div className="flex flex-col items-center justify-center px-3 gap-1 border-r border-[rgba(255,45,85,0.1)]">
        <button
          onClick={onMoveUp}
          disabled={isFirst}
          className="text-[#c9a0a0] hover:text-[#ff2d55] disabled:opacity-20 transition-colors p-1"
          title="Move Up"
        >▲</button>
        <GripVertical className="w-4 h-4 text-[rgba(201,160,160,0.3)]" />
        <button
          onClick={onMoveDown}
          disabled={isLast}
          className="text-[#c9a0a0] hover:text-[#ff2d55] disabled:opacity-20 transition-colors p-1"
          title="Move Down"
        >▼</button>
      </div>

      {/* Thumbnail */}
      <div className="w-32 h-28 flex-shrink-0 bg-[rgba(255,45,85,0.05)] flex items-center justify-center overflow-hidden">
        {bgUrl ? (
          <img src={bgUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <Image className="w-8 h-8 text-[rgba(201,160,160,0.3)]" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 p-4 flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs px-2 py-0.5 rounded-full bg-[rgba(255,45,85,0.15)] text-[#ff2d55] font-dancing">
            #{section.order} · {section.section_type}
          </span>
          <span className="text-xs text-[#c9a0a0]">
            {photoCount}/4 photos
          </span>
        </div>
        <h3 className="font-great-vibes text-xl text-[#f4e0e0] mb-1">
          {section.title || 'Untitled Section'}
        </h3>
        <p className="text-sm text-[#c9a0a0] truncate max-w-md">
          {section.caption || 'No caption yet...'}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 px-4">
        <Link
          to={`/admin/section/${section.id}`}
          className="p-2 rounded-lg text-[#c9a0a0] hover:text-[#ff2d55] hover:bg-[rgba(255,45,85,0.1)] transition-all"
          title="Edit"
        >
          <Edit className="w-5 h-5" />
        </Link>
        <button
          onClick={() => onDelete(section.id)}
          className="p-2 rounded-lg text-[#c9a0a0] hover:text-red-500 hover:bg-[rgba(255,0,0,0.1)] transition-all"
          title="Delete"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
