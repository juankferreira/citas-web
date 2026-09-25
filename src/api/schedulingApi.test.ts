import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('catálogo de planes para registro', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
  });

  it('consulta los planes activos públicamente, sin enviar token', async () => {
    const plans = [{ id: '23', code: 'PLAN-23', name: 'Plan Salud' }];
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify(plans), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }));
    vi.stubGlobal('fetch', fetchMock);
    const { catalogsApi } = await import('./schedulingApi');

    await expect(catalogsApi.insurancePlans()).resolves.toEqual(plans);

    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8080/api/v1/catalogs/plans', expect.objectContaining({
      credentials: 'include',
      headers: { Accept: 'application/json' },
    }));
  });

  it('convierte los bloques REST al formato que muestra el calendario profesional', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify([
      { id: 7, locationId: 1, date: '2026-10-01', start: '08:00:00', end: '09:00:00' },
    ]), { status: 200, headers: { 'Content-Type': 'application/json' } })));
    const { availabilityApi } = await import('./schedulingApi');

    await expect(availabilityApi.listMine()).resolves.toEqual([
      { id: '7', locationId: '1', startAt: '2026-10-01T08:00:00', endAt: '2026-10-01T09:00:00' },
    ]);
  });

  it('envía fecha y horas separadas al crear un bloque profesional', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      id: 7, locationId: 1, date: '2026-10-01', start: '08:00:00', end: '09:00:00',
    }), { status: 201, headers: { 'Content-Type': 'application/json' } }));
    vi.stubGlobal('fetch', fetchMock);
    const { availabilityApi } = await import('./schedulingApi');

    await availabilityApi.create({ locationId: '1', startAt: '2026-10-01T08:00', endAt: '2026-10-01T09:00' });

    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8080/api/v1/professional/availability-blocks', expect.objectContaining({
      method: 'POST', body: JSON.stringify({ locationId: '1', date: '2026-10-01', startTime: '08:00', endTime: '09:00' }),
    }));
  });
});
