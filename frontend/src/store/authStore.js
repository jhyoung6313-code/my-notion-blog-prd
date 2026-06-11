import { create } from 'zustand';
import { getMe, login as apiLogin } from '../api/auth';

const useAuthStore = create((set) => ({
  user: null,
  loading: true,

  // 앱 시작 시 토큰이 있으면 사용자 정보를 복원한다.
  init: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ loading: false });
      return;
    }
    try {
      const user = await getMe();
      set({ user, loading: false });
    } catch {
      localStorage.removeItem('token');
      set({ user: null, loading: false });
    }
  },

  login: async (username, password) => {
    const data = await apiLogin(username, password);
    localStorage.setItem('token', data.token);
    set({ user: data.user });
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null });
  },

  setUser: (user) => set({ user }),
}));

export default useAuthStore;
