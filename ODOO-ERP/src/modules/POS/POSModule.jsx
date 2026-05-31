import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { Search, ShoppingCart, User, QrCode, CreditCard, Banknote, Wifi, WifiOff, Trash2 } from 'lucide-react';

export default function POSModule() {
  const { 
    inventario, 
    pacientes, 
    registrarVentaPOS, 
    isOnline, 
    setIsOnline, 
    offlineQueue, 
    syncOfflineOrders 
  } = useContext(AppContext);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPaciente, setSelectedPaciente] = useState('');
  const [cart, setCart] = useState([]);
  
  // Checkout popup states
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(''); // 'cash', 'card', 'qr'
  const [changeAmount, setChangeAmount] = useState(0);
  const [cashReceived, setCashReceived] = useState('');

  const filteredProducts = inventario.filter(prod =>
    prod.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prod.categoria.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...prev, { ...product, cantidad: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev => prev.map(item =>
      item.id === id ? { ...item, cantidad: newQty } : item
    ));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setShowPaymentModal(true);
  };

  const processPayment = () => {
    const res = registrarVentaPOS(cart, selectedPaciente || null, paymentMethod);
    if (res.success) {
      if (res.offline) {
        alert(`¡Venta Registrada Fuera de Línea (Offline) con éxito!\n\nID Temporal: ${res.id}\nLa transacción se sincronizará automáticamente en cuanto se restablezca la conexión de red.`);
      } else {
        alert(`¡Cobro Procesado con Éxito!\n\nFactura Electrónica: ${res.id}\n\n1. El stock de medicamentos se ha deducido en el módulo de Inventario.\n2. Los asientos de ventas e IVA se han conciliado en Contabilidad.\n3. La factura electrónica ha sido enviada a Impuestos Nacionales.`);
      }
      setCart([]);
      setSelectedPaciente('');
      setShowPaymentModal(false);
      setPaymentMethod('');
      setCashReceived('');
      setChangeAmount(0);
    }
  };

  const handleCashChange = (val) => {
    setCashReceived(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num >= cartTotal) {
      setChangeAmount(num - cartTotal);
    } else {
      setChangeAmount(0);
    }
  };

  return (
    <div className="pos-container">
      {/* POS Catalog Section */}
      <div className="pos-products">
        {/* Connection Bar & Search */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
          <div className="search-wrapper" style={{ flex: 1 }}>
            <Search className="search-icon" size={16} />
            <input
              type="text"
              className="search-input"
              placeholder="Buscar medicamentos (ej: paracetamol, cardiovascular)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Online/Offline simulation trigger */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => {
                if (isOnline) {
                  setIsOnline(false);
                } else {
                  syncOfflineOrders();
                }
              }}
              className={`btn ${isOnline ? 'btn-secondary' : 'btn-danger'}`}
              style={{ height: '38px', whiteSpace: 'nowrap' }}
            >
              {isOnline ? (
                <>
                  <Wifi size={16} />
                  <span>Modo Online</span>
                </>
              ) : (
                <>
                  <WifiOff size={16} />
                  <span>Modo Offline ({offlineQueue.length} Ptes)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="pos-grid">
          {filteredProducts.map(prod => {
            const isLow = prod.stock <= prod.minStock;
            return (
              <div 
                key={prod.id} 
                className="pos-product-card"
                onClick={() => addToCart(prod)}
              >
                <span className={`stock-badge ${isLow ? 'stock-low' : 'stock-high'}`}>
                  Stock: {prod.stock}
                </span>
                
                <div style={{
                  height: '80px',
                  backgroundColor: 'var(--bg-main)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}>
                  {prod.imagen ? (
                    <img 
                      src={prod.imagen} 
                      alt={prod.nombre} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  ) : (
                    <span style={{ fontSize: '28px' }}>💊</span>
                  )}
                </div>

                <div className="pos-product-name">{prod.nombre}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  {prod.categoria}
                </div>
                <div className="pos-product-price">${prod.precio.toFixed(2)}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tactile POS Cart Summary */}
      <div className="pos-cart">
        <div className="pos-cart-header">
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingCart size={18} />
            <span>Detalle del Pedido</span>
          </span>
          <span className="kanban-count">{cart.reduce((sum, i) => sum + i.cantidad, 0)} items</span>
        </div>

        {/* CRM Loyalty Selector */}
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
          <div className="form-group" style={{ marginBottom: '0' }}>
            <label className="form-label" style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <User size={12} />
              <span>Cliente / Paciente CRM (Acu. Puntos)</span>
            </label>
            <select
              className="form-control"
              style={{ height: '34px', fontSize: '12px' }}
              value={selectedPaciente}
              onChange={(e) => setSelectedPaciente(e.target.value)}
            >
              <option value="">-- Cliente Genérico (Sin Puntos) --</option>
              {pacientes.map(p => (
                <option key={p.id} value={p.id}>{p.nombre} ({p.puntos} pts)</option>
              ))}
            </select>
          </div>
        </div>

        {/* Cart items list */}
        <div className="pos-cart-items">
          {cart.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: 'var(--text-muted)',
              fontSize: '13px',
              textAlign: 'center',
              padding: '24px'
            }}>
              🛒
              <div style={{ marginTop: '8px' }}>El carrito de ventas está vacío. Haga clic en los fármacos del catálogo para agregarlos.</div>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="pos-cart-item">
                <div style={{ flex: 1, minWidth: 0, paddingRight: '8px' }}>
                  <div style={{ fontWeight: '700', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {item.nombre}
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
                    ${item.precio.toFixed(2)} x {item.cantidad}
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="number"
                    value={item.cantidad}
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                    style={{
                      width: '45px',
                      height: '28px',
                      textAlign: 'center',
                      borderRadius: '4px',
                      border: '1px solid var(--border)',
                      backgroundColor: 'var(--bg-main)',
                      color: 'var(--text-main)',
                      fontSize: '12px'
                    }}
                  />
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      color: 'var(--danger)',
                      cursor: 'pointer'
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Totals */}
        <div className="pos-cart-totals">
          <div className="pos-cart-row">
            <span>Subtotal:</span>
            <span>${(cartTotal / 1.16).toFixed(2)}</span>
          </div>
          <div className="pos-cart-row">
            <span>IVA Retenido (16%):</span>
            <span>${(cartTotal - (cartTotal / 1.16)).toFixed(2)}</span>
          </div>
          <div className="pos-cart-row pos-cart-total" style={{ borderTop: '1px dashed var(--border)', paddingTop: '8px', marginTop: '4px' }}>
            <span>Total a Pagar:</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Cart Actions */}
        <div className="pos-cart-actions">
          <button
            onClick={() => setCart([])}
            className="btn btn-secondary"
            style={{ flex: '0 0 50px', padding: '0', display: 'flex', alignItems: 'center', justify: 'center' }}
            disabled={cart.length === 0}
          >
            <Trash2 size={16} />
          </button>
          <button
            onClick={handleCheckout}
            className="btn btn-primary"
            style={{ flex: 1 }}
            disabled={cart.length === 0}
          >
            PAGAR PEDIDO
          </button>
        </div>
      </div>

      {/* POS Checkout tactile payment modal simulator */}
      {showPaymentModal && (
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
          <div className="card" style={{ width: '450px', padding: '24px' }}>
            <h3 style={{ marginBottom: '16px', textAlign: 'center' }}>Seleccionar Método de Pago</h3>
            
            {/* Total Indicator */}
            <div style={{
              textAlign: 'center',
              padding: '16px',
              backgroundColor: 'var(--secondary)',
              borderRadius: '8px',
              fontSize: '24px',
              fontWeight: '800',
              color: 'var(--primary-hover)',
              marginBottom: '20px'
            }}>
              Total: ${cartTotal.toFixed(2)}
            </div>

            {/* Methods Options Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <div 
                onClick={() => setPaymentMethod('cash')}
                style={{
                  border: `2px solid ${paymentMethod === 'cash' ? 'var(--primary)' : 'var(--border)'}`,
                  borderRadius: '12px',
                  padding: '16px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: paymentMethod === 'cash' ? 'var(--secondary)' : 'var(--bg-surface)'
                }}
              >
                <Banknote size={24} style={{ margin: '0 auto 8px', color: 'var(--primary-hover)' }} />
                <span style={{ fontSize: '12px', fontWeight: '700' }}>Efectivo</span>
              </div>
              <div 
                onClick={() => setPaymentMethod('card')}
                style={{
                  border: `2px solid ${paymentMethod === 'card' ? 'var(--primary)' : 'var(--border)'}`,
                  borderRadius: '12px',
                  padding: '16px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: paymentMethod === 'card' ? 'var(--secondary)' : 'var(--bg-surface)'
                }}
              >
                <CreditCard size={24} style={{ margin: '0 auto 8px', color: 'var(--primary-hover)' }} />
                <span style={{ fontSize: '12px', fontWeight: '700' }}>Tarjeta (Chip)</span>
              </div>
              <div 
                onClick={() => setPaymentMethod('qr')}
                style={{
                  border: `2px solid ${paymentMethod === 'qr' ? 'var(--primary)' : 'var(--border)'}`,
                  borderRadius: '12px',
                  padding: '16px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: paymentMethod === 'qr' ? 'var(--secondary)' : 'var(--bg-surface)'
                }}
              >
                <QrCode size={24} style={{ margin: '0 auto 8px', color: 'var(--primary-hover)' }} />
                <span style={{ fontSize: '12px', fontWeight: '700' }}>Código QR</span>
              </div>
            </div>

            {/* Sub-panels based on choice */}
            {paymentMethod === 'cash' && (
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label">Efectivo Recibido</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Ingrese el monto recibido (ej. 50)..."
                  value={cashReceived}
                  onChange={(e) => handleCashChange(e.target.value)}
                />
                {changeAmount > 0 && (
                  <div style={{ marginTop: '8px', color: 'var(--success)', fontWeight: '700', fontSize: '13px' }}>
                    Cambio a entregar: ${changeAmount.toFixed(2)}
                  </div>
                )}
              </div>
            )}

            {paymentMethod === 'qr' && (
              <div style={{
                textAlign: 'center',
                padding: '12px',
                backgroundColor: 'var(--bg-main)',
                borderRadius: '8px',
                marginBottom: '20px'
              }}>
                <div style={{ width: '120px', height: '120px', backgroundColor: '#FFF', border: '1px solid #CCC', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justify: 'center' }}>
                  <QrCode size={100} style={{ color: '#000' }} />
                </div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Escanee desde la app bancaria del paciente</span>
              </div>
            )}

            {paymentMethod === 'card' && (
              <div style={{
                textAlign: 'center',
                padding: '16px',
                backgroundColor: 'var(--bg-main)',
                borderRadius: '8px',
                marginBottom: '20px',
                fontSize: '12px'
              }}>
                💳 Inserte tarjeta en el lector inalámbrico...
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => {
                  setShowPaymentModal(false);
                  setPaymentMethod('');
                }}
                className="btn btn-secondary" 
                style={{ flex: 1 }}
              >
                Cancelar
              </button>
              <button 
                onClick={processPayment}
                className="btn btn-primary" 
                style={{ flex: 1 }}
                disabled={!paymentMethod || (paymentMethod === 'cash' && (!cashReceived || parseFloat(cashReceived) < cartTotal))}
              >
                PROCESAR COBRO
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
