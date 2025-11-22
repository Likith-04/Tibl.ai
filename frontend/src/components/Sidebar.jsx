import React from 'react'
import { NavLink } from 'react-router-dom'


function Icon({ children }) { return <span className="inline-flex w-6 h-6 items-center justify-center">{children}</span> }


export default function Sidebar({ open = false, onClose = () => {} }) {
return (
<>
{/* overlay for mobile */}
<div className={`fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />


<aside className={`bg-white h-screen border-r sidebar-width fixed md:relative z-50 transform ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} transition-transform`}>
<div className="p-4 border-b flex items-center justify-between">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded bg-indigo-600 text-white flex items-center justify-center font-semibold">VO</div>
<div>
<div className="font-semibold">Virat's Org</div>
<div className="text-xs text-gray-500">virat@gmail.com</div>
</div>
</div>


<button className="md:hidden p-2" onClick={onClose} aria-label="Close sidebar">✕</button>
</div>


<nav className="p-4 space-y-2">
<div className="text-xs text-gray-500 px-2">MAIN</div>
<NavLink to="/dashboard" className={({isActive}) => `flex items-center gap-3 p-2 rounded ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}>
<Icon><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 13h8V3H3v10zM13 21h8V11h-8v10zM13 3v8h8V3h-8zM3 21h8v-6H3v6z" stroke="#6B7280" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg></Icon>
<span>Dashboard</span>
</NavLink>


<NavLink to="/dashboard/my-timetables" className={({isActive}) => `flex items-center gap-3 p-2 rounded ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}>
<Icon><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="16" rx="2" stroke="#6B7280" strokeWidth="1.2"/></svg></Icon>
<span>My Timetables</span>
</NavLink>


<NavLink to="/substitutes" className={({isActive}) => `flex items-center gap-3 p-2 rounded ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}>
<Icon><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4 8 5.79 8 8s1.79 4 4 4zM6 20v-1a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v1" stroke="#6B7280" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg></Icon>
<span>Substitute & Leave</span>
</NavLink>


<NavLink to="/users" className={({isActive}) => `flex items-center gap-3 p-2 rounded ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}>
<Icon><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#6B7280" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="7" r="4" stroke="#6B7280" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg></Icon>
<span>Users</span>
</NavLink>


<NavLink to="/resources" className={({isActive}) => `flex items-center gap-3 p-2 rounded ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}>
<Icon><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21 16V8a2 2 0 0 0-2-2h-4l-2-2H7a2 2 0 0 0-2 2v10" stroke="#6B7280" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg></Icon>
<span>Resources</span>
</NavLink>

</nav>
</aside>
</>
)
}