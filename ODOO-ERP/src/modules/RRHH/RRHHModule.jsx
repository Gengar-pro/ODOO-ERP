import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { Users, Clock, LogIn, LogOut, FileText, Palmtree } from 'lucide-react';

export default function RRHHModule() {
  const { rrhh, registrarChecador, addNotification } = useContext(AppContext);
  const [selectedEmployee, setSelectedEmployee] = useState(rrhh[0]?.id || '');
  const [vacationEmployee, setVacationEmployee] = useState(rrhh[0]?.id || '');
  const [vacationDays, setVacationDays] = useState(5);

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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px' }}>
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
    </div>
  );
}
