import React from 'react';
import { Smartphone, Wifi, Battery, Signal } from 'lucide-react';

export default function MobileFrame({ children }) {
  // Mobile status bar current simulated time
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="mobile-frame-container">
      <div className="smartphone-device">
        <div className="smartphone-notch">
          <div className="smartphone-camera"></div>
          <div className="smartphone-speaker"></div>
        </div>
        
        {/* Device Status Bar */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          right: '12px',
          height: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 24px',
          fontSize: '11px',
          fontWeight: '700',
          color: '#FFFFFF',
          zIndex: 998,
          pointerEvents: 'none'
        }}>
          <span>{timeStr}</span>
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            <Signal size={12} />
            <Wifi size={12} />
            <Battery size={12} />
          </div>
        </div>

        <div className="smartphone-screen">
          {children}
        </div>
      </div>
    </div>
  );
}
