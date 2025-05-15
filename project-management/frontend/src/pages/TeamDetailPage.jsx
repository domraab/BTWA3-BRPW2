// src/pages/TeamDetailPage.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getTeamMembers,
  addMemberToTeam,
  removeMemberFromTeam,
  getProjectsByTeam,
  deleteTeam,
  getTeams
} from "../services/teamService";
import { getUsers } from "../services/userService";

export default function TeamDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [teamName, setTeamName] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);

  const fetchTeamName = useCallback(async () => {
    try {
      const allTeams = await getTeams();
      const team = allTeams.find((t) => t.id === parseInt(id));
      if (team) setTeamName(team.name);
    } catch (err) {
      setError("Nepodařilo se načíst název týmu");
    }
  }, [id]);

  const fetchTeamMembers = useCallback(async () => {
    try {
      const data = await getTeamMembers(id);
      setTeamMembers(data);
    } catch (err) {
      setError("Nepodařilo se načíst členy týmu");
    }
  }, [id]);

  const fetchAllUsers = useCallback(async () => {
    try {
      const data = await getUsers();
      setAllUsers(data);
    } catch (err) {
      setError("Nepodařilo se načíst všechny uživatele");
    }
  }, []);

  const fetchProjects = useCallback(async () => {
    try {
      const data = await getProjectsByTeam(id);
      setProjects(data);
    } catch (err) {
      setError("Chyba při načítání projektů týmu");
    }
  }, [id]);

  const addMember = async (userId) => {
    try {
      await addMemberToTeam(id, userId);
      fetchTeamMembers();
    } catch (err) {
      setError("Chyba při přidávání člena");
    }
  };

  const removeMember = async (userId) => {
    try {
      await removeMemberFromTeam(id, userId);
      fetchTeamMembers();
    } catch (err) {
      setError("Chyba při odebírání člena");
    }
  };

  const handleDeleteTeam = async () => {
    const confirmDelete = window.confirm("Opravdu chcete tento tým zrušit?");
    if (!confirmDelete) return;
    try {
      await deleteTeam(id);
      navigate("/teams");
    } catch (err) {
      setError("Chyba při mazání týmu");
    }
  };

  useEffect(() => {
    fetchTeamName();
    fetchTeamMembers();
    fetchAllUsers();
    fetchProjects();
  }, [fetchTeamName, fetchTeamMembers, fetchAllUsers, fetchProjects]);

  const userIsInTeam = (userId) => teamMembers.some((m) => m.id === userId);

  return (
    <div className="container mt-4">
      <h2>Detail týmu: {teamName || `ID: ${id}`}</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <h4 className="mt-4">Členové týmu</h4>
      <ul className="list-group mb-4">
        {teamMembers.map((member) => (
          <li key={member.id} className="list-group-item d-flex justify-content-between">
            <span>{member.fullName || member.username}</span>
            <button className="btn btn-sm btn-danger" onClick={() => removeMember(member.id)}>
              Odebrat
            </button>
          </li>
        ))}
      </ul>

      <h4>Přidat uživatele do týmu</h4>
      <ul className="list-group mb-4">
        {allUsers.filter(u => !userIsInTeam(u.id)).map((user) => (
          <li key={user.id} className="list-group-item d-flex justify-content-between">
            <span>{user.fullName || user.username}</span>
            <button className="btn btn-sm btn-success" onClick={() => addMember(user.id)}>
              Přidat
            </button>
          </li>
        ))}
      </ul>

      <h4 className="mt-4">Projekty tohoto týmu</h4>
      {projects.length === 0 ? (
        <p className="text-muted">Tým nemá přiřazené žádné projekty.</p>
      ) : (
        <ul className="list-group mb-4">
          {projects.map((project) => (
            <li key={project.id} className="list-group-item">
              <strong>{project.name}</strong> — <span className="text-muted">{project.status}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="text-end">
        <button className="btn btn-outline-danger" onClick={handleDeleteTeam}>
          Zrušit tým
        </button>
      </div>
    </div>
  );
}
