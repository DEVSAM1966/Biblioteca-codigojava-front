import { BACKEND_URL } from '../config';
import type { SignDto } from '../types';

export const loginApi = async (email: string, password: string): Promise<SignDto> => {
  const response = await fetch(`${BACKEND_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message || 'Login failed');
  }

  const data = await response.json();

  // Tu backend envuelve la respuesta en { success: true, data: {...} }
  return data.data as SignDto;
};
