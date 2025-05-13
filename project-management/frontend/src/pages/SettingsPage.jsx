// src/pages/SettingsPage.jsx
import React, { useState, useEffect } from "react";
import { getCurrentUser, updateCurrentUser } from "../services/userService";

function SettingsPage() {
  const [user,    setUser]    = useState(null);
  const [message, setMessage] = useState("");
  const [error,   setError]   = useState("");

  const [fullName, setFullName] = useState("");
  const [email,    setEmail]    = useState("");
  const [phone,    setPhone]    = useState("");

  useEffect(() => {
    (async () => {
      try {
        const u = await getCurrentUser();
        setUser(u);
        setFullName(u.fullName || "");
        setEmail(u.email || "");
        setPhone(u.phone || "");
      } catch (err) {
        console.error(err);
        setError("Nepodařilo se načíst profil uživatele.");
      }
    })();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      // Posíláme jen ta pole, která chceme upravit
      await updateCurrentUser({ fullName, email, phone });
      setMessage("Úspěšně uloženo.");
    } catch (err) {
      console.error(err);
      setError("Chyba při ukládání změn.");
    }
  };

  return (
    <div className="container-fluid">
      <h1 className="h3 mb-4 text-gray-800">Settings</h1>

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}
      {message && (
        <div className="alert alert-success">{message}</div>
      )}

      <div className="row">
        <div className="col-md-6">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">
                User Profile
              </h6>
            </div>
            <div className="card-body">
              {user && (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input
                      className="form-control"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      className="form-control"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Phone</label>
                    <input
                      className="form-control"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Save changes
                  </button>
                </form>
              )}
              {!user && !error && <p>Loading…</p>}
            </div>
          </div>
        </div>

        {/* Zbytek stránky se může nechat beze změn */}
        <div className="col-md-6">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">Security</h6>
            </div>
            <div className="card-body">
              <p>Change Password</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
