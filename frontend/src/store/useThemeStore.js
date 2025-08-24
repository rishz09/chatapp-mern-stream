// used to have global state
// useState() is local state
// we need the theme to be global because it will affect every page

import { create } from 'zustand';

// previously only had default theme as 'coffee'.
// this made page default back to coffee on refreshing, even if different theme was set
// so, we store the current selected theme in local storage, and everytime,
// we check if localstorage contains some set value for theme.
// If yes, we choose that, else default to coffee

export const useThemeStore = create(set => ({
  theme: localStorage.getItem('chatapp-theme') || 'coffee',
  setTheme: theme => {
    localStorage.setItem('chatapp-theme', theme);
    set({ theme });
  },
}));
