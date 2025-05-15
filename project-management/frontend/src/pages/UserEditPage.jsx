// src/pages/UserEditPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUser, updateUser, deleteUser } from "../services/userService";

function UserEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Stavové proměnné
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // 1) Při načtení komponenty stáhneme uživatele z API
  useEffect(() => {
    (async () => {
      try {
        const u = await getUser(id);
        setUsername(u.username);
        setFullName(u.fullName || "");
        setEmail(u.email || "");
        setPhone(u.phone || "");
        setJobTitle(u.jobTitle || "");
        setRole(u.role || "");
      } catch (err) {
        console.error(err);
        setError("Nepodařilo se načíst data uživatele.");
      }
    })();
  }, [id]);

  // 2) Odeslání formuláře
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const dto = { username, fullName, email, phone, jobTitle, role };
      await updateUser(id, dto);
      setMessage("Uživatel byl úspěšně upraven.");
      navigate("/users");
    } catch (err) {
      console.error(err);
      setError("Chyba při ukládání uživatele.");
    }
  };

  // 3) Mazání uživatele
  const handleDelete = async () => {
    if (!window.confirm("Opravdu chcete smazat tohoto uživatele?")) return;
    try {
      await deleteUser(id);
      navigate("/users");
    } catch (err) {
      console.error(err);
      setError("Chyba při mazání uživatele.");
    }
  };

  if (error && !username) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container-fluid">
      <h2>Edit User</h2>
      {message && <div className="alert alert-success">{message}</div>}
      {error && username && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} style={{ maxWidth: "500px" }}>
        {/* Username */}
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        {/* Full Name */}
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input
            className="form-control"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        {/* Email */}
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Phone */}
        <div className="mb-3">
          <label className="form-label">Phone</label>
          <input
            className="form-control"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        {/* Job Title */}
        <div className="mb-3">
          <label className="form-label">Job Title</label>
          <input
            className="form-control"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
        </div>

        {/* Role */}
        <div className="mb-3">
          <label className="form-label">Role</label>
          <select
            className="w-full px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="">-- Vyber roli --</option>
            <option value="manager">Manager</option>
            <option value="developer">Developer</option>
            <option value="tester">Tester</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary me-2">
          Save Changes
        </button>
        <button
          type="button"
          className="btn btn-danger"
          onClick={handleDelete}
        >
          Delete User
        </button>
      </form>
    </div>
  );
}

export default UserEditPage;
