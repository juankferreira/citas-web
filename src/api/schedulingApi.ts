import { getAccessToken } from '../auth/authApi';
import type { Appointment, AvailabilityBlock, AvailableProfessional, CatalogItem, Professional, Specialty } from '../types';

const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:8080').replace(/\/$/, '');
export class SchedulingApiError extends Error { constructor(public readonly status: number, message: string) { super(message); this.name = 'SchedulingApiError'; } }
function query(params: Record<string, string | undefined>): string { const entries = Object.entries(params).filter(([, value]) => value) as [string, string][]; return entries.length ? `?${new URLSearchParams(entries).toString()}` : ''; }
async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getAccessToken(); let response: Response;
  try { response = await fetch(`${API_URL}/api/v1${path}`, { ...init, credentials: 'include', headers: { Accept: 'application/json', ...(init.body ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}), ...init.headers } }); }
  catch { throw new SchedulingApiError(0, 'No fue posible conectar con el servicio de citas.'); }
  if (!response.ok) { const problem = await response.json().catch(() => null) as { detail?: string } | null; throw new SchedulingApiError(response.status, problem?.detail ?? 'No fue posible completar la solicitud.'); }
  if (response.status === 204) return undefined as T; return response.json() as Promise<T>;
}
export const catalogsApi = { locations: () => request<CatalogItem[]>('/catalogs/locations'), insurancePlans: () => request<CatalogItem[]>('/catalogs/plans'), specialties: () => request<Specialty[]>('/specialties') };
export const appointmentsApi = {
  availability: (filters: { locationId: string; specialtyId: string; professionalId?: string; date: string }) => request<AvailableProfessional[]>(`/availability${query(filters)}`),
  create: (input: { professionalId: string; locationId: string; specialtyId: string; date: string; startTime: string; reason?: string }) => request<Appointment>('/appointments', { method: 'POST', body: JSON.stringify(input) }),
  pendingSpecialized: () => request<Appointment[]>('/admin/appointments/pending-specialized'),
  decide: (id: string, decision: 'APPROVE' | 'REJECT', reason?: string) => request<Appointment>(`/admin/appointments/${id}/decision`, { method: 'POST', body: JSON.stringify({ decision, reason }) }),
};
export const adminApi = {
  specialties: () => request<Specialty[]>('/admin/specialties'), createSpecialty: (input: { code: string; name: string; durationMinutes: 30 | 60; general: boolean }) => request<Specialty>('/admin/specialties', { method: 'POST', body: JSON.stringify(input) }),
  updateSpecialty: (id: string, input: Partial<{ name: string; durationMinutes: 30 | 60; active: boolean }>) => request<Specialty>(`/admin/specialties/${id}`, { method: 'PATCH', body: JSON.stringify(input) }),
  createProfessional: (input: Record<string, unknown>) => request<Professional>('/admin/professionals', { method: 'POST', body: JSON.stringify(input) }),
  assignSpecialties: (id: string, specialtyIds: string[], primarySpecialtyId: string) => request<void>(`/admin/professionals/${id}/specialties`, { method: 'PUT', body: JSON.stringify({ specialtyIds, primarySpecialtyId }) }),
  assignLocations: (id: string, locationIds: string[]) => request<void>(`/admin/professionals/${id}/locations`, { method: 'PUT', body: JSON.stringify({ locationIds }) }), setActive: (id: string, active: boolean) => request<Professional>(`/admin/professionals/${id}/active`, { method: 'PATCH', body: JSON.stringify({ active }) }),
};
type AvailabilityBlockResponse = { id: string | number; locationId: string | number; date: string; start: string; end: string };
function toAvailabilityBlock(block: AvailabilityBlockResponse): AvailabilityBlock {
  return { id: String(block.id), locationId: String(block.locationId), startAt: `${block.date}T${block.start}`, endAt: `${block.date}T${block.end}` };
}
function toAvailabilityPayload(input: Omit<AvailabilityBlock, 'id' | 'locationName'>) {
  const [date, startTime] = input.startAt.split('T');
  const [endDate, endTime] = input.endAt.split('T');
  if (!date || !startTime || !endDate || !endTime || date !== endDate) throw new SchedulingApiError(400, 'El bloque debe iniciar y terminar el mismo día.');
  return { locationId: input.locationId, date, startTime, endTime };
}
export const availabilityApi = {
  listMine: (date?: string, locationId?: string) => request<AvailabilityBlockResponse[]>(`/professional/availability-blocks${query({ date, locationId })}`).then((blocks) => blocks.map(toAvailabilityBlock)),
  create: (input: Omit<AvailabilityBlock, 'id' | 'locationName'>) => request<AvailabilityBlockResponse>('/professional/availability-blocks', { method: 'POST', body: JSON.stringify(toAvailabilityPayload(input)) }).then(toAvailabilityBlock),
  update: (id: string, input: Partial<Omit<AvailabilityBlock, 'id' | 'locationName'>>) => request<AvailabilityBlockResponse>(`/professional/availability-blocks/${id}`, { method: 'PATCH', body: JSON.stringify(input) }).then(toAvailabilityBlock), remove: (id: string) => request<void>(`/professional/availability-blocks/${id}`, { method: 'DELETE' }),
};
export function schedulingErrorMessage(error: unknown): string { if (!(error instanceof SchedulingApiError)) return 'Ocurrió un error inesperado.'; if (error.status === 401) return 'Tu sesión venció. Inicia sesión nuevamente.'; if (error.status === 403) return 'No tienes permiso para realizar esta acción.'; if (error.status === 404) return 'El recurso solicitado no está disponible.'; if (error.status === 409) return 'El horario dejó de estar disponible. Selecciona otro horario.'; if (error.status === 400) return 'Revisa los datos ingresados.'; return error.message; }
