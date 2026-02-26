import React, { useState } from 'react';

function FlowCalculator() {
  const [flow, setFlow] = useState('');
  const [time, setTime] = useState('');
  const [total, setTotal] = useState(0);

  const calculate = () => {
    const f = parseFloat(flow);
    const t = parseFloat(time);
    if (!isNaN(f) && !isNaN(t)) setTotal(f * t);
  };

  return (
    <div style={{ marginTop: '30px', padding: '20px', background: '#333', color:'#fff', borderRadius: '10px' }}>
      <h3>Flow Calculator (L)</h3>
      <input placeholder="Flow rate (L/min)" value={flow} onChange={e => setFlow(e.target.value)} style={{ marginRight:'10px' }} />
      <input placeholder="Time (min)" value={time} onChange={e => setTime(e.target.value)} style={{ marginRight:'10px' }} />
      <button onClick={calculate}>Calculate</button>
      <h4>Total Water Used: {total.toFixed(2)} L</h4>
    </div>
  );
}

export default FlowCalculator;