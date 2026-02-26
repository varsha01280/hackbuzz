import React from 'react';

function FlowCard({ flow }) {
  return (
    <div style={{ background:'#0ff', padding:'20px', borderRadius:'10px', minWidth:'200px', textAlign:'center' }}>
      <h3>Flow Rate</h3>
      <h2>{flow.toFixed(2)} L/min</h2>
    </div>
  );
}

export default FlowCard;