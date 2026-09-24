import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { User } from '../types';
import { authErrorMessage, login } from '../auth/authApi';

interface LoginScreenProps {
  onLoginSuccess: (user: User) => void;
  onNavigateRegister: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onNavigateRegister,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const user = await login(email, password, rememberMe);
      onLoginSuccess(user);
    } catch (error) {
      setErrorMessage(authErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main
      className="w-full max-w-5xl bg-white rounded-3xl shadow-xl shadow-slate-200/70 border border-slate-100 overflow-hidden my-auto"
      data-purpose="auth-card-container"
      id="login-main-container"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[680px]">
        {/* BEGIN: LeftVisualEditorialPanel */}
        <section
          className="lg:col-span-6 p-4 md:p-5 flex flex-col"
          data-purpose="editorial-branding-panel"
          id="editorial-branding-panel"
        >
          <div className="relative w-full h-full bg-gradient-to-b from-[#07152B] via-[#0A1F3E] to-[#0E2952] rounded-2xl overflow-hidden p-8 sm:p-10 flex flex-col justify-between text-white border border-slate-800/40">
            {/* Editorial Header & Text */}
            <div className="relative z-10 space-y-4">
              {/* Discretionary feature pill */}
              <div
                id="feature-pill-badge"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-xs font-medium text-blue-200 backdrop-blur-md"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                <span>Agenda inteligente • Recordatorios en tiempo real</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white leading-snug">
                Gestiona tus citas con claridad y confianza
              </h1>

              {/* Editorial Subtitle */}
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-md font-light">
                Tu bienestar organizado en un solo lugar con atención médica oportuna y personalizada.
              </p>
            </div>

            {/* Editorial Conceptual 3D Image */}
            <div
              className="relative mt-8 -mb-10 -mx-6 sm:-mx-8 flex justify-center items-end"
              data-purpose="conceptual-visual"
              id="conceptual-visual"
            >
              {/* Ambient glow behind graphic */}
              <div className="absolute inset-0 bg-blue-500/15 rounded-full filter blur-3xl pointer-events-none transform -translate-y-6"></div>
              <img
                id="glass-calendar-image"
                alt="Visual editorial conceptual de calendario médico translúcido sostenido con precisión"
                className="relative z-10 w-full max-h-[380px] object-cover object-top visual-image-mask drop-shadow-2xl select-none pointer-events-none"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnkebvjTzdh3ta8B2gR0PdMFQQ2VjzYFr9gZvA_ay2_eaOtaLzR0yQS5o9r-3xt3OsJPfnE2G2PECJ5DVawKJ2ITtroIRVLhq2Y_J_K9EOgQFRq7PLWDnw1x_aiL2BvX-GxeFbzzgVKspZHGS1qYTS6PHBqJ1d5upBpoaLptAW0d1NKh37PNmcYfbGDI4BDd8WooB745FZ44DbtHB42v7dyTuW1-sdjGVj-dzWP93Ni2zxXYJTdX_SLg"
              />
            </div>
          </div>
        </section>
        {/* END: LeftVisualEditorialPanel */}

        {/* BEGIN: RightAuthFormPanel */}
        <section
          className="lg:col-span-6 px-8 py-10 sm:px-12 sm:py-12 md:px-14 flex flex-col justify-between bg-white"
          data-purpose="login-form-panel"
          id="login-form-panel"
        >
          {/* Top Segment: Brand Identity and Header */}
          <div>
            {/* Abstract Geometric Isotype & Category */}
            <div className="flex items-center gap-3 mb-8" data-purpose="brand-logo" id="brand-logo-header">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-600 to-sky-400 flex items-center justify-center shadow-md shadow-blue-500/20">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.2"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
              <div>
                <span className="text-base font-bold tracking-tight text-slate-900 block leading-tight">
                  Portal de Citas
                </span>
                <span className="text-xs text-slate-400 font-medium tracking-wide uppercase">
                  Acceso Seguro
                </span>
              </div>
            </div>

            {/* Section Headings */}
            <div className="mb-8" id="login-heading-group">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Iniciar Sesión
              </h2>
              <p className="text-slate-500 text-sm mt-1.5">
                Ingresa tus credenciales para administrar tus citas médicas programadas.
              </p>
            </div>

            {/* Login Form */}
            <form
              className="space-y-5"
              data-purpose="login-credentials-form"
              onSubmit={handleSubmit}
              id="login-form"
            >
              {errorMessage && (
                <div
                  id="login-error-alert"
                  role="alert"
                  className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl"
                >
                  {errorMessage}
                </div>
              )}

              {/* Email Input Field */}
              <div>
                <label
                  className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2"
                  htmlFor="email"
                >
                  Correo electrónico
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="h-4 w-4" strokeWidth={1.8} />
                  </div>
                  <input
                    className="input-transition block w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    id="email"
                    name="email"
                    placeholder="usuario@ejemplo.com"
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password Input Field */}
              <div>
                <label
                  className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2"
                  htmlFor="password"
                >
                  Contraseña
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4 w-4" strokeWidth={1.8} />
                  </div>
                  <input
                    className="input-transition block w-full pl-10 pr-11 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    id="password"
                    name="password"
                    placeholder="Introduce tu contraseña"
                    required
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {/* Toggle Password Visibility Button */}
                  <button
                    aria-label="Alternar visibilidad de contraseña"
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                    data-purpose="password-visibility-toggle"
                    id="togglePasswordBtn"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" strokeWidth={1.8} />
                    ) : (
                      <Eye className="h-4 w-4" strokeWidth={1.8} />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center text-xs sm:text-sm pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500/25 border-slate-300 transition-colors"
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="text-slate-600 font-normal">Recordar sesión</span>
                </label>
              </div>

              {/* Main Primary CTA Button */}
              <button
                className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-sm rounded-xl shadow-sm hover:shadow-md shadow-blue-500/15 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-2 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                data-purpose="submit-login-button"
                id="submit-login-button"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Accediendo...</span>
                  </>
                ) : (
                  <span>Iniciar Sesión</span>
                )}
              </button>
            </form>

          </div>

          {/* Bottom Segment: Registration Callout & Privacy Safeguard Notice */}
          <div
            className="pt-6 mt-4 border-t border-slate-100 text-center space-y-3"
            data-purpose="footer-links"
            id="login-footer-section"
          >
            <p className="text-xs sm:text-sm text-slate-600">
              ¿No tienes una cuenta?{' '}
              <button
                type="button"
                id="register-redirect-btn"
                onClick={onNavigateRegister}
                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors ml-1 cursor-pointer bg-transparent border-0 p-0"
              >
                Regístrate aquí
              </button>
            </p>

            {/* Security and Privacy Safeguard Note */}
            <div className="flex items-center justify-center gap-1.5 text-slate-400 text-xs">
              <ShieldCheck className="w-4 h-4 flex-shrink-0 text-slate-400" />
              <span className="text-[11px] leading-tight text-slate-400">
                Tus datos médicos y personales están protegidos con cifrado de extremo a extremo.
              </span>
            </div>
          </div>
        </section>
        {/* END: RightAuthFormPanel */}
      </div>
    </main>
  );
};
