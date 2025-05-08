import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../app.css'; 

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.access_token);
        navigate('/search');
      } else {
        setError(data.detail || 'Login failed');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box text-white">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
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
          <button type="submit">Login</button>
          {error && <p className="error">{error}</p>}
        </form>
        <p>
          Don’t have an account?{' '}
          <span onClick={() => navigate('/register')} className="register-link">
            Register
          </span>
        </p>
      </div>
    </div>
  );
  
}
