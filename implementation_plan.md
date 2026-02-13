# NEXT_IMPLEMENTATION_PLAN.md
# ValentineMemories3D — Complete Frontend Implementation Plan
# =============================================================
# TARGET AGENT: Claude Sonnet (or any LLM coding agent)
# CONTEXT: Phase 1 (Backend) is COMPLETE and running on http://localhost:8000
# GOAL: Implement Phase 2, 3, 4 sequentially. Generate every file listed below.
# =============================================================

## CURRENT STATE
- Backend: FastAPI running on port 8000 with MongoDB
- API endpoints all functional: /api/sections, /api/settings, /api/auth/verify, /api/uploads/
- Database seeded with sample data (8 sections + settings)
- Uploads directory exists at backend/uploads/
- Frontend: NOT YET CREATED

## BACKEND API REFERENCE (Already Running)
GET /api/sections → [{_id, section_type, order, title, caption, background_photo, overlay_photos, animation_style, ...}]
GET /api/sections/{id} → {section object}
POST /api/sections → body: {section_type, order, title, caption, animation_style}
PUT /api/sections/{id} → body: {title?, caption?, order?, animation_style?}
DELETE /api/sections/{id}
POST /api/sections/{id}/background → multipart form: file
POST /api/sections/{id}/photos → multipart form: files (up to 4)
DELETE /api/sections/{id}/photos/{photo_index}

GET /api/settings → {couple_names, relationship_start_date, password, background_music_file, love_letter_text, intro_title, intro_subtitle, is_published}
PUT /api/settings → body: {any settings fields}
POST /api/settings/music → multipart form: file

POST /api/auth/verify → body: {password: string} → {success: bool}

Static files served at: /api/uploads/{filename}

text


---

# ████████████████████████████████████████████████████████████
# PHASE 2: FRONTEND SCAFFOLDING + ADMIN PANEL
# ████████████████████████████████████████████████████████████

## STEP 2.0: Create Vite Project & Install Dependencies

