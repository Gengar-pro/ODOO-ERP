import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

const initialPacientes = [
  { id: '1', nombre: 'María López', telefono: '+591 70123456', tratamiento: 'Metformina 850mg (Crónico)', puntos: 120, email: 'maria.lopez@gmail.com', ultimaCompra: '2026-05-10' },
  { id: '2', nombre: 'Carlos Ruiz', telefono: '+591 60876543', tratamiento: 'Losartán 50mg (Crónico)', puntos: 80, email: 'carlos.ruiz@hotmail.com', ultimaCompra: '2026-05-14' },
  { id: '3', nombre: 'Ana Torres', telefono: '+591 71223344', tratamiento: 'Atorvastatina 20mg (Crónico)', puntos: 250, email: 'ana.torres@yahoo.com', ultimaCompra: '2026-05-18' },
  { id: '4', nombre: 'Pedro García', telefono: '+591 65432100', tratamiento: 'Ninguno', puntos: 15, email: 'pedro.garcia@outlook.com', ultimaCompra: '2026-05-12' }
];

const initialInventario = [
  { id: 'p1', nombre: 'Paracetamol 500mg', stock: 45, lote: 'L-PAR202', vencimiento: '2027-10-15', minStock: 20, precio: 2.5, categoria: 'Analgesia', imagen: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80' },
  { id: 'p2', nombre: 'Ibuprofeno 400mg', stock: 12, lote: 'L-IBU304', vencimiento: '2026-06-30', minStock: 15, precio: 3.8, categoria: 'Antiinflamatorio', imagen: 'https://images.unsplash.com/photo-1607619056574-7b8f304b3b8a?w=400&q=80' },
  { id: 'p3', nombre: 'Metformina 850mg', stock: 68, lote: 'L-MET101', vencimiento: '2028-02-28', minStock: 30, precio: 4.2, categoria: 'Antidiabético', imagen: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400&q=80' },
  { id: 'p4', nombre: 'Losartán 50mg', stock: 9, lote: 'L-LOS509', vencimiento: '2027-01-20', minStock: 10, precio: 5.5, categoria: 'Cardiovascular', imagen: 'https://images.unsplash.com/photo-1628771065518-0d82f11181a6?w=400&q=80' },
  { id: 'p5', nombre: 'Atorvastatina 20mg', stock: 32, lote: 'L-ATO808', vencimiento: '2027-08-05', minStock: 12, precio: 6.0, categoria: 'Cardiovascular', imagen: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&q=80' },
  { id: 'p6', nombre: 'Amoxicilina 500mg', stock: 5, lote: 'L-AMO402', vencimiento: '2026-05-25', minStock: 15, precio: 7.5, categoria: 'Antibiótico', imagen: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80' },
  { id: 'p7', nombre: 'Preparación Magistral Antiacné', stock: 3, lote: 'M-ACN01', vencimiento: '2026-08-10', minStock: 5, precio: 45.0, categoria: 'Fórmula Magistral', imagen: 'https://images.unsplash.com/photo-1608248597481-496100c80836?w=400&q=80' }
];

const initialFormulas = [
  { 
    id: 'f1', 
    nombre: 'Preparación Magistral Antiacné', 
    ingredientes: [
      { nombre: 'Ácido Salicílico', cantidad: '2g', costo: 5 },
      { nombre: 'Eritromicina Base', cantidad: '4g', costo: 12 },
      { nombre: 'Base Gel Carbopol', cantidad: '94g', costo: 6 }
    ],
    tiempoPreparacion: '45 min',
    costoTotal: 23.0
  },
  { 
    id: 'f2', 
    nombre: 'Jarabe de Eucalipto Compuesto', 
    ingredientes: [
      { nombre: 'Extracto Fluido de Eucalipto', cantidad: '10ml', costo: 3 },
      { nombre: 'Extracto de Pulmonaria', cantidad: '10ml', costo: 4 },
      { nombre: 'Jarabe Simple USP', cantidad: '80ml', costo: 2 }
    ],
    tiempoPreparacion: '30 min',
    costoTotal: 9.0
  }
];

const initialFacturas = [
  { id: 'F-001', fecha: '2026-05-19 14:32', cliente: 'María López', total: 42.50, subtotal: 36.64, impuesto: 5.86, estado: 'Emitido', xmlEstado: 'Aceptado por Impuestos', modulo: 'POS' },
  { id: 'F-002', fecha: '2026-05-19 15:10', cliente: 'Carlos Ruiz', total: 11.00, subtotal: 9.48, impuesto: 1.52, estado: 'Emitido', xmlEstado: 'Aceptado por Impuestos', modulo: 'POS' },
  { id: 'F-003', fecha: '2026-05-18 10:15', cliente: 'General Public', total: 7.50, subtotal: 6.47, impuesto: 1.03, estado: 'Emitido', xmlEstado: 'Aceptado por Impuestos', modulo: 'Sitio Web' }
];

const initialCompras = [
  { id: 'RFQ-001', proveedor: 'Laboratorios Droguería INTI', fecha: '2026-05-19', items: [{ producto: 'Amoxicilina 500mg', cantidad: 50, precio: 3.5 }], total: 175.0, estado: 'Confirmado' },
  { id: 'RFQ-002', proveedor: 'Laboratorios BAGO', fecha: '2026-05-18', items: [{ producto: 'Ibuprofeno 400mg', cantidad: 100, precio: 1.8 }], total: 180.0, estado: 'Borrador' }
];

const initialRrhh = [
  { id: 'e1', nombre: 'Lic. Eduardo Sotomayor', rol: 'Regente Farmacéutico', asistencia: 'Fuera', checkInTime: '', vacacionesDisponibles: 15 },
  { id: 'e2', nombre: 'Patricia Benavidez', rol: 'Encargada de Almacén', asistencia: 'Dentro', checkInTime: '2026-05-19 08:02', vacacionesDisponibles: 12 },
  { id: 'e3', nombre: 'Roberto Canales', rol: 'Auxiliar de POS', asistencia: 'Dentro', checkInTime: '2026-05-19 08:30', vacacionesDisponibles: 10 },
  { id: 'e4', nombre: 'Mónica Vaca', rol: 'Contadora General', asistencia: 'Dentro', checkInTime: '2026-05-19 08:45', vacacionesDisponibles: 8 }
];

const initialTickets = [
  { id: 'TK-101', paciente: 'María López', consulta: '¿Puedo tomar Paracetamol junto a Metformina?', sla: '2 horas', asignado: 'Regente Farmacéutico', estado: 'Abierto', urgencia: 'Alta' },
  { id: 'TK-102', paciente: 'Pedro García', consulta: 'Duda sobre el envío a domicilio de jarabe magistral', sla: '24 horas', asignado: 'Soporte Web', estado: 'Resuelto', urgencia: 'Baja' }
];

const initialProyectos = [
  { id: 'pr1', nombre: 'Campaña de Vacunación contra la Influenza 2026', tareas: 8, completado: 6, encargado: 'RRHH & Marketing', fin: '2026-06-01' },
  { id: 'pr2', nombre: 'Apertura de Sucursal Zona Sur', tareas: 15, completado: 4, encargado: 'Operaciones', fin: '2026-07-15' }
];

const initialUsers = [
  { username: 'admin', password: 'admin999', name: 'Admin Pharma', role: 'Administrador', modules: ['CRM', 'Ventas', 'Contabilidad', 'Inventario', 'Compras', 'Manufactura', 'RRHH', 'Punto de Venta', 'Sitio Web', 'Marketing', 'Proyectos', 'Mesa de Ayuda'] },
  { username: 'RRHH', password: 'RRHH999', name: 'Lic. Sofía Montenegro', role: 'Recursos Humanos', modules: ['RRHH', 'Proyectos', 'Mesa de Ayuda'] },
  { username: 'contas', password: 'contas999', name: 'Mónica Vaca', role: 'Contador', modules: ['Contabilidad', 'Ventas', 'Compras', 'CRM'] },
  { username: 'farmacia', password: 'farmacia999', name: 'Lic. Eduardo Sotomayor', role: 'Regente Farmacéutico', modules: ['Punto de Venta', 'Inventario', 'Manufactura', 'Mesa de Ayuda'] },
  { username: 'stock', password: 'stock999', name: 'Patricia Benavidez', role: 'Encargado de Almacén', modules: ['Inventario', 'Compras'] },
  { username: 'market', password: 'market999', name: 'Julio Villarroel', role: 'Especialista en Marketing', modules: ['Marketing', 'Sitio Web', 'CRM'] }
];

export const AppProvider = ({ children }) => {
  // Database States loaded from LocalStorage or mock fallback
  const [usersList, setUsersList] = useState(() => {
    const saved = localStorage.getItem('db_usersList');
    return saved ? JSON.parse(saved) : initialUsers;
  });

  // Session State
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('pharma_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeTheme, setActiveTheme] = useState(() => {
    const saved = localStorage.getItem('pharma_theme');
    return saved || 'light';
  });

  // Dual View Selector: 'desktop' or 'mobile'
  const [activeView, setActiveView] = useState('desktop');

  // Network Offline Mode simulation state
  const [isOnline, setIsOnline] = useState(true);
  const [offlineQueue, setOfflineQueue] = useState([]);

  // Database States loaded from LocalStorage or mock fallback
  const [pacientes, setPacientes] = useState(() => {
    const saved = localStorage.getItem('db_pacientes');
    return saved ? JSON.parse(saved) : initialPacientes;
  });
  const [inventario, setInventario] = useState(() => {
    const saved = localStorage.getItem('db_inventario');
    return saved ? JSON.parse(saved) : initialInventario;
  });

  const [publishedProducts, setPublishedProducts] = useState(() => {
    const saved = localStorage.getItem('db_publishedProducts');
    return saved ? JSON.parse(saved) : inventario.slice(0, 4).map(p => ({ ...p, webPrice: p.precio }));
  });
  const [formulas, setFormulas] = useState(() => {
    const saved = localStorage.getItem('db_formulas');
    return saved ? JSON.parse(saved) : initialFormulas;
  });
  const [facturas, setFacturas] = useState(() => {
    const saved = localStorage.getItem('db_facturas');
    return saved ? JSON.parse(saved) : initialFacturas;
  });
  const [compras, setCompras] = useState(() => {
    const saved = localStorage.getItem('db_compras');
    return saved ? JSON.parse(saved) : initialCompras;
  });
  const [rrhh, setRrhh] = useState(initialRrhh);
  const [tickets, setTickets] = useState(() => {
    const saved = localStorage.getItem('db_tickets');
    return saved ? JSON.parse(saved) : initialTickets;
  });
  const [proyectos, setProyectos] = useState(initialProyectos);

  // Marketing SMS/Email campaign logs
  const [campanas, setCampanas] = useState([
    { id: 'C-01', nombre: 'Salud Cardiovascular Mayo', tipo: 'SMS', segmento: 'Pacientes Crónicos (Hipertensos)', estado: 'Enviado', fecha: '2026-05-10', clics: 42 },
    { id: 'C-02', nombre: 'Previsión de Diabetes Invierno', tipo: 'Email', segmento: 'Pacientes con Metformina', estado: 'Programado', fecha: '2026-05-22', clics: 0 }
  ]);

  // Direct Live Chat simulated list
  const [chatMessages, setChatMessages] = useState(() => {
    const saved = localStorage.getItem('db_chatMessages');
    return saved ? JSON.parse(saved) : [
      { id: 1, sender: 'agent', text: '¡Hola! Bienvenido al chat de consulta farmacéutica de Pharma-Sync. ¿En qué puedo colaborarte hoy?' },
      { id: 2, sender: 'user', text: 'Buenas tardes, quisiera consultar si la amoxicilina requiere receta física obligatoria.' },
      { id: 3, sender: 'agent', text: 'Sí, de acuerdo al reglamento local de salud, los antibióticos requieren la presentación de su receta médica. Podemos escanearla o validarla digitalmente aquí mismo.' }
    ];
  });

  // Logs & Notifications Center State
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('db_notifications');
    return saved ? JSON.parse(saved) : [
      { id: 'n1', tipo: 'vencimiento', msj: '¡Alerta de Vencimiento! Amoxicilina 500mg vence en menos de una semana (2026-05-25).', leido: false, fecha: 'Hace 5 min' },
      { id: 'n2', tipo: 'stock_bajo', msj: 'Ibuprofeno 400mg se encuentra por debajo del stock mínimo (12/15).', leido: false, fecha: 'Hace 15 min' }
    ];
  });

  const [activeModule, setActiveModule] = useState('CRM');

  // Lifted States for persistence "de por vida" across unmounting tabs
  const [quotes, setQuotes] = useState(() => {
    const saved = localStorage.getItem('db_quotes');
    return saved ? JSON.parse(saved) : [
      { id: 'COT-891', cliente: 'María López', fecha: '2026-05-19', total: 25.00, estado: 'Borrador' },
      { id: 'COT-892', cliente: 'Carlos Ruiz', fecha: '2026-05-18', total: 45.50, estado: 'Firmado y Aprobado' }
    ];
  });

  const [ordenesProd, setOrdenesProd] = useState(() => {
    const saved = localStorage.getItem('db_ordenesProd');
    return saved ? JSON.parse(saved) : [
      { id: 'MRP-001', formula: 'Preparación Magistral Antiacné', cantidad: 3, fecha: '2026-05-19', estado: 'Completado' }
    ];
  });

  const [collabMessages, setCollabMessages] = useState(() => {
    const saved = localStorage.getItem('db_collabMessages');
    return saved ? JSON.parse(saved) : [
      { user: 'Lic. Eduardo Sotomayor', text: 'He confirmado que los refrigeradores de bodega están calibrados a 4°C para recibir las dosis.', time: '10:32 AM' },
      { user: 'Patricia Benavidez', text: '¡Excelente! Quedo atenta al ingreso en el módulo de Compras para su recepción física.', time: '11:15 AM' }
    ];
  });

  const [projectTasks, setProjectTasks] = useState(() => {
    const saved = localStorage.getItem('db_projectTasks');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Definir dosis de vacunas', status: 'Completado', progress: 100 },
      { id: 2, name: 'Reclutar personal voluntario', status: 'En Proceso', progress: 65 },
      { id: 3, name: 'Preparar cadena de frío en bodega', status: 'En Proceso', progress: 40 },
      { id: 4, name: 'Campañas de difusión en Marketing', status: 'Pendiente', progress: 0 }
    ];
  });

  const [bankTransactions, setBankTransactions] = useState(() => {
    const saved = localStorage.getItem('db_bankTransactions');
    return saved ? JSON.parse(saved) : [
      { id: 'TX-BANK-09', descripcion: 'ABONO POS PHARMA-SYNC RECAUDACIÓN', monto: 42.50, fecha: '2026-05-19', conciliada: false, matchingInvoice: 'F-001' },
      { id: 'TX-BANK-10', descripcion: 'PAGO TARJETA DE CRÉDITO POS', monto: 11.00, fecha: '2026-05-19', conciliada: false, matchingInvoice: 'F-002' },
      { id: 'TX-BANK-11', descripcion: 'TRANSFERENCIA E-COMMERCE PORTAL', monto: 7.50, fecha: '2026-05-18', conciliada: false, matchingInvoice: 'F-003' }
    ];
  });

  const [knowledgeResult, setKnowledgeResult] = useState(null);

  const [kanbanItems, setKanbanItems] = useState(() => {
    const saved = localStorage.getItem('db_kanbanItems');
    return saved ? JSON.parse(saved) : [
      { id: 'k1', nombre: 'Farmacia Central', paciente: 'María López', monto: '$12,500', nivel: 'hot', etapa: 'Nuevo', medico: 'Dra. Sofía Montenegro', diagnostico: 'Diabetes e Hipertensión leve' },
      { id: 'k2', nombre: 'Tech Solutions SRL', paciente: 'Carlos Ruiz', monto: '$8,200', nivel: 'cold', etapa: 'Nuevo', medico: 'Dr. Julio Villarroel', diagnostico: 'Evaluación general' },
      { id: 'k3', nombre: 'Grupo Industrial Andino', paciente: 'Ana Torres', monto: '$45,000', nivel: 'warm', etapa: 'Calificado', medico: 'Dr. Eduardo Sotomayor', diagnostico: 'Hipercolesterolemia primaria' },
      { id: 'k4', nombre: 'Distribuidora El Sol', paciente: 'Pedro García', monto: '$15,800', nivel: 'cold', etapa: 'Calificado', medico: 'Dra. Sofía Montenegro', diagnostico: 'Revisión preventiva anual' },
      { id: 'k5', nombre: 'Minera Potosí', paciente: 'Luis Mamani', monto: '$120,000', nivel: 'hot', etapa: 'Propuesta', medico: 'Dr. Eduardo Sotomayor', diagnostico: 'Tratamiento crónico combinado' },
      { id: 'k6', nombre: 'Coop. Agropecuaria', paciente: 'Rosa Quispe', monto: '$32,000', nivel: 'warm', etapa: 'Negociación', medico: 'Dra. Sofía Montenegro', diagnostico: 'Control de glucosa en sangre' },
      { id: 'k7', nombre: 'Hotel Sucre Palace', paciente: 'Jorge Mendoza', monto: '$18,500', nivel: 'cold', etapa: 'Negociación', medico: 'Dr. Julio Villarroel', diagnostico: 'Hipertensión refractaria' },
      { id: 'k8', nombre: 'Universidad Mayor', paciente: 'Ramiro Siles', monto: '$55,000', nivel: 'hot', etapa: 'Ganado', medico: 'Dra. Sofía Montenegro', diagnostico: 'Control preventivo' }
    ];
  });

  // LocalStorage Database Synchronizers
  useEffect(() => {
    localStorage.setItem('db_pacientes', JSON.stringify(pacientes));
  }, [pacientes]);

  useEffect(() => {
    localStorage.setItem('db_inventario', JSON.stringify(inventario));
  }, [inventario]);

  useEffect(() => {
    localStorage.setItem('db_publishedProducts', JSON.stringify(publishedProducts));
  }, [publishedProducts]);

  useEffect(() => {
    localStorage.setItem('db_formulas', JSON.stringify(formulas));
  }, [formulas]);

  useEffect(() => {
    localStorage.setItem('db_facturas', JSON.stringify(facturas));
  }, [facturas]);

  useEffect(() => {
    localStorage.setItem('db_compras', JSON.stringify(compras));
  }, [compras]);

  useEffect(() => {
    localStorage.setItem('db_tickets', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem('db_quotes', JSON.stringify(quotes));
  }, [quotes]);

  useEffect(() => {
    localStorage.setItem('db_ordenesProd', JSON.stringify(ordenesProd));
  }, [ordenesProd]);

  useEffect(() => {
    localStorage.setItem('db_projectTasks', JSON.stringify(projectTasks));
  }, [projectTasks]);

  useEffect(() => {
    localStorage.setItem('db_collabMessages', JSON.stringify(collabMessages));
  }, [collabMessages]);

  useEffect(() => {
    localStorage.setItem('db_bankTransactions', JSON.stringify(bankTransactions));
  }, [bankTransactions]);

  useEffect(() => {
    localStorage.setItem('db_kanbanItems', JSON.stringify(kanbanItems));
  }, [kanbanItems]);

  useEffect(() => {
    localStorage.setItem('db_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('db_chatMessages', JSON.stringify(chatMessages));
  }, [chatMessages]);

  // Trigger Day/Night Theme Change
  useEffect(() => {
    const root = window.document.documentElement;
    root.setAttribute('data-theme', activeTheme);
    localStorage.setItem('pharma_theme', activeTheme);
  }, [activeTheme]);

  // Real-time multi-tab and multi-session storage sync engine
  useEffect(() => {
    const handleStorageChange = (e) => {
      try {
        if (e.key === 'db_inventario' && e.newValue) {
          setInventario(JSON.parse(e.newValue));
        }
        if (e.key === 'db_publishedProducts' && e.newValue) {
          setPublishedProducts(JSON.parse(e.newValue));
        }
        if (e.key === 'db_pacientes' && e.newValue) {
          setPacientes(JSON.parse(e.newValue));
        }
        if (e.key === 'db_facturas' && e.newValue) {
          setFacturas(JSON.parse(e.newValue));
        }
        if (e.key === 'db_notifications' && e.newValue) {
          setNotifications(JSON.parse(e.newValue));
        }
        if (e.key === 'pharma_user') {
          setCurrentUser(e.newValue ? JSON.parse(e.newValue) : null);
        }
      } catch (err) {
        console.error('Error synchronizing multi-session storage event:', err);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Login handler
  const login = (username, password) => {
    const userFound = usersList.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);
    if (userFound) {
      setCurrentUser(userFound);
      localStorage.setItem('pharma_user', JSON.stringify(userFound));
      setActiveModule(userFound.modules[0]);
      addNotification('info', `Sesión iniciada: ${userFound.name} (${userFound.role})`);
      return { success: true };
    }
    return { success: false, message: 'Credenciales inválidas. Por favor verifique sus datos.' };
  };

  // Logout handler
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('pharma_user');
    addNotification('info', 'Sesión cerrada exitosamente.');
  };

  // Helper to add global notification alerts
  const addNotification = (tipo, msj) => {
    setNotifications(prev => [
      { id: Date.now().toString(), tipo, msj, leido: false, fecha: 'Ahora mismo' },
      ...prev
    ]);
  };

  // RELATIONAL DATA INTEGRATION: POS Sale workflow
  const registrarVentaPOS = (cart, clienteId, paymentMethod) => {
    if (cart.length === 0) return { success: false, message: 'El carrito está vacío.' };

    const totalVenta = cart.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const subtotal = totalVenta / 1.16;
    const impuesto = totalVenta - subtotal;
    
    let clienteName = 'Público General';
    let clienteObj = null;

    if (clienteId) {
      clienteObj = pacientes.find(p => p.id === clienteId);
      if (clienteObj) clienteName = clienteObj.nombre;
    }

    // 1. Check Internet Mode state
    if (!isOnline) {
      // Register offline queue
      const offlineId = 'OFF-' + Math.floor(Math.random() * 9000 + 1000);
      const offlineOrder = { id: offlineId, cart, clienteId, clienteName, totalVenta, paymentMethod, fecha: new Date().toLocaleString() };
      setOfflineQueue(prev => [...prev, offlineOrder]);
      addNotification('warning', `Venta registrada de manera local (Modo Offline). Pendiente por sincronizar.`);
      return { success: true, offline: true, id: offlineId };
    }

    // 2. Online processing - Update stock
    let stockAlerts = [];
    const newInventario = inventario.map(prod => {
      const cartItem = cart.find(c => c.id === prod.id);
      if (cartItem) {
        const nuevoStock = prod.stock - cartItem.cantidad;
        
        // Trigger Replenish Rule Alert
        if (nuevoStock <= prod.minStock) {
          stockAlerts.push(`${prod.nombre} cayó por debajo del stock mínimo (${nuevoStock}/${prod.minStock}). Regla de reabastecimiento automática activada.`);
        }
        return { ...prod, stock: Math.max(0, nuevoStock) };
      }
      return prod;
    });

    setInventario(newInventario);

    // 3. Register Journal/Invoice in Accounting
    const newFacturaId = 'F-00' + (facturas.length + 1);
    const nuevaFactura = {
      id: newFacturaId,
      fecha: new Date().toLocaleString().slice(0, 16),
      cliente: clienteName,
      total: parseFloat(totalVenta.toFixed(2)),
      subtotal: parseFloat(subtotal.toFixed(2)),
      impuesto: parseFloat(impuesto.toFixed(2)),
      estado: 'Emitido',
      xmlEstado: 'Aceptado por Impuestos',
      modulo: 'POS'
    };
    setFacturas(prev => [nuevaFactura, ...prev]);

    // 4. Update CRM loyalty points & History
    if (clienteId && clienteObj) {
      const puntosGanados = Math.floor(totalVenta * 0.1);
      setPacientes(prev => prev.map(p => {
        if (p.id === clienteId) {
          return {
            ...p,
            puntos: p.puntos + puntosGanados,
            ultimaCompra: new Date().toISOString().slice(0, 10)
          };
        }
        return p;
      }));
      addNotification('success', `CRM: ${clienteName} acumuló +${puntosGanados} puntos de fidelidad.`);
    }

    // 5. Fire Stock triggers
    stockAlerts.forEach(alertMsj => {
      addNotification('stock_bajo', alertMsj);
      // Auto RFQ simulation
      generarRFQAutomatico(alertMsj);
    });

    addNotification('success', `Venta registrada con éxito en POS. Factura electrónica ${newFacturaId} generada.`);
    return { success: true, id: newFacturaId };
  };

  // Auto RFQ generator when stock drops below threshold
  const generarRFQAutomatico = (alertText) => {
    // Find product name in alert
    const matchingProd = inventario.find(p => alertText.includes(p.nombre));
    if (!matchingProd) return;

    const rfqId = 'RFQ-00' + (compras.length + 1);
    const nuevoRFQ = {
      id: rfqId,
      proveedor: matchingProd.categoria === 'Cardiovascular' ? 'Laboratorios BAGO' : 'Laboratorios Droguería INTI',
      fecha: new Date().toISOString().slice(0, 10),
      items: [{ producto: matchingProd.nombre, cantidad: matchingProd.minStock * 3, precio: parseFloat((matchingProd.precio * 0.6).toFixed(2)) }],
      total: parseFloat((matchingProd.minStock * 3 * matchingProd.precio * 0.6).toFixed(2)),
      estado: 'Borrador'
    };

    setCompras(prev => [...prev, nuevoRFQ]);
    addNotification('info', `Compras: Solicitud de cotización ${rfqId} generada automáticamente para reabastecer ${matchingProd.nombre}.`);
  };

  // Sync Offline Queue
  const syncOfflineOrders = () => {
    setIsOnline(true);
    if (offlineQueue.length > 0) {
      offlineQueue.forEach(order => {
        registrarVentaPOS(order.cart, order.clienteId, order.paymentMethod);
      });
      setOfflineQueue([]);
      addNotification('success', '¡Conexión restaurada! Se sincronizaron todas las ventas pendientes de la base local.');
    } else {
      addNotification('success', '¡Conexión restaurada! El sistema vuelve a estar en línea.');
    }
  };

  // Recepción de RFQ Compras -> suma stock
  const recibirCompra = (rfqId) => {
    const order = compras.find(c => c.id === rfqId);
    if (!order) return;

    // Update stocks
    const newInventario = inventario.map(prod => {
      const boughtItem = order.items.find(item => item.producto === prod.nombre);
      if (boughtItem) {
        return { ...prod, stock: prod.stock + boughtItem.cantidad };
      }
      return prod;
    });

    setInventario(newInventario);
    setCompras(prev => prev.map(c => c.id === rfqId ? { ...c, estado: 'Recibido' } : c));
    addNotification('success', `Almacén: Se recibieron los insumos de la orden ${rfqId}. Stock incrementado.`);
  };

  // Manufactura (BOM) Formula Magistral -> resta ingredientes y suma fármaco terminado
  const prepararFormulaMRP = (formulaId, cantidad) => {
    const formula = formulas.find(f => f.id === formulaId);
    if (!formula) return { success: false };

    // Update target medicine stock
    const targetProdName = formula.nombre;
    const newInventario = inventario.map(prod => {
      if (prod.nombre === targetProdName) {
        return { ...prod, stock: prod.stock + parseInt(cantidad) };
      }
      return prod;
    });

    setInventario(newInventario);
    
    // Generate Accounting expense simulation
    const costTotal = formula.costoTotal * cantidad;
    const expenseId = 'EXP-' + Math.floor(Math.random() * 9000 + 1000);
    const newFactura = {
      id: expenseId,
      fecha: new Date().toLocaleString().slice(0, 16),
      cliente: 'Costo Manufactura Formula',
      total: -costTotal,
      subtotal: -costTotal,
      impuesto: 0,
      estado: 'Costo Contabilizado',
      xmlEstado: 'No Aplicable',
      modulo: 'Manufactura'
    };
    setFacturas(prev => [newFactura, ...prev]);

    addNotification('success', `Manufactura: Se prepararon ${cantidad} unidades de "${formula.nombre}". Se registraron costos de materia prima en Contabilidad.`);
    return { success: true };
  };

  // Clock Attendance RRHH
  const registrarChecador = (empleadoId, action) => {
    const timeStr = new Date().toLocaleString().slice(0, 16);
    setRrhh(prev => prev.map(emp => {
      if (emp.id === empleadoId) {
        return {
          ...emp,
          asistencia: action === 'in' ? 'Dentro' : 'Fuera',
          checkInTime: action === 'in' ? timeStr : ''
        };
      }
      return emp;
    }));
    addNotification('info', `Asistencia RRHH: ${rrhh.find(e => e.id === empleadoId).nombre} marcó ${action === 'in' ? 'ENTRADA' : 'SALIDA'} a las ${timeStr}.`);
  };

  // Helpdesk Resolution
  const resolverTicket = (ticketId) => {
    setTickets(prev => prev.map(tk => {
      if (tk.id === ticketId) {
        return { ...tk, estado: 'Resuelto' };
      }
      return tk;
    }));
    addNotification('success', `Helpdesk: Consulta ${ticketId} marcada como RESUELTA dentro de SLA.`);
  };

  // Settle Bank Reconciliation automatically (AI match)
  const conciliarFacturaBancaria = (facturaId) => {
    setFacturas(prev => prev.map(fac => {
      if (fac.id === facturaId) {
        return { ...fac, estado: 'Conciliado con Banco (Conciliación IA exitosa)' };
      }
      return fac;
    }));
    addNotification('success', `Contabilidad: Conciliación bancaria IA exitosa para factura ${facturaId}.`);
  };

  // Marketing campaign scheduler
  const dispararCampana = (nombre, tipo, segmento) => {
    const newCamp = {
      id: 'C-0' + (campanas.length + 1),
      nombre,
      tipo,
      segmento,
      estado: 'Enviado',
      fecha: new Date().toISOString().slice(0, 10),
      clics: tipo === 'SMS' ? Math.floor(Math.random() * 50 + 10) : Math.floor(Math.random() * 200 + 30)
    };

    setCampanas(prev => [...prev, newCamp]);
    addNotification('success', `Marketing: Campaña "${nombre}" disparada con éxito a ${segmento}.`);
  };

  // Live Chat input handler
  const sendChatMessage = (text) => {
    if (!text.trim()) return;
    const newMsg = { id: chatMessages.length + 1, sender: 'user', text };
    setChatMessages(prev => [...prev, newMsg]);
    
    // Auto-respond with pharmacist chat simulated logic
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        { id: prev.length + 1, sender: 'agent', text: 'Entendido. He transmitido la consulta al regente farmacéutico de turno. También puedes agendar una tele-consulta desde tu portal.' }
      ]);
      addNotification('info', 'Mesa de Ayuda: Nuevo mensaje en chat en vivo del Sitio Web.');
    }, 1500);
  };

  return (
    <AppContext.Provider value={{
      usersList,
      setUsersList,
      currentUser,
      setCurrentUser,
      activeTheme,
      setActiveTheme,
      activeView,
      setActiveView,
      isOnline,
      setIsOnline,
      offlineQueue,
      syncOfflineOrders,
      
      pacientes,
      setPacientes,
      inventario,
      setInventario,
      publishedProducts,
      setPublishedProducts,
      formulas,
      setFormulas,
      facturas,
      compras,
      setCompras,
      rrhh,
      tickets,
      setTickets,
      proyectos,
      campanas,
      chatMessages,
      sendChatMessage,
      notifications,
      setNotifications,
      activeModule,
      setActiveModule,
      
      quotes,
      setQuotes,
      ordenesProd,
      setOrdenesProd,
      collabMessages,
      setCollabMessages,
      projectTasks,
      setProjectTasks,
      bankTransactions,
      setBankTransactions,
      knowledgeResult,
      setKnowledgeResult,
      kanbanItems,
      setKanbanItems,
      
      login,
      logout,
      registrarVentaPOS,
      recibirCompra,
      prepararFormulaMRP,
      registrarChecador,
      resolverTicket,
      conciliarFacturaBancaria,
      dispararCampana
    }}>
      {children}
    </AppContext.Provider>
  );
}
