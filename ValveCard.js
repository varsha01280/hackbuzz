import React from 'react';

function ValveCard({ status }) {
  return (
    <div style={{
      background: status === 'ON' ? '#0f0' : '#f00',
      padding: '20px',
      borderRadius: '10px',
      minWidth: '200px',
      textAlign: 'center',
      color: '#fff'
    }}>
      <h3>Valve Status</h3>
      <h2>{status}</h2>
    </div>
  );
}

export default ValveCard;