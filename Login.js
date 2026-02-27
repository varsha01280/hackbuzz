import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/login', { username, password });
      if (res.data.success) navigate('/dashboard');
      else alert(res.data.message);
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || 'Server error');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#222' }}>
      <div style={{ background: '#333', padding: '40px', borderRadius: '10px', color: '#fff', width: '300px', textAlign: 'center' }}>
        <h2>Login</h2>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required style={inputStyle} />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required style={inputStyle} />
          <button type="submit" style={btnStyle}>Login</button>
        </form>
        <p style={{ marginTop: '15px' }}>
          <Link to="/signup" style={{ color: '#0f0' }}>Don't have an account? Sign up</Link>
        </p>
      </div>
    </div>
  );
}

const inputStyle = { display: 'block', width: '90%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: 'none' };
const btnStyle = { padding: '10px 20px', border: 'none', borderRadius: '5px', background: '#0f0', color: '#000', cursor: 'pointer', marginTop: '10px' };

export default Login;