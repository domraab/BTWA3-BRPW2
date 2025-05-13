// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/authService';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm]     = useState({ username:'', password:'', email:'', fullName:'', phone:'', jobTitle:'' });
  const [error, setError]   = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(form);
      navigate('/projects');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2 className="mt-4">Register</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        {['username','password','email','fullName','phone','jobTitle'].map(field => (
          <div className="form-group mb-3" key={field}>
            <label className="form-label">
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              name={field}
              type={field === 'password' ? 'password' : 'text'}
              className="form-control"
              value={form[field]}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
        ))}
        <button className="btn btn-primary" disabled={loading}>
          {loading ? 'Registering…' : 'Register'}
        </button>
      </form>
      <p className="mt-3">
        Already have an account? <Link to="/login">Login here</Link>.
      </p>
    </div>
  );
}
