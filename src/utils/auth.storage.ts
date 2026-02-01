import type { User } from '../types';

const USER_KEY = 'currentUser';
const TOKEN_KEY = 'authToken';

// Guardar usuario y token
export const saveAuthData = (user: User, token: string): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(TOKEN_KEY, token);
};

// Obtener usuario
export const getCurrentUser = (): User | null => {
  const stored = localStorage.getItem(USER_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as User;
  } catch {
    return null;
  }
};

// Obtener token
export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

// Borrar sesión
export const clearAuthData = (): void => {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
};
