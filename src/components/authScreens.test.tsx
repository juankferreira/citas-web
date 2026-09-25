import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LoginScreen } from './LoginScreen';
import { RegisterScreen } from './RegisterScreen';
import * as auth from '../auth/authApi';

vi.mock('../auth/authApi', async (original) => {
  const actual = await original<typeof import('../auth/authApi')>();
  return { ...actual, login: vi.fn(), register: vi.fn() };
});

vi.mock('../api/schedulingApi', async (original) => {
  const actual = await original<typeof import('../api/schedulingApi')>();
  return { ...actual, catalogsApi: { ...actual.catalogsApi, insurancePlans: vi.fn().mockResolvedValue([]) } };
});

describe('pantallas de autenticación', () => {
  beforeEach(() => vi.clearAllMocks());

  it('envía las credenciales y muestra el resultado de un login válido', async () => {
    const user = userEvent.setup();
    const account = { id: '1', name: 'Ana', email: 'ana@example.com', roles: ['USER'] };
    vi.mocked(auth.login).mockResolvedValue(account);
    const onSuccess = vi.fn();
    render(<LoginScreen onLoginSuccess={onSuccess} onNavigateRegister={vi.fn()} />);

    await user.type(screen.getByLabelText(/correo electrónico/i), 'ana@example.com');
    await user.type(screen.getByLabelText(/^contraseña$/i), 'Password123*');
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    expect(auth.login).toHaveBeenCalledWith('ana@example.com', 'Password123*', true);
    expect(onSuccess).toHaveBeenCalledWith(account);
  });

  it('muestra un error genérico de credenciales sin revelar el campo incorrecto', async () => {
    const user = userEvent.setup();
    vi.mocked(auth.login).mockRejectedValue(new auth.AuthApiError(401, 'detalle servidor'));
    render(<LoginScreen onLoginSuccess={vi.fn()} onNavigateRegister={vi.fn()} />);

    await user.type(screen.getByLabelText(/correo electrónico/i), 'ana@example.com');
    await user.type(screen.getByLabelText(/^contraseña$/i), 'incorrecta');
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent('El correo, la contraseña o la sesión no son válidos.');
  });

  it('envía el registro mínimo completo al API', async () => {
    const user = userEvent.setup();
    const account = { id: '2', name: 'Ana Ruiz', email: 'ana@example.com', phone: '3001234567', roles: ['USER'] };
    vi.mocked(auth.register).mockResolvedValue(account);
    const onSuccess = vi.fn();
    render(<RegisterScreen onRegisterSuccess={onSuccess} onNavigateLogin={vi.fn()} />);

    await user.type(screen.getByLabelText(/nombres/i), 'Ana');
    await user.type(screen.getByLabelText(/apellidos/i), 'Ruiz');
    await user.type(screen.getByLabelText(/correo electrónico/i), 'ana@example.com');
    await user.type(screen.getByLabelText(/teléfono móvil/i), '3001234567');
    await user.type(screen.getByLabelText(/número de documento/i), '123456');
    await user.type(screen.getByLabelText(/^contraseña/i), 'Password123*');
    await user.click(screen.getByRole('button', { name: /registrarme y acceder/i }));

    expect(auth.register).toHaveBeenCalledWith(expect.objectContaining({
      firstName: 'Ana', lastName: 'Ruiz', documentType: 'CC', documentNumber: '123456',
      email: 'ana@example.com', phone: '3001234567', password: 'Password123*',
    }));
    expect(onSuccess).toHaveBeenCalledWith(account);
  }, 15000);

  it('carga los planes del API y envía el ID del plan elegido durante el registro', async () => {
    const user = userEvent.setup();
    const { catalogsApi } = await import('../api/schedulingApi');
    vi.mocked(catalogsApi.insurancePlans).mockResolvedValue([{ id: '23', name: 'Plan Salud' }]);
    vi.mocked(auth.register).mockResolvedValue({ id: '3', name: 'Ana Ruiz', email: 'ana@example.com', roles: ['USER'] });
    render(<RegisterScreen onRegisterSuccess={vi.fn()} onNavigateLogin={vi.fn()} />);

    await user.type(screen.getByLabelText(/nombres/i), 'Ana');
    await user.type(screen.getByLabelText(/apellidos/i), 'Ruiz');
    await user.type(screen.getByLabelText(/correo electrónico/i), 'ana@example.com');
    await user.type(screen.getByLabelText(/teléfono móvil/i), '3001234567');
    await user.type(screen.getByLabelText(/número de documento/i), '123457');
    await user.type(screen.getByLabelText(/^contraseña/i), 'Password123*');
    await screen.findByRole('option', { name: 'Plan Salud' });
    await user.selectOptions(screen.getByLabelText(/plan de afiliación/i), '23');
    await user.click(screen.getByRole('button', { name: /registrarme y acceder/i }));

    expect(catalogsApi.insurancePlans).toHaveBeenCalledOnce();
    expect(auth.register).toHaveBeenCalledWith(expect.objectContaining({ insurancePlanId: '23' }));
  }, 15000);
});
