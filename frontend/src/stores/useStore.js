import { create } from 'zustand';
import * as api from '@/utils/api';

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
