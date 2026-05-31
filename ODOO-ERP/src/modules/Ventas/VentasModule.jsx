import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { FileText, Edit3, ShoppingBag, CheckCircle, PenTool, Plus, X, Search } from 'lucide-react';

export default function VentasModule() {
  const { 
    pacientes, 
    facturas, 
    addNotification, 
    inventario, 
    quotes, 
    setQuotes 
  } = useContext(AppContext);

  const [selectedPaciente, setSelectedPaciente] = useState(pacientes[0]?.id || '');
  const [selectedProduct, setSelectedProduct] = useState(inventario[0]?.id || '');
  const [quantity, setQuantity] = useState(10);
  
  // Modals state
  const [showSignModal, setShowSignModal] = useState(false);
  const [targetQuoteId, setTargetQuoteId] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('Dr. Eduardo Sotomayor (Regente)');
  const [signatureText, setSignatureText] = useState('');
  
  const [showQuoteCreatedModal, setShowQuoteCreatedModal] = useState(false);
  const [createdQuote, setCreatedQuote] = useState(null);

  const [selectedQuoteDetail, setSelectedQuoteDetail] = useState(null);

  const activeProduct = inventario.find(p => p.id === selectedProduct) || inventario[0];
  const calculatedTotal = activeProduct ? activeProduct.precio * quantity : 0;

  const handleCreateQuote = (e) => {
    e.preventDefault();
    const pac = pacientes.find(p => p.id === selectedPaciente);
    if (!pac || !activeProduct) return;

    const newQuote = {
      id: 'COT-89' + (quotes.length + 1),
      cliente: pac.nombre,
      fecha: new Date().toISOString().slice(0, 10),
      producto: activeProduct.nombre,
      cantidad: parseInt(quantity),
      precioUnitario: activeProduct.precio,
      total: parseFloat(calculatedTotal.toFixed(2)),
      estado: 'Borrador',
      doctorFirmante: 'Pendiente de Validación'
    };

    setQuotes([newQuote, ...quotes]);
    setCreatedQuote(newQuote);
    setShowQuoteCreatedModal(true);
    addNotification('info', `Ventas: Cotización digital ${newQuote.id} generada para ${pac.nombre} por ${newQuote.producto}.`);
  };

  const openSignModal = (quoteId) => {
    setTargetQuoteId(quoteId);
    setShowSignModal(true);
  };

  const handleApplySignature = () => {
    if (!signatureText.trim()) {
      alert("Por favor escriba una firma o rúbrica médica en el cuadro de texto.");
      return;
    }

    setQuotes(prev => prev.map(q => 
      q.id === targetQuoteId ? { 
        ...q, 
        estado: 'Firmado y Aprobado', 
        doctorFirmante: selectedDoctor,
        hashFirma: 'SHA256-' + Math.floor(Math.random() * 90000000 + 10000000)
      } : q
    ));

    addNotification('success', `Ventas: Receta firmada digitalmente por ${selectedDoctor} para cotización ${targetQuoteId}.`);
    setShowSignModal(false);
    setSignatureText('');
  };

  return (
    <div>
      {/* KPIs */}
      <div className="dashboard-grid">
        <div className="card">
          <div className="card-title">Cotizaciones Digitales Activas</div>
          <div className="card-value">{quotes.length}</div>
          <div className="card-desc" style={{ color: 'var(--primary)' }}>
            <FileText size={14} /> Pipeline comercial activo
          </div>
        </div>
        <div className="card">
          <div className="card-title">Recetas Firmadas Digitalmente</div>
          <div className="card-value">
            {quotes.filter(q => q.estado === 'Firmado y Aprobado').length}
          </div>
          <div className="card-desc positive">
            <CheckCircle size={14} /> Cumplimiento de normas médicas
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px' }}>
        {/* Quotes List Panel */}
        <div className="card">
          <h3 style={{ marginBottom: '16px' }}>Portal de Cotizaciones y Recetas Médicas</h3>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Paciente</th>
                  <th>Fecha</th>
                  <th>Concepto</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {quotes.map(q => (
                  <tr 
                    key={q.id} 
                    style={{ cursor: 'pointer' }}
                    onClick={() => setSelectedQuoteDetail(q)}
                  >
                    <td style={{ fontWeight: '700', color: 'var(--primary-hover)' }}>{q.id}</td>
                    <td>{q.cliente}</td>
                    <td>{q.fecha}</td>
                    <td>
                      <span style={{ fontSize: '12px' }}>
                        {q.producto || 'Metformina 850mg'} ({q.cantidad || 10} u)
                      </span>
                    </td>
                    <td style={{ fontWeight: '700' }}>${q.total.toFixed(2)}</td>
                    <td>
                      <span className={`status-badge ${
                        q.estado === 'Firmado y Aprobado' ? 'badge-success' : 'badge-warning'
                      }`}>
                        {q.estado}
                      </span>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      {q.estado === 'Borrador' ? (
                        <button 
                          onClick={() => openSignModal(q.id)}
                          className="btn btn-primary" 
                          style={{ height: '30px', padding: '0 8px', fontSize: '11px' }}
                        >
                          <PenTool size={12} />
                          <span>Validar</span>
                        </button>
                      ) : (
                        <span style={{ fontSize: '11px', color: 'var(--success)', fontWeight: '700' }}>
                          ✓ Aprobada
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Detailed view panel */}
          {selectedQuoteDetail && (
            <div style={{
              marginTop: '20px',
              padding: '16px',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-main)',
              border: '1px solid var(--border)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={{ margin: 0 }}>Visualizador de Receta {selectedQuoteDetail.id}</h4>
                <button 
                  onClick={() => setSelectedQuoteDetail(null)}
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  <X size={16} />
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12px', marginBottom: '12px' }}>
                <div><b>Paciente:</b> {selectedQuoteDetail.cliente}</div>
                <div><b>Fecha Emisión:</b> {selectedQuoteDetail.fecha}</div>
                <div><b>Fármaco:</b> {selectedQuoteDetail.producto || 'Metformina 850mg'}</div>
                <div><b>Cantidad:</b> {selectedQuoteDetail.cantidad || 10} unidades</div>
                <div><b>Costo Total:</b> ${selectedQuoteDetail.total.toFixed(2)}</div>
                <div><b>Especialista Avalador:</b> {selectedQuoteDetail.doctorFirmante}</div>
              </div>

              {selectedQuoteDetail.hashFirma && (
                <div style={{
                  padding: '10px 14px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(0,230,118,0.06)',
                  border: '1px dashed var(--success)',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  textAlign: 'center',
                  color: 'var(--success)'
                }}>
                  🔐 FIRMA DIGITAL AUTORIZADA POR {selectedQuoteDetail.doctorFirmante.toUpperCase()}
                  <br />
                  REGISTRO: {selectedQuoteDetail.hashFirma}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Interactive side controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Create Quote interactive form */}
          <div className="card">
            <h4 style={{ marginBottom: '12px' }}>Crear Cotización Digital</h4>
            <form onSubmit={handleCreateQuote}>
              <div className="form-group">
                <label className="form-label">Paciente Asignado</label>
                <select 
                  className="form-control"
                  value={selectedPaciente}
                  onChange={(e) => setSelectedPaciente(e.target.value)}
                >
                  {pacientes.map(p => (
                    <option key={p.id} value={p.id}>{p.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Medicamento</label>
                <select 
                  className="form-control"
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                >
                  {inventario.map(prod => (
                    <option key={prod.id} value={prod.id}>{prod.nombre} (${prod.precio}/u)</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div className="form-group">
                  <label className="form-label">Cant. a cotizar</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Total Cotizado</label>
                  <div style={{
                    height: '38px',
                    lineHeight: '38px',
                    padding: '0 12px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-main)',
                    border: '1px solid var(--border)',
                    fontWeight: '700',
                    fontSize: '13px',
                    color: 'var(--primary-hover)'
                  }}>
                    ${calculatedTotal.toFixed(2)}
                  </div>
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                <Plus size={14} />
                <span>Generar Cotización</span>
              </button>
            </form>
          </div>

          {/* Client Purchase History portal */}
          <div className="card">
            <h4 style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingBag size={16} />
              <span>Portal de Historial Clientes</span>
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '240px', overflowY: 'auto' }}>
              {facturas.map((f, idx) => (
                <div key={idx} style={{
                  padding: '8px 12px',
                  backgroundColor: 'var(--bg-main)',
                  borderRadius: '6px',
                  fontSize: '11px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontWeight: '700' }}>{f.cliente}</div>
                    <div style={{ color: 'var(--text-muted)' }}>{f.fecha} • {f.modulo}</div>
                  </div>
                  <div style={{ fontWeight: '800', color: f.total > 0 ? 'var(--primary-hover)' : 'var(--danger)' }}>
                    ${Math.abs(f.total).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* POPUP MODAL: Quote Created details */}
      {showQuoteCreatedModal && createdQuote && (
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
              onClick={() => setShowQuoteCreatedModal(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X size={18} />
            </button>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <CheckCircle size={36} style={{ color: 'var(--success)', margin: '0 auto 8px' }} />
              <h3 style={{ margin: 0 }}>Cotización Digital Generada</h3>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Código de transacción: {createdQuote.id}</span>
            </div>

            <div style={{
              padding: '12px',
              backgroundColor: 'var(--bg-main)',
              borderRadius: '8px',
              fontSize: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              marginBottom: '16px'
            }}>
              <div><b>Paciente:</b> {createdQuote.cliente}</div>
              <div><b>Concepto:</b> {createdQuote.producto}</div>
              <div><b>Cantidad:</b> {createdQuote.cantidad} unidades</div>
              <div><b>Precio Unitario:</b> ${createdQuote.precioUnitario.toFixed(2)}</div>
              <div style={{ borderTop: '1px dashed var(--border)', paddingTop: '6px', fontWeight: '800', display: 'flex', justifyContent: 'space-between', color: 'var(--primary-hover)' }}>
                <span>Total Cotizado:</span>
                <span>${createdQuote.total.toFixed(2)}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => {
                  setShowQuoteCreatedModal(false);
                  openSignModal(createdQuote.id);
                }} 
                className="btn btn-primary" 
                style={{ flex: 1 }}
              >
                Firmar Receta Ahora
              </button>
              <button 
                onClick={() => setShowQuoteCreatedModal(false)} 
                className="btn btn-secondary" 
                style={{ flex: 1 }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP MODAL: Interactive Clinical Doctor Signature */}
      {showSignModal && (
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
              onClick={() => setShowSignModal(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X size={18} />
            </button>
            
            <div style={{ marginBottom: '16px', textAlign: 'center' }}>
              <Edit3 size={32} style={{ color: 'var(--primary)', margin: '0 auto 8px' }} />
              <h3 style={{ margin: 0 }}>Validación y Firma de Receta</h3>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Asociada a la cotización: {targetQuoteId}</span>
            </div>

            <div className="form-group">
              <label className="form-label">Doctor Regulador Asignado</label>
              <select 
                className="form-control"
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
              >
                <option value="Dr. Eduardo Sotomayor (Regente)">Dr. Eduardo Sotomayor (Regente)</option>
                <option value="Dra. Sofía Montenegro (Clínica General)">Dra. Sofía Montenegro (Clínica General)</option>
                <option value="Dr. Julio Villarroel (Médico Consultor)">Dr. Julio Villarroel (Médico Consultor)</option>
              </select>
            </div>

            {/* Signature Draw Simulator Grid */}
            <div className="form-group">
              <label className="form-label">Rúbrica Médica Electrónica</label>
              <input
                type="text"
                className="form-control"
                placeholder="Escriba el nombre o firma electrónica del médico (ej: E. Sotomayor)"
                value={signatureText}
                onChange={(e) => setSignatureText(e.target.value)}
              />
            </div>

            <div style={{
              height: '100px',
              border: '1px dashed var(--border)',
              borderRadius: '8px',
              backgroundColor: 'var(--bg-main)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              fontSize: '11px',
              fontStyle: 'italic',
              marginBottom: '20px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {signatureText ? (
                <div style={{
                  fontSize: '28px',
                  fontFamily: '"Caveat", cursive, "Brush Script MT", sans-serif',
                  color: 'var(--primary-hover)',
                  transform: 'rotate(-4deg)'
                }}>
                  {signatureText}
                </div>
              ) : (
                "Simulador de firma interactiva: Escriba su rúbrica arriba..."
              )}
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => setShowSignModal(false)} 
                className="btn btn-secondary" 
                style={{ flex: 1 }}
              >
                Cancelar
              </button>
              <button 
                onClick={handleApplySignature} 
                className="btn btn-primary" 
                style={{ flex: 1 }}
              >
                Aplicar Rúbrica y Aprobar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
