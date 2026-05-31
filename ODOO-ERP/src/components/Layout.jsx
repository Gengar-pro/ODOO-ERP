import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import MobileFrame from './MobileFrame';

// Import Icons
import {
  LogOut,
  Bell,
  Sun,
  Moon,
  Laptop,
  Smartphone,
  ChevronDown,
  Layers,
  Sparkles,
  Search,
  CheckCircle,
  AlertTriangle,
  Settings,
  X,
  Target,
  Briefcase,
  Building,
  Package,
  ShoppingCart,
  Wrench,
  Users,
  Monitor,
  Globe,
  Megaphone,
  Calendar,
  MessageSquare
} from 'lucide-react';

// Import Modules
import CRMModule from '../modules/CRM/CRMModule';
import VentasModule from '../modules/Ventas/VentasModule';
import ContabilidadModule from '../modules/Contabilidad/ContabilidadModule';
import InventarioModule from '../modules/Inventario/InventarioModule';
import ComprasModule from '../modules/Compras/ComprasModule';
import ManufacturaModule from '../modules/Manufactura/ManufacturaModule';
import RRHHModule from '../modules/RRHH/RRHHModule';
import POSModule from '../modules/POS/POSModule';
import SitioWebModule from '../modules/SitioWeb/SitioWebModule';
import MarketingModule from '../modules/Marketing/MarketingModule';
import ProyectosModule from '../modules/Proyectos/ProyectosModule';
import MesaAyudaModule from '../modules/MesaAyuda/MesaAyudaModule';

const sanitizeModuleName = (name) => {
  if (!name) return '';
  return name.replace(/^[^a-zA-ZáéíóúüñÁÉÍÓÚÜÑ]+/g, '').trim();
};

