import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUsers } from "../services/userService";
import { createTeam } from "../services/teamService";

export default function CreateTeamPage() {
  const [name, setName] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (err) {
        setError("Chyba při načítání uživatelů: " + err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const handleCheckboxChange = (userId) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return setError("Zadej název týmu");

    try {
      await createTeam({ name, memberIds: selectedUserIds });
      navigate("/teams");
    } catch (err) {
      console.error(err);
      setError("Nepodařilo se vytvořit tým: " + err.message);
    }
  };

  if (loading) return <p>Načítání…</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <h2>Vytvořit nový tým</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <label className="form-label">Název týmu</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Vyber členy týmu:</label>
          <div className="border p-2" style={{ maxHeight: 200, overflowY: "auto" }}>
            {users.map((user) => (
              <div key={user.id} className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={user.id}
                  id={`user-${user.id}`}
                  checked={selectedUserIds.includes(user.id)}
                  onChange={() => handleCheckboxChange(user.id)}
                />
                <label className="form-check-label" htmlFor={`user-${user.id}`}>
                  {user.fullName || user.username}
                </label>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="btn btn-primary">
          Vytvořit tým
        </button>
      </form>
    </div>
  );
}
