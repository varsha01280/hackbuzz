import React from 'react';

function SystemStatusCard({ status }) {
  const color = status === 'NORMAL' ? '#0f0' : '#f00';
  return (
    <div style={{
      background: '#222',
      padding: '20px',
      borderRadius: '10px',
      minWidth: '200px',
      textAlign: 'center',
      border: `2px solid ${color}`,
      color
    }}>
      <h3>System Status</h3>
      <h2>{status}</h2>
    </div>
  );
}

export default SystemStatusCard;