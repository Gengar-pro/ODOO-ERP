import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { Landmark, FileSpreadsheet, Bot, CheckCircle, Scale, X, Printer, Code, ArrowRight, ArrowLeft, ArrowUp, ArrowDown, RotateCcw, Plus, Minus, Copy, Info, Check, RefreshCw } from 'lucide-react';

export default function ContabilidadModule() {
  const { 
    facturas, 
    conciliarFacturaBancaria, 
    addNotification,
    bankTransactions,
    setBankTransactions
  } = useContext(AppContext);

  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showXmlModal, setShowXmlModal] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);

  // --- Estados de Simulador de Flujo ---
  const [zoom, setZoom] = useState(1.0);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [layout, setLayout] = useState('vertical');
  const [currentStep, setCurrentStep] = useState(0);
  const [showCopiedAlert, setShowCopiedAlert] = useState(false);

  const handleZoomIn = () => setZoom(z => Math.min(2.0, z + 0.15));
  const handleZoomOut = () => setZoom(z => Math.max(0.5, z - 0.15));
  const handleResetTransform = () => {
    setZoom(1.0);
    setPanX(0);
    setPanY(0);
  };

  const handlePrevStep = () => setCurrentStep(c => Math.max(0, c - 1));
  const handleNextStep = () => setCurrentStep(c => Math.min(6, c + 1));

  const pasosSecuencia = [
    {
      titulo: "1. Venta en POS",
      descripcion: "Auxiliar POS inicia y ejecuta el cobro de carrito de medicamentos en la terminal de caja.",
      origen: "Auxiliar POS",
      destino: "Módulo POS (Caja)",
      funcion: "registrarVentaPOS(cart, clienteId, metodoPago)"
    },
    {
      titulo: "2. Verificación de Red",
      descripcion: "El motor de AppContext interroga el Gateway de Conectividad para definir el modo de procesamiento.",
      origen: "Módulo POS (Caja)",
      destino: "Gestor de Estado (AppContext)",
      funcion: "validarEstadoConexion()"
    },
    {
      titulo: "3. Persistencia Local",
      descripcion: "En caso de falla de red (Offline), el sistema almacena la transacción en la cola local de LocalStorage.",
      origen: "Gestor de Estado (AppContext)",
      destino: "Base de Datos LocalStorage",
      funcion: "saveToLocalStorage('db_queue', offlineOrder)"
    },
    {
      titulo: "4. Disminución de Inventario",
      descripcion: "En modo Online, se resta de inmediato la cantidad vendida del inventario de bodega.",
      origen: "Gestor de Estado (AppContext)",
      destino: "Almacén (Inventario)",
      funcion: "setInventario(nuevoInventario)"
    },
    {
      titulo: "5. Alerta de Stock Crítico",
      descripcion: "Si el stock cae bajo el mínimo, se dispara una notificación de reabastecimiento crítico.",
      origen: "Almacén (Inventario)",
      destino: "Alertas (Notificaciones)",
      funcion: "addNotification('stock_bajo', mensaje)"
    },
    {
      titulo: "6. Solicitud de Compra Automática",
      descripcion: "Se genera automáticamente una solicitud de cotización (RFQ) borrador a laboratorios INTI o BAGO.",
      origen: "Alertas (Notificaciones)",
      destino: "Compras (RFQ)",
      funcion: "generarRFQAutomatico(producto)"
    },
    {
      titulo: "7. Libro Diario Contable",
      descripcion: "Se emite la Factura Electrónica XML y se ingresa la póliza de ventas en la balanza fiscal contable.",
      origen: "Gestor de Estado (AppContext)",
      destino: "Contabilidad (Facturas)",
      funcion: "setFacturas([nuevaFactura, ...prev])"
    }
  ];

  const handleCopyFlowText = () => {
    const paso = pasosSecuencia[currentStep];
    const textoCopiar = `Paso ${currentStep + 1}: ${paso.titulo}\nDescripción: ${paso.descripcion}\nOrigen: ${paso.origen} -> Destino: ${paso.destino}\nFunción: ${paso.funcion}`;
    navigator.clipboard.writeText(textoCopiar);
    setShowCopiedAlert(true);
    setTimeout(() => setShowCopiedAlert(false), 2500);
  };

  // Estilos del control flotante
  const dPadBtnStyle = {
    width: '30px',
    height: '30px',
    backgroundColor: '#1E293B',
    border: '1px solid #334155',
    borderRadius: '4px',
    color: '#FFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    padding: 0
  };

  const zoomBtnStyle = {
    flex: 1,
    height: '28px',
    backgroundColor: '#1E293B',
    border: '1px solid #334155',
    borderRadius: '4px',
    color: '#FFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  };

  const stepNavBtnStyle = {
    width: '26px',
    height: '26px',
    backgroundColor: '#1E293B',
    border: '1px solid #334155',
    borderRadius: '4px',
    color: '#00E5FF',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: 'bold',
    padding: 0
  };

  const handleAiReconciliation = () => {
    setAiAnalyzing(true);
    setTimeout(() => {
      bankTransactions.forEach(tx => {
        if (!tx.conciliada && tx.matchingInvoice) {
          conciliarFacturaBancaria(tx.matchingInvoice);
        }
      });
      setBankTransactions(prev => prev.map(tx => ({ ...tx, conciliada: true })));
      setAiAnalyzing(false);
      addNotification('success', 'Contabilidad IA: Se reconciliaron transacciones bancarias mediante comparación neuronal automática.');
    }, 1200);
  };

  const handleOpenXml = (invoice) => {
    setSelectedInvoice(invoice);
    setShowXmlModal(true);
    addNotification('info', `Contabilidad: Visualizando XML de Factura Electrónica ${invoice.id}.`);
  };

  const handleOpenPdf = (invoice) => {
    setSelectedInvoice(invoice);
    setShowPdfModal(true);
    addNotification('info', `Contabilidad: Visualizando representación gráfica de Factura ${invoice.id}.`);
  };

  // Calculate local tax summary
  const totalInvoiced = facturas.reduce((sum, f) => sum + (f.total > 0 ? f.total : 0), 0);
  const totalIva = facturas.reduce((sum, f) => sum + (f.impuesto > 0 ? f.impuesto : 0), 0);

  return (
    <div>
      {/* KPI Cards */}
      <div className="dashboard-grid">
        <div className="card">
          <div className="card-title">Facturación Total Recaudada</div>
          <div className="card-value">${totalInvoiced.toFixed(2)}</div>
          <div className="card-desc positive">
            <Scale size={14} /> Facturación electrónica al día
          </div>
        </div>
        <div className="card">
          <div className="card-title">Impuesto Local IVA (16% Retenido)</div>
          <div className="card-value">${totalIva.toFixed(2)}</div>
          <div className="card-desc" style={{ color: 'var(--primary)' }}>
            <FileSpreadsheet size={14} /> Balance fiscal automático
          </div>
        </div>
        <div className="card">
          <div className="card-title">Tasa Conciliación Bancaria</div>
          <div className="card-value">
            {bankTransactions.length > 0 
              ? Math.round((bankTransactions.filter(t => t.conciliada).length / bankTransactions.length) * 100)
              : 100}%
          </div>
          <div className="card-desc positive">
            <Landmark size={14} /> Cierre contable mensual
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px' }}>
        {/* Invoices grid */}
        <div className="card">
          <h3 style={{ marginBottom: '16px' }}>Facturación Electrónica (XML / PDF)</h3>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Factura</th>
                  <th>Fecha</th>
                  <th>Paciente</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Formatos</th>
                </tr>
              </thead>
              <tbody>
                {facturas.map(f => (
                  <tr key={f.id} style={{ opacity: f.total < 0 ? 0.75 : 1 }}>
                    <td style={{ fontWeight: '700', color: 'var(--primary-hover)' }}>{f.id}</td>
                    <td>{f.fecha}</td>
                    <td>{f.cliente}</td>
                    <td style={{ fontWeight: '800', color: f.total > 0 ? 'var(--text-main)' : 'var(--danger)' }}>
                      ${f.total.toFixed(2)}
                    </td>
                    <td>
                      <span className={`status-badge ${
                        f.estado.includes('Conciliado') ? 'badge-success' : f.estado === 'Emitido' ? 'badge-info' : 'badge-danger'
                      }`}>
                        {f.estado}
                      </span>
                    </td>
                    <td>
                      {f.total > 0 ? (
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button 
                            onClick={() => handleOpenXml(f)}
                            className="btn btn-secondary" 
                            style={{ height: '26px', padding: '0 6px', fontSize: '10px' }}
                          >
                            XML
                          </button>
                          <button 
                            onClick={() => handleOpenPdf(f)}
                            className="btn btn-secondary" 
                            style={{ height: '26px', padding: '0 6px', fontSize: '10px' }}
                          >
                            PDF
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '11px', color: 'var(--danger)', fontWeight: '600' }}>Costo Magistral</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Bank Reconciliation Drawer */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bot size={18} style={{ color: 'var(--primary)' }} />
            <span>Conciliación Bancaria IA</span>
          </h4>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            El módulo inteligente compara automáticamente las transacciones del extracto bancario con las facturas emitidas por el POS y el e-commerce.
          </p>

          <button 
            onClick={handleAiReconciliation} 
            className="btn btn-primary" 
            style={{ width: '100%' }}
            disabled={aiAnalyzing}
          >
            {aiAnalyzing ? (
              <span className="skeleton-box" style={{ width: '120px', height: '14px' }}></span>
            ) : (
              <>
                <Bot size={16} />
                <span>Conciliar con IA</span>
              </>
            )}
          </button>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Extracto Bancario Reciente
            </div>
            {bankTransactions.map(tx => (
              <div key={tx.id} style={{
                padding: '10px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border)',
                fontSize: '11px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontWeight: '700' }}>{tx.id}</span>
                  <span style={{ fontWeight: '800', color: 'var(--success)' }}>+${tx.monto.toFixed(2)}</span>
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '10px' }}>{tx.descripcion}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                  <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{tx.fecha}</span>
                  {tx.conciliada ? (
                    <span style={{ color: 'var(--success)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <CheckCircle size={10} /> Conciliado
                    </span>
                  ) : (
                    <span style={{ color: 'var(--warning)', fontWeight: '700' }}>Pendiente Match</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* VISUALIZADOR INTERACTIVO DE SECUENCIA CONTABLE Y FLUJOS */}
      <div className="card" style={{ marginTop: '24px', overflow: 'hidden', position: 'relative', border: '1px solid var(--border)', padding: '24px' }}>
        <div style={{ marginBottom: '20px', borderBottom: '1px solid #1E293B', paddingBottom: '16px' }}>
          <h2 style={{ margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '20px', fontWeight: '800', color: '#FFFFFF' }}>
            <span>🔄 Secuencia de Flujos Relacionales Críticos</span>
          </h2>
          <p style={{ fontSize: '13px', color: '#94A3B8', margin: '0 0 16px 0', lineHeight: '1.6' }}>
            La principal ventaja competitiva de Pharma-Sync es la <b>automatización relacional entre módulos</b>, simulada dinámicamente en el cliente:
          </p>
          <h4 style={{ margin: '8px 0 0 0', fontSize: '14px', fontWeight: '700', color: '#00E5FF', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Secuencia: POS ──► Inventario ──► Almacén (Compras) ──► Contabilidad</span>
          </h4>
        </div>

        {/* CONTENEDOR PRINCIPAL DEL DIAGRAMA */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '400px',
          backgroundColor: '#0F172A',
          borderRadius: '10px',
          border: '1px solid #1E293B',
          overflow: 'hidden',
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }}>
          {/* LIENZO ZOOMABLE Y PANNABLE */}
          <div style={{
            width: '100%',
            height: '100%',
            transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
            transformOrigin: 'center center',
            transition: 'transform 0.15s ease-out',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'grab'
          }}>
            {layout === 'vertical' ? (
              /* --- DISEÑO DE DIAGRAMA DE SECUENCIA --- */
              <svg width="880" height="340" viewBox="0 0 880 340" style={{ userSelect: 'none' }}>
                {/* Líneas de Vida (Lifelines) */}
                {[
                  { id: 1, nombre: "Auxiliar POS", desc: "Operador", x: 60, col: "#38BDF8" },
                  { id: 2, nombre: "Módulo POS", desc: "Caja", x: 190, col: "#38BDF8" },
                  { id: 3, nombre: "AppContext", desc: "Gestor Estado", x: 320, col: "#6366F1" },
                  { id: 4, nombre: "Inventario", desc: "Almacén", x: 450, col: "#EC4899" },
                  { id: 5, nombre: "Alertas", desc: "Notificaciones", x: 580, col: "#F59E0B" },
                  { id: 6, nombre: "Compras RFQ", desc: "Abastecimiento", x: 710, col: "#10B981" },
                  { id: 7, nombre: "Contabilidad", desc: "Facturas XML", x: 830, col: "#10B981" }
                ].map(actor => (
                  <g key={actor.id}>
                    {/* Línea vertical punteada */}
                    <line x1={actor.x} y1={50} x2={actor.x} y2={310} stroke="#334155" strokeDasharray="4 4" strokeWidth="1.5" />
                    
                    {/* Caja de cabecera superior */}
                    <rect x={actor.x - 50} y={15} width={100} height={30} rx={6} fill="#1E293B" stroke={actor.col} strokeWidth="1.5" />
                    <text x={actor.x} y={29} textAnchor="middle" fontSize="10" fill="#F1F5F9" fontWeight="700">{actor.nombre}</text>
                    <text x={actor.x} y={40} textAnchor="middle" fontSize="8" fill="#64748B">{actor.desc}</text>

                    {/* Caja de cabecera inferior */}
                    <rect x={actor.x - 50} y={305} width={100} height={20} rx={4} fill="#1E293B" stroke="#334155" strokeWidth="1" />
                    <text x={actor.x} y={318} textAnchor="middle" fontSize="9" fill="#94A3B8" fontWeight="600">{actor.nombre}</text>
                  </g>
                ))}

                {/* MENSAJES / ARROW FLOWS */}
                {[
                  { paso: 0, x1: 60, x2: 190, y: 75, txt: "Ejecuta cobro de carrito", func: "registrarVentaPOS()" },
                  { paso: 1, x1: 190, x2: 320, y: 110, txt: "Valida conexión de red", func: "validarEstadoConexion()" },
                  { paso: 2, x1: 320, x2: 320, y: 145, txt: "Guarda cola offline (si falla red)", func: "saveToLocalStorage()", self: true },
                  { paso: 3, x1: 320, x2: 450, y: 180, txt: "Resta stock de fármaco", func: "setInventario()" },
                  { paso: 4, x1: 450, x2: 580, y: 215, txt: "Lanza alerta stock bajo", func: "addNotification()" },
                  { paso: 5, x1: 580, x2: 710, y: 250, txt: "Auto-genera borrador RFQ", func: "generarRFQAutomatico()" },
                  { paso: 6, x1: 320, x2: 830, y: 285, txt: "Registra factura XML", func: "setFacturas()" }
                ].map((step, idx) => {
                  const isCurrent = currentStep === step.paso;
                  const strokeColor = isCurrent ? "#00E5FF" : "#475569";
                  const textColor = isCurrent ? "#00E5FF" : "#94A3B8";
                  const strokeW = isCurrent ? 2.5 : 1.5;

                  if (step.self) {
                    {/* Bucle de autoreferencia */}
                    return (
                      <g key={idx} style={{ cursor: 'pointer' }} onClick={() => setCurrentStep(step.paso)}>
                        <path d={`M ${step.x1} ${step.y - 10} C ${step.x1 + 45} ${step.y - 10}, ${step.x1 + 45} ${step.y + 15}, ${step.x1 + 4} ${step.y + 12}`} 
                              fill="none" stroke={strokeColor} strokeWidth={strokeW} strokeDasharray={isCurrent ? "none" : "none"} />
                        <polygon points={`${step.x1+4},${step.y+12} ${step.x1+12},${step.y+8} ${step.x1+10},${step.y+16}`} fill={strokeColor} />
                        <text x={step.x1 + 50} y={step.y} fontSize="8" fill={textColor} fontWeight={isCurrent ? "700" : "500"}>{step.txt}</text>
                        <text x={step.x1 + 50} y={step.y + 10} fontSize="8" fontFamily="monospace" fill={isCurrent ? "#00E5FF" : "#64748B"}>{step.func}</text>
                      </g>
                    );
                  }

                  return (
                    <g key={idx} style={{ cursor: 'pointer' }} onClick={() => setCurrentStep(step.paso)}>
                      {/* Línea horizontal del mensaje */}
                      <line x1={step.x1} y1={step.y} x2={step.x2 - 8} y2={step.y} stroke={strokeColor} strokeWidth={strokeW} 
                            strokeDasharray={isCurrent ? "none" : "none"} />
                      {/* Punta de la flecha */}
                      <polygon points={`${step.x2-8},${step.y-4} ${step.x2},${step.y} ${step.x2-8},${step.y+4}`} fill={strokeColor} />
                      
                      {/* Texto del paso */}
                      <text x={(step.x1 + step.x2) / 2} y={step.y - 6} textAnchor="middle" fontSize="9" fill={textColor} fontWeight={isCurrent ? "700" : "500"}>
                        {step.txt}
                      </text>
                      <text x={(step.x1 + step.x2) / 2} y={step.y + 11} textAnchor="middle" fontSize="7" fontFamily="monospace" fill={isCurrent ? "#38BDF8" : "#64748B"}>
                        {step.func}
                      </text>

                      {/* Halo pulsante si es el actual */}
                      {isCurrent && (
                        <circle cx={step.x1} cy={step.y} r="5" fill="#00E5FF">
                          <animate attributeName="r" values="3;7;3" dur="1.5s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.8;0.2;0.8" dur="1.5s" repeatCount="indefinite" />
                        </circle>
                      )}
                    </g>
                  );
                })}
              </svg>
            ) : (
              /* --- DISEÑO DE DIAGRAMA PIPELINE HORIZONTAL --- */
              <svg width="880" height="340" viewBox="0 0 880 340" style={{ userSelect: 'none' }}>
                {[
                  { paso: 0, nombre: "1. Venta POS", desc: "Registro Caja", x: 40, y: 150, col: "#38BDF8" },
                  { paso: 1, nombre: "2. Verificación", desc: "Gateway Red", x: 210, y: 150, col: "#38BDF8" },
                  { paso: 3, nombre: "3. Almacén", desc: "Deducción Stock", x: 380, y: 80, col: "#EC4899" },
                  { paso: 5, nombre: "4. Compras", desc: "Generación RFQ", x: 550, y: 80, col: "#10B981" },
                  { paso: 6, nombre: "5. Facturación", desc: "Balanza Contable", x: 380, y: 220, col: "#6366F1" }
                ].map(node => {
                  const isCurrent = currentStep === node.paso || (node.paso === 3 && currentStep === 4) || (node.paso === 1 && currentStep === 2);
                  const strokeColor = isCurrent ? "#00E5FF" : "#334155";
                  const fillBg = isCurrent ? "#1E293B" : "#1E293B";
                  const textColor = isCurrent ? "#00E5FF" : "#F1F5F9";

                  return (
                    <g key={node.paso} style={{ cursor: 'pointer' }} onClick={() => setCurrentStep(node.paso)}>
                      <rect x={node.x} y={node.y} width={130} height={50} rx={8} fill={fillBg} stroke={strokeColor} strokeWidth={isCurrent ? 2.5 : 1} />
                      <text x={node.x + 65} y={node.y + 22} textAnchor="middle" fontSize="11" fill={textColor} fontWeight="700">{node.nombre}</text>
                      <text x={node.x + 65} y={node.y + 38} textAnchor="middle" fontSize="9" fill="#64748B">{node.desc}</text>
                      
                      {isCurrent && (
                        <circle cx={node.x + 5} cy={node.y + 5} r="4" fill="#00E5FF" />
                      )}
                    </g>
                  );
                })}

                {/* CONEXIONES DEL PIPELINE */}
                {[
                  { x1: 170, y1: 175, x2: 210, y2: 175, active: currentStep === 0 },
                  { x1: 340, y1: 155, x2: 380, y2: 105, active: currentStep === 1 || currentStep === 2 },
                  { x1: 340, y1: 195, x2: 380, y2: 245, active: currentStep === 1 },
                  { x1: 510, y1: 105, x2: 550, y2: 105, active: currentStep === 3 || currentStep === 4 }
                ].map((conn, idx) => {
                  const strokeC = conn.active ? "#00E5FF" : "#334155";
                  return (
                    <g key={idx}>
                      <line x1={conn.x1} y1={conn.y1} x2={conn.x2} y2={conn.y2} stroke={strokeC} strokeWidth={conn.active ? 2.5 : 1.5} />
                      <polygon points={`${conn.x2},${conn.y2} ${conn.x2-6},${conn.y2-4} ${conn.x2-6},${conn.y2+4}`} fill={strokeC} />
                    </g>
                  );
                })}
              </svg>
            )}
          </div>

          {/* --- BARRA DE CONTROL FLOTANTE (DARK PREMIUM) --- */}
          <div style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '130px',
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '10px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            zIndex: 100,
            alignItems: 'center'
          }}>
            {/* Fila Superior: Layout e Info */}
            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>
              <button 
                onClick={() => setLayout(l => l === 'vertical' ? 'horizontal' : 'vertical')}
                style={{ background: 'none', border: 'none', color: '#F1F5F9', cursor: 'pointer', padding: '4px' }}
                title="Cambiar Diseño (Secuencia / Bloques)"
              >
                <RefreshCw size={14} />
              </button>
              <button 
                onClick={handleCopyFlowText}
                style={{ background: 'none', border: 'none', color: '#F1F5F9', cursor: 'pointer', padding: '4px' }}
                title="Copiar detalles del paso actual"
              >
                <Copy size={14} />
              </button>
            </div>

            {/* D-PAD GRID DE NAVEGACIÓN (PANNING) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 30px)',
              gridTemplateRows: 'repeat(3, 30px)',
              gap: '3px',
              justifyContent: 'center'
            }}>
              <div></div>
              <button onClick={() => setPanY(y => y + 20)} style={dPadBtnStyle}><ArrowUp size={12} /></button>
              <div></div>

              <button onClick={() => setPanX(x => x + 20)} style={dPadBtnStyle}><ArrowLeft size={12} /></button>
              <button onClick={handleResetTransform} style={dPadBtnStyle} title="Restaurar visualización"><RotateCcw size={11} /></button>
              <button onClick={() => setPanX(x => x - 20)} style={dPadBtnStyle}><ArrowRight size={12} /></button>

              <div></div>
              <button onClick={() => setPanY(y => y - 20)} style={dPadBtnStyle}><ArrowDown size={12} /></button>
              <div></div>
            </div>

            {/* CONTROLES DE ZOOM */}
            <div style={{ display: 'flex', gap: '4px', width: '100%', borderTop: '1px solid #334155', paddingTop: '6px' }}>
              <button onClick={handleZoomIn} style={zoomBtnStyle}><Plus size={12} /></button>
              <button onClick={handleZoomOut} style={zoomBtnStyle}><Minus size={12} /></button>
            </div>
            
            <div style={{ fontSize: '9px', color: '#64748B', fontWeight: 'bold' }}>
              Zoom: {Math.round(zoom * 100)}%
            </div>
          </div>

          {/* CAPTURA ALERTAS DE COPIADO */}
          {showCopiedAlert && (
            <div style={{
              position: 'absolute',
              bottom: '50px',
              left: '16px',
              backgroundColor: '#10B981',
              color: '#FFF',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: '700',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              zIndex: 101,
              animation: 'fadeIn 0.2s'
            }}>
              <CheckCircle size={14} />
              <span>¡Detalle del paso copiado al portapapeles!</span>
            </div>
          )}

          {/* INDICADOR DE PASOS Y REPRODUCTOR A PIE DE GRÁFICO */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '45px',
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            borderTop: '1px solid #1E293B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
            color: '#FFFFFF'
          }}>
            {/* Botones de navegación de pasos */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button 
                onClick={handlePrevStep}
                disabled={currentStep === 0}
                style={stepNavBtnStyle}
              >
                ◄
              </button>
              <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--primary)' }}>
                Paso {currentStep + 1} de 7
              </span>
              <button 
                onClick={handleNextStep}
                disabled={currentStep === 6}
                style={stepNavBtnStyle}
              >
                ►
              </button>
            </div>

            {/* Explicación del paso actual */}
            <div style={{ fontSize: '11px', color: '#E2E8F0', flex: 1, marginLeft: '20px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              <b>{pasosSecuencia[currentStep].titulo}</b>: {pasosSecuencia[currentStep].descripcion}
            </div>

            {/* Firma técnica */}
            <div style={{ fontSize: '9px', color: '#64748B', fontFamily: 'monospace', display: 'none' }}>
              Pharma-Sync FlowEngine v2.0
            </div>
          </div>
        </div>
      </div>

      {/* POPUP MODAL: Interactive XML certified code viewer */}
      {showXmlModal && selectedInvoice && (
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
          <div className="card" style={{ width: '550px', padding: '24px', position: 'relative' }}>
            <button 
              onClick={() => setShowXmlModal(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <Code size={28} style={{ color: 'var(--primary)' }} />
              <div>
                <h3 style={{ margin: 0 }}>CFDI XML Firmado SAT</h3>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Factura: {selectedInvoice.id}</span>
              </div>
            </div>

            <div style={{
              backgroundColor: '#1E293B',
              color: '#38BDF8',
              fontFamily: 'monospace',
              fontSize: '11px',
              padding: '16px',
              borderRadius: '8px',
              height: '280px',
              overflowY: 'auto',
              border: '1px solid #334155'
            }}>
              {`<?xml version="1.0" encoding="UTF-8"?>
<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/4" 
  Version="4.0" Serie="A" Folio="${selectedInvoice.id}" 
  Fecha="${selectedInvoice.fecha.replace(' ', 'T')}"
  SubTotal="${selectedInvoice.subtotal.toFixed(2)}"
  Total="${selectedInvoice.total.toFixed(2)}" 
  Moneda="MXN" MetodoPago="PUE" TipoDeComprobante="I">
  <cfdi:Emisor Rfc="PSY901231ERP" Nombre="PHARMA SYNC ERP DE BOLIVIA S.A." RegimenFiscal="601"/>
  <cfdi:Receptor Rfc="XAXX010101000" Nombre="${selectedInvoice.cliente.toUpperCase()}" UsoCFDI="G01"/>
  <cfdi:Conceptos>
    <cfdi:Concepto ClaveProdServ="51101500" Cantidad="1.0" ClaveUnidad="H87" Descripcion="Compra de medicamentos farmacéuticos" ValorUnitario="${selectedInvoice.subtotal.toFixed(2)}" Importe="${selectedInvoice.subtotal.toFixed(2)}">
      <cfdi:Impuestos>
        <cfdi:Traslados>
          <cfdi:Traslado Base="${selectedInvoice.subtotal.toFixed(2)}" Impuesto="002" TipoFactor="Tasa" TasaOCuota="0.160000" Importe="${selectedInvoice.impuesto.toFixed(2)}"/>
        </cfdi:Traslados>
      </cfdi:Impuestos>
    </cfdi:Concepto>
  </cfdi:Conceptos>
  <cfdi:Complemento>
    <tfd:TimbreFiscalDigital UUID="3a58e0fb-99b8-4d51-a75d-f1e16f39d1b1" SelloCFD="aA2cd998bdfc282bc78dfb918b9c612"/>
  </cfdi:Complemento>
</cfdi:Comprobante>`}
            </div>

            <button 
              onClick={() => setShowXmlModal(false)}
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: '16px' }}
            >
              Cerrar Visor XML
            </button>
          </div>
        </div>
      )}

      {/* POPUP MODAL: Interactive PDF beautiful invoice receipt */}
      {showPdfModal && selectedInvoice && (
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
          <div className="card" style={{ width: '450px', padding: '24px', position: 'relative', backgroundColor: '#FFFFFF', color: '#1E293B' }}>
            <button 
              onClick={() => setShowPdfModal(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748B' }}
            >
              <X size={18} />
            </button>

            {/* Receipt Styling */}
            <div style={{ textAlign: 'center', borderBottom: '2px solid #E2E8F0', paddingBottom: '12px', marginBottom: '16px' }}>
              <span style={{ fontSize: '24px', fontWeight: '800', color: '#00E5FF' }}>PHARMA-SYNC ERP</span>
              <div style={{ fontSize: '11px', color: '#64748B' }}>FARMACIA INTEGRAL Y MEDICINA MAGISTRAL</div>
              <div style={{ fontSize: '10px', color: '#94A3B8' }}>NIT: 3829103-010 • Tel: +591 70000000</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '12px' }}>
              <div>
                <b>Facturar a:</b> {selectedInvoice.cliente}
              </div>
              <div style={{ textAlign: 'right' }}>
                <b>Factura #:</b> {selectedInvoice.id}
                <br />
                <b>Fecha:</b> {selectedInvoice.fecha}
              </div>
            </div>

            {/* Items row list */}
            <div style={{ borderBottom: '1px solid #E2E8F0', borderTop: '1px solid #E2E8F0', padding: '8px 0', fontSize: '12px', marginBottom: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 50px 70px', fontWeight: '700', color: '#475569' }}>
                <span>Detalle Fármaco</span>
                <span style={{ textAlign: 'center' }}>Cant.</span>
                <span style={{ textAlign: 'right' }}>Subtotal</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 50px 70px', color: '#475569', marginTop: '6px' }}>
                <span>Compra Farmacéutica Registrada ({selectedInvoice.modulo})</span>
                <span style={{ textAlign: 'center' }}>1</span>
                <span style={{ textAlign: 'right' }}>${selectedInvoice.subtotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Totals */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', alignItems: 'flex-end', marginBottom: '16px' }}>
              <div>Subtotal: <b>${selectedInvoice.subtotal.toFixed(2)}</b></div>
              <div>IVA (16%): <b>${selectedInvoice.impuesto.toFixed(2)}</b></div>
              <div style={{ fontSize: '15px', color: '#0F172A', borderTop: '1px solid #E2E8F0', paddingTop: '4px', marginTop: '4px' }}>
                Total Pagado: <span style={{ fontWeight: '800' }}>${selectedInvoice.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Digital Stamp Simulation */}
            <div style={{
              backgroundColor: '#F8FAFC',
              padding: '8px',
              borderRadius: '6px',
              fontSize: '9px',
              fontFamily: 'monospace',
              color: '#64748B',
              border: '1px solid #E2E8F0',
              textAlign: 'center',
              lineBreak: 'anywhere'
            }}>
              <b>Timbre Digital SAT:</b> PSY-6893892-F{selectedInvoice.id}-892019-SHA256
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
              <button 
                onClick={() => {
                  alert("Impresora térmica conectada. Imprimiendo ticket contable...");
                  setShowPdfModal(false);
                }} 
                className="btn btn-primary" 
                style={{ flex: 1, backgroundColor: '#0F172A', color: '#FFF' }}
              >
                <Printer size={14} style={{ marginRight: '6px', display: 'inline-block', verticalAlign: 'middle' }} />
                <span>Imprimir Ticket</span>
              </button>
              <button 
                onClick={() => setShowPdfModal(false)} 
                className="btn btn-secondary" 
                style={{ flex: 1 }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