export default function Layout() {
  const {
    currentUser,
    setCurrentUser,
    usersList,
    setUsersList,
    logout,
    activeTheme,
    setActiveTheme,
    activeView,
    setActiveView,
    activeModule,
    setActiveModule,
    notifications,
    setNotifications,
    isOnline,
    offlineQueue,
    syncOfflineOrders
  } = useContext(AppContext);

  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Profile Settings States
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [configName, setConfigName] = useState('');
  const [configUsername, setConfigUsername] = useState('');
  const [configPassword, setConfigPassword] = useState('');

  const openSettings = () => {
    setConfigName(currentUser?.name || '');
    setConfigUsername(currentUser?.username || '');
    setConfigPassword('');
    setShowSettingsModal(true);
  };

  // Map module string names to their respective rendering components
  const renderModuleComponent = () => {
    const cleanActive = sanitizeModuleName(activeModule);
    switch (cleanActive) {
      case 'CRM': return <CRMModule />;
      case 'Ventas': return <VentasModule />;
      case 'Contabilidad': return <ContabilidadModule />;
      case 'Inventario': return <InventarioModule />;
      case 'Compras': return <ComprasModule />;
      case 'Manufactura': return <ManufacturaModule />;
      case 'RRHH': return <RRHHModule />;
      case 'Punto de Venta': return <POSModule />;
      case 'Sitio Web': return <SitioWebModule />;
      case 'Marketing': return <MarketingModule />;
      case 'Proyectos': return <ProyectosModule />;
      case 'Mesa de Ayuda': return <MesaAyudaModule />;
      default: return <CRMModule />;
    }
  };

  const getModuleIcon = (name, size = 16) => {
    switch (name) {
      case 'CRM': return <Target size={size} />;
      case 'Ventas': return <Briefcase size={size} />;
      case 'Contabilidad': return <Building size={size} />;
      case 'Inventario': return <Package size={size} />;
      case 'Compras': return <ShoppingCart size={size} />;
      case 'Manufactura': return <Wrench size={size} />;
      case 'RRHH': return <Users size={size} />;
      case 'Punto de Venta': return <Monitor size={size} />;
      case 'Sitio Web': return <Globe size={size} />;
      case 'Marketing': return <Megaphone size={size} />;
      case 'Proyectos': return <Calendar size={size} />;
      case 'Mesa de Ayuda': return <MessageSquare size={size} />;
      default: return <Layers size={size} />;
    }
  };

  // Toggle Day/Night
  const toggleTheme = () => {
    setActiveTheme(activeTheme === 'light' ? 'dark' : 'light');
  };

  // Notifications Count
  const unreadNotifications = notifications.filter(n => !n.leido);

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, leido: true })));
  };

  // Build Layout Body wrapper (Responsive or Phone frame)
  const renderLayoutContent = () => {
    return (
      <div className="app-container">
        {/* SIDEBAR */}
        <div className={`sidebar ${mobileMenuOpen ? 'open' : ''}`}>
          <div className="sidebar-logo">
            <Sparkles size={20} style={{ color: 'var(--primary)' }} />
            <span>Pharma-Sync</span>
          </div>

          <div className="sidebar-menu">
            {currentUser.modules.map(modName => {
              const cleanName = sanitizeModuleName(modName);
              return (
                <div
                  key={modName}
                  className={`sidebar-item ${activeModule === cleanName ? 'active' : ''}`}
                  onClick={() => {
                    setActiveModule(cleanName);
                    setMobileMenuOpen(false);
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    {getModuleIcon(cleanName)}
                  </span>
                  <span>{cleanName}</span>
                </div>
              );
            })}
          </div>

          <div className="sidebar-footer">
            <div className="user-profile">
              <div className="avatar">
                {currentUser.name.charAt(0)}
              </div>
              <div className="user-info">
                <div className="user-name">{currentUser.name}</div>
                <div className="user-role">{currentUser.role}</div>
              </div>
              <button onClick={logout} className="logout-btn" title="Cerrar Sesión">
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* WORKSPACE */}
        <div className="main-workspace">
          {/* OFFLINE TOP BANNER SIMULATION */}
          {!isOnline && (
            <div className="offline-banner">
              <AlertTriangle size={14} />
              <span>Modo Sin Conexión Activado. {offlineQueue.length} transacciones en caché local. </span>
              <button 
                onClick={syncOfflineOrders}
                className="btn btn-primary" 
                style={{ height: '22px', padding: '0 8px', fontSize: '10px', marginLeft: '12px', backgroundColor: '#1A2238', color: '#FFFFFF' }}
              >
                Sincronizar Datos
              </button>
            </div>
          )}

          {/* HEADER */}
          <div className="header">
            <div className="header-left">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="icon-btn mobile-menu-toggle"
              >
                ☰
              </button>
              
              <div className="breadcrumb">
                <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>Odoo ERP</span>
                <span style={{ margin: '0 8px' }}>/</span>
                <span>{activeModule}</span>
              </div>
            </div>

            <div className="header-right">
              {/* Connectivity Pulse Badge */}
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: '700',
                  backgroundColor: isOnline ? 'rgba(76, 175, 80, 0.15)' : 'rgba(244, 67, 54, 0.15)',
                  color: isOnline ? '#4CAF50' : '#F44336',
                  marginRight: '8px'
                }}
                title={isOnline ? "Conectado al servidor central de Pharma-Sync" : `Modo Fuera de Línea - ${offlineQueue.length} órdenes en cola local`}
              >
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: isOnline ? '#4CAF50' : '#F44336'
                }} />
                <span>{isOnline ? 'ONLINE' : `OFFLINE (${offlineQueue.length})`}</span>
              </div>
              {/* Day/Night native Switch */}
              <button onClick={toggleTheme} className="icon-btn" title="Alternar Modo Día/Noche">
                {activeTheme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              </button>

              {/* Profile/System Settings Trigger */}
              <button onClick={openSettings} className="icon-btn" title="Configuraciones de Usuario y Perfil">
                <Settings size={18} />
              </button>

              {/* Notification Center Trigger */}
              <div style={{ position: 'relative' }}>
                <button onClick={() => setShowNotifications(!showNotifications)} className="icon-btn" title="Alertas de Stock y Vencimientos">
                  <Bell size={18} />
                  {unreadNotifications.length > 0 && <span className="badge-dot"></span>}
                </button>

                {/* Notifications Dropdown Panel */}
                {showNotifications && (
                  <div style={{
                    position: 'absolute',
                    top: '46px',
                    right: 0,
                    width: '320px',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
                    padding: '16px',
                    zIndex: 1000,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
                      <span style={{ fontWeight: '700', fontSize: '13px' }}>Panel de Notificaciones</span>
                      <button 
                        onClick={handleMarkAllRead}
                        style={{ border: 'none', background: 'transparent', color: 'var(--primary-hover)', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }}
                      >
                        Marcar todo leido
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '250px', overflowY: 'auto' }}>
                      {notifications.length === 0 ? (
                        <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', padding: '20px 0' }}>
                          Ninguna alerta registrada.
                        </div>
                      ) : (
                        notifications.map(n => (
                          <div key={n.id} style={{
                            padding: '8px 12px',
                            backgroundColor: 'var(--bg-main)',
                            borderRadius: '6px',
                            borderLeft: `3px solid ${n.tipo === 'vencimiento' ? 'var(--danger)' : n.tipo === 'stock_bajo' ? 'var(--warning)' : 'var(--info)'}`,
                            fontSize: '11px',
                            opacity: n.leido ? 0.6 : 1
                          }}>
                            <div>{n.msj}</div>
                            <div style={{ textAlign: 'right', fontSize: '9px', color: 'var(--text-muted)', marginTop: '4px' }}>{n.fecha}</div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* MOBILE TABS MODULES BAR */}
          <div className="mobile-modules-bar">
            {currentUser.modules.map(modName => {
              const cleanName = sanitizeModuleName(modName);
              return (
                <div
                  key={modName}
                  className={`mobile-module-tab ${activeModule === cleanName ? 'active' : ''}`}
                  onClick={() => setActiveModule(cleanName)}
                >
                  <span className="tab-icon">{getModuleIcon(cleanName, 14)}</span>
                  <span className="tab-text">{cleanName}</span>
                </div>
              );
            })}
          </div>

          {/* PAGE MAIN CONTENT */}
          <div className="content-area">
            {renderModuleComponent()}
          </div>

          {/* POPUP MODAL: Profile Settings */}
          {showSettingsModal && (
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
              zIndex: 99999
            }}>
              <div className="card" style={{ width: '400px', padding: '24px', position: 'relative' }}>
                <button 
                  onClick={() => setShowSettingsModal(false)}
                  style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  <X size={18} />
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <Settings size={24} style={{ color: 'var(--primary)' }} />
                  <h3 style={{ margin: 0 }}>Configuraciones de Usuario</h3>
                </div>

                <div className="form-group">
                  <label className="form-label">Nombre Completo</label>
                  <input
                    type="text"
                    className="form-control"
                    value={configName}
                    onChange={(e) => setConfigName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Usuario de Acceso</label>
                  <input
                    type="text"
                    className="form-control"
                    value={configUsername}
                    onChange={(e) => setConfigUsername(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Nueva Contraseña (Dejar en blanco para mantener actual)</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Escriba nueva contraseña..."
                    value={configPassword}
                    onChange={(e) => setConfigPassword(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', padding: '10px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '13px', fontWeight: '600' }}>Tema Visual del Sistema</span>
                  <button type="button" onClick={toggleTheme} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', height: '30px' }}>
                    {activeTheme === 'light' ? (
                      <>
                        <Moon size={14} />
                        <span>Modo Oscuro</span>
                      </>
                    ) : (
                      <>
                        <Sun size={14} />
                        <span>Modo Claro</span>
                      </>
                    )}
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
                  <button 
                    onClick={() => setShowSettingsModal(false)}
                    className="btn btn-secondary"
                    style={{ flex: 1 }}
                    type="button"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={() => {
                      logout();
                      setShowSettingsModal(false);
                    }}
                    className="btn btn-danger" 
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                    type="button"
                  >
                    <LogOut size={14} />
                    <span>Cerrar Sesión</span>
                  </button>
                  <button 
                    onClick={() => {
                      if (!configName.trim() || !configUsername.trim()) {
                        alert('El nombre y el usuario no pueden estar vacíos.');
                        return;
                      }

                      const usernameTaken = usersList.some(u => 
                        u.username.toLowerCase() === configUsername.toLowerCase() && 
                        u.username.toLowerCase() !== currentUser.username.toLowerCase()
                      );
                      if (usernameTaken) {
                        alert('El nombre de usuario elegido ya está tomado por otra cuenta.');
                        return;
                      }

                      setUsersList(prev => prev.map(u => {
                        if (u.username.toLowerCase() === currentUser.username.toLowerCase()) {
                          return {
                            ...u,
                            name: configName,
                            username: configUsername,
                            password: configPassword || u.password
                          };
                        }
                        return u;
                      }));

                      const updatedUser = {
                        ...currentUser,
                        name: configName,
                        username: configUsername
                      };
                      setCurrentUser(updatedUser);
                      localStorage.setItem('pharma_user', JSON.stringify(updatedUser));
                      
                      alert('Perfil guardado exitosamente.');
                      setShowSettingsModal(false);
                    }}
                    className="btn btn-primary" 
                    style={{ flex: 1 }}
                    type="button"
                  >
                    Guardar Perfil
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return renderLayoutContent();
}
