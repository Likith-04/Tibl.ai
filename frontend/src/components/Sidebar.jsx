import React from 'react'
import { NavLink } from 'react-router-dom'

function Icon({ children }) {
  return <span className="inline-flex w-5 h-5 items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">{children}</span>
}

export default function Sidebar({ open = false, onClose = () => { }, user }) {
  const navLinkClass = ({ isActive }) => `
    group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm
    ${isActive
      ? 'bg-primary-50 text-primary-700 shadow-sm ring-1 ring-primary-100'
      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
    }
  `

  return (
    <>
      {/* overlay for mobile */}
      <div
        className={`fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <aside className={`bg-white h-screen border-r border-slate-100 sidebar-width fixed md:relative z-50 transform ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} transition-transform duration-300 ease-in-out flex flex-col`}>
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded-xl shadow-lg" />
          <div>
            <h1 className="font-bold text-slate-800 text-lg tracking-tight">Tibl.ai</h1>
            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Workspace</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Main</div>

          <NavLink to={user?.role === 'Admin' ? "/admin" : "/dashboard"} end className={navLinkClass}>
            <Icon><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg></Icon>
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/dashboard/my-timetables" className={navLinkClass}>
            <Icon><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg></Icon>
            <span>My Timetables</span>
          </NavLink>

          <NavLink to="/dashboard/substitutes" className={navLinkClass}>
            <Icon><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg></Icon>
            <span>Substitutes</span>
          </NavLink>

          <div className="mt-6 px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Organization</div>

          <NavLink to="/users" className={navLinkClass}>
            <Icon><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg></Icon>
            <span>Users</span>
          </NavLink>

          <NavLink to="/resources" className={navLinkClass}>
            <Icon><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg></Icon>
            <span>Resources</span>
          </NavLink>

          <NavLink to="/profile" className={navLinkClass}>
            <Icon><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></Icon>
            <span>Profile</span>
          </NavLink>

        </nav>


      </aside>
    </>
  )
}