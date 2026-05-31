import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { KeyRound, ShieldAlert, Sparkles, UserCheck } from 'lucide-react';

export default function Login() {
  const { login } = useContext(AppContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const res = login(username, password);
      setLoading(false);
      if (!res.success) {
        setError(res.message);
      }
    }, 800);
  };

  const handleQuickLogin = (demoUser, demoPass) => {
    setUsername(demoUser);
    setPassword(demoPass);
  };

  const credentials = [
    { label: 'Administrador (Todo)', user: 'admin', pass: 'admin', color: '#00E5FF' },
    { label: 'Regente Farmacéutico', user: 'farmacia', pass: 'farma789', color: '#00E676' },
    { label: 'Contador General', user: 'contas', pass: 'contas123', color: '#FFD600' },
    { label: 'Recursos Humanos', user: 'RRHH', pass: 'RRHH', color: '#29B6F6' },
    { label: 'Encargado Almacén', user: 'stock', pass: 'stock456', color: '#FF5252' },
    { label: 'Marketing y Web', user: 'market', pass: 'market321', color: '#E040FB' }
  ];

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <span>Pharma-Sync</span> ERP
          </div>
          <p className="login-subtitle">Sistema Integrado de Farmacia Modular</p>
        </div>

        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(255, 82, 82, 0.1)',
            border: '1px solid var(--danger)',
            padding: '12px',
            borderRadius: '8px',
            color: 'var(--danger)',
            fontSize: '13px',
            marginBottom: '20px'
          }}>
            <ShieldAlert size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Usuario</label>
            <input
              type="text"
              className="form-control"
              placeholder="Ingrese su usuario..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              placeholder="Ingrese su contraseña..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', height: '44px', marginTop: '10px' }}
            disabled={loading}
          >
            {loading ? (
              <span className="skeleton-box" style={{ width: '50px', height: '14px' }}></span>
            ) : (
              <>
                <KeyRound size={18} />
                <span>Ingresar al Sistema</span>
              </>
            )}
          </button>
        </form>

        <div className="demo-credentials">
          <div className="demo-credentials-title">
            <Sparkles size={12} style={{ marginRight: '6px', color: 'var(--primary)' }} />
            Acceso Rápido Demo (Haz clic para auto-rellenar):
          </div>
          <div className="demo-grid">
            {credentials.map((cred, idx) => (
              <div
                key={idx}
                className="demo-item"
                onClick={() => handleQuickLogin(cred.user, cred.pass)}
                style={{
                  borderLeft: `3px solid ${cred.color}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px'
                }}
              >
                <span style={{ fontWeight: '700', fontSize: '10px' }}>{cred.label}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '9px' }}>
                  {cred.user} / {cred.pass}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
