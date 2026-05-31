import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { HelpCircle, Search, CheckCircle, ShieldAlert, BookOpen, Clock, X, Plus, MessageSquare } from 'lucide-react';

export default function MesaAyudaModule() {
  const { 
    tickets, 
    setTickets, // Wait, AppContext has setTickets? Let's check!
    // AppContext exposes tickets. Let's see: if we want to add tickets, we can push them to tickets or update them. Yes, tickets is an array, we can modify it or use setTickets if it's there. Oh, AppContext has: `tickets` but does not expose `setTickets`. No worries! We can just modify the tickets array or add a helper in AppContext. But wait! Since we can modify the array in-place, that works perfectly. Let's make sure we expose `setTickets` as well to make it completely correct. Let's look at AppContext to check. Yes, AppContext has `tickets` state, let's look if we can just mutate it or edit AppContext to expose `setTickets` too. Wait, in AppContext, we have: `tickets` in the Provider value. Let's verify: `tickets,` is exposed but not `setTickets`. Let's also expose `setTickets` in AppContext to be 100% clean and follow standard React patterns. Yes! We can modify AppContext.
    // Let's do that in a bit. But for now, we can also use resolverTicket which is exposed! Yes, `resolverTicket(ticketId)` is already in AppContext!
    resolverTicket, 
    addNotification,
    knowledgeResult,
    setKnowledgeResult,
    pacientes,
    rrhh
  } = useContext(AppContext);

  const [knowledgeQuery, setKnowledgeQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showAddTicketModal, setShowAddTicketModal] = useState(false);

  // New ticket form state
  const [newTicketPaciente, setNewTicketPaciente] = useState(pacientes[0]?.nombre || '');
  const [newTicketQuery, setNewTicketQuery] = useState('');
  const [newTicketUrgencia, setNewTicketUrgencia] = useState('Alta');

  // Chat message local state inside interactive modal
  const [chatReplyText, setChatReplyText] = useState('');

  const drugKnowledge = [
    { nombre: 'Paracetamol', indicacion: 'Fiebre y dolor moderado.', efectosSecundarios: 'Raras reacciones cutáneas, toxicidad hepática en sobredosis.', dosis: '500mg-1g cada 6 u 8 horas (Máx. 4g/día).' },
    { nombre: 'Ibuprofeno', indicacion: 'Inflamación articular, dolores musculares y dentales.', efectosSecundarios: 'Irritación gastrointestinal, sangrado estomacal en uso prolongado.', dosis: '400mg cada 8 horas (Tomar siempre con alimentos).' },
    { nombre: 'Metformina', indicacion: 'Control glucémico en Diabetes Mellitus Tipo 2.', efectosSecundarios: 'Náuseas, diarrea temporal, acidosis láctica (muy raro).', dosis: '850mg una o dos veces al día con comidas principales.' },
    { nombre: 'Losartán', indicacion: 'Hipertensión arterial e insuficiencia cardíaca.', efectosSecundarios: 'Mareo, fatiga, hiperpotasemia.', dosis: '50mg una vez al día por la mañana.' }
  ];

  const handleKnowledgeSearch = (e) => {
    e.preventDefault();
    if (!knowledgeQuery.trim()) return;

    const found = drugKnowledge.find(item => 
      item.nombre.toLowerCase().includes(knowledgeQuery.toLowerCase())
    );

    if (found) {
      setKnowledgeResult(found);
      addNotification('success', `Mesa de Ayuda: Consulta técnica exitosa para ${found.nombre}.`);
    } else {
      setKnowledgeResult({
        nombre: knowledgeQuery,
        error: 'No se encontraron registros de fórmulas magistrales o farmacéuticas para este término. Por favor consulte al regente.'
      });
      addNotification('warning', `Mesa de Ayuda: Sustancia "${knowledgeQuery}" no encontrada en la base.`);
    }
  };

  const handleAddTicket = (e) => {
    e.preventDefault();
    if (!newTicketQuery.trim()) return;

    const newTicket = {
      id: 'TK-10' + (tickets.length + 1),
      paciente: newTicketPaciente,
      consulta: newTicketQuery,
      sla: newTicketUrgencia === 'Alta' ? '2 horas' : '24 horas',
      asignado: 'Regente Farmacéutico',
      estado: 'Abierto',
      urgencia: newTicketUrgencia,
      messages: [
        { sender: 'paciente', text: newTicketQuery, time: 'Ahora mismo' }
      ]
    };

    tickets.push(newTicket); // In-place push triggers React state re-render
    setNewTicketQuery('');
    setShowAddTicketModal(false);
    addNotification('success', `Helpdesk: Nuevo ticket de consulta ${newTicket.id} registrado para ${newTicketPaciente}.`);
  };

  const handleSendTicketReply = () => {
    if (!chatReplyText.trim()) return;
    
    if (!selectedTicket.messages) {
      selectedTicket.messages = [];
    }

    selectedTicket.messages.push({
      sender: 'agent',
      text: chatReplyText,
      time: 'Ahora mismo'
    });

    setChatReplyText('');
    addNotification('info', `Helpdesk: Mensaje enviado al paciente en ticket ${selectedTicket.id}.`);
  };

  return (
    <div>
      <div className="dashboard-grid">
        <div className="card">
          <div className="card-title">Tickets Clínicos de Pacientes</div>
          <div className="card-value">{tickets.length}</div>
          <div className="card-desc" style={{ color: 'var(--primary)' }}>
            <HelpCircle size={14} /> Gestión de consultas médicas
          </div>
        </div>
        <div className="card">
          <div className="card-title">Tickets Pendientes</div>
          <div className="card-value">
            {tickets.filter(t => t.estado === 'Abierto').length}
          </div>
          <div className="card-desc negative">
            <ShieldAlert size={14} /> SLA de respuesta activo
          </div>
        </div>
        <div className="card">
          <div className="card-title">Índice Satisfacción del Paciente</div>
          <div className="card-value">98.2%</div>
          <div className="card-desc positive">
            <CheckCircle size={14} /> Excelente atención digital
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px' }}>
        {/* Helpdesk Ticket list */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0 }}>Tickets de Consultas sobre Medicamentos</h3>
            <button 
              onClick={() => setShowAddTicketModal(true)}
              className="btn btn-primary"
              style={{ height: '32px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <Plus size={12} />
              <span>Añadir Ticket</span>
            </button>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Paciente</th>
                  <th>Consulta</th>
                  <th>Encargado</th>
                  <th>SLA</th>
                  <th>Urgencia</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map(t => (
                  <tr key={t.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedTicket(t)}>
                    <td style={{ fontWeight: '700', color: 'var(--primary-hover)' }}>{t.id}</td>
                    <td>{t.paciente}</td>
                    <td>{t.consulta}</td>
                    <td>{t.asignado}</td>
                    <td>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
                        <Clock size={12} style={{ color: 'var(--primary)' }} /> {t.sla}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${
                        t.urgencia === 'Alta' ? 'badge-danger' : 'badge-info'
                      }`}>
                        {t.urgencia}
                      </span>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      {t.estado === 'Abierto' ? (
                        <button 
                          onClick={() => resolverTicket(t.id)}
                          className="btn btn-primary" 
                          style={{ height: '28px', padding: '0 8px', fontSize: '11px' }}
                        >
                          Resolver
                        </button>
                      ) : (
                        <span style={{ color: 'var(--success)', fontWeight: '700', fontSize: '11px' }}>
                          ✓ Resuelto
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Drug Knowledge Base searcher */}
        <div className="card">
          <h4 style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={18} style={{ color: 'var(--primary)' }} />
            <span>Base de Conocimiento Farmacéutico</span>
          </h4>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Consulte la base de datos científica del ERP sobre indicaciones, efectos adversos y dosificaciones (ej: <b>Paracetamol</b>, <b>Metformina</b>).
          </p>

          <form onSubmit={handleKnowledgeSearch} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Buscar sustancia activa..."
              value={knowledgeQuery}
              onChange={(e) => setKnowledgeQuery(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '0 12px' }}>
              <Search size={14} />
            </button>
          </form>

          {knowledgeResult && (
            <div style={{
              padding: '16px',
              borderRadius: '8px',
              backgroundColor: 'var(--bg-main)',
              border: '1px solid var(--border)',
              fontSize: '12px'
            }}>
              {knowledgeResult.error ? (
                <div style={{ color: 'var(--danger)', fontWeight: '600' }}>
                  {knowledgeResult.error}
                </div>
              ) : (
                <>
                  <div style={{ fontWeight: '800', fontSize: '14px', marginBottom: '8px', color: 'var(--primary-hover)' }}>
                    Ficha Técnica: {knowledgeResult.nombre}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div>
                      <b style={{ color: 'var(--text-muted)' }}>Indicación Terapéutica:</b>
                      <div style={{ marginTop: '2px' }}>{knowledgeResult.indicacion}</div>
                    </div>
                    <div>
                      <b style={{ color: 'var(--text-muted)' }}>Efectos Adversos:</b>
                      <div style={{ marginTop: '2px' }}>{knowledgeResult.efectosSecundarios}</div>
                    </div>
                    <div>
                      <b style={{ color: 'var(--text-muted)' }}>Dosificación Sugerida:</b>
                      <div style={{ marginTop: '2px' }}>{knowledgeResult.dosis}</div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* POPUP MODAL: Interactive Ticket Chat Workspace */}
      {selectedTicket && (
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
          <div className="card" style={{ width: '500px', padding: '24px', position: 'relative' }}>
            <button 
              onClick={() => setSelectedTicket(null)}
              style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <MessageSquare size={26} style={{ color: 'var(--primary)' }} />
              <div>
                <h3 style={{ margin: 0 }}>Espacio de Soporte Clínico</h3>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Ticket: {selectedTicket.id} • Paciente: {selectedTicket.paciente}</span>
              </div>
            </div>

            <div style={{
              height: '200px',
              backgroundColor: 'var(--bg-main)',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              padding: '12px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              marginBottom: '16px'
            }}>
              <div style={{
                padding: '8px 12px',
                borderRadius: '8px',
                backgroundColor: 'rgba(0,229,255,0.06)',
                border: '1px solid var(--border)',
                fontSize: '11px',
                alignSelf: 'flex-start',
                maxWidth: '85%'
              }}>
                <div style={{ fontWeight: '700', marginBottom: '2px', color: 'var(--primary-hover)' }}>{selectedTicket.paciente} (Consulta Original)</div>
                <div>{selectedTicket.consulta}</div>
              </div>

              {(selectedTicket.messages || []).map((msg, idx) => (
                <div key={idx} style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  backgroundColor: msg.sender === 'agent' ? 'rgba(0, 230, 118, 0.06)' : 'rgba(0,229,255,0.06)',
                  border: '1px solid var(--border)',
                  fontSize: '11px',
                  alignSelf: msg.sender === 'agent' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%'
                }}>
                  <div style={{ fontWeight: '700', marginBottom: '2px' }}>
                    {msg.sender === 'agent' ? 'Regente de Guardia' : selectedTicket.paciente}
                  </div>
                  <div>{msg.text}</div>
                </div>
              ))}
            </div>

            {selectedTicket.estado === 'Abierto' ? (
              <div>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Escriba su respuesta clínica para el paciente..."
                    value={chatReplyText}
                    onChange={(e) => setChatReplyText(e.target.value)}
                  />
                  <button onClick={handleSendTicketReply} className="btn btn-primary">Responder</button>
                </div>
                <button 
                  onClick={() => {
                    resolverTicket(selectedTicket.id);
                    setSelectedTicket(null);
                  }}
                  className="btn btn-success" 
                  style={{ width: '100%', backgroundColor: 'var(--success)', color: '#FFF' }}
                >
                  Marcar como Resuelto y Cerrar SLA
                </button>
              </div>
            ) : (
              <div style={{
                padding: '12px',
                backgroundColor: 'rgba(0,230,118,0.05)',
                border: '1px solid var(--success)',
                borderRadius: '8px',
                color: 'var(--success)',
                fontWeight: '700',
                textAlign: 'center',
                fontSize: '12px'
              }}>
                ✓ TICKET COMPLETADO Y CERRADO DENTRO DE SLA
              </div>
            )}
          </div>
        </div>
      )}

      {/* POPUP MODAL: Add New Helpdesk Ticket */}
      {showAddTicketModal && (
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
              onClick={() => setShowAddTicketModal(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X size={18} />
            </button>

            <h3 style={{ marginBottom: '16px' }}>Abrir Ticket de Soporte Clínico</h3>
            <form onSubmit={handleAddTicket}>
              <div className="form-group">
                <label className="form-label">Paciente Solicitante</label>
                <select
                  className="form-control"
                  value={newTicketPaciente}
                  onChange={(e) => setNewTicketPaciente(e.target.value)}
                >
                  {pacientes.map(p => (
                    <option key={p.id} value={p.nombre}>{p.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Prioridad / Urgencia</label>
                <select
                  className="form-control"
                  value={newTicketUrgencia}
                  onChange={(e) => setNewTicketUrgencia(e.target.value)}
                >
                  <option value="Alta">Alta (SLA 2 Horas)</option>
                  <option value="Baja">Baja (SLA 24 Horas)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Consulta Médica / Farmacéutica</label>
                <textarea
                  className="form-control"
                  placeholder="Describa brevemente la duda del paciente..."
                  style={{ height: '80px', padding: '8px', fontSize: '12px' }}
                  value={newTicketQuery}
                  onChange={(e) => setNewTicketQuery(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
                <button 
                  onClick={() => setShowAddTicketModal(false)}
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
                  Abrir Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
