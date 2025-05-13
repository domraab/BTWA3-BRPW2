import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage          from '../pages/LoginPage';
import RegisterPage       from '../pages/RegisterPage';
import DashboardPage      from '../pages/DashboardPage';
import ProjectsPage       from '../pages/ProjectsPage';
import ProjectDetailPage  from '../pages/ProjectDetailPage';
import CreateProjectPage  from '../pages/CreateProjectPage';
import TasksPage          from '../pages/TasksPage';
import UsersPage          from '../pages/UsersPage';
import UserEditPage       from '../pages/UserEditPage';
import SettingsPage       from '../pages/SettingsPage';
import ReportsPage        from '../pages/ReportsPage';
import NotFoundPage       from '../pages/NotFoundPage';
import Layout             from '../components/Layout/Layout';
import { isLoggedIn }     from '../services/authService';
import ManagerRoute       from './ManagerRoute';
import KanbanBoardPage    from "../pages/KanbanBoardPage";
import CreateTeamPage     from "../pages/CreateTeamPage";
import TeamPage           from "../pages/TeamPage"; // ← nově přidaný import
import TeamDetailPage     from "../pages/TeamDetailPage";

function ProtectedRoute({ children }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* veřejné stránky */}
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* chráněný layout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/create" element={
            <ManagerRoute>
              <CreateProjectPage />
            </ManagerRoute>
          }/>
          <Route path="projects/:id" element={<ProjectDetailPage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="users" element={
            <ManagerRoute>
              <UsersPage />
            </ManagerRoute>
          }/>
          <Route path="users/edit/:id" element={<UserEditPage />} />
          <Route path="reports" element={
            <ManagerRoute>
              <ReportsPage />
            </ManagerRoute>
          }/>
          <Route path="settings" element={<SettingsPage />} />
          <Route path="kanban/:projectId" element={<KanbanBoardPage />} />

          {/* nové cesty pro týmy */}
          <Route path="teams" element={
            <ManagerRoute>
              <TeamPage />
            </ManagerRoute>
          }/>
          <Route path="teams/create" element={
            <ManagerRoute>
              <CreateTeamPage />
            </ManagerRoute>
          }/>
          <Route path="teams/:id" element={
            <ManagerRoute>
              <TeamDetailPage />
            </ManagerRoute>
          }/>

          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
