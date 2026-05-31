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
  AlertTriangle
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

export default function Layout() {
  const {
    currentUser,
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

  // Map module string names to their respective rendering components
  const renderModuleComponent = () => {
    switch (activeModule) {
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

  const getModuleIcon = (name) => {
    switch (name) {
      case 'CRM': return '🎯';
      case 'Ventas': return '💼';
      case 'Contabilidad': return '🏦';
      case 'Inventario': return '📦';
      case 'Compras': return '🛒';
      case 'Manufactura': return '⚙️';
      case 'RRHH': return '👥';
      case 'Punto de Venta': return '🖥️';
      case 'Sitio Web': return '🌐';
      case 'Marketing': return '📢';
      case 'Proyectos': return '📅';
      case 'Mesa de Ayuda': return '💬';
      default: return '🧩';
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
            {currentUser.modules.map(modName => (
              <div
                key={modName}
                className={`sidebar-item ${activeModule === modName ? 'active' : ''}`}
                onClick={() => {
                  setActiveModule(modName);
                  setMobileMenuOpen(false);
                }}
              >
                <span style={{ fontSize: '16px' }}>{getModuleIcon(modName)}</span>
                <span>{modName}</span>
              </div>
            ))}
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
                className="icon-btn" 
                style={{ display: activeView === 'mobile' ? 'flex' : 'none' }}
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
              {/* Desktop vs Mobile Simulator Switcher */}
              <div className="view-selector">
                <div 
                  className={`view-option ${activeView === 'desktop' ? 'active' : ''}`}
                  onClick={() => setActiveView('desktop')}
                >
                  <Laptop size={14} style={{ marginRight: '6px', display: 'inline-block', verticalAlign: 'middle' }} />
                  <span>Escritorio</span>
                </div>
                <div 
                  className={`view-option ${activeView === 'mobile' ? 'active' : ''}`}
                  onClick={() => setActiveView('mobile')}
                >
                  <Smartphone size={14} style={{ marginRight: '6px', display: 'inline-block', verticalAlign: 'middle' }} />
                  <span>APK Móvil</span>
                </div>
              </div>

              {/* Day/Night native Switch */}
              <button onClick={toggleTheme} className="icon-btn" title="Alternar Modo Día/Noche">
                {activeTheme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
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

          {/* PAGE MAIN CONTENT */}
          <div className="content-area">
            {renderModuleComponent()}
          </div>
        </div>
      </div>
    );
  };

  // Embed screen inside Mobile phone device simulator if 'mobile' is selected
  return activeView === 'mobile' ? (
    <MobileFrame>{renderLayoutContent()}</MobileFrame>
  ) : (
    renderLayoutContent()
  );
}
