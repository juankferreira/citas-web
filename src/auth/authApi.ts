import type { User } from '../types';

const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:8080').replace(/\/$/, '');
const AUTH_PATH = '/api/v1/auth';
const REQUEST_HEADERS = {
  'Content-Type': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
};

export interface Registration {
  firstName: string;
  lastName: string;
  documentType: string;
  documentNumber: string;
  email: string;
  phone: string;
  password: string;
  insurancePlanId?: string;
}

interface RegistrationResponse extends Omit<Registration, 'password'> {
  id: string | number;
  role: string;
}

interface AccessResponse {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
}

interface AccessClaims {
  sub: string;
  roles?: string[];
}

export class AuthApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = 'AuthApiError';
  }
}

let accessToken: string | null = null;
let restorePromise: Promise<User | null> | null = null;

function decodeClaims(token: string): AccessClaims {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(payload)) as AccessClaims;
  } catch {
    throw new AuthApiError(401, 'La sesión recibida no es válida.');
  }
}

async function request<T>(path: string, init: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${AUTH_PATH}${path}`, {
      ...init,
      credentials: 'include',
      headers: { ...REQUEST_HEADERS, ...init.headers },
    });
  } catch {
    throw new AuthApiError(0, 'No fue posible conectar con el servicio de citas.');
  }

  if (!response.ok) {
    const problem = await response.json().catch(() => null) as { detail?: string } | null;
    throw new AuthApiError(response.status, problem?.detail ?? 'No fue posible completar la solicitud.');
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

function acceptAccess(result: AccessResponse): AccessClaims {
  accessToken = result.accessToken;
  return decodeClaims(result.accessToken);
}

function displayName(email: string): string {
  const value = email.split('@')[0].replace(/[._-]+/g, ' ').trim();
  return value ? value.replace(/\b\p{L}/gu, (letter) => letter.toUpperCase()) : 'Usuario';
}

function cachedUser(): User | null {
  const raw = sessionStorage.getItem('portal_citas_user') ?? localStorage.getItem('portal_citas_user');
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    sessionStorage.removeItem('portal_citas_user');
    localStorage.removeItem('portal_citas_user');
    return null;
  }
}

function saveUser(user: User, remember: boolean): void {
  const primary = remember ? localStorage : sessionStorage;
  const secondary = remember ? sessionStorage : localStorage;
  primary.setItem('portal_citas_user', JSON.stringify(user));
  secondary.removeItem('portal_citas_user');
}

function clearUser(): void {
  sessionStorage.removeItem('portal_citas_user');
  localStorage.removeItem('portal_citas_user');
}

export async function login(email: string, password: string, remember = true): Promise<User> {
  const result = await request<AccessResponse>('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  const claims = acceptAccess(result);
  const previous = cachedUser();
  const user: User = {
    id: claims.sub,
    name: previous?.email.toLowerCase() === email.trim().toLowerCase() ? previous.name : displayName(email),
    email: email.trim().toLowerCase(),
    phone: previous?.phone,
    roles: claims.roles ?? [],
  };
  saveUser(user, remember);
  return user;
}

export async function register(registration: Registration): Promise<User> {
  const account = await request<RegistrationResponse>('/register', {
    method: 'POST',
    body: JSON.stringify(registration),
  });
  const user: User = {
    id: String(account.id),
    name: `${account.firstName} ${account.lastName}`.trim(),
    email: account.email,
    phone: account.phone,
    roles: [account.role],
  };
  saveUser(user, true);
  return login(registration.email, registration.password, true);
}

export function restoreSession(): Promise<User | null> {
  if (restorePromise) return restorePromise;
  restorePromise = request<AccessResponse>('/refresh', { method: 'POST' })
    .then((result) => {
      const claims = acceptAccess(result);
      const previous = cachedUser();
      if (!previous) return { id: claims.sub, name: 'Usuario', email: '', roles: claims.roles ?? [] };
      const user = { ...previous, id: claims.sub, roles: claims.roles ?? previous.roles };
      saveUser(user, localStorage.getItem('portal_citas_user') !== null);
      return user;
    })
    .catch((error: unknown) => {
      accessToken = null;
      if (error instanceof AuthApiError && (error.status === 401 || error.status === 403)) clearUser();
      return null;
    })
    .finally(() => { restorePromise = null; });
  return restorePromise;
}

export async function logout(): Promise<void> {
  await request<void>('/logout', { method: 'POST' });
  accessToken = null;
  clearUser();
}

export function getAccessToken(): string | null {
  return accessToken;
}

export function authErrorMessage(error: unknown): string {
  if (!(error instanceof AuthApiError)) return 'Ocurrió un error inesperado.';
  if (error.status === 400) return 'Revisa los datos ingresados e inténtalo nuevamente.';
  if (error.status === 401) return 'El correo, la contraseña o la sesión no son válidos.';
  if (error.status === 409) return 'El correo o el documento ya se encuentran registrados.';
  if (error.status === 403) return 'La solicitud fue rechazada por la configuración de seguridad.';
  return error.message;
}
