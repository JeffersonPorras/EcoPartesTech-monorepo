export interface LoginPayload {
  usuario: string;
  password: string;
}

export interface AuthUser {
  id: number;
  usuario: string;
  correo: string | null;
  rol: string;
}

export interface LoginResponse {
  mensaje: string;
  usuario: AuthUser;
}

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function loginRequest(payload: LoginPayload): Promise<LoginResponse> {
  const response = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data?.message ||
      (response.status === 401
        ? 'Usuario o contraseña incorrectos'
        : `Error al iniciar sesión (HTTP ${response.status})`);
    throw new Error(message);
  }

  return data as LoginResponse;
}