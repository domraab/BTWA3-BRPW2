// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/authService';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '', email: '', fullName: '', phone: '', jobTitle: '' });
  const [error, setError] = useState(null);
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
    <div className="bg-gradient-primary d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-6 col-lg-8 col-md-9">
            <div className="card o-hidden border-0 shadow-lg">
              <div className="card-body p-5">
                <h1 className="h4 text-gray-900 mb-4 text-center">Create an Account</h1>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                  {['username', 'password', 'email', 'fullName', 'phone', 'jobTitle'].map(field => (
                    <div className="form-group mb-3" key={field}>
                      <label className="form-label">
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </label>
                      <input
                        name={field}
                        type={field === 'password' ? 'password' : 'text'}
                        className="form-control form-control-user"
                        value={form[field]}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      />
                    </div>
                  ))}
                  <button className="btn btn-primary btn-user btn-block w-100" disabled={loading}>
                    {loading ? 'Registering…' : 'Register'}
                  </button>
                </form>

                <hr />
                <div className="text-center">
                  <Link to="/login" className="small">Already have an account? Login here</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
