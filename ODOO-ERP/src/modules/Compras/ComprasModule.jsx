import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { Truck, ShoppingCart, FileCheck } from 'lucide-react';

export default function ComprasModule() {
  const { compras, setCompras, recibirCompra, addNotification } = useContext(AppContext);
  const [proveedor, setProveedor] = useState('Laboratorios Droguería INTI');
  const [medicamento, setMedicamento] = useState('Amoxicilina 500mg');
  const [cantidad, setCantidad] = useState(50);
  const [precio, setPrecio] = useState(3.5);

  const handleCreateRFQ = (e) => {
    e.preventDefault();
    
    const rfqId = 'RFQ-00' + (compras.length + 1);
    const total = cantidad * precio;
    const nuevoRFQ = {
      id: rfqId,
      proveedor,
      fecha: new Date().toISOString().slice(0, 10),
      items: [{ producto: medicamento, cantidad: parseInt(cantidad), precio: parseFloat(precio) }],
      total: parseFloat(total.toFixed(2)),
      estado: 'Borrador'
    };

    setCompras(prev => [nuevoRFQ, ...prev]);
    addNotification('info', `Compras: Solicitud de cotización manual ${rfqId} enviada a ${proveedor}.`);
  };

  const confirmarOrden = (id) => {
    setCompras(prev => prev.map(c => 
      c.id === id ? { ...c, estado: 'Confirmado' } : c
    ));
    addNotification('success', `Compras: Se confirmó comercialmente el RFQ ${id}.`);
  };

  return (
    <div>
      <div className="dashboard-grid">
        <div className="card">
          <div className="card-title">Órdenes de Compra (RFQs)</div>
          <div className="card-value">{compras.length}</div>
          <div className="card-desc" style={{ color: 'var(--primary)' }}>
            <ShoppingCart size={14} /> Solicitudes a laboratorios
          </div>
        </div>
        <div className="card">
          <div className="card-title">Órdenes Recibidas</div>
          <div className="card-value">
            {compras.filter(c => c.estado === 'Recibido').length}
          </div>
          <div className="card-desc positive">
            <Truck size={14} /> Mercadería en almacén
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px' }}>
        {/* Compras RFQ list */}
        <div className="card">
          <h3 style={{ marginBottom: '16px' }}>Gestión de RFQs a Proveedores Farmacéuticos</h3>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Laboratorio</th>
                  <th>Fecha</th>
                  <th>Medicamento</th>
                  <th>Cant.</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {compras.map(c => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: '700' }}>{c.id}</td>
                    <td>{c.proveedor}</td>
                    <td>{c.fecha}</td>
                    <td>{c.items[0]?.producto}</td>
                    <td>{c.items[0]?.cantidad} u</td>
                    <td style={{ fontWeight: '700' }}>${c.total.toFixed(2)}</td>
                    <td>
                      <span className={`status-badge ${
                        c.estado === 'Recibido' ? 'badge-success' : c.estado === 'Confirmado' ? 'badge-info' : 'badge-warning'
                      }`}>
                        {c.estado}
                      </span>
                    </td>
                    <td>
                      {c.estado === 'Borrador' && (
                        <button 
                          onClick={() => confirmarOrden(c.id)}
                          className="btn btn-secondary" 
                          style={{ height: '28px', padding: '0 8px', fontSize: '11px' }}
                        >
                          Confirmar
                        </button>
                      )}
                      {c.estado === 'Confirmado' && (
                        <button 
                          onClick={() => recibirCompra(c.id)}
                          className="btn btn-primary" 
                          style={{ height: '28px', padding: '0 8px', fontSize: '11px' }}
                        >
                          Recibir Stock
                        </button>
                      )}
                      {c.estado === 'Recibido' && (
                        <span style={{ fontSize: '11px', color: 'var(--success)', fontWeight: '600' }}>
                          ✓ Completada
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Manual RFQ Form */}
        <div className="card">
          <h4 style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileCheck size={18} style={{ color: 'var(--primary)' }} />
            <span>Crear Solicitud Manual (RFQ)</span>
          </h4>
          <form onSubmit={handleCreateRFQ}>
            <div className="form-group">
              <label className="form-label">Laboratorio / Proveedor</label>
              <select 
                className="form-control"
                value={proveedor}
                onChange={(e) => setProveedor(e.target.value)}
              >
                <option value="Laboratorios Droguería INTI">Laboratorios Droguería INTI</option>
                <option value="Laboratorios BAGO">Laboratorios BAGO</option>
                <option value="Droguería COFAR">Droguería COFAR</option>
                <option value="Pharma-Supply Corp.">Pharma-Supply Corp.</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Medicamento Requerido</label>
              <select 
                className="form-control"
                value={medicamento}
                onChange={(e) => setMedicamento(e.target.value)}
              >
                <option value="Amoxicilina 500mg">Amoxicilina 500mg</option>
                <option value="Ibuprofeno 400mg">Ibuprofeno 400mg</option>
                <option value="Paracetamol 500mg">Paracetamol 500mg</option>
                <option value="Losartán 50mg">Losartán 50mg</option>
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div className="form-group">
                <label className="form-label">Cantidad</label>
                <input
                  type="number"
                  className="form-control"
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                  min="1"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Costo Pactado</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  min="0.1"
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
              Emitir RFQ
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
