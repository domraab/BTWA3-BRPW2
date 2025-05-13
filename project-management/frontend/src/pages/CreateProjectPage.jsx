// src/pages/CreateProjectPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProject } from '../services/projectService';
import { getCurrentUser } from '../services/authService';

export default function CreateProjectPage() {
  const navigate = useNavigate();
  const [name, setName]           = useState('');
  const [description, setDesc]    = useState('');
  const [status, setStatus]       = useState('New');
  const [managerId, setManagerId] = useState(null);
  const [error, setError]         = useState('');

  // načíst ID přihlášeného uživatele (manažera)
  useEffect(() => {
    (async () => {
      try {
        const user = await getCurrentUser();
        setManagerId(user.id);
      } catch {
        // v případě chyby vrátit na login
        navigate('/login', { replace: true });
      }
    })();
  }, [navigate]);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const proj = await createProject({ name, description, status, managerId });
      // po úspěšném vytvoření přesměrujeme na detail nového projektu
      navigate(`/projects/${proj.id}`);
    } catch (e) {
      setError(e.response?.data?.error || 'Nepodařilo se vytvořit projekt');
    }
  };

  return (
    <div className="container-fluid">
      <h2 className="h3 mb-4 text-gray-800">Create New Project</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="user">
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            className="form-control"
            value={description}
            onChange={e => setDesc(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Status</label>
          <select
            className="form-control"
            value={status}
            onChange={e => setStatus(e.target.value)}
          >
            <option>New</option>
            <option>In Progress</option>
            <option>Done</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary">
          Create Project
        </button>
      </form>
    </div>
  );
}
