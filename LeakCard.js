import React from 'react';

function LeakCard({ status }) {
  const alert = status === 'ALERT';
  return (
    <div style={{
      background: alert ? '#f00' : '#0f0',
      padding: '20px',
      borderRadius: '10px',
      minWidth: '200px',
      textAlign: 'center',
      color: '#fff'
    }}>
      <h3>Leak Detection</h3>
      <h2>{alert ? 'LEAK DETECTED' : 'No Leak'}</h2>
    </div>
  );
}

export default LeakCard;