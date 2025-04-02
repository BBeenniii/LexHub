export interface User {
  id: number;
  name: string;
  email: string;
  userType: 'seeker' | 'provider';
}

export const getUser = (): User | null => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

export const isLoggedIn = (): boolean => {
  return !!getUser();
};

export const setUser = (user: User) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const logout = () => {
  localStorage.removeItem('user');
  window.location.href = '/';
};
