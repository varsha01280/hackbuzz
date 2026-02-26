import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

function Dashboard() {
  const [logs, setLogs] = useState([]);
  const [flow, setFlow] = useState(0);
  const [valve, setValve] = useState('Closed');

  useEffect(() => {
    socket.on('arduino-data', line => {
      setLogs(prev => [line, ...prev].slice(0, 50));
      if (line.includes('Flow Rate')) {
        const match = line.match(/Flow Rate:\s*([\d.]+)/);
        if (match) setFlow(parseFloat(match[1]));
      }
      if (line.includes('Solenoid ON')) setValve('Open');
      if (line.includes('Solenoid OFF')) setValve('Closed');
    });
    return () => socket.off('arduino-data');
  }, []);

  const handleValve = cmd => socket.emit('valve-control', cmd);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Smart Water Dashboard</h1>
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <div style={{ padding: '10px', border: '1px solid #000', width: '150px' }}>
          <h3>Flow Rate</h3>
          <p>{flow} L/min</p>
        </div>
        <div style={{ padding: '10px', border: '1px solid #000', width: '150px' }}>
          <h3>Valve</h3>
          <p>{valve}</p>
          <button onClick={() => handleValve('open')}>Open</button>
          <button onClick={() => handleValve('close')}>Close</button>
        </div>
      </div>

      <h2>Recent Logs</h2>
      <div style={{ maxHeight: '300px', overflowY: 'scroll', border: '1px solid #000', padding: '10px' }}>
        {logs.map((line, i) => <div key={i}>{line}</div>)}
      </div>
    </div>
  );
}

export default Dashboard;