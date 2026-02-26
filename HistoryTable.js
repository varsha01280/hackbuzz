import React from 'react';

function HistoryTable({ logs }) {
  return (
    <div style={{ marginTop:'30px', padding:'20px', background:'#222', color:'#fff', borderRadius:'10px' }}>
      <h3>Arduino Logs History</h3>
      <div style={{ maxHeight:'300px', overflowY:'scroll' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ borderBottom:'1px solid #0f0' }}>
              <th>#</th>
              <th>Log</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index} style={{ borderBottom:'1px solid #555' }}>
                <td>{index+1}</td>
                <td>{log}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default HistoryTable;