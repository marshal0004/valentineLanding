import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image } from 'lucide-react';
import { getUploadUrl } from '@/utils/api';

// Single file uploader (for background)
export function SinglePhotoUploader({ currentPhoto, onUpload, onRemove, label = 'Upload Photo' }) {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      onUpload(acceptedFiles[0]);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  const photoUrl = getUploadUrl(currentPhoto);

  return (
    <div>
      <label className="block text-sm text-[#c9a0a0] mb-2 font-dancing">{label}</label>
      {photoUrl ? (
        <div className="relative rounded-xl overflow-hidden border border-[rgba(255,45,85,0.2)] group">
          <img src={photoUrl} alt="" className="w-full h-48 object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <div {...getRootProps()} className="cursor-pointer">
              <input {...getInputProps()} />
              <button type="button" className="admin-btn-outline text-sm">Replace</button>
            </div>
            {onRemove && (
              <button type="button" onClick={onRemove} className="p-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/40 transition-all">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
            ${
              isDragActive
                ? 'border-[#ff2d55] bg-[rgba(255,45,85,0.1)]'
                : 'border-[rgba(255,45,85,0.2)] hover:border-[rgba(255,45,85,0.4)] hover:bg-[rgba(255,45,85,0.05)]'
            }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-8 h-8 mx-auto mb-2 text-[#c9a0a0]" />
          <p className="text-sm text-[#c9a0a0]">
            {isDragActive ? 'Drop it here...' : 'Drag & drop or click to browse'}
          </p>
          <p className="text-xs text-[rgba(201,160,160,0.5)] mt-1">JPG, PNG, WebP — max 10MB</p>
        </div>
      )}
    </div>
  );
}

// Multi file uploader (for overlay photos, max 4)
export function MultiPhotoUploader({ photos = [], onUpload, onRemove, maxPhotos = 4 }) {
  const onDrop = useCallback((acceptedFiles) => {
    const remaining = maxPhotos - photos.length;
    const filesToUpload = acceptedFiles.slice(0, remaining);
    if (filesToUpload.length > 0) {
      onUpload(filesToUpload);
    }
  }, [photos.length, maxPhotos, onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: maxPhotos - photos.length,
    maxSize: 10 * 1024 * 1024,
    disabled: photos.length >= maxPhotos,
  });

  return (
    <div>
      <label className="block text-sm text-[#c9a0a0] mb-2 font-dancing">
        Overlay Photos ({photos.length}/{maxPhotos})
      </label>
      <div className="grid grid-cols-2 gap-3">
        {/* Existing photos */}
        {photos.map((photo, index) => (
          <div key={index} className="relative rounded-xl overflow-hidden border border-[rgba(255,45,85,0.2)] group aspect-[4/3]">
            <img src={getUploadUrl(photo)} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/40"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <span className="absolute bottom-2 left-2 text-xs px-2 py-0.5 rounded bg-black/60 text-white/70">
              #{index + 1}
            </span>
          </div>
        ))}

        {/* Upload slots */}
        {photos.length < maxPhotos && (
          <div
            {...getRootProps()}
            className={`aspect-[4/3] border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all
              ${
                isDragActive
                  ? 'border-[#ff2d55] bg-[rgba(255,45,85,0.1)]'
                  : 'border-[rgba(255,45,85,0.2)] hover:border-[rgba(255,45,85,0.4)] hover:bg-[rgba(255,45,85,0.05)]'
              }`}
          >
            <input {...getInputProps()} />
            <Image className="w-6 h-6 text-[#c9a0a0] mb-1" />
            <span className="text-xs text-[#c9a0a0]">Add Photo</span>
          </div>
        )}
      </div>
    </div>
  );
}
