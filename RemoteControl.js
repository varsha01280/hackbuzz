import React from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

function RemoteControl() {
  const toggleValve = (state) => {
    socket.emit('valve-control', state);  // Node can listen for this event to control Arduino
    alert(`Valve set to ${state}`);
  };

  return (
    <div style={{ marginTop:'30px', padding:'20px', background:'#555', color:'#fff', borderRadius:'10px' }}>
      <h3>Remote Control</h3>
      <button onClick={() => toggleValve('ON')} style={{ marginRight:'10px' }}>Open Valve</button>
      <button onClick={() => toggleValve('OFF')}>Close Valve</button>
    </div>
  );
}

export default RemoteControl;