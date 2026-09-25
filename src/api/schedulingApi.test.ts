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
});
