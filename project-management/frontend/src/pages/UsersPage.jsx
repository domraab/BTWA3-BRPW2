// src/pages/UsersPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUsers } from "../services/userService";
import { isLoggedIn} from "../services/authService";
import UserList from "../components/User/UserList";

function UsersPage() {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 1) Pokud není přihlášen, přesměruj na login
    if (!isLoggedIn()) {
      navigate("/login", { replace: true });
      return;
    }

    // 2) Funkce pro načtení uživatelů
    async function fetchUsers() {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (err) {
        setError("Nepodařilo se načíst uživatele: " + err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, [navigate]);

  if (loading) return <p>Načítám uživatele…</p>;
  if (error)   return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Seznam uživatelů</h2>
      </div>
      <UserList users={users} />
    </div>
  );
}

export default UsersPage;
