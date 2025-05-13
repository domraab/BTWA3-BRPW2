// src/pages/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login, isLoggedIn } from '../services/authService';

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState(null);
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    if (isLoggedIn()) {
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Login failed');
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
                <h1 className="h4 text-gray-900 mb-4 text-center">Welcome Back!</h1>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                  <div className="form-group mb-3">
                    <label>Username</label>
                    <input
                      type="text"
                      className="form-control form-control-user"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label>Password</label>
                    <input
                      type="password"
                      className="form-control form-control-user"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary btn-user btn-block"
                    disabled={loading}
                  >
                    {loading ? 'Logging in…' : 'Login'}
                  </button>
                </form>

                <hr />
                <div className="text-center">
                  <Link to="/register" className="small">Create an account</Link>
                </div>
                <div className="text-center mt-2">
                  <a className="small" href="#!">Forgot Password?</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>  
    </div>
  );
}

export default LoginPage;
