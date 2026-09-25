import React, { useEffect, useState } from 'react';
import { User as UserIcon, Mail, Phone, Lock, Eye, EyeOff, FileText, ShieldCheck, ArrowLeft } from 'lucide-react';
import { User } from '../types';
import { authErrorMessage, register } from '../auth/authApi';
import { catalogsApi } from '../api/schedulingApi';
import type { CatalogItem } from '../types';

interface RegisterScreenProps {
  onRegisterSuccess: (user: User) => void;
  onNavigateLogin: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onRegisterSuccess,
  onNavigateLogin,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [documentType, setDocumentType] = useState('CC');
  const [documentNumber, setDocumentNumber] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [insurancePlanId, setInsurancePlanId] = useState('');
  const [insurancePlans, setInsurancePlans] = useState<CatalogItem[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    catalogsApi.insurancePlans().then(setInsurancePlans).catch(() => setInsurancePlans([]));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !documentType || !documentNumber || !email || !phone || !password) {
      setErrorMessage('Por favor completa los campos obligatorios.');
      return;
    }
    if (!acceptTerms) {
      setErrorMessage('Debes aceptar el tratamiento confidencial de datos de salud.');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);
    try {
      const user = await register({
        firstName,
        lastName,
        documentType,
        documentNumber,
        email,
        phone,
        password,
        ...(insurancePlanId ? { insurancePlanId } : {}),
      });
      onRegisterSuccess(user);
    } catch (error) {
      setErrorMessage(authErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main
      className="w-full max-w-5xl bg-white rounded-3xl shadow-xl shadow-slate-200/70 border border-slate-100 overflow-hidden my-auto"
      data-purpose="register-card-container"
      id="register-main-container"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[680px]">
        {/* Left Editorial Panel */}
        <section
          className="lg:col-span-5 p-4 md:p-5 flex flex-col"
          data-purpose="editorial-branding-panel"
          id="register-editorial-panel"
        >
          <div className="relative w-full h-full bg-gradient-to-b from-[#07152B] via-[#0A1F3E] to-[#0E2952] rounded-2xl overflow-hidden p-8 sm:p-10 flex flex-col justify-between text-white border border-slate-800/40">
            <div className="relative z-10 space-y-4">
              <div
                id="register-feature-pill"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-xs font-medium text-blue-200 backdrop-blur-md"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Registro rápido • Cobertura médica integral</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white leading-snug">
                Tu salud y bienestar en las mejores manos
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light">
                Regístrate, consulta profesionales disponibles y solicita tu cita desde un solo lugar.
              </p>

              <div className="pt-2 space-y-2.5 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">✓</div>
                  <span>Agenda por sede, especialidad y horario</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">✓</div>
                  <span>Confirmación inmediata del estado de tu solicitud</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">✓</div>
                  <span>Profesionales y horarios consultados en tiempo real</span>
                </div>
              </div>
            </div>

            {/* Editorial Conceptual 3D Image */}
            <div
              className="relative mt-6 -mb-10 -mx-6 sm:-mx-8 flex justify-center items-end"
              data-purpose="conceptual-visual"
              id="register-conceptual-visual"
            >
              <div className="absolute inset-0 bg-blue-500/15 rounded-full filter blur-3xl pointer-events-none transform -translate-y-6"></div>
              <img
                id="register-glass-image"
                alt="Calendario médico translúcido editorial"
                className="relative z-10 w-full max-h-[300px] object-cover object-top visual-image-mask drop-shadow-2xl select-none pointer-events-none opacity-90"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnkebvjTzdh3ta8B2gR0PdMFQQ2VjzYFr9gZvA_ay2_eaOtaLzR0yQS5o9r-3xt3OsJPfnE2G2PECJ5DVawKJ2ITtroIRVLhq2Y_J_K9EOgQFRq7PLWDnw1x_aiL2BvX-GxeFbzzgVKspZHGS1qYTS6PHBqJ1d5upBpoaLptAW0d1NKh37PNmcYfbGDI4BDd8WooB745FZ44DbtHB42v7dyTuW1-sdjGVj-dzWP93Ni2zxXYJTdX_SLg"
              />
            </div>
          </div>
        </section>

        {/* Right Form Panel */}
        <section
          className="lg:col-span-7 px-8 py-8 sm:px-12 sm:py-10 flex flex-col justify-between bg-white"
          data-purpose="register-form-panel"
          id="register-form-panel"
        >
          <div>
            {/* Header with back navigation & brand */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-600 to-sky-400 flex items-center justify-center shadow-md shadow-blue-500/20">
                  <svg
                    className="w-4 h-4 text-white"
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
                  <span className="text-sm font-bold tracking-tight text-slate-900 block leading-tight">
                    Portal de Citas
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
                    Nuevo Paciente
                  </span>
                </div>
              </div>

              <button
                type="button"
                id="back-to-login-btn"
                onClick={onNavigateLogin}
                className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Volver al Login</span>
              </button>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                Registrarse como Paciente
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">
                Completa tus datos para agendar citas y gestionar tu salud de manera centralizada.
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit} id="register-form">
              {errorMessage && (
                <div
                  id="register-error-alert"
                  role="alert"
                  className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl"
                >
                  {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
                  htmlFor="reg-first-name"
                >
                  Nombres *
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <UserIcon className="h-4 w-4" strokeWidth={1.8} />
                  </div>
                  <input
                    className="input-transition block w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    id="reg-first-name"
                    placeholder="Ej. Carmen"
                    required
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="reg-last-name">
                  Apellidos *
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <UserIcon className="h-4 w-4" strokeWidth={1.8} />
                  </div>
                  <input className="input-transition block w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    id="reg-last-name" placeholder="Ej. Rodríguez Silva" required type="text"
                    value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
              </div>
              </div>

              {/* Grid: Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
                    htmlFor="reg-email"
                  >
                    Correo Electrónico *
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="h-4 w-4" strokeWidth={1.8} />
                    </div>
                    <input
                      className="input-transition block w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      id="reg-email"
                      placeholder="carmen@ejemplo.com"
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label
                    className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
                    htmlFor="reg-phone"
                  >
                    Teléfono Móvil *
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Phone className="h-4 w-4" strokeWidth={1.8} />
                    </div>
                    <input
                      className="input-transition block w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      id="reg-phone"
                      placeholder="+34 612 000 000"
                    required
                    type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Documento de identidad */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
                    htmlFor="reg-document-type"
                  >
                    Tipo de Documento *
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <FileText className="h-4 w-4" strokeWidth={1.8} />
                    </div>
                    <select
                      className="input-transition block w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      id="reg-document-type" required value={documentType}
                      onChange={(e) => setDocumentType(e.target.value)}>
                      <option value="CC">Cédula de ciudadanía</option>
                      <option value="CE">Cédula de extranjería</option>
                      <option value="PA">Pasaporte</option>
                      <option value="TI">Tarjeta de identidad</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
                    htmlFor="reg-document-number"
                  >
                    Número de Documento *
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <FileText className="h-4 w-4" strokeWidth={1.8} />
                    </div>
                    <input
                      className="input-transition block w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      id="reg-document-number" placeholder="Ej. 1098765432"
                      required
                      type="text" value={documentNumber}
                      onChange={(e) => setDocumentNumber(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="reg-password">
                  Contraseña *
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4 w-4" strokeWidth={1.8} />
                  </div>
                  <input className="input-transition block w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    id="reg-password" placeholder="Mínimo 8 caracteres" required minLength={8}
                    type={showPassword ? 'text' : 'password'} value={password}
                    onChange={(e) => setPassword(e.target.value)} />
                  <button type="button" aria-label="Alternar visibilidad de contraseña" id="reg-toggle-pwd"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none">
                    {showPassword ? <EyeOff className="h-4 w-4" strokeWidth={1.8} /> : <Eye className="h-4 w-4" strokeWidth={1.8} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="reg-insurance-plan">
                  Plan de afiliación (opcional)
                </label>
                <select id="reg-insurance-plan" value={insurancePlanId} onChange={(event) => setInsurancePlanId(event.target.value)} className="input-transition block w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                  <option value="">Sin afiliación por ahora</option>
                  {insurancePlans.map((plan) => <option key={plan.id} value={plan.id}>{plan.name}</option>)}
                </select>
              </div>

              {/* Consent checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer select-none text-xs text-slate-600">
                  <input
                    className="w-4 h-4 mt-0.5 rounded text-blue-600 focus:ring-blue-500/25 border-slate-300 transition-colors"
                    id="accept-terms"
                    name="accept-terms"
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                  />
                  <span>
                    He leído y acepto el consentimiento de privacidad y resguardo seguro de datos médicos conforme a la legislación vigente.
                  </span>
                </label>
              </div>

              {/* Submit CTA */}
              <button
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-sm rounded-xl shadow-sm hover:shadow-md shadow-blue-500/15 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-2 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                id="submit-register-btn"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Creando expediente digital...</span>
                  </>
                ) : (
                  <span>Registrarme y Acceder</span>
                )}
              </button>
            </form>
          </div>

          {/* Footer note */}
          <div className="pt-5 mt-4 border-t border-slate-100 text-center space-y-2">
            <p className="text-xs text-slate-600">
              ¿Ya estás registrado?{' '}
              <button
                type="button"
                id="login-redirect-btn"
                onClick={onNavigateLogin}
                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors ml-1 cursor-pointer bg-transparent border-0 p-0"
              >
                Inicia sesión aquí
              </button>
            </p>
            <div className="flex items-center justify-center gap-1.5 text-slate-400 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              <span>Certificado bajo estándares de seguridad médica internacional.</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};
