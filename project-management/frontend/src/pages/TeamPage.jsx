import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTeams } from "../services/teamService";

export default function TeamPage() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchTeams() {
      try {
        const data = await getTeams();
        setTeams(data);
      } catch (err) {
        setError("Chyba při načítání týmů: " + err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTeams();
  }, []);

  if (loading) return <p>Načítání týmů…</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Seznam týmů</h2>
        <button className="btn btn-primary" onClick={() => navigate("/teams/create")}>
          Vytvořit tým
        </button>
      </div>

      {teams.length === 0 ? (
        <p>Žádné týmy zatím nejsou vytvořeny.</p>
      ) : (
        <div className="list-group">
          {teams.map((team) => (
            <div
                key={team.id}
    className="list-group-item list-group-item-action"
    style={{ cursor: "pointer" }}
    onClick={() => navigate(`/teams/${team.id}`)}
  >
    <div className="fw-bold">{team.name}</div>
    <div>Počet členů: {team.memberIds.length}</div>
  </div>
))}
        </div>
      )}
    </div>
  );
}