```bash
cd valentine-memories
npm create vite@latest frontend -- --template react
cd frontend
npm install

# Core dependencies
npm install react-router-dom axios zustand react-dropzone qrcode.react howler framer-motion gsap react-intersection-observer lucide-react

# Tailwind CSS
npm install -D tailwindcss @tailwindcss/vite

# Three.js (for Phase 4, install now)
npm install three @react-three/fiber @react-three/drei @react-three/postprocessing

# Optional utilities
npm install html-to-image
STEP 2.1: vite.config.js
FILE: frontend/vite.config.js

JavaScript

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  }
})
STEP 2.2: index.html
FILE: frontend/index.html

HTML

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/heart.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#1a0a10" />
    <title>Our Love Story ❤️</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&family=Dancing+Script:wght@400;500;600;700&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
STEP 2.3: Global CSS
FILE: frontend/src/index.css

CSS

@import "tailwindcss";

@theme {
  --color-bg-primary: #0a0a0a;
  --color-bg-secondary: #1a0a10;
  --color-text-primary: #f4e0e0;
  --color-text-secondary: #c9a0a0;
  --color-accent: #ff2d55;
  --color-accent-dark: #c41e3a;
  --color-accent-deeper: #8b0000;
  --color-gold: #d4a574;
  --color-glass-bg: rgba(255, 45, 85, 0.08);
  --color-glass-border: rgba(255, 45, 85, 0.2);

  --font-heading: 'Great Vibes', cursive;
  --font-body: 'Cormorant Garamond', serif;
  --font-accent: 'Dancing Script', cursive;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-body);
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: var(--color-bg-primary);
}
::-webkit-scrollbar-thumb {
  background: var(--color-accent-dark);
  border-radius: 3px;
}

/* Selection color */
::selection {
  background: rgba(255, 45, 85, 0.3);
  color: var(--color-text-primary);
}

/* Glass card utility */
.glass-card {
  background: var(--color-glass-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--color-glass-border);
  border-radius: 16px;
}

/* Glow effect utility */
.glow-red {
  box-shadow: 0 0 20px rgba(255, 45, 85, 0.3), 0 0 40px rgba(255, 45, 85, 0.1);
}

/* Heading font utility */
.font-heading {
  font-family: var(--font-heading);
}
.font-body {
  font-family: var(--font-body);
}
.font-accent {
  font-family: var(--font-accent);
}

/* Admin panel specific */
.admin-input {
  width: 100%;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 45, 85, 0.2);
  border-radius: 8px;
  color: #f4e0e0;
  font-family: var(--font-body);
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s;
}
.admin-input:focus {
  border-color: #ff2d55;
}
.admin-input::placeholder {
  color: rgba(201, 160, 160, 0.5);
}

.admin-btn {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #ff2d55, #c41e3a);
  color: white;
  border: none;
  border-radius: 8px;
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}
.admin-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(255, 45, 85, 0.4);
}
.admin-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.admin-btn-outline {
  padding: 0.75rem 1.5rem;
  background: transparent;
  color: #ff2d55;
  border: 1px solid rgba(255, 45, 85, 0.4);
  border-radius: 8px;
  font-family: var(--font-body);
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
}
.admin-btn-outline:hover {
  background: rgba(255, 45, 85, 0.1);
  border-color: #ff2d55;
}

/* Rose petal keyframes (used in Phase 4) */
@keyframes fall {
  0% { transform: translateY(-10vh) rotate(0deg) translateX(0); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(110vh) rotate(720deg) translateX(100px); opacity: 0; }
}

@keyframes float-up {
  0% { transform: translateY(100vh) scale(0.5); opacity: 0; }
  10% { opacity: 0.6; }
  90% { opacity: 0.6; }
  100% { transform: translateY(-10vh) scale(1); opacity: 0; }
}

@keyframes pulse-glow {
  0%, 100% { filter: drop-shadow(0 0 8px rgba(255, 45, 85, 0.4)); }
  50% { filter: drop-shadow(0 0 20px rgba(255, 45, 85, 0.8)); }
}

@keyframes typewriter-cursor {
  0%, 100% { border-color: #ff2d55; }
  50% { border-color: transparent; }
}

@keyframes sparkle {
  0%, 100% { opacity: 0; transform: scale(0); }
  50% { opacity: 1; transform: scale(1); }
}

@keyframes gentle-bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
STEP 2.4: Constants
FILE: frontend/src/utils/constants.js

JavaScript

export const API_BASE_URL = '/api';

export const ANIMATION_STYLES = [
  'Floating Polaroids',
  '3D Carousel',
  'Scattered Desk',
  'Glowing Film Strip',
  'Photo Cube',
  'Floating Bubbles',
  'Vinyl Records',
  'Gallery Wall',
];

export const SECTION_TYPES = {
  INTRO: 'intro',
  MEMORY: 'memory',
  FINAL: 'final',
};

export const COLORS = {
  bgPrimary: '#0a0a0a',
  bgSecondary: '#1a0a10',
  textPrimary: '#f4e0e0',
  textSecondary: '#c9a0a0',
  accent: '#ff2d55',
  accentDark: '#c41e3a',
  accentDeeper: '#8b0000',
  gold: '#d4a574',
};
STEP 2.5: API Utility
FILE: frontend/src/utils/api.js

JavaScript

import axios from 'axios';
import { API_BASE_URL } from './constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// =================== SECTIONS ===================
export const getSections = () => api.get('/sections').then(r => r.data);
export const getSection = (id) => api.get(`/sections/${id}`).then(r => r.data);
export const createSection = (data) => api.post('/sections', data).then(r => r.data);
export const updateSection = (id, data) => api.put(`/sections/${id}`, data).then(r => r.data);
export const deleteSection = (id) => api.delete(`/sections/${id}`).then(r => r.data);

export const uploadBackground = (id, file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post(`/sections/${id}/background`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(r => r.data);
};

export const uploadPhotos = (id, files) => {
  const formData = new FormData();
  files.forEach(file => formData.append('files', file));
  return api.post(`/sections/${id}/photos`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(r => r.data);
};

export const deletePhoto = (sectionId, photoIndex) =>
  api.delete(`/sections/${sectionId}/photos/${photoIndex}`).then(r => r.data);

// =================== SETTINGS ===================
export const getSettings = () => api.get('/settings').then(r => r.data);
export const updateSettings = (data) => api.put('/settings', data).then(r => r.data);

export const uploadMusic = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/settings/music', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(r => r.data);
};

// =================== AUTH ===================
export const verifyPassword = (password) =>
  api.post('/auth/verify', { password }).then(r => r.data);

// =================== HELPERS ===================
export const getUploadUrl = (filename) => {
  if (!filename) return null;
  if (filename.startsWith('http')) return filename;
  return `${API_BASE_URL}/uploads/${filename}`;
};

export default api;
STEP 2.6: Zustand Store
FILE: frontend/src/stores/useStore.js

JavaScript

import { create } from 'zustand';
import * as api from '../utils/api';

const useStore = create((set, get) => ({
  // =================== SECTIONS STATE ===================
  sections: [],
  sectionsLoading: false,
  sectionsError: null,

  fetchSections: async () => {
    set({ sectionsLoading: true, sectionsError: null });
    try {
      const data = await api.getSections();
      set({ sections: data, sectionsLoading: false });
    } catch (err) {
      set({ sectionsError: err.message, sectionsLoading: false });
    }
  },

  // =================== SETTINGS STATE ===================
  settings: null,
  settingsLoading: false,

  fetchSettings: async () => {
    set({ settingsLoading: true });
    try {
      const data = await api.getSettings();
      set({ settings: data, settingsLoading: false });
    } catch (err) {
      set({ settingsLoading: false });
    }
  },

  // =================== AUTH STATE ===================
  isAuthenticated: sessionStorage.getItem('valentine_auth') === 'true',

  setAuthenticated: (value) => {
    if (value) {
      sessionStorage.setItem('valentine_auth', 'true');
    } else {
      sessionStorage.removeItem('valentine_auth');
    }
    set({ isAuthenticated: value });
  },

  // =================== MUSIC STATE ===================
  musicPlaying: false,
  setMusicPlaying: (value) => set({ musicPlaying: value }),
}));

export default useStore;
STEP 2.7: Main Entry
FILE: frontend/src/main.jsx

React

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
STEP 2.8: App Router
FILE: frontend/src/App.jsx

React

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PasswordGate from './pages/PasswordGate';
import Experience from './pages/Experience';
import Dashboard from './pages/admin/Dashboard';
import SectionEditor from './pages/admin/SectionEditor';
import Settings from './pages/admin/Settings';
import QRCodePage from './pages/admin/QRCodePage';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PasswordGate />} />
      <Route path="/experience" element={<Experience />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<Dashboard />} />
      <Route path="/admin/section/:id" element={<SectionEditor />} />
      <Route path="/admin/settings" element={<Settings />} />
      <Route path="/admin/qr" element={<QRCodePage />} />
    </Routes>
  );
}

export default App;
STEP 2.9: Admin Layout
FILE: frontend/src/components/admin/AdminLayout.jsx

React

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Settings, QrCode, Eye, Heart } from 'lucide-react';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
  { path: '/admin/qr', label: 'QR Code', icon: QrCode },
];

export default function AdminLayout({ children }) {
  const location = useLocation();

  return (
    <div className="min-h-screen flex" style={{ background: '#0a0a0a' }}>
      {/* Sidebar */}
      <aside className="w-64 min-h-screen p-6 flex flex-col gap-2 border-r"
        style={{ borderColor: 'rgba(255,45,85,0.15)', background: '#0d0508' }}>
        
        <div className="flex items-center gap-2 mb-8 px-2">
          <Heart className="w-6 h-6 text-[#ff2d55]" fill="#ff2d55" />
          <h1 className="font-heading text-2xl text-[#f4e0e0]">Admin</h1>
        </div>

        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-body
                ${isActive
                  ? 'bg-[rgba(255,45,85,0.15)] text-[#ff2d55] border border-[rgba(255,45,85,0.3)]'
                  : 'text-[#c9a0a0] hover:bg-[rgba(255,45,85,0.08)] hover:text-[#f4e0e0]'
                }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}

        <div className="mt-auto">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-body text-[#c9a0a0] hover:bg-[rgba(255,45,85,0.08)] hover:text-[#f4e0e0] transition-all"
          >
            <Eye className="w-5 h-5" />
            Preview Public Page
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
STEP 2.10: Section Card (Admin)
FILE: frontend/src/components/admin/SectionCard.jsx

React

import React from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, GripVertical, Image } from 'lucide-react';
import { getUploadUrl } from '../../utils/api';

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
          <span className="text-xs px-2 py-0.5 rounded-full bg-[rgba(255,45,85,0.15)] text-[#ff2d55] font-accent">
            #{section.order} · {section.section_type}
          </span>
          <span className="text-xs text-[#c9a0a0]">
            {photoCount}/4 photos
          </span>
        </div>
        <h3 className="font-heading text-xl text-[#f4e0e0] mb-1">
          {section.title || 'Untitled Section'}
        </h3>
        <p className="text-sm text-[#c9a0a0] truncate max-w-md">
          {section.caption || 'No caption yet...'}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 px-4">
        <Link
          to={`/admin/section/${section._id}`}
          className="p-2 rounded-lg text-[#c9a0a0] hover:text-[#ff2d55] hover:bg-[rgba(255,45,85,0.1)] transition-all"
          title="Edit"
        >
          <Edit className="w-5 h-5" />
        </Link>
        <button
          onClick={() => onDelete(section._id)}
          className="p-2 rounded-lg text-[#c9a0a0] hover:text-red-500 hover:bg-[rgba(255,0,0,0.1)] transition-all"
          title="Delete"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
STEP 2.11: Photo Uploader
FILE: frontend/src/components/admin/PhotoUploader.jsx

React

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image } from 'lucide-react';
import { getUploadUrl } from '../../utils/api';

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
      <label className="block text-sm text-[#c9a0a0] mb-2 font-accent">{label}</label>
      {photoUrl ? (
        <div className="relative rounded-xl overflow-hidden border border-[rgba(255,45,85,0.2)] group">
          <img src={photoUrl} alt="" className="w-full h-48 object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <div {...getRootProps()} className="cursor-pointer">
              <input {...getInputProps()} />
              <button className="admin-btn-outline text-sm">Replace</button>
            </div>
            {onRemove && (
              <button onClick={onRemove} className="p-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/40 transition-all">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
            ${isDragActive
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
      <label className="block text-sm text-[#c9a0a0] mb-2 font-accent">
        Overlay Photos ({photos.length}/{maxPhotos})
      </label>
      <div className="grid grid-cols-2 gap-3">
        {/* Existing photos */}
        {photos.map((photo, index) => (
          <div key={index} className="relative rounded-xl overflow-hidden border border-[rgba(255,45,85,0.2)] group aspect-[4/3]">
            <img src={getUploadUrl(photo)} alt="" className="w-full h-full object-cover" />
            <button
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
              ${isDragActive
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
STEP 2.12: Admin Dashboard
FILE: frontend/src/pages/admin/Dashboard.jsx

React

import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import SectionCard from '../../components/admin/SectionCard';
import useStore from '../../stores/useStore';
import * as api from '../../utils/api';
import { Plus, RefreshCw } from 'lucide-react';
import { ANIMATION_STYLES } from '../../utils/constants';

export default function Dashboard() {
  const { sections, fetchSections, sectionsLoading } = useStore();
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchSections();
  }, []);

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
    } catch (err) {
      alert('Failed to create section: ' + err.message);
    }
    setCreating(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this section? This cannot be undone.')) return;
    try {
      await api.deleteSection(id);
      await fetchSections();
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    }
  };

  const handleReorder = async (sectionId, direction) => {
    const sorted = [...sections].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex(s => s._id === sectionId);
    if (idx < 0) return;
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;

    try {
      const orderA = sorted[idx].order;
      const orderB = sorted[swapIdx].order;
      await api.updateSection(sorted[idx]._id, { order: orderB });
      await api.updateSection(sorted[swapIdx]._id, { order: orderA });
      await fetchSections();
    } catch (err) {
      alert('Failed to reorder: ' + err.message);
    }
  };

  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-4xl text-[#f4e0e0]">Sections</h1>
            <p className="text-sm text-[#c9a0a0] mt-1 font-body">
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
                key={section._id}
                section={section}
                onDelete={handleDelete}
                onMoveUp={() => handleReorder(section._id, 'up')}
                onMoveDown={() => handleReorder(section._id, 'down')}
                isFirst={idx === 0}
                isLast={idx === sortedSections.length - 1}
              />
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
STEP 2.13: Section Editor
FILE: frontend/src/pages/admin/SectionEditor.jsx

React

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { SinglePhotoUploader, MultiPhotoUploader } from '../../components/admin/PhotoUploader';
import * as api from '../../utils/api';
import { ANIMATION_STYLES } from '../../utils/constants';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';

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
      alert('Failed to load section');
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
      alert('Saved!');
    } catch (err) {
      alert('Failed to save: ' + err.message);
    }
    setSaving(false);
  };

  const handleBackgroundUpload = async (file) => {
    setUploading(true);
    try {
      await api.uploadBackground(id, file);
      await loadSection();
    } catch (err) {
      alert('Upload failed: ' + err.message);
    }
    setUploading(false);
  };

  const handleOverlayUpload = async (files) => {
    setUploading(true);
    try {
      await api.uploadPhotos(id, files);
      await loadSection();
    } catch (err) {
      alert('Upload failed: ' + err.message);
    }
    setUploading(false);
  };

  const handleOverlayRemove = async (index) => {
    try {
      await api.deletePhoto(id, index);
      await loadSection();
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this section permanently?')) return;
    try {
      await api.deleteSection(id);
      navigate('/admin');
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-20 text-[#c9a0a0]">Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
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

        <h1 className="font-heading text-3xl text-[#f4e0e0] mb-6">Edit Section</h1>

        <div className="space-y-6">
          {/* Section Type & Order */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-[#c9a0a0] mb-2 font-accent">Type</label>
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
              <label className="block text-sm text-[#c9a0a0] mb-2 font-accent">Order</label>
              <input
                type="number"
                value={order}
                onChange={e => setOrder(parseInt(e.target.value) || 1)}
                min={1}
                max={20}
                className="admin-input"
              />
            </div>
            <div>
              <label className="block text-sm text-[#c9a0a0] mb-2 font-accent">Animation</label>
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
            <label className="block text-sm text-[#c9a0a0] mb-2 font-accent">Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Enter section title..."
              className="admin-input text-xl font-heading"
            />
          </div>

          {/* Caption */}
          <div>
            <label className="block text-sm text-[#c9a0a0] mb-2 font-accent">Caption</label>
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
            <div className="text-center py-3 text-[#ff2d55] font-accent animate-pulse">
              Uploading...
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
STEP 2.14: Global Settings Page
FILE: frontend/src/pages/admin/Settings.jsx

React

import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import useStore from '../../stores/useStore';
import * as api from '../../utils/api';
import { getUploadUrl } from '../../utils/api';
import { Save, Upload, Play, Pause } from 'lucide-react';

export default function Settings() {
  const { settings, fetchSettings } = useStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [musicUploading, setMusicUploading] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const audioRef = React.useRef(null);

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
      alert('Settings saved!');
    } catch (err) {
      alert('Failed to save: ' + err.message);
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
      alert('Music uploaded!');
    } catch (err) {
      alert('Upload failed: ' + err.message);
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
      <AdminLayout>
        <div className="text-center py-20 text-[#c9a0a0]">Loading settings...</div>
      </AdminLayout>
    );
  }

  const musicUrl = settings?.background_music_file ? getUploadUrl(settings.background_music_file) : null;

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-4xl text-[#f4e0e0]">Settings</h1>
            <p className="text-sm text-[#c9a0a0] mt-1 font-body">Global page configuration</p>
          </div>
          <button onClick={handleSave} className="admin-btn flex items-center gap-2" disabled={saving}>
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>

        <div className="space-y-6">
          {/* Couple Names */}
          <div>
            <label className="block text-sm text-[#c9a0a0] mb-2 font-accent">Couple Names</label>
            <input
              type="text"
              value={coupleNames}
              onChange={e => setCoupleNames(e.target.value)}
              placeholder="e.g., Ayush & Priya"
              className="admin-input font-heading text-xl"
            />
          </div>

          {/* Relationship Start Date */}
          <div>
            <label className="block text-sm text-[#c9a0a0] mb-2 font-accent">Relationship Start Date</label>
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
            <label className="block text-sm text-[#c9a0a0] mb-2 font-accent">Access Password</label>
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
              <label className="block text-sm text-[#c9a0a0] mb-2 font-accent">Intro Title</label>
              <input
                type="text"
                value={introTitle}
                onChange={e => setIntroTitle(e.target.value)}
                placeholder="Our Love Story"
                className="admin-input font-heading text-xl"
              />
            </div>
            <div>
              <label className="block text-sm text-[#c9a0a0] mb-2 font-accent">Intro Subtitle</label>
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
            <label className="block text-sm text-[#c9a0a0] mb-3 font-accent">Background Music</label>
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
            <label className="block text-sm text-[#c9a0a0] mb-2 font-accent">Love Letter</label>
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
    </AdminLayout>
  );
}
STEP 2.15: QR Code Page
FILE: frontend/src/pages/admin/QRCodePage.jsx

React

import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { toPng } from 'html-to-image';
import AdminLayout from '../../components/admin/AdminLayout';
import { Download, Heart } from 'lucide-react';

export default function QRCodePage() {
  const qrRef = useRef(null);
  const publicUrl = window.location.origin + '/';

  const downloadQR = async () => {
    if (!qrRef.current) return;
    try {
      const dataUrl = await toPng(qrRef.current, {
        quality: 1.0,
        pixelRatio: 4,
        backgroundColor: '#0a0a0a',
      });
      const link = document.createElement('a');
      link.download = 'valentine-qr-code.png';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      alert('Failed to download QR: ' + err.message);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-lg mx-auto text-center">
        <h1 className="font-heading text-4xl text-[#f4e0e0] mb-2">QR Code</h1>
        <p className="text-sm text-[#c9a0a0] mb-8 font-body">
          Print this and include it in your Valentine's card
        </p>

        {/* QR Card */}
        <div
          ref={qrRef}
          className="inline-block p-8 rounded-2xl mx-auto"
          style={{ background: '#0a0a0a' }}
        >
          <div className="glass-card p-8 rounded-2xl flex flex-col items-center gap-4">
            <Heart className="w-8 h-8 text-[#ff2d55]" fill="#ff2d55" />
            <p className="font-heading text-2xl text-[#f4e0e0]">Scan Me ❤️</p>
            <div className="p-4 bg-white rounded-xl">
              <QRCodeSVG
                value={publicUrl}
                size={256}
                level="H"
                fgColor="#1a0a10"
                bgColor="#ffffff"
                imageSettings={{
                  src: '',
                  height: 0,
                  width: 0,
                }}
              />
            </div>
            <p className="text-xs text-[#c9a0a0] font-body">{publicUrl}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-center gap-4">
          <button onClick={downloadQR} className="admin-btn flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download PNG
          </button>
        </div>

        <p className="text-xs text-[rgba(201,160,160,0.4)] mt-6 font-body">
          Make sure both devices are on the same network if using localhost.
          <br />
          For remote access, replace with your public IP or deploy the project.
        </p>
      </div>
    </AdminLayout>
  );
}
████████████████████████████████████████████████████████████
PHASE 3: PUBLIC EXPERIENCE PAGE
████████████████████████████████████████████████████████████
STEP 3.1: Glass Card UI Component
FILE: frontend/src/components/ui/GlassCard.jsx

React

import React from 'react';

export default function GlassCard({ children, className = '', ...props }) {
  return (
    <div
      className={`glass-card p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
