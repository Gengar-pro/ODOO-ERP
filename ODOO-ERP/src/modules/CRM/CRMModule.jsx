import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { Users, Award, ShieldAlert, HeartHandshake, ArrowRight, X, Eye, Plus, Sparkles } from 'lucide-react';

export default function CRMModule() {
  const { 
    pacientes, 
    setPacientes, 
    addNotification, 
    kanbanItems, 
    setKanbanItems,
    rrhh 
  } = useContext(AppContext);
  
  // Local states for new patient registration
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [tratamiento, setTratamiento] = useState('Ninguno');
  const [email, setEmail] = useState('');

  // Local state for modal interactive popups
  const [selectedCard, setSelectedCard] = useState(null);
  const [showAddCardModal, setShowAddCardModal] = useState(false);

  // Form states for new opportunity card
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardPaciente, setNewCardPaciente] = useState(pacientes[0]?.nombre || '');
  const [newCardMonto, setNewCardMonto] = useState('$15,000');
  const [newCardNivel, setNewCardNivel] = useState('hot');

  const handleAddPatient = (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    const nuevoPaciente = {
      id: (pacientes.length + 1).toString(),
      nombre,
      telefono,
      tratamiento,
      puntos: 10,
      email,
      ultimaCompra: 'Ninguna'
    };

    setPacientes([...pacientes, nuevoPaciente]);
    
    // Automatically add to Kanban board as well!
    const newKanban = {
      id: 'k' + (kanbanItems.length + 1),
      nombre: `Seguimiento de ${nombre}`,
      paciente: nombre,
      monto: tratamiento !== 'Ninguno' ? '$25,000' : '$8,000',
      nivel: tratamiento !== 'Ninguno' ? 'hot' : 'cold',
      etapa: 'Nuevo',
      medico: 'Dr. Eduardo Sotomayor',
      diagnostico: tratamiento !== 'Ninguno' ? `Suscripción medicamento: ${tratamiento}` : 'Revisión preventiva básica'
    };
    setKanbanItems([...kanbanItems, newKanban]);

    setNombre('');
    setTelefono('');
    setTratamiento('Ninguno');
    setEmail('');
    
    addNotification('info', `CRM: Se afilió al paciente ${nombre} y se generó una ficha en el Kanban.`);
  };

  const handleAddKanbanCard = (e) => {
    e.preventDefault();
    if (!newCardTitle.trim()) return;

    const newCard = {
      id: 'k' + (kanbanItems.length + 1),
      nombre: newCardTitle,
      paciente: newCardPaciente,
      monto: newCardMonto,
      nivel: newCardNivel,
      etapa: 'Nuevo',
      medico: rrhh[0]?.nombre || 'Dr. Eduardo Sotomayor',
      diagnostico: 'Detección oportuna y consulta de control'
    };

    setKanbanItems([...kanbanItems, newCard]);
    setNewCardTitle('');
    setShowAddCardModal(false);
    addNotification('success', `CRM: Tarjeta Kanban "${newCardTitle}" agregada al flujo comercial.`);
  };

  const moverKanban = (itemId, nuevaEtapa) => {
    setKanbanItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, etapa: nuevaEtapa } : item
    ));
  };

  const updateCardDetails = (updated) => {
    setKanbanItems(prev => prev.map(item =>
      item.id === updated.id ? updated : item
    ));
    setSelectedCard(updated);
    addNotification('info', `CRM: Ficha médica de ${updated.paciente} actualizada.`);
  };

  const columnas = ['Nuevo', 'Calificado', 'Propuesta', 'Negociación', 'Ganado'];

  return (
    <div>
      {/* CRM Stats Grid */}
      <div className="dashboard-grid">
        <div className="card">
          <div className="card-title">Pacientes Registrados</div>
          <div className="card-value">{pacientes.length}</div>
          <div className="card-desc positive">
            <Users size={14} /> +12 este mes
          </div>
        </div>
        <div className="card">
          <div className="card-title">Puntos de Fidelidad Distribuidos</div>
          <div className="card-value">
            {pacientes.reduce((sum, p) => sum + p.puntos, 0)}
          </div>
          <div className="card-desc" style={{ color: 'var(--primary)' }}>
            <Award size={14} /> Ficha de lealtad activa
          </div>
        </div>
        <div className="card">
          <div className="card-title">Seguimientos de Tratamiento</div>
          <div className="card-value">
            {pacientes.filter(p => p.tratamiento !== 'Ninguno').length}
          </div>
          <div className="card-desc positive">
            <HeartHandshake size={14} /> Monitoreo clínico activo
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px', marginBottom: '24px' }}>
        {/* Kanban Board */}
        <div className="card" style={{ overflowX: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0 }}>Pipeline de Oportunidades CRM</h3>
            <button 
              onClick={() => setShowAddCardModal(true)}
              className="btn btn-primary"
              style={{ height: '32px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <Plus size={12} />
              <span>Añadir Tarjeta</span>
            </button>
          </div>

          <div className="kanban-board">
            {columnas.map(col => {
              const itemsEtapa = kanbanItems.filter(item => item.etapa === col);
              return (
                <div key={col} className="kanban-column">
                  <div className="kanban-header">
                    <span>{col}</span>
                    <span className="kanban-count">{itemsEtapa.length}</span>
                  </div>
                  {itemsEtapa.map(item => (
                    <div 
                      key={item.id} 
                      className="kanban-card"
                      onClick={() => setSelectedCard(item)}
                      style={{ cursor: 'pointer', transition: 'transform 0.2s', border: '1px solid var(--border)' }}
                    >
                      <span className={`kanban-tag ${
                        item.nivel === 'hot' ? 'tag-hot' : item.nivel === 'warm' ? 'tag-warm' : 'tag-cold'
                      }`}>
                        {item.nivel.toUpperCase()}
                      </span>
                      <div className="kanban-card-title">{item.nombre}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Paciente: {item.paciente}</div>
                      <div style={{ fontSize: '13px', fontWeight: '700', marginTop: '6px', color: 'var(--primary-hover)' }}>
                        {item.monto}
                      </div>
                      
                      {/* Step Mover buttons */}
                      <div style={{ display: 'flex', gap: '4px', marginTop: '10px', justifyContent: 'space-between', alignItems: 'center' }} onClick={(e) => e.stopPropagation()}>
                        <button 
                          onClick={() => setSelectedCard(item)}
                          className="btn btn-secondary"
                          style={{ height: '24px', width: '28px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <Eye size={12} />
                        </button>
                        
                        {col !== 'Ganado' && (
                          <button 
                            onClick={() => {
                              const etapas = columnas;
                              const currentIdx = etapas.indexOf(col);
                              moverKanban(item.id, etapas[currentIdx + 1]);
                            }}
                            className="btn btn-secondary"
                            style={{ height: '24px', padding: '0 6px', fontSize: '9px' }}
                          >
                            Avanzar <ArrowRight size={10} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* Add Patient & Active Treatment List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card">
            <h4 style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={16} />
              <span>Afiliar Nuevo Paciente</span>
            </h4>
            <form onSubmit={handleAddPatient}>
              <div className="form-group">
                <label className="form-label">Nombre Completo</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ej. Juan Pérez"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Teléfono</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ej. +591 70000000"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="juan@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Tratamiento de Seguimiento</label>
                <select 
                  className="form-control"
                  value={tratamiento}
                  onChange={(e) => setTratamiento(e.target.value)}
                >
                  <option value="Ninguno">Ninguno</option>
                  <option value="Metformina 850mg (Crónico)">Metformina 850mg (Diabetes)</option>
                  <option value="Losartán 50mg (Crónico)">Losartán 50mg (Hipertensión)</option>
                  <option value="Atorvastatina 20mg (Crónico)">Atorvastatina 20mg (Colesterol)</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                Registrar Paciente
              </button>
            </form>
          </div>

          <div className="card">
            <h4 style={{ marginBottom: '12px' }}>Fichas Médicas Recientes</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
              {pacientes.map(p => (
                <div key={p.id} style={{
                  padding: '10px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--bg-main)',
                  border: '1px solid var(--border)',
                  fontSize: '12px'
                }}>
                  <div style={{ fontWeight: '700' }}>{p.nombre}</div>
                  <div style={{ color: 'var(--text-muted)' }}>{p.telefono}</div>
                  {p.tratamiento !== 'Ninguno' ? (
                    <span className="status-badge badge-info" style={{ marginTop: '4px', fontSize: '9px', padding: '2px 6px' }}>
                      {p.tratamiento}
                    </span>
                  ) : (
                    <span className="status-badge" style={{ marginTop: '4px', fontSize: '9px', padding: '2px 6px', backgroundColor: '#EEE', color: '#555' }}>
                      Sin receta permanente
                    </span>
                  )}
                  <div style={{ fontSize: '10px', fontWeight: '700', marginTop: '6px', color: 'var(--primary-hover)' }}>
                    Puntos Fidelidad: {p.puntos}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* POPUP MODAL: Interactive Card detail & Clinical editor */}
      {selectedCard && (
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
          zIndex: 9999
        }}>
          <div className="card" style={{ width: '450px', padding: '24px', position: 'relative' }}>
            <button 
              onClick={() => setSelectedCard(null)}
              style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Sparkles size={24} style={{ color: 'var(--primary)' }} />
              <h3 style={{ margin: 0 }}>Ficha de Oportunidad CRM</h3>
            </div>

            <div className="form-group">
              <label className="form-label">Nombre del Negocio</label>
              <input
                type="text"
                className="form-control"
                value={selectedCard.nombre}
                onChange={(e) => updateCardDetails({ ...selectedCard, nombre: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div className="form-group">
                <label className="form-label">Paciente</label>
                <input
                  type="text"
                  className="form-control"
                  value={selectedCard.paciente}
                  onChange={(e) => updateCardDetails({ ...selectedCard, paciente: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Presupuesto/Monto</label>
                <input
                  type="text"
                  className="form-control"
                  value={selectedCard.monto}
                  onChange={(e) => updateCardDetails({ ...selectedCard, monto: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Médico Asignado</label>
              <select
                className="form-control"
                value={selectedCard.medico}
                onChange={(e) => updateCardDetails({ ...selectedCard, medico: e.target.value })}
              >
                {rrhh.map(e => (
                  <option key={e.id} value={e.nombre}>{e.nombre} ({e.rol})</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Diagnóstico Clínico / Comentarios</label>
              <textarea
                className="form-control"
                style={{ height: '70px', padding: '8px', fontSize: '12px' }}
                value={selectedCard.diagnostico}
                onChange={(e) => updateCardDetails({ ...selectedCard, diagnostico: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
              <button 
                onClick={() => setSelectedCard(null)} 
                className="btn btn-primary" 
                style={{ width: '100%' }}
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP MODAL: Add Kanban Card */}
      {showAddCardModal && (
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
          zIndex: 9999
        }}>
          <div className="card" style={{ width: '400px', padding: '24px', position: 'relative' }}>
            <button 
              onClick={() => setShowAddCardModal(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X size={18} />
            </button>

            <h3 style={{ marginBottom: '16px' }}>Agregar Ficha al Pipeline</h3>
            <form onSubmit={handleAddKanbanCard}>
              <div className="form-group">
                <label className="form-label">Título del Caso / Empresa</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ej. Farmacia La Paz"
                  value={newCardTitle}
                  onChange={(e) => setNewCardTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Paciente Vinculado</label>
                <select
                  className="form-control"
                  value={newCardPaciente}
                  onChange={(e) => setNewCardPaciente(e.target.value)}
                >
                  {pacientes.map(p => (
                    <option key={p.id} value={p.nombre}>{p.nombre}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div className="form-group">
                  <label className="form-label">Monto Estimado</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newCardMonto}
                    onChange={(e) => setNewCardMonto(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Prioridad / Nivel</label>
                  <select
                    className="form-control"
                    value={newCardNivel}
                    onChange={(e) => setNewCardNivel(e.target.value)}
                  >
                    <option value="hot">HOT (Crítico)</option>
                    <option value="warm">WARM (Medio)</option>
                    <option value="cold">COLD (Bajo)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                <button 
                  onClick={() => setShowAddCardModal(false)}
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
                  Agregar Ficha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
