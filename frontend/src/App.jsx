import React, { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import Dashboard from './pages/Dashboard'
import MyTimetables from './pages/MyTimetables'
import Substitutes from './pages/Substitutes'
import Users from './pages/Users'
import Resources from './pages/Resources'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'

export default function App() {
  const [loggedIn, setLoggedIn] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar
        loggedIn={loggedIn}
        setLoggedIn={setLoggedIn}
        siteName="Tibl.ai"
        onMenuClick={() => setSidebarOpen(s => !s)}
      />

      <div className="flex">
        {loggedIn && (
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        )}

        <main className="flex-1 p-6 md:p-8">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/my-timetables" element={<MyTimetables />} />
            <Route path="/dashboard/substitutes" element={<Substitutes />} />
            <Route path="/dashboard/calendar" element={<Resources />} /> {/* placeholder */}
            <Route path="/users" element={<Users />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