STEP 3.2: Animated Text Component
FILE: frontend/src/components/ui/AnimatedText.jsx

React

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function TypewriterText({ text, className = '', delay = 0, speed = 0.05, onComplete }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !text) return;
    const el = containerRef.current;
    el.textContent = '';
    const chars = text.split('');
    let timeline = gsap.timeline({ delay });

    chars.forEach((char, i) => {
      timeline.to(el, {
        duration: speed,
        onStart: () => {
          el.textContent = text.slice(0, i + 1);
        },
      });
    });

    if (onComplete) {
      timeline.call(onComplete);
    }

    return () => timeline.kill();
  }, [text, delay, speed]);

  return <span ref={containerRef} className={className} />;
}

export function FadeInText({ text, className = '', delay = 0, staggerDelay = 0.04 }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !text) return;
    const el = containerRef.current;
    el.innerHTML = '';

    // Split into words, then characters
    const words = text.split(' ');
    words.forEach((word, wi) => {
      const wordSpan = document.createElement('span');
      wordSpan.style.display = 'inline-block';
      wordSpan.style.marginRight = '0.3em';

      word.split('').forEach(char => {
        const charSpan = document.createElement('span');
        charSpan.textContent = char;
        charSpan.style.display = 'inline-block';
        charSpan.style.opacity = '0';
        charSpan.style.transform = 'translateY(20px)';
        wordSpan.appendChild(charSpan);
      });

      el.appendChild(wordSpan);
    });

    const allChars = el.querySelectorAll('span > span');
    gsap.to(allChars, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: staggerDelay,
      delay,
      ease: 'power3.out',
    });
  }, [text, delay, staggerDelay]);

  return <span ref={containerRef} className={className} />;
}
STEP 3.3: Scroll Animation Hook
FILE: frontend/src/hooks/useScrollAnimation.js

