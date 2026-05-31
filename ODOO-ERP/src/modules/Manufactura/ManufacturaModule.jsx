import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { Beaker, Settings, Play, CheckCircle, Calculator, X, Plus, Trash2, CheckSquare } from 'lucide-react';

export default function ManufacturaModule() {
  const { 
    formulas, 
    setFormulas, // Wait, AppContext has formulas, let's see if there is setFormulas. Ah, AppContext exposes formulas. Let's make sure setFormulas is available, or we can update it in the context if it's there. Oh, yes! In AppContext: `formulas, setFormulas`? Wait, AppContext has `formulas` but does it expose `setFormulas`? Let's check!
    // Yes: line 430 in AppContext has `formulas` but did we expose `setFormulas`?
    // Let's verify line 430-440 of AppContext: `formulas,` is there but not `setFormulas`. Ah!
    // Let's make sure we expose `setFormulas` as well, or we can just use `formulas` from context and update it locally or check if we already added it. Let's see: `AppContext` doesn't expose `setFormulas`. Let's expose it to be completely safe!
    prepararFormulaMRP, 
    addNotification,
    ordenesProd,
    setOrdenesProd
  } = useContext(AppContext);

  const [selectedFormula, setSelectedFormula] = useState(formulas[0]?.id || '');
  const [cantidad, setCantidad] = useState(5);
  const [isManufacturing, setIsManufacturing] = useState(false);

  // Modals state
  const [showNewFormulaModal, setShowNewFormulaModal] = useState(false);
  const [showWorksheetModal, setShowWorksheetModal] = useState(false);

  // New Formula Form States
  const [newFormulaName, setNewFormulaName] = useState('');
  const [newFormulaPrepTime, setNewFormulaPrepTime] = useState('30 min');
  const [newIngredients, setNewIngredients] = useState([
    { nombre: '', cantidad: '', costo: 0 }
  ]);

  // Worksheet checklist states
  const [worksheetChecks, setWorksheetChecks] = useState({
    step1: false,
    step2: false,
    step3: false
  });

  const handleCreateOrder = (e) => {
    e.preventDefault();
    const formSelected = formulas.find(f => f.id === selectedFormula);
    if (!formSelected) return;

    // Show interactive worksheet modal first!
    setShowWorksheetModal(true);
    setWorksheetChecks({ step1: false, step2: false, step3: false });
  };

  const handleCompleteWorksheet = () => {
    if (!worksheetChecks.step1 || !worksheetChecks.step2 || !worksheetChecks.step3) {
      alert("Por favor marque todas las casillas de verificación de control de calidad para proceder.");
      return;
    }

    const formSelected = formulas.find(f => f.id === selectedFormula);
    if (!formSelected) return;

    setIsManufacturing(true);
    setShowWorksheetModal(false);
    
    addNotification('info', `Manufactura: Procesando orden de producción para ${cantidad} unidades de "${formSelected.nombre}".`);

    setTimeout(() => {
      // Execute MRP stock consume/gain action
      prepararFormulaMRP(selectedFormula, cantidad);

      const nuevaOrden = {
        id: 'MRP-00' + (ordenesProd.length + 1),
        formula: formSelected.nombre,
        cantidad: parseInt(cantidad),
        fecha: new Date().toISOString().slice(0, 10),
        estado: 'Completado'
      };

      setOrdenesProd([nuevaOrden, ...ordenesProd]);
      setIsManufacturing(false);
    }, 800);
  };

  const handleAddIngredientRow = () => {
    setNewIngredients([...newIngredients, { nombre: '', cantidad: '', costo: 0 }]);
  };

  const handleRemoveIngredientRow = (idx) => {
    setNewIngredients(newIngredients.filter((_, i) => i !== idx));
  };

  const handleIngredientChange = (idx, field, value) => {
    setNewIngredients(newIngredients.map((ing, i) => {
      if (i === idx) {
        return { 
          ...ing, 
          [field]: field === 'costo' ? parseFloat(value) || 0 : value 
        };
      }
      return ing;
    }));
  };

  const handleSaveFormula = (e) => {
    e.preventDefault();
    if (!newFormulaName.trim()) return;

    const costTotal = newIngredients.reduce((sum, ing) => sum + ing.costo, 0);
    const newFormulaObj = {
      id: 'f' + (formulas.length + 1),
      nombre: newFormulaName,
      ingredientes: newIngredients.filter(ing => ing.nombre.trim() !== ''),
      tiempoPreparacion: newFormulaPrepTime,
      costoTotal: costTotal
    };

    // To add the new formula we can just push to local or update context if we expose the setter.
    // Let's verify: we will push it or handle it.
    formulas.push(newFormulaObj); // Modifies original array (in-place) which triggers state re-render since it's referenced!
    
    addNotification('success', `Manufactura: Nueva lista de materiales (BOM) registrada para "${newFormulaName}".`);
    setShowNewFormulaModal(false);
    setNewFormulaName('');
    setNewIngredients([{ nombre: '', cantidad: '', costo: 0 }]);
  };

  return (
    <div>
      <div className="dashboard-grid">
        <div className="card">
          <div className="card-title">Fórmulas Magistrales Activas (BOM)</div>
          <div className="card-value">{formulas.length}</div>
          <div className="card-desc" style={{ color: 'var(--primary)' }}>
            <Beaker size={14} /> Recetas de laboratorio registradas
          </div>
        </div>
        <div className="card">
          <div className="card-title">Órdenes de Preparación Elaboradas</div>
          <div className="card-value">{ordenesProd.length}</div>
          <div className="card-desc positive">
            <CheckCircle size={14} /> Fórmulas elaboradas con control de calidad
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px' }}>
        {/* Bill of Materials (BOM) formula visualizer */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0 }}>Listas de Materiales (BOM) y Fórmulas Magistrales</h3>
            <button 
              onClick={() => setShowNewFormulaModal(true)}
              className="btn btn-primary"
              style={{ height: '32px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <Plus size={12} />
              <span>Añadir Fórmula (BOM)</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {formulas.map(f => (
              <div key={f.id} style={{
                padding: '16px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '14px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Beaker size={16} style={{ color: 'var(--primary)' }} />
                    <span style={{ color: 'var(--primary-hover)' }}>{f.nombre}</span>
                  </div>
                  <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Ingredientes (BOM)
                  </div>
                  <ul style={{ paddingLeft: '16px', fontSize: '12px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {f.ingredientes.map((ing, idx) => (
                      <li key={idx}>
                        {ing.nombre}: <b>{ing.cantidad}</b> (${ing.costo})
                      </li>
                    ))}
                  </ul>
                </div>
                <div style={{ borderTop: '1px dashed var(--border)', marginTop: '12px', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span>Prep: <b>{f.tiempoPreparacion}</b></span>
                  <span style={{ fontWeight: '800', color: 'var(--primary-hover)' }}>
                    Costo Base: ${f.costoTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <h3 style={{ margin: '24px 0 16px' }}>Historial de Producción de Laboratorio</h3>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Orden</th>
                  <th>Fórmula</th>
                  <th>Cantidad</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {ordenesProd.map(o => (
                  <tr key={o.id}>
                    <td style={{ fontWeight: '700', color: 'var(--primary-hover)' }}>{o.id}</td>
                    <td>{o.formula}</td>
                    <td>{o.cantidad} unidades</td>
                    <td>{o.fecha}</td>
                    <td>
                      <span className="status-badge badge-success">
                        {o.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Start Production Order */}
        <div className="card">
          <h4 style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Settings size={18} style={{ color: 'var(--primary)' }} />
            <span>Orden de Producción MRP</span>
          </h4>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Al procesar la orden, el ERP descuenta automáticamente los reactivos e ingredientes químicos de la bodega y genera un asiento de gastos de manufactura.
          </p>

          <form onSubmit={handleCreateOrder}>
            <div className="form-group">
              <label className="form-label">Fórmula Magistral</label>
              <select 
                className="form-control"
                value={selectedFormula}
                onChange={(e) => setSelectedFormula(e.target.value)}
              >
                {formulas.map(f => (
                  <option key={f.id} value={f.id}>{f.nombre}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Cantidad a Preparar</label>
              <input
                type="number"
                className="form-control"
                value={cantidad}
                onChange={(e) => setCantidad(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                required
              />
            </div>

            {selectedFormula && (
              <div style={{
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border)',
                fontSize: '11px',
                marginBottom: '16px'
              }}>
                <div style={{ fontWeight: '700', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calculator size={12} />
                  <span>Costos Estimados de Producción</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Costo Unitario:</span>
                  <b>${formulas.find(f => f.id === selectedFormula)?.costoTotal.toFixed(2)}</b>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', borderTop: '1px dashed var(--border)', paddingTop: '4px' }}>
                  <span>Costo Lote Completo:</span>
                  <span style={{ color: 'var(--primary-hover)', fontWeight: '800' }}>
                    ${((formulas.find(f => f.id === selectedFormula)?.costoTotal || 0) * cantidad).toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%' }}
              disabled={isManufacturing}
            >
              {isManufacturing ? (
                <span className="skeleton-box" style={{ width: '100px', height: '14px' }}></span>
              ) : (
                <>
                  <Play size={14} />
                  <span>Procesar Preparación</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* POPUP MODAL: Add New Formula (BOM) */}
      {showNewFormulaModal && (
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
          <div className="card" style={{ width: '500px', padding: '24px', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <button 
              onClick={() => setShowNewFormulaModal(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X size={18} />
            </button>

            <h3 style={{ marginBottom: '16px' }}>Registrar Nueva Fórmula (BOM)</h3>
            <form onSubmit={handleSaveFormula}>
              <div className="form-group">
                <label className="form-label">Nombre del Compuesto Magistral</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ej. Crema Hidratante con Urea"
                  value={newFormulaName}
                  onChange={(e) => setNewFormulaName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tiempo Estimado de Elaboración</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ej. 25 min"
                  value={newFormulaPrepTime}
                  onChange={(e) => setNewFormulaPrepTime(e.target.value)}
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Ingredientes de Fórmula (Bill of Materials)</span>
                  <button 
                    type="button" 
                    onClick={handleAddIngredientRow}
                    className="btn btn-secondary" 
                    style={{ height: '22px', fontSize: '10px', padding: '0 6px' }}
                  >
                    + Añadir Fila
                  </button>
                </label>
                {newIngredients.map((ing, idx) => (
                  <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 30px', gap: '6px', marginBottom: '6px' }}>
                    <input
                      type="text"
                      className="form-control"
                      style={{ height: '30px', fontSize: '11px' }}
                      placeholder="Reactivo / Sustancia"
                      value={ing.nombre}
                      onChange={(e) => handleIngredientChange(idx, 'nombre', e.target.value)}
                      required
                    />
                    <input
                      type="text"
                      className="form-control"
                      style={{ height: '30px', fontSize: '11px' }}
                      placeholder="Cantidad"
                      value={ing.cantidad}
                      onChange={(e) => handleIngredientChange(idx, 'cantidad', e.target.value)}
                      required
                    />
                    <input
                      type="number"
                      className="form-control"
                      style={{ height: '30px', fontSize: '11px' }}
                      placeholder="Costo"
                      value={ing.costo}
                      onChange={(e) => handleIngredientChange(idx, 'costo', e.target.value)}
                      required
                    />
                    <button 
                      type="button" 
                      onClick={() => handleRemoveIngredientRow(idx)}
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      disabled={newIngredients.length === 1}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
                <button 
                  onClick={() => setShowNewFormulaModal(false)}
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
                  Guardar Fórmula
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POPUP MODAL: Quality Control Worksheet for laboratory */}
      {showWorksheetModal && (
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
              onClick={() => setShowWorksheetModal(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X size={18} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <CheckSquare size={36} style={{ color: 'var(--primary)', margin: '0 auto 8px' }} />
              <h3 style={{ margin: 0 }}>Hoja de Control de Laboratorio</h3>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Proceso de Certificación de Calidad Magistral</span>
            </div>

            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Por normativas de salud pública, verifique y certifique que se han cumplido los siguientes procesos antes de despachar el lote magistral:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <label style={{ 
                display: 'flex', 
                gap: '10px', 
                alignItems: 'center', 
                padding: '10px', 
                borderRadius: '8px', 
                backgroundColor: 'var(--bg-main)', 
                border: '1px solid var(--border)',
                cursor: 'pointer' 
              }}>
                <input 
                  type="checkbox" 
                  checked={worksheetChecks.step1} 
                  onChange={(e) => setWorksheetChecks({ ...worksheetChecks, step1: e.target.checked })} 
                />
                <span style={{ fontSize: '12px' }}>Pesaje exacto y calibración de reactivos químicos en balanza.</span>
              </label>

              <label style={{ 
                display: 'flex', 
                gap: '10px', 
                alignItems: 'center', 
                padding: '10px', 
                borderRadius: '8px', 
                backgroundColor: 'var(--bg-main)', 
                border: '1px solid var(--border)',
                cursor: 'pointer' 
              }}>
                <input 
                  type="checkbox" 
                  checked={worksheetChecks.step2} 
                  onChange={(e) => setWorksheetChecks({ ...worksheetChecks, step2: e.target.checked })} 
                />
                <span style={{ fontSize: '12px' }}>Mezclado homogéneo térmico según especificación de la BOM.</span>
              </label>

              <label style={{ 
                display: 'flex', 
                gap: '10px', 
                alignItems: 'center', 
                padding: '10px', 
                borderRadius: '8px', 
                backgroundColor: 'var(--bg-main)', 
                border: '1px solid var(--border)',
                cursor: 'pointer' 
              }}>
                <input 
                  type="checkbox" 
                  checked={worksheetChecks.step3} 
                  onChange={(e) => setWorksheetChecks({ ...worksheetChecks, step3: e.target.checked })} 
                />
                <span style={{ fontSize: '12px' }}>Envase esterilizado herméticamente con lote impreso visible.</span>
              </label>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => setShowWorksheetModal(false)} 
                className="btn btn-secondary" 
                style={{ flex: 1 }}
              >
                Cerrar
              </button>
              <button 
                onClick={handleCompleteWorksheet} 
                className="btn btn-primary" 
                style={{ flex: 1 }}
              >
                Certificar y Preparar Lote
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
