// src/pages/TeamDetailPage.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  getTeamMembers,
  addMemberToTeam,
  removeMemberFromTeam
} from "../services/teamService";
import { getUsers } from "../services/userService";

export default function TeamDetailPage() {
  const { id } = useParams();
  const [teamMembers, setTeamMembers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [error, setError] = useState(null);

  const fetchTeamMembers = useCallback(async () => {
    try {
      const data = await getTeamMembers(id);
      setTeamMembers(data);
    } catch (err) {
      setError("Nepodařilo se načíst členy týmu");
    }
  }, [id]);

  const fetchAllUsers = async () => {
    try {
      const data = await getUsers();
      setAllUsers(data);
    } catch (err) {
      setError("Nepodařilo se načíst všechny uživatele");
    }
  };

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

  useEffect(() => {
    fetchTeamMembers();
    fetchAllUsers();
  }, [fetchTeamMembers]);

  const userIsInTeam = (userId) => teamMembers.some((m) => m.id === userId);

  return (
    <div className="container mt-4">
      <h2>Detail týmu (ID: {id})</h2>
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
      <ul className="list-group">
        {allUsers.filter(u => !userIsInTeam(u.id)).map((user) => (
          <li key={user.id} className="list-group-item d-flex justify-content-between">
            <span>{user.fullName || user.username}</span>
            <button className="btn btn-sm btn-success" onClick={() => addMember(user.id)}>
              Přidat
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}