import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { KeyRound, ShieldAlert } from 'lucide-react';

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
      </div>
    </div>
  );
}