JavaScript

import { useInView } from 'react-intersection-observer';

export default function useScrollAnimation(threshold = 0.3) {
  const { ref, inView } = useInView({
    threshold,
    triggerOnce: true,
  });

  return { ref, inView };
}
STEP 3.4: Mouse Parallax Hook
FILE: frontend/src/hooks/useMouseParallax.js

JavaScript

import { useState, useEffect } from 'react';

export default function useMouseParallax(intensity = 0.02) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * intensity;
      const y = (e.clientY / window.innerHeight - 0.5) * intensity;
      setPosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [intensity]);

  return position;
}
STEP 3.5: Scroll Progress
FILE: frontend/src/components/ui/ScrollProgress.jsx

React

import React, { useEffect, useState } from 'react';

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-50" style={{ background: 'rgba(255,45,85,0.1)' }}>
      <div
        className="h-full transition-all duration-100"
        style={{
          width: `${progress}%`,
          background: 'linear-gradient(90deg, #ff2d55, #c41e3a)',
          boxShadow: '0 0 10px rgba(255,45,85,0.5)',
        }}
      />
    </div>
  );
}
STEP 3.6: Countdown Timer
FILE: frontend/src/components/experience/CountdownTimer.jsx

React

import React, { useState, useEffect } from 'react';

export default function CountdownTimer({ startDate, className = '' }) {
  const [elapsed, setElapsed] = useState({ years: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!startDate) return;

    const calculate = () => {
      const start = new Date(startDate);
      const now = new Date();
      let diff = Math.floor((now - start) / 1000);
      if (diff < 0) diff = 0;

      const years = Math.floor(diff / (365.25 * 24 * 3600));
      diff -= years * Math.floor(365.25 * 24 * 3600);
      const days = Math.floor(diff / (24 * 3600));
      diff -= days * 24 * 3600;
      const hours = Math.floor(diff / 3600);
      diff -= hours * 3600;
      const minutes = Math.floor(diff / 60);
      const seconds = diff - minutes * 60;

      setElapsed({ years, days, hours, minutes, seconds });
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [startDate]);

  const units = [
    { value: elapsed.years, label: 'Years' },
    { value: elapsed.days, label: 'Days' },
    { value: elapsed.hours, label: 'Hours' },
    { value: elapsed.minutes, label: 'Minutes' },
    { value: elapsed.seconds, label: 'Seconds' },
  ];

  return (
    <div className={`flex flex-wrap justify-center gap-3 md:gap-4 ${className}`}>
      {units.map((unit) => (
        <div
          key={unit.label}
          className="glass-card px-4 py-3 md:px-6 md:py-4 text-center min-w-[70px] md:min-w-[90px]"
        >
          <div className="font-heading text-2xl md:text-4xl text-[#ff2d55]">
            {String(unit.value).padStart(2, '0')}
          </div>
          <div className="font-accent text-xs md:text-sm text-[#c9a0a0] mt-1">
            {unit.label}
          </div>
        </div>
      ))}
    </div>
  );
}
STEP 3.7: Music Player
FILE: frontend/src/components/experience/MusicPlayer.jsx

React

import React, { useEffect, useRef, useState } from 'react';
import { Howl } from 'howler';
import { Music, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import useStore from '../../stores/useStore';
import { getUploadUrl } from '../../utils/api';

export default function MusicPlayer({ musicFile }) {
  const soundRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);
  const { musicPlaying, setMusicPlaying } = useStore();

  useEffect(() => {
    if (!musicFile) return;

    const url = getUploadUrl(musicFile);
    soundRef.current = new Howl({
      src: [url],
      loop: true,
      volume: 0.4,
      html5: true,
    });

    return () => {
      soundRef.current?.unload();
    };
  }, [musicFile]);

  const togglePlay = () => {
    if (!soundRef.current) return;
    if (playing) {
      soundRef.current.pause();
      setPlaying(false);
      setMusicPlaying(false);
    } else {
      soundRef.current.play();
      setPlaying(true);
      setMusicPlaying(true);
      setShowPrompt(false);
    }
  };

  const toggleMute = () => {
    if (!soundRef.current) return;
    soundRef.current.mute(!muted);
    setMuted(!muted);
  };

  if (!musicFile) return null;

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
            <p className="font-accent text-lg text-[#f4e0e0]">Tap to feel the music 🎵</p>
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
STEP 3.8: Password Gate
FILE: frontend/src/pages/PasswordGate.jsx

React

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../stores/useStore';
import * as api from '../utils/api';
import { Heart } from 'lucide-react';

export default function PasswordGate() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { isAuthenticated, setAuthenticated } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/experience');
    }
  }, [isAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) return;
    setLoading(true);
    setError('');

    try {
      const result = await api.verifyPassword(password);
      if (result.success) {
        setSuccess(true);
        setAuthenticated(true);
        setTimeout(() => navigate('/experience'), 1500);
      } else {
        setError("That's not it, try again 💔");
        setTimeout(() => setError(''), 2500);
      }
    } catch (err) {
      setError("That's not it, try again 💔");
      setTimeout(() => setError(''), 2500);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at center, #1a0a10 0%, #0a0a0a 70%)' }}>

      {/* Background particles (CSS) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-[#ff2d55] opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              fontSize: `${10 + Math.random() * 16}px`,
              animation: `fall ${8 + Math.random() * 12}s linear infinite`,
              animationDelay: `${Math.random() * 10}s`,
            }}
          >
            {i % 3 === 0 ? '🌹' : i % 3 === 1 ? '💕' : '✨'}
          </div>
        ))}
      </div>

      {/* Main Card */}
      <AnimatePresence>
        {success ? (
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.5, 0], opacity: [1, 1, 0] }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            className="text-center"
          >
            <Heart className="w-24 h-24 mx-auto text-[#ff2d55]" fill="#ff2d55" />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="glass-card p-10 max-w-md w-full mx-4 text-center relative z-10"
          >
            {/* Heart icon */}
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mb-6"
            >
              <Heart className="w-12 h-12 mx-auto text-[#ff2d55]" fill="#ff2d55"
                style={{ filter: 'drop-shadow(0 0 12px rgba(255,45,85,0.5))' }} />
            </motion.div>

            <h1 className="font-heading text-3xl md:text-4xl text-[#f4e0e0] mb-2">
              This is for someone special...
            </h1>
            <p className="font-body text-sm text-[#c9a0a0] mb-8">
              Enter our special code to continue ❤️
            </p>

            <form onSubmit={handleSubmit}>
              <motion.input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="admin-input text-center text-lg mb-4 font-body"
                animate={error ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
                transition={{ duration: 0.5 }}
                autoFocus
              />

              <button
                type="submit"
                disabled={loading}
                className="admin-btn w-full text-lg py-3 font-heading"
              >
                {loading ? '...' : 'Open My Heart ❤️'}
              </button>
            </form>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-4 text-sm text-[#c41e3a] font-body"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
STEP 3.9: Intro Section
FILE: frontend/src/components/experience/IntroSection.jsx

React

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import CountdownTimer from './CountdownTimer';
import { TypewriterText } from '../ui/AnimatedText';
import { Heart } from 'lucide-react';

export default function IntroSection({ settings }) {
  const [showContent, setShowContent] = useState(false);
  const [titleDone, setTitleDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at center, #1a0a10 0%, #0a0a0a 70%)' }}
    >
      {/* Background particle layer */}
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <h1
                className="font-heading text-[#f4e0e0] mb-4"
                style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}
              >
                <TypewriterText
                  text={settings?.intro_title || 'Our Love Story'}
                  delay={1.2}
                  speed={0.08}
                  onComplete={() => setTitleDone(true)}
                />
              </h1>
            </motion.div>

            {/* Subtitle */}
            {titleDone && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="font-body text-[#c9a0a0] mb-4"
                style={{ fontSize: 'clamp(1rem, 2.5vw, 1.5rem)' }}
              >
                {settings?.intro_subtitle || 'Every moment with you is magic...'}
              </motion.p>
            )}

            {/* Couple Names */}
            {titleDone && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="font-heading text-[#ff2d55] text-2xl md:text-3xl mb-10"
                style={{ filter: 'drop-shadow(0 0 10px rgba(255,45,85,0.4))' }}
              >
                {settings?.couple_names || 'You & Your Love'}
              </motion.p>
            )}

            {/* Countdown Timer */}
            {titleDone && settings?.relationship_start_date && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
              >
                <p className="font-accent text-sm text-[#c9a0a0] mb-3">Time we've been together</p>
                <CountdownTimer startDate={settings.relationship_start_date} />
              </motion.div>
            )}

            {/* Scroll indicator */}
            {titleDone && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ delay: 3, duration: 2, repeat: Infinity }}
                className="mt-16"
              >
                <p className="font-accent text-sm text-[#c9a0a0]">Scroll down to explore ↓</p>
              </motion.div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
