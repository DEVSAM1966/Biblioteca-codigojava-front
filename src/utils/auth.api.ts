// src/utils/auth.api.ts
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
  return data.data as SignDto;
};

// 🆕 NUEVO: registro de usuario contra tu backend
export interface RegisterPayload {
  fullname: string;
  dni: string;
  phone: string;
  email: string;
  password: string;
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  country?: string;
}

export const registerApi = async (payload: RegisterPayload): Promise<SignDto> => {
  const response = await fetch(`${BACKEND_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  // Leer el JSON SOLO UNA VEZ
  const data = await response.json().catch(() => null);

  console.log("📘 [DEBUG] Respuesta Spring Boot registro:", data);

  if (!response.ok) {
    throw new Error(data?.message || 'Registration failed');
  }

  return data.data as SignDto;
};
