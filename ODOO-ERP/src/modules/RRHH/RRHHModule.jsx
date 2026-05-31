import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { Users, Clock, LogIn, LogOut, FileText, Palmtree, UserCheck, ShieldAlert, Plus, Trash2 } from 'lucide-react';

export default function RRHHModule() {
  const { rrhh, registrarChecador, addNotification, currentUser, usersList, setUsersList } = useContext(AppContext);
  const [selectedEmployee, setSelectedEmployee] = useState(rrhh[0]?.id || '');
  const [vacationEmployee, setVacationEmployee] = useState(rrhh[0]?.id || '');
  const [vacationDays, setVacationDays] = useState(5);

  // New Account states
  const [newAccName, setNewAccName] = useState('');
  const [newAccUser, setNewAccUser] = useState('');
  const [newAccPass, setNewAccPass] = useState('');
  const [newAccRole, setNewAccRole] = useState('Contador');
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  const handlePunchClock = (action) => {
    registrarChecador(selectedEmployee, action);
  };

  const handleRequestVacation = (e) => {
    e.preventDefault();
    const emp = rrhh.find(e => e.id === vacationEmployee);
    if (!emp) return;

    if (emp.vacacionesDisponibles < vacationDays) {
      addNotification('danger', `RRHH: Días solicitados superan el saldo disponible de ${emp.nombre} (${emp.vacacionesDisponibles} días).`);
      return;
    }

    addNotification('success', `RRHH: Solicitud de vacaciones aprobada para ${emp.nombre} por ${vacationDays} días.`);
    alert(`Licencia Aprobada:\n\nColaborador: ${emp.nombre}\nDías Solicitados: ${vacationDays}\nSaldo Restante: ${emp.vacacionesDisponibles - vacationDays} días.`);
  };

  const handleCreateAccount = (e) => {
    e.preventDefault();
    if (!newAccName.trim() || !newAccUser.trim() || !newAccPass.trim()) {
      alert('Por favor complete todos los campos.');
      return;
    }

    if (usersList.some(u => u.username.toLowerCase() === newAccUser.toLowerCase())) {
      alert('El nombre de usuario de acceso ya está registrado.');
      return;
    }

    // Role-modules mapping
    const roleModulesMap = {
      'Administrador': ['CRM', 'Ventas', 'Contabilidad', 'Inventario', 'Compras', 'Manufactura', 'RRHH', 'Punto de Venta', 'Sitio Web', 'Marketing', 'Proyectos', 'Mesa de Ayuda'],
      'Recursos Humanos': ['RRHH', 'Proyectos', 'Mesa de Ayuda'],
      'Contador': ['Contabilidad', 'Ventas', 'Compras', 'CRM'],
      'Regente Farmacéutico': ['Punto de Venta', 'Inventario', 'Manufactura', 'Mesa de Ayuda'],
      'Encargado de Almacén': ['Inventario', 'Compras'],
      'Especialista en Marketing': ['Marketing', 'Sitio Web', 'CRM'],
      'Cliente': ['Sitio Web', 'Mesa de Ayuda']
    };

    const newUser = {
      name: newAccName,
      username: newAccUser,
      password: newAccPass,
      role: newAccRole,
      modules: roleModulesMap[newAccRole] || ['Sitio Web']
    };

    setUsersList(prev => [...prev, newUser]);
    addNotification('success', `RRHH: Cuenta para "${newAccName}" creada con rol "${newAccRole}" exitosamente.`);
    
    // Reset form
    setNewAccName('');
    setNewAccUser('');
    setNewAccPass('');
    setShowAddUserModal(false);
  };

  const handleDeleteAccount = (usernameToDelete) => {
    if (usernameToDelete.toLowerCase() === currentUser.username.toLowerCase()) {
      alert('No puedes eliminar tu propia cuenta activa.');
      return;
    }

    const accountObj = usersList.find(u => u.username === usernameToDelete);
    if (!accountObj) return;

    if (currentUser.role === 'Recursos Humanos' && accountObj.role === 'Administrador') {
      alert('Permiso denegado: El personal de RRHH no puede eliminar cuentas de Administradores.');
      return;
    }

    if (window.confirm(`¿Está seguro de eliminar permanentemente la cuenta de ${accountObj.name}?`)) {
      setUsersList(prev => prev.filter(u => u.username !== usernameToDelete));
      addNotification('info', `RRHH: Cuenta de ${accountObj.name} eliminada permanentemente.`);
    }
  };

  const isManager = currentUser.role === 'Administrador' || currentUser.role === 'Recursos Humanos';

  return (
    <div>
      <div className="dashboard-grid">
        <div className="card">
          <div className="card-title">Plantilla de Personal</div>
          <div className="card-value">{rrhh.length}</div>
          <div className="card-desc" style={{ color: 'var(--primary)' }}>
            <Users size={14} /> Colaboradores activos
          </div>
        </div>
        <div className="card">
          <div className="card-title">Colaboradores Marcados "Dentro"</div>
          <div className="card-value">
            {rrhh.filter(e => e.asistencia === 'Dentro').length}
          </div>
          <div className="card-desc positive">
            <Clock size={14} /> Reloj checador sincronizado
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', marginBottom: '20px' }}>
        {/* Employee Directory list */}
        <div className="card">
          <h3 style={{ marginBottom: '16px' }}>Directorio de Colaboradores y Control Asistencia</h3>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Cargo</th>
                  <th>Estado</th>
                  <th>Hora Entrada</th>
                  <th>Vacaciones Restantes</th>
                </tr>
              </thead>
              <tbody>
                {rrhh.map(e => (
                  <tr key={e.id}>
                    <td style={{ fontWeight: '700' }}>{e.nombre}</td>
                    <td>{e.rol}</td>
                    <td>
                      <span className={`status-badge ${
                        e.asistencia === 'Dentro' ? 'badge-success' : 'badge-danger'
                      }`}>
                        {e.asistencia === 'Dentro' ? 'En Turno' : 'Fuera'}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'monospace' }}>{e.checkInTime || '—'}</td>
                    <td style={{ fontWeight: '700' }}>{e.vacacionesDisponibles} días</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Punch Clock and Vacations controllers */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card">
            <h4 style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} style={{ color: 'var(--primary)' }} />
              <span>Reloj Checador Biométrico</span>
            </h4>
            <div className="form-group">
              <label className="form-label">Seleccionar Colaborador</label>
              <select 
                className="form-control"
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
              >
                {rrhh.map(e => (
                  <option key={e.id} value={e.id}>{e.nombre} ({e.rol})</option>
                ))}
              </select>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
              <button 
                onClick={() => handlePunchClock('in')} 
                className="btn btn-primary"
                style={{ backgroundColor: 'var(--success)', color: '#FFFFFF' }}
              >
                <LogIn size={14} />
                <span>Marcar Entrada</span>
              </button>
              <button 
                onClick={() => handlePunchClock('out')} 
                className="btn btn-danger"
              >
                <LogOut size={14} />
                <span>Marcar Salida</span>
              </button>
            </div>
          </div>

          <div className="card">
            <h4 style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Palmtree size={18} style={{ color: 'var(--primary)' }} />
              <span>Solicitud de Vacaciones / Ausencias</span>
            </h4>
            <form onSubmit={handleRequestVacation}>
              <div className="form-group">
                <label className="form-label">Colaborador</label>
                <select 
                  className="form-control"
                  value={vacationEmployee}
                  onChange={(e) => setVacationEmployee(e.target.value)}
                >
                  {rrhh.map(e => (
                    <option key={e.id} value={e.id}>{e.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Días Solicitados</label>
                <input
                  type="number"
                  className="form-control"
                  value={vacationDays}
                  onChange={(e) => setVacationDays(parseInt(e.target.value))}
                  min="1"
                  max="30"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                Aprobar Licencia
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ACCESS USERS CONTROL PANEL (Only for Admins/RRHH managers) */}
      {isManager && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserCheck size={20} style={{ color: 'var(--primary)' }} />
              <span>Gestión de Cuentas de Acceso al ERP</span>
            </h3>
            <button 
              onClick={() => setShowAddUserModal(true)}
              className="btn btn-primary"
              style={{ fontSize: '11px', height: '32px', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <Plus size={12} />
              <span>Crear Cuenta de Acceso</span>
            </button>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Nombre Completo</th>
                  <th>Nombre de Usuario</th>
                  <th>Rol de Acceso</th>
                  <th>Módulos Autorizados</th>
                  <th style={{ textAlign: 'center' }}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map(u => {
                  const isSelf = u.username.toLowerCase() === currentUser.username.toLowerCase();
                  return (
                    <tr key={u.username}>
                      <td style={{ fontWeight: '700', color: 'var(--primary-hover)' }}>{u.name} {isSelf && '(Tú)'}</td>
                      <td style={{ fontFamily: 'monospace' }}>{u.username}</td>
                      <td>
                        <span className={`status-badge ${
                          u.role === 'Administrador' ? 'badge-danger' : u.role === 'Cliente' ? 'badge-success' : 'badge-info'
                        }`} style={{ fontSize: '10px' }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '11px', color: 'var(--text-muted)' }}>
                        {u.modules.join(', ')}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button 
                          onClick={() => handleDeleteAccount(u.username)}
                          className="btn btn-danger"
                          style={{ height: '26px', padding: '0 6px', fontSize: '10px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                          disabled={isSelf}
                        >
                          <Trash2 size={12} />
                          <span>Eliminar</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* POPUP MODAL: Add User access */}
      {showAddUserModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999
        }}>
          <div className="card" style={{ width: '400px', padding: '24px', position: 'relative' }}>
            <button 
              onClick={() => setShowAddUserModal(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X size={18} />
            </button>

            <h3 style={{ marginBottom: '16px' }}>Crear Nueva Cuenta</h3>

            <form onSubmit={handleCreateAccount}>
              <div className="form-group">
                <label className="form-label">Nombre Completo</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ej: Juan Pérez..."
                  value={newAccName}
                  onChange={(e) => setNewAccName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Nombre de Usuario (Acceso)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Cree el usuario..."
                  value={newAccUser}
                  onChange={(e) => setNewAccUser(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contraseña Temporal</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Ingrese contraseña inicial..."
                  value={newAccPass}
                  onChange={(e) => setNewAccPass(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Rol del Sistema</label>
                <select
                  className="form-control"
                  value={newAccRole}
                  onChange={(e) => setNewAccRole(e.target.value)}
                >
                  <option value="Administrador">Administrador</option>
                  <option value="Recursos Humanos">Recursos Humanos</option>
                  <option value="Contador">Contador</option>
                  <option value="Regente Farmacéutico">Regente Farmacéutico</option>
                  <option value="Encargado de Almacén">Encargado de Almacén</option>
                  <option value="Especialista en Marketing">Especialista en Marketing</option>
                  <option value="Cliente">Cliente</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
                <button 
                  onClick={() => setShowAddUserModal(false)}
                  className="btn btn-secondary" 
                  style={{ flex: 1 }}
                  type="button"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ flex: 1 }}
                >
                  Crear Cuenta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
