import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { KeyRound, ShieldAlert, UserPlus } from 'lucide-react';

export default function Login() {
  const { login, usersList, setUsersList } = useContext(AppContext);
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Registration States
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  
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

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (regPassword !== regConfirm) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (usersList.some(u => u.username.toLowerCase() === regUsername.toLowerCase())) {
      setError('El nombre de usuario ya se encuentra registrado.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const newClient = {
        username: regUsername,
        password: regPassword,
        name: regName,
        role: 'Cliente',
        modules: ['Sitio Web', 'Mesa de Ayuda']
      };

      setUsersList(prev => [...prev, newClient]);
      setLoading(false);
      // Auto login newly registered client
      login(regUsername, regPassword);
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

        {!isRegister ? (
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

            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <button 
                type="button" 
                onClick={() => { setIsRegister(true); setError(''); }}
                style={{ border: 'none', background: 'transparent', color: 'var(--primary-hover)', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}
              >
                ¿Eres cliente? Regístrate aquí
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit}>
            <div className="form-group">
              <label className="form-label">Nombre Completo</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ej: Juan Pérez..."
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Usuario de Acceso</label>
              <input
                type="text"
                className="form-control"
                placeholder="Crea tu usuario..."
                value={regUsername}
                onChange={(e) => setRegUsername(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div className="form-group">
                <label className="form-label">Contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Crea una contraseña..."
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirmar</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Repite la contraseña..."
                  value={regConfirm}
                  onChange={(e) => setRegConfirm(e.target.value)}
                  required
                />
              </div>
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
                  <UserPlus size={18} />
                  <span>Crear Cuenta de Cliente</span>
                </>
              )}
            </button>

            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <button 
                type="button" 
                onClick={() => { setIsRegister(false); setError(''); }}
                style={{ border: 'none', background: 'transparent', color: 'var(--primary-hover)', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}
              >
                ¿Ya tienes una cuenta? Inicia Sesión
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
