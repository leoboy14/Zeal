import React from 'react'
import { Routes, Route } from 'react-router-dom'
import AdminLayout from '../../components/admin/AdminLayout'
import DashboardPage from './DashboardPage'
import ProjectsPage from './ProjectsPage'
import ClientsPage from './ClientsPage'
import EditorsPage from './EditorsPage'
import QAFeedbackPage from './QAFeedbackPage'
import SettingsPage from './SettingsPage'
import { DashboardProvider } from '../../context/DashboardContext'

/**
 * Entire admin subtree, loaded via React.lazy from App so the dashboard
 * (and its Supabase / Radix dependencies) stays out of the public bundle.
 */
export default function AdminRoot() {
  return (
    <DashboardProvider>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="clients" element={<ClientsPage />} />
          <Route path="editors" element={<EditorsPage />} />
          <Route path="qa" element={<QAFeedbackPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </DashboardProvider>
  )
}
