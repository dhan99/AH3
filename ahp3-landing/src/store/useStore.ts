import { create } from 'zustand';

interface AppState {
  isAuthenticated: boolean;
  user: any | null;
  setAuthenticated: (status: boolean) => void;
  setUser: (user: any | null) => void;
}

const useStore = create<AppState>((set) => ({
  isAuthenticated: false,
  user: null,
  setAuthenticated: (status) => set({ isAuthenticated: status }),
  setUser: (user) => set({ user }),
}));

export default useStore;
