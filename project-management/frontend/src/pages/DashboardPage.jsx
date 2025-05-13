// src/pages/DashboardPage.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser, isLoggedIn,} from "../services/authService";

function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login", { replace: true });
      return;
    }

    (async () => {
      try {
        const u = await getCurrentUser();
        if (!u || !u.role) {
          setError("Nepodařilo se načíst roli, kontaktujte administrátora.");
        } else {
          setUser(u);
        }
      } catch (e) {
        console.error(e);
        setError("Chyba při načítání profilu.");
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  if (loading) return <p>Loading…</p>;
  if (error)   return <div className="alert alert-warning">{error}</div>;

  const role = user.role; // teď už opravdu string "manager"|"developer"|"tester"

  const allBoxes = [
    { id:1, title:"Projects", icon:"fas fa-folder",   link:"/projects", roles:["manager","developer","tester"] },
    { id:2, title:"Tasks",    icon:"fas fa-tasks",    link:"/tasks",    roles:["manager","developer","tester"] },
    { id:3, title:"Reports",  icon:"fas fa-chart-bar",link:"/reports",  roles:["manager"] },
    { id:4, title:"Users",    icon:"fas fa-user",     link:"/users",    roles:["manager"] },
    { id:5, title:"Settings", icon:"fas fa-cog",      link:"/settings", roles:["manager","developer","tester"] },
    { id:6, title:"Teams", icon:"fas fa-users", link:"/teams", roles:["manager"] },
  ];

  const visible = allBoxes.filter(b => b.roles.includes(role));

  return (
    <div className="container-fluid">
      <h2>Dashboard</h2>
      <div className="row">
        {visible.map(b => (
          <div key={b.id} className="col-md-4 mb-4">
            <Link to={b.link} style={{ textDecoration:"none" }}>
              <div className="card shadow h-100 py-2">
                <div className="card-body text-center">
                  <i className={`${b.icon} fa-2x text-primary mb-3`} />
                  <h5 className="text-primary">{b.title}</h5>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashboardPage;