STEP 3.10: Memory Section
FILE: frontend/src/components/experience/MemorySection.jsx

React

import React from 'react';
import { motion } from 'framer-motion';
import useScrollAnimation from '../../hooks/useScrollAnimation';
import useMouseParallax from '../../hooks/useMouseParallax';
import { getUploadUrl } from '../../utils/api';
import { FadeInText } from '../ui/AnimatedText';

// Import all animation components
import FloatingPolaroids from '../3d/FloatingPolaroids';
import CarouselGallery from '../3d/CarouselGallery';
import ScatteredPhotos from '../3d/ScatteredPhotos';
import FilmStrip from '../3d/FilmStrip';
import PhotoCube from '../3d/PhotoCube';
import BubblePhotos from '../3d/BubblePhotos';
import VinylRecords from '../3d/VinylRecords';
import GalleryWall from '../3d/GalleryWall';

const ANIMATION_MAP = {
  'Floating Polaroids': FloatingPolaroids,
  '3D Carousel': CarouselGallery,
  'Scattered Desk': ScatteredPhotos,
  'Glowing Film Strip': FilmStrip,
  'Photo Cube': PhotoCube,
  'Floating Bubbles': BubblePhotos,
  'Vinyl Records': VinylRecords,
  'Gallery Wall': GalleryWall,
};

export default function MemorySection({ section, index }) {
  const { ref, inView } = useScrollAnimation(0.2);
  const mouse = useMouseParallax(20);
  const bgUrl = getUploadUrl(section.background_photo);
  const photos = (section.overlay_photos || []).map(p => getUploadUrl(p)).filter(Boolean);

  const AnimationComponent = ANIMATION_MAP[section.animation_style] || FloatingPolaroids;

  return (
    <section
      ref={ref}
      className="min-h-screen relative flex items-center justify-center overflow-hidden"
      style={{ background: '#0a0a0a' }}
    >
      {/* Background Photo with dark overlay */}
      {bgUrl && (
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0"
            style={{
              transform: `translateY(${mouse.y * -0.5}px)`,
            }}
          >
            <img
              src={bgUrl}
              alt=""
              className="w-full h-full object-cover"
              style={{ filter: 'brightness(0.3) blur(2px)' }}
            />
          </motion.div>
          <div className="absolute inset-0" style={{ background: 'rgba(10, 5, 8, 0.5)' }} />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 md:px-8 py-16 md:py-24">
        {/* Title & Caption */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center mb-12"
        >
          <h2
            className="font-heading text-[#f4e0e0] mb-4"
            style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}
          >
            {inView && <FadeInText text={section.title || 'Memory'} delay={0.2} />}
          </h2>

          {/* Decorative underline */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mx-auto mb-4"
            style={{
              width: '120px',
              height: '2px',
              background: 'linear-gradient(90deg, transparent, #ff2d55, transparent)',
              transformOrigin: 'center',
            }}
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="font-body text-[#c9a0a0] max-w-lg mx-auto"
            style={{ fontSize: 'clamp(1rem, 2.5vw, 1.3rem)' }}
          >
            {section.caption}
          </motion.p>
        </motion.div>

        {/* Animated Photo Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          style={{
            transform: `translate(${mouse.x * 0.3}px, ${mouse.y * 0.3}px)`,
          }}
        >
          {photos.length > 0 ? (
            <AnimationComponent photos={photos} inView={inView} index={index} />
          ) : (
            <div className="text-center py-20 text-[#c9a0a0] font-accent">
              No photos uploaded yet
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
STEP 3.11: Final Section
FILE: frontend/src/components/experience/FinalSection.jsx

React

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useScrollAnimation from '../../hooks/useScrollAnimation';
import CountdownTimer from './CountdownTimer';
import LoveLetter from './LoveLetter';
import { FadeInText } from '../ui/AnimatedText';
import { Heart, Mail } from 'lucide-react';

export default function FinalSection({ settings }) {
  const { ref, inView } = useScrollAnimation(0.2);
  const [letterOpen, setLetterOpen] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const handleOpenLetter = () => {
    setLetterOpen(true);
    setTimeout(() => setShowCelebration(true), 1500);
  };

  return (
    <section
      ref={ref}
      className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at center, #1a0a10 0%, #0a0a0a 70%)' }}
    >
      {/* Celebration particles */}
      {showCelebration && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: '50%',
                y: '50%',
                scale: 0,
                opacity: 1,
              }}
              animate={{
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
                scale: [0, 1.5, 0.5],
                opacity: [1, 1, 0],
                rotate: Math.random() * 720,
              }}
              transition={{ duration: 2 + Math.random() * 2, ease: 'easeOut' }}
              className="absolute text-xl"
            >
              {['❤️', '💕', '🌹', '💝', '✨', '💖'][i % 6]}
            </motion.div>
          ))}
        </div>
      )}

      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2
            className="font-heading text-[#f4e0e0] mb-4"
            style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}
          >
            {inView && <FadeInText text="My Heart Is Yours, Forever 💝" delay={0.3} />}
          </h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 1, duration: 0.6 }}
            className="font-body text-[#c9a0a0] mb-12"
            style={{ fontSize: 'clamp(1rem, 2.5vw, 1.3rem)' }}
          >
            Every love story is beautiful, but ours is my favorite.
          </motion.p>
        </motion.div>

        {/* Envelope / Love Letter */}
        <AnimatePresence mode="wait">
          {!letterOpen ? (
            <motion.div
              key="envelope"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? {
                opacity: 1,
                scale: 1,
                y: [0, -8, 0],
              } : {}}
              transition={{
                opacity: { duration: 0.5, delay: 1.2 },
                scale: { duration: 0.5, delay: 1.2 },
                y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
              }}
              className="cursor-pointer"
              onClick={handleOpenLetter}
            >
              <div className="glass-card p-12 md:p-16 inline-block glow-red hover:scale-105 transition-transform">
                <Mail className="w-16 h-16 md:w-24 md:h-24 mx-auto text-[#ff2d55] mb-4"
                  style={{ filter: 'drop-shadow(0 0 20px rgba(255,45,85,0.5))' }} />
                <motion.p
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="font-accent text-[#f4e0e0] text-lg"
                >
                  Click to open my heart...
                </motion.p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="letter"
              initial={{ opacity: 0, scale: 0.5, rotateX: -90 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
            >
              <LoveLetter text={settings?.love_letter_text} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Countdown (secondary) */}
        {settings?.relationship_start_date && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 2, duration: 0.8 }}
            className="mt-16"
          >
            <p className="font-accent text-sm text-[#c9a0a0] mb-3">
              And counting every second with you...
            </p>
            <CountdownTimer startDate={settings.relationship_start_date} />
          </motion.div>
        )}

        {/* Final hearts */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 3 }}
          className="mt-12 flex justify-center gap-2"
        >
          {['💕', '❤️', '💕'].map((h, i) => (
            <motion.span
              key={i}
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
              className="text-2xl"
            >
              {h}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
STEP 3.12: Love Letter
FILE: frontend/src/components/experience/LoveLetter.jsx

React

import React from 'react';
import { motion } from 'framer-motion';
import { TypewriterText } from '../ui/AnimatedText';

export default function LoveLetter({ text }) {
  if (!text) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="font-body text-[#c9a0a0]">No love letter written yet...</p>
      </div>
    );
  }

  return (
    <motion.div
      className="glass-card p-8 md:p-12 max-w-xl mx-auto text-left max-h-[60vh] overflow-y-auto"
      style={{
        background: 'rgba(255, 45, 85, 0.05)',
        borderColor: 'rgba(255, 45, 85, 0.25)',
      }}
    >
      <div className="font-body text-[#f4e0e0] leading-relaxed whitespace-pre-line"
        style={{ fontSize: 'clamp(0.95rem, 2vw, 1.15rem)' }}>
        <TypewriterText text={text} speed={0.02} />
      </div>
    </motion.div>
  );
}
STEP 3.13: Experience Page (Main)
FILE: frontend/src/pages/Experience.jsx

React

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../stores/useStore';
import IntroSection from '../components/experience/IntroSection';
import MemorySection from '../components/experience/MemorySection';
import FinalSection from '../components/experience/FinalSection';
import MusicPlayer from '../components/experience/MusicPlayer';
import ScrollProgress from '../components/ui/ScrollProgress';
import ParticleSystem from '../components/3d/ParticleSystem';

export default function Experience() {
  const { isAuthenticated, sections, settings, fetchSections, fetchSettings } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    fetchSections();
    fetchSettings();
  }, []);

  const sortedSections = [...sections]
    .sort((a, b) => a.order - b.order);

  const memorySections = sortedSections.filter(s => s.section_type === 'memory');
  const introSection = sortedSections.find(s => s.section_type === 'intro');
  const finalSection = sortedSections.find(s => s.section_type === 'final');

  return (
    <div className="relative" style={{ background: '#0a0a0a' }}>
      <ScrollProgress />
      <ParticleSystem />
      <MusicPlayer musicFile={settings?.background_music_file} />

      {/* Intro */}
      <IntroSection settings={settings} />

      {/* Memory Sections */}
      {memorySections.map((section, index) => (
        <MemorySection key={section._id} section={section} index={index} />
      ))}

      {/* Final Section */}
      <FinalSection settings={settings} />
    </div>
  );
}
████████████████████████████████████████████████████████████
PHASE 4: ANIMATIONS & 3D COMPONENTS
████████████████████████████████████████████████████████████
STEP 4.1: Persistent Particle System (CSS-based)
FILE: frontend/src/components/3d/ParticleSystem.jsx

