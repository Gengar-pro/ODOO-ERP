import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { Globe, ShoppingCart, MessageSquare, Send, Plus, X, Laptop } from 'lucide-react';

export default function SitioWebModule() {
  const { chatMessages, sendChatMessage, inventario, facturas, addNotification } = useContext(AppContext);
  const [typedMessage, setTypedMessage] = useState('');

  // Local state for interactive catalogue adjustment
  const [publishedProducts, setPublishedProducts] = useState(() => {
    return inventario.slice(0, 4).map(p => ({ ...p, webPrice: p.precio }));
  });
  const [showAddWebProductModal, setShowAddWebProductModal] = useState(false);
  const [selectedInventarioId, setSelectedInventarioId] = useState(inventario[4]?.id || '');

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;
    sendChatMessage(typedMessage);
    setTypedMessage('');
  };

  const handleAddWebProduct = (e) => {
    e.preventDefault();
    const prod = inventario.find(p => p.id === selectedInventarioId);
    if (!prod) return;

    if (publishedProducts.some(p => p.id === prod.id)) {
      alert("Este fármaco ya se encuentra publicado en el catálogo web.");
      return;
    }

    setPublishedProducts([...publishedProducts, { ...prod, webPrice: prod.precio }]);
    setShowAddWebProductModal(false);
    addNotification('success', `Sitio Web: Se publicó "${prod.nombre}" en la tienda e-commerce.`);
  };

  const handleRemoveWebProduct = (id) => {
    setPublishedProducts(publishedProducts.filter(p => p.id !== id));
    addNotification('info', `Sitio Web: Se retiró el fármaco del catálogo público.`);
  };

  const handleSendCannedResponse = (text) => {
    sendChatMessage(text);
    addNotification('info', 'Sitio Web: Canned response enviada.');
  };

  const webOrders = facturas.filter(f => f.modulo === 'Sitio Web');

  return (
    <div>
      <div className="dashboard-grid">
        <div className="card">
          <div className="card-title">Sitio Web Estado</div>
          <div className="card-value" style={{ color: 'var(--success)' }}>ONLINE</div>
          <div className="card-desc" style={{ color: 'var(--primary)' }}>
            <Globe size={14} /> E-commerce y chat activos
          </div>
        </div>
        <div className="card">
          <div className="card-title">Pedidos Web del Día</div>
          <div className="card-value">{webOrders.length}</div>
          <div className="card-desc positive">
            <ShoppingCart size={14} /> Entregas a domicilio despachadas
          </div>
        </div>
        <div className="card">
          <div className="card-title">Sesiones de Chat Activas</div>
          <div className="card-value">1</div>
          <div className="card-desc" style={{ color: 'var(--primary)' }}>
            <MessageSquare size={14} /> Soporte de salud disponible
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px' }}>
        {/* Catalog and Orders */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* E-commerce builder mock catalog preview */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0 }}>Constructor del Catálogo Online de la Farmacia</h3>
              <button 
                onClick={() => setShowAddWebProductModal(true)}
                className="btn btn-primary"
                style={{ height: '32px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Plus size={12} />
                <span>Publicar Fármaco</span>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
              {publishedProducts.map(prod => (
                <div key={prod.id} style={{
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-main)',
                  border: '1px solid var(--border)',
                  textAlign: 'center',
                  position: 'relative'
                }}>
                  <button 
                    onClick={() => handleRemoveWebProduct(prod.id)}
                    style={{ position: 'absolute', top: '8px', right: '8px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--danger)', fontWeight: '700' }}
                  >
                    <X size={14} />
                  </button>
                  <div style={{ fontSize: '24px', marginBottom: '6px' }}>💊</div>
                  <div style={{ fontWeight: '700', fontSize: '13px', color: 'var(--primary-hover)' }}>{prod.nombre}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '2px' }}>{prod.categoria}</div>
                  <div style={{ color: 'var(--primary-hover)', fontWeight: '700', fontSize: '12px', marginTop: '4px' }}>
                    ${prod.webPrice.toFixed(2)}
                  </div>
                  <span className="status-badge badge-success" style={{ fontSize: '9px', padding: '2px 6px', marginTop: '6px', display: 'inline-block' }}>
                    Publicado en Web
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Web orders table */}
          <div className="card">
            <h3>Pedidos Recibidos desde E-commerce</h3>
            <div className="table-container" style={{ marginTop: '12px' }}>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Orden</th>
                    <th>Fecha</th>
                    <th>Paciente</th>
                    <th>Total</th>
                    <th>Estado Despacho</th>
                  </tr>
                </thead>
                <tbody>
                  {webOrders.map(o => (
                    <tr key={o.id}>
                      <td style={{ fontWeight: '700', color: 'var(--primary-hover)' }}>{o.id}</td>
                      <td>{o.fecha}</td>
                      <td>{o.cliente}</td>
                      <td style={{ fontWeight: '700' }}>${o.total.toFixed(2)}</td>
                      <td>
                        <span className="status-badge badge-success">
                          Completado y Despachado
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Live Chat Simulated Console */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '520px' }}>
          <h4 style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={18} style={{ color: 'var(--primary)' }} />
            <span>Consola de Chat Clínico en Vivo</span>
          </h4>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '10px' }}>
            Canal directo del Sitio Web para resolver dudas sobre medicamentos de los pacientes en tiempo real.
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
            {chatMessages.map((msg, idx) => (
              <div key={msg.id || idx} style={{
                maxWidth: '85%',
                padding: '8px 12px',
                borderRadius: '12px',
                fontSize: '11px',
                alignSelf: msg.sender === 'agent' ? 'flex-start' : 'flex-end',
                backgroundColor: msg.sender === 'agent' ? 'var(--secondary)' : 'var(--primary)',
                color: msg.sender === 'agent' ? 'var(--text-main)' : '#1A2238',
                borderBottomLeftRadius: msg.sender === 'agent' ? '2px' : '12px',
                borderBottomRightRadius: msg.sender === 'user' ? '2px' : '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}>
                {msg.text}
              </div>
            ))}
          </div>

          {/* Quick clinical templates */}
          <div style={{ marginBottom: '10px' }}>
            <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>
              Plantillas de Respuesta Rápida
            </div>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              <button 
                onClick={() => handleSendCannedResponse("Hola, de acuerdo a la ley de salud, este medicamento requiere receta médica física o firma digital autorizada.")}
                className="btn btn-secondary" 
                style={{ fontSize: '9px', height: '22px', padding: '0 6px' }}
              >
                Solicitar Receta
              </button>
              <button 
                onClick={() => handleSendCannedResponse("Contamos con stock disponible inmediato para delivery en todas nuestras sucursales.")}
                className="btn btn-secondary" 
                style={{ fontSize: '9px', height: '22px', padding: '0 6px' }}
              >
                Stock Delivery
              </button>
            </div>
          </div>

          <form onSubmit={handleSendChat} style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Responda al paciente..."
              value={typedMessage}
              onChange={(e) => setTypedMessage(e.target.value)}
              style={{ fontSize: '12px', height: '36px' }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '0 12px', height: '36px' }}>
              <Send size={14} />
            </button>
          </form>
        </div>
      </div>

      {/* POPUP MODAL: Add Product to Web Catalogue */}
      {showAddWebProductModal && (
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
              onClick={() => setShowAddWebProductModal(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Laptop size={24} style={{ color: 'var(--primary)' }} />
              <h3 style={{ margin: 0 }}>Publicar en Tienda Online</h3>
            </div>

            <form onSubmit={handleAddWebProduct}>
              <div className="form-group">
                <label className="form-label">Seleccionar Fármaco de Inventario</label>
                <select
                  className="form-control"
                  value={selectedInventarioId}
                  onChange={(e) => setSelectedInventarioId(e.target.value)}
                >
                  {inventario.map(prod => (
                    <option key={prod.id} value={prod.id}>{prod.nombre} (Stock: {prod.stock})</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
                <button 
                  onClick={() => setShowAddWebProductModal(false)}
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
                  Publicar Fármaco
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
