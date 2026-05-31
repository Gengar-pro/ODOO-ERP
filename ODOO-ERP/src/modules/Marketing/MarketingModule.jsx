import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { Megaphone, Mail, Phone, Users, Rocket, Award } from 'lucide-react';

export default function MarketingModule() {
  const { campanas, dispararCampana, pacientes } = useContext(AppContext);
  const [nombre, setNombre] = useState('Prevención de Influenza Otoño');
  const [tipo, setTipo] = useState('SMS');
  const [segmento, setSegmento] = useState('Pacientes con Metformina (Diabetes)');

  const handleLaunch = (e) => {
    e.preventDefault();
    dispararCampana(nombre, tipo, segmento);
  };

  // Filter patients based on chosen segment to show target count
  const getTargetCount = (seg) => {
    if (seg.includes('Metformina')) {
      return pacientes.filter(p => p.tratamiento.includes('Metformina')).length;
    }
    if (seg.includes('Hipertensos') || seg.includes('Losartán')) {
      return pacientes.filter(p => p.tratamiento.includes('Losartán')).length;
    }
    return pacientes.length; // General public
  };

  return (
    <div>
      <div className="dashboard-grid">
        <div className="card">
          <div className="card-title">Campañas de Salud Disparadas</div>
          <div className="card-value">{campanas.length}</div>
          <div className="card-desc" style={{ color: 'var(--primary)' }}>
            <Megaphone size={14} /> SMS y Email automatizados
          </div>
        </div>
        <div className="card">
          <div className="card-title">Total Interacciones de Clientes</div>
          <div className="card-value">
            {campanas.reduce((sum, c) => sum + c.clics, 0)} clics
          </div>
          <div className="card-desc positive">
            <Award size={14} /> Tasa promedio del 14.5%
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px' }}>
        {/* Campaign List */}
        <div className="card">
          <h3 style={{ marginBottom: '16px' }}>Consola de Automatización de Campañas de Salud</h3>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Campaña</th>
                  <th>Medio</th>
                  <th>Segmento Clínico</th>
                  <th>Fecha Envío</th>
                  <th>Clics/Lecturas</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {campanas.map(c => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: '700' }}>{c.nombre}</td>
                    <td>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
                        {c.tipo === 'SMS' ? <Phone size={12} /> : <Mail size={12} />}
                        {c.tipo}
                      </span>
                    </td>
                    <td>{c.segmento}</td>
                    <td>{c.fecha}</td>
                    <td style={{ fontWeight: '700' }}>{c.clics} interacciones</td>
                    <td>
                      <span className={`status-badge ${
                        c.estado === 'Enviado' ? 'badge-success' : 'badge-warning'
                      }`}>
                        {c.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Campaign Scheduler */}
        <div className="card">
          <h4 style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Rocket size={18} style={{ color: 'var(--primary)' }} />
            <span>Programar Nueva Campaña</span>
          </h4>
          <form onSubmit={handleLaunch}>
            <div className="form-group">
              <label className="form-label">Nombre de Campaña</label>
              <input
                type="text"
                className="form-control"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Tipo de Campaña</label>
              <select 
                className="form-control"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
              >
                <option value="SMS">SMS Directo (Mayor Lectura)</option>
                <option value="Email">Boletín Clínico por Email</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Segmento del Paciente CRM</label>
              <select 
                className="form-control"
                value={segmento}
                onChange={(e) => setSegmento(e.target.value)}
              >
                <option value="Pacientes con Metformina (Diabetes)">Pacientes con Diabetes (Metformina)</option>
                <option value="Pacientes Crónicos (Hipertensos)">Pacientes con Hipertensión (Losartán)</option>
                <option value="Base de Pacientes Completa">Base de Pacientes Completa</option>
              </select>
            </div>

            <div style={{
              padding: '12px',
              borderRadius: '8px',
              backgroundColor: 'var(--bg-main)',
              border: '1px dashed var(--border)',
              fontSize: '12px',
              marginBottom: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span>Pacientes objetivo en base:</span>
              <span style={{ fontWeight: '800', color: 'var(--primary-hover)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Users size={12} />
                {getTargetCount(segmento)} pacientes
              </span>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Disparar Campaña
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