React

import React, { useMemo } from 'react';

export default function ParticleSystem() {
  const petals = useMemo(() =>
    Array.from({ length: 40 }).map((_, i) => ({
      id: `petal-${i}`,
      left: Math.random() * 100,
      size: 10 + Math.random() * 18,
      duration: 10 + Math.random() * 20,
      delay: Math.random() * 20,
      color: ['#8b0000', '#c41e3a', '#e75480'][Math.floor(Math.random() * 3)],
      swing: (Math.random() - 0.5) * 200,
    })), []
  );

  const hearts = useMemo(() =>
    Array.from({ length: 12 }).map((_, i) => ({
      id: `heart-${i}`,
      left: Math.random() * 100,
      size: 12 + Math.random() * 16,
      duration: 12 + Math.random() * 18,
      delay: Math.random() * 15,
    })), []
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      {/* Rose Petals */}
      {petals.map(p => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.left}%`,
            fontSize: `${p.size}px`,
            color: p.color,
            opacity: 0,
            animation: `fall ${p.duration}s linear infinite`,
            animationDelay: `${p.delay}s`,
          }}
        >
          🌹
        </div>
      ))}

      {/* Floating Hearts */}
      {hearts.map(h => (
        <div
          key={h.id}
          className="absolute"
          style={{
            left: `${h.left}%`,
            bottom: '-20px',
            fontSize: `${h.size}px`,
            opacity: 0,
            animation: `float-up ${h.duration}s linear infinite`,
            animationDelay: `${h.delay}s`,
          }}
        >
          💕
        </div>
      ))}
    </div>
  );
}
STEP 4.2: Floating Polaroids (Section 1)
FILE: frontend/src/components/3d/FloatingPolaroids.jsx

React

import React from 'react';
import { motion } from 'framer-motion';

export default function FloatingPolaroids({ photos, inView }) {
  const positions = [
    { x: -30, y: -20, rotate: -8, delay: 0 },
    { x: 30, y: -10, rotate: 5, delay: 0.15 },
    { x: -20, y: 20, rotate: -3, delay: 0.3 },
    { x: 25, y: 25, rotate: 7, delay: 0.45 },
  ];

  return (
    <div className="relative w-full flex flex-wrap justify-center gap-6 md:gap-8 py-8">
      {photos.slice(0, 4).map((photo, i) => {
        const pos = positions[i] || positions[0];
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 100, rotate: pos.rotate * 3, scale: 0.5 }}
            animate={inView ? {
              opacity: 1,
              y: [0, -8, 0],
              rotate: pos.rotate,
              scale: 1,
            } : {}}
            transition={{
              opacity: { duration: 0.6, delay: pos.delay },
              y: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 },
              rotate: { duration: 0.6, delay: pos.delay },
              scale: { duration: 0.6, delay: pos.delay },
            }}
            whileHover={{ scale: 1.08, rotate: 0, zIndex: 10 }}
            className="relative cursor-pointer"
            style={{ perspective: '800px' }}
          >
            {/* Polaroid frame */}
            <div className="bg-white p-2 pb-10 md:p-3 md:pb-12 rounded-sm shadow-xl shadow-black/40"
              style={{ transform: `translateX(${pos.x}px)` }}>
              <img
                src={photo}
                alt=""
                className="w-48 h-36 md:w-64 md:h-48 object-cover"
              />
              <p className="absolute bottom-2 md:bottom-3 left-0 right-0 text-center font-accent text-xs md:text-sm text-gray-500">
                ❤️ memory
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
STEP 4.3: 3D Carousel (Section 2)
FILE: frontend/src/components/3d/CarouselGallery.jsx

React

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function CarouselGallery({ photos, inView }) {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const interval = setInterval(() => {
      setRotation(r => r + 0.3);
    }, 16);
    return () => clearInterval(interval);
  }, [inView]);

  const count = Math.min(photos.length, 4);
  const radius = 280;

  return (
    <div className="relative w-full flex justify-center py-8" style={{ perspective: '1200px' }}>
      <div
        className="relative w-72 h-72 md:w-96 md:h-96"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateY(${rotation}deg)`,
        }}
      >
        {photos.slice(0, count).map((photo, i) => {
          const angle = (360 / count) * i;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                transformStyle: 'preserve-3d',
                transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
              }}
            >
              <div className="glass-card p-2 rounded-xl shadow-2xl shadow-black/50">
                <img
                  src={photo}
                  alt=""
                  className="w-48 h-36 md:w-56 md:h-44 object-cover rounded-lg"
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
STEP 4.4: Scattered Photos (Section 3)
FILE: frontend/src/components/3d/ScatteredPhotos.jsx

React

import React from 'react';
import { motion } from 'framer-motion';

export default function ScatteredPhotos({ photos, inView }) {
  const layouts = [
    { x: -60, y: -30, rotate: -12 },
    { x: 50, y: -50, rotate: 8 },
    { x: -40, y: 40, rotate: 5 },
    { x: 70, y: 20, rotate: -6 },
  ];

  return (
    <div className="relative w-full flex flex-wrap justify-center gap-4 md:gap-0 py-8">
      {photos.slice(0, 4).map((photo, i) => {
        const layout = layouts[i] || layouts[0];
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: -300, rotate: layout.rotate * 4, scale: 0.3 }}
            animate={inView ? {
              opacity: 1,
              y: 0,
              rotate: layout.rotate,
              scale: 1,
            } : {}}
            transition={{
              type: 'spring',
              stiffness: 120,
              damping: 14,
              delay: i * 0.15,
            }}
            whileHover={{ y: -15, rotate: 0, scale: 1.1, zIndex: 10 }}
            className="cursor-pointer relative"
            style={{
              transform: `translate(${layout.x}px, ${layout.y}px)`,
            }}
          >
            <div className="rounded-xl overflow-hidden shadow-2xl shadow-black/60 border border-[rgba(255,45,85,0.15)]">
              <img
                src={photo}
                alt=""
                className="w-44 h-32 md:w-60 md:h-44 object-cover"
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
STEP 4.5: Film Strip (Section 4)
FILE: frontend/src/components/3d/FilmStrip.jsx

React

import React from 'react';
import { motion } from 'framer-motion';

export default function FilmStrip({ photos, inView }) {
  return (
    <div className="w-full overflow-hidden py-8">
      <motion.div
        initial={{ x: '100%' }}
        animate={inView ? { x: 0 } : {}}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="flex items-center gap-0 justify-center"
      >
        {/* Film strip container */}
        <div className="flex items-center bg-gray-900 rounded-lg p-1 relative overflow-hidden"
          style={{
            boxShadow: '0 0 30px rgba(255,45,85,0.2), inset 0 0 20px rgba(0,0,0,0.5)',
          }}
        >
          {/* Sprocket holes left */}
          <div className="flex flex-col gap-2 px-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-3 h-3 rounded-full bg-gray-700 border border-gray-600" />
            ))}
          </div>

          {/* Photos */}
          <div className="flex gap-2 px-2">
            {photos.slice(0, 4).map((photo, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.3 + i * 0.2, duration: 0.5 }}
                className="relative"
              >
                <img
                  src={photo}
                  alt=""
                  className="w-36 h-28 md:w-52 md:h-40 object-cover rounded"
                  style={{
                    filter: 'saturate(0.9)',
                    boxShadow: '0 0 15px rgba(255,45,85,0.3)',
                  }}
                />
              </motion.div>
            ))}
          </div>

          {/* Sprocket holes right */}
          <div className="flex flex-col gap-2 px-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-3 h-3 rounded-full bg-gray-700 border border-gray-600" />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
STEP 4.6: Photo Cube (Section 5)
FILE: frontend/src/components/3d/PhotoCube.jsx

React

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function PhotoCube({ photos, inView }) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const interval = setInterval(() => {
      setRotateX(r => r + 0.2);
      setRotateY(r => r + 0.35);
    }, 16);
    return () => clearInterval(interval);
  }, [inView]);

  const size = 200;
  const halfSize = size / 2;

  const faces = [
    { transform: `translateZ(${halfSize}px)`, photo: photos[0] },
    { transform: `rotateY(90deg) translateZ(${halfSize}px)`, photo: photos[1] },
    { transform: `rotateY(180deg) translateZ(${halfSize}px)`, photo: photos[2] },
    { transform: `rotateY(-90deg) translateZ(${halfSize}px)`, photo: photos[3] },
    { transform: `rotateX(90deg) translateZ(${halfSize}px)`, photo: null },
    { transform: `rotateX(-90deg) translateZ(${halfSize}px)`, photo: null },
  ];

  return (
    <div className="w-full flex justify-center py-12" style={{ perspective: '1000px' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.3 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.8 }}
      >
        <div
          style={{
            width: size,
            height: size,
            transformStyle: 'preserve-3d',
            transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          }}
          className="relative mx-auto"
        >
          {faces.map((face, i) => (
            <div
              key={i}
              className="absolute inset-0 overflow-hidden border border-[rgba(255,45,85,0.3)] rounded-lg"
              style={{
                transform: face.transform,
                backfaceVisibility: 'hidden',
                background: face.photo ? 'transparent' : 'rgba(255,45,85,0.1)',
              }}
            >
              {face.photo ? (
                <img src={face.photo} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl">❤️</div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
STEP 4.7: Bubble Photos (Section 6)
FILE: frontend/src/components/3d/BubblePhotos.jsx

React

import React from 'react';
import { motion } from 'framer-motion';

export default function BubblePhotos({ photos, inView }) {
  const layouts = [
    { x: -100, y: -20, size: 200 },
    { x: 80, y: -50, size: 180 },
    { x: -60, y: 60, size: 170 },
    { x: 100, y: 40, size: 190 },
  ];

  return (
    <div className="relative w-full flex flex-wrap justify-center gap-6 py-8">
      {photos.slice(0, 4).map((photo, i) => {
        const layout = layouts[i] || layouts[0];
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 60, scale: 0.5 }}
            animate={inView ? {
              opacity: 1,
              y: [0, -15, 0],
              scale: 1,
            } : {}}
            transition={{
              opacity: { duration: 0.6, delay: i * 0.2 },
              y: { duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut' },
              scale: { duration: 0.6, delay: i * 0.2 },
            }}
            whileHover={{ scale: 1.15 }}
            className="relative cursor-pointer"
          >
            {/* Bubble */}
            <div
              className="rounded-full overflow-hidden border-2 border-[rgba(255,255,255,0.15)] shadow-2xl"
              style={{
                width: `${layout.size}px`,
                height: `${layout.size}px`,
                background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.15), transparent)',
                boxShadow: `0 0 40px rgba(255,45,85,0.15), inset 0 0 30px rgba(255,255,255,0.05)`,
              }}
            >
              <img
                src={photo}
                alt=""
                className="w-full h-full object-cover rounded-full"
                style={{ opacity: 0.85 }}
              />
            </div>

            {/* Shine effect */}
            <div
              className="absolute top-4 left-6 w-8 h-4 bg-white rounded-full opacity-20 blur-sm"
              style={{ transform: 'rotate(-30deg)' }}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
STEP 4.8: Vinyl Records (Section 7)
FILE: frontend/src/components/3d/VinylRecords.jsx

React

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function VinylRecords({ photos, inView }) {
  const [angles, setAngles] = useState([0, 0, 0, 0]);

  useEffect(() => {
    if (!inView) return;
    const speeds = [1.5, 2, 1.2, 1.8];
    const interval = setInterval(() => {
      setAngles(prev => prev.map((a, i) => a + speeds[i]));
    }, 16);
    return () => clearInterval(interval);
  }, [inView]);

  return (
    <div className="w-full grid grid-cols-2 gap-6 md:gap-10 max-w-2xl mx-auto py-8">
      {photos.slice(0, 4).map((photo, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
          animate={inView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
          transition={{ duration: 0.8, delay: i * 0.2, type: 'spring' }}
          className="flex justify-center"
        >
          <div className="relative">
            {/* Vinyl disc */}
            <div
              className="w-40 h-40 md:w-52 md:h-52 rounded-full border-4 border-gray-800 shadow-2xl shadow-black/60"
              style={{
                background: `radial-gradient(circle, transparent 30%, #1a1a1a 31%, #222 35%, #1a1a1a 36%, #222 60%, #1a1a1a 61%, #222 100%)`,
                transform: `rotate(${angles[i]}deg)`,
              }}
            >
              {/* Center label (photo) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-gray-700">
                <img src={photo} alt="" className="w-full h-full object-cover" />
              </div>

              {/* Center hole */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gray-900 border border-gray-600" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
STEP 4.9: Gallery Wall (Section 8)
FILE: frontend/src/components/3d/GalleryWall.jsx

React

import React from 'react';
import { motion } from 'framer-motion';

export default function GalleryWall({ photos, inView }) {
  const frames = [
    { width: 280, height: 220, delay: 0 },
    { width: 240, height: 280, delay: 0.3 },
    { width: 260, height: 200, delay: 0.6 },
    { width: 250, height: 260, delay: 0.9 },
  ];

  return (
    <div className="w-full flex flex-wrap justify-center gap-6 md:gap-8 py-8">
      {photos.slice(0, 4).map((photo, i) => {
        const frame = frames[i] || frames[0];
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: frame.delay }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="cursor-pointer"
          >
            {/* Ornate frame */}
            <div
              className="p-3 md:p-4 rounded-sm"
              style={{
                background: 'linear-gradient(135deg, #8B7355, #d4a574, #8B7355)',
                boxShadow: '0 4px 30px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2)',
              }}
            >
              <div className="p-0.5" style={{ background: '#2a1a0a' }}>
                <div className="relative overflow-hidden">
                  <img
                    src={photo}
                    alt=""
                    className="w-48 h-36 md:w-60 md:h-48 object-cover"
                  />
                  {/* Spotlight effect */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 0.3 } : {}}
                    transition={{ delay: frame.delay + 0.5, duration: 0.5 }}
                    className="absolute inset-0"
                    style={{
                      background: 'radial-gradient(ellipse at top center, rgba(255,255,200,0.3), transparent 70%)',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Wall mount shadow */}
            <div className="h-3 mx-6 rounded-b-full opacity-30"
              style={{ background: 'radial-gradient(ellipse, rgba(0,0,0,0.4), transparent)' }} />
          </motion.div>
        );
      })}
    </div>
  );
}
STEP 4.10: Crystal Heart (Intro)
FILE: frontend/src/components/3d/CrystalHeart.jsx

NOTE: This is an OPTIONAL Three.js component. The IntroSection already has a
CSS-based heart. This file exists as an upgrade path using @react-three/fiber.
If Three.js causes issues, it can be safely skipped — the IntroSection works without it.

React

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Float } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

function HeartMesh() {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
      const scale = 1 + Math.sin(state.clock.getElapsedTime() * 2) * 0.05;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  // Simple heart-like shape using a sphere with distortion
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <MeshDistortMaterial
          color="#ff2d55"
          emissive="#8b0000"
          emissiveIntensity={0.3}
          roughness={0.1}
          metalness={0.8}
          distort={0.3}
          speed={2}
          transparent
          opacity={0.85}
        />
      </mesh>
    </Float>
  );
}

export default function CrystalHeart({ className = '' }) {
  return (
    <div className={`w-full h-64 md:h-80 ${className}`}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.3} color="#ffe0e0" />
        <pointLight position={[5, 5, 5]} intensity={1} color="#ff2d55" />
        <pointLight position={[-5, -3, 3]} intensity={0.5} color="#c41e3a" />
        <HeartMesh />
        <EffectComposer>
          <Bloom intensity={0.8} luminanceThreshold={0.6} luminanceSmoothing={0.9} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
STEP 4.11: Ribbon3D (Decorative — Optional)
FILE: frontend/src/components/3d/Ribbon3D.jsx

React

import React from 'react';

// Simple CSS-based decorative ribbon. Keeps file structure consistent.
export default function Ribbon3D({ className = '' }) {
  return (
    <div className={`flex justify-center ${className}`}>
      <div
        className="w-32 h-0.5 my-4"
        style={{
          background: 'linear-gradient(90deg, transparent, #d4a574, transparent)',
        }}
      />
    </div>
  );
}
STEP 4.12: Envelope3D (Final Section — Optional Upgrade)
FILE: frontend/src/components/3d/Envelope3D.jsx

React

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Heart } from 'lucide-react';

// CSS-based 3D envelope for the final section
export default function Envelope3D({ onClick, isOpen }) {
  return (
    <motion.div
      onClick={onClick}
      className="cursor-pointer inline-block"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={{
        y: isOpen ? -20 : [0, -8, 0],
      }}
      transition={{
        y: isOpen ? { duration: 0.3 } : { duration: 3, repeat: Infinity, ease: 'easeInOut' },
      }}
    >
      <div className="glass-card p-12 md:p-16 glow-red relative overflow-hidden">
        {/* Wax seal */}
        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#8b0000] flex items-center justify-center border border-[#c41e3a]">
          <Heart className="w-4 h-4 text-[#ff2d55]" fill="#ff2d55" />
        </div>

        <motion.div
          animate={isOpen ? { rotateX: -180, opacity: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <Mail
            className="w-16 h-16 md:w-24 md:h-24 mx-auto text-[#ff2d55] mb-4"
            style={{ filter: 'drop-shadow(0 0 20px rgba(255,45,85,0.5))' }}
          />
        </motion.div>

        <motion.p
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="font-accent text-[#f4e0e0] text-lg"
        >
          Click to open my heart...
        </motion.p>
      </div>
    </motion.div>
  );
}
████████████████████████████████████████████████████████████
VERIFICATION CHECKLIST
████████████████████████████████████████████████████████████
After implementing all files, verify:

Phase 2 Checks:
 npm run dev starts without errors on port 5173
 /admin shows dashboard with sections listed
 Clicking section card → /admin/section/:id opens editor
 Photo upload (drag & drop) works for background and overlay
 /admin/settings loads and saves all fields
 /admin/qr shows QR code and download works
Phase 3 Checks:
 / shows password gate
 Entering correct password → redirect to /experience
 Session persists on refresh (sessionStorage)
 Intro section shows with title, subtitle, couple names, countdown
 All memory sections render with background + overlay photos
 Final section shows envelope → click → love letter reveals
 Music player appears and plays
Phase 4 Checks:
 Rose petals and hearts float across all sections
 Each memory section has a DIFFERENT photo animation style
 Scroll-triggered entry animations work
 Hover interactions on photos work
 Text fades in with animation (GSAP typewriter)
 Colors match Valentine dark theme throughout
File Count Summary:
Config: 3 files (vite.config.js, index.html, index.css)
Core: 4 files (main.jsx, App.jsx, api.js, constants.js)
Store: 1 file (useStore.js)
Pages: 6 files (PasswordGate, Experience, Dashboard, SectionEditor, Settings, QRCodePage)
Admin Components: 3 files (AdminLayout, SectionCard, PhotoUploader)
Experience Components: 5 files (IntroSection, MemorySection, FinalSection, LoveLetter, CountdownTimer, MusicPlayer)
3D/Animation: 11 files (ParticleSystem, FloatingPolaroids, CarouselGallery, ScatteredPhotos, FilmStrip, PhotoCube, BubblePhotos, VinylRecords, GalleryWall, CrystalHeart, Ribbon3D, Envelope3D)
UI: 3 files (GlassCard, AnimatedText, ScrollProgress)
Hooks: 2 files (useScrollAnimation, useMouseParallax)
TOTAL: ~38 files
text


---

Now here is the updated **progress.md**:

```markdown
# ValentineMemories3D - Implementation Progress

## Phase 1: Backend + Database ✅ COMPLETE
- [x] FastAPI server with all API endpoints
- [x] MongoDB collections (sections, settings)
- [x] Photo upload with Pillow compression
- [x] Music upload
- [x] Password verification
- [x] Static file serving
- [x] Database seeding with sample data

## Phase 2: Frontend Foundation + Admin Panel ⏳ READY TO IMPLEMENT
- [ ] Vite project initialization + dependency install
- [ ] vite.config.js with proxy + Tailwind plugin
- [ ] index.html with Google Fonts preconnect
- [ ] index.css with Tailwind, theme variables, glass-card utilities, keyframes
- [ ] utils/constants.js + utils/api.js (axios wrapper for all endpoints)
- [ ] stores/useStore.js (Zustand: sections, settings, auth, music state)
- [ ] main.jsx + App.jsx (React Router with all 6 routes)
- [ ] AdminLayout.jsx (sidebar navigation)
- [ ] SectionCard.jsx (thumbnail + info + actions)
- [ ] PhotoUploader.jsx (Single + Multi with react-dropzone)
- [ ] Dashboard.jsx (list sections, create, reorder, delete)
- [ ] SectionEditor.jsx (edit title/caption/order/animation, upload photos)
- [ ] Settings.jsx (couple names, date, password, music upload, love letter)
- [ ] QRCodePage.jsx (qrcode.react + html-to-image download)

## Phase 3: Public Experience Page ⏳ READY TO IMPLEMENT
- [ ] GlassCard.jsx, AnimatedText.jsx (TypewriterText + FadeInText via GSAP)
- [ ] ScrollProgress.jsx (fixed top bar)
- [ ] useScrollAnimation.js (Intersection Observer wrapper)
- [ ] useMouseParallax.js (mouse position tracker)
- [ ] PasswordGate.jsx (glass card, heart animation, shake on error, session storage)
- [ ] CountdownTimer.jsx (years/days/hours/minutes/seconds in glass cards)
- [ ] MusicPlayer.jsx (Howler.js, autoplay prompt, floating controls)
- [ ] IntroSection.jsx (typewriter title, pulsing heart, countdown, scroll hint)
- [ ] MemorySection.jsx (background photo + dark overlay + animation component switcher)
- [ ] FinalSection.jsx (envelope → love letter reveal with celebration particles)
- [ ] LoveLetter.jsx (typewriter text in glass card)
- [ ] Experience.jsx (loads data, renders Intro → Memories → Final, persistent particles + music)

## Phase 4: Animations & 3D Components ⏳ READY TO IMPLEMENT
- [ ] ParticleSystem.jsx (40 CSS rose petals + 12 floating hearts, fixed overlay)
- [ ] FloatingPolaroids.jsx (white border frames, bobbing sine motion, fly-in)
- [ ] CarouselGallery.jsx (CSS 3D perspective circular auto-rotation)
- [ ] ScatteredPhotos.jsx (spring physics drop, random rotation, hover lift)
- [ ] FilmStrip.jsx (sprocket holes, horizontal strip, slide-in, glow)
- [ ] PhotoCube.jsx (6-face CSS 3D cube, continuous rotation, photos on 4 faces)
- [ ] BubblePhotos.jsx (circular frames, float animation, shine effect)
- [ ] VinylRecords.jsx (spinning discs, photo center labels, 2x2 grid)
- [ ] GalleryWall.jsx (gold frames, spotlight gradient, sequential reveal)
- [ ] CrystalHeart.jsx (OPTIONAL: Three.js sphere with distort + bloom)
- [ ] Ribbon3D.jsx (CSS gradient decorative divider)
- [ ] Envelope3D.jsx (CSS glass envelope with wax seal, flip animation)

## Architecture Summary
- **Backend**: FastAPI + MongoDB (motor async) → port 8000
- **Frontend**: React 18 + Vite → port 5173 (proxy /api to backend)
- **State**: Zustand (sections, settings, auth, music)
- **Styling**: Tailwind CSS v4 (@tailwindcss/vite plugin) + custom CSS variables
- **Animations**: Framer Motion (scroll + layout) + GSAP (text reveals) + CSS keyframes (particles)
- **3D**: CSS 3D transforms for gallery effects; Three.js optional for intro heart
- **File Storage**: Local ./uploads/ served via FastAPI static mount
- **Auth**: Simple password verification via API, session stored in sessionStorage

## Key Design Decisions
1. CSS particles over Three.js particles = more reliable, better performance
2. CSS 3D transforms for photo galleries = simpler than full R3F scenes per section
3. Framer Motion for scroll triggers = cleaner than raw Intersection Observer + GSAP
4. Three.js reserved only for optional CrystalHeart enhancement
5. All photo gallery components receive `{photos, inView, index}` props uniformly
6. ANIMATION_MAP in MemorySection.jsx maps animation_style strings → components