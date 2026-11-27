import { useState, type FormEvent } from 'react';
import { type AuthUser, loginRequest } from '../../services/auth.api';
import logoEcoPartes from '../../assets/Logo-EcoPartesTech.svg';
import heroFrenos from '../../assets/DiscosLogin.svg';
import fondoTaller from '../../assets/FondoTaller.svg';
import logoEcoPartesClaro from '../../assets/Logo-EcoPartesTech--claro.svg';
import './LoginView.css';

interface LoginViewProps {
  onLoginSuccess?: (user: AuthUser) => void;
}

export function LoginView({ onLoginSuccess }: LoginViewProps) {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await loginRequest({
        usuario: usuario.trim(),
        password,
      });
      setUser(response.usuario);
      onLoginSuccess?.(response.usuario);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'No fue posible iniciar sesión',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <section
        className="login-hero"
        style={{ backgroundImage: `url(${fondoTaller})` }}
        aria-label="Presentación de EcoPartes Tech"
      >
        <div className="login-hero-overlay" aria-hidden="true" />

        <div className="login-hero-content">
          <h1 className="login-hero-title">
            Repuestos
            <br />
            que mantienen
            <br />
            tu camino seguro
          </h1>
          <span className="login-hero-bar" aria-hidden="true" />
        </div>

        <img
          src={heroFrenos}
          alt="Discos de freno de precisión EcoPartes Tech"
          className="login-hero-discs"
        />

        <div className="login-hero-accent" aria-hidden="true" />
      </section>

      <main className="login-panel">
        <img
          src={logoEcoPartesClaro}
          alt=""
          aria-hidden="true"
          className="login-panel-watermark"
        />

        <div className="login-card">
          <header className="login-brand">
            <img
              src={logoEcoPartes}
              alt="Logo EcoPartes Tech"
              className="login-logo-img"
            />
            <div className="login-brand-text">
              <div className="login-brand-name">
                <span className="brand-dark">EcoPartes</span>{' '}
                <span className="brand-green">Tech</span>
              </div>
              <p className="login-brand-subtitle">Gestión de frenos</p>
            </div>
          </header>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <div className="login-field">
              <label htmlFor="usuario">Usuario</label>
              <input
                id="usuario"
                name="usuario"
                type="text"
                autoComplete="username"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="login-field">
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            {error && (
              <div className="login-alert login-alert-error" role="alert">
                {error}
              </div>
            )}

            {user && (
              <div className="login-alert login-alert-success" role="status">
                Bienvenido, <strong>{user.usuario}</strong> (Rol: {user.rol})
              </div>
            )}

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}