import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { Landmark, FileSpreadsheet, Bot, CheckCircle, Scale, X, Printer, Code } from 'lucide-react';

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
