import { User } from '../types/User';

export const getUser = (): User | null => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

export const isLoggedIn = (): boolean => {
  return !!localStorage.getItem('user');
};

export const logout = () => {
  localStorage.removeItem('user');
  window.location.href = '/';
};
