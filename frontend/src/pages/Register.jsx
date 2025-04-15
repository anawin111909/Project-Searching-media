import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
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
      <form onSubmit={handleRegister}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
      <p
        className="mt-4 underline cursor-pointer"
        onClick={() => navigate('/login')}
      >
        Already have an account? Back to login
      </p>
    </div>
  );
}
