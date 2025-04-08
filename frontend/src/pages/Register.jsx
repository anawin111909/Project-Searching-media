import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const res = await fetch('http://localhost:8000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (res.ok) {
        alert("Registration successful! Please login.");
        navigate('/login');
      } else {
        alert(data.detail || 'Registration failed');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  return (
    <div style={{ padding: '2rem' }} className="text-white">
      <h2>Register</h2>
      <div>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button onClick={handleRegister}>Register</button>
      <p className="mt-4 underline cursor-pointer" onClick={() => navigate('/login')}>
        Already have an account? Back to login
      </p>
    </div>
  );
}
