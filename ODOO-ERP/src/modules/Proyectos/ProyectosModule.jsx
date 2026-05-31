import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { GanttChart, Calendar, CheckSquare, MessageSquare, Send, Users, X, Edit, Plus, Sliders } from 'lucide-react';

export default function ProyectosModule() {
  const { 
    projectTasks, 
    setProjectTasks, 
    collabMessages, 
    setCollabMessages, 
    rrhh,
    addNotification,
    currentUser
  } = useContext(AppContext);

  const [newMessage, setNewMessage] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  // New task form state
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskProgress, setNewTaskProgress] = useState(0);

  const handleSendCollab = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setCollabMessages([...collabMessages, {
      user: currentUser?.name || 'Tú (Coordinador)',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setNewMessage('');
    addNotification('info', 'Proyectos: Enviado mensaje en hilo de coordinación.');
  };

  const handleSaveTaskAdjust = (updated) => {
    let status = 'Pendiente';
    if (updated.progress === 100) status = 'Completado';
    else if (updated.progress > 0) status = 'En Proceso';

    const finalTask = { ...updated, status };

    setProjectTasks(prev => prev.map(t => t.id === finalTask.id ? finalTask : t));
    addNotification('success', `Proyectos: Tarea "${finalTask.name}" actualizada al ${finalTask.progress}%.`);
    setSelectedTask(null);
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskName.trim()) return;

    let status = 'Pendiente';
    const progressNum = parseInt(newTaskProgress);
    if (progressNum === 100) status = 'Completado';
    else if (progressNum > 0) status = 'En Proceso';

    const newTask = {
      id: projectTasks.length + 1,
      name: newTaskName,
      status,
      progress: progressNum
    };

    setProjectTasks([...projectTasks, newTask]);
    setNewTaskName('');
    setNewTaskProgress(0);
    setShowAddTaskModal(false);
    addNotification('success', `Proyectos: Nueva tarea "${newTaskName}" agregada al cronograma.`);
  };

  return (
    <div>
      <div className="dashboard-grid">
        <div className="card">
          <div className="card-title">Proyectos de Expansión Activos</div>
          <div className="card-value">2</div>
          <div className="card-desc" style={{ color: 'var(--primary)' }}>
            <Calendar size={14} /> Campañas y nuevas aperturas
          </div>
        </div>
        <div className="card">
          <div className="card-title">Tareas de Colaboración</div>
          <div className="card-value">{projectTasks.length}</div>
          <div className="card-desc positive">
            <CheckSquare size={14} /> Monitoreo Kanban interno
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px' }}>
        {/* Gantt Chart Timeline */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <GanttChart size={20} style={{ color: 'var(--primary)' }} />
              <span>Diagrama de Gantt: Campaña de Vacunación Influenza 2026</span>
            </h3>
            <button 
              onClick={() => setShowAddTaskModal(true)}
              className="btn btn-primary"
              style={{ height: '32px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <Plus size={12} />
              <span>Añadir Tarea</span>
            </button>
          </div>

          <div className="gantt-chart" style={{ margin: '20px 0' }}>
            <div className="gantt-row">
              <div className="gantt-label" style={{ color: 'var(--text-muted)' }}>Fase / Tarea</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)' }}>
                <span>Semana 1</span>
                <span>Semana 2</span>
                <span>Semana 3</span>
                <span>Semana 4</span>
              </div>
            </div>

            {projectTasks.map((t, idx) => {
              const startOffset = idx * 15;
              const barWidth = Math.max(20, t.progress);
              return (
                <div key={t.id} className="gantt-row" style={{ cursor: 'pointer' }} onClick={() => setSelectedTask(t)}>
                  <div className="gantt-label" style={{ color: 'var(--primary-hover)', fontWeight: '600' }}>{t.name}</div>
                  <div className="gantt-timeline-track">
                    <div className="gantt-bar" style={{ 
                      left: `${startOffset % 40}%`, 
                      width: `${barWidth * 0.6}%`,
                      backgroundColor: t.status === 'Completado' ? 'var(--success)' : t.status === 'En Proceso' ? 'var(--primary)' : '#666'
                    }}>{t.progress}%</div>
                  </div>
                </div>
              );
            })}
          </div>

          <h3 style={{ margin: '24px 0 16px' }}>Listado de Tareas del Proyecto</h3>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Tarea</th>
                  <th>Estado</th>
                  <th>Progreso</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {projectTasks.map(t => (
                  <tr key={t.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedTask(t)}>
                    <td style={{ fontWeight: '700', color: 'var(--primary-hover)' }}>{t.name}</td>
                    <td>
                      <span className={`status-badge ${
                        t.status === 'Completado' ? 'badge-success' : t.status === 'En Proceso' ? 'badge-info' : 'badge-warning'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ flex: 1, backgroundColor: 'var(--border)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${t.progress}%`, backgroundColor: t.status === 'Completado' ? 'var(--success)' : 'var(--primary)', height: '100%' }}></div>
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: '700' }}>{t.progress}%</span>
                      </div>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <button 
                        onClick={() => setSelectedTask(t)}
                        className="btn btn-secondary" 
                        style={{ height: '26px', padding: '0 6px', fontSize: '10px' }}
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Collaboration thread */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '480px' }}>
          <h4 style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={18} style={{ color: 'var(--primary)' }} />
            <span>Mesa de Colaboración Interna</span>
          </h4>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '10px' }}>
            Hilo de comunicación en tiempo real para coordinar proyectos entre departamentos.
          </p>

          <div style={{
            flex: 1,
            backgroundColor: 'var(--bg-main)',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            padding: '12px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            marginBottom: '12px'
          }}>
            {collabMessages.map((msg, idx) => (
              <div key={idx} style={{
                padding: '8px 12px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                fontSize: '11px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontWeight: '700' }}>
                  <span style={{ color: 'var(--primary-hover)' }}>{msg.user}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '9px' }}>{msg.time}</span>
                </div>
                <div style={{ color: 'var(--text-main)' }}>{msg.text}</div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendCollab} style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Escriba una actualización..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              style={{ fontSize: '12px', height: '36px' }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '0 12px', height: '36px' }}>
              <Send size={14} />
            </button>
          </form>
        </div>
      </div>

      {/* POPUP MODAL: Interactive Task Editor */}
      {selectedTask && (
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
              onClick={() => setSelectedTask(null)}
              style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Sliders size={22} style={{ color: 'var(--primary)' }} />
              <h3 style={{ margin: 0 }}>Ajustar Tarea de Campaña</h3>
            </div>

            <div className="form-group">
              <label className="form-label">Nombre de Tarea</label>
              <input
                type="text"
                className="form-control"
                value={selectedTask.name}
                onChange={(e) => setSelectedTask({ ...selectedTask, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label className="form-label">Porcentaje de Avance</label>
                <b style={{ color: 'var(--primary-hover)' }}>{selectedTask.progress}%</b>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                style={{ width: '100%', accentColor: 'var(--primary)' }}
                value={selectedTask.progress}
                onChange={(e) => setSelectedTask({ ...selectedTask, progress: parseInt(e.target.value) })}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
              <button 
                onClick={() => setSelectedTask(null)} 
                className="btn btn-secondary" 
                style={{ flex: 1 }}
              >
                Cancelar
              </button>
              <button 
                onClick={() => handleSaveTaskAdjust(selectedTask)} 
                className="btn btn-primary" 
                style={{ flex: 1 }}
              >
                Actualizar Avance
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP MODAL: Add New Task */}
      {showAddTaskModal && (
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
              onClick={() => setShowAddTaskModal(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X size={18} />
            </button>

            <h3 style={{ marginBottom: '16px' }}>Añadir Tarea al Gantt</h3>
            <form onSubmit={handleAddTask}>
              <div className="form-group">
                <label className="form-label">Nombre de Tarea / Fase</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ej. Distribución de material POP"
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Avance Inicial</label>
                <select
                  className="form-control"
                  value={newTaskProgress}
                  onChange={(e) => setNewTaskProgress(e.target.value)}
                >
                  <option value="0">0% (Pendiente)</option>
                  <option value="25">25% (Iniciado)</option>
                  <option value="50">50% (A la mitad)</option>
                  <option value="75">75% (Casi completado)</option>
                  <option value="100">100% (Completado)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
                <button 
                  onClick={() => setShowAddTaskModal(false)}
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
                  Crear Tarea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
