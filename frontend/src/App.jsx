import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import TopBar from './components/Topbar'
import Dashboard from './pages/Dashboard'
import MyTimetables from './pages/MyTimetables'
import Substitutes from './pages/Substitutes'
import Users from './pages/Users'
import Resources from './pages/Resources'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'
import AdminDashboard from './pages/AdminDashboard'
import Login from './pages/Login'

export default function App() {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check for persisted session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('tibl_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = async (email, password) => {
    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        localStorage.setItem('tibl_user', JSON.stringify(userData));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('tibl_user');
    navigate('/login');
  };

  // Protected Route Wrapper
  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return children;
  };

  // Admin Route Wrapper
  const AdminRoute = ({ children }) => {
    if (!user || user.role !== 'Admin') {
      return <Navigate to="/dashboard" replace />;
    }
    return children;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Routes>
        <Route path="/login" element={
          user ? <Navigate to={user.role === 'Admin' ? "/admin" : "/dashboard"} replace /> : <Login onLogin={handleLogin} />
        } />

        <Route path="/*" element={
          <ProtectedRoute>
            <div className="flex h-screen overflow-hidden">
              <Sidebar
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                user={user}
              />

              <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <TopBar
                  user={user}
                  onLogout={handleLogout}
                  siteName="Tibl.ai"
                  onMenuClick={() => setSidebarOpen(s => !s)}
                />

                <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
                  <Routes>
                    <Route path="/" element={<Navigate to={user?.role === 'Admin' ? "/admin" : "/dashboard"} replace />} />
                    <Route path="/admin" element={<AdminRoute><AdminDashboard user={user} /></AdminRoute>} />
                    <Route path="/dashboard" element={<Dashboard user={user} />} />
                    <Route path="/dashboard/my-timetables" element={<MyTimetables user={user} />} />
                    <Route path="/dashboard/substitutes" element={<Substitutes />} />
                    <Route path="/dashboard/calendar" element={<Resources />} />
                    <Route path="/users" element={<Users user={user} />} />
                    <Route path="/resources" element={<Resources />} />
                    <Route path="/profile" element={<Profile user={user} />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </div>
            </div>
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  )
}

