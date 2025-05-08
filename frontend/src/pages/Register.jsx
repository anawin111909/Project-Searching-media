import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../app.css';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
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
        navigate('/login');
      } else {
        setError(data.detail || 'Registration failed');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
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
        {error && <p className="error">{error}</p>}
      </form>
        <p>
          Already have an account?{' '}
          <Link to="/login" className="register-link">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
