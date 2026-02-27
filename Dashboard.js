import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';

function Dashboard() {
  const [logs, setLogs] = useState([]);
  const [flow, setFlow] = useState(0);
  const [valve, setValve] = useState('OFF');
  const [systemStatus, setSystemStatus] = useState('NORMAL');
  const [handDetected, setHandDetected] = useState('NO HAND'); // NEW STATE

  const handleClearLogs = async () => {
    try {
      await axios.delete('http://localhost:5000/history');
      setLogs([]); // Immediately clear the UI
    } catch (error) {
      console.error("Failed to clear logs:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch logs history from MySQL
        const histRes = await axios.get('http://localhost:5000/history');
        if (histRes.data && histRes.data.length > 0) {
          setLogs(histRes.data);

          let foundFlow = false, foundHand = false, foundLeak = false;

          for (let i = 0; i < histRes.data.length; i++) {
            const hLine = histRes.data[i].data;

            if (!foundFlow && hLine.includes('Flow Rate')) {
              const match = hLine.match(/Flow Rate:\s*([\d.]+)/);
              if (match) { setFlow(parseFloat(match[1])); foundFlow = true; }
            }

            if (!foundHand && (hLine.includes('Hand Detected') || hLine.includes('No Hand'))) {
              if (hLine.includes('Hand Detected')) {
                setValve('OPEN (ON)');
                setHandDetected('YES');
              }
              if (hLine.includes('No Hand')) {
                setValve('CLOSED (OFF)');
                setHandDetected('NO');
              }
              foundHand = true;
            }

            if (!foundLeak && (hLine.includes('NORMAL') || hLine.includes('LEAKAGE'))) {
              if (hLine.includes('NORMAL')) setSystemStatus('NORMAL');
              if (hLine.includes('LEAKAGE')) setSystemStatus('LEAK ALERT!');
              foundLeak = true;
            }

            if (foundFlow && foundHand && foundLeak) break;
          }
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 1000); // Check every 1s

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="dashboard-container">
      <h1>Smart Water IoT Dashboard</h1>

      {/* Main Status Grid */}
      <div className="status-grid">
        <div className="status-card">
          <h3>🖐️ Hand Detection</h3>
          <p className={`status-value ${handDetected === 'YES' ? 'text-green' : 'text-gray'}`}>
            {handDetected}
          </p>
        </div>

        <div className="status-card">
          <h3>🚰 Solenoid Valve</h3>
          <p className={`status-value ${valve.includes('ON') ? 'text-green' : 'text-red'}`}>
            {valve}
          </p>
        </div>

        <div className="status-card">
          <h3>💧 Flow Rate</h3>
          <p className="status-value text-blue">
            {flow} <span className="unit">L/min</span>
          </p>
        </div>

        <div className={`status-card ${systemStatus.includes('LEAK') ? 'bg-alert' : ''}`}>
          <h3>⚙️ System Status</h3>
          <p className={`status-value ${systemStatus.includes('LEAK') ? 'text-alert' : 'text-green'}`}>
            {systemStatus}
          </p>
        </div>
      </div>

      {/* Activity Log History */}
      <div className="log-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>
          <h2 style={{ margin: 0, border: 'none', padding: 0 }}>📜 Activity Log History</h2>
          <button onClick={handleClearLogs} style={{ background: 'var(--accent-red)', color: 'white', border: 'none', borderRadius: '50%', width: '30px', height: '30px', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Clear Logs">
            −
          </button>
        </div>
        <div className="log-table-container">
          <table className="log-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Event / Data</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <tr key={index}>
                  <td className="time-cell">{new Date(log.timestamp).toLocaleTimeString()}</td>
                  <td className="data-cell">{log.data}</td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr><td colSpan="2" style={{ textAlign: 'center' }}>No recent logs found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default Dashboard;
