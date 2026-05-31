import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { Package, ShieldAlert, Barcode, HelpCircle, Check, Eye, Edit, X, ArrowUpRight } from 'lucide-react';

export default function InventarioModule() {
  const { inventario, setInventario, addNotification } = useContext(AppContext);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [scannedProduct, setScannedProduct] = useState(null);

  // Modal State for stock adjustments
  const [selectedStockAdjust, setSelectedStockAdjust] = useState(null);

  const handleBarcodeScan = (e) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;

    const found = inventario.find(p => 
      p.lote.toLowerCase() === barcodeInput.toLowerCase() || 
      p.nombre.toLowerCase().includes(barcodeInput.toLowerCase())
    );

    if (found) {
      setScannedProduct(found);
      addNotification('success', `Escáner: Lectura exitosa de lote ${found.lote} (${found.nombre}).`);
    } else {
      setScannedProduct(null);
      addNotification('danger', `Escáner: No se encontró ningún medicamento con el código "${barcodeInput}".`);
    }
  };

  const manualReplenish = (prodId) => {
    setInventario(prev => prev.map(p => {
      if (p.id === prodId) {
        const replenishedStock = p.stock + 50;
        addNotification('success', `Inventario: Se reabasteció manualmente ${p.nombre}. Nuevo Stock: ${replenishedStock}.`);
        return { ...p, stock: replenishedStock };
      }
      return p;
    }));
  };

  const handleSaveStockAdjust = (updated) => {
    setInventario(prev => prev.map(p => p.id === updated.id ? updated : p));
    addNotification('info', `Inventario: Ajuste manual de stock de ${updated.nombre} guardado.`);
    setSelectedStockAdjust(null);
    if (scannedProduct && scannedProduct.id === updated.id) {
      setScannedProduct(updated);
    }
  };

  const expiredItems = inventario.filter(p => new Date(p.vencimiento) <= new Date('2026-06-30'));
  const lowStockItems = inventario.filter(p => p.stock <= p.minStock);

  return (
    <div>
      {/* KPIs */}
      <div className="dashboard-grid">
        <div className="card">
          <div className="card-title">Ítems Totales en Catálogo</div>
          <div className="card-value">{inventario.length}</div>
          <div className="card-desc" style={{ color: 'var(--primary)' }}>
            <Package size={14} /> Control de lotes integrado
          </div>
        </div>
        <div className="card">
          <div className="card-title">Alertas por Vencimiento Cercano</div>
          <div className="card-value" style={{ color: expiredItems.length > 0 ? 'var(--danger)' : 'var(--text-main)' }}>
            {expiredItems.length}
          </div>
          <div className="card-desc negative">
            <ShieldAlert size={14} /> Expiración &lt; 2 meses
          </div>
        </div>
        <div className="card">
          <div className="card-title">Medicamentos con Stock Crítico</div>
          <div className="card-value" style={{ color: lowStockItems.length > 0 ? 'var(--danger)' : 'var(--text-main)' }}>
            {lowStockItems.length}
          </div>
          <div className="card-desc negative">
            <ShieldAlert size={14} /> Requiere reabastecimiento
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px' }}>
        {/* Real-time Inventory table */}
        <div className="card">
          <h3 style={{ marginBottom: '16px' }}>Registro de Inventario en Tiempo Real</h3>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Fármaco</th>
                  <th>Categoría</th>
                  <th>Lote</th>
                  <th>Vencimiento</th>
                  <th>Stock</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {inventario.map(p => {
                  const isLow = p.stock <= p.minStock;
                  const isExpiring = new Date(p.vencimiento) <= new Date('2026-06-30');
                  
                  return (
                    <tr key={p.id} style={{
                      backgroundColor: isExpiring ? 'rgba(255, 82, 82, 0.02)' : isLow ? 'rgba(255, 214, 0, 0.02)' : 'transparent',
                      cursor: 'pointer'
                    }} onClick={() => setSelectedStockAdjust(p)}>
                      <td style={{ fontWeight: '700', color: 'var(--primary-hover)' }}>{p.nombre}</td>
                      <td>{p.categoria}</td>
                      <td style={{ fontFamily: 'monospace', fontSize: '12px' }}>{p.lote}</td>
                      <td style={{ 
                        color: isExpiring ? 'var(--danger)' : 'var(--text-main)',
                        fontWeight: isExpiring ? '700' : '400'
                      }}>
                        {p.vencimiento} 
                        {isExpiring && <span style={{ fontSize: '9px', marginLeft: '4px' }}>⚠️ Próximo</span>}
                      </td>
                      <td>
                        <span className={`status-badge ${
                          isLow ? 'badge-danger' : 'badge-success'
                        }`}>
                          {p.stock} / {p.minStock} min
                        </span>
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button 
                            onClick={() => manualReplenish(p.id)}
                            className="btn btn-secondary" 
                            style={{ height: '26px', padding: '0 6px', fontSize: '10px' }}
                          >
                            +50 u
                          </button>
                          <button 
                            onClick={() => setSelectedStockAdjust(p)}
                            className="btn btn-primary" 
                            style={{ height: '26px', padding: '0 6px', fontSize: '10px' }}
                          >
                            Ajustar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Barcode Scanner Simulator Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card">
            <h4 style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Barcode size={18} style={{ color: 'var(--primary)' }} />
              <span>Simulador de Lector de Barras</span>
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Ingrese el código del lote impreso en la caja del medicamento (ej: <b>L-PAR202</b>, <b>L-IBU304</b>) o busque por nombre.
            </p>
            <form onSubmit={handleBarcodeScan} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Escanee Lote (ej. L-PAR202)..."
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '0 16px' }}>
                Escanear
              </button>
            </form>

            {scannedProduct ? (
              <div style={{
                padding: '16px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--primary)',
                fontSize: '12px'
              }}>
                <div style={{ fontWeight: '700', fontSize: '14px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Eye size={16} style={{ color: 'var(--primary)' }} />
                  <span>{scannedProduct.nombre}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div><b>Categoría:</b> {scannedProduct.categoria}</div>
                  <div><b>Lote:</b> <span style={{ fontFamily: 'monospace' }}>{scannedProduct.lote}</span></div>
                  <div><b>Vencimiento:</b> {scannedProduct.vencimiento}</div>
                  <div><b>Precio POS:</b> ${scannedProduct.precio}</div>
                  <div style={{ gridColumn: 'span 2', marginTop: '6px' }}>
                    <b>Estado de Stock:</b>{' '}
                    <span style={{ 
                      fontWeight: '800', 
                      color: scannedProduct.stock <= scannedProduct.minStock ? 'var(--danger)' : 'var(--success)'
                    }}>
                      {scannedProduct.stock} unidades
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedStockAdjust(scannedProduct)}
                  className="btn btn-secondary" 
                  style={{ width: '100%', marginTop: '12px', height: '30px', fontSize: '11px' }}
                >
                  <Edit size={12} /> Ajustar Ficha
                </button>
              </div>
            ) : (
              <div style={{
                padding: '16px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-main)',
                border: '1px dashed var(--border)',
                textAlign: 'center',
                color: 'var(--text-muted)',
                fontSize: '12px'
              }}>
                <HelpCircle size={20} style={{ margin: '0 auto 8px', display: 'block' }} />
                Ningún lote escaneado recientemente.
              </div>
            )}
          </div>

          <div className="card">
            <h4 style={{ marginBottom: '12px' }}>Reglas de Reabastecimiento Automático</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px' }}>
              <div style={{ padding: '8px', borderRadius: '4px', backgroundColor: 'var(--bg-main)', borderLeft: '3px solid var(--primary)' }}>
                Si <b>Losartán 50mg</b> baja de 10 unidades ➔ Auto RFQ BAGO de 30 unidades.
              </div>
              <div style={{ padding: '8px', borderRadius: '4px', backgroundColor: 'var(--bg-main)', borderLeft: '3px solid var(--primary)' }}>
                Si <b>Amoxicilina 500mg</b> baja de 15 unidades ➔ Auto RFQ INTI de 45 unidades.
              </div>
              <div style={{ padding: '8px', borderRadius: '4px', backgroundColor: 'var(--bg-main)', borderLeft: '3px solid var(--primary)' }}>
                Si <b>Ibuprofeno 400mg</b> baja de 15 unidades ➔ Auto RFQ BAGO de 45 unidades.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* POPUP MODAL: Interactive Stock adjustment sheet */}
      {selectedStockAdjust && (
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
              onClick={() => setSelectedStockAdjust(null)}
              style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X size={18} />
            </button>

            <h3 style={{ marginBottom: '16px' }}>Ajustar Parámetros de Stock</h3>
            <div style={{ fontWeight: '800', color: 'var(--primary-hover)', marginBottom: '12px', fontSize: '15px' }}>
              {selectedStockAdjust.nombre}
            </div>

            <div className="form-group">
              <label className="form-label">Código de Lote Bodega</label>
              <input
                type="text"
                className="form-control"
                value={selectedStockAdjust.lote}
                onChange={(e) => setSelectedStockAdjust({ ...selectedStockAdjust, lote: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div className="form-group">
                <label className="form-label">Stock en Físico</label>
                <input
                  type="number"
                  className="form-control"
                  value={selectedStockAdjust.stock}
                  onChange={(e) => setSelectedStockAdjust({ ...selectedStockAdjust, stock: parseInt(e.target.value) || 0 })}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Stock Mínimo Alerta</label>
                <input
                  type="number"
                  className="form-control"
                  value={selectedStockAdjust.minStock}
                  onChange={(e) => setSelectedStockAdjust({ ...selectedStockAdjust, minStock: parseInt(e.target.value) || 0 })}
                  min="0"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Fecha de Vencimiento Lote</label>
              <input
                type="text"
                className="form-control"
                value={selectedStockAdjust.vencimiento}
                onChange={(e) => setSelectedStockAdjust({ ...selectedStockAdjust, vencimiento: e.target.value })}
                placeholder="AAAA-MM-DD"
              />
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <button 
                onClick={() => setSelectedStockAdjust(null)} 
                className="btn btn-secondary" 
                style={{ flex: 1 }}
              >
                Cancelar
              </button>
              <button 
                onClick={() => handleSaveStockAdjust(selectedStockAdjust)} 
                className="btn btn-primary" 
                style={{ flex: 1 }}
              >
                Guardar Ajustes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
