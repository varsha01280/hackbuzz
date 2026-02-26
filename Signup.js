import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const res = await axios.post('http://localhost:5000/signup', { username, password });
      setMsg(res.data.message);
      if (res.data.message === 'User created') navigate('/login');
    } catch (err) {
      setMsg(err.response.data.message);
    }
  };

  return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', background:'#222' }}>
      <div style={{ background:'#333', padding:'40px', borderRadius:'10px', color:'#fff', width:'300px', textAlign:'center' }}>
        <h2>Signup</h2>
        <input placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} style={inputStyle} />
        <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} style={inputStyle} />
        <button onClick={handleSignup} style={btnStyle}>Signup</button>
        <p style={{color:'#f88'}}>{msg}</p>
        <Link to="/login" style={{ color:'#0f0' }}>Already have account?</Link>
      </div>
    </div>
  );
}

const inputStyle = { display:'block', width:'100%', padding:'10px', margin:'10px 0', borderRadius:'5px', border:'none' };
const btnStyle = { padding:'10px 20px', border:'none', borderRadius:'5px', background:'#0f0', color:'#000', cursor:'pointer' };

export default Signup;